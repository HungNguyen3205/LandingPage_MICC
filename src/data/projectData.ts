import type {
  NavItem,
  ValueItem,
  ProductItem,
  AmenityItem,
  GalleryItem,
  FAQItem,
  QuickContactConfig,
  ContactInfoConfig,
  ProjectMetadata,
  PrivacyPolicyConfig,
  ExperienceItem
} from '../types';

export const projectMeta: ProjectMetadata = {
  brandName: 'VINHOMES HẢI VÂN BAY',
  brandSubtitle: 'THÀNH PHỐ NGHỈ DƯỠNG BÊN VỊNH DI SẢN',
  tagline: 'Kiệt tác nghỉ dưỡng ven biển đẳng cấp quốc tế.',
  secondaryTagline: 'Đại đô thị nghỉ dưỡng 240ha kề cận vịnh biển Hải Vân tuyệt mỹ, kiến tạo chuẩn mực sống thượng lưu tại Đà Nẵng.',
  disclaimerShort: 'Thông tin và hình ảnh dùng để tham khảo. Phối cảnh mang tính minh họa.',
  disclaimerDetailed: 'Website thuộc quyền sở hữu và vận hành bởi đối tác phân phối chính thức của dự án Vinhomes Hải Vân Bay Đà Nẵng. Mọi thông tin, tài liệu và hình ảnh được cập nhật dựa trên nguồn tin từ Chủ đầu tư và có thể điều chỉnh tùy theo quy định thực tế.',
  designerCredit: 'MICC Group · NEXME',
  contactStatusNotice: 'Hotline tư vấn: 0905 688 070',
};

/**
 * Bật/tắt các phần trên trang mà không cần xóa code.
 * showPriceList: section "Quỹ căn & chính sách bán hàng" (#bang-gia) + mục "Bảng giá" trên menu.
 *   Tạm ẩn theo yêu cầu khách (11/2026) — đổi thành true để hiện lại.
 */
export const featureFlags = {
  showPriceList: false,
  /**
   * Quỹ căn (#quy-can): 54 căn Bạch Vân · Đảo Ngọc · Vịnh Mây theo sheet của khách, dữ liệu ở src/data/exclusiveInventory.ts.
   * Thay cho dải 13 poster cũ (UnitShowcase) theo yêu cầu khách 13/11/2026 — chỉ hiện một trong hai.
   */
  showExclusiveInventory: true,
  /** Dải 13 poster cũ trượt ngang — chỉ dùng khi tắt showExclusiveInventory */
  showUnitShowcase: false,
};

export const navigationItems: NavItem[] = [
  { label: 'Trải nghiệm', href: '/#trai-nghiem' },
  ...(featureFlags.showExclusiveInventory || featureFlags.showUnitShowcase ? [{ label: 'Quỹ căn', href: '/#quy-can' }] : []),
  { label: 'Sản phẩm', href: '/#bo-suu-tap' },
  { label: 'Tiện ích', href: '/#tien-ich' },
  { label: 'Vị trí', href: '/#vi-tri' },
  { label: 'Thư viện', href: '/#thu-vien' },
  ...(featureFlags.showPriceList ? [{ label: 'Bảng giá', href: '/#bang-gia' }] : []),
  { label: 'Liên hệ', href: '/lien-he' },
];

export const consultationCtaConfig = {
  label: 'Đăng ký tư vấn',
  href: '/lien-he',
};

export const contactConfig: ContactInfoConfig = {
  advisorUnit: 'Văn phòng Bán hàng Vinhomes Hải Vân Bay (MICC Group · NEXME)',
  hotline: '0905 688 070',
  email: 'danava.haivanbay@gmail.com',
  officeAddress: '305A Trần Hưng Đạo, P. An Hải, TP. Đà Nẵng',
  mapCoordinates: undefined,
  officialMapEmbedUrl: undefined,
};

export const privacyPolicyConfig: PrivacyPolicyConfig = {
  lastUpdatedDate: '20/10/2026',
  operatorNotice: 'Nội dung cập nhật dựa trên thông tin công bố chính thức của dự án Vinhomes Hải Vân Bay Đà Nẵng.',
  retentionNotice: 'Lưu trữ phục vụ liên hệ tư vấn và gửi tài liệu dự án',
  contactNotice: 'Hotline tiếp nhận: 0905 688 070 • Văn phòng: 305A Trần Hưng Đạo, P. An Hải, TP. Đà Nẵng',
};

