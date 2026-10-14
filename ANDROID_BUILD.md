# Building the Android application

Requirements: Node 22+, JDK 21, Android SDK platform 36, Android build tools 36, and Android Studio compatible with Capacitor 8. The dependency lockfile is committed. App assets are bundled locally; do not replace them with a remote `server.url`.

```powershell
npm ci
npm run android:sync
cd android
.\gradlew.bat assembleDebug bundleRelease --no-daemon
```

Outputs: `android/app/build/outputs/apk/debug/app-debug.apk` and `android/app/build/outputs/bundle/release/app-release.aab`. The debug APK is test-signed. The release bundle is unsigned unless release credentials are supplied. These build outputs and signing files are excluded from Git.

The default public backend is https://amegoo.vercel.app, verified to serve this application. Set `AMEGOO_API_BASE_URL` before `mobile:build` to use another HTTPS deployment. This variable is a public URL, not a key. Secrets remain in the Vercel function environment. `/api/chat` accepts the Android WebView origin `https://localhost` and handles CORS preflight; arbitrary origins remain rejected.

To sign a release bundle, provide `AMEGOO_STORE_FILE`, `AMEGOO_STORE_PASSWORD`, `AMEGOO_KEY_ALIAS`, and `AMEGOO_KEY_PASSWORD` only in a private shell or CI secret environment. Never commit the keystore or its passwords. Increment `versionCode` before each Play upload and update the app version consistently.

The `Android test build` workflow is manually dispatched and produces debug APK/unsigned AAB artifacts; it does not publish to Google Play.

On this Windows host, the bundled JDK initially failed with a loopback selector error. Building succeeded using a Windows selector provider. If the same host-specific issue returns, set the following for that shell only:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME = 'C:\Users\Marco Ehab\AppData\Local\Android\Sdk'
$env:JAVA_TOOL_OPTIONS = '-Djava.nio.channels.spi.SelectorProvider=sun.nio.ch.WindowsSelectorProvider -Djdk.net.unixdomain.tmpdir=C:\Windows\Temp'
```
