import { isInsurable, minimumDownPayment } from "./cmhc";

/** Numeric loan illustrations are not approval decisions. Check these before a positive verdict. */
export function purchaseEligibility({ price, down, amortYears, firstTime = false, newBuild = false }: {
  price: number; down: number; amortYears: number; firstTime?: boolean; newBuild?: boolean;
}) {
  if (![price, down, amortYears].every(Number.isFinite) || price <= 0 || down < 0 || down > price || amortYears <= 0) {
    return { eligible: false, reason: "Enter a valid price, down payment no greater than the price, and amortization." };
  }
  const insured = down < price * 0.2;
  if (down < minimumDownPayment(price) || (insured && !isInsurable(price, down))) {
    return { eligible: false, reason: "This purchase does not meet the minimum down payment or insured price rules." };
  }
  if (insured && (amortYears > 30 || (amortYears > 25 && !firstTime && !newBuild))) {
    return { eligible: false, reason: "Insured amortization over 25 years requires a first-time buyer or eligible new build and cannot exceed 30 years." };
  }
  return { eligible: true, reason: "" };
}
