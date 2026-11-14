'use client';

import { useMemo, useState } from 'react';
import { matchesArabicQuery } from '@/lib/arabic-normalization';

const genres = ['الطرب الأصيل', 'الأغنية اللبنانية', 'الموسيقى المصرية', 'الخليجي', 'القدود الحلبية', 'المغاربي', 'الشعبي', 'الجاز العربي'];
const decades = ['الخمسينيات', 'الستينيات', 'السبعينيات', 'الثمانينيات', 'التسعينيات', '2000–2010', '2010–اليوم'];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('الكل');
  const [activeDecade, setActiveDecade] = useState('');
  const [section, setSection] = useState('الرئيسية');
  const filteredGenres = useMemo(() => genres.filter((genre) => matchesArabicQuery(genre, query)), [query]);

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
        <div className="sidebar-bottom"><span className="status-dot" /> مرحلة تأسيس الأرشيف <small>المصادر قيد الربط</small></div>
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
            <p>من زمن الأسطوانات إلى إصدارات اليوم، اكتشف الموسيقى العربية في أرشيف واحد، مرتب حسب الفنان والنوع والسنة.</p>
            <div className="search-box">
              <span className="search-symbol">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن أغنية، مطرب، ألبوم أو سنة..." aria-label="البحث في الأرشيف" />
              <kbd>بحث</kbd>
            </div>
            {query && <div className="search-hint">مطابقة التصنيفات: {filteredGenres.length} — البحث الشامل سيتفعّل بعد ربط مصادر البيانات.</div>}
          </div>
          <div className="hero-art" aria-hidden="true"><div className="vinyl"><div className="vinyl-center"><span>طَرَب</span><small>صوت الذاكرة</small></div></div><div className="art-caption">صوتٌ يعبر الزمن <span>— منذ البدايات</span></div></div>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><span className="section-kicker">تصفّح حسب الإحساس</span><h2>الأنواع الموسيقية</h2></div><span className="muted-count">{filteredGenres.length} تصنيفات</span></div>
          <div className="genre-grid">
            {filteredGenres.map((genre) => {
              const index = genres.indexOf(genre);
              return <button key={genre} onClick={() => setActiveGenre(genre)} className={activeGenre === genre ? 'genre-card selected' : 'genre-card'}><span className={`genre-art art-${index + 1}`}><i>{['♬','♫','♩','♭','♪','♮','♬','♩'][index]}</i></span><strong>{genre}</strong><small>استكشف اللون الموسيقي</small></button>;
            })}
            {filteredGenres.length === 0 && <p className="empty-filter">لا توجد تصنيفات مطابقة. جرّب كتابة الاسم بالعربية أو اختصر البحث.</p>}
          </div>
        </section>

        <section className="section-block decade-block">
          <div className="section-heading"><div><span className="section-kicker">رحلة عبر الزمن</span><h2>اختر العقد الموسيقي</h2></div></div>
          <div className="decade-list">{decades.map((decade) => <button key={decade} onClick={() => setActiveDecade(decade)} className={activeDecade === decade ? 'decade-chip selected' : 'decade-chip'}>{decade}<span>↗</span></button>)}</div>
        </section>

        <section className="catalog-state">
          <div className="catalog-icon">♫</div><div><span className="section-kicker">الخطوة التالية</span><h2>الأرشيف قيد التأسيس</h2><p>تم تجهيز هيكل الفهرسة والتصنيفات. ستظهر الأغاني هنا بعد ربط المصادر والتحقق من بيانات كل تسجيل وحقوق الاستماع.</p></div><div className="catalog-progress"><strong>01</strong><span>مصادر الموسيقى</span><small>مرحلة الربط والتحقق</small></div>
        </section>
        <footer><span>طَرَب — الأرشيف الموسيقي العربي</span><span>نحفظ الذاكرة، ونحترم حقوق أصحابها.</span></footer>
      </section>
    </main>
  );
}
