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
  constructionCount: number;
  facadeCount: number;
  mepCount: number;
  experienceYears: number;
  shareUrl: string;
  shareMessage: string;
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
  constructionCount: 130,
  facadeCount: 1107,
  mepCount: 2011,
  experienceYears: 11,
  shareUrl: "https://play.google.com/store/apps/details?id=com.aljawadservices.app",
  shareMessage: "جرّب تطبيق الجواد — خدمات النظافة والصيانة المتكاملة",
  contact: {
    phone: '0509474308',
    mobile1: '966-0535091378',
    mobile2: '966-920013406',
    whatsapp: '+966509474308',
    email: 'cont@aljawadint.co',
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
  hero: '/images/hero/home_hero.jpg',
  aboutVisual: '/images/about/about_visual.jpg',
  contactVisual: '/images/contact/contact_visual.jpg',
  services: {
    cleaning: '/images/services/service_1.jpg',
    facade: '/images/services/service_2.jpg',
    industrial: '/images/services/service_3.jpg',
    pools: '/images/services/service_4.jpg',
    pest: '/images/services/service_5.jpg',
    insulation: '/images/services/service_6.jpg',
    mep: '/images/services/service_7.jpg',
    manpower: '/images/services/service_8.jpg',
    facilities: '/images/services/service_9.jpg',
    equipment: '/images/services/service_10.jpg',
    construction: '/images/services/service_11.jpg',
  },
  projects: {
    p01: '/images/projects/project_1.jpg',
    p02: '/images/projects/project_2.jpg',
    p03: '/images/projects/project_3.jpg',
    p04: '/images/projects/project_4.jpg',
    p05: '/images/projects/project_5.jpg',
    p06: '/images/projects/project_6.jpg',
  },
} as const;
