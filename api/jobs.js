// Serverless proxy for the Remotive public API (https://remotive.com/api-documentation).
// Remotive asks for at most ~4 requests per day, so the response is cached on Vercel's CDN
// for 6 hours and every visitor is served from that cache instead of hitting Remotive.
// Terms: link back to the original posting and name Remotive as the source (the UI does both).

const UPSTREAM = 'https://remotive.com/api/remote-jobs';

const CATEGORY = {
  'software development': 'Engineering',
  'devops / sysadmin': 'Engineering',
  'information technology': 'Engineering',
  'qa': 'Engineering',
  'artificial intelligence': 'Data',
  'data and analytics': 'Data',
  'data': 'Data',
  'design': 'Design',
  'product': 'Product',
  'marketing': 'Marketing',
  'writing': 'Writing'
};
const TYPE = { full_time: 'Full-time', part_time: 'Part-time', contract: 'Contract', freelance: 'Freelance' };

const stripHtml = (html) =>
  String(html || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|h\d|br)>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function level(title) {
  const t = title.toLowerCase();
  if (/\b(senior|sr\.?|lead|principal|staff|head)\b/.test(t)) return 'Senior';
  if (/\b(junior|jr\.?|intern|internship|entry|trainee)\b/.test(t)) return 'Junior';
  return 'Mid';
}

// Salary text on Remotive is free-form ("$35,3k- $52k", "$45-$120/Hour", "OTE $25k - $35k").
// Numbers are only parsed for annual figures and are used for filtering and sorting; the original text is shown.
const tidy = (s) => clip(s.replace(/(\d),(\d)\s*k/gi, '$1.$2k').replace(/\s*-\s*/g, ' – ').replace(/\s*\/\s*/g, '/'), 40);

function salary(raw) {
  const text = String(raw || '').replace(/\s+/g, ' ').trim();
  if (!text) return { salaryText: '', min: 0, max: 0 };
  if (/hour|\bhr\b|\/h\b|day|week|month/i.test(text)) return { salaryText: tidy(text), min: 0, max: 0 };
  const nums = [...text.matchAll(/(\d[\d.,]*)\s*(k)?/gi)].map((m) => {
    const tok = m[1].replace(/[.,]$/, '');
    const v = m[2] ? parseFloat(tok.replace(',', '.')) * 1000 : parseFloat(tok.replace(/,/g, ''));
    return Number.isFinite(v) ? v : 0;
  }).filter((v) => v >= 1000);
  const pretty = tidy(text);
  return { salaryText: pretty, min: nums.length ? Math.min(...nums) : 0, max: nums.length ? Math.max(...nums) : 0 };
}

function normalise(j) {
  const published = Date.parse(String(j.publication_date).replace(/Z?$/, 'Z'));
  const days = Number.isFinite(published) ? Math.max(0, Math.floor((Date.now() - published) / 86400000)) : 0;
  const text = stripHtml(j.description);
  const seen = new Set();
  const tags = (j.tags || []).map((t) => String(t).trim()).filter((t) => t && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase())).slice(0, 8);
  const title = String(j.title || '').trim();
  return {
    id: 'r' + j.id,
    title,
    company: String(j.company_name || 'Unknown company').trim(),
    // Remotive serves logos with a same-origin policy, so other sites cannot embed them; the UI shows a coloured initial instead.
    logo: null,
    category: CATEGORY[String(j.category || '').toLowerCase()] || 'Other',
    type: TYPE[j.job_type] || 'Full-time',
    level: level(title),
    ...salary(j.salary),
    days,
    tags,
    location: String(j.candidate_required_location || 'Worldwide').trim(),
    summary: clip(text, 140),
    about: clip(text, 700),
    todo: [],
    need: [],
    url: j.url,
    source: 'Remotive'
  };
}

module.exports = async (req, res) => {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(UPSTREAM, { signal: ctrl.signal, headers: { 'user-agent': 'Jobless/1.0 (+https://jobless-sigma.vercel.app)', accept: 'application/json' } });
    clearTimeout(timer);
    if (!r.ok) throw new Error(`Remotive responded ${r.status}`);
    const data = await r.json();
    if (!Array.isArray(data.jobs)) throw new Error('Unexpected response shape');
    const jobs = data.jobs.map(normalise).filter((j) => j.title && j.url);
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(JSON.stringify({ source: 'Remotive', sourceUrl: 'https://remotive.com', fetchedAt: new Date().toISOString(), jobs }));
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'Live listings are unavailable right now.' });
  }
};
