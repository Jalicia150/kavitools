"use client";

import { InvoiceData, calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from "@/lib/invoice";

export function generateInvoiceHTML(data: InvoiceData): string {
  const subtotal = calculateSubtotal(data.items);
  const tax = calculateTax(subtotal, data.taxRate);
  const total = calculateTotal(data.items, data.taxRate);

  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6">${item.description || "&mdash;"}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;text-align:center">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;text-align:right">${formatCurrency(item.rate)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;text-align:right">${formatCurrency(item.quantity * item.rate)}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Invoice ${data.invoiceNumber}</title>
<style>
  @page { size: A4; margin: 40px; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#1a1a1a; font-size:13px; line-height:1.5; }
  .invoice { max-width:800px; margin:0 auto; padding:40px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; }
  .title { font-size:32px; font-weight:800; color:#4f46e5; margin-bottom:4px; letter-spacing:-0.5px; }
  .inv-number { font-size:14px; color:#6b7280; }
  .meta { text-align:right; }
  .meta-label { font-size:10px; color:#6b7280; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px; }
  .meta-value { font-size:13px; margin-bottom:10px; }
  .parties { display:flex; justify-content:space-between; margin-bottom:32px; }
  .party { width:45%; }
  .party-title { font-size:10px; color:#6b7280; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-bottom:8px; }
  .party-name { font-weight:700; margin-bottom:2px; }
  .party-detail { color:#4b5563; font-size:12px; }
  table { width:100%; border-collapse:collapse; margin-bottom:24px; }
  th { font-size:10px; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; padding:8px 12px; border-bottom:2px solid #4f46e5; text-align:left; }
  th:nth-child(2) { text-align:center; }
  th:nth-child(3), th:nth-child(4) { text-align:right; }
  .totals { display:flex; justify-content:flex-end; }
  .totals-box { width:240px; }
  .total-row { display:flex; justify-content:space-between; padding:4px 0; font-size:13px; color:#6b7280; }
  .grand-total { display:flex; justify-content:space-between; border-top:2px solid #4f46e5; padding-top:8px; margin-top:6px; font-size:16px; font-weight:700; color:#4f46e5; }
  .notes { margin-top:32px; padding:16px; background:#f9fafb; border-radius:6px; }
  .notes-title { font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
  .notes-text { font-size:12px; color:#4b5563; }
  .footer { text-align:center; font-size:10px; color:#9ca3af; margin-top:48px; padding-top:16px; border-top:1px solid #f3f4f6; }
  @media print { body { print-color-adjust:exact; -webkit-print-color-adjust:exact; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div>
      <div class="title">INVOICE</div>
      <div class="inv-number">${data.invoiceNumber}</div>
    </div>
    <div class="meta">
      <div class="meta-label">Issue Date</div>
      <div class="meta-value">${data.issueDate}</div>
      <div class="meta-label">Due Date</div>
      <div class="meta-value">${data.dueDate}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-title">From</div>
      <div class="party-name">${data.senderName || "&mdash;"}</div>
      <div class="party-detail">${data.senderAddress || ""}</div>
      <div class="party-detail">${data.senderEmail || ""}</div>
    </div>
    <div class="party">
      <div class="party-title">Bill To</div>
      <div class="party-name">${data.clientName || "&mdash;"}</div>
      <div class="party-detail">${data.clientAddress || ""}</div>
      <div class="party-detail">${data.clientEmail || ""}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="total-row">
        <span>Subtotal</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      ${data.taxRate > 0 ? `<div class="total-row"><span>Tax (${data.taxRate}%)</span><span>${formatCurrency(tax)}</span></div>` : ""}
      <div class="grand-total">
        <span>Total</span>
        <span>${formatCurrency(total)}</span>
      </div>
    </div>
  </div>

  ${data.notes ? `<div class="notes"><div class="notes-title">Notes</div><div class="notes-text">${data.notes}</div></div>` : ""}

  <div class="footer">Generated with KaviTools &mdash; kavitools.vercel.app</div>
</div>
</body>
</html>`;
}

export function downloadInvoicePDF(data: InvoiceData): void {
  const html = generateInvoiceHTML(data);
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download your invoice.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}
