export function formatStripeDollar(input: number): string {
  return new Intl.NumberFormat("en-US", {
  style: "currency", currency: "usd"
  }).format(input);
}
