export const ExchangeWidget = (market: string, themeMode: string) => `
new TradingView.MediumWidget({
  symbols: [
    [
      "BITBAY:${market}USD|12m"
    ],

  ],
  chartOnly: false,
  width: "100%",
  height: "100%",
  locale: "en",
  colorTheme: "${themeMode}",
  gridLineColor: "#F0F3FA",
  trendLineColor: "#2196F3",
  fontColor: "#787B86",
  underLineColor: "#E3F2FD",
  isTransparent: false,
  autosize: true,
  container_id: "ticker",
})`;
