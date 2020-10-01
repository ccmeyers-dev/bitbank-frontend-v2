export const MarketOverviewWidgetScript =
  "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";

export const MarketOverviewWidget = (themeMode: string) => `
{
    "title": "Cryptocurrencies",
    "title_raw": "Cryptocurrencies",
    "tabs": [
      {
        "title": "Overview",
        "title_raw": "Overview",
        "symbols": [
          {
            "s": "BITSTAMP:BTCUSD"
          },
          {
            "s": "BITSTAMP:ETHUSD"
          },
          {
            "s": "COINBASE:LTCUSD"
          },
          {
            "s": "BITSTAMP:XRPUSD"
          },
          {
            "s": "COINBASE:BCHUSD"
          },
          {
            "s": "BITFINEX:IOTUSD"
          }
        ],
        "quick_link": {
          "title": "More cryptocurrencies",
          "href": "/markets/cryptocurrencies/prices-all/"
        }
      },
      {
        "title": "Bitcoin",
        "title_raw": "Bitcoin",
        "symbols": [
          {
            "s": "BITSTAMP:BTCUSD"
          },
          {
            "s": "COINBASE:BTCEUR"
          },
          {
            "s": "COINBASE:BTCGBP"
          },
          {
            "s": "BITFLYER:BTCJPY"
          },
          {
            "s": "CEXIO:BTCRUB"
          },
          {
            "s": "CME:BTC1!"
          }
        ],
        "quick_link": {
          "title": "More Bitcoin pairs",
          "href": "/markets/cryptocurrencies/prices-bitcoin/"
        }
      },
      {
        "title": "Ethereum",
        "title_raw": "Ethereum",
        "symbols": [
          {
            "s": "COINBASE:ETHUSD"
          },
          {
            "s": "KRAKEN:ETHEUR"
          },
          {
            "s": "KRAKEN:ETHGBP"
          },
          {
            "s": "KRAKEN:ETHJPY"
          },
          {
            "s": "POLONIEX:ETHBTC"
          },
          {
            "s": "KRAKEN:ETHXBT"
          }
        ],
        "quick_link": {
          "title": "More Ethereum pairs",
          "href": "/markets/cryptocurrencies/prices-ethereum/"
        }
      },
      {
        "title": "Litecoin",
        "title_raw": "Litecoin",
        "symbols": [
          {
            "s": "COINBASE:LTCUSD"
          },
          {
            "s": "BITSTAMP:LTCEUR"
          },
          {
            "s": "BITSTAMP:LTCGBP"
          },
          {
            "s": "BITSTAMP:LTCBTC"
          },
          {
            "s": "HITBTC:LTCETH"
          },
          {
            "s": "KRAKEN:LTCXBT"
          }
        ],
        "quick_link": {
          "title": "More Bitcoin Cash pairs",
          "href": "/markets/cryptocurrencies/prices-bitcoin-cash/"
        }
      },
      {
        "title": "XRP",
        "title_raw": "XRP",
        "symbols": [
          {
            "s": "BITSTAMP:XRPUSD"
          },
          {
            "s": "KRAKEN:XRPEUR"
          },
          {
            "s": "KORBIT:XRPKRW"
          },
          {
            "s": "BITSO:XRPMXN"
          },
          {
            "s": "BINANCE:XRPBTC"
          },
          {
            "s": "BITTREX:XRPETH"
          }
        ],
        "quick_link": {
          "title": "More XRP pairs",
          "href": "/markets/cryptocurrencies/prices-xrp/"
        }
      }
    ],
    "title_link": "/markets/cryptocurrencies/prices-all/",
    "width": "100%",
    "height": "100%",
    "showChart": true,
    "locale": "en",
    "plotLineColorGrowing": "rgba(33, 150, 243, 1)",
    "plotLineColorFalling": "rgba(33, 150, 243, 1)",
    "belowLineFillColorGrowing": "rgba(33, 150, 243, 0.12)",
    "belowLineFillColorFalling": "rgba(33, 150, 243, 0.12)",
    "gridLineColor": "#F0F3FA",
    "scaleFontColor": "rgba(120, 123, 134, 1)",
    "symbolActiveColor": "rgba(33, 150, 243, 0.12)",
    "colorTheme": "${themeMode}"
  }
`;
