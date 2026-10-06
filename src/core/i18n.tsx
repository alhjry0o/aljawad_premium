import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Bilingual, Lang } from '../data/company';

const ar = {
  'nav.home': 'الرئيسية',
  'nav.services': 'الخدمات',
  'nav.requests': 'طلباتي',
  'nav.projects': 'مشاريعنا',
  'nav.more': 'المزيد',

  'hero.eyebrow': 'شركة الجواد الدولية العربية',
  'hero.title.1': 'حلول متكاملة',
  'hero.title.2': 'للتشغيل والصيانة',
  'hero.title.3': 'والخدمات',
  'hero.support': 'فرق متخصصة ومعدات حديثة لتنفيذ أعمال النظافة والصيانة والمرافق في مختلف أنواع المنشآت.',
  'hero.search': 'ماذا تحتاج؟',
  'hero.cta.primary': 'اطلب خدمة',
  'hero.cta.secondary': 'طلب عرض سعر',
  'hero.scroll': 'اسحب للأسفل',

  'search.results': 'نتائج البحث',
  'search.empty': 'لا توجد نتائج مطابقة',
  'search.emptyHint': 'جرّب كلمة أخرى مثل: نظافة، عزل، معدات',
  'search.clear': 'مسح',

  'quick.request': 'طلب خدمة',
  'quick.quote': 'عرض سعر',
  'quick.inspection': 'معاينة',
  'quick.call': 'اتصال',
  'quick.whatsapp': 'واتساب',

  'services.title': 'الخدمات',
  'services.kicker': 'اكتشف الخدمات',
  'services.count': '11 خدمة رئيسية',
  'services.all': 'عرض كل الخدمات',
  'services.open': 'تفاصيل الخدمة',
  'services.includes': 'ماذا تشمل الخدمة',
  'services.locations': 'مناسبة لـ',
  'services.related': 'نماذج مرتبطة',
  'services.gallery': 'معرض بصري',
  'services.swipe': 'اسحب لاستعراض الخدمات',

  'brand.statement.kicker': 'الجواد',
  'brand.statement':
    'نعمل على إدارة وتشغيل وصيانة المنشآت بمنظومة واحدة: نظافة، عزل، مكافحة آفات، عمالة، معدات، ومقاولات.',

  'why.title': 'لماذا الجواد؟',
  'why.1.title': 'فرق متخصصة',
  'why.1.body': 'فرق مدربة لكل نوع من الأعمال، من النظافة العميقة إلى العمل على الارتفاعات.',
  'why.2.title': 'حلول متكاملة',
  'why.2.body': 'خدمات مترابطة تغطي دورة حياة المنشأة من الإنشاء إلى التشغيل.',
  'why.3.title': 'معدات وتقنيات حديثة',
  'why.3.body': 'معدات رفع وتنظيف وصيانة مناسبة لطبيعة كل موقع.',
  'why.4.title': 'خبرة في التنفيذ',
  'why.4.body': 'تنفيذ منضبط وفق نطاق عمل واضح وجدولة متفق عليها.',
  'why.counter': 'مشروع منفذ',

  'projects.title': 'مشاريعنا',
  'projects.featured': 'مشاريع مميزة',
  'projects.all': 'عرض كل المشاريع',
  'projects.filter.all': 'الكل',
  'projects.demoNote': 'نماذج تجريبية — تُستبدل ببيانات المشاريع الرسمية.',
  'projects.scope': 'نطاق العمل',
  'projects.context': 'عن المشروع',
  'projects.gallery': 'الصور',
  'projects.service': 'الخدمة',
  'projects.cta': 'اطلب خدمة مشابهة',

  'cta.title': 'جاهزون لتنفيذ أعمالك',
  'cta.body': 'ابدأ بطلب خدمة أو احصل على عرض سعر مخصص حسب الموقع ونطاق العمل.',

  'requests.title': 'طلباتي',
  'requests.empty': 'لا توجد طلبات حتى الآن',
  'requests.emptyBody': 'عند إنشاء طلب خدمة أو عرض سعر أو معاينة، سيظهر هنا مع حالته.',
  'requests.search': 'ابحث برقم الطلب أو الخدمة',
  'requests.all': 'الكل',
  'requests.type.service': 'طلب خدمة',
  'requests.type.quote': 'عرض سعر',
  'requests.type.inspection': 'معاينة',
  'requests.timeline': 'مسار الطلب',
  'requests.delete': 'حذف الطلب',
  'requests.localNote': 'الطلبات محفوظة على هذا الجهاز فقط في النسخة التجريبية.',
  'requests.count': 'طلب',

  'status.submitted': 'تم الإرسال',
  'status.received': 'تم استلام الطلب',
  'status.review': 'قيد المراجعة',
  'status.awaiting_inspection': 'بانتظار المعاينة',
  'status.preparing_quote': 'جاري إعداد العرض',
  'status.scheduled': 'تمت جدولة الخدمة',
  'status.in_progress': 'قيد التنفيذ',
  'status.completed': 'مكتمل',
  'status.cancelled': 'ملغي',

  'flow.service.title': 'طلب خدمة',
  'flow.quote.title': 'طلب عرض سعر',
  'flow.inspection.title': 'طلب معاينة',
  'flow.step': 'خطوة',
  'flow.of': 'من',
  'flow.next': 'التالي',
  'flow.back': 'السابق',
  'flow.submit': 'تأكيد الطلب',
  'flow.cancel': 'إلغاء',

  'step.service': 'اختيار الخدمة',
  'step.property': 'نوع الموقع',
  'step.location': 'الموقع',
  'step.schedule': 'الموعد',
  'step.details': 'تفاصيل الطلب',
  'step.photos': 'الصور',
  'step.contact': 'بيانات العميل',
  'step.review': 'مراجعة',
  'step.specs': 'تفاصيل الخدمة',

  'field.city': 'المدينة',
  'field.district': 'الحي',
  'field.address': 'العنوان',
  'field.extra': 'تفاصيل إضافية',
  'field.date': 'التاريخ',
  'field.time': 'الوقت',
  'field.notes': 'تفاصيل الطلب',
  'field.name': 'الاسم',
  'field.phone': 'رقم الهاتف',
  'field.optional': 'اختياري',
  'field.photos': 'إرفاق صور',
  'field.photosHint': 'اختر صوراً من جهازك (تُحفظ محلياً فقط).',
  'field.facadeType': 'نوع الواجهة',
  'field.floors': 'عدد الأدوار',
  'field.area': 'المساحة التقريبية (م²)',
  'field.side': 'داخلي / خارجي',
  'field.units': 'عدد الوحدات / النطاق',
  'field.frequency': 'تكرار الخدمة',

  'option.inside': 'داخلي',
  'option.outside': 'خارجي',
  'option.both': 'داخلي وخارجي',
  'option.once': 'مرة واحدة',
  'option.weekly': 'أسبوعي',
  'option.monthly': 'شهري',
  'option.annual': 'عقد سنوي',

  'property.home': 'منزل',
  'property.villa': 'فيلا',
  'property.palace': 'قصر',
  'property.office': 'مكتب',
  'property.hotel': 'فندق',
  'property.hospital': 'مستشفى',
  'property.factory': 'مصنع',
  'property.warehouse': 'مستودع',
  'property.building': 'مبنى',
  'property.parking': 'موقف',
  'property.other': 'منشأة أخرى',

  'error.required': 'هذا الحقل مطلوب',
  'error.phone': 'يرجى إدخال رقم هاتف صحيح',
  'error.name': 'يرجى إدخال الاسم',
  'error.generic': 'تعذر إكمال العملية، تحقق من البيانات المدخلة',
  'error.selectService': 'يرجى اختيار الخدمة',

  'success.title': 'تم إنشاء الطلب بنجاح',
  'success.body': 'تم حفظ الطلب في النسخة التجريبية على هذا الجهاز.',
  'success.number': 'رقم الطلب',
  'success.view': 'عرض الطلب',
  'success.requests': 'طلباتي',
  'success.home': 'الرئيسية',

  'about.title': 'عن الجواد',
  'about.kicker': 'الشركة',
  'about.p1':
    'شركة الجواد الدولية العربية شركة خدمات متكاملة تعمل في النظافة والتشغيل والصيانة ومكافحة الآفات والعزل وتوفير العمالة وإدارة المرافق وتأجير المعدات والمقاولات والإنشاءات.',
  'about.p2':
    'نعتمد على فرق متخصصة ومعدات مناسبة لكل نوع من الأعمال، مع نطاق عمل واضح وجدولة متفق عليها لكل مشروع.',
  'about.scope': 'مجالات العمل',

  'contact.title': 'تواصل معنا',
  'contact.kicker': 'نحن هنا',
  'contact.phone': 'الهاتف',
  'contact.mobile': 'الجوال',
  'contact.whatsapp': 'واتساب',
  'contact.email': 'البريد الإلكتروني',
  'contact.address': 'العنوان',
  'contact.map': 'فتح الخريطة',
  'contact.form': 'أرسل رسالة',
  'contact.message': 'الرسالة',
  'contact.send': 'حفظ الرسالة',
  'contact.saved': 'تم حفظ الرسالة في النسخة التجريبية',
  'contact.unavailable': 'هذه الوظيفة غير متاحة في هذه البيئة. يمكنك نسخ البيانات يدوياً.',
  'contact.copied': 'تم النسخ',

  'more.title': 'المزيد',
  'more.company': 'الشركة',
  'more.app': 'التطبيق',
  'more.developer': 'المطور',
  'more.website': 'موقع الشركة',
  'more.settings': 'الإعدادات',
  'more.privacy': 'الخصوصية',
  'more.terms': 'الشروط والأحكام',
  'more.appInfo': 'معلومات التطبيق',

  'settings.title': 'الإعدادات',
  'settings.appearance': 'المظهر',
  'settings.theme.system': 'النظام',
  'settings.theme.light': 'فاتح',
  'settings.theme.dark': 'داكن',
  'settings.language': 'اللغة',
  'settings.motion': 'تقليل الحركة',
  'settings.motionHint': 'يقلل تأثيرات التمرير والعمق.',
  'settings.notifications': 'الإشعارات',
  'settings.notificationsHint': 'البنية جاهزة، لكن الإشعارات غير مفعّلة في النسخة التجريبية.',
  'settings.version': 'إصدار التطبيق',
  'settings.data': 'البيانات المحلية',
  'settings.clear': 'حذف الطلبات المحفوظة',
  'settings.cleared': 'تم حذف البيانات المحلية',

  'legal.privacy.title': 'سياسة الخصوصية',
  'legal.terms.title': 'الشروط والأحكام',
  'legal.placeholder': 'نص تجريبي (Placeholder) — يُستبدل بالنص الرسمي المعتمد من الشركة.',
  'legal.privacy.body':
    'لا يجمع التطبيق في نسخته التجريبية أي بيانات على خوادم خارجية. تُحفظ الطلبات والإعدادات على جهازك فقط، ويمكن حذفها في أي وقت من الإعدادات.',
  'legal.terms.body':
    'يُستخدم التطبيق لاستعراض خدمات الشركة وإنشاء طلبات محلية. لا يمثل أي طلب داخل النسخة التجريبية التزاماً تعاقدياً أو تأكيداً لموعد أو سعر.',

  'dev.title': 'معلومات المطور',
  'dev.credit': 'تصميم وتطوير',
  'dev.contact': 'للتواصل',

  'common.back': 'رجوع',
  'common.demo': 'نسخة تجريبية',
  'common.more': 'المزيد',
  'common.save': 'حفظ',
  'common.done': 'تم',
  'common.select': 'اختر',
  'common.offline': 'يعمل دون اتصال',
};

