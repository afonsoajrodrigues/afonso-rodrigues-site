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
    // investigations.html
    'inv-page-label':  'Section — Investigations',
    'inv-page-title':  'Investigations',
    'inv-body-1':      'The median rent for a one-bedroom flat in Lisbon now stands at around €784 a month — swallowing 85% of a minimum-wage pay check. Portugal's housing market has undergone a generational transformation. Between 2016 and 2026, the median rent per square metre rose by 74% nationally — outpacing wage growth by a factor of four.',
    'inv-body-2':      'The data, drawn from INE's quarterly rent index, shows a clear divide between inland and coastal Portugal. Municipalities in the Alentejo interior remain relatively affordable — the district median sits at €4.20/m² — while Greater Lisbon has crossed the €14/m² threshold for the first time. The gap has widened every year since 2019.',
    'inv-more-label':  'More investigations',
    'inv-salt-tag':    'Investigation · Environment',
    'inv-salt-desc':   'The coastal saltpans of Setúbal are disappearing. We documented what is being lost, and why it matters.',
    // photography.html
    'photo-page-label': 'Section — Photography',
    'photo-page-title': 'Photography',
    'photo-intro':      'Documentary photography across Southeast Asia, Europe and beyond. Each series is a slow accumulation — returning to the same places, the same hours, until something reveals itself.',
    'gallery-cta-essay': 'View essay →',
    'series-label-thai': 'Photo Series — Thailand',
    'series-title-thai': 'Thailand, 2025',
    'loc-bangkok':       'Bangkok',
    'loc-chiang-mai':    'Chiang Mai',
    'loc-damnoen':       'Damnoen Saduak',
    'loc-maeklong':      'Maeklong',
    'thai-bkk-1-desc': 'Layered rooflines and mosaic chedis at Wat Pho under a cloudless morning sky.',
    'thai-bkk-2-desc': 'A gardener sweeps between palms as a temple spire rises above the grounds.',
    'thai-bkk-3-desc': "A tuk-tuk idles near the riverfront as Bangkok's old town stretches behind.",
    'thai-bkk-4-desc': 'Welding sparks light a backstreet pavement late at night.',
    'thai-bkk-5-desc': 'A motorcyclist stops at a KBank ATM — the only green light on a dark street past midnight.',
    'thai-bkk-6-desc': 'Two people share a pavement moment as a taxi waits at the corner.',
    'thai-cm-1-desc':  'Nimman Road stretches toward Doi Suthep as the last light drains from the sky.',
    'thai-cm-2-desc':  'Afternoon light cuts through the textile stalls at Warorot Market.',
    'thai-ds-1-desc':  'A rower guides her boat into the heart of Damnoen Saduak floating market.',
    'thai-ds-2-desc':  'Vendor boats queue beneath a canal bridge as the afternoon heat settles.',
    'thai-ds-3-desc':  'A market vendor rests between sales, her face half-shadowed by a wide-brimmed hat.',
    'thai-mk-1-desc':  'Tourists press back against the stalls as the daily train pushes through Maeklong market.',
    'thai-mk-2-desc':  'The same ritual repeated at dusk — the market folding, the train arriving out of the haze.',
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
    // investigations.html
    'inv-page-label':  'Secção — Investigações',
    'inv-page-title':  'Investigações',
    'inv-body-1':      'A renda mediana de um T1 em Lisboa situa-se atualmente em cerca de €784 por mês — consumindo 85% do salário mínimo. O mercado habitacional português sofreu uma transformação geracional. Entre 2016 e 2026, a renda mediana por metro quadrado subiu 74% a nível nacional — ultrapassando o crescimento salarial por um fator de quatro.',
    'inv-body-2':      'Os dados, recolhidos do índice trimestral de rendas do INE, mostram uma divisão clara entre o interior e o litoral de Portugal. Os municípios do Alentejo interior mantêm-se relativamente acessíveis — a mediana do distrito situa-se nos €4,20/m² — enquanto a Grande Lisboa ultrapassou pela primeira vez o limiar dos €14/m². O fosso tem vindo a alargar-se todos os anos desde 2019.',
    'inv-more-label':  'Mais investigações',
    'inv-salt-tag':    'Investigação · Ambiente',
    'inv-salt-desc':   'As salinas costeiras de Setúbal estão a desaparecer. Documentámos o que se perde e por que razão isso importa.',
    // photography.html
    'photo-page-label': 'Secção — Fotografia',
    'photo-page-title': 'Fotografia',
    'photo-intro':      'Fotografia documental pelo Sudeste Asiático, Europa e além. Cada série é uma acumulação lenta — regressando aos mesmos lugares, às mesmas horas, até que algo se revela.',
    'gallery-cta-essay': 'Ver ensaio →',
    'series-label-thai': 'Série Fotográfica — Tailândia',
    'series-title-thai': 'Tailândia, 2025',
    'loc-bangkok':       'Bangkok',
    'loc-chiang-mai':    'Chiang Mai',
    'loc-damnoen':       'Damnoen Saduak',
    'loc-maeklong':      'Maeklong',
    'thai-bkk-1-desc': 'Telhados sobrepostos e chedis em mosaico no Wat Pho sob um céu sem nuvens.',
    'thai-bkk-2-desc': 'Um jardineiro varre entre palmeiras enquanto uma agulha de templo se ergue ao fundo.',
    'thai-bkk-3-desc': 'Um tuk-tuk descansa junto ao rio enquanto a cidade velha de Bangkok se estende ao fundo.',
    'thai-bkk-4-desc': 'Faíscas de soldadura iluminam um passeio de rua de trás alta noite.',
    'thai-bkk-5-desc': 'Um motociclista pára numa caixa multibanco — a única luz verde numa rua escura depois da meia-noite.',
    'thai-bkk-6-desc': 'Dois desconhecidos partilham um momento no passeio enquanto um táxi aguarda na esquina.',
    'thai-cm-1-desc':  'A Nimman Road estende-se em direcção ao Doi Suthep quando a última luz abandona o céu.',
    'thai-cm-2-desc':  'A luz da tarde corta pelas bancas de têxteis do Mercado Warorot.',
    'thai-ds-1-desc':  'Uma remadora guia o barco para o coração do mercado flutuante de Damnoen Saduak.',
    'thai-ds-2-desc':  'Barcos de vendedores alinham-se sob uma ponte do canal enquanto o calor da tarde pousa na água.',
    'thai-ds-3-desc':  'Uma vendedora descansa entre vendas, o rosto meio na sombra do chapéu de abas largas.',
    'thai-mk-1-desc':  'Turistas recuam para as bancas quando o comboio diário atravessa o mercado de Maeklong.',
    'thai-mk-2-desc':  'O mesmo ritual ao crepúsculo — o mercado a fechar-se, o comboio a surgir da neblina.',
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
