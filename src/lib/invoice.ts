import { isPro } from "@/lib/pro";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  // Sender
  senderName: string;
  senderAddress: string;
  senderEmail: string;
  // Client
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  // Invoice details
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  // Items
  items: LineItem[];
  // Tax & notes
  taxRate: number;
  notes: string;
}

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

export function calculateTotal(items: LineItem[], taxRate: number): number {
  const subtotal = calculateSubtotal(items);
  return subtotal + calculateTax(subtotal, taxRate);
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const r = Math.floor(Math.random() * 9000 + 1000);
  return `INV-${y}${m}-${r}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// localStorage invoice count tracking
const STORAGE_KEY = "kavitools_invoice_count";
const MONTH_KEY = "kavitools_invoice_month";
const FREE_LIMIT = 3;

export function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}`;
}

export function getInvoiceCount(): number {
  if (typeof window === "undefined") return 0;
  const month = localStorage.getItem(MONTH_KEY);
  if (month !== getMonthKey()) {
    localStorage.setItem(MONTH_KEY, getMonthKey());
    localStorage.setItem(STORAGE_KEY, "0");
    return 0;
  }
  return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
}

export function incrementInvoiceCount(): void {
  if (typeof window === "undefined") return;
  const current = getInvoiceCount();
  localStorage.setItem(STORAGE_KEY, (current + 1).toString());
  localStorage.setItem(MONTH_KEY, getMonthKey());
}

export function canCreateInvoice(): boolean {
  if (isPro()) return true;
  return getInvoiceCount() < FREE_LIMIT;
}

export function remainingInvoices(): number {
  if (isPro()) return Infinity;
  return Math.max(0, FREE_LIMIT - getInvoiceCount());
}
