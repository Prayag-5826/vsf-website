import {
  amountInWords,
  billMonthLabel,
  calculateBill,
  formatBillAmount,
  formatBillDate,
  type BillAdjustment,
  type BillItem
} from './invoice';

export interface BillCompany {
  name: string;
  pan: string;
  address: string;
  email: string;
  logoUrl?: string;
  sealUrl?: string;
}

export interface BillDocument {
  /** Empty for an unsaved draft. */
  billNo: string;
  /** yyyy-mm-dd */
  billDate: string;
  /** yyyy-mm (the month the bill is for) */
  billMonth: string;
  clientName: string;
  clientAddress: string;
  items: BillItem[];
  adjustments: BillAdjustment[];
}

const esc = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

// Minimum number of blank rows so a short bill still fills the page like the sample.
const MIN_BODY_HEIGHT_MM = 100;

const CSS = `
  @page { size: A4 portrait; margin: 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Calibri, "Segoe UI", Arial, sans-serif;
    font-size: 12px;
    color: #000;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet { max-width: 760px; margin: 0 auto; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .co-name { font-size: 18px; font-weight: 800; margin-top: 18px; letter-spacing: -0.2px; }
  .co-line { font-size: 11.5px; margin-top: 2px; }
  .co-line u { text-decoration: underline; font-weight: 700; }
  .head-right { text-align: center; min-width: 190px; }
  .bill-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; }
  .logo { height: 75px; max-width: 140px; object-fit: contain; }
  table { border-collapse: collapse; width: 100%; }

  .meta { border: 2px solid #000; border-bottom: 1px solid #000; margin-top: 10px; }
  .meta td { padding: 4px 6px; font-weight: 700; vertical-align: top; font-size: 11.5px; }
  .meta .lbl { width: 90px; }
  .meta .colon { width: 12px; text-align: center; }
  .meta .right { text-align: right; white-space: nowrap; }
  .gap { height: 28px; border: 1px solid #000; border-top: 0; }

  .items { border: 1px solid #000; border-top: 0; margin-top: 8px; }
  .items th { font-weight: 700; padding: 5px 4px; border-bottom: 1px solid #000; text-align: center; font-size: 11px; }
  .items th, .items td { border-left: 1px solid #000; }
  .items th:first-child, .items td:first-child { border-left: 0; }
  .items td { padding: 4px 6px; vertical-align: middle; text-align: center; font-size: 11.5px; }
  .items td.desc { text-align: left; font-weight: 700; padding-left: 12px; white-space: normal; }
  .items td.num { text-align: center; }
  .filler td { height: ${MIN_BODY_HEIGHT_MM}mm; border-bottom: 0; }

  .total-row td { border-top: 1px solid #000; font-weight: 700; padding: 4px 6px; text-align: center; }
  .total-row td.amt { font-weight: 700; text-align: right; }

  .adj { border: 1px solid #000; border-top: 0; }
  .adj td { padding: 2px 6px; font-size: 11px; }
  .adj .adj-box { min-height: 20mm; height: 22mm; vertical-align: top; }

  .grand { border: 1px solid #000; border-top: 0; font-weight: 800; }
  .grand td { padding: 5px 6px; text-align: right; font-size: 12.5px; }
  .grand td.amt { width: 18%; text-align: right; }

  .words { margin-top: 10px; font-size: 11px; }
  .words b { font-weight: 700; }

  /* Redesigned clean, centered Signature Block */
  .sign-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    page-break-inside: avoid;
  }
  .sign-box {
    width: 320px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .sign-box .for-title {
    font-size: 12px;
    font-weight: 800;
    color: #000;
    text-transform: uppercase;
    letter-spacing: -0.1px;
    line-height: 1.3;
    margin-bottom: 4px;
  }
  .sign-box .seal-wrap {
    min-height: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 6px 0;
  }
  .sign-box .seal-img {
    height: 85px;
    max-width: 170px;
    object-fit: contain;
    display: block;
  }
  .sign-box .sign-line {
    font-size: 12px;
    font-weight: 700;
    color: #000;
    border-top: 1px dashed #444;
    padding-top: 6px;
    width: 220px;
    margin: 0 auto;
  }
`;

