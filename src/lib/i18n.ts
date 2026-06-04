// ─────────────────────────────────────────────
//  Cup S — i18n (EN + AR, Arabic RTL)
// ─────────────────────────────────────────────

export type Locale = "en" | "ar";

export const LOCALES: { code: Locale; label: string; native: string; rtl?: boolean }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "ar", label: "العربية", native: "ع", rtl: true },
];

export const isRTL = (locale: Locale) => locale === "ar";

type Dict = Record<string, string>;

const en: Dict = {
  // Nav
  "nav.home": "Home",
  "nav.menu": "Menu",
  "nav.locations": "Locations",
  "nav.contact": "Contact",
  "nav.about": "About",

  // Hero
  "hero.tag": "Brewed by robots. Loved by humans.",
  "hero.title.line1": "ROBOTIC",
  "hero.title.line2": "COFFEE",
  "hero.sub": "Precision-crafted drinks, served 24/7 from our smart coffee kiosks across Lebanon.",
  "hero.cta.menu": "View the Menu",
  "hero.cta.locations": "Find a Kiosk",

  // Marquee
  "marquee.1": "Brewed for taste",
  "marquee.2": "24/7 freshness",
  "marquee.3": "Robot precision",
  "marquee.4": "Lebanese love",
  "marquee.5": "Crafted in seconds",

  // How it works
  "how.title": "How it works",
  "how.sub": "Three taps. One perfect cup. Zero wait.",
  "how.s1.title": "Tap & Customize",
  "how.s1.desc": "Pick your drink and dial in the milk, shots, syrup — exactly how you like it.",
  "how.s2.title": "Watch the Magic",
  "how.s2.desc": "Our robotic barista grinds, brews and pours your drink right in front of you.",
  "how.s3.title": "Grab & Go",
  "how.s3.desc": "Hot, fresh, perfect — every single time. Made in under a minute.",

  // Features
  "features.title": "Why Cup S",
  "features.sub": "Engineered for the perfect cup, every cup.",
  "feat.1.title": "Precision Brewing",
  "feat.1.desc": "Calibrated to 0.1g and 0.5°C — espresso the way it was meant to be.",
  "feat.2.title": "Lightning Fast",
  "feat.2.desc": "From tap to sip in under 45 seconds. No queue, no wait.",
  "feat.3.title": "Always Open",
  "feat.3.desc": "24/7 service across our kiosk network. Coffee whenever you need it.",
  "feat.4.title": "Spotless Hygiene",
  "feat.4.desc": "Contactless prep with auto-cleaning after every drink.",
  "feat.5.title": "Smart Menu",
  "feat.5.desc": "Discover new drinks, recommendations and seasonal specials.",
  "feat.6.title": "Made in Lebanon",
  "feat.6.desc": "Proudly built and operated under the cedar.",

  // Lebanon section
  "leb.title": "Crafted under the Cedar",
  "leb.sub": "Born in Lebanon. Brewed for the world.",
  "leb.body": "From the mountains of Mount Lebanon to the heart of Beirut, Cup S brings the future of coffee — made with the warmth of Lebanese hospitality.",

  // CTA
  "cta.title": "Ready for your perfect cup?",
  "cta.sub": "Find your nearest Cup S kiosk or reach out — we'd love to hear from you.",
  "cta.locations": "Locations",
  "cta.contact": "Contact us",

  // Shops hub
  "shops.title": "Our Shops",
  "shops.sub": "Three concepts. One robotic vision. Pick your experience.",
  "shops.coffee.title": "Intelligent Coffee",
  "shops.coffee.desc": "Premium robotic-crafted coffee. From espressos to refreshing cold drinks, every cup is precision-made.",
  "shops.coffee.cta": "Explore",
  "shops.brewery.title": "Intelligent Brewery",
  "shops.brewery.desc": "Automated craft beverages — coming soon to a kiosk near you.",
  "shops.bar.title": "Intelligent Bar",
  "shops.bar.desc": "Robotic mixology — perfectly crafted cocktails at the touch of a button. Coming soon.",
  "shops.comingSoon": "Coming soon",
  "shops.explore": "Explore",

  // Age gate
  "age.title": "Are you of legal drinking age?",
  "age.sub": "You must be 18 or older to enter Intelligent Bar.",
  "age.yes": "I am 18 or older",
  "age.no": "Take me back",

  // Coming soon
  "soon.title": "Coming Soon",
  "soon.brewery": "Intelligent Brewery is brewing up something special. Stay tuned.",
  "soon.bar": "Intelligent Bar is mixing the future of cocktails. Check back soon.",
  "soon.cta": "Explore the rest of Cup S",

  // Menu page
  "menu.title": "Our Menu",
  "menu.sub": "Hand-picked beans. Robot-perfect brews.",
  "menu.empty": "No items available",
  "menu.swipe": "Swipe or drag to explore",
  "menu.allCategories": "All",
  "menu.expand": "Read more",
  "menu.collapse": "Show less",
  "menu.hot": "Hot Coffee",
  "menu.cold": "Refresher Drinks",
  "menu.soft": "Soft Drinks",

  // Locations page
  "loc.title": "Find a Kiosk",
  "loc.sub": "Cup S kiosks across Lebanon — always open, always fresh.",
  "loc.directions": "Get directions",
  "loc.hours": "Open 24/7",

  // Contact page
  "contact.title": "Get in touch",
  "contact.sub": "Questions, partnerships, or just want to say hi? We're listening.",
  "contact.name": "Full name",
  "contact.namePh": "Your name",
  "contact.email": "Email",
  "contact.emailPh": "you@example.com",
  "contact.message": "Message",
  "contact.messagePh": "Tell us what's on your mind…",
  "contact.send": "Send message",
  "contact.sending": "Sending…",
  "contact.success": "Message sent — we'll be in touch soon!",
  "contact.error": "Something went wrong. Please try again.",
  "contact.or": "or reach us directly",
  "contact.whatsapp": "WhatsApp",
  "contact.fillAll": "Please fill out all fields.",
  "contact.shortMsg": "Message must be at least 10 characters.",
  "contact.badEmail": "Please enter a valid email address.",
  "contact.rateLimit": "Too many attempts. Please try again later.",

  // Footer
  "footer.rights": "All rights reserved.",
  "footer.tag": "Brewed for taste. Built in Lebanon.",
  "footer.follow": "Follow",
  "footer.quick": "Quick links",
  "footer.contact": "Get in touch",
};

