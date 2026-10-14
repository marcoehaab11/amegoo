package com.marcoehaab11.amegoo;

import android.Manifest;
import android.content.Intent;
import android.os.Build;
import com.getcapacitor.*;
import com.getcapacitor.annotation.*;

@CapacitorPlugin(name = "DailyVerse", permissions = {@Permission(alias = "notifications", strings = {Manifest.permission.POST_NOTIFICATIONS})})
public class DailyVersePlugin extends Plugin {
    @Override public void load() { DailyVerseReceiver.schedule(getContext()); }
    @PluginMethod public void status(PluginCall call) {
        DailyVerseReceiver.schedule(getContext());
        JSObject result = new JSObject();
        result.put("enabled", DailyVerseReceiver.prefs(getContext()).getBoolean("enabled", false));
        result.put("hour", DailyVerseReceiver.prefs(getContext()).getInt("hour", 9)); result.put("minute", DailyVerseReceiver.prefs(getContext()).getInt("minute", 0));
        result.put("allowed", DailyVerseReceiver.allowed(getContext()));
        try { result.put("verse", DailyVerseReceiver.verse(getContext())); } catch (Exception e) { call.reject("تعذر قراءة الآية", e); return; }
        call.resolve(result);
    }
    @PluginMethod public void configure(PluginCall call) {
        int hour = call.getInt("hour", 9), minute = call.getInt("minute", 0);
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) { call.reject("وقت غير صحيح"); return; }
        if (call.getBoolean("enabled", false) && Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") != PermissionState.GRANTED) {
            requestPermissionForAlias("notifications", call, "permissionResult"); return;
        }
        apply(call);
    }
    @PermissionCallback private void permissionResult(PluginCall call) { apply(call); }
    private void apply(PluginCall call) {
        boolean enabled = call.getBoolean("enabled", false);
        if (enabled && !DailyVerseReceiver.allowed(getContext())) { call.reject("اسمح بالإشعارات من إعدادات الهاتف لتفعيل الآية اليومية"); return; }
        DailyVerseReceiver.prefs(getContext()).edit().putBoolean("enabled", enabled).putInt("hour", call.getInt("hour", 9)).putInt("minute", call.getInt("minute", 0)).apply();
        DailyVerseReceiver.schedule(getContext()); status(call);
    }
    @PluginMethod public void test(PluginCall call) {
        if (!DailyVerseReceiver.allowed(getContext())) { call.reject("فعّل إذن الإشعارات أولًا"); return; }
        try { DailyVerseReceiver.show(getContext(), true); call.resolve(); } catch (Exception e) { call.reject("تعذر عرض الإشعار", e); }
    }
    @PluginMethod public void launchVerse(PluginCall call) {
        JSObject result = new JSObject(); String value = getActivity().getIntent().getStringExtra("dailyVerse");
        getActivity().getIntent().removeExtra("dailyVerse"); result.put("verse", value); call.resolve(result);
    }
    @Override protected void handleOnNewIntent(Intent intent) {
        String verse = intent.getStringExtra("dailyVerse");
        if (verse != null) { JSObject result = new JSObject(); result.put("verse", verse); notifyListeners("verseTapped", result, true); intent.removeExtra("dailyVerse"); }
    }
}
