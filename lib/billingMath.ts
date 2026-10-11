export type ShiftType = '12_HOURS' | '8_HOURS';
export type RelieverType = 'PERCENT' | 'FIXED' | 'NIL';

export interface WageBreakdown {
  base: number;
  additional12Hrs: number;
  reliever: number;
  relieverLabel: string;
  gross: number;
  epf: number;
  esic: number;
  paidHoliday: number;
  uniform: number;
  lwf: number;
  ctc: number;
  agencyMargin: number;
  grandTotal: number;
}

export function calculateWageBreakup(
  baseWage: number,
  shift: ShiftType,
  relieverType: RelieverType,
  relieverCustomValue: number,
  marginPercent: number = 8
): WageBreakdown {
  const base = Number(baseWage) || 0;
  const additional12Hrs = shift === '12_HOURS' ? Math.round(base * 0.35) : 0;

  let reliever = 0;
  let relieverLabel = 'RELIEVER (16.67%)';

  if (relieverType === 'PERCENT') {
    const pct = Number(relieverCustomValue) || 16.67;
    reliever = Math.round((base + additional12Hrs) * (pct / 100));
    relieverLabel = `RELIEVER (${pct}%)`;
  } else if (relieverType === 'FIXED') {
    reliever = Number(relieverCustomValue) || 0;
    relieverLabel = 'RELIEVER (FIXED)';
  } else {
    reliever = 0;
    relieverLabel = 'NIL';
  }

  const gross = base + additional12Hrs + reliever;
  const epf = Math.round(base * 0.13); // 13% statutory employer
  const esic = Math.round(gross * 0.0325); // 3.25% statutory employer
  const paidHoliday = Math.round(base * 0.0384);
  const uniform = 250;
  const lwf = 10;

  const ctc = gross + epf + esic + paidHoliday + uniform + lwf;
  const agencyMargin = Math.round(ctc * ((Number(marginPercent) || 8) / 100));
  const grandTotal = ctc + agencyMargin;

  return {
    base,
    additional12Hrs,
    reliever,
    relieverLabel,
    gross,
    epf,
    esic,
    paidHoliday,
    uniform,
    lwf,
    ctc,
    agencyMargin,
    grandTotal
  };
}