const ar: Dict = {
  // Nav
  "nav.home": "الرئيسية",
  "nav.menu": "القائمة",
  "nav.locations": "المواقع",
  "nav.contact": "تواصل",
  "nav.about": "من نحن",

  // Hero
  "hero.tag": "تحضّره الروبوتات. يحبّه البشر.",
  "hero.title.line1": "قهوة",
  "hero.title.line2": "روبوتية",
  "hero.sub": "مشروبات مُحضَّرة بدقة، تُقدَّم على مدار الساعة من أكشاكنا الذكية في جميع أنحاء لبنان.",
  "hero.cta.menu": "تصفّح القائمة",
  "hero.cta.locations": "اعثر على كشك",

  // Marquee
  "marquee.1": "محضّرة للذوق",
  "marquee.2": "طازجة ٢٤/٧",
  "marquee.3": "دقّة الروبوت",
  "marquee.4": "حبّ لبناني",
  "marquee.5": "تُحضَّر في ثوانٍ",

  // How
  "how.title": "كيف يعمل",
  "how.sub": "ثلاث ضغطات. كوب مثالي. بلا انتظار.",
  "how.s1.title": "اختر وخصّص",
  "how.s1.desc": "اختر مشروبك واضبط الحليب والجرعات والشراب — تماماً كما تحب.",
  "how.s2.title": "شاهد السحر",
  "how.s2.desc": "يطحن الروبوت ويُحضّر مشروبك أمامك مباشرةً.",
  "how.s3.title": "خذه وانطلق",
  "how.s3.desc": "ساخن، طازج، مثالي — في كل مرة. خلال أقل من دقيقة.",

  // Features
  "features.title": "لماذا Cup S",
  "features.sub": "مصمَّمة للكوب المثالي في كل مرة.",
  "feat.1.title": "تحضير دقيق",
  "feat.1.desc": "معايرة بدقّة ٠٫١ غرام و ٠٫٥ درجة — إسبريسو كما يُفترض أن يكون.",
  "feat.2.title": "سريع كالبرق",
  "feat.2.desc": "من الضغط إلى الرشفة في أقل من ٤٥ ثانية.",
  "feat.3.title": "مفتوح دائماً",
  "feat.3.desc": "خدمة ٢٤/٧ في شبكة أكشاكنا. قهوة متى احتجتها.",
  "feat.4.title": "نظافة لا تشوبها شائبة",
  "feat.4.desc": "تحضير بلا تماس مع تنظيف ذاتي بعد كل مشروب.",
  "feat.5.title": "قائمة ذكية",
  "feat.5.desc": "اكتشف مشروبات جديدة وتوصيات موسمية.",
  "feat.6.title": "صُنع في لبنان",
  "feat.6.desc": "نفخر ببنائها وتشغيلها تحت الأرز.",

  // Lebanon
  "leb.title": "صُنع تحت الأرز",
  "leb.sub": "وُلدت في لبنان. تُحضَّر للعالم.",
  "leb.body": "من جبال لبنان إلى قلب بيروت، يقدّم Cup S مستقبل القهوة — بدفء الضيافة اللبنانية.",

  // CTA
  "cta.title": "جاهز لكوبك المثالي؟",
  "cta.sub": "اعثر على أقرب كشك Cup S أو تواصل معنا — يسعدنا سماعك.",
  "cta.locations": "المواقع",
  "cta.contact": "تواصل معنا",

  // Shops hub
  "shops.title": "متاجرنا",
  "shops.sub": "ثلاثة مفاهيم. رؤية روبوتية واحدة. اختر تجربتك.",
  "shops.coffee.title": "القهوة الذكية",
  "shops.coffee.desc": "قهوة فاخرة محضّرة بواسطة الروبوت. من الإسبريسو إلى المشروبات الباردة المنعشة، كل كوب مصنوع بدقة.",
  "shops.coffee.cta": "استكشف",
  "shops.brewery.title": "المشروبات الذكية",
  "shops.brewery.desc": "مشروبات حرفية آلية — قريباً في كشك بالقرب منك.",
  "shops.bar.title": "البار الذكي",
  "shops.bar.desc": "علم الكوكتيل الروبوتي — كوكتيلات مصنوعة بإتقان بلمسة زر. قريباً.",
  "shops.comingSoon": "قريباً",
  "shops.explore": "استكشف",

  // Age gate
  "age.title": "هل أنت في سن قانونية للشرب؟",
  "age.sub": "يجب أن تكون ١٨ سنة أو أكثر لدخول البار الذكي.",
  "age.yes": "أنا ١٨ سنة أو أكثر",
  "age.no": "أعدني",

  // Coming soon
  "soon.title": "قريباً",
  "soon.brewery": "البريوري الذكي يحضّر شيئاً مميزاً. ترقّبوا.",
  "soon.bar": "البار الذكي يمزج مستقبل الكوكتيلات. عُد قريباً.",
  "soon.cta": "استكشف بقية Cup S",

  // Menu
  "menu.title": "قائمتنا",
  "menu.sub": "حبوب منتقاة بعناية. تحضير روبوتي مثالي.",
  "menu.empty": "لا توجد عناصر متاحة",
  "menu.swipe": "اسحب أو مرّر للاستكشاف",
  "menu.allCategories": "الكل",
  "menu.expand": "اقرأ المزيد",
  "menu.collapse": "عرض أقل",
  "menu.hot": "قهوة ساخنة",
  "menu.cold": "مشروبات منعشة",
  "menu.soft": "مشروبات غازية",

  // Locations
  "loc.title": "اعثر على كشك",
  "loc.sub": "أكشاك Cup S في جميع أنحاء لبنان — مفتوحة دائماً، طازجة دائماً.",
  "loc.directions": "احصل على الاتجاهات",
  "loc.hours": "مفتوح ٢٤/٧",

  // Contact
  "contact.title": "تواصل معنا",
  "contact.sub": "أسئلة، شراكات، أو فقط للسلام؟ نحن نستمع.",
  "contact.name": "الاسم الكامل",
  "contact.namePh": "اسمك",
  "contact.email": "البريد الإلكتروني",
  "contact.emailPh": "you@example.com",
  "contact.message": "الرسالة",
  "contact.messagePh": "أخبرنا بما يخطر ببالك…",
  "contact.send": "إرسال الرسالة",
  "contact.sending": "جارٍ الإرسال…",
  "contact.success": "تم إرسال رسالتك — سنتواصل معك قريباً!",
  "contact.error": "حدث خطأ ما. حاول مرة أخرى.",
  "contact.or": "أو تواصل معنا مباشرة",
  "contact.whatsapp": "واتساب",
  "contact.fillAll": "يرجى تعبئة جميع الحقول.",
  "contact.shortMsg": "يجب أن تحتوي الرسالة على ١٠ أحرف على الأقل.",
  "contact.badEmail": "يرجى إدخال بريد إلكتروني صحيح.",
  "contact.rateLimit": "محاولات كثيرة. يرجى المحاولة لاحقاً.",

  // Footer
  "footer.rights": "جميع الحقوق محفوظة.",
  "footer.tag": "محضّرة للذوق. مصنوعة في لبنان.",
  "footer.follow": "تابعنا",
  "footer.quick": "روابط سريعة",
  "footer.contact": "تواصل",
};

export const DICT: Record<Locale, Dict> = { en, ar };

export function translate(locale: Locale, key: string): string {
  return DICT[locale]?.[key] ?? DICT.en[key] ?? key;
}
