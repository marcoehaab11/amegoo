package com.marcoehaab11.amegoo;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import androidx.core.splashscreen.SplashScreen;
import android.os.SystemClock;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen splash = SplashScreen.installSplashScreen(this);
        final long launchedAt = SystemClock.uptimeMillis();
        registerPlugin(DailyVersePlugin.class);
        registerPlugin(JourneyReminderPlugin.class);
        super.onCreate(savedInstanceState);
        splash.setKeepOnScreenCondition(() -> {
            long elapsed = SystemClock.uptimeMillis() - launchedAt;
            return elapsed < 3000 && (getBridge() != null && getBridge().getWebView() != null
                && getBridge().getWebView().getProgress() < 100);
        });
        EdgeToEdge.enable(this);
    }
}
