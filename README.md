# الجواد — Aljawad

تطبيق جوال فاخر (Premium Mobile App) لشركة **الجواد الدولية العربية** (Aljawad International Arabia Company).

---

## Overview

- **اللغة الافتراضية**: العربية + RTL، مع دعم كامل للغة الإنجليزية + LTR.
- **الهوية البصرية**: تصميم زجاجي فاخر (Glassmorphic UI)، وضع افتراضي داكن (أسود شبه نقي + أخضر عميق)، ووضع فاتح (كحلي/أخضر).
- **دعم بدون اتصال (Offline-first)**: يعمل التطبيق بكفاءة عالية حتى مع انقطاع الإنترنت، مع مزامنة تلقائية للبيانات عند توفر الاتصال.
- **محتوى ديناميكي (Dynamic Content)**: يتم جلب بيانات الشركة والمشاريع عبر ملفات JSON خارجية، مما يتيح تحديث التطبيق فوراً دون الحاجة لبناء نسخة جديدة.
- **تجربة تنقل ذكية**: قائمة جانبية (Side Drawer) فاخرة، تنقل سفلي عائم، وحركات انتقال ناعمة (Slide & Fade Animations).
- **الطلبات**: معالج متعدد الخطوات (Multi-step Flow) لطلب الخدمات وعروض الأسعار والمعاينات، مع حفظ محلي آمن للطلبات.

## Tech Stack

| الطبقة | التقنية |
| --- | --- |
| UI / Framework | React 19 + TypeScript (strict) |
| Build Tool | Vite 7 |
| Mobile Wrapper | Capacitor 8 (Android) |
| Styling | Tailwind CSS v4 + Design Tokens (CSS Variables) |
| Animations | CSS Transitions + IntersectionObserver (UI-thread) |
| Icons | Custom SVG System + 3D Material Icons |
| State | React Context (Theme, i18n, Navigation, Drawer, Data Stores) |
| Native Plugins | `@capacitor/status-bar`, `@capacitor/share`, `@capacitor/app` |
| CI/CD | GitHub Actions (يتم بناء وتوقيع APK/AAB تلقائياً) |

## Key Features

- **Onboarding**: شاشات تعريفية تفاعلية عند أول تشغيل.
- **Dynamic Data Stores**: مزامنة فورية لبيانات الشركة والمشاريع عبر `companyStore.tsx` و `projectsStore.tsx`.
- **Premium UI**: تأثيرات زجاجية (Frosted Glass)، تدرجات نيون، ورسوم بيانية متحركة.
- **Smart Back Navigation**: دعم زر الرجوع في أندرويد مع رسالة تأكيد الخروج.
- **WhatsApp Integration**: مشاركة التطبيق والخدمات والمشاريع مباشرة عبر واتساب.

## Architecture

```

src/
├── App.tsx                     # Shell + Providers + Router outlet
├── core/
│   ├── theme.tsx               # إدارة الثيم + Status Bar
│   ├── i18n.tsx                # القواميس والترجمة
│   ├── navigation.tsx          # إدارة المسارات والتنقل
│   ├── drawer.tsx              # حالة القائمة الجانبية
│   ├── companyStore.tsx        # جلب بيانات الشركة ديناميكياً
│   ├── projectsStore.tsx       # جلب بيانات المشاريع ديناميكياً
│   ├── store.tsx               # إدارة الطلبات محلياً
│   ├── actions.ts              # دوال خارجية (مكالمات، مشاركة، واتساب)
│   └── uiEvents.ts             # أحداث واجهة المستخدم (مثل تركيز البحث)
├── data/
│   ├── company.ts              # النماذج والبيانات الافتراضية للشركة
│   ├── services.ts             # الخدمات الـ 11
│   ├── projects.ts             # نماذج المشاريع
│   └── requests.ts             # نماذج الطلبات و LocalRepository
├── components/
│   ├── icons.tsx               # الأيقونات (SVG)
│   ├── kit.tsx                 # مكونات الواجهة (أزرار، حقول، هيدر)
│   └── SideDrawer.tsx          # القائمة الجانبية الفاخرة
└── features/
├── onboarding/             # شاشات الترحيب
├── home/                   # الشاشة الرئيسية (Hero, Sliders, Stats)
├── services/               # الخدمات والتفاصيل
├── request/                # الطلبات ومعالج الخطوات
├── projects/               # المشاريع والتفاصيل
└── more/                   # الإعدادات، اللغات، الأسئلة الشائعة

```

## Installation & Development

```bash
# 1. تثبيت الحزم
npm install

# 2. تشغيل بيئة التطوير
npm run dev

# 3. بناء نسخة الويب (التي يعتمد عليها Capacitor)
npm run build

# 4. مزامنة ملفات الويب مع مشروع أندرويد
npx cap sync android

# 5. فتح المشروع في Android Studio (إن لزم)
npx cap open android
```

Build & Deployment

يتم بناء التطبيق وتوقيعه تلقائياً عبر GitHub Actions.

· يتم توليد ملفات APK و AAB عند كل push إلى فرع main.
· ملفات التوقيع (Keystore) مؤمنة ومحفوظة في أسرار المستودع (GitHub Secrets).
· يمكن تحميل نسخة الـ APK الجاهزة للتثبيت من قسم Artifacts في صفحة Actions.

Dynamic Content System

التطبيق مصمم ليكون قابلاً للتحديث دون إعادة بناء:

1. بيانات الشركة: تُجلب من public/data/company.json (الأرقام، الهاتف، العنوان، الإحصائيات).
2. المشاريع: تُجلب من public/data/projects.json.
3. يتم تخزين هذه البيانات في localStorage كنسخة احتياطية لضمان العمل بدون إنترنت.
4. للتحديث: قم بتعديل ملف JSON ورفعه، وسيتم تحديث المحتوى لجميع المستخدمين في غضون دقائق.

Localization

· القواميس في src/core/i18n.tsx (تدعم العربية والإنجليزية).
· يتم تغيير اتجاه التطبيق (RTL/LTR) تلقائياً بناءً على اللغة المختارة.
· يمكن إضافة لغات جديدة بسهولة (متاح حالياً عبر Bottom Sheet في شاشة "المزيد").

Assets

· Logo: public/images/logo.png (يُستخدم كأيقونة للتطبيق).
· Hero & Services: مسارات محلية داخل public/images/ أو عبر روابط CDN للمشاريع الديناميكية.

Content Integrity

· بيانات الشركة (الأرقام، العناوين) مركزية في company.json.
· المشاريع الحالية حقيقية (مستخرجة من موقع الشركة الرسمي).
· بعض المشاريع التجريبية لا تزال تحمل وسم (Demo) للتمييز.

Developer / Credits

Developed by: Abdullah AL-Hjry
الاسم بالعربية: عبدالله الحجري
Contact: +967779966185

Designed & Developed by Abdullah AL-Hjry.

```
