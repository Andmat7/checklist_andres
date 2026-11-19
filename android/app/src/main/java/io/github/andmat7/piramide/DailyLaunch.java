package io.github.andmat7.piramide;

import android.app.ActivityOptions;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Calendar;
import org.json.JSONObject;

/** Opens the app every day at the time in data/reminders.json ("open_app_at"). */
public final class DailyLaunch {

    private static final String tag = "DailyLaunch";
    private static final String reminders_asset = "public/data/reminders.json";

    private DailyLaunch() {}

    /** Called on every start and after a reboot, so the next opening is always set. */
    public static void schedule(Context context) {
        AlarmManager alarm_manager = context.getSystemService(AlarmManager.class);
        // Android 12+ lets the user revoke exact alarms; without them the app simply is not opened.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarm_manager.canScheduleExactAlarms()) {
            Log.w(tag, "Exact alarms not allowed; daily launch skipped");
            return;
        }
        try {
            long next_launch = next_occurrence(read_open_time(context));
            // An alarm clock is the kind of alarm Android lets start an activity from the background.
            AlarmManager.AlarmClockInfo info = new AlarmManager.AlarmClockInfo(next_launch, launch_intent(context));
            alarm_manager.setAlarmClock(info, launch_intent(context));
        } catch (Exception error) {
            Log.w(tag, "Daily launch not scheduled", error);
        }
    }

    private static PendingIntent launch_intent(Context context) {
        Intent intent = new Intent(context, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT, background_start_options());
    }

    /**
     * Android 14+ blocks the start unless the intent's creator opts in, and the opt-in only counts
     * when the app may draw over other apps, a permission the user grants once in settings.
     */
    private static Bundle background_start_options() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return null;
        int mode = Build.VERSION.SDK_INT >= Build.VERSION_CODES.BAKLAVA
            ? ActivityOptions.MODE_BACKGROUND_ACTIVITY_START_ALLOW_ALWAYS
            : ActivityOptions.MODE_BACKGROUND_ACTIVITY_START_ALLOWED;
        return ActivityOptions.makeBasic().setPendingIntentCreatorBackgroundActivityStartMode(mode).toBundle();
    }

    private static String read_open_time(Context context) throws Exception {
        try (InputStream stream = context.getAssets().open(reminders_asset)) {
            String text = new String(stream.readAllBytes(), StandardCharsets.UTF_8);
            return new JSONObject(text).getString("open_app_at");
        }
    }

    private static long next_occurrence(String time) {
        String[] parts = time.split(":");
        Calendar next = Calendar.getInstance();
        next.set(Calendar.HOUR_OF_DAY, Integer.parseInt(parts[0]));
        next.set(Calendar.MINUTE, Integer.parseInt(parts[1]));
        next.set(Calendar.SECOND, 0);
        next.set(Calendar.MILLISECOND, 0);
        if (next.getTimeInMillis() <= System.currentTimeMillis()) next.add(Calendar.DAY_OF_YEAR, 1);
        return next.getTimeInMillis();
    }
}
