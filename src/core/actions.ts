import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

const open = (url: string): boolean => {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = url;
    }
    return true;
  } catch {
    return false;
  }
};

const digitsOnly = (value: string): string => value.replace(/[^\d+]/g, '');

/** Saudi local numbers → international format for WhatsApp deep links. */
const toInternational = (local: string): string => {
  const d = digitsOnly(local).replace(/^\+/, '');
  if (d.startsWith('966')) return d;
  if (d.startsWith('0')) return `966${d.slice(1)}`;
  return d;
};

export const externalActions = {
  call: (number: string) => open(`tel:${digitsOnly(number)}`),
  whatsapp: (number: string, message?: string) =>
    open(
      `https://wa.me/${toInternational(number)}${message ? `?text=${encodeURIComponent(message)}` : ''}`,
    ),
  email: (address: string, subject?: string) =>
    open(`mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`),
  maps: (query: string) =>
    open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`),
  website: (url: string) => open(`https://${url}`),
  shareToWhatsapp: (text: string) =>
  open(`https://wa.me/?text=${encodeURIComponent(text)}`),
  openUrl: (url: string) => open(url),
  copy: async (value: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  },
  /**
   * مشاركة محتوى عبر واجهة المشاركة الأصلية.
   * - على الأجهزة التي تدعم Web Share API → يفتح قائمة التطبيقات.
   * - إذا فشل → يفتح واتساب كبديل.
   * - إذا فشل الكل → ينسخ المحتوى للحافظة.
   */
share: async ({
  title,
  text,
  url,
  fallbackWhatsapp,
}: {
  title?: string;
  text: string;
  url?: string;
  fallbackWhatsapp?: string;
}): Promise<'shared' | 'whatsapp' | 'copied' | 'failed'> => {
  // 1) Capacitor Share (الأفضل — يفتح قائمة التطبيقات الأصلية على الجوال)
  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: title,
      });
      return 'shared';
    }
  } catch (e) {
    // إذا أغلق المستخدم القائمة → لا نفعل شيئًا
    const msg = e instanceof Error ? e.message : '';
    if (msg.toLowerCase().includes('cancel')) {
      return 'shared';
    }
    // وإلا نتابع للبدائل
  }

  // 2) Web Share API (على المتصفح العادي)
  try {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
        title,
        text,
        url,
      });
      return 'shared';
    }
  } catch {
    /* ignore */
  }

  // 3) بديل: واتساب
  if (fallbackWhatsapp) {
    const fullText = url ? `${text}\n${url}` : text;
    open(`https://wa.me/${toInternational(fallbackWhatsapp)}?text=${encodeURIComponent(fullText)}`);
    return 'whatsapp';
  }

  // 4) بديل أخير: نسخ للحافظة
  try {
    const fullText = url ? `${text}\n${url}` : text;
    await navigator.clipboard.writeText(fullText);
    return 'copied';
  } catch {
    return 'failed';
  }
},
