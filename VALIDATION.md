# التحقق من النسخة

نجحت اختبارات متصفح Edge الفعلية على خادم HTTP محلي، بحجم شاشة موبايل 390×844 وشاشة سطح مكتب 1280×900.

- غياب المساعد وشاشات النوع والتسجيل، والدخول المباشر للرئيسية.
- التعافي من بيانات نوتات تالفة، والحفظ التلقائي، واسترجاع المحذوف، والاستيراد دون حذف الحالي، والتصدير، وبقاء النوتات بعد إعادة الفتح.
- الساعات الثماني من الأجبية: وجود القطع والتحاليل وعدم وجود انتظار لمصدر نص خارجي.
- القداسات الثلاثة وفهارسها: 70 قسماً للباسيلي، 57 للغريغوري، و66 للكيرلسي مع البداية المشتركة والبدائل.
- المفضلة، واستئناف القراءة، وتكبير الخط.
- فتح الأسفار القانونية الثانية محلياً، بما فيها تتمة أستير وباروخ.
- البحث في الكتاب وفتح يوحنا 3:16 مباشرة عند الآية.
- قارئا الهوس الثالث ومديح العذراء الثاني، والأبجدية القبطية ذات 31 حرفاً، والتدريب وحفظ تقدم الدروس، والمداخل التعليمية الأربعة ومراجعها.
- تثبيت خدمة التخزين، ثم فصل الإنترنت وإعادة فتح الصفحة والبحث في جميع النصوص المحلية، مع عمل الخطوط المحلية.
- عدم وجود أخطاء JavaScript أو طلبات محلية فاشلة أو تجاوز أفقي في عرض الموبايل.
- التنقل في أسفار الكتاب بلوحة المفاتيح واتساق بطاقات الرئيسية بعد آخر تحسينات الشكل.

فُحصت صياغة ملفات JavaScript الـ71. اختبارات المتصفح للتحقق محفوظة ضمن ملفات العمل المحلية ولا يحتاج تشغيل الموقع أدوات الاختبار.

لم يُختبر عنوان Vercel منشور؛ الرابط الذي ورد أثناء التنفيذ كان Google Meet. تم التحقق من مسار القطمارس العربي وطريقة التاريخ في الموقع الخارجي، لكن القطمارس يظل خدمة مستقلة تحتاج اتصالاً.

إضافة لاحقة: نجح اختبار نافذة إنشاء المجلد والألبوم على الموبايل والكمبيوتر، بما فيه الاسم الفارغ والمكرر، التركيز، الإنشاء بـEnter، والإلغاء بـEscape أو الخلفية، وحفظ المجموعة، دون استخدام prompt المتصفح.

## Supplied second Virgin praise
- Three native text SVG pages checked in Edge: embedded fonts loaded, no raster image elements, and no column overflow.
- Verified pagination, original-image comparison, zoom, text reading, search, and offline reader/direct SVG navigation.


## Teaching book readers
Verified all four books (26 chapters), chapter contents navigation, return to contents, mobile width, offline reading and search into the expanded text.

## Third Hos reader
Verified printed page ordering 244–249, six offline images, previous/next boundaries, zoom and mobile layout.
# Faith chat checks

- Live hosted-provider requests returned Arabic answers for the Trinity and John 3:16; the latter used the supplied local verse with a numbered reference. This verifies connectivity and representative responses, not general theological accuracy.
- API tests covered explicit verse context, teaching retrieval, input and origin validation, filtered history, no-store responses, provider errors/timeouts and per-instance rate limits.
- Edge mobile checks covered chat/source display, HTML injection as harmless text, navigation, new conversations, page-memory history, provider error messages, mobile width and offline status.
- Vercel deployment configuration includes the local corpus. The deployed website itself has not been tested because its URL is not available in this chat.

## Spacious reading layout
Verified near-full viewport width and expanded vertical reading area for Bible, teachings, Agpeya, liturgies and hymns in Edge at 390x844 and 1280x900. Checked font controls, next chapter, book contents, liturgy section navigation and hymn pagination, with no horizontal page overflow. Images keep their natural proportions and can be zoomed; long texts use one main scrolling surface.

## Hymn audio and bottom search

- All 16 direct recording URLs responded with HTTP 200 and audio/mpeg; both official SoundCloud oEmbed URLs responded with HTTP 200 and matching titles.
- Edge mobile testing opened all 13 new player panels, loaded live metadata in all 11 direct-audio hymn readers, and played the Ten-o-osht recording.
- Verified playlist and playback speed controls, stopping audio/removing widgets on navigation, preserving audio on hymn page changes, and the player in Mary praise text mode.
- Verified bottom search is horizontally centered, opens the existing search view, and no horizontal page overflow occurs. SoundCloud widget embedding was checked; playback within the third-party widget depends on its service.
