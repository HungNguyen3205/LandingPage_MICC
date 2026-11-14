export type ProductCategory = 'all' | 'villa' | 'townhouse' | 'shophouse' | 'apartment';

export interface NavItem {
  label: string;
  href: string;
  target?: string;
  isCta?: boolean;
}

export interface ValueItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Sparkles' | 'Trees' | 'Waves' | 'Compass' | 'Droplets' | 'FerrisWheel';
}

export interface ProductSpecs {
  subdivision: string;
  floors: string;
  bedrooms: string;
  view: string;
  frontage?: string;
  legal: string;
  handover: string;
  policies: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'villa' | 'townhouse' | 'shophouse' | 'apartment';
  categoryLabel: string;
  area: string;
  priceNote: string;
  description: string;
  image: string;
  tags: string[];
  specs?: ProductSpecs;
}

export interface AmenityItem {
  id: string;
  title: string;
  tag: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  aspectClass?: string;
}

/** Một căn cụ thể khách bấm chọn trong bảng giá, dùng để điền sẵn form tư vấn. */
export interface SelectedUnit {
  code: string;
  zone: string;
  type: string;
  price: string;
  priceLabel: string;
  productName: string;
}

export interface ExperienceItem {
  id: string;
  tag: string;
  title: string;
  caption: string;
  image: string;
  position?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ConsultationFormData {
  fullName: string;
  phone: string;
  email: string;
  product: string;
  preferredTime: string;
  notes: string;
  /** Căn chọn trong bảng giá, gửi riêng để Telegram/Sheet hiển thị rõ */
  unit?: string;
  /** Ghi đè trang nguồn (ví dụ popup), mặc định là đường dẫn hiện tại */
  pageSource?: string;
  consentAgreed: boolean;
  _hp_company?: string; // Honeypot field chống spam
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  isDemo?: boolean;
  statusCode?: 'SUCCESS' | 'DEMO_MODE' | 'VALIDATION_ERROR' | 'RATE_LIMITED' | 'SERVICE_UNAVAILABLE';
  registrationCode?: string;
  telegramSent?: boolean;
}

export interface QuickContactConfig {
  phoneNumber?: string; // If empty or undefined, hotline button won't be shown
  zaloUrl?: string;     // If empty or undefined, Zalo button won't be shown
  enableScrollTop: boolean;
  enableMobileBottomBar: boolean;
}

export interface ProjectMetadata {
  brandName: string;
  brandSubtitle: string;
  tagline: string;
  secondaryTagline: string;
  disclaimerShort: string;
  disclaimerDetailed: string;
  designerCredit: string;
  contactStatusNotice: string;
}