export const VALID_PRODUCT_PARAM_MAP: Record<string, string> = {
  'biet-thu-don-lap-vinh-may': 'Biệt Thự Đơn Lập Vịnh Mây',
  'lien-ke-vinh-may': 'Liền Kề Vịnh Mây',
  'lien-ke-bach-van': 'Liền Kề Bạch Vân',
  'lien-ke-dao-ngoc': 'Liền Kề Đảo Ngọc',
  'can-tu-van-them': 'Cần tư vấn thêm',
};

export const sanitizeProductQueryParam = (param: string | null | undefined): string => {
  if (!param) return 'Cần tư vấn thêm';
  const clean = param.toLowerCase().trim();
  return VALID_PRODUCT_PARAM_MAP[clean] || 'Cần tư vấn thêm';
};

export const quickContactConfig: QuickContactConfig = {
  phoneNumber: '0905688070',
  zaloUrl: 'https://zalo.me/0905688070',
  enableScrollTop: true,
  enableMobileBottomBar: true,
};

// 4 thế mạnh Làng Vân: biển, suối, vui chơi giải trí, thiên nhiên
export const valueItems: ValueItem[] = [
  {
    id: 'val-1',
    title: 'Biển xanh 2km',
    description: 'Bãi biển cát mịn, nước trong, hoàng hôn trên vịnh Hải Vân và cáp treo ngắm trọn bờ biển.',
    iconName: 'Waves',
  },
  {
    id: 'val-2',
    title: 'Suối mát giữa rừng',
    description: 'Dòng suối tự nhiên uốn quanh khu đô thị, đường dạo ven suối và khu phiêu lưu dưới tán rừng.',
    iconName: 'Droplets',
  },
  {
    id: 'val-3',
    title: 'Vui chơi giải trí',
    description: 'Công viên chủ đề, máng trượt xuyên núi, lễ hội đêm ven hồ và thế giới vui chơi cho trẻ em.',
    iconName: 'FerrisWheel',
  },
  {
    id: 'val-4',
    title: 'Thiên nhiên 240ha',
    description: 'Mật độ xây dựng thấp, tựa lưng núi rừng nhiệt đới, mặt hướng vịnh biển, không khí trong lành quanh năm.',
    iconName: 'Trees',
  },
];

