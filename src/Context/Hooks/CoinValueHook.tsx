import { useExchange } from "./ExchangeHook";

export const useCoinValue = (symbol: string, amount: number) => {
  const { usd: rate } = useExchange(symbol);

  let result = (amount / rate).toFixed(8);

  if (rate === 0) {
    result = "0.00000000";
  }
  // console.log(rate, symbol, amount, result);

  return result;
};
