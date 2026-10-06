import { appAssets, type Bilingual } from './company';
import type { ServiceIconKey } from './services';

/**
 * DEMO DATA — placeholder projects for the demo build.
 * These are NOT real company projects. Replace from this file only.
 */
export interface Project {
  id: string;
  demo: true;
  code: string;
  title: Bilingual;
  serviceId: ServiceIconKey;
  year: string;
  scope: { ar: string[]; en: string[] };
  summary: Bilingual;
  context: Bilingual;
  cover: string;
  gallery: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'project-01',
    demo: true,
    code: 'DEMO · 01',
    title: { ar: 'برج مكاتب — تنظيف واجهات', en: 'Office Tower — Facade Cleaning' },
    serviceId: 'facade',
    year: '—',
    scope: {
      ar: ['تنظيف واجهات زجاجية', 'معدات رفع', 'عمل على الارتفاعات', 'جدولة ليلية'],
      en: ['Glass facade cleaning', 'Lifting equipment', 'Work at height', 'Night scheduling'],
    },
    summary: {
      ar: 'نموذج توضيحي لمشروع تنظيف واجهات برج مكاتب متعدد الأدوار.',
      en: 'Illustrative example of a multi-storey office tower facade cleaning project.',
    },
    context: {
      ar: 'يوضح هذا النموذج كيفية عرض مشاريع تنظيف الواجهات داخل التطبيق: نطاق العمل، المعدات المستخدمة، وتسلسل التنفيذ. البيانات هنا تجريبية وقابلة للاستبدال ببيانات المشاريع الرسمية.',
      en: 'This placeholder demonstrates how facade projects are presented inside the app: scope, equipment and execution sequence. Content is demo data, replaceable with official project records.',
    },
    cover: appAssets.projects.p01,
    gallery: [appAssets.projects.p04, appAssets.projects.p06],
    featured: true,
  },
  {
    id: 'project-02',
    demo: true,
    code: 'DEMO · 02',
    title: { ar: 'منشأة ضيافة — تشغيل وصيانة', en: 'Hospitality Facility — O&M' },
    serviceId: 'facilities',
    year: '—',
    scope: {
      ar: ['فرق تشغيل', 'صيانة وقائية', 'نظافة يومية', 'تقارير دورية'],
      en: ['Operating teams', 'Preventive maintenance', 'Daily cleaning', 'Periodic reporting'],
    },
    summary: {
      ar: 'نموذج توضيحي لعقد تشغيل وصيانة متكامل لمنشأة ضيافة.',
      en: 'Illustrative example of an integrated O&M contract for a hospitality facility.',
    },
    context: {
      ar: 'يعرض هذا النموذج بنية عقد التشغيل والصيانة: الفرق، خطط الصيانة، ومؤشرات المتابعة. البيانات تجريبية.',
      en: 'This placeholder shows the structure of an O&M engagement: teams, maintenance plans and follow-up indicators. Demo data.',
    },
    cover: appAssets.projects.p02,
    gallery: [appAssets.projects.p05, appAssets.projects.p01],
    featured: true,
  },
  {
    id: 'project-03',
    demo: true,
    code: 'DEMO · 03',
    title: { ar: 'مشروع إنشائي — تشطيبات وعزل', en: 'Construction Project — Finishing & Insulation' },
    serviceId: 'construction',
    year: '—',
    scope: {
      ar: ['أعمال إنشائية', 'تشطيبات', 'عزل مائي', 'تنظيف ما بعد الإنشاء'],
      en: ['Construction works', 'Finishing', 'Waterproofing', 'Post-construction cleaning'],
    },
    summary: {
      ar: 'نموذج توضيحي لمشروع إنشائي يشمل التشطيبات والعزل وأعمال ما بعد الإنشاء.',
      en: 'Illustrative construction project covering finishing, insulation and post-construction works.',
    },
    context: {
      ar: 'يوضح النموذج تسلسل الأعمال من الهيكل إلى التسليم. البيانات تجريبية وقابلة للاستبدال.',
      en: 'Demonstrates the sequence from structure to handover. Demo data, replaceable.',
    },
    cover: appAssets.projects.p03,
    gallery: [appAssets.projects.p06, appAssets.projects.p02],
    featured: true,
  },
  {
    id: 'project-04',
    demo: true,
    code: 'DEMO · 04',
    title: { ar: 'مجمع صناعي — تنظيف أرضيات', en: 'Industrial Complex — Floor Cleaning' },
    serviceId: 'industrial',
    year: '—',
    scope: {
      ar: ['جلي وتلميع', 'إزالة الزيوت', 'العلامات الأرضية', 'برنامج دوري'],
      en: ['Grinding and polishing', 'Oil removal', 'Floor markings', 'Periodic program'],
    },
    summary: {
      ar: 'نموذج توضيحي لبرنامج تنظيف دوري لمجمع صناعي ومواقف.',
      en: 'Illustrative periodic cleaning program for an industrial complex and parking.',
    },
    context: {
      ar: 'نموذج لعرض برامج التنظيف الصناعي الدورية داخل التطبيق. البيانات تجريبية.',
      en: 'A placeholder for presenting periodic industrial cleaning programs. Demo data.',
    },
    cover: appAssets.projects.p04,
    gallery: [appAssets.projects.p03],
    featured: false,
  },
  {
    id: 'project-05',
    demo: true,
    code: 'DEMO · 05',
    title: { ar: 'فيلا خاصة — نظافة ومسابح', en: 'Private Villa — Cleaning & Pool' },
    serviceId: 'pools',
    year: '—',
    scope: {
      ar: ['تنظيف عميق', 'تنظيف المسبح', 'المفروشات', 'جدولة شهرية'],
      en: ['Deep cleaning', 'Pool cleaning', 'Upholstery', 'Monthly scheduling'],
    },
    summary: {
      ar: 'نموذج توضيحي لخدمة دورية لفيلا خاصة تشمل النظافة والمسبح.',
      en: 'Illustrative periodic service for a private villa covering cleaning and pool.',
    },
    context: {
      ar: 'نموذج لعرض الخدمات السكنية الدورية. البيانات تجريبية.',
      en: 'Placeholder for presenting periodic residential services. Demo data.',
    },
    cover: appAssets.projects.p05,
    gallery: [appAssets.projects.p02],
    featured: false,
  },
  {
    id: 'project-06',
    demo: true,
    code: 'DEMO · 06',
    title: { ar: 'مبنى مرتفع — عزل وصيانة', en: 'High-rise — Insulation & Maintenance' },
    serviceId: 'insulation',
    year: '—',
    scope: {
      ar: ['عزل مائي', 'عزل حراري', 'عزل خزانات', 'صيانة'],
      en: ['Waterproofing', 'Thermal insulation', 'Tank insulation', 'Maintenance'],
    },
    summary: {
      ar: 'نموذج توضيحي لأعمال عزل وصيانة في مبنى مرتفع.',
      en: 'Illustrative insulation and maintenance works in a high-rise building.',
    },
    context: {
      ar: 'نموذج لعرض أعمال العزل داخل التطبيق. البيانات تجريبية.',
      en: 'Placeholder for presenting insulation works. Demo data.',
    },
    cover: appAssets.projects.p06,
    gallery: [appAssets.projects.p01],
    featured: false,
  },
];

export const getProject = (id: string): Project | undefined => projects.find((p) => p.id === id);
