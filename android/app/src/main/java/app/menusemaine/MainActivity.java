package app.menusemaine;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

/** Coque native : affiche l'app web embarquée dans les assets, sans réseau. */
public class MainActivity extends Activity {
    private static final String APP_HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + APP_HOST + "/assets/index.html";
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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

        // Sert les fichiers de assets/ sous une origine https : localStorage et presse-papiers fonctionnent.
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
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
}
