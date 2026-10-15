package com.marcoehaab11.amegoo;

import android.Manifest;
import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import org.json.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.TimeZone;
import java.util.Calendar;

public class DailyVerseReceiver extends BroadcastReceiver {
    static final String CHANNEL = "daily_verse", ACTION = "com.amegoo.talkha.DAILY_VERSE";
    static SharedPreferences prefs(Context c) { return c.getSharedPreferences("daily_verse", Context.MODE_PRIVATE); }
    static boolean allowed(Context c) {
        if ((Build.VERSION.SDK_INT >= 33 && c.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
            || !NotificationManagerCompat.from(c).areNotificationsEnabled()) return false;
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = c.getSystemService(NotificationManager.class).getNotificationChannel(CHANNEL);
            if (channel != null && channel.getImportance() == NotificationManager.IMPORTANCE_NONE) return false;
        }
        return true;
    }
    static JSONObject verse(Context c) throws Exception {
        try (InputStream in = c.getAssets().open("public/assets/data/daily-verses.json")) {
            ByteArrayOutputStream out = new ByteArrayOutputStream(); byte[] b = new byte[4096]; int n;
            while ((n = in.read(b)) != -1) out.write(b, 0, n);
            JSONArray verses = new JSONArray(out.toString(StandardCharsets.UTF_8.name()));
            Calendar local = Calendar.getInstance(), day = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
            day.clear(); day.set(local.get(Calendar.YEAR), local.get(Calendar.MONTH), local.get(Calendar.DAY_OF_MONTH));
            return verses.getJSONObject((int)Math.floorMod(day.getTimeInMillis() / 86400000L, verses.length()));
        }
    }
    static void schedule(Context c) {
        AlarmManager alarms = (AlarmManager)c.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pending = PendingIntent.getBroadcast(c, 701, new Intent(c, DailyVerseReceiver.class).setAction(ACTION), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        alarms.cancel(pending);
        SharedPreferences p = prefs(c);
        if (!p.getBoolean("enabled", false) || !allowed(c)) return;
        Calendar next = Calendar.getInstance(); next.set(Calendar.HOUR_OF_DAY, p.getInt("hour", 9)); next.set(Calendar.MINUTE, p.getInt("minute", 0)); next.set(Calendar.SECOND, 0); next.set(Calendar.MILLISECOND, 0);
        if (next.getTimeInMillis() <= System.currentTimeMillis()) next.add(Calendar.DATE, 1);
        alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next.getTimeInMillis(), pending);
    }
    static void show(Context c, boolean test) throws Exception {
        if (!allowed(c)) return;
        JSONObject v = verse(c);
        NotificationManager manager = c.getSystemService(NotificationManager.class);
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = new NotificationChannel(CHANNEL, "آية كل يوم", NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription("آية يومية من الكتاب المقدس في الوقت الذي تختاره"); manager.createNotificationChannel(channel);
        }
        Intent open = new Intent(c, MainActivity.class).setAction("com.amegoo.talkha.OPEN_VERSE").putExtra("dailyVerse", v.toString()).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent tap = PendingIntent.getActivity(c, test ? 703 : 702, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        String text = v.getString("text");
        NotificationManagerCompat.from(c).notify(test ? 703 : 702, new NotificationCompat.Builder(c, CHANNEL)
            .setSmallIcon(R.drawable.ic_notification_book).setColor(0xFFD4AF37).setContentTitle((test ? "إشعار تجريبي · " : "آية اليوم · ") + v.getString("reference"))
            .setContentText(text).setStyle(new NotificationCompat.BigTextStyle().bigText(text)).setContentIntent(tap).setAutoCancel(true).build());
    }
    @Override public void onReceive(Context context, Intent intent) {
        if (ACTION.equals(intent.getAction()) && prefs(context).getBoolean("enabled", false)) {
            String today = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new java.util.Date());
            if (!today.equals(prefs(context).getString("lastDay", ""))) {
                try { if (allowed(context)) { show(context, false); prefs(context).edit().putString("lastDay", today).apply(); } } catch (Exception e) { android.util.Log.e("DailyVerse", "Unable to read local verse", e); }
            }
        }
        schedule(context);
    }
}
