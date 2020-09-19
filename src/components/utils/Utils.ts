import { arrowUp, arrowDown, swapHorizontal } from "ionicons/icons";

// transaction header bg
export const headerBg = (type: string) => {
  switch (type) {
    case "buy":
      return "success";
    case "sell":
      return "danger";
    default:
      return "primary";
  }
};

// history icon selector
export const HistoryIconSelector = (type: string) => {
  switch (type) {
    case "withdrawal":
      return arrowUp;
    case "deposit":
      return arrowDown;
    default:
      return swapHorizontal;
  }
};

export const toCurrency = (
  amount: number | undefined,
  symbol?: string | undefined
) => {
  if (amount === undefined) {
    return "0.00";
  }
  if (symbol && symbol === "XRP") {
    return amount.toLocaleString("en-US", {
      style: "decimal",
      maximumFractionDigits: 4,
      minimumFractionDigits: 4,
    });
  }
  return amount.toLocaleString("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export const getInitials = (fullname: string) => {
  const names = fullname.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};