// Dòng sản phẩm theo quỹ căn MICC Group · NEXME (Vịnh Mây 05/11/2026, Bạch Vân, Đảo Ngọc 06/11/2026)
export const productsData: ProductItem[] = [
  {
    id: 'biet-thu-don-lap-vinh-may',
    name: 'Biệt Thự Đơn Lập Vịnh Mây',
    category: 'villa',
    categoryLabel: 'Biệt thự đơn lập',
    area: 'Đất 283,8 – 329,6 m²',
    priceNote: 'Từ 17,589 tỷ',
    description: 'Dinh thự tư gia trên triền đồi Vịnh Mây, lấy cảm hứng Malibu Hills. Đơn lập 4 tầng, diện tích xây dựng 463 – 492,7 m², hướng Tây Nam.',
    image: '/images/hilltop.webp',
    tags: ['Quỹ độc quyền', 'Hướng Tây Nam', 'Giá TTTĐ', '2 căn'],
    specs: {
      subdivision: 'Phân khu Vịnh Mây · Hilltop Collection',
      floors: '4 tầng · XD 463 – 492,7 m²',
      bedrooms: 'Biệt thự đơn lập',
      view: 'Tây Nam',
      legal: 'Giá TTTĐ',
      handover: 'Theo quỹ căn',
      policies: [
        'Chiết khấu thanh toán sớm 13%/năm',
        'Vay 70% hỗ trợ lãi suất 18 – 60 tháng',
        'Bảo lãnh ngân hàng 0,5% · VinClub đến 0,9%',
      ],
    },
  },
  {
    id: 'lien-ke-vinh-may',
    name: 'Liền Kề Vịnh Mây',
    category: 'townhouse',
    categoryLabel: 'Nhà liền kề',
    area: 'Đất 70 – 105 m²',
    priceNote: 'Từ 5,781 tỷ',
    description: 'Nhà phố 4 tầng dưới chân đồi Vịnh Mây, cạnh tổ hợp Malibu Wellness Hub 1,6 ha. Mức giá vào cửa thấp nhất trong các quỹ căn đang mở bán.',
    image: '/images/trien-nui.webp',
    tags: ['Giá tốt nhất', 'Quỹ độc quyền', 'Giá TTTĐ', '5 căn'],
    specs: {
      subdivision: 'Phân khu Vịnh Mây (VM · ĐLHV)',
      floors: '4 tầng · XD 213 – 245 m²',
      bedrooms: 'Nhà liền kề',
      view: 'Tây Nam / Đông Bắc',
      legal: 'Giá TTTĐ',
      handover: 'Theo quỹ căn',
      policies: [
        'Chiết khấu thanh toán sớm 13%/năm',
        'Vay 70% hỗ trợ lãi suất 18 – 60 tháng',
        'Bảo lãnh ngân hàng 0,5% · VinClub đến 0,9%',
      ],
    },
  },
  {
    id: 'lien-ke-bach-van',
    name: 'Liền Kề Bạch Vân',
    category: 'townhouse',
    categoryLabel: 'Nhà liền kề',
    area: 'Đất 80 m²',
    priceNote: 'Từ 8,592 tỷ',
    description: 'Nhà phố 4 tầng giữa khu Bạch Vân với hồ và suối cảnh quan. Áp dụng chính sách giãn xây / thô xây luôn, ưu đãi về ở sớm 10% cho 345 căn thô xây luôn.',
    image: '/images/bach-van.webp',
    tags: ['Quỹ chung', 'Về ở sớm 10%', 'Giá Full', '8 căn'],
    specs: {
      subdivision: 'Phân khu Bạch Vân (ĐLHV)',
      floors: '4 tầng · XD 242,6 – 244,9 m²',
      bedrooms: 'Nhà liền kề',
      view: 'Tây Bắc / Tây Nam / Đông Nam',
      legal: 'Giá Full',
      handover: 'Giãn xây / Thô xây luôn',
      policies: [
        'Chiết khấu thanh toán sớm 13%/năm',
        'Về ở sớm 10% (345 căn thô xây luôn)',
        'Vay 70% hỗ trợ lãi suất · VinClub đến 0,9%',
      ],
    },
  },
  {
    id: 'lien-ke-dao-ngoc',
    name: 'Liền Kề Đảo Ngọc',
    category: 'townhouse',
    categoryLabel: 'Nhà liền kề',
    area: 'Đất 70 – 80 m²',
    priceNote: 'Từ 11,080 tỷ',
    description: 'Quỹ căn hoàn thiện xây luôn khu 3 Đảo Ngọc, lấy cảm hứng Costa Smeralda, bên vịnh biển và công viên chủ đề. Có lựa chọn cam kết tiền thuê 7%/năm.',
    image: '/images/dao-ngoc.webp',
    tags: ['Quỹ chung', 'Thuê 7%/năm', 'Giá Full', '18 căn'],
    specs: {
      subdivision: 'Phân khu Đảo Ngọc · Khu 3',
      floors: '4 tầng · XD 192,3 – 254 m²',
      bedrooms: 'Nhà liền kề',
      view: 'Tây Nam / Đông Bắc',
      legal: 'Giá Full',
      handover: 'Hoàn thiện xây luôn',
      policies: [
        'Chiết khấu thanh toán sớm 13%/năm',
        'Về ở sớm 10% (có điều kiện)',
        'Cam kết tiền thuê 7%/năm (có điều kiện)',
      ],
    },
  },
];

