# Android implementation verification

- Capacitor 8.5.3 Android project builds successfully with JDK 21 and Android SDK 36.
- Debug APK and unsigned release AAB produced. AAPT confirms package `com.marcoehaab11.amegoo`, versionCode 1, versionName 1.0.0, minSdk 24, targetSdk 36. The AAB is unsigned and is not a final Play submission.
- Manifest requests internet access and the app's private AndroidX receiver permission; no camera, microphone, location, contacts, or broad storage permission. Android automatic backup is disabled; export/share is initiated by the user.
- Playwright/Edge at 390×844: settings save across reload; dark/light themes; reader-font synchronization; speed and motion preferences; backup JSON export; default-settings reset; no horizontal overflow or JavaScript errors.
- Local API checks: Android-origin CORS preflight succeeds, unrecognized origins are rejected, and input validation still applies.
- Both packaged Android assets and the website use the same source library. Native builds omit PWA service-worker registration and include all bundled text/media assets.
- Dependency audit reports zero vulnerabilities after a compatible uuid override in the development toolchain.
- Store phone images are web-layout previews, not screenshots proving operation on physical Android hardware. Real device tests, AI feedback delivery, publisher signing and Play Console requirements remain before a production release.

The pre-existing emulator was unresponsive at the system level. A separate workspace-scoped emulator was created for verification; native runtime results, where available, are recorded below.
