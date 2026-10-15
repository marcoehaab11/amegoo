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

## Naming update — 1.0.2

User-approved name: رفيقك القبطي. APK/AAB build completed. AAPT confirms versionName 1.0.2, versionCode 3 and the Android launcher label. Existing logo retained. Google Play app draft exists in the publisher account; upload signing awaits permitted execution. The unsigned AAB must not be uploaded as a production artifact.

## Google Play package and signed build — 1.0.3

- Google Play registers this app as com.amegoo.talkha. applicationId, Capacitor appId and URL scheme now match; Java namespace remains internal and the launcher activity was verified with AAPT.
- Release AAB signed with the app-specific RSA upload key; jarsigner reports jar verified. Self-signed upload certificate is expected; private key remains outside the checkout.
- Installed the new package on the dedicated emulator. Native bridge, settings, local verse preview, Bible reading and version 1.0.3 passed with no JavaScript errors or horizontal overflow. SHA-256 of the packaged logo equals the final text-free, plaque-free icon.
- Captured actual app WebView images. Store phone assets add plain background padding only to fit 1080x1920 (9:16); no app controls or content were composited or invented. Original captures are retained separately.

## Final reading polish — 1.0.4 (code 5)

The light theme reader heading inherited a higher-specificity dark-theme heading color. Added scoped light reader header/body rules. Actual browser and Android WebView measurements both report 11.52:1 heading contrast. Installed the final APK after restarting the dedicated test emulator to clear a stuck package-manager update. Native version, final logo hash, settings, Bible and Agpeya screenshots passed; daily verse scheduling/notification delivery also passed under com.amegoo.talkha before the CSS-only patch. Google Play accepted and published code 5 to internal testing.


## قطمارس نصي — ١٫٠٫٥

استُبدل إطار الموقع بقارئ نصي كامل من بيانات katameros.app العربية (فان دايك، bibleId=3). وسيط GET ثابت على الخادم مع تحقق التاريخ وCORS، ولا يمرر بيانات أو ترويسات المستخدم إلى المصدر. تُعرض الأقسام بترتيب المصدر، بما فيه ساعات الجمعة العظيمة، دون فرض أقسام يوم عادي. HTML السنكسار يُحوّل لنص داخل مستند خامل ولا يُدرج في صفحة التطبيق.

تُحفظ آخر ٢٠ يومًا مفتوحًا محليًا، ويُعرض تنبيه واضح عند استخدام نسخة محفوظة. اليوم غير المحفوظ يحتاج الإنترنت، ولا تستبدل قراءات تاريخ بآخر عند انقطاع الاتصال. المصدر وترخيص MIT مرفقان في store/licenses/katameros-MIT.txt.

التحقق: استجابة حية ليوم ١٥ أكتوبر ٢٠٢٦، ١١٩ آية مطابقة في العدد والترتيب، التاريخ القبطي، السنكسار، انعدام iframe، تكبير الخط، عرض هاتف ٣٩٠px، الفاتح والداكن، قراءة محفوظة بعد إعادة فتح الصفحة مع قطع الإنترنت، يوم غير محفوظ وإعادة المحاولة، رفض تاريخ مستحيل ومصدر CORS غريب وPOST. روجعت بنية الميلاد والقيامة والجمعة العظيمة من API؛ لا يُعد ذلك تدقيقًا كنسيًا كاملًا للتقويم.


## رحلتك مع الكتاب ووقت الصلاة — ١٫١٫٠

بطاقتان جنبًا إلى جنب حتى عرض ٣٢٠px. خطتا ٣٦٥ يومًا موزعتان بالكلمات: العهد الجديد، والكتاب الكامل مع النصوص القانونية الثانية المحلية. التوليد قابل للإعادة عبر node scripts/generate-year-plans.cjs، والتحقق المستقل عبر node tests/journeys.cjs يقارن كل آية وموقعها بالمصدر ويثبت عدم النقص والتكرار. القراءة تسلسلية مع الاستكمال من الموضع المحفوظ، وليست تعويضًا تلقائيًا عن الأيام الفائتة.

اختبارات ناجحة: حالات انتهاء ٣٦٥ يومًا، انقطاع الستريك دون فقد التقدم، اختلاف التوقيت الصيفي، منع إكمال اليوم مرتين أو قبل بداية الخطة أو بعد إرجاع الساعة، استقلال الصلاة والقراءة، مراجعة الأيام السابقة دون إضافة إنجاز. اختبارات واجهة الهاتف شملت البدء والقراءة والإكمال وإعادة الفتح، هدف الصلاة، استعادة نسخة احتياطية فعلية، الفاتح والداكن، التنقل وعدم تجاوز الشاشة.

الإشعارات المحلية الجديدة اختيارية، لكل هدف موعد وPendingIntent مستقل (٨١٠ للقراءة و٨٢٠ للصلاة)، مع قناة منفصلة عن آية اليوم وإعادة جدولة بعد التشغيل وتغيير التوقيت. تفضيلات المواعيد تُضبط على كل جهاز ولا تُنقل في النسخة الاحتياطية؛ تقدم الهدفين يُنقل. لا بيانات تقدم على الخادم ولا حساب مستخدم.
