// Data from Eurostat (prc_hpi_a, house price index) and INE (construction cost
// index for new housing), re-based to 2020 = 100. See
// data/portugal_price_vs_cost.csv and data/europe_house_price_growth.csv.
window.housingCostData = {
  priceVsCost: {
    years: ['2020', '2021', '2022', '2023', '2024', '2025'],
    housePriceIndex: [100.0, 109.4, 123.2, 133.3, 145.4, 171.0],
    constructionCostIndex: [100.0, 108.8, 120.8, 122.9, 128.1, 133.2],
    seriesNames: { price: 'House-price index', cost: 'Construction-cost index' }
  },
  growthByCountry: [
    { label: 'Portugal', value: 71.0 },
    { label: 'Netherlands', value: 49.3 },
    { label: 'Spain', value: 41.6 },
    { label: 'Austria', value: 23.5 },
    { label: 'Belgium', value: 22.7 },
    { label: 'Italy', value: 15.7 },
    { label: 'Germany', value: 10.1 },
    { label: 'France', value: 9.1 }
  ],
  highlight: 'Portugal',
  mapStrings: {
    noData: 'Not in this comparison',
    cagr: v => `${v}% a year, compound`,
    countryNames: {
      PT: 'Portugal', NL: 'Netherlands', ES: 'Spain', AT: 'Austria',
      BE: 'Belgium', IT: 'Italy', DE: 'Germany', FR: 'France'
    }
  }
};
