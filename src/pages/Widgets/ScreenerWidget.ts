export const ScreenerWidgetScript =
  "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";

export const ScreenerWidget = (themeMode: string) => `
{
  "width": "100%",
  "height": "100%",
  "defaultColumn": "overview",
  "screener_type": "crypto_mkt",
  "displayCurrency": "USD",
  "colorTheme": "${themeMode}",
  "locale": "en"
}
`;
