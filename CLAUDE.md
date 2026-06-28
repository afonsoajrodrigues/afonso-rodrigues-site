# CLAUDE.md — contexto do projeto

Site-portfólio de **Afonso Rodrigues**, fotógrafo e jornalista de dados em Lisboa.
Direção visual: jornal/broadsheet editorial. Origem: mockup do Claude Design,
reproduzido fielmente em `index.html` (estilos inline).

## Sistema de design (manter consistente)

Cores
- accent (terracota):      `#06402B`
- accent-deep (ferrugem):  `#7E2912`
- paper (fundo creme):     `#FFFFF0`
- ivory (painéis):         `#FCFBF7`
- ink (texto/títulos):     `#1B1813`
- body (corpo):            `#332E26`
- muted (secundário):      `#6E665A`
- hair (filetes):          `#D8CFBC`
- paleta de dados (pontos/linhas): `#E0A867` `#B6471F` `#EAD9B8` `#7E2912` `#D07A3C`

Tipografia
- Display: **Bodoni Moda** (serifa; pesos 500/600; itálico para ênfase)
- Corpo:   **Spectral**
- Rótulos/metadados/nav: **Space Mono** (maiúsculas, letter-spacing largo)

Motivos recorrentes: filetes finos (`--hair`), regra dupla na navegação,
numeração de edição em numeração romana, capitular (drop cap) na entrada,
pontos de dados em tons quentes a representar municípios.

## Tarefas sugeridas (por ordem)

1. **Responsivo.** Extrair os estilos inline para uma folha de estilos com classes
   e variáveis CSS; adicionar breakpoints (tablet ~820px, telemóvel ~480px):
   a grelha de 3 colunas do "Recent work" passa a 1 coluna; a reportagem principal
   empilha; reduzir tamanhos de título com `clamp()`.
2. **Seletor EN · PT.** Ligar o toggle do masthead; manter os textos em ambos os
   idiomas (ex.: objeto de traduções) e alternar com JS.
3. **Visualizações reais.** Substituir o mapa "Median rent" (atualmente SVG
   ilustrativo) e os gráficos por visualizações interativas com dados reais do INE
   (D3, Plotly, Observable ou embed do Datawrapper/Flourish), mantendo a paleta.
4. **Conteúdo em dados.** Mover artigos, estatísticas e investigações para um
   ficheiro `content.js`/JSON, para o Afonso atualizar sem mexer no layout.
5. **Páginas/secções da navegação.** Criar Photography (galeria + lightbox),
   Investigations (índice), About e Index; ligar "View 24 frames" a uma página de
   ensaio.
6. **Mais fotografias.** Adicionar a `images/` e à galeria.
7. **Deploy.** GitHub Pages + domínio próprio (ver README).

## Notas

- As fontes vêm do Google Fonts (sem ficheiros de fonte no repositório).
- Há duas imagens reais em `images/`; o resto do design usa SVG ilustrativo.
- Preferir soluções estáticas (sem build) enquanto for alojado no GitHub Pages.
