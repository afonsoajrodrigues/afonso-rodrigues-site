# Afonso Rodrigues — Photography & Data Journalism

Site-portfólio estático com direção visual editorial (jornal/broadsheet).  
Alojado no GitHub Pages. Desenvolvido com Claude Code.

## Estrutura

```
index.html          ← página principal
style.css           ← sistema de design completo (variáveis CSS + responsivo)
i18n.js             ← toggle EN / PT com objeto de traduções
images/
  above-the-haze.jpg    (Doi Suthep, Chiang Mai)
  night-kitchens.jpg    (Chinatown, Bangkok)
CLAUDE.md           ← contexto e tarefas para o Claude Code
.nojekyll           ← desativa o Jekyll no GitHub Pages
```

## Sistema de design

| Token | Valor |
|---|---|
| `--accent` | `#B5462A` (terracota) |
| `--paper` | `#F5F1E8` (fundo creme) |
| `--ink` | `#1B1813` (títulos) |
| `--hair` | `#D8CFBC` (filetes) |
| Display | Bodoni Moda |
| Corpo | Spectral |
| Meta / nav | Space Mono |

## O que está feito

- Layout editorial completo (masthead, hero com mapa interativo, "Recent work", ensaio em destaque, rodapé)
- Estilos extraídos para `style.css` com variáveis CSS e `clamp()` nos títulos
- Totalmente responsivo: breakpoints tablet (≤ 820 px) e mobile (≤ 480 px)
- Toggle EN · PT persistido em `localStorage`
- Mapa interativo de rendas via iframe (`portugal-rent-map`)

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
