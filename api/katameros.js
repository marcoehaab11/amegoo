// Fixed upstream: never proxy a caller-supplied URL or forward user credentials.
module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin) {
    const allowed = new Set(['https://localhost', ...(process.env.APP_ALLOWED_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean)]);
    try { if (new URL(origin).host !== req.headers.host && !allowed.has(origin)) return res.status(403).json({error:'مصدر الطلب غير مسموح.'}); }
    catch { return res.status(403).json({error:'طلب غير صالح.'}); }
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') { res.setHeader('Allow','GET'); return res.status(405).json({error:'استخدم طلب قراءة.'}); }
  const date = typeof req.query?.date === 'string' ? req.query.date : '';
  const parsed = new Date(date + 'T12:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(+parsed) || parsed.toISOString().slice(0,10) !== date || +date.slice(0,4) < 1900 || +date.slice(0,4) > 2100)
    return res.status(400).json({error:'اختر تاريخًا صحيحًا بين ١٩٠٠ و٢١٠٠.'});
  try {
    const [y,m,d] = date.split('-');
    const upstream = await fetch(`https://api.katameros.app/readings/gregorian/${d}-${m}-${y}?languageId=3&bibleId=3`, {signal:AbortSignal.timeout(20000),headers:{Accept:'application/json'}});
    if (!upstream.ok) throw Error('upstream');
    const raw = await upstream.text();
    if (raw.length > 2000000) throw Error('size');
    const data = JSON.parse(raw);
    if (!Array.isArray(data.sections) || !data.sections.length || !data.sections.some(s => s.subSections?.some(sub => sub.readings?.length))) throw Error('empty');
    res.setHeader('Cache-Control','public, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({date, title:data.title, periodInfo:data.periodInfo, copticDate:data.copticDate, sections:data.sections});
  } catch { return res.status(503).json({error:'تعذر تحميل قراءات التاريخ المختار. حاول مرة أخرى عند توفر الاتصال.'}); }
};
