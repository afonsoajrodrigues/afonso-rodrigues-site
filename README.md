# Afonso Rodrigues — Photography & Data Journalism

Site-portfólio estático com direção visual editorial (jornal/broadsheet).
Alojado no GitHub Pages, domínio próprio `afonsoajrodrigues.com`.

## Estrutura

```
index.html, photography.html,       ← páginas em inglês (raiz)
investigations.html, about.html
pt/                                  ← as mesmas páginas em português
  index.html, photography.html,
  investigations.html, about.html
style.css                            ← sistema de design completo (variáveis CSS + responsivo)
motion.js                            ← scroll-reveal
images/
  Lisbon/, Istambul/,
  Night-out-in-coimbra/, thailand/   ← séries fotográficas, organizadas por local
scripts/optimize-images.sh           ← redimensiona/comprime JPEGs antes de subir novas fotos
sitemap.xml, robots.txt
.nojekyll                            ← desativa o Jekyll no GitHub Pages
```

Não há mais `i18n.js` — cada idioma tem os seus próprios ficheiros HTML
estáticos (melhor para SEO: o Google indexa cada URL no idioma certo via
tags `hreflang`), e o seletor EN·PT no masthead/rodapé é agora um link direto
para a página irmã no outro idioma.

## Adicionar novas fotos

```bash
# 1. copia as fotos para uma pasta em images/, ex. images/nome-do-local/
# 2. otimiza-as para a web (redimensiona + comprime in-place)
./scripts/optimize-images.sh images/nome-do-local
# 3. adiciona os <figure> correspondentes em photography.html e pt/photography.html
```

## Sistema de design

| Token | Valor |
|---|---|
| `--accent` | `#06402B` |
| `--paper` | `#FAFAF2` (fundo creme) |
| `--ink` | `#1B1813` (títulos) |
| `--hair` | `#D8CFBC` (filetes) |
| Display | Bodoni Moda |
| Corpo | Libre Baskerville |
| Meta / nav | Space Mono |

## O que está feito

- Layout editorial completo (masthead, hero com mapa interativo, "Recent work", ensaio em destaque, rodapé)
- Totalmente responsivo: breakpoints tablet (≤ 820 px) e mobile (≤ 480 px)
- Duas versões de idioma com URLs próprios (`/` em inglês, `/pt/` em português), ligadas por `hreflang`
- SEO on-page: `title`/`description` por página, canonical, Open Graph, Twitter Card, JSON-LD (`WebSite`, `Person`), `sitemap.xml`, `robots.txt`
- Mapa interativo de rendas via iframe (`portugal-rent-map`)
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