// Hệ thống tiện ích: ưu tiên biển, suối, vui chơi và thiên nhiên
export const amenitiesData: AmenityItem[] = [
  {
    id: 'amenity-beach-marina',
    title: 'Bãi biển 2km & Bến du thuyền',
    tag: 'BIỂN & VỊNH',
    tagline: 'Sáng tắm biển, chiều ngắm hoàng hôn trên vịnh',
    description: 'Đường bờ biển dài 2km với cát mịn và làn nước trong xanh, ôm trọn vịnh Hải Vân. Bến du thuyền, beach club và quầy lounge ven biển giúp mỗi ngày ở đây như một kỳ nghỉ.',
    image: '/images/lang-van/hero-bg.webp',
    features: [
      '2km bãi biển cát mịn, nước trong',
      'Bến du thuyền & beach club ven biển',
      'Cáp treo ngắm toàn cảnh vịnh',
    ],
  },
  {
    id: 'amenity-theme-park',
    title: 'Công viên chủ đề & Lễ hội đêm',
    tag: 'VUI CHƠI GIẢI TRÍ',
    tagline: 'Cuối tuần nào cả nhà cũng có việc để làm',
    description: 'Tổ hợp công viên chủ đề với đu quay, tàu lượn, thuyền dạo hồ, khu vui chơi trẻ em Fairy Land và phố lễ hội về đêm. Liền kề Vincom Mega Mall với ẩm thực và rạp chiếu phim.',
    image: '/images/lang-van/cong-hung-quan.webp',
    features: [
      'Đu quay, tàu lượn, thuyền dạo hồ',
      'Khu vui chơi trẻ em Fairy Land',
      'Phố lễ hội đêm & Vincom Mega Mall',
    ],
  },
  {
    id: 'amenity-forest-stream',
    title: 'Suối, rừng & Đường mòn phiêu lưu',
    tag: 'THIÊN NHIÊN',
    tagline: 'Tái tạo năng lượng giữa rừng nhiệt đới',
    description: 'Dòng suối tự nhiên, hồ cảnh quan và rừng xanh bao quanh. Đường mòn phiêu lưu, zipline, leo vách, máng trượt xuyên núi và pumptrack dành cho những gia đình yêu vận động.',
    image: '/images/lang-van/mang-truot-nui.webp',
    features: [
      'Đường dạo ven suối & hồ cảnh quan',
      'Zipline, leo vách, cầu treo giữa rừng',
      'Máng trượt xuyên núi & pumptrack',
    ],
  },
  {
    id: 'amenity-wellness',
    title: 'Hải Vân Wellness Hub 1,6ha',
    tag: 'WELLNESS',
    tagline: 'Tái tạo thân tâm sau mỗi chuyến đi',
    description: 'Tổ hợp spa, hồ bơi cảnh quan và các liệu trình chăm sóc sức khỏe giữa thiên nhiên, dành cho những ngày muốn chậm lại.',
    image: '/images/lang-van/wellness-spa.webp',
    features: [
      'Spa & liệu trình chăm sóc chuyên sâu',
      'Hồ bơi cảnh quan giữa vườn nhiệt đới',
      'Không gian thư giãn giữa thiên nhiên',
    ],
  },
  {
    id: 'amenity-vinschool-vinmec',
    title: 'Vinmec & Vinschool',
    tag: 'Y TẾ & GIÁO DỤC',
    tagline: 'An tâm khi ở dài ngày cùng gia đình',
    description: 'Phòng khám quốc tế Vinmec chăm sóc sức khỏe chuẩn 5 sao và trường liên cấp Vinschool ngay trong khu đô thị.',
    image: '/images/lang-van/vinmec.webp',
    features: [
      'Phòng khám quốc tế Vinmec',
      'Trường liên cấp Vinschool',
      'Dịch vụ y tế và bác sĩ gia đình',
    ],
  },
];

