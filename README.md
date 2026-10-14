# التطبيق القبطي — amegoo

يفتح التطبيق على الرئيسية مباشرة، دون اختيار نوع أو تسجيل حساب. أزيل المساعد من الصفحة وشريط التنقل.

الوظائف
- الأجبية: نصوص عربية محلية للساعات الثماني، بما فيها خدمات نصف الليل والقطع والتحاليل، وفهرس وتكبير للخط.
- الخولاجي: الباسيلي والغريغوري والكيرلسي، مع الأقسام والصلوات البديلة والأواشي الموسمية.
- الكتاب المقدس: 66 سفراً من نسخة فان دايك المتاحة للنشر، وتسعة أقسام للأسفار القانونية الثانية، بملفات محلية.
- البحث: بحث في الآيات والأجبية والخولاجي وأسماء الألحان والنصوص المضافة والدروس. تفتح النتيجة مكان القراءة.
- الألحان: إكمال قارئ نص الهوس الثالث، ومديح العذراء الثاني بصفحات SVG ونص مطابق للصور الثلاث المقدمة، مع عرض الأصل والتكبير. الألحان الأخرى تحتفظ بصورها الأصلية؛ لا يوجد صوت جديد أو هزات مصورة للقارئين النصيين.
- تعليم القبطي: جدول 31 حرفاً، أربعة دروس تمهيدية، اختبار تفاعلي وحفظ تقدم الدروس. النطق مكتوب بالعربية؛ لا توجد تسجيلات صوتية جديدة للحروف.
- الشرح: أربعة مداخل تعليمية بصياغة جديدة ومراجع واضحة. ليست نسخاً كاملة من كتب التفسير.
- النوتات: حفظ تلقائي، نسخ احتياطية بصيغة JSON، استيراد يدمج دون حذف الحالي، واسترجاع من سلة المحذوفات.
- المفضلة وآخر قراءة وتكبير الخط محفوظة على الجهاز.

التشغيل والنشر
موقع ثابت، لا يحتاج npm أو عملية بناء. استورد المستودع في Vercel بإعداد Framework Preset: Other، وOutput Directory: .
أبقِ index.html وassets وmanifest.webmanifest وsw.js في جذر الموقع.

العمل دون إنترنت
بعد أول فتح ناجح من HTTPS وتجهيز النسخة المحلية، تُحفظ نصوص القراءة والخطوط والواجهة للعمل دون إنترنت. تُحفظ الصور والصوت عند فتحها. القطمارس معروض من katameros.app ويحتاج الإنترنت؛ يبقى زر الفتح في المتصفح متاحاً.
يمكن تثبيت التطبيق من المتصفحات التي تدعم ذلك. عند دعم مطالبة التثبيت يظهر زر «تثبيت التطبيق»؛ وعلى iOS يُستخدم خيار الإضافة إلى الشاشة الرئيسية من المتصفح.
فتح index.html مباشرة من الجهاز يسمح بالقراءة، لكنه لا يفعّل خدمة التخزين دون الإنترنت أو التثبيت.

البيانات
لا تتطلب النسخة حساباً أو خادماً للملاحظات. النوتات والمفضلة والتقدم تُحفظ في متصفح الجهاز؛ التصدير هو وسيلة نقل النوتات إلى جهاز آخر.
تفاصيل المراجع والحقوق في SOURCES.md.
# Faith study chat

The dashboard includes **اسأل عن الإيمان**, an Arabic AI study chat backed by `api/chat.js` on Vercel. The server retrieves passages and teaching sections from this project's local library and sends them, the question, and up to six preceding messages to Gamaliel. Supporting texts are available beneath the answer. Generated answers still require review; the provider has no dedicated Coptic Orthodox preset. The application uses the general Christian preset with Coptic study instructions and local context.

Deploy the repository as a Vercel project; `vercel.json` packages the local data files with the Node.js function. No frontend key is needed. Hosted Gamaliel access works without a key, is limited to 3 requests/minute per upstream IP, and has no availability guarantee. Requests from a Vercel function may share that upstream allowance. For caller-paid access, configure `GAMALIEL_API_KEY` in Vercel Environment Variables; optionally set `GAMALIEL_MODEL`. Never add keys to HTML, browser JavaScript, or Git. The app also applies a best-effort 3/minute limit per client in each function instance; this is not a durable global quota.

Chat needs internet and Vercel functions; static hosting alone cannot run `/api/chat`. Messages stay in page memory and are not written to localStorage or application files. The external provider receives the messages required to answer. API responses use `no-store` and are excluded from the service-worker cache. Provider failures and limits appear as retry messages, preserving the draft question.
