package ma.mamp.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

/**
 * النشاط الرئيسي لتطبيق منصة مامب
 * — غلاف ويب رسمي للمنصة مع:
 *   • فتح الروابط الخارجية في المتصفح
 *   • السحب للتحديث
 *   • صفحة عدم الاتصال بالشبكة (عربية)
 *   • دعم زر الرجوع وتدوير الشاشة دون فقدان الحالة
 */
public class MainActivity extends AppCompatActivity {

    private static final String HOME_URL = "https://mamp.pages.dev/";
    private static final String OFFLINE_URL = "file:///android_asset/offline.html";
    private static final String ALLOWED_HOST = "mamp.pages.dev";

    private WebView webView;
    private SwipeRefreshLayout refreshLayout;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        refreshLayout = new SwipeRefreshLayout(this);
        refreshLayout.setColorSchemeColors(Color.parseColor("#0d6b4f"), Color.parseColor("#c9a227"));

        webView = new WebView(this);
        refreshLayout.addView(webView,
                new SwipeRefreshLayout.LayoutParams(
                        SwipeRefreshLayout.LayoutParams.MATCH_PARENT,
                        SwipeRefreshLayout.LayoutParams.MATCH_PARENT));

        setContentView(refreshLayout);
        getWindow().setStatusBarColor(Color.parseColor("#0b1410"));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setSupportZoom(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setBackgroundColor(Color.parseColor("#faf9f5"));

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                String host = url.getHost() == null ? "" : url.getHost();
                // روابط المنصة تبقى داخل التطبيق؛ ما عداها يفتح في المتصفح
                if (host.equals(ALLOWED_HOST) || host.endsWith("." + ALLOWED_HOST)) {
                    return false;
                }
                openExternally(url);
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                refreshLayout.setRefreshing(false);
            }

            @SuppressWarnings("deprecation")
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                if (isMainFrameError(errorCode)) {
                    webView.loadUrl(OFFLINE_URL);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    webView.loadUrl(OFFLINE_URL);
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient());

        // تحميل الملفات (مثل APK) يفتح في المتصفح النظامي
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) ->
                openExternally(Uri.parse(url)));

        refreshLayout.setOnRefreshListener(() -> {
            String current = webView.getUrl();
            if (current != null && current.startsWith("file://")) {
                webView.loadUrl(HOME_URL);
            } else {
                webView.reload();
            }
        });

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(HOME_URL);
        }

        // إخفاء شريط التمرير عند عدم الحاجة
        webView.setVerticalScrollBarEnabled(false);
    }

    private boolean isMainFrameError(int errorCode) {
        return errorCode == ERROR_HOST_LOOKUP
                || errorCode == ERROR_CONNECT
                || errorCode == ERROR_TIMEOUT
                || errorCode == ERROR_NETWORK;
    }

    private void openExternally(Uri url) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, url));
        } catch (Exception ignored) {
            // لا يوجد تطبيق يستطيع فتح الرابط
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            String current = webView.getUrl();
            if (current != null && current.startsWith("file://")) {
                webView.loadUrl(HOME_URL);
            } else {
                webView.goBack();
            }
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }
}
