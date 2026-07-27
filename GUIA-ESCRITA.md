# GUIA-ESCRITA.md — guia de escrita

Referência prática para escrever bem os textos deste projeto (peças de
investigação, legendas, texto de páginas) — morfologia, sintaxe, gramática,
estrutura jornalística e anti-padrões de texto gerado por IA. Consultar
**antes de rever um rascunho**, não só ao escrevê-lo de raiz. Síntese de
livros de estilo de referência (Reuters, Agência Lusa, NYT, WSJ, The
Guardian) e de fundamentos de linguística (Yule, *The Study of Language*;
Fromkin/Rodman/Hyams, *An Introduction to Language*; Nunes da Silva, *Manual
de Introdução aos Estudos Linguísticos*) — registado em 2026-07-27. Corrigir
à medida que a voz real se for confirmando na prática.

## 1. Estrutura da peça

- **Lead (rigor de agência — Reuters/Lusa)**: a primeira frase entrega o
  facto ou número principal, sem enrolar. Nada de abrir com contexto
  genérico antes do dado central. Tudo o que é afirmação vem atribuído a
  uma fonte explícita; distinguir sempre facto confirmado de alegação
  ("segundo", "alegadamente") — consistente com a doutrina
  FACTO/INFERÊNCIA/LACUNA usada nos workflows de investigação.
- **Estrutura das peças grandes (fórmula WSJ)**: quando os dados o
  permitem, abrir com um caso ou exemplo concreto que funcione como
  microcosmo do padrão maior (uma empresa, uma câmara, uma pessoa
  coletiva) — não abrir sempre com estatística. Segue-se o "nut graf" nos
  primeiros parágrafos, a explicar porque é que isto importa, antes de
  entrar nos dados em detalhe. Peças mais curtas (notícia normal) podem ir
  direto ao dado sem esta camada narrativa.
- **Frase a frase (clareza NYT)**: voz ativa em vez de passiva; linguagem
  direta em vez de eufemismo institucional ("a câmara gastou X" em vez de
  "houve uma despesa de X"); termos técnicos explicados na primeira
  ocorrência; sem juízos de valor embutidos em adjetivos — o facto fala
  por si.
- **Registo (Guardian, sem jargão)**: claro e acessível a um leitor geral,
  não especializado; frases e parágrafos curtos; nunca pomposo ou
  burocrático; nunca ao ponto de simplificar a perder rigor.
- **Idioma**: as peças destinam-se, à partida, a publicação em inglês — é
  a versão principal (`story.md`/`story.txt`). Mas produz sempre também a
  versão em português (`noticia.md`/`noticia.txt`), para publicar em
  ambas. As duas devem transmitir os mesmos factos e o mesmo rigor; não
  são uma tradução mecânica uma da outra — cada uma deve ler-se como
  escrita nativamente nessa língua. (Corrigido em 2026-07-27; antes o
  padrão era só português.)
- **Extensão da peça final** (`noticia.md`/`noticia.txt` e
  `story.md`/`story.txt`, não o README de trabalho da investigação, que
  pode ser mais longo): notícia normal ~3.000 carateres; notícia grande
  ~5.000; só uma grande reportagem (investigação com múltiplas
  fontes/ângulos) justifica ir até 10.000 — esse é o limite máximo, não o
  alvo por defeito. Confirmar sempre com `wc -m` em cada versão, não
  estimar.
- Público-alvo: geral, não especializado — mas disposto a ler dados/números
  se explicados com clareza.

## 2. Sintaxe

- **Ambiguidade estrutural**: mantém cada modificador (adjetivo, sintagma
  preposicional, data, oração) colado ao que modifica. "Aprovou o
  orçamento com o apoio da oposição em 2023" é ambíguo (o quê é de 2023?)
  — separa: "Em 2023, aprovou o orçamento, com o apoio da oposição."
- **Frases-jardim**: evita construções em que a leitura mais simples se
  revela errada a meio da frase, obrigando a reler — sobretudo em títulos
  e primeiras frases. O leitor fecha a leitura mais simples assim que
  pode; se a continuação a contraria, obriga a reler. Reordena ou pontua
  para que a primeira leitura possível já seja a correta.
