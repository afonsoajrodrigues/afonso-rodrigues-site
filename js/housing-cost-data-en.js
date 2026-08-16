// Data from Eurostat (prc_hpi_a, house price index) and INE (construction cost
// index for new housing), re-based to 2020 = 100. See
// data/portugal_price_vs_cost.csv and data/europe_house_price_growth.csv.
window.housingCostData = {
  priceVsCost: {
    years: ['2020', '2021', '2022', '2023', '2024', '2025'],
    housePriceIndex: [100.0, 108.7, 118.1, 125.9, 135.4, 154.5],
    constructionCostIndex: [100.0, 108.8, 120.8, 122.9, 128.1, 133.2],
    seriesNames: { price: 'House-price index', cost: 'Construction-cost index' }
  },
  growthByCountry: [
    { label: 'Portugal', value: 54.5 },
    { label: 'Spain', value: 50.2 },
    { label: 'Netherlands', value: 44.9 },
    { label: 'Austria', value: 27.1 },
    { label: 'Italy', value: 26.2 },
    { label: 'Belgium', value: 23.1 },
    { label: 'Germany', value: 15.0 },
    { label: 'France', value: 13.2 }
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
