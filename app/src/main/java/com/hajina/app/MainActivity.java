package com.hajina.app;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.GetCredentialException;

import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    // عنوان التطبيق على GitHub Pages
    static final String APP_URL = "https://hassean1999.github.io/hajina/";
    // Web client ID من google-services.json (client_type 3)
    static final String WEB_CLIENT_ID = "615591936540-6q7ff486oho2mmdf34on22nbe5lfopbf.apps.googleusercontent.com";
    static final int REQ_MIC = 7;
    static final int REQ_FILE = 8;
    private ValueCallback<Uri[]> fileCb;

    private WebView web;
    private PermissionRequest pendingPerm;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        web.setBackgroundColor(0xFF140A04);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        s.setUserAgentString(s.getUserAgentString() + " HajinaApp/3");
        web.addJavascriptInterface(new Bridge(), "HajinaNative");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                String h = u.getHost() == null ? "" : u.getHost();
                if (h.endsWith("github.io") || h.endsWith("firebaseapp.com") || h.endsWith("google.com") || h.endsWith("gstatic.com") || "file".equals(u.getScheme())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception e) { }
                return true;
            }
            @Override
            public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
                if (r.isForMainFrame()) v.loadUrl("file:///android_asset/offline.html");
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams params) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                try {
                    Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("image/*");
                    startActivityForResult(Intent.createChooser(i, "اختار صورة"), REQ_FILE);
                } catch (Exception e) { fileCb = null; return false; }
                return true;
            }
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    if (hasMic()) request.grant(request.getResources());
                    else { pendingPerm = request; askMic(); }
                });
            }
        });
        setContentView(web);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(APP_URL);
        if (!hasMic()) askMic();
    }

    boolean hasMic() {
        return Build.VERSION.SDK_INT < 23 || checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
    }

    void askMic() {
        if (Build.VERSION.SDK_INT >= 23) requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] res) {
        super.onRequestPermissionsResult(code, perms, res);
        if (code == REQ_MIC && pendingPerm != null) {
            if (res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED) pendingPerm.grant(pendingPerm.getResources());
            else pendingPerm.deny();
            pendingPerm = null;
        }
    }

    void js(final String code) { runOnUiThread(() -> web.evaluateJavascript(code, null)); }

    static String q(String s) { return "'" + (s == null ? "" : s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")) + "'"; }

    class Bridge {
        @JavascriptInterface
        public void googleSignIn() { runOnUiThread(MainActivity.this::startGoogle); }

        @JavascriptInterface
        public void ensureMic() { runOnUiThread(() -> { if (!hasMic()) askMic(); }); }

        @JavascriptInterface
        public void reload() { runOnUiThread(() -> web.loadUrl(APP_URL)); }
    }

    void startGoogle() {
        try {
            CredentialManager cm = CredentialManager.create(this);
            GetSignInWithGoogleOption opt = new GetSignInWithGoogleOption.Builder(WEB_CLIENT_ID).build();
            GetCredentialRequest req = new GetCredentialRequest.Builder().addCredentialOption(opt).build();
            cm.getCredentialAsync(this, req, new CancellationSignal(), Executors.newSingleThreadExecutor(),
                new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                    @Override
                    public void onResult(GetCredentialResponse result) {
                        Credential c = result.getCredential();
                        if (c instanceof CustomCredential && GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(c.getType())) {
                            try {
                                String tok = GoogleIdTokenCredential.createFrom(((CustomCredential) c).getData()).getIdToken();
                                js("window.onNativeGoogleToken && onNativeGoogleToken(" + q(tok) + ")");
                            } catch (Exception e) { js("window.onNativeGoogleError && onNativeGoogleError(" + q(e.getMessage()) + ")"); }
                        } else js("window.onNativeGoogleError && onNativeGoogleError('نوع حساب غير مدعوم')");
                    }
                    @Override
                    public void onError(GetCredentialException e) {
                        js("window.onNativeGoogleError && onNativeGoogleError(" + q(e.getClass().getSimpleName().contains("Cancel") ? "" : e.getMessage()) + ")");
                    }
                });
        } catch (Exception e) {
            js("window.onNativeGoogleError && onNativeGoogleError(" + q(e.getMessage()) + ")");
        }
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        if (code == REQ_FILE && fileCb != null) {
            Uri[] res = null;
            if (result == RESULT_OK && data != null && data.getData() != null) res = new Uri[]{data.getData()};
            fileCb.onReceiveValue(res);
            fileCb = null;
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); web.saveState(out); }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("(window.hajinaBack?hajinaBack():'exit')", v -> {
            if (v == null || v.contains("exit")) moveTaskToBack(true);
        });
    }
}
