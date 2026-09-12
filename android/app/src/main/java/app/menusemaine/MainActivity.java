package app.menusemaine;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.webkit.WebViewAssetLoader;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * Coque native : affiche l'app web embarquée, hors ligne.
 * Au démarrage, elle vérifie sur GitHub si les fichiers web ont changé (version.json) et les télécharge
 * dans le stockage privé : les recettes se mettent à jour sans réinstaller l'APK.
 * Une fois par jour, elle vérifie aussi s'il existe un APK plus récent (Releases) et propose de le télécharger.
 */
public class MainActivity extends Activity {
    private static final String APP_HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + APP_HOST + "/assets/index.html";
    private static final String RAW_BASE = "https://raw.githubusercontent.com/Sanglon-Amine/Recettes/main/";
    private static final String RELEASES_API = "https://api.github.com/repos/Sanglon-Amine/Recettes/releases/latest";
    private static final long APK_CHECK_INTERVAL_MS = 24L * 60 * 60 * 1000;

    private WebView webView;
    private SharedPreferences prefs;
    private File webDir;          // fichiers web téléchargés (prioritaires sur ceux de l'APK)
    private int embeddedVersion;  // version des fichiers embarqués dans l'APK

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences("menu", MODE_PRIVATE);
        webDir = new File(getFilesDir(), "web");
        embeddedVersion = parseVersion(readAsset("version.json"));
        // Un APK fraîchement installé peut être plus récent que les fichiers téléchargés : on repart de l'APK.
        if (prefs.getInt("web_version", 0) <= embeddedVersion) {
            deleteRecursive(webDir);
            prefs.edit().remove("web_version").apply();
        }

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#F2F3EE"));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);   // localStorage : la semaine et les cases cochées
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportZoom(false);
        settings.setTextZoom(100);

