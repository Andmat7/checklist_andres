package io.github.andmat7.piramide;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.health.connect.AggregateRecordsGroupedByPeriodResponse;
import android.health.connect.AggregateRecordsRequest;
import android.health.connect.HealthConnectException;
import android.health.connect.HealthConnectManager;
import android.health.connect.HealthPermissions;
import android.health.connect.LocalTimeRangeFilter;
import android.health.connect.ReadRecordsRequestUsingFilters;
import android.health.connect.ReadRecordsResponse;
import android.health.connect.TimeInstantRangeFilter;
import android.health.connect.datatypes.HeartRateRecord;
import android.health.connect.datatypes.SleepSessionRecord;
import android.health.connect.datatypes.StepsRecord;
import android.os.Build;
import android.os.OutcomeReceiver;
import android.util.Log;
import androidx.annotation.RequiresApi;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Copies the watch's steps, heart rate and sleep, which Mi Fitness writes to Health Connect, into files/watch.json
 * so tools/pull_phone_watch.mjs can read it over USB. Uses the Health Connect built into Android 14+, so no library.
 */
@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
public final class WatchExport {

    private static final String tag = "WatchExport";
    private static final String file_name = "watch.json";
    private static final int days_read = 14;
    private static final int permission_request = 7301;
    private static final String[] permissions = {
        HealthPermissions.READ_STEPS, HealthPermissions.READ_HEART_RATE, HealthPermissions.READ_SLEEP,
    };
    private static final Executor executor = Executors.newSingleThreadExecutor();

    private WatchExport() {}

    /** Asks for the permissions the first time; once granted, every opening of the app refreshes the file. */
    public static void run(Activity activity) {
        if (!has_permissions(activity)) {
            activity.requestPermissions(permissions, permission_request);
            return;
        }
        HealthConnectManager health = activity.getSystemService(HealthConnectManager.class);
        LocalDate first_day = LocalDate.now().minusDays(days_read - 1);
        health.aggregateGroupByPeriod(daily_request(first_day), Period.ofDays(1), executor, outcome((days) ->
            health.readRecords(sleep_request(first_day), executor, outcome((sleep) ->
                write(activity, days, sleep.getRecords())))));
    }

    private static boolean has_permissions(Context context) {
        for (String permission : permissions) {
            if (context.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) return false;
        }
        return true;
    }

    private static AggregateRecordsRequest<Long> daily_request(LocalDate first_day) {
        LocalTimeRangeFilter range = new LocalTimeRangeFilter.Builder()
            .setStartTime(first_day.atStartOfDay())
            .setEndTime(LocalDate.now().plusDays(1).atStartOfDay())
            .build();
        return new AggregateRecordsRequest.Builder<Long>(range)
            .addAggregationType(StepsRecord.STEPS_COUNT_TOTAL)
            .addAggregationType(HeartRateRecord.BPM_AVG)
            .addAggregationType(HeartRateRecord.BPM_MIN)
            .addAggregationType(HeartRateRecord.BPM_MAX)
            .build();
    }

    // The night before the first day counts too, since sleep starts the evening before.
    private static ReadRecordsRequestUsingFilters<SleepSessionRecord> sleep_request(LocalDate first_day) {
        TimeInstantRangeFilter range = new TimeInstantRangeFilter.Builder()
            .setStartTime(first_day.minusDays(1).atStartOfDay().atZone(java.time.ZoneId.systemDefault()).toInstant())
            .setEndTime(Instant.now())
            .build();
        return new ReadRecordsRequestUsingFilters.Builder<>(SleepSessionRecord.class).setTimeRangeFilter(range).setPageSize(1000).build();
    }

    private static void write(Context context, List<AggregateRecordsGroupedByPeriodResponse<Long>> days, List<SleepSessionRecord> sleep) {
        try {
            JSONObject export = new JSONObject()
                .put("exported_at", Instant.now().toString())
                .put("days", days_json(days))
                .put("sleep", sleep_json(sleep));
            Files.write(new File(context.getFilesDir(), file_name).toPath(), export.toString(2).getBytes(StandardCharsets.UTF_8));
            Log.i(tag, "Wrote " + days.size() + " days and " + sleep.size() + " sleep sessions");
        } catch (Exception error) {
            Log.w(tag, "Watch export not written", error);
        }
    }

    private static JSONArray days_json(List<AggregateRecordsGroupedByPeriodResponse<Long>> days) throws Exception {
        JSONArray result = new JSONArray();
        for (AggregateRecordsGroupedByPeriodResponse<Long> day : days) {
            result.put(new JSONObject()
                .put("date", day.getStartTime().toLocalDate().toString())
                .put("steps", day.get(StepsRecord.STEPS_COUNT_TOTAL))
                .put("heart_rate_avg", day.get(HeartRateRecord.BPM_AVG))
                .put("heart_rate_min", day.get(HeartRateRecord.BPM_MIN))
                .put("heart_rate_max", day.get(HeartRateRecord.BPM_MAX)));
        }
        return result;
    }

    private static JSONArray sleep_json(List<SleepSessionRecord> sessions) throws Exception {
        JSONArray result = new JSONArray();
        for (SleepSessionRecord session : sessions) {
            JSONObject stage_minutes = new JSONObject();
            // Each stage keeps its own times too, so the night can be drawn piece by piece and the wake-ups placed.
            JSONArray stages = new JSONArray();
            for (SleepSessionRecord.Stage stage : session.getStages()) {
                String name = stage_name(stage.getType());
                stage_minutes.put(name, stage_minutes.optLong(name) + Duration.between(stage.getStartTime(), stage.getEndTime()).toMinutes());
                stages.put(new JSONObject()
                    .put("stage", name)
                    .put("start", stage.getStartTime().atOffset(session.getStartZoneOffset()).toString())
                    .put("end", stage.getEndTime().atOffset(session.getStartZoneOffset()).toString()));
            }
            result.put(new JSONObject()
                .put("start", session.getStartTime().atOffset(session.getStartZoneOffset()).toString())
                .put("end", session.getEndTime().atOffset(session.getEndZoneOffset()).toString())
                .put("stage_minutes", stage_minutes)
                .put("stages", stages));
        }
        return result;
    }

    private static String stage_name(int type) {
        switch (type) {
            case SleepSessionRecord.StageType.STAGE_TYPE_SLEEPING_DEEP: return "deep";
            case SleepSessionRecord.StageType.STAGE_TYPE_SLEEPING_LIGHT: return "light";
            case SleepSessionRecord.StageType.STAGE_TYPE_SLEEPING_REM: return "rem";
            case SleepSessionRecord.StageType.STAGE_TYPE_AWAKE:
            case SleepSessionRecord.StageType.STAGE_TYPE_AWAKE_IN_BED:
            case SleepSessionRecord.StageType.STAGE_TYPE_AWAKE_OUT_OF_BED: return "awake";
            default: return "other";
        }
    }

    private interface Success<T> {
        void accept(T result);
    }

    private static <T> OutcomeReceiver<T, HealthConnectException> outcome(Success<T> on_result) {
        return new OutcomeReceiver<>() {
            @Override
            public void onResult(T result) {
                on_result.accept(result);
            }

            @Override
            public void onError(HealthConnectException error) {
                Log.w(tag, "Health Connect read failed", error);
            }
        };
    }
}