export const buildBillHtml = (
  doc: BillDocument,
  company: BillCompany,
  opts: { autoPrint?: boolean } = {}
): string => {
  const totals = calculateBill(doc.items, doc.adjustments);
  const heading = `BILL ${billMonthLabel(doc.billMonth)}`.trim();

  const rows = totals.items
    .filter((it) => it.description.trim() || it.totalDays || it.rate)
    .map(
      (it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="desc">${esc(it.description)}</td>
        <td class="num">${esc(formatBillAmount(it.totalDays))}</td>
        <td class="num">${esc(it.qty)}</td>
        <td class="num">${esc(formatBillAmount(it.rate))}</td>
        <td class="num" style="text-align:right;">${esc(formatBillAmount(it.amount))}</td>
      </tr>`
    )
    .join('');

  const adjustmentRows = doc.adjustments
    .filter((a) => a.label.trim() || a.amount)
    .map(
      (a) => `
      <tr>
        <td>${esc(a.label)}</td>
        <td style="text-align:right;width:18%">${esc(formatBillAmount(a.amount))}</td>
      </tr>`
    )
    .join('');

  const colgroup = `
    <colgroup>
      <col style="width:6%">
      <col style="width:38%">
      <col style="width:14%">
      <col style="width:10%">
      <col style="width:14%">
      <col style="width:18%">
    </colgroup>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${esc(heading)} - ${esc(doc.clientName)}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="sheet">
    <div class="head">
      <div>
        <div class="co-name">${esc(company.name)}</div>
        <div class="co-line">PAN NO.<u>${esc(company.pan)}</u></div>
        <div class="co-line">OFF:- ${esc(company.address)}</div>
        <div class="co-line">Email:-${esc(company.email)}</div>
      </div>
      <div class="head-right">
        <div class="bill-title">${esc(heading)}</div>
        ${company.logoUrl ? `<img class="logo" src="${esc(company.logoUrl)}" alt="">` : ''}
      </div>
    </div>

    <table class="meta">
      <tr>
        <td class="lbl">Client Name</td><td class="colon">:</td><td>${esc(doc.clientName)}</td>
        <td class="right">Bill Date : ${esc(formatBillDate(doc.billDate))}</td>
      </tr>
      <tr>
        <td class="lbl">Address</td><td class="colon">:</td><td>${esc(doc.clientAddress)}</td>
        <td class="right">Bill No. : ${esc(doc.billNo)}</td>
      </tr>
    </table>
    <div class="gap"></div>

    <table class="items">
      ${colgroup}
      <thead>
        <tr>
          <th>S.no</th>
          <th>Description</th>
          <th>Total Days</th>
          <th>Qty</th>
          <th>Per Day Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="filler"><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        <tr class="total-row">
          <td colspan="2"></td>
          <td>${esc(formatBillAmount(totals.totalDays))}</td>
          <td></td>
          <td>Total Value</td>
          <td class="amt">${esc(formatBillAmount(totals.totalValue))}</td>
        </tr>
      </tbody>
    </table>

    <table class="adj"><tr><td class="adj-box">
      ${adjustmentRows ? `<table>${adjustmentRows}</table>` : ''}
    </td></tr></table>

    <table class="grand">
      <tr><td>Grand Total</td><td class="amt">${esc(formatBillAmount(totals.grandTotal))}</td></tr>
    </table>

    <div class="words"><b>Amount In Words:</b> ${esc(amountInWords(totals.grandTotal))}</div>

    <!-- Official Signature Block with Centered Large Seal -->
    <div class="sign-container">
      <div class="sign-box">
        <div class="for-title">For ${esc(company.name)}</div>
        <div class="seal-wrap">
          ${company.sealUrl ? `<img class="seal-img" src="${esc(company.sealUrl)}" alt="Official Stamp">` : '<div style="height:60px;"></div>'}
        </div>
        <div class="sign-line">Authorised Signature</div>
      </div>
    </div>
  </div>
  ${opts.autoPrint ? '<script>window.onload=function(){window.print();};</script>' : ''}
</body>
</html>`;
}