        // Sert les fichiers sous une origine https ; ceux téléchargés passent avant ceux de l'APK.
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new LocalFirstHandler(webDir, new WebViewAssetLoader.AssetsPathHandler(this)))
                .build();

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (APP_HOST.equals(request.getUrl().getHost())) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, request.getUrl()));
                return true;
            }
        });

        if (savedInstanceState != null) webView.restoreState(savedInstanceState);
        else webView.loadUrl(START_URL);

        checkWebUpdate();
        checkApkUpdate();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    public void onBackPressed() {
        // Bouton Retour : ferme la fiche recette si elle est ouverte, sinon quitte l'app.
        webView.evaluateJavascript(
                "(function(){var b=document.querySelector('.sheet-backdrop');if(b){b.click();return true;}return false;})()",
                value -> { if (!"true".equals(value)) MainActivity.super.onBackPressed(); });
    }

    /* ---------- Mise à jour des fichiers web (sans réinstaller) ---------- */

    private int currentWebVersion() {
        return Math.max(embeddedVersion, prefs.getInt("web_version", 0));
    }

    private void checkWebUpdate() {
        new Thread(() -> {
            File tmp = new File(getFilesDir(), "web-new");
            try {
                String json = fetchText(RAW_BASE + "version.json");
                JSONObject manifest = new JSONObject(json);
                final int remote = manifest.getInt("version");
                if (remote <= currentWebVersion()) return;

                JSONArray files = manifest.getJSONArray("files");
                deleteRecursive(tmp);
                if (!tmp.mkdirs()) throw new IOException("mkdirs");
                for (int i = 0; i < files.length(); i++) {
                    String name = files.getString(i);
                    downloadTo(RAW_BASE + name, new File(tmp, name));
                }
                writeText(new File(tmp, "version.json"), json);

                deleteRecursive(webDir);
                if (!tmp.renameTo(webDir)) throw new IOException("rename");
                prefs.edit().putInt("web_version", remote).apply();

                runOnUiThread(() -> {
                    if (isFinishing() || isDestroyed()) return;
                    webView.clearCache(true);
                    webView.reload();
                    Toast.makeText(this, "Recettes mises à jour (v" + remote + ")", Toast.LENGTH_SHORT).show();
                });
            } catch (Exception e) {
                deleteRecursive(tmp);  // hors ligne ou téléchargement incomplet : on garde la version actuelle
            }
        }).start();
    }

    /* ---------- Nouvelle version de l'APK (proposée, jamais installée seule) ---------- */

    private void checkApkUpdate() {
        long last = prefs.getLong("apk_check", 0);
        if (System.currentTimeMillis() - last < APK_CHECK_INTERVAL_MS) return;
        new Thread(() -> {
            try {
                JSONObject release = new JSONObject(fetchText(RELEASES_API));
                prefs.edit().putLong("apk_check", System.currentTimeMillis()).apply();
                final int build = Integer.parseInt(release.getString("tag_name").replaceAll("\\D", ""));
                if (build <= BuildConfig.VERSION_CODE) return;
                JSONArray assets = release.getJSONArray("assets");
                if (assets.length() == 0) return;
                final String url = assets.getJSONObject(0).getString("browser_download_url");
                runOnUiThread(() -> {
                    if (isFinishing() || isDestroyed()) return;
                    new AlertDialog.Builder(this)
                            .setTitle("Nouvelle version")
                            .setMessage("Une nouvelle version de l'application est disponible (build " + build
                                    + "). La télécharger ? Il suffira ensuite d'ouvrir le fichier pour l'installer.")
                            .setPositiveButton("Télécharger", (d, w) -> startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))))
                            .setNegativeButton("Plus tard", null)
                            .show();
                });
            } catch (Exception e) {
                // pas de réseau, quota API… : on réessaiera demain
            }
        }).start();
    }

    /* ---------- Outils ---------- */

    /** Sert d'abord les fichiers téléchargés, sinon ceux embarqués dans l'APK. */
    private static class LocalFirstHandler implements WebViewAssetLoader.PathHandler {
        private final File dir;
        private final WebViewAssetLoader.AssetsPathHandler assets;

        LocalFirstHandler(File dir, WebViewAssetLoader.AssetsPathHandler assets) {
            this.dir = dir;
            this.assets = assets;
        }

        @Nullable
        @Override
        public WebResourceResponse handle(@NonNull String path) {
            File f = new File(dir, path);
            if (dir.isDirectory() && f.isFile() && !path.contains("..")) {
                try {
                    return new WebResourceResponse(mimeOf(path), "UTF-8", new FileInputStream(f));
                } catch (IOException ignored) { /* on retombe sur l'APK */ }
            }
            return assets.handle(path);
        }
    }

    private static String mimeOf(String path) {
        String p = path.toLowerCase();
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".js")) return "text/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".json")) return "application/json";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }

    private static int parseVersion(String json) {
        try { return new JSONObject(json).optInt("version", 0); } catch (Exception e) { return 0; }
    }

    private String readAsset(String name) {
        try (InputStream in = getAssets().open(name)) {
            return new String(readAll(in), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "";
        }
    }

    private static HttpURLConnection open(String url) throws IOException {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(10000);
        c.setReadTimeout(15000);
        c.setRequestProperty("User-Agent", "MenuSemaine");
        c.setRequestProperty("Cache-Control", "no-cache");
        return c;
    }

    private static String fetchText(String url) throws IOException {
        HttpURLConnection c = open(url);
        try {
            if (c.getResponseCode() != 200) throw new IOException("HTTP " + c.getResponseCode());
            try (InputStream in = c.getInputStream()) {
                return new String(readAll(in), StandardCharsets.UTF_8);
            }
        } finally {
            c.disconnect();
        }
    }

    private static void downloadTo(String url, File dest) throws IOException {
        HttpURLConnection c = open(url);
        try {
            if (c.getResponseCode() != 200) throw new IOException("HTTP " + c.getResponseCode());
            try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(dest)) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            }
        } finally {
            c.disconnect();
        }
    }

    private static void writeText(File f, String text) throws IOException {
        try (OutputStream out = new FileOutputStream(f)) {
            out.write(text.getBytes(StandardCharsets.UTF_8));
        }
    }

    private static byte[] readAll(InputStream in) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        int n;
        while ((n = in.read(buf)) > 0) bos.write(buf, 0, n);
        return bos.toByteArray();
    }

    private static void deleteRecursive(File f) {
        if (f == null || !f.exists()) return;
        File[] children = f.listFiles();
        if (children != null) for (File c : children) deleteRecursive(c);
        //noinspection ResultOfMethodCallIgnored
        f.delete();
    }
}
