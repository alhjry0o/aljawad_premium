import { appAssets, type Bilingual } from './company';

export type ServiceIconKey =
  | 'cleaning'
  | 'facade'
  | 'industrial'
  | 'pools'
  | 'pest'
  | 'insulation'
  | 'mep'
  | 'manpower'
  | 'facilities'
  | 'equipment'
  | 'construction';

export interface Service {
  id: ServiceIconKey;
  /** 01 .. 11 */
  number: string;
  title: Bilingual;
  statement: Bilingual;
  description: Bilingual;
  includes: { ar: string[]; en: string[] };
  image: string;
  /** Brand accent used for the material 3D icon + section lighting */
  accent: 'green' | 'navy' | 'blue' | 'teal';
}

export const services: Service[] = [
  {
    id: 'cleaning',
    number: '01',
    title: { ar: 'النظافة', en: 'Cleaning' },
    statement: {
      ar: 'تنظيف عميق للمنشآت السكنية والتجارية والصحية.',
      en: 'Deep cleaning for residential, commercial and healthcare facilities.',
    },
    description: {
      ar: 'خدمات نظافة متكاملة تشمل التنظيف العميق للمنازل والفلل والقصور والفنادق والمستشفيات والمستودعات والمباني، إضافة إلى تنظيف ما بعد الإنشاء والمناطق المرتفعة والأثاث والمفروشات، بفرق مدربة ومعدات مخصصة لكل نوع من الأسطح.',
      en: 'Integrated cleaning covering deep cleaning of homes, villas, palaces, hotels, hospitals, warehouses and buildings, plus post-construction cleaning, high-level areas, furniture and upholstery — delivered by trained teams with surface-specific equipment.',
    },
    includes: {
      ar: [
        'التنظيف العميق',
        'تنظيف المنازل',
        'الفلل',
        'القصور',
        'الفنادق',
        'المستشفيات',
        'المستودعات',
        'المباني',
        'تنظيف ما بعد الإنشاء',
        'تنظيف الجدران والأسقف والمناطق المرتفعة',
        'تنظيف الأثاث والمفروشات',
      ],
      en: [
        'Deep cleaning',
        'Houses',
        'Villas',
        'Palaces',
        'Hotels',
        'Hospitals',
        'Warehouses',
        'Buildings',
        'Post-construction cleaning',
        'Walls, ceilings and high-level areas',
        'Furniture and upholstery cleaning',
      ],
    },
    image: appAssets.services.cleaning,
    accent: 'green',
  },
  {
    id: 'facade',
    number: '02',
    title: { ar: 'تنظيف الواجهات', en: 'Facade Cleaning' },
    statement: {
      ar: 'واجهات زجاجية وحجرية وأبراج بمعدات رفع متخصصة.',
      en: 'Glass, stone and tower facades with specialised access equipment.',
    },
    description: {
      ar: 'تنظيف الواجهات الزجاجية والحجرية والكلادينج للأبراج والمباني المرتفعة من الداخل والخارج، باستخدام معدات الرفع وأنظمة الوصول الآمن وفرق مؤهلة للعمل على الارتفاعات.',
      en: 'Cleaning of glass, stone and cladding facades for towers and high-rise buildings, inside and out, using lifting equipment, safe access systems and height-qualified crews.',
    },
    includes: {
      ar: [
        'الزجاج',
        'الحجر',
        'الأبراج',
        'المباني المرتفعة',
        'الكلادينج',
        'النوافذ',
        'التنظيف الداخلي والخارجي',
        'معدات الرفع',
      ],
      en: [
        'Glass',
        'Stone',
        'Towers',
        'High-rise buildings',
        'Cladding',
        'Windows',
        'Interior and exterior cleaning',
        'Lifting equipment',
      ],
    },
    image: appAssets.services.facade,
    accent: 'blue',
  },
  {
    id: 'industrial',
    number: '03',
    title: {
      ar: 'تنظيف المواقف والمنشآت الصناعية',
      en: 'Parking & Industrial Cleaning',
    },
    statement: {
      ar: 'جلي وتلميع وإزالة الزيوت وبرامج تنظيف دورية.',
      en: 'Polishing, degreasing and scheduled industrial cleaning programs.',
    },
    description: {
      ar: 'تنظيف المواقف الداخلية والخارجية والمصانع والمستودعات، مع جلي وتلميع الأرضيات وإزالة الزيوت وآثار الإطارات وتنظيف الجدران والأعمدة ومعالجة أسطح الإيبوكسي والخرسانة وتجديد العلامات الأرضية ضمن برامج تنظيف دورية.',
      en: 'Cleaning of indoor and outdoor parking, factories and warehouses — floor polishing, oil and tyre-mark removal, walls and columns, epoxy and concrete surfaces, line marking, within periodic cleaning programs.',
    },
    includes: {
      ar: [
        'المواقف الداخلية والخارجية',
        'المصانع',
        'المستودعات',
        'جلي وتلميع الأرضيات',
        'إزالة الزيوت',
        'إزالة آثار الإطارات',
        'تنظيف الجدران والأعمدة',
        'الإيبوكسي والخرسانة',
        'العلامات الأرضية',
        'برامج التنظيف الدورية',
      ],
      en: [
        'Indoor and outdoor parking',
        'Factories',
        'Warehouses',
        'Floor grinding and polishing',
        'Oil removal',
        'Tyre-mark removal',
        'Walls and columns cleaning',
        'Epoxy and concrete',
        'Floor markings',
        'Periodic cleaning programs',
      ],
    },
    image: appAssets.services.industrial,
    accent: 'navy',
  },
  {
    id: 'pools',
    number: '04',
    title: { ar: 'تنظيف المسابح', en: 'Pool Cleaning' },
    statement: {
      ar: 'تنظيف وصيانة المسابح بمعايير تشغيل منضبطة.',
      en: 'Pool cleaning and upkeep with disciplined operating standards.',
    },
    description: {
      ar: 'خدمات تنظيف المسابح وصيانتها التشغيلية للمنشآت السكنية والفندقية، بما يحافظ على جودة المياه ونظافة الأسطح والمحيط.',
      en: 'Pool cleaning and operational upkeep for residential and hospitality facilities, maintaining water quality, surfaces and surroundings.',
    },
    includes: {
      ar: ['تنظيف المسابح', 'الصيانة التشغيلية', 'المنشآت السكنية والفندقية'],
      en: ['Pool cleaning', 'Operational upkeep', 'Residential and hospitality facilities'],
    },
    image: appAssets.services.pools,
    accent: 'teal',
  },
  {
    id: 'pest',
    number: '05',
    title: { ar: 'مكافحة الآفات', en: 'Pest Control' },
    statement: {
      ar: 'برامج وقاية ومكافحة دورية وطارئة.',
      en: 'Preventive, periodic and emergency pest programs.',
    },
    description: {
      ar: 'مكافحة الحشرات الزاحفة والطائرة والقوارض ومكافحة الطيور، مع التبخير والمصائد وبرامج الوقاية والخدمات الدورية والطوارئ وفق خطط مناسبة لكل منشأة.',
      en: 'Control of crawling and flying insects, rodents and birds, with fumigation, traps, prevention programs and periodic or emergency services tailored to each facility.',
    },
    includes: {
      ar: [
        'الحشرات الزاحفة',
        'الحشرات الطائرة',
        'الصراصير',
        'النمل',
        'بق الفراش',
        'الذباب',
        'البعوض',
        'القوارض',
        'التبخير',
        'مكافحة الطيور',
        'المصائد',
        'الخدمات الدورية والطوارئ',
        'الوقاية',
      ],
      en: [
        'Crawling insects',
        'Flying insects',
        'Cockroaches',
        'Ants',
        'Bed bugs',
        'Flies',
        'Mosquitoes',
        'Rodents',
        'Fumigation',
        'Bird control',
        'Traps',
        'Periodic and emergency services',
        'Prevention',
      ],
    },
    image: appAssets.services.pest,
    accent: 'green',
  },
  {
    id: 'insulation',
    number: '06',
    title: {
      ar: 'العزل المائي والحراري وعزل الخزانات',
      en: 'Waterproofing, Thermal & Tank Insulation',
    },
    statement: {
      ar: 'معالجة التسربات والحماية من الرطوبة والحرارة.',
      en: 'Leak treatment, moisture and thermal protection.',
    },
    description: {
      ar: 'أعمال العزل المائي والحراري ومعالجة تسربات المياه والحماية من الرطوبة، إضافة إلى عزل الخزانات بالإيبوكسي وفق متطلبات كل موقع.',
      en: 'Waterproofing and thermal insulation works, water-leak treatment and moisture protection, plus epoxy tank insulation according to each site requirement.',
    },
    includes: {
      ar: ['معالجة تسربات المياه', 'الحماية من الرطوبة', 'العزل الحراري', 'عزل الخزانات بالإيبوكسي'],
      en: ['Water leak treatment', 'Moisture protection', 'Thermal insulation', 'Epoxy tank insulation'],
    },
    image: appAssets.services.insulation,
    accent: 'blue',
  },
  {
    id: 'mep',
    number: '07',
    title: { ar: 'السباكة والكهرباء والتكييف', en: 'Plumbing, Electrical & HVAC' },
    statement: {
      ar: 'أعمال وصيانة الأنظمة الميكانيكية والكهربائية.',
      en: 'Mechanical and electrical systems works and maintenance.',
    },
    description: {
      ar: 'تنفيذ وصيانة أعمال السباكة والكهرباء والتكييف للمنشآت السكنية والتجارية والصناعية بفرق فنية متخصصة.',
      en: 'Execution and maintenance of plumbing, electrical and HVAC works for residential, commercial and industrial facilities by specialised technical teams.',
    },
    includes: {
      ar: ['السباكة', 'الكهرباء', 'التكييف', 'الصيانة الدورية'],
      en: ['Plumbing', 'Electrical', 'HVAC', 'Periodic maintenance'],
    },
    image: appAssets.services.mep,
    accent: 'navy',
  },
  {
    id: 'manpower',
    number: '08',
    title: { ar: 'توفير العمالة', en: 'Manpower Supply' },
    statement: {
      ar: 'عمالة متخصصة ومساندة، موسمية أو دائمة.',
      en: 'Skilled and support manpower, seasonal or permanent.',
    },
    description: {
      ar: 'توفير العمالة المتخصصة والمساندة للمطاعم والمقاهي والمصانع والفنادق والشركات والمتاجر، بعقود موسمية أو دائمة، بما في ذلك فنيو الكهرباء والسباكة والتكييف.',
      en: 'Supply of skilled and support manpower for restaurants, cafés, factories, hotels, companies and retail — seasonal or permanent — including electrical, plumbing and HVAC technicians.',
    },
    includes: {
      ar: [
        'العمالة المتخصصة',
        'العمالة المساندة',
        'المطاعم',
        'المقاهي',
        'المصانع',
        'الفنادق',
        'الشركات',
        'المتاجر',
        'العمالة الموسمية',
        'العمالة الدائمة',
        'فنيي الكهرباء',
        'فنيي السباكة',
        'فنيي التكييف',
      ],
      en: [
        'Skilled manpower',
        'Support manpower',
        'Restaurants',
        'Cafés',
        'Factories',
        'Hotels',
        'Companies',
        'Retail stores',
        'Seasonal manpower',
        'Permanent manpower',
        'Electrical technicians',
        'Plumbing technicians',
        'HVAC technicians',
      ],
    },
    image: appAssets.services.manpower,
    accent: 'teal',
  },
  {
    id: 'facilities',
    number: '09',
    title: { ar: 'إدارة وتشغيل وصيانة المرافق', en: 'Facilities Management & O&M' },
    statement: {
      ar: 'تشغيل وصيانة متكاملة للمرافق.',
      en: 'Integrated facility operation and maintenance.',
    },
    description: {
      ar: 'إدارة وتشغيل وصيانة المرافق بعقود متكاملة تشمل الفرق التشغيلية وخطط الصيانة الوقائية والتصحيحية لمختلف أنواع المنشآت.',
      en: 'Facility management, operation and maintenance under integrated contracts including operating teams and preventive/corrective maintenance plans for various facility types.',
    },
    includes: {
      ar: ['إدارة المرافق', 'التشغيل', 'الصيانة الوقائية', 'الصيانة التصحيحية'],
      en: ['Facility management', 'Operations', 'Preventive maintenance', 'Corrective maintenance'],
    },
    image: appAssets.services.facilities,
    accent: 'green',
  },
  {
    id: 'equipment',
    number: '10',
    title: { ar: 'تأجير المعدات', en: 'Equipment Rental' },
    statement: {
      ar: 'معدات ثقيلة وخفيفة مع فحص وصيانة.',
      en: 'Heavy and light equipment with inspection and maintenance.',
    },
    description: {
      ar: 'تأجير المعدات الثقيلة والخفيفة والرافعات والمولدات ومعدات الرفع، مع الفحص والصيانة والمساعدة في اختيار المعدة المناسبة لطبيعة العمل.',
      en: 'Rental of heavy and light equipment, cranes, generators and lifting equipment, with inspection, maintenance and support in selecting the right equipment for the job.',
    },
    includes: {
      ar: [
        'معدات ثقيلة',
        'معدات خفيفة',
        'رافعات',
        'مولدات',
        'معدات الرفع',
        'الفحص والصيانة',
        'المساعدة في اختيار المعدات',
      ],
      en: [
        'Heavy equipment',
        'Light equipment',
        'Cranes',
        'Generators',
        'Lifting equipment',
        'Inspection and maintenance',
        'Equipment selection support',
      ],
    },
    image: appAssets.services.equipment,
    accent: 'navy',
  },
  {
    id: 'construction',
    number: '11',
    title: { ar: 'الإنشاءات والمقاولات', en: 'Construction & Contracting' },
    statement: {
      ar: 'تنفيذ المباني والتشطيبات وأعمال ما بعد الإنشاء.',
      en: 'Buildings, finishing and post-construction works.',
    },
    description: {
      ar: 'تنفيذ المباني والمنشآت والتشطيبات وأعمال ما بعد الإنشاء والعزل، مع إمكانية استكمال العقد بأعمال التشغيل والصيانة.',
      en: 'Execution of buildings, structures, finishing and post-construction works and insulation, with the option to extend into operation and maintenance.',
    },
    includes: {
      ar: ['المباني', 'المنشآت', 'التشطيبات', 'أعمال ما بعد الإنشاء', 'العزل', 'التشغيل والصيانة'],
      en: [
        'Buildings',
        'Structures',
        'Finishing works',
        'Post-construction works',
        'Insulation',
        'Operation and maintenance',
      ],
    },
    image: appAssets.services.construction,
    accent: 'blue',
  },
];

export const getService = (id: string): Service | undefined => services.find((s) => s.id === id);

/** Arabic-aware normalisation for local search. */
export const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[\u0640\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();

export const searchServices = (query: string): Service[] => {
  const q = normalize(query);
  if (!q) return services;
  return services.filter((s) => {
    const haystack = normalize(
      [
        s.title.ar,
        s.title.en,
        s.statement.ar,
        s.statement.en,
        s.number,
        ...s.includes.ar,
        ...s.includes.en,
      ].join(' '),
    );
    return haystack.includes(q);
  });
};
