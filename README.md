# الجواد — Aljawad

تجربة رقمية فاخرة لشركة **الجواد الدولية العربية** (Aljawad International Arabia Company).

> **ملاحظة صريحة حول البيئة التقنية**
> طُلب في الوصف الأصلي بناء التطبيق بـ React Native. بيئة التنفيذ الحالية هي بيئة ويب
> (React + TypeScript + Vite + Tailwind) ولا تدعم تشغيل أو بناء مشروع React Native / Android.
> لذلك تم تنفيذ المنتج كاملاً بنفس المعمارية والهوية والتجربة (Mobile-first, RTL-first, Offline-first)
> على شكل تطبيق ويب قابل للمعاينة فعلياً، مع فصل واضح بين الطبقات يجعل نقل الطبقة التقديمية إلى
> React Native مباشراً (الـ Data / Repositories / i18n / Theme Tokens / Navigation model مستقلة عن DOM).
> **لم يتم** تنفيذ Android build أو Release build أو اختبارات Jest في هذه البيئة، ولا يُدّعى نجاحها.

---

## Overview

- اللغة الافتراضية: **العربية + RTL**، مع تفعيل **English + LTR** من الإعدادات.
- الوضع الافتراضي: **Dark** (أسود شبه نقي + أخضر عميق + كحلي)، مع **Light** بهوية خضراء/كحلية مُشبعة (ليس White UI تقليدي) و**System**.
- يعمل بالكامل دون اتصال: الخدمات، المشاريع، البحث، إنشاء الطلبات، الطلبات المحفوظة، الإعدادات.
- لا يوجد Backend، ولا Login، ولا AI، ولا ادعاء بإرسال الطلبات للشركة.

## Tech Stack

| الطبقة | التقنية |
| --- | --- |
| UI | React 19 + TypeScript (strict) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 + Design Tokens (CSS Variables) |
| Motion | CSS/IntersectionObserver + scroll-driven transforms (UI-thread) |
| Icons | نظام أيقونات SVG أصلي + Material-Based 3D Icons (SVG متعدد الطبقات) |
| State | React Context (Theme / i18n / Navigation / Requests) |
| Persistence | localStorage عبر `LocalRequestRepository` |

## Architecture

```
src/
├── App.tsx                     # Shell + Bottom Navigation + Router outlet
├── core/
│   ├── theme.tsx               # Theme modes (system/light/dark) + reduced motion
│   ├── i18n.tsx                # ar/en dictionaries + direction + persistence
│   ├── navigation.tsx          # Type-safe Route model + stack + tabs
│   ├── store.tsx               # Requests provider (ViewModel layer)
│   └── actions.ts              # External actions: phone / WhatsApp / email / maps
├── data/
│   ├── company.ts              # AppConfiguration + ContactInfo + Asset Registry
│   ├── services.ts             # 11 services + Arabic-aware search
│   ├── projects.ts             # Demo projects (clearly labelled)
│   └── requests.ts             # Models + RequestRepository + LocalRequestRepository
├── components/
│   ├── icons.tsx               # Glyph system + MaterialIcon3D + BrandMark
│   └── kit.tsx                 # Buttons, fields, reveal, headers, toast…
└── features/
    ├── home/                   # Cinematic hero, search, carousel, why, featured…
    ├── services/               # List + editorial carousel + immersive detail
    ├── request/                # Multi-step flows + my requests + detail + success
    ├── projects/               # Cinematic showcase + case-study detail
    └── more/                   # Brand utility hub, about, contact, settings, legal, developer
```

الفصل محفوظ بين: **Presentation → State → Domain → Data → Configuration**.

## Installation & Development

```bash
npm install
npm run dev      # development
npm run build    # production build (dist/index.html)
npm run preview  # preview built output
```

## Localization

