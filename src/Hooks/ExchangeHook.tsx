import usePlainRequest from "./PlainRequest";

interface ExchangeProp {
  usd: number;
  usd_24h_change: number;
}

export const useExchange = (symbol: string) => {
  let exchange: ExchangeProp;

  let market: string;
  if (symbol === "ETH") {
    market = "ethereum";
  } else if (symbol === "LTC") {
    market = "litecoin";
  } else if (symbol === "XRP") {
    market = "ripple";
  } else {
    market = "bitcoin";
  }

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${market}&vs_currencies=usd&include_24hr_change=true`;

  const { data } = usePlainRequest(url);

  if (data) {
    exchange = {
      usd: data[market].usd,
      usd_24h_change: data[market].usd_24h_change,
    };
  } else {
    exchange = {
      usd: 0.0,
      usd_24h_change: 0.0,
    };
  }

  return exchange;
};