- **Orações relativas encaixadas**: no máximo uma por frase. Se precisares
  de mais do que uma, parte em frases separadas.
- **Ordem canónica**: sujeito-verbo-objeto é o default em português;
  inverte só para dar ênfase deliberada, nunca por hábito de tradução do
  inglês.
- **Concordância à distância**: em frases longas com o sujeito separado do
  verbo por incisos, confirma a concordância pelo sujeito real, não pelo
  substantivo mais próximo ("O conjunto de medidas, aprovadas em várias
  sessões, *foi* — não *foram* — publicado").
- **Regência verbal e nominal**: confirma a preposição exigida pelo verbo
  ou nome em vez de usar a do inglês por analogia — "assistir a" (não
  "assistir o"), "obedecer a", "responder a", "preferir X a Y" (não "do
  que Y", embora esta forma já seja aceite em registo informal — evita-a
  em texto jornalístico).
- **Colocação pronominal (próclise/ênclise/mesóclise)**: em português
  europeu, próclise depois de palavra atrativa (advérbio, negação,
  conjunção subordinativa, pronome interrogativo/relativo — "não se
  sabe", "quando se decidiu"); ênclise no início de frase ou depois de
  vírgula ("Decidiu-se avançar."); mesóclise só em futuro/condicional
  formal e raramente necessária em texto jornalístico — prefere
  reformular.
- **Crase**: só antes de palavra feminina que admita "a" (artigo ou
  preposição) simultaneamente — "à câmara" (a+a), nunca antes de verbo, de
  palavra masculina, ou de pronome que não a admita ("a ela", não "à
  ela").
- **Vírgula**: nunca entre sujeito e verbo, nem entre verbo e complemento
  direto, mesmo em frases longas. Usa-a para isolar incisos, apostos, e
  orações adverbiais antepostas.

## 3. Morfologia

- Segue a norma padrão do português (Acordo Ortográfico) em texto
  jornalístico — é o registo esperado, não escolha estética. Preserva
  desvios apenas em citações diretas, sem normalizar a fala de uma fonte.
- Não cunhes neologismos por analogia superficial ("desburocratizável",
  "datificação") sem confirmar que o padrão de formação já é produtivo em
  português — prefere a forma atestada ou parafraseia.
- Confirma hifenização/aglutinação de compostos no dicionário/Acordo
  Ortográfico em vez de adivinhar pelo "que soa bem" ("guarda-chuva" mas
  "girassol"; sem regra visual fiável).
- Cuidado com falsos cognatos do inglês em textos técnicos/económicos:
  "eventualmente" (PT: por acaso; EN "eventually": no fim), "assumir" (PT:
  tomar posse/hipótese; EN "assume": pressupor — geralmente correto em PT
  também, mas confirma o sentido pretendido), "realizar" (PT: tornar
  real; EN "realize": aperceber-se — usa "aperceber-se de" ou "perceber").
- Plural de siglas e estrangeirismos: sigla não pluraliza com "s" agarrado
  em maiúsculas sem hífen problemático — prefere manter invariável ("os
  CEO", não "os CEOs") ou reformular; estrangeirismo não adaptado mantém
  o plural da língua de origem só se for de uso corrente, senão pluraliza
  à portuguesa.

## 4. Semântica e pragmática (rigor factual)

Base teórica: as máximas de Grice fundamentam a doutrina
FACTO/INFERÊNCIA/LACUNA usada nos workflows de investigação.

- **Quantidade**: dá exatamente a informação que o contexto pede — nem
  menos (vira lacuna por omissão) nem mais (dilui o facto central ou
  sugere ênfase não intencional).
- **Qualidade**: nunca escrevas como facto o que só tens como indício — é
  a fronteira entre FACTO e INFERÊNCIA.
- **Relação**: corta qualquer frase que não sirva diretamente o
  argumento — um facto lateral incluído "só porque é verdade" é lido pelo
  leitor como significativo mesmo sem essa intenção.
- **Maneira**: claro, breve, ordenado — sem ambiguidade nem prolixidade.
- **Denotação antes de conotação**: "aumentou 12%" em vez de "disparou" —
  a palavra carregada de juízo de valor impõe uma leitura que devia ser
  do leitor, não do texto.
- **Sentido vs. referência**: um cargo ("o presidente da câmara") e um
  nome próprio nem sempre são intercambiáveis — confirma que a descrição
  ainda é verdadeira no momento em que publicas.
- **Entailment vs. implicatura**: só afirma como facto o que a frase
  implica logicamente (entailment, sempre verdadeiro); o resto é
  inferência/sugestão cancelável (implicatura) e marca-se como tal
  (FACTO/INFERÊNCIA/LACUNA).
- **Pressuposição**: confirma que o facto pressuposto por uma frase ou
  pergunta ("a razão do atraso", "porque voltou a subir") está de facto
  estabelecido antes de o escreveres — senão induzes o leitor em erro sem
  mentir tecnicamente.
- **Dêixis**: troca "atualmente", "esta semana", "aqui" por datas e
  lugares absolutos — o texto é lido a qualquer momento.
- **Desambiguação lexical**: qualquer termo polissémico ("taxa", "carga",
  "capital") precisa de contexto imediato que fixe o sentido — não deixes
  ao leitor a tarefa de escolher.
- **Atos de fala**: em citações, o verbo introdutório carrega força
  ilocutória ("acusou", "negou", "prometeu") — usa-o com precisão em vez
  de um "disse" genérico quando essa força for parte do facto noticiável.

## 5. Discurso e registo

- **Cadeias de referência**: um pronome só substitui um antecedente
  quando não há ambiguidade possível sobre a quem/o quê se refere.
- **Coesão não é coerência**: liga frases com "no entanto", "por isso"
  quando a relação lógica não for óbvia por si só — mas o teste final é
  se o parágrafo faz sentido reconstruído de cabeça, não se tem
  conectores.
- **Jargão e siglas**: jargão só depois de explicado na primeira
  ocorrência; sigla por extenso + sigla entre parênteses na primeira
  menção. Traduz sempre a linguagem técnica da fonte para o registo do
  leitor geral, nunca o inverso.

## 6. Marcas de escrita gerada por IA a evitar

Estas são as marcas mais reconhecíveis de texto gerado por LLM — mecânicas,
não de conteúdo. Evitá-las não é só estética: um texto com estes tiques
lê-se como não-humano mesmo quando o conteúdo está correto.

- **Tríades automáticas**: "rápido, eficiente e escalável"; "claro, direto
  e rigoroso" — a IA agrupa adjetivos/ações em três quase por reflexo. Usa
  um só, ou dois, se ambos carregarem informação distinta; corta o
  terceiro se só está lá para completar o ritmo.
- **"Não só X, mas também Y"**: quase sempre X e Y cabem numa frase mais
  simples ou X é dispensável. Reescreve direto: "Y" (se X for óbvio) ou
  "X e Y" (se ambos importarem).
- **Falsas transições de peso** ("além disso", "no entanto", "é
  importante notar/salientar que", "vale a pena mencionar", "em suma",
  "posto isto"): usa-as só quando a relação lógica entre frases não for
  óbvia sem elas — o teste é reler sem o conector; se o sentido não muda,
  corta.
- **Hedging vazio**: "pode potencialmente", "é possível que, em certos
  casos", "tende a sugerir" quando não há incerteza real por trás — ou
  tens a informação (afirma) ou não tens (marca como LACUNA/INFERÊNCIA
  explicitamente), não dilui com advérbios de cobertura.
- **Intensificadores sem dado**: "significativamente", "substancialmente",
  "notavelmente", "extremamente" sem o número ao lado. Substitui pelo
  valor concreto ("subiu 12%", não "subiu significativamente").
- **Vocabulário corporativo/buzzword**: "robusto", "holístico",
  "sinergia", "alavancar", "otimizar", "panorama", "desbloquear",
  "elevar", "capacitar", "navegar [um problema]" — nenhum destes é
  natural em português jornalístico; usa o verbo concreto que descreve a
  ação real.
- **Abertura genérica de contexto universal** ("Na era digital de
  hoje...", "Com o avanço da tecnologia...", "É cada vez mais comum..."):
  começa sempre pelo facto ou número concreto (lead de agência), nunca
  por uma generalização que serviria para qualquer texto sobre qualquer
  tema.
- **Fecho que repete a abertura** ("Em suma, como vimos, X é importante
  porque..."): corta. Um texto jornalístico não precisa de resumir-se a
  si próprio no fim; termina no último facto relevante ou numa limitação.
- **Simetria excessiva**: parágrafos todos do mesmo comprimento, listas
  onde cada item tem a mesma estrutura gramatical rígida ("verbo +
  objeto + advérbio" repetido cinco vezes). Varia o ritmo — frases curtas
  a seguir a longas — como faria um autor humano.
- **Bold/títulos a mais dentro de prosa corrida**: negrito em cada
  substantivo-chave de uma lista é tique de IA a "ajudar" o leitor a
  escanear. Usa negrito só onde já usarias em texto humano (raro, para
  destacar mesmo o essencial).
- **Excesso de listas onde prosa seria mais natural**: se os itens têm
  relação lógica entre si (não são só enumeração solta), escreve em
  parágrafo com conectores reais, não em bullets — bullets escondem a
  falta de argumento construído.
- **Atribuição vaga** ("estudos mostram", "especialistas apontam",
  "segundo dados recentes"): sem fonte nomeada e datada, isto é uma
  LACUNA, não um facto — nomeia sempre a fonte específica (consistente
  com a doutrina FACTO/INFERÊNCIA/LACUNA do projeto).
- **Travessão a mais em português**: o inglês usa em dash livremente, o
  português não. Prefere vírgula, dois pontos, parênteses, ou frases
  separadas — guarda o travessão só para os casos em que nenhuma dessas
  alternativas resolve a ambiguidade. Esta restrição é só para a versão
  em português; em inglês o travessão (em dash) é idiomático e pode
  usar-se com mais liberdade. (Corrigido em 2026-07-27.)
- **Redundância parafraseada**: dizer a mesma coisa duas vezes com
  palavras diferentes para parecer mais completo ("A câmara aumentou a
  despesa. Ou seja, gastou mais dinheiro do que antes."). Corta a segunda
  frase se não acrescentar informação nova.

## 7. Checklist rápido de revisão

Antes de dar um texto como terminado, relê e confirma:

- [ ] A primeira frase entrega o facto/número principal, não contexto
      genérico.
- [ ] Nenhuma tríade de adjetivos/ações só por ritmo; corta o terceiro
      elemento onde não acrescentar informação.
- [ ] Nenhum intensificador ("significativamente", "muito") sem o número
      ao lado.
- [ ] Nenhuma transição ("além disso", "no entanto", "é importante notar")
      sobrevive ao teste de a remover e reler.
- [ ] Nenhum verbo/substantivo de vocabulário corporativo (secção 6).
- [ ] Sem ambiguidade estrutural, frases-jardim, ou mais de uma relativa
      encaixada por frase.
- [ ] Concordância e regência conferidas em frases longas com incisos.
- [ ] Crase e colocação pronominal corretas.
- [ ] Travessão em português só onde nada mais resolve a ambiguidade.
- [ ] Fecho não repete a abertura em forma de resumo.
- [ ] Toda a afirmação numérica tem fonte nomeada e datada; sem isso,
      marcada como LACUNA.
- [ ] Versão em inglês e versão em português lidas cada uma como escrita
      nativamente nessa língua, não como tradução mecânica uma da outra.
- [ ] Extensão confirmada com `wc -m`, não estimada, dentro do limite da
      secção 1.

## Valores editoriais

- _(ex.: mostrar sempre o trabalho — código e dados disponíveis; nunca
  publicar um número sem conseguir explicar de onde veio)_
