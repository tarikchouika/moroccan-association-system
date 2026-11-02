package ma.mamp.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

/**
 * النشاط الرئيسي لتطبيق MAMP — بدون أي اعتماديات خارجية (صفر مكتبات)
 * غلاف ويب رسمي للمنصة مع:
 *   • وضع الانغماس الكامل: ملء الشاشة 100% وإخفاء شريطي النظام العلوي والسفلي
 *     (يظهران مؤقتاً بالسحب من الأعلى/الأسفل — IMMERSIVE STICKY)
 *   • تهيئة مثالية للهواتف واللوح على حد سواء (ملء كامل للأبعاد)
 *   • لوحة المفاتيح لا تغطي حقل الكتابة (حشوة ديناميكية حسب IME)
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
    private static final String PREFS_NAME = "mamp_prefs";
    private static final String KEY_LAST_VERSION = "last_version_code";

    /** ألوان الهوية الرسمية للوغو المنصة */
    private static final String COLOR_NAVY = "#0a1128";   // كحلي الخلفية
    private static final String COLOR_LIGHT = "#f6fafe";  // خلفية الصفحات الفاتحة

    private WebView webView;
    private FrameLayout root;
    private float touchDownY = -1f;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        root = new FrameLayout(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);

        applyImmersiveMode();
        applyKeyboardInsets();
        // تنظيف الذاكرة المؤقتة عند تحديث التطبيق لإصدار جديد — يمنع بقاء نسخة
        // قديمة من الواجهة عالقة في WebView بعد نشر تحديث للمنصة
        purgeCacheOnUpgrade();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setSupportZoom(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        // ملء عرض الشاشة على الجوال واللوح دون تكبير اصطناعي
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        webView.setBackgroundColor(Color.parseColor(COLOR_LIGHT));
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

    /**
     * عند ترقية التطبيق (versionCode جديد): تُفرّغ الذاكرة المؤقتة وبيانات
     * النماذج المرتبطة بالنسخ السابقة — يضمن وصول كل تحديث للمنصة فوراً
     * دون صفحات أو أصول عالقة من إصدار سابق.
     */
    private void purgeCacheOnUpgrade() {
        try {
            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            int current = getVersionCode();
            int last = prefs.getInt(KEY_LAST_VERSION, -1);
            if (last != -1 && last != current) {
                webView.clearCache(true);
                webView.clearFormData();
            }
            if (last != current) {
                prefs.edit().putInt(KEY_LAST_VERSION, current).apply();
            }
        } catch (Exception ignored) {
            // التنظيف تحسين لا يوقف التشغيل
        }
    }

    private int getVersionCode() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionCode;
        } catch (Exception e) {
            return -1;
        }
    }

    /**
     * وضع الانغماس الكامل (Immersive Sticky):
     * المحتوى يملأ الشاشة 100%، وشريطا النظام مخفيان ويظهران مؤقتاً
     * بالسحب من الحافة العلوية أو السفلية ثم يختفيان تلقائياً.
     */
    private void applyImmersiveMode() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setStatusBarColor(Color.TRANSPARENT);
            getWindow().setNavigationBarColor(Color.TRANSPARENT);
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.systemBars());
                // السحب من الحواف يظهر الشريطين مؤقتاً (شفافان فوق المحتوى)
                c.setSystemBarsBehavior(
                        WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                // أيقونات فاتحة على الخلفية الكحلية
                c.setSystemBarsAppearance(0, WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS);
                c.setSystemBarsAppearance(0, WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
            }
        } else {
            getWindow().setStatusBarColor(Color.parseColor(COLOR_NAVY));
            getWindow().setNavigationBarColor(Color.parseColor(COLOR_NAVY));
            View decor = getWindow().getDecorView();
            decor.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
    }

    /**
     * لوحة المفاتيح: على أندرويد 11+ تُعالَج الحشوة يدوياً كي لا يبقى حقل
     * الكتابة (مثل المساعد الجمعوي) مخفياً خلف IME مع تفعيل ملء الشاشة.
     */
    private void applyKeyboardInsets() {
        if (Build.VERSION.SDK_INT >= 30) {
            root.setOnApplyWindowInsetsListener((v, insets) -> {
                Insets ime = insets.getInsets(WindowInsets.Type.ime());
                v.setPadding(0, 0, 0, ime.bottom);
                return insets;
            });
        } else {
            getWindow().setSoftInputMode(
                    android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        }
    }

    /** إعادة تفعيل الانغماس بعد كل استعادة لتركيز النافذة (بعد ظهور الأشرطة) */
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyImmersiveMode();
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
