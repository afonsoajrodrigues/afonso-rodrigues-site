// Dados do Eurostat (prc_hpi_a, índice de preços da habitação) e do INE (índice
// de custo da construção de habitação nova), reindexados a 2020 = 100. Ver
// data/portugal_price_vs_cost.csv e data/europe_house_price_growth.csv.
window.housingCostData = {
  priceVsCost: {
    years: ['2020', '2021', '2022', '2023', '2024', '2025'],
    housePriceIndex: [100.0, 109.4, 123.2, 133.3, 145.4, 171.0],
    constructionCostIndex: [100.0, 108.8, 120.8, 122.9, 128.1, 133.2],
    seriesNames: { price: 'Índice de preços da habitação', cost: 'Índice de custo da construção' }
  },
  growthByCountry: [
    { label: 'Portugal', value: 71.0 },
    { label: 'Países Baixos', value: 49.3 },
    { label: 'Espanha', value: 41.6 },
    { label: 'Áustria', value: 23.5 },
    { label: 'Bélgica', value: 22.7 },
    { label: 'Itália', value: 15.7 },
    { label: 'Alemanha', value: 10.1 },
    { label: 'França', value: 9.1 }
  ],
  highlight: 'Portugal',
  mapStrings: {
    noData: 'Fora desta comparação',
    cagr: v => `${v}% ao ano, composto`,
    countryNames: {
      PT: 'Portugal', NL: 'Países Baixos', ES: 'Espanha', AT: 'Áustria',
      BE: 'Bélgica', IT: 'Itália', DE: 'Alemanha', FR: 'França'
    }
  }
};