// Trải nghiệm Làng Vân (section #trai-nghiem)
export const experienceData: ExperienceItem[] = [
  { id: 'exp-cable', tag: '07:00 · Biển', title: 'Cáp treo đón nắng sớm trên vịnh', caption: 'Lướt trên tán rừng, nhìn xuống đường bờ biển xanh và cả công viên chủ đề phía dưới. Một ngày ở Làng Vân bắt đầu như thế.', image: '/images/lang-van/cap-treo-bien.webp', position: '65% center' },
  { id: 'exp-summit', tag: '09:00 · Núi', title: 'Ga cáp treo đỉnh núi', caption: 'Đường bờ biển dài hun hút dưới chân.', image: '/images/lang-van/ga-cap-treo.webp', position: '60% center' },
  { id: 'exp-forest', tag: '10:30 · Rừng', title: 'Phiêu lưu giữa rừng', caption: 'Zipline, leo vách, cầu treo dưới tán cây.', image: '/images/lang-van/phieu-luu-rung.webp' },
  { id: 'exp-coaster', tag: '14:00 · Thiên nhiên', title: 'Máng trượt xuyên núi', caption: 'Trượt qua rừng, nhìn thẳng ra biển.', image: '/images/lang-van/mang-truot-nui.webp' },
  { id: 'exp-boat', tag: '16:00 · Vui chơi', title: 'Thuyền dạo công viên', caption: 'Cả nhà cùng dạo hồ giữa công viên chủ đề.', image: '/images/lang-van/thuyen-cong-vien.webp' },
  { id: 'exp-dining', tag: '18:00 · Hoàng hôn', title: 'Bữa tối ven hồ', caption: 'Nhìn ra hồ, đu quay và những ngọn đèn đầu tiên.', image: '/images/lang-van/am-thuc-ven-ho.webp', position: 'center 60%' },
  { id: 'exp-night', tag: '20:00 · Lễ hội', title: 'Lễ hội đêm & pháo hoa', caption: 'Phố đèn lồng, đu quay rực sáng và quà vặt cho bé.', image: '/images/lang-van/le-hoi-dem.webp', position: 'center 40%' },
];

