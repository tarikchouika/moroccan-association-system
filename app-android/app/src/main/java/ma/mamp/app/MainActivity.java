package ma.mamp.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.MotionEvent;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

/**
 * النشاط الرئيسي لتطبيق منصة مامب — بدون أي اعتماديات خارجية (صفر مكتبات)
 * غلاف ويب رسمي للمنصة مع:
 *   • فتح الروابط الخارجية في المتصفح
 *   • السحب للأسفل من أعلى الصفحة = تحديث
 *   • صفحة عدم الاتصال بالشبكة (عربية)
 *   • دعم زر الرجوع وتدوير الشاشة دون فقدان الحالة
 */
public class MainActivity extends Activity {

    private static final String HOME_URL = "https://mamp.pages.dev/";
    private static final String OFFLINE_URL = "file:///android_asset/offline.html";
    private static final String ALLOWED_HOST = "mamp.pages.dev";
    private static final int REFRESH_SWIPE_PX = 260;

    private WebView webView;
    private float touchDownY = -1f;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        FrameLayout root = new FrameLayout(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);

        getWindow().setStatusBarColor(Color.parseColor("#0b1410"));
        getWindow().setNavigationBarColor(Color.parseColor("#0b1410"));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setSupportZoom(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setBackgroundColor(Color.parseColor("#faf9f5"));
        webView.setVerticalScrollBarEnabled(false);

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
                // لا شيء إضافي بعد اكتمال التحميل
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
        webView.setDownloadListener(new android.webkit.DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition,
                                        String mimeType, long contentLength) {
                openExternally(Uri.parse(url));
            }
        });

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(HOME_URL);
        }
    }

    /** السحب للأسفل من أعلى الصفحة = تحديث (بديل خفيف عن SwipeRefreshLayout) */
    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (webView != null) {
            switch (ev.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    touchDownY = ev.getY();
                    break;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_CANCEL:
                    if (touchDownY >= 0
                            && webView.getScrollY() == 0
                            && ev.getY() - touchDownY > REFRESH_SWIPE_PX) {
                        Toast t = Toast.makeText(this, "جارٍ التحديث…", Toast.LENGTH_SHORT);
                        t.setGravity(Gravity.TOP | Gravity.CENTER_HORIZONTAL, 0, 48);
                        t.show();
                        String current = webView.getUrl();
                        if (current != null && current.startsWith("file://")) {
                            webView.loadUrl(HOME_URL);
                        } else {
                            webView.reload();
                        }
                    }
                    touchDownY = -1f;
                    break;
            }
        }
        return super.dispatchTouchEvent(ev);
    }

    private boolean isMainFrameError(int errorCode) {
        return errorCode == WebViewClient.ERROR_HOST_LOOKUP
                || errorCode == WebViewClient.ERROR_CONNECT
                || errorCode == WebViewClient.ERROR_TIMEOUT
                || errorCode == WebViewClient.ERROR_IO
                || errorCode == WebViewClient.ERROR_UNKNOWN;
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
