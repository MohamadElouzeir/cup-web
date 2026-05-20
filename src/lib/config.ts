/**
 * Central config. Update WhatsApp number, email, EmailJS keys here.
 */
export const CONTACT = {
  /** Internal — where contact-form emails are delivered. NOT shown in UI. */
  email: "marketing@intelligentcup-s.com",
  phoneDisplay: "+961 3 800 244",
  whatsappUrl: "https://wa.me/9613800244",
  locationLabel: "Lebanon",
};

export const EMAILJS = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
  /** "to_email" param if your template uses one */
  toEmail: CONTACT.email,
};

export const LOCATIONS = [
  {
    id: "beirut-downtown",
    name: "Beirut Downtown",
    nameAr: "وسط بيروت",
    coords: [33.8959, 35.5018] as [number, number],
    address: "Martyrs' Square, Beirut",
    addressAr: "ساحة الشهداء، بيروت",
    status: "running" as const,
  },
  {
    id: "jounieh",
    name: "Jounieh Marina",
    nameAr: "مارينا جونية",
    coords: [33.9806, 35.6178] as [number, number],
    address: "Jounieh Bay, Mount Lebanon",
    addressAr: "خليج جونية، جبل لبنان",
    status: "running" as const,
  },
  {
    id: "tripoli",
    name: "Tripoli Old Souk",
    nameAr: "سوق طرابلس القديم",
    coords: [34.4346, 35.8358] as [number, number],
    address: "Old Souks, Tripoli",
    addressAr: "الأسواق القديمة، طرابلس",
    status: "deploying" as const,
  },
  {
    id: "byblos",
    name: "Byblos Port",
    nameAr: "مرفأ جبيل",
    coords: [34.1232, 35.6519] as [number, number],
    address: "Byblos Port, Mount Lebanon",
    addressAr: "مرفأ جبيل، جبل لبنان",
    status: "running" as const,
  },
];
