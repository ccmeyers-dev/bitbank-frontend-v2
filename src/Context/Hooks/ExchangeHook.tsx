import { useState, useEffect } from "react";
import axios from "axios";

interface ExchangeProp {
  usd: number;
  usd_24h_change: number;
}

export const useExchange = (symbol: string) => {
  const [exchange, setExchange] = useState<ExchangeProp>({
    usd: 0.0,
    usd_24h_change: 0.0,
  });

  useEffect(() => {
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

    axios
      .get(url)
      .then((res) => {
        const result = res.data[market];
        // console.log("hook", symbol, market, result);
        setExchange(result);
      })
      .catch((err) => {
        // console.log("error fetching exchange", err);
        setExchange({
          usd: 0.0,
          usd_24h_change: 0.0,
        });
      });
  }, [symbol]);

  return exchange;
};
