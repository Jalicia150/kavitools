const PRO_KEY = "kavitools_pro";

export interface ProStatus {
  email: string;
  expires: string; // ISO timestamp
}

export function getProStatus(): ProStatus | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PRO_KEY);
  if (!raw) return null;
  try {
    const parsed: ProStatus = JSON.parse(raw);
    if (new Date(parsed.expires) > new Date()) {
      return parsed;
    }
    // Expired — clean up
    localStorage.removeItem(PRO_KEY);
    return null;
  } catch {
    localStorage.removeItem(PRO_KEY);
    return null;
  }
}

export function setProStatus(email: string, expires: string): void {
  if (typeof window === "undefined") return;
  const status: ProStatus = { email, expires };
  localStorage.setItem(PRO_KEY, JSON.stringify(status));
}

export function isPro(): boolean {
  return getProStatus() !== null;
}

export function clearProStatus(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PRO_KEY);
}
