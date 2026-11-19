package io.github.andmat7.piramide;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onResume() {
        super.onResume();
        // Each opening, including the scheduled one, sets the next day's.
        DailyLaunch.schedule(this);
    }
}