export const galleryData: GalleryItem[] = [
  { id: 'gal-1', title: 'Vịnh biển Làng Vân', caption: 'Cáp treo vượt rừng nhìn ra vịnh biển lúc hoàng hôn', image: '/images/lang-van/hero-bg.webp', aspectClass: '' },
  { id: 'gal-2', title: 'Glamping hoàng hôn', caption: 'Làng Vân Mountain Camp nhìn ra biển', image: '/images/lang-van/glamping-hoang-hon.webp', aspectClass: '' },
  { id: 'gal-3', title: 'Ga cáp treo', caption: 'Ga cáp treo trên đỉnh núi, phía dưới là đường bờ biển', image: '/images/lang-van/ga-cap-treo.webp', aspectClass: '' },
  { id: 'gal-4', title: 'Máng trượt xuyên núi', caption: 'Đường trượt giữa rừng hướng ra biển', image: '/images/lang-van/mang-truot-nui.webp', aspectClass: '' },
  { id: 'gal-5', title: 'Cổng Hùng Quan', caption: 'Lối vào công viên chủ đề', image: '/images/lang-van/cong-hung-quan.webp', aspectClass: '' },
  { id: 'gal-6', title: 'Lễ hội đêm', caption: 'Phố lễ hội và đu quay ven hồ', image: '/images/lang-van/le-hoi-dem.webp', aspectClass: '' },
  { id: 'gal-7', title: 'Tàu lượn trong rừng', caption: 'Tàu lượn quanh cây cổ thụ', image: '/images/lang-van/tau-luon-rung.webp', aspectClass: '' },
  { id: 'gal-8', title: 'Khu rèn luyện thể lực', caption: 'Đường mòn thử thách giữa rừng', image: '/images/lang-van/khu-ren-luyen.webp', aspectClass: '' },
  { id: 'gal-9', title: 'Thuyền ven hồ', caption: 'Dạo thuyền trên hồ cảnh quan', image: '/images/lang-van/thuyen-ven-ho.webp', aspectClass: '' },
  { id: 'gal-10', title: 'Hồ cảnh quan', caption: 'Hồ nước giữa thung lũng xanh', image: '/images/lang-van/ho-canh-quan.webp', aspectClass: '' },
  { id: 'gal-11', title: 'Vịnh Mây', caption: 'Toàn cảnh phân khu Vịnh Mây', image: '/images/vinh-may.webp', aspectClass: '' },
  { id: 'gal-12', title: 'Đảo Ngọc', caption: 'Toàn cảnh phân khu Đảo Ngọc', image: '/images/dao-ngoc.webp', aspectClass: '' },
  { id: 'gal-13', title: 'Bạch Vân', caption: 'Toàn cảnh phân khu Bạch Vân', image: '/images/bach-van.webp', aspectClass: '' },
];

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Dự án Vinhomes Hải Vân Bay có những loại hình sản phẩm nào?',
    answer: 'Quỹ căn đang mở bán gồm biệt thự đơn lập Vịnh Mây (đất 283,8 – 329,6 m², từ 17,589 tỷ) và nhà liền kề 4 tầng tại ba phân khu: Vịnh Mây (đất 70 – 105 m², từ 5,781 tỷ giá TTTĐ), Bạch Vân (đất 80 m², từ 8,592 tỷ giá Full) và Đảo Ngọc (đất 70 – 80 m², từ 11,080 tỷ giá Full).',
  },
  {
    id: 'faq-2',
    question: 'Chính sách bán hàng và ưu đãi tài chính của dự án như thế nào?',
    answer: 'Chính sách áp dụng từ 05/10/2026: chiết khấu thanh toán sớm 13%/năm, vay 70% với các phương án hỗ trợ lãi suất 18 – 60 tháng, bảo lãnh ngân hàng 0,5% và ưu đãi VinClub đến 0,9%. Bạch Vân và Đảo Ngọc có thêm ưu đãi về ở sớm 10%; Đảo Ngọc có cam kết tiền thuê 7%/năm. Một số ưu đãi áp dụng có điều kiện theo từng quỹ căn.',
  },
  {
    id: 'faq-3',
    question: 'Vị trí Vinhomes Hải Vân Bay kết nối giao thông ra sao?',
    answer: 'Dự án tọa lạc ngay cung đường ven vịnh Hải Vân, Đà Nẵng: Chỉ mất 15 phút đến Ga Đà Nẵng, 20 phút đến Trung tâm thành phố, 25 phút đến Phố cổ Hội An và 30 phút đến Sân bay Quốc tế Đà Nẵng, kết nối trực tiếp cao tốc Hải Vân.',
  },
  {
    id: 'faq-4',
    question: 'Làm thế nào để tôi nhận bảng giá và đăng ký lịch xem thực tế?',
    answer: 'Quý khách vui lòng để lại thông tin trong biểu mẫu đăng ký tư vấn hoặc liên hệ trực tiếp hotline 0905 688 070. Chuyên viên tư vấn F1 sẽ gửi trọn bộ tài liệu chi tiết, mặt bằng phân lô, bảng giá ngoại giao và hỗ trợ đưa đón quý khách tham quan thực tế.',
  },
];

/**
 * Quỹ căn đang mở bán: mỗi căn một ảnh poster (public/images/quy-can/<mã>.webp, bản nhỏ <mã>-sm.webp).
 * Nguồn: thư mục Google Drive của khách (11/2026). Thêm căn: thả 2 ảnh vào thư mục rồi thêm một dòng ở đây.
 */
export interface ShowcaseUnit {
  code: string;
  type: string;
  area: string;
}

export const unitShowcaseData: ShowcaseUnit[] = [
  { code: 'BV3-4X', type: 'Đơn lập', area: '230m²' },
  { code: 'BV6-2X', type: 'Song lập', area: '140m²' },
  { code: 'BV7-1X', type: 'Song lập', area: '140m²' },
  { code: 'BV8-0X', type: 'Song lập', area: '140m²' },
  { code: 'BV10-0X', type: 'Song lập', area: '140m²' },
  { code: 'BV10-4X', type: 'Song lập', area: '140m²' },
  { code: 'BV11-0X', type: 'Song lập', area: '161m²' },
  { code: 'BV14-1X', type: 'Song lập', area: '140m²' },
  { code: 'BV14-2X', type: 'Song lập', area: '140m²' },
  { code: 'VK1-2X', type: 'Song lập', area: '140m²' },
  { code: 'VK3-0X', type: 'Song lập', area: '140m²' },
  { code: 'TK8-8X', type: 'Liền kề', area: '112m²' },
  { code: 'VU1-169', type: 'Liền kề', area: '70m²' },
];
