# Android implementation verification

- Capacitor 8.5.3 Android project builds successfully with JDK 21 and Android SDK 36.
- Debug APK and unsigned release AAB produced. AAPT confirms package `com.marcoehaab11.amegoo`, versionCode 2, versionName 1.0.1, minSdk 24, targetSdk 36. The AAB is unsigned and is not a final Play submission.
- Manifest requests internet access, optional POST_NOTIFICATIONS, RECEIVE_BOOT_COMPLETED and the app's private AndroidX receiver permission; no camera, microphone, location, contacts, or broad storage permission. Android automatic backup is disabled; export/share is initiated by the user.
- Playwright/Edge at 390×844: settings save across reload; dark/light themes; reader-font synchronization; speed and motion preferences; backup JSON export; default-settings reset; no horizontal overflow or JavaScript errors.
- Local API checks: Android-origin CORS preflight succeeds, unrecognized origins are rejected, and input validation still applies.
- Both packaged Android assets and the website use the same source library. Native builds omit PWA service-worker registration and include all bundled text/media assets.
- Dependency audit reports zero vulnerabilities after a compatible uuid override in the development toolchain.
- Store phone images are web-layout previews, not screenshots proving operation on physical Android hardware. Real device tests, AI feedback delivery, publisher signing and Play Console requirements remain before a production release.

The pre-existing emulator was unresponsive at the system level. A separate workspace-scoped emulator was created for verification; native runtime results, where available, are recorded below.

## Actual Android WebView runtime

- Installed and launched the APK on a fresh API 36.1 workspace-scoped emulator, with software rendering.
- Connected to the app's own WebView with Playwright's Android API. Native bridge initialization, settings, dark theme, stored font preferences and screen navigation passed.
- Disabled networking through CDP, reloaded the application and opened John and the first Agpeya hour successfully from the packaged assets. More than 20 verse markers and the Agpeya absolution were present offline.
- Re-enabled networking and obtained an HTTP 200 Arabic AI answer from the deployed HTTPS backend through the actual Android WebView origin. Production CORS preflight also returned HTTP 204.
- Native reading/settings screenshots captured from the app's WebView. This is emulator verification, not physical-device certification.
- The Android system UI in the emulator intermittently displayed an ANR dialog. Physical hardware-back and share-sheet interaction could not be certified in this environment; they remain explicit real-device checks. In-app back buttons and native initialization were verified.
- Backup restore tests verified restoration of notes and font/speed settings, and preservation of previous notes when a simulated storage write fails.

## Daily verse notifications — 1.0.1

- 71 references verified verbatim against the bundled Bible by scripts/generate-daily-verses.cjs. Local calendar date selects the verse in a repeating cycle.
- Actual API 36.1 WebView: native preferences, 08:30 time persistence, enabled/disabled state, and pending AlarmManager entry verified.
- Test notification posted to the real Android notification service; title/reference and full verse body verified using dumpsys notification.
- Verse reader and full chapter navigation passed, including highlighted verse. The notification activity intent delivered to the running app and opened the verse dialog.
- Network disabled through CDP: local verse preview and dialog remained available after reload. No horizontal overflow or JavaScript errors.
- First launch did not prompt for notification permission. Permission request is confined to explicit opt-in; the API 33+ granted-permission path was tested with the dedicated emulator's permission manager. Android system permission dialog interaction, reboot delivery and actual next-day timing still require physical-device checks.
- Daily scheduling uses an app-private receiver and one inexact alarm; each daily delivery schedules the next local calendar day. Duplicate daily delivery is suppressed by saved date. Boot/time/time-zone/app-update broadcasts reschedule; force-stop requires reopening the app. No exact-alarm permission or notification server.
