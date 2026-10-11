/**
 * Monthly bill (invoice) maths. Pure functions, no React or network, so they can be
 * shared by the office panel and the field app and tested on their own.
 *
 * Layout reference: the "BILL September-24" sample. A line is
 *   Amount = Total Days x Per Day Rate
 * where "Total Days" is the guard-days for the month (for example 2 guards x 89 days = 178),
 * and "Qty" is the number of people shown for information.
 */

export interface BillItem {
  description: string;
  totalDays: number;
  qty: number;
  rate: number;
}

export interface BillAdjustment {
  label: string;
  /** Positive adds to the bill (for example GST), negative deducts. */
  amount: number;
}

export interface BillTotals {
  items: Array<BillItem & { amount: number }>;
  totalDays: number;
  totalValue: number;
  adjustmentsTotal: number;
  grandTotal: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const toNum = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const lineAmount = (totalDays: number, rate: number): number => round2(toNum(totalDays) * toNum(rate));

export const calculateBill = (items: BillItem[], adjustments: BillAdjustment[] = []): BillTotals => {
  const lines = items.map((it) => ({ ...it, amount: lineAmount(it.totalDays, it.rate) }));
  const totalDays = round2(lines.reduce((s, l) => s + toNum(l.totalDays), 0));
  const totalValue = round2(lines.reduce((s, l) => s + l.amount, 0));
  const adjustmentsTotal = round2(adjustments.reduce((s, a) => s + toNum(a.amount), 0));
  return { items: lines, totalDays, totalValue, adjustmentsTotal, grandTotal: round2(totalValue + adjustmentsTotal) };
};

/* ------------------------------ dates and numbering ----------------------------- */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/** '2024-09' -> 'September-24' (the heading style on the sample bill). */
export const billMonthLabel = (isoMonth: string): string => {
  const m = /^(\d{4})-(\d{2})/.exec(isoMonth || '');
  if (!m) return '';
  const idx = Number(m[2]) - 1;
  if (idx < 0 || idx > 11) return '';
  return `${MONTHS[idx]}-${m[1].slice(2)}`;
};

/** Number of days in a month given '2024-09'. */
export const daysInBillMonth = (isoMonth: string): number => {
  const m = /^(\d{4})-(\d{2})/.exec(isoMonth || '');
  if (!m) return 30;
  return new Date(Number(m[1]), Number(m[2]), 0).getDate();
};

/** Indian financial year (April to March): 2026-10-05 -> '2026-27', 2027-02-01 -> '2026-27'. */
export const financialYear = (isoDate: string): string => {
  const m = /^(\d{4})-(\d{2})/.exec(isoDate || '');
  if (!m) return '';
  const start = Number(m[2]) >= 4 ? Number(m[1]) : Number(m[1]) - 1;
  return `${start}-${String(start + 1).slice(2)}`;
};

/** Monthly rate per person -> whole-rupee day rate for the chosen number of days. */
export const perDayFromMonthly = (monthlyRate: number, days: number): number =>
  days > 0 ? Math.round(toNum(monthlyRate) / days) : 0;

/** dd/mm/yyyy from yyyy-mm-dd. */
export const formatBillDate = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso || '';
};

/** Whole numbers print plainly (as on the sample); fractions keep two decimals. */
export const formatBillAmount = (n: number): string => {
  const v = round2(toNum(n));
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
};

/* ------------------------------- amount in words -------------------------------- */

const ONES = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven',
  'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const below100 = (n: number): string => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : ''));

const below1000 = (n: number): string => {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return [h ? `${ONES[h]} Hundred` : '', rest ? below100(rest) : ''].filter(Boolean).join(' ');
};

/** Whole number in the Indian system (thousand, lakh, crore). */
export const numberToIndianWords = (num: number): string => {
  let n = Math.floor(Math.abs(toNum(num)));
  if (n === 0) return 'Zero';

  const parts: string[] = [];
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;

  if (crore) parts.push(`${numberToIndianWords(crore)} Crore`);
  if (lakh) parts.push(`${below100(lakh)} Lakh`);
  if (thousand) parts.push(`${below100(thousand)} Thousand`);
  if (n) parts.push(below1000(n));
  return parts.join(' ');
};

/** 72980 -> 'Rupees Seventy Two Thousand Nine Hundred Eighty Only'. */
export const amountInWords = (amount: number): string => {
  const v = round2(Math.abs(toNum(amount)));
  const rupees = Math.floor(v);
  const paise = Math.round((v - rupees) * 100);
  const sign = toNum(amount) < 0 ? 'Minus ' : '';
  const base = `${sign}Rupees ${numberToIndianWords(rupees)}`;
  return paise ? `${base} and ${numberToIndianWords(paise)} Paise Only` : `${base} Only`;
};
