package boom.hairclipper.funnyprank.haircut.sound;

import android.content.Context;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class FlashModule extends ReactContextBaseJavaModule {
    private CameraManager cameraManager;
    private String cameraId;
    
    public FlashModule(ReactApplicationContext reactContext) {
        super(reactContext);
        cameraManager = (CameraManager) reactContext.getSystemService(Context.CAMERA_SERVICE);
        try {
            cameraId = cameraManager.getCameraIdList()[0];
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getName() {
        return "FlashModule";
    }

    @ReactMethod
    public void switchFlash(boolean flashOn, Promise promise) {
        try {
            if (cameraManager != null && cameraId != null) {
                cameraManager.setTorchMode(cameraId, flashOn);
                promise.resolve("Flash " + (flashOn ? "ON" : "OFF"));
            } else {
                promise.reject("FLASH_ERROR", "Camera not available");
            }
        } catch (CameraAccessException e) {
            promise.reject("FLASH_ERROR", "Camera access error: " + e.getMessage());
        }
    }
}