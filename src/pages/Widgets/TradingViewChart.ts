export const TradingViewChart = (symbol: string, themeMode: string) => `
new TradingView.widget({
  "autosize": true,
  "symbol": "${symbol}",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "${themeMode}",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "container_id": "candlesticks",
})`;
