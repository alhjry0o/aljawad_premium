/**
 * Central configuration — Aljawad International Arabia Company
 * All official company data lives here. Never duplicate these values in components.
 */

export type Lang = 'ar' | 'en';

export interface Bilingual {
  ar: string;
  en: string;
}

export interface ContactInfo {
  phone: string;
  mobile1: string;
  mobile2: string;
  whatsapp: string;
  email: string;
  website: string;
  address: Bilingual;
  mapsQuery: string;
}

export interface AppConfiguration {
  appName: Bilingual;
  companyName: Bilingual;
  version: string;
  projectsCount: number;
  contact: ContactInfo;
  developer: {
    name: Bilingual;
    phone: string;
  };
}

export const appConfig: AppConfiguration = {
  appName: { ar: 'الجواد', en: 'Aljawad' },
  companyName: {
    ar: 'شركة الجواد الدولية العربية',
    en: 'Aljawad International Arabia Company',
  },
  version: '1.0.0 (Demo)',
  // Single source of truth — change once, reflected everywhere.
  projectsCount: 1450,
  contact: {
    phone: '920013406',
    mobile1: '0535091378',
    mobile2: '0561116199',
    whatsapp: '05542471982',
    email: 'info@aljawadservices.com',
    website: 'aljawadservices.com',
    address: {
      ar: 'الرياض، العليا، أمام الرياض جاليري',
      en: 'Riyadh, Al Olaya, opposite Riyadh Gallery',
    },
    mapsQuery: 'Al Olaya, Riyadh, Saudi Arabia',
  },
  developer: {
    name: { ar: 'عبدالله الحجري', en: 'Abdullah AL-Hjry' },
    phone: '+967779966185',
  },
};

/**
 * Asset registry. Replace the URLs below with local assets
 * (see README → Asset Guide) without touching any component.
 */
export const appAssets = {
  hero: 'https://images.pexels.com/photos/39470846/pexels-photo-39470846.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400',
  aboutVisual:
    'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
  contactVisual:
    'https://images.pexels.com/photos/39470842/pexels-photo-39470842.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
  services: {
    cleaning:
      'https://images.pexels.com/photos/5707706/pexels-photo-5707706.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    facade:
      'https://images.pexels.com/photos/12040693/pexels-photo-12040693.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    industrial:
      'https://images.pexels.com/photos/36090543/pexels-photo-36090543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    pools:
      'https://images.pexels.com/photos/7974836/pexels-photo-7974836.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    pest: 'https://images.pexels.com/photos/5953827/pexels-photo-5953827.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    insulation:
      'https://images.pexels.com/photos/25288042/pexels-photo-25288042.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    mep: 'https://images.pexels.com/photos/14614266/pexels-photo-14614266.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    manpower:
      'https://images.pexels.com/photos/12919779/pexels-photo-12919779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    facilities:
      'https://images.pexels.com/photos/26729563/pexels-photo-26729563.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    equipment:
      'https://images.pexels.com/photos/14204601/pexels-photo-14204601.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
    construction:
      'https://images.pexels.com/photos/5505131/pexels-photo-5505131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200',
  },
  projects: {
    p01: 'https://images.pexels.com/photos/31849530/pexels-photo-31849530.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1300',
    p02: 'https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1300',
    p03: 'https://images.pexels.com/photos/30617023/pexels-photo-30617023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1300',
    p04: 'https://images.pexels.com/photos/34153042/pexels-photo-34153042.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1300',
    p05: 'https://images.pexels.com/photos/6957079/pexels-photo-6957079.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1300',
    p06: 'https://images.pexels.com/photos/9108224/pexels-photo-9108224.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1300',
  },
} as const;
