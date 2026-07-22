// Dados transcritos do INE / DGEEC, "Inquérito Comunitário à Inovação 2022-2024",
// publicado em 10 de julho de 2026. Percentagens de empresas com 10+ trabalhadores,
// salvo indicação em contrário.
window.innovationData = {
  trend: {
    periods: ['2016–18', '2018–20', '2020–22', '2022–24'],
    series: [
      { name: 'Qualquer atividade de inovação', values: [32.4, 48.0, 44.7, 42.5] },
      { name: 'Inovação de produto', values: [23.0, 22.3, 22.6, 24.3] },
      { name: 'Inovação de processo', values: [28.0, 42.7, 40.4, 37.6] }
    ]
  },
  whoInnovates: [
    { label: 'Todas as empresas', value: 42.5 },
    { label: 'Grandes empresas (250+ trabalhadores)', value: 78.7 },
    { label: 'Informação e comunicação', value: 68.9 },
    { label: 'Atividades financeiras e seguros', value: 59.7 }
  ],
  sectorChange: [
    { label: 'Indústria', value: 2.3 },
    { label: 'Todos os setores (média)', value: -2.2 },
    { label: 'Atividades financeiras e seguros', value: -5.9 },
    { label: 'Transportes e armazenagem', value: -8.3 }
  ],
  spendingByRegion: [
    { label: 'Grande Lisboa', value: 1950.8 },
    { label: 'Norte', value: 1713.5 },
    { label: 'Outras regiões', value: 1200.8 }
  ],
  ipInstruments: [
    { label: 'Registo de marca', value: 7.8 },
    { label: 'Segredos comerciais', value: 3.4 },
    { label: 'Pedido de patente', value: 1.9 },
    { label: 'Licenciamento de PI a terceiros', value: 1.6 },
    { label: 'Registo de desenho industrial', value: 1.3 }
  ],
  highlights: {
    segments: 'Grandes empresas (250+ trabalhadores)',
    spending: 'Grande Lisboa',
    ip: 'Registo de marca'
  }
};