type Key = keyof typeof ar;

const en: Record<Key, string> = {
  'nav.home': 'Home',
  'nav.services': 'Services',
  'nav.requests': 'Requests',
  'nav.projects': 'Projects',
  'nav.more': 'More',

  'hero.eyebrow': 'Aljawad International Arabia Company',
  'hero.title.1': 'Integrated solutions',
  'hero.title.2': 'for operations, maintenance',
  'hero.title.3': 'and services',
  'hero.support':
    'Specialised teams and modern equipment delivering cleaning, maintenance and facility works across all facility types.',
  'hero.search': 'What do you need?',
  'hero.cta.primary': 'Request a service',
  'hero.cta.secondary': 'Request a quote',
  'hero.scroll': 'Scroll',

  'search.results': 'Search results',
  'search.empty': 'No matching results',
  'search.emptyHint': 'Try another term such as: cleaning, insulation, equipment',
  'search.clear': 'Clear',

  'quick.request': 'Service',
  'quick.quote': 'Quote',
  'quick.inspection': 'Inspection',
  'quick.call': 'Call',
  'quick.whatsapp': 'WhatsApp',

  'services.title': 'Services',
  'services.kicker': 'Discover services',
  'services.count': '11 core services',
  'services.all': 'View all services',
  'services.open': 'Service details',
  'services.includes': 'What is included',
  'services.locations': 'Suitable for',
  'services.related': 'Related samples',
  'services.gallery': 'Visual gallery',
  'services.swipe': 'Swipe to explore services',

  'brand.statement.kicker': 'Aljawad',
  'brand.statement':
    'We manage, operate and maintain facilities through one system: cleaning, insulation, pest control, manpower, equipment and contracting.',

  'why.title': 'Why Aljawad',
  'why.1.title': 'Specialised teams',
  'why.1.body': 'Trained crews for every discipline, from deep cleaning to work at height.',
  'why.2.title': 'Integrated solutions',
  'why.2.body': 'Connected services covering the facility lifecycle from construction to operation.',
  'why.3.title': 'Modern equipment',
  'why.3.body': 'Lifting, cleaning and maintenance equipment matched to each site.',
  'why.4.title': 'Execution experience',
  'why.4.body': 'Disciplined delivery against a clear scope and agreed schedule.',
  'why.counter': 'projects delivered',

  'projects.title': 'Projects',
  'projects.featured': 'Featured projects',
  'projects.all': 'View all projects',
  'projects.filter.all': 'All',
  'projects.demoNote': 'Demo placeholders — to be replaced with official project records.',
  'projects.scope': 'Scope of work',
  'projects.context': 'About the project',
  'projects.gallery': 'Gallery',
  'projects.service': 'Service',
  'projects.cta': 'Request a similar service',

  'cta.title': 'Ready to deliver your works',
  'cta.body': 'Start with a service request or get a quote tailored to your site and scope.',

  'requests.title': 'My requests',
  'requests.empty': 'No requests yet',
  'requests.emptyBody': 'Service, quote and inspection requests will appear here with their status.',
  'requests.search': 'Search by request number or service',
  'requests.all': 'All',
  'requests.type.service': 'Service request',
  'requests.type.quote': 'Quotation',
  'requests.type.inspection': 'Inspection',
  'requests.timeline': 'Request timeline',
  'requests.delete': 'Delete request',
  'requests.localNote': 'Requests are stored on this device only in the demo build.',
  'requests.count': 'requests',

  'status.submitted': 'Submitted',
  'status.received': 'Received',
  'status.review': 'Under review',
  'status.awaiting_inspection': 'Awaiting inspection',
  'status.preparing_quote': 'Preparing quote',
  'status.scheduled': 'Scheduled',
  'status.in_progress': 'In progress',
  'status.completed': 'Completed',
  'status.cancelled': 'Cancelled',

  'flow.service.title': 'Service request',
  'flow.quote.title': 'Quotation request',
  'flow.inspection.title': 'Inspection request',
  'flow.step': 'Step',
  'flow.of': 'of',
  'flow.next': 'Next',
  'flow.back': 'Back',
  'flow.submit': 'Confirm request',
  'flow.cancel': 'Cancel',

  'step.service': 'Select service',
  'step.property': 'Property type',
  'step.location': 'Location',
  'step.schedule': 'Schedule',
  'step.details': 'Request details',
  'step.photos': 'Photos',
  'step.contact': 'Your details',
  'step.review': 'Review',
  'step.specs': 'Service specifics',

  'field.city': 'City',
  'field.district': 'District',
  'field.address': 'Address',
  'field.extra': 'Additional details',
  'field.date': 'Date',
  'field.time': 'Time',
  'field.notes': 'Request details',
  'field.name': 'Name',
  'field.phone': 'Phone number',
  'field.optional': 'optional',
  'field.photos': 'Attach photos',
  'field.photosHint': 'Select photos from your device (stored locally only).',
  'field.facadeType': 'Facade type',
  'field.floors': 'Number of floors',
  'field.area': 'Approximate area (m²)',
  'field.side': 'Interior / Exterior',
  'field.units': 'Units / scope',
  'field.frequency': 'Service frequency',

  'option.inside': 'Interior',
  'option.outside': 'Exterior',
  'option.both': 'Interior & exterior',
  'option.once': 'One time',
  'option.weekly': 'Weekly',
  'option.monthly': 'Monthly',
  'option.annual': 'Annual contract',

  'property.home': 'Home',
  'property.villa': 'Villa',
  'property.palace': 'Palace',
  'property.office': 'Office',
  'property.hotel': 'Hotel',
  'property.hospital': 'Hospital',
  'property.factory': 'Factory',
  'property.warehouse': 'Warehouse',
  'property.building': 'Building',
  'property.parking': 'Parking',
  'property.other': 'Other facility',

  'error.required': 'This field is required',
  'error.phone': 'Please enter a valid phone number',
  'error.name': 'Please enter your name',
  'error.generic': 'Could not complete the action, please check your input',
  'error.selectService': 'Please select a service',

  'success.title': 'Request created successfully',
  'success.body': 'The request has been saved locally in the demo build.',
  'success.number': 'Request number',
  'success.view': 'View request',
  'success.requests': 'My requests',
  'success.home': 'Home',

  'about.title': 'About Aljawad',
  'about.kicker': 'The company',
  'about.p1':
    'Aljawad International Arabia Company is an integrated services company working in cleaning, operation and maintenance, pest control, insulation, manpower supply, facilities management, equipment rental, contracting and construction.',
  'about.p2':
    'We rely on specialised teams and equipment suited to each discipline, with a clear scope and agreed schedule for every project.',
  'about.scope': 'Areas of work',

  'contact.title': 'Contact us',
  'contact.kicker': 'We are here',
  'contact.phone': 'Phone',
  'contact.mobile': 'Mobile',
  'contact.whatsapp': 'WhatsApp',
  'contact.email': 'Email',
  'contact.address': 'Address',
  'contact.map': 'Open map',
  'contact.form': 'Send a message',
  'contact.message': 'Message',
  'contact.send': 'Save message',
  'contact.saved': 'Message saved in the demo build',
  'contact.unavailable': 'This action is unavailable in this environment. You can copy the details manually.',
  'contact.copied': 'Copied',

  'more.title': 'More',
  'more.company': 'Company',
  'more.app': 'Application',
  'more.developer': 'Developer',
  'more.website': 'Company website',
  'more.settings': 'Settings',
  'more.privacy': 'Privacy',
  'more.terms': 'Terms & conditions',
  'more.appInfo': 'App information',

  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.theme.system': 'System',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.language': 'Language',
  'settings.motion': 'Reduce motion',
  'settings.motionHint': 'Reduces scroll and depth effects.',
  'settings.notifications': 'Notifications',
  'settings.notificationsHint': 'Architecture is ready, notifications are not active in the demo build.',
  'settings.version': 'App version',
  'settings.data': 'Local data',
  'settings.clear': 'Delete saved requests',
  'settings.cleared': 'Local data deleted',

  'legal.privacy.title': 'Privacy policy',
  'legal.terms.title': 'Terms & conditions',
  'legal.placeholder': 'Placeholder text — to be replaced with the official company wording.',
  'legal.privacy.body':
    'In this demo build the app does not collect any data on external servers. Requests and settings are stored on your device only and can be deleted at any time from Settings.',
  'legal.terms.body':
    'The app is used to browse company services and create local requests. No request in the demo build represents a contractual commitment, a confirmed appointment or a price.',

  'dev.title': 'Developer',
  'dev.credit': 'Designed & developed by',
  'dev.contact': 'Contact',

  'common.back': 'Back',
  'common.demo': 'Demo build',
  'common.more': 'More',
  'common.save': 'Save',
  'common.done': 'Done',
  'common.select': 'Select',
  'common.offline': 'Works offline',
};

const dictionaries: Record<Lang, Record<Key, string>> = { ar, en };

interface I18nValue {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Lang) => void;
  t: (key: Key) => string;
  bi: (value: Bilingual) => string;
  list: (value: { ar: string[]; en: string[] }) => string[];
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'aljawad.lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return stored === 'en' ? 'en' : 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dir,
      setLang,
      t: (key) => dictionaries[lang][key] ?? String(key),
      bi: (value) => value[lang],
      list: (value) => value[lang],
    }),
    [lang, dir, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export type TranslationKey = Key;
