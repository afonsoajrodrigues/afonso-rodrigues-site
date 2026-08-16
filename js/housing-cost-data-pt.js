// Dados do Eurostat (prc_hpi_a, índice de preços da habitação) e do INE (índice
// de custo da construção de habitação nova), reindexados a 2020 = 100. Ver
// data/portugal_price_vs_cost.csv e data/europe_house_price_growth.csv.
window.housingCostData = {
  priceVsCost: {
    years: ['2020', '2021', '2022', '2023', '2024', '2025'],
    housePriceIndex: [100.0, 108.7, 118.1, 125.9, 135.4, 154.5],
    constructionCostIndex: [100.0, 108.8, 120.8, 122.9, 128.1, 133.2],
    seriesNames: { price: 'Índice de preços da habitação', cost: 'Índice de custo da construção' }
  },
  growthByCountry: [
    { label: 'Portugal', value: 54.5 },
    { label: 'Espanha', value: 50.2 },
    { label: 'Países Baixos', value: 44.9 },
    { label: 'Áustria', value: 27.1 },
    { label: 'Itália', value: 26.2 },
    { label: 'Bélgica', value: 23.1 },
    { label: 'Alemanha', value: 15.0 },
    { label: 'França', value: 13.2 }
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