- القواميس: `src/core/i18n.tsx` (`ar` و `en`) — كل نص في التطبيق يمر عبر `t()` أو `bi()`.
- الاتجاه يتغير تلقائياً (`dir=rtl|ltr`) ويتم حفظ اللغة محلياً.
- لإضافة مفتاح جديد: أضفه في `ar` ثم في `en` (TypeScript يفرض اكتمال الترجمة).

## Theme

- التوكنز في `src/index.css` (`:root` / `[data-theme="light"]`) ثم تُعرض لـ Tailwind عبر `@theme inline`.
- التوكنز تشمل: background, surface, elevated, panel, line, text, muted, primary, navy, accent, success, warning, error, radii, motion.
- Light و Dark **ليسا انعكاساً** لبعضهما: الفاتح مبني على أسطح خضراء/كحلية باردة، والداكن على أسود شبه نقي.

## Assets

| Asset | Location (registry) | Purpose |
| --- | --- | --- |
| Logo | `BrandMark` في `src/components/icons.tsx` | شعار مؤقت (Placeholder) — يُستبدل بالشعار الرسمي |
| Hero | `appAssets.hero` | صورة الواجهة الرئيسية |
| Services | `appAssets.services.*` | صورة لكل خدمة من الخدمات الـ11 |
| Projects | `appAssets.projects.*` | أغلفة ومعارض المشاريع |
| About / Contact | `appAssets.aboutVisual`, `appAssets.contactVisual` | صور الصفحات التعريفية |
| 3D Icons | `MaterialIcon3D` (SVG) | أيقونات مادية ثلاثية الأبعاد خفيفة بلا ملفات ضخمة |

**كيفية استبدال صورة الواجهة:**
1. ضع الصورة في `public/images/hero/home_hero.jpg`.
2. عدّل `appAssets.hero` في `src/data/company.ts` إلى `/images/hero/home_hero.jpg`.
3. أعد البناء: `npm run build`.

نفس الطريقة لصور الخدمات (`/images/services/...`) والمشاريع (`/images/projects/...`).
جميع الصور الحالية صور تجريبية (Stock) وليست صوراً رسمية للشركة.

## Local Data & Backend Integration

- العقد: `RequestRepository` في `src/data/requests.ts`.
- التنفيذ الحالي: `LocalRequestRepository` (localStorage).
- للربط بـ Backend مستقبلاً: أنشئ `RemoteRequestRepository implements RequestRepository`
  وبدّل التصدير `export const requestRepository = new RemoteRequestRepository()` فقط.
  لا حاجة لتعديل أي شاشة. نفس النمط ينطبق على الخدمات والمشاريع (`services.ts` / `projects.ts`).

## Content Integrity

- بيانات الشركة الرسمية (الاسم، الهاتف، الجوال، واتساب، البريد، العنوان، الموقع) في `src/data/company.ts` فقط.
- عدد المشاريع (`projectsCount`) قيمة مركزية واحدة.
- المشاريع المعروضة **نماذج تجريبية** معلّمة بوضوح (`DEMO · 0x`) وقابلة للاستبدال.
- لا توجد أسعار، ولا مواعيد مؤكدة، ولا إشعارات، ولا حالات قادمة من الشركة.
- نصوص الخصوصية والشروط **Placeholder** معلّمة صراحة.

## Tested / Not Tested

| البند | الحالة |
| --- | --- |
| TypeScript strict type-check | ✅ تم (ضمن البناء) |
| Production build (`npm run build`) | ✅ تم بنجاح |
| مراجعة بصرية (Light/Dark, RTL/LTR) | ✅ مراجعة تصميمية يدوية |
| Jest / React Testing Library | ❌ لم تُنفذ (غير متاحة في هذه البيئة) |
| Android Debug / Release build | ❌ غير متاح في هذه البيئة |

## Developer / Credits

**Developed by:** Abdullah AL-Hjry
**الاسم بالعربية:** عبدالله الحجري
**Contact:** +967779966185

Designed & Developed by Abdullah AL-Hjry.
