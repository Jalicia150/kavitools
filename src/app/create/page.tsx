"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { InvoiceData, LineItem } from "@/lib/invoice";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
  generateInvoiceNumber,
  incrementInvoiceCount,
  canCreateInvoice,
  remainingInvoices,
} from "@/lib/invoice";
import { isPro, setProStatus } from "@/lib/pro";
import { getBranding, saveBranding, type BrandingSettings } from "@/lib/branding";
import { downloadInvoicePDF } from "@/components/InvoiceHTML";

function newItem(): LineItem {
  return {
    id: Math.random().toString(36).slice(2),
    description: "",
    quantity: 1,
    rate: 0,
  };
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function in30Days(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

function CreateInvoiceInner() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState(3);
  const [canCreate, setCanCreate] = useState(true);
  const [proActive, setProActive] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [branding, setBranding] = useState<BrandingSettings>(getBranding());

  const [data, setData] = useState<InvoiceData>({
    senderName: "",
    senderAddress: "",
    senderEmail: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    invoiceNumber: generateInvoiceNumber(),
    issueDate: todayStr(),
    dueDate: in30Days(),
    items: [newItem()],
    taxRate: 0,
    notes: "",
  });

  // Verify Stripe session and activate pro
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    setVerifying(true);
    fetch(`/api/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.pro) {
          setProStatus(result.email, result.expires);
          setProActive(true);
          setCanCreate(true);
          setRemaining(Infinity);
          // Clean up URL
          window.history.replaceState({}, "", "/create");
        }
      })
      .catch(() => {
        // Verification failed — user stays on free tier
      })
      .finally(() => setVerifying(false));
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
    const pro = isPro();
    setProActive(pro);
    setRemaining(remainingInvoices());
    setCanCreate(canCreateInvoice());
    if (pro) setBranding(getBranding());
  }, []);

  const refreshLimits = useCallback(() => {
    setRemaining(remainingInvoices());
    setCanCreate(canCreateInvoice());
    setProActive(isPro());
  }, []);

  const update = useCallback(
    (field: keyof InvoiceData, value: string | number | LineItem[]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) => {
      setData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const addItem = useCallback(() => {
    setData((prev) => ({ ...prev, items: [...prev.items, newItem()] }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const handleGenerate = () => {
    if (!canCreate) return;
    incrementInvoiceCount();
    refreshLimits();
    downloadInvoicePDF(data, proActive ? branding : undefined);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated = { ...branding, logoDataUrl: reader.result as string };
      setBranding(updated);
      saveBranding(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    const updated = { ...branding, logoDataUrl: null };
    setBranding(updated);
    saveBranding(updated);
  };

  const handleBrandingChange = (field: keyof BrandingSettings, value: string) => {
    const updated = { ...branding, [field]: value };
    setBranding(updated);
    saveBranding(updated);
  };

  const subtotal = calculateSubtotal(data.items);
  const tax = calculateTax(subtotal, data.taxRate);
  const total = calculateTotal(data.items, data.taxRate);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Invoice</h1>

        {verifying ? (
          <p className="text-gray-400 text-sm">Verifying your subscription...</p>
        ) : proActive ? (
          <p className="text-sm">
            <span className="inline-flex items-center gap-1.5 bg-brand-950 text-brand-300 border border-brand-800 px-3 py-1 rounded-full text-xs font-medium">
              ⚡ Pro — Unlimited Invoices
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            {remaining > 0 ? (
              <>
                {remaining} free invoice{remaining !== 1 ? "s" : ""} remaining
                this month
              </>
            ) : (
              <span className="text-red-400">
                Free limit reached.{" "}
                <a href="/api/checkout" className="text-brand-400 underline">
                  Upgrade to Pro
                </a>{" "}
                for unlimited invoices.
              </span>
            )}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {/* Your Details */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Your Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={data.senderName}
                onChange={(e) => update("senderName", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                placeholder="Your Company LLC"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={data.senderEmail}
                onChange={(e) => update("senderEmail", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                placeholder="you@company.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">
                Address
              </label>
              <input
                type="text"
                value={data.senderAddress}
                onChange={(e) => update("senderAddress", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>
        </section>

        {/* Client Details */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Client Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={data.clientName}
                onChange={(e) => update("clientName", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                placeholder="Client Company Inc"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={data.clientEmail}
                onChange={(e) => update("clientEmail", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                placeholder="client@company.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">
                Address
              </label>
              <input
                type="text"
                value={data.clientAddress}
                onChange={(e) => update("clientAddress", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                placeholder="456 Oak Ave, City, State 67890"
              />
            </div>
          </div>
        </section>

        {/* Invoice Details */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Invoice #
              </label>
              <input
                type="text"
                value={data.invoiceNumber}
                onChange={(e) => update("invoiceNumber", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={data.issueDate}
                onChange={(e) => update("issueDate", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={data.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </section>

        {/* Line Items */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Line Items</h2>
          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-12 gap-3 text-xs text-gray-500 uppercase tracking-wider px-1">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate ($)</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-1"></div>
            </div>
            {data.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-3 items-center"
              >
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                  placeholder="Service description"
                  className="col-span-12 md:col-span-5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "quantity",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="col-span-4 md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "rate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="col-span-4 md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
                <div className="col-span-3 md:col-span-2 text-right text-gray-300">
                  {formatCurrency(item.quantity * item.rate)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={data.items.length === 1}
                  className="col-span-1 text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed text-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-4 text-sm text-brand-400 hover:text-brand-300"
          >
            + Add Line Item
          </button>
        </section>

        {/* Tax & Notes */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={data.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 resize-none"
                placeholder="Payment terms, thank you message, etc."
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={data.taxRate}
                  onChange={(e) =>
                    update("taxRate", parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {data.taxRate > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Tax ({data.taxRate}%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-2">
                  <span>Total</span>
                  <span className="text-brand-400">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Branding (Pro only) */}
        {proActive && (
          <section className="bg-gray-900 border border-brand-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              ⚡ Custom Branding
              <span className="text-xs font-normal text-brand-400">(Pro)</span>
            </h2>
            <p className="text-xs text-gray-500 mb-4">Settings are saved in your browser.</p>
            <div className="space-y-5">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Logo</label>
                {branding.logoDataUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="bg-white rounded-lg p-2 inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={branding.logoDataUrl}
                        alt="Logo preview"
                        className="max-h-12 max-w-[160px] object-contain"
                      />
                    </div>
                    <button
                      onClick={handleRemoveLogo}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700 file:cursor-pointer"
                  />
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Accent Color */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => handleBrandingChange("accentColor", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.accentColor}
                      onChange={(e) => handleBrandingChange("accentColor", e.target.value)}
                      className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
                    />
                  </div>
                </div>

                {/* Footer Text */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Invoice Footer</label>
                  <input
                    type="text"
                    value={branding.footerText}
                    onChange={(e) => handleBrandingChange("footerText", e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    placeholder="Generated with KaviTools"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Generate */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={!canCreate}
            className="bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-lg font-medium transition shadow-lg shadow-brand-600/25 disabled:shadow-none"
          >
            {canCreate
              ? "⬇ Generate & Download Invoice"
              : "Free Limit Reached"}
          </button>
          {!proActive && (
            <p className="text-xs text-gray-500">
              Opens a print-ready invoice — use &quot;Save as PDF&quot; to
              download
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateInvoice() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-64"></div>
        </div>
      </div>
    }>
      <CreateInvoiceInner />
    </Suspense>
  );
}
