package com.marcoehaab11.amegoo;
import android.app.*;
import android.content.*;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import java.util.Calendar;

public class JourneyReminderReceiver extends BroadcastReceiver {
    static final String PREFIX="com.amegoo.talkha.JOURNEY_",CHANNEL="journey_reminders";
    static boolean valid(String kind){return "reading".equals(kind)||"prayer".equals(kind);}
    static SharedPreferences prefs(Context c,String kind){return c.getSharedPreferences("journey_"+kind,Context.MODE_PRIVATE);}
    static int id(String kind){return "reading".equals(kind)?810:820;}
    static boolean allowed(Context c){
        if((Build.VERSION.SDK_INT>=33&&c.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)!=android.content.pm.PackageManager.PERMISSION_GRANTED)||!NotificationManagerCompat.from(c).areNotificationsEnabled())return false;
        if(Build.VERSION.SDK_INT>=26){NotificationChannel channel=c.getSystemService(NotificationManager.class).getNotificationChannel(CHANNEL);if(channel!=null&&channel.getImportance()==NotificationManager.IMPORTANCE_NONE)return false;}return true;
    }
    static void scheduleAll(Context c){schedule(c,"reading");schedule(c,"prayer");}
    static void schedule(Context c,String kind){
        AlarmManager alarms=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);
        PendingIntent alarm=PendingIntent.getBroadcast(c,id(kind),new Intent(c,JourneyReminderReceiver.class).setAction(PREFIX+kind),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);alarms.cancel(alarm);
        SharedPreferences p=prefs(c,kind);if(!p.getBoolean("enabled",false)||!allowed(c))return;
        Calendar next=Calendar.getInstance();next.set(Calendar.HOUR_OF_DAY,p.getInt("hour",kind.equals("reading")?20:7));next.set(Calendar.MINUTE,p.getInt("minute",0));next.set(Calendar.SECOND,0);next.set(Calendar.MILLISECOND,0);if(next.getTimeInMillis()<=System.currentTimeMillis())next.add(Calendar.DATE,1);
        alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,next.getTimeInMillis(),alarm);
    }
    @Override public void onReceive(Context c,Intent intent){
        String action=intent.getAction(),kind=action!=null&&action.startsWith(PREFIX)?action.substring(PREFIX.length()):null;
        if(valid(kind)&&prefs(c,kind).getBoolean("enabled",false)&&allowed(c)){
            Calendar date=Calendar.getInstance();String today=date.get(Calendar.YEAR)+"-"+date.get(Calendar.MONTH)+"-"+date.get(Calendar.DAY_OF_MONTH);
            if(!today.equals(prefs(c,kind).getString("lastDay",""))){
                NotificationManager manager=c.getSystemService(NotificationManager.class);if(Build.VERSION.SDK_INT>=26)manager.createNotificationChannel(new NotificationChannel(CHANNEL,"تذكير القراءة والصلاة",NotificationManager.IMPORTANCE_DEFAULT));
                Intent open=new Intent(c,MainActivity.class).setAction(PREFIX+"OPEN_"+kind).putExtra("journeyKind",kind).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP);
                PendingIntent tap=PendingIntent.getActivity(c,id(kind)+1,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
                NotificationManagerCompat.from(c).notify(id(kind),new NotificationCompat.Builder(c,CHANNEL).setSmallIcon(R.drawable.ic_notification_book).setColor(0xFFD4AF37).setContentTitle(kind.equals("reading")?"وقت رحلتك مع الكتاب":"وقت الصلاة").setContentText(kind.equals("reading")?"خطوة صغيرة كل يوم. افتح قراءة اليوم وتابع من مكانك.":"خصص وقتًا هادئًا للصلاة. افتح صلاتك اليومية.").setContentIntent(tap).setAutoCancel(true).build());prefs(c,kind).edit().putString("lastDay",today).apply();
            }
        }if(valid(kind))schedule(c,kind);else scheduleAll(c);
    }
}
