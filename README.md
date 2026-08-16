# Afonso Rodrigues — Data Journalism & Documentary Photography

Site-portfólio estático com direção visual editorial "Lighthouse Reports" —
filetes pretos, tipografia condensada, metadados em mono, edge-to-edge.
Alojado no GitHub Pages, domínio próprio `afonsoajrodrigues.com`.

## Estrutura

```
index.html, photography.html,          ← páginas em inglês (raiz)
investigations.html, about.html
investigations/*.html                  ← as 3 investigações, em inglês
pt/                                     ← as mesmas páginas em português
  index.html, photography.html,
  investigations.html, about.html
  investigations/*.html
style.css                               ← sistema de design completo (variáveis CSS + responsivo)
js/
  chrome.js                             ← toggle de tema/tamanho de texto, comum a todas as páginas
  rent-map.js, housing-cost-map.js      ← mapas coropléticos D3 (rendas / preços por país)
  innovation-charts.js,
  housing-cost-charts.js                ← gráficos D3 (linhas/barras)
  *-data-en.js, *-data-pt.js            ← dados + strings localizadas para os gráficos
data/                                   ← geojson/csv que alimentam os mapas e gráficos
images/
  Lisbon/, Istambul/,
  Night-out-in-coimbra/, thailand/      ← séries fotográficas, organizadas por local
scripts/optimize-images.sh              ← redimensiona/comprime JPEGs antes de subir novas fotos
scripts/export-for-substack.py          ← exporta uma investigação como pacote Substack (PNG + Markdown)
sitemap.xml, robots.txt
.nojekyll                               ← desativa o Jekyll no GitHub Pages
```

Não há `i18n.js` — cada idioma tem os seus próprios ficheiros HTML estáticos
(melhor para SEO: o Google indexa cada URL no idioma certo via tags
`hreflang`), e o seletor EN·PT na topbar/rodapé é um link direto para a
página irmã no outro idioma.

## Adicionar novas fotos

```bash
# 1. copia as fotos para uma pasta em images/, ex. images/nome-do-local/
# 2. otimiza-as para a web (redimensiona + comprime in-place)
./scripts/optimize-images.sh images/nome-do-local
# 3. adiciona os <figure class="contact-item"> correspondentes em
#    photography.html e pt/photography.html
```

## Sistema de design

Ver a secção "Sistema de design" em `CLAUDE.md` para o racional completo
(tokens claro/escuro, tipografia, layout edge-to-edge, controlos de leitura).
Resumo rápido:

| Token | Claro | Escuro |
|---|---|---|
| `--accent-fill` | `#1C4B8A` | `#1C4B8A` |
| `--accent` (texto, contraste recalculado em runtime) | `#1C4B8A` | `#6EA2E0` |
| `--paper` | `#FFFFFF` | `#0D0D0C` |
| `--ink` | `#0B0B0B` | `#F2F0EA` |
| `--muted` | `#55524D` | `#9C978E` |
| `--line` | `#0B0B0B` | `#3A3833` |
| `--rule` | `#C9C6BF` | `#2B2924` |
| `--card` | `#F1EFE9` | `#171614` |

Display + corpo: **Archivo**. Metadados/nav/UI: **IBM Plex Mono**.

## O que está feito

- Layout editorial edge-to-edge completo: header sticky, hero + lead com mapa
  interativo, "More from the desk", secção de fotografia + ensaio em
  destaque, secção "About", rodapé escuro
- Dark mode e escala de tamanho de texto (Aa−/Aa+), persistidos em
  `localStorage` (`js/chrome.js`)
- Totalmente responsivo: breakpoints ≤ 900 px e ≤ 560 px
- Duas versões de idioma com URLs próprios (`/` em inglês, `/pt/` em
  português), ligadas por `hreflang`
- SEO on-page: `title`/`description` por página, canonical, Open Graph,
  Twitter Card, JSON-LD (`WebSite`/`Article`/`Person`), `sitemap.xml`,
  `robots.txt`
- Mapa de rendas e mapa de preços por país (Europa) — D3 real, embutido
  diretamente no HTML, com zoom/pan e tooltip
- 5 gráficos D3 na investigação de inovação, 2 na de preços vs. custos de
  construção
- 3 investigações completas (housing crisis, house prices vs. construction
  costs, innovation boom), cada uma com template de artigo (TOC quando há
  secções, prosa central, rail lateral com "mais investigações")
- Fotografia organizada por série/local com lightbox acessível (teclado + foco)

## Deploy — GitHub Pages

1. Cria um repositório em github.com (ex.: `afonso-rodrigues-site`)
2. Segue os passos abaixo para fazer push:

```bash
git remote add origin https://github.com/afonsoajrodrigues/afonso-rodrigues-site.git
git push -u origin main
```

3. No repositório: **Settings → Pages → Deploy from a branch**, branch `main`, pasta `/ (root)`
4. O site fica em `https://afonsoajrodrigues.github.io/afonso-rodrigues-site/`

## Domínio próprio (Squarespace DNS)

No GitHub: **Settings → Pages → Custom domain** → escreve o domínio.
Na Squarespace (DNS):

| Tipo | Nome | Valor |
|---|---|---|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |
| CNAME | www | `afonsoajrodrigues.github.io` |

Depois ativa **Enforce HTTPS** no GitHub Pages.
Confirma sempre os IPs atuais em: [GitHub Docs — Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
