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
    id: "choueifat",
    name: "The Spot Choueifat",
    nameAr: "ذا سبوت شويفات",
    coords: [33.793139, 35.485417] as [number, number],
    address: "Chouaifet El Aamroussieh, Mount Lebanon",
    addressAr: "شويفات العمروسية، جبل لبنان",
    status: "deploying" as const,
  },
  {
    id: "verdun",
    name: "Verdun",
    nameAr: "فردان",
    coords: [33.883916, 35.48333] as [number, number],
    address: "Verdun, Beirut",
    addressAr: "فردان، بيروت",
    status: "deploying" as const,
  },
];
