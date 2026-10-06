import { appConfig } from '../data/company';

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
  website: () => open(`https://${appConfig.contact.website}`),
  copy: async (value: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  },
};
