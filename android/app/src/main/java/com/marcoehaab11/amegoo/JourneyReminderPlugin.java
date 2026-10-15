package com.marcoehaab11.amegoo;
import android.Manifest;
import android.content.Intent;
import android.os.Build;
import com.getcapacitor.*;
import com.getcapacitor.annotation.*;

@CapacitorPlugin(name="JourneyReminder",permissions={@Permission(alias="notifications",strings={Manifest.permission.POST_NOTIFICATIONS})})
public class JourneyReminderPlugin extends Plugin {
    @Override public void load(){ JourneyReminderReceiver.scheduleAll(getContext()); }
    @PluginMethod public void status(PluginCall call){
        String kind=call.getString("kind","reading");if(!JourneyReminderReceiver.valid(kind)){call.reject("هدف غير صحيح");return;}
        android.content.SharedPreferences p=JourneyReminderReceiver.prefs(getContext(),kind);
        JSObject result=new JSObject();result.put("enabled",p.getBoolean("enabled",false));result.put("hour",p.getInt("hour",kind.equals("reading")?20:7));result.put("minute",p.getInt("minute",0));call.resolve(result);
    }
    @PluginMethod public void configure(PluginCall call){
        String kind=call.getString("kind","reading");int hour=call.getInt("hour",20),minute=call.getInt("minute",0);
        if(!JourneyReminderReceiver.valid(kind)||hour<0||hour>23||minute<0||minute>59){call.reject("وقت أو هدف غير صحيح");return;}
        if(call.getBoolean("enabled",false)&&Build.VERSION.SDK_INT>=33&&getPermissionState("notifications")!=PermissionState.GRANTED){requestPermissionForAlias("notifications",call,"permissionResult");return;}apply(call);
    }
    @PermissionCallback private void permissionResult(PluginCall call){apply(call);}
    private void apply(PluginCall call){
        if(call.getBoolean("enabled",false)&&!JourneyReminderReceiver.allowed(getContext())){call.reject("اسمح بإشعارات التطبيق من إعدادات الهاتف أولًا");return;}
        String kind=call.getString("kind","reading");JourneyReminderReceiver.prefs(getContext(),kind).edit().putBoolean("enabled",call.getBoolean("enabled",false)).putInt("hour",call.getInt("hour",20)).putInt("minute",call.getInt("minute",0)).apply();JourneyReminderReceiver.schedule(getContext(),kind);status(call);
    }
    @PluginMethod public void launchTarget(PluginCall call){JSObject result=new JSObject();result.put("kind",getActivity().getIntent().getStringExtra("journeyKind"));getActivity().getIntent().removeExtra("journeyKind");call.resolve(result);}
    @Override protected void handleOnNewIntent(Intent intent){String kind=intent.getStringExtra("journeyKind");if(JourneyReminderReceiver.valid(kind)){JSObject result=new JSObject();result.put("kind",kind);notifyListeners("journeyTapped",result,true);intent.removeExtra("journeyKind");}}
}
