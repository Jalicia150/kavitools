export interface BrandingSettings {
  logoDataUrl: string | null;
  accentColor: string;
  footerText: string;
}

const BRANDING_KEY = "kavitools_branding";

const DEFAULTS: BrandingSettings = {
  logoDataUrl: null,
  accentColor: "#4f46e5",
  footerText: "Generated with KaviTools \u2014 kavitools.vercel.app",
};

export function getBranding(): BrandingSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  const raw = localStorage.getItem(BRANDING_KEY);
  if (!raw) return { ...DEFAULTS };
  try {
    const parsed = JSON.parse(raw);
    return {
      logoDataUrl: parsed.logoDataUrl ?? null,
      accentColor: parsed.accentColor || DEFAULTS.accentColor,
      footerText: parsed.footerText || DEFAULTS.footerText,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveBranding(settings: BrandingSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BRANDING_KEY, JSON.stringify(settings));
}

export function clearBranding(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BRANDING_KEY);
}

export function getDefaults(): BrandingSettings {
  return { ...DEFAULTS };
}
