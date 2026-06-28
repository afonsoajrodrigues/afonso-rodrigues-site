// Keys whose values contain HTML tags (<em>, <span>) and must use innerHTML.
// Everything else uses textContent — safer against accidental XSS if translations grow.
const HTML_KEYS = new Set(['hero-title', 'hero-intro']);

const translations = {
  en: {
    'topbar-location': 'Afonso Rodrigues — Lisbon',
    'topbar-date':     '27 June 2026',
    'tagline-text':    'Photography & Data Journalism',
    'nav-photography':    'Photography',
    'nav-investigations': 'Investigations',
    'nav-data':           'Data',
    'nav-about':          'About',
    'nav-index':          'Index',
    'hero-label': 'Nº 03 — Investigation · Interactive map',
    'hero-title': 'Portugal’s housing crisis reaches new <em>extremes</em>',
    'hero-intro': '<span class="drop-cap">T</span>he median rent for a one-bedroom flat in Lisbon now stands at around <em>€784 a month</em> — swallowing 85% of a minimum-wage pay check. We mapped the price of a home across every municipality in the country.',
    'byline-name': 'By Afonso Rodrigues — reporting & graphics',
    'byline-cta':  'Explore the map →',
    'stat-label-1': 'National median /m²',
    'stat-label-2': 'Year over year',
    'stat-label-3': 'Lisbon, highest',
    'map-label':  'Median rent',
    'map-source': 'Median rent, €/m², Q1 2026. Hover a municipality for detail. Source: INE.',
    'section-title': 'Recent work',
    'section-sub':   'Trabalhos recentes',
    'work-tag-1':    'Photo Essay · Chiang Mai',
    'work-title-1':  'Above the Haze',
    'work-desc-1':   'A quiet hour at Doi Suthep, looking down on a valley the season keeps half-hidden.',
    'work-tag-2':    'Investigation · Data',
    'work-title-2':  'The Long Commute',
    'work-desc-2':   'As rents climb, workers move further out. We tracked the widening gap between home and job.',
    'work-tag-3':    'Photo Essay · Bangkok',
    'work-title-3':  'Night Kitchens',
    'work-desc-3':   'After dark, Chinatown’s lanes become a chain of lit rooms feeding the city until dawn.',
    'essay-label': 'Featured Photo Essay — Nº 01',
    'essay-title': 'The hours the city keeps',
    'essay-cta':   'View 24 frames →',
    'footer-bio':          'Documentary photography and data-driven investigations. Based in Lisbon, working worldwide.',
    'footer-nav-navigate': 'Navigate',
    'footer-nav-inv':      'Investigations',
    'footer-nav-contact':  'Contact',
    'footer-link-photo':   'Photography',
    'footer-link-inv':     'Investigations',
    'footer-link-about':   'About',
    'footer-link-index':   'Index',
    'footer-link-price':   'The Price of a Home',
    'footer-link-commute': 'The Long Commute',
    'footer-link-salt':    'Salt & Tide',
    'footer-copyright':    '© MMXXVI Afonso Rodrigues',
    'footer-coords':       'Lisbon · 38.72° N, 9.14° W',
  },
  pt: {
    'topbar-location': 'Afonso Rodrigues — Lisboa',
    'topbar-date':     '27 junho 2026',
    'tagline-text':    'Fotografia & Jornalismo de Dados',
    'nav-photography':    'Fotografia',
    'nav-investigations': 'Investigações',
    'nav-data':           'Dados',
    'nav-about':          'Sobre',
    'nav-index':          'Índice',
    'hero-label': 'Nº 03 — Investigação · Mapa interativo',
    'hero-title': 'A crise habitacional em Portugal atinge novos <em>extremos</em>',
    'hero-intro': '<span class="drop-cap">A</span> renda mediana de um T1 em Lisboa situa-se atualmente em cerca de <em>€784 por mês</em> — consumindo 85% do salário mínimo. Mapámos o preço de uma casa em todos os municípios do país.',
    'byline-name': 'Por Afonso Rodrigues — reportagem & gráficos',
    'byline-cta':  'Explorar o mapa →',
    'stat-label-1': 'Mediana nacional /m²',
    'stat-label-2': 'Ano sobre ano',
    'stat-label-3': 'Lisboa, mais alto',
    'map-label':  'Renda mediana',
    'map-source': 'Renda mediana, €/m², T1 2026. Passe o rato sobre um município para ver detalhes. Fonte: INE.',
    'section-title': 'Trabalhos recentes',
    'section-sub':   'Recent work',
    'work-tag-1':    'Ensaio Fotográfico · Chiang Mai',
    'work-title-1':  'Above the Haze',
    'work-desc-1':   'Uma hora calma no Doi Suthep, a olhar para um vale que a estação mantém meio escondido.',
    'work-tag-2':    'Investigação · Dados',
    'work-title-2':  'A Longa Deslocação',
    'work-desc-2':   'Com as rendas a subir, os trabalhadores afastam-se. Acompanhámos o fosso crescente entre casa e emprego.',
    'work-tag-3':    'Ensaio Fotográfico · Banguecoque',
    'work-title-3':  'Cozinhas Noturnas',
    'work-desc-3':   'Depois do escurecer, as ruas da Chinatown tornam-se uma cadeia de quartos iluminados a alimentar a cidade até ao amanhecer.',
    'essay-label': 'Ensaio Fotográfico em Destaque — Nº 01',
    'essay-title': 'As horas que a cidade guarda',
    'essay-cta':   'Ver 24 fotografias →',
    'footer-bio':          'Fotografia documental e investigações baseadas em dados. Sediado em Lisboa, a trabalhar em todo o mundo.',
    'footer-nav-navigate': 'Navegar',
    'footer-nav-inv':      'Investigações',
    'footer-nav-contact':  'Contacto',
    'footer-link-photo':   'Fotografia',
    'footer-link-inv':     'Investigações',
    'footer-link-about':   'Sobre',
    'footer-link-index':   'Índice',
    'footer-link-price':   'O Preço de uma Casa',
    'footer-link-commute': 'A Longa Deslocação',
    'footer-link-salt':    'Sal & Maré',
    'footer-copyright':    '© MMXXVI Afonso Rodrigues',
    'footer-coords':       'Lisboa · 38.72° N, 9.14° W',
  },
};

let currentLang = localStorage.getItem('ar-lang') || 'en';

function applyLang(lang) {
  const t = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] === undefined) return;
    // Use innerHTML only for the two keys that contain actual HTML markup.
    if (HTML_KEYS.has(key)) {
      el.innerHTML = t[key];
    } else {
      el.textContent = t[key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang;
  currentLang = lang;
  localStorage.setItem('ar-lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'pt' : 'en');
    });
  });

  applyLang(currentLang);
});
