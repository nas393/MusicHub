'use client';

import { useEffect, useMemo, useState } from 'react';
import { matchesArabicQuery } from '@/lib/arabic-normalization';

type Recording = {
  id: string;
  title: string;
  artists: string[];
  releaseTitle: string | null;
  releaseYear: number | null;
  durationSeconds: number | null;
  tags: string[];
  provider: string;
  providerUrl: string;
  playback: null;
  rightsStatus: 'metadata_only';
};

type SearchResponse = {
  results?: Recording[];
  count?: number;
  error?: string;
  notice?: string;
};

const genres = ['الطرب الأصيل', 'الأغنية اللبنانية', 'الموسيقى المصرية', 'الخليجي', 'القدود الحلبية', 'المغاربي', 'الشعبي', 'الجاز العربي'];
const decades = ['الخمسينيات', 'الستينيات', 'السبعينيات', 'الثمانينيات', 'التسعينيات', '2000–2010', '2010–اليوم'];

function formatDuration(seconds: number | null) {
  if (!seconds) return 'المدة غير متاحة';
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('الكل');
  const [activeDecade, setActiveDecade] = useState('');
  const [section, setSection] = useState('الرئيسية');
  const [results, setResults] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const filteredGenres = useMemo(() => genres.filter((genre) => matchesArabicQuery(genre, query)), [query]);

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2) {
      setResults([]);
      setError('');
      setLoading(false);
      setSearched(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal });
        const payload = await response.json() as SearchResponse;
        if (!response.ok) throw new Error(payload.error || 'تعذر إكمال البحث.');
        setResults(payload.results || []);
        setSearched(true);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'حدث خطأ أثناء البحث.');
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="طرب - الصفحة الرئيسية">
          <span className="brand-mark">ط</span>
          <span><strong>طَرَب</strong><small>الأرشيف الموسيقي العربي</small></span>
        </a>
        <div className="side-label">المكتبة</div>
        <nav className="side-nav" aria-label="التنقل الرئيسي">
          {['الرئيسية', 'اكتشف الموسيقى', 'الفنانون', 'الألبومات', 'الأنواع الموسيقية', 'السنوات', 'مكتبتي'].map((item, index) => (
            <button key={item} className={section === item ? 'nav-item active' : 'nav-item'} onClick={() => setSection(item)}>
              <span className="nav-icon">{['⌂', '⌕', '◉', '▤', '◈', '◷', '♡'][index]}</span>{item}
            </button>
          ))}
        </nav>
        <div className="side-divider" />
        <div className="side-label">الاستوديو</div>
        <button className="nav-item" onClick={() => setSection('استوديو الراديو')}><span className="nav-icon">◍</span>استوديو الراديو</button>
        <div className="sidebar-bottom"><span className="status-dot" /> محرك الفهرسة متصل <small>بيانات الموسيقى من MusicBrainz</small></div>
      </aside>

      <section className="main-content" id="home">
        <header className="topbar">
          <div className="breadcrumb">الأرشيف <span>/</span> {section}</div>
          <div className="top-actions"><span className="private-pill"><i /> مكتبة خاصة</span><button className="avatar" aria-label="الحساب">ن</button></div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> ذاكرة الموسيقى العربية</div>
            <h1>كل الأغاني.<br /><em>كل الحكايات.</em></h1>
            <p>ابحث عن الفنانين والتسجيلات والألبومات العربية من أرشيف موسيقي موحّد، مع روابط موثوقة إلى مصادر البيانات.</p>
            <div className="search-box">
              <span className="search-symbol">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن أغنية، مطرب، ألبوم أو سنة..." aria-label="البحث في الأرشيف" />
              {loading ? <span className="search-loading">جارٍ البحث…</span> : <kbd>بحث مباشر</kbd>}
            </div>
            <div className="search-hint">يدعم البحث بالعربية واللاتينية. اكتب حرفين على الأقل لبدء البحث.</div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="vinyl"><div className="vinyl-center"><span>طَرَب</span><small>صوت الذاكرة</small></div></div><div className="art-caption">صوتٌ يعبر الزمن <span>— منذ البدايات</span></div></div>
        </section>

        {query.trim().length >= 2 && (
          <section className="results-section" aria-live="polite">
            <div className="section-heading"><div><span className="section-kicker">نتائج الفهرسة</span><h2>نتائج البحث</h2></div><span className="muted-count">{results.length} نتيجة ظاهرة</span></div>
            {error && <div className="search-error">{error}</div>}
            {!error && loading && results.length === 0 && <div className="empty-results">جارٍ البحث في فهرس الموسيقى…</div>}
            {!error && searched && results.length === 0 && <div className="empty-results">لم نعثر على نتائج مطابقة. جرّب كتابة اسم الفنان أو الأغنية بطريقة أخرى.</div>}
            {results.length > 0 && <div className="result-list">{results.map((recording) => (
              <article className="result-row" key={recording.id}>
                <div className="result-disc">♫</div>
                <div className="result-info"><strong>{recording.title}</strong><span>{recording.artists.join('، ') || 'الفنان غير مسجل'}</span><small>{recording.releaseTitle || 'الألبوم غير محدد'}{recording.releaseYear ? ` · ${recording.releaseYear}` : ''} · {formatDuration(recording.durationSeconds)}</small></div>
                <a className="source-link" href={recording.providerUrl} target="_blank" rel="noreferrer">سجل المصدر ↗</a>
                <span className="metadata-only">بيانات فقط</span>
              </article>
            ))}</div>}
            <p className="rights-note">نتائج الفهرسة لا تعني توفر ملف صوتي أو امتلاك حقوق التشغيل. روابط التشغيل الرسمية ستظهر فقط بعد ربط مزود مرخّص.</p>
          </section>
        )}

        <section className="section-block">
          <div className="section-heading"><div><span className="section-kicker">تصفّح حسب الإحساس</span><h2>الأنواع الموسيقية</h2></div><span className="muted-count">{filteredGenres.length} تصنيفات</span></div>
          <div className="genre-grid">
            {filteredGenres.map((genre) => {
              const index = genres.indexOf(genre);
              return <button key={genre} onClick={() => setActiveGenre(genre)} className={activeGenre === genre ? 'genre-card selected' : 'genre-card'}><span className={`genre-art art-${index + 1}`}><i>{['♬','♫','♩','♭','♪','♮','♬','♩'][index]}</i></span><strong>{genre}</strong><small>استكشف اللون الموسيقي</small></button>;
            })}
            {filteredGenres.length === 0 && <p className="empty-filter">لا توجد تصنيفات مطابقة.</p>}
          </div>
        </section>

        <section className="section-block decade-block">
          <div className="section-heading"><div><span className="section-kicker">رحلة عبر الزمن</span><h2>اختر العقد الموسيقي</h2></div></div>
          <div className="decade-list">{decades.map((decade) => <button key={decade} onClick={() => setActiveDecade(decade)} className={activeDecade === decade ? 'decade-chip selected' : 'decade-chip'}>{decade}<span>↗</span></button>)}</div>
        </section>

        <section className="catalog-state">
          <div className="catalog-icon">♫</div><div><span className="section-kicker">حقوق الاستماع</span><h2>المصدر واضح قبل التشغيل</h2><p>نربط كل تسجيل بمصدره الأصلي ونوضح نوع الترخيص. لا ملفات وهمية، ولا تشغيل غير موثّق، ولا بث إذاعي دون تصريح.</p></div><div className="catalog-progress"><strong>01</strong><span>محرك الفهرسة</span><small>متصل تجريبياً</small></div>
        </section>
        <footer><span>طَرَب — الأرشيف الموسيقي العربي</span><span>نحفظ الذاكرة، ونحترم حقوق أصحابها.</span></footer>
      </section>
    </main>
  );
}
