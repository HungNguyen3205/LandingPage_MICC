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
  PrivacyPolicyConfig
} from '../types';

export const projectMeta: ProjectMetadata = {
  brandName: 'VINHOMES HẢI VÂN BAY',
  brandSubtitle: 'THÀNH PHỐ NGHỈ DƯỠNG BÊN VỊNH DI SẢN',
  tagline: 'Kiệt tác nghỉ dưỡng ven biển đẳng cấp quốc tế.',
  secondaryTagline: 'Đại đô thị nghỉ dưỡng 240ha kề cận vịnh biển Hải Vân tuyệt mỹ, kiến tạo chuẩn mực sống thượng lưu tại Đà Nẵng.',
  disclaimerShort: 'Thông tin và hình ảnh dùng để tham khảo. Phối cảnh mang tính minh họa.',
  disclaimerDetailed: 'Website thuộc quyền sở hữu và vận hành bởi đối tác phân phối chính thức của dự án Vinhomes Hải Vân Bay Đà Nẵng. Mọi thông tin, tài liệu và hình ảnh được cập nhật dựa trên nguồn tin từ Chủ đầu tư và có thể điều chỉnh tùy theo quy định thực tế.',
  designerCredit: 'MICC Group · NEXME',
  contactStatusNotice: 'Hotline tư vấn: 0987 069 770',
};

export const navigationItems: NavItem[] = [
  { label: 'Tổng quan', href: '/#tong-quan' },
  { label: 'Sản phẩm', href: '/#bo-suu-tap' },
  { label: 'Tiện ích', href: '/#tien-ich' },
  { label: 'Vị trí', href: '/#vi-tri' },
  { label: 'Thư viện ảnh', href: '/#thu-vien' },
  { label: 'Chính sách & Liên hệ', href: '/lien-he' },
];

export const consultationCtaConfig = {
  label: 'Đăng ký tư vấn',
  href: '/lien-he',
};

export const contactConfig: ContactInfoConfig = {
  advisorUnit: 'Văn phòng Bán hàng Vinhomes Hải Vân Bay (MICC Group · NEXME)',
  hotline: '0987 069 770',
  email: 'danava.haivanbay@gmail.com',
  officeAddress: '305A Trần Hưng Đạo, P. An Hải, TP. Đà Nẵng',
  mapCoordinates: undefined,
  officialMapEmbedUrl: undefined,
};

export const privacyPolicyConfig: PrivacyPolicyConfig = {
  lastUpdatedDate: '20/10/2026',
  operatorNotice: 'Nội dung cập nhật dựa trên thông tin công bố chính thức của dự án Vinhomes Hải Vân Bay Đà Nẵng.',
  retentionNotice: 'Lưu trữ phục vụ liên hệ tư vấn và gửi tài liệu dự án',
  contactNotice: 'Hotline tiếp nhận: 0987 069 770 • Văn phòng: 305A Trần Hưng Đạo, P. An Hải, TP. Đà Nẵng',
};

export const VALID_PRODUCT_PARAM_MAP: Record<string, string> = {
  'biet-thu-don-lap': 'Biệt Thự Đơn Lập (Lâm Phong)',
  'biet-thu-song-lap': 'Biệt Thự Song Lập (Bạch Vân)',
  'nha-lien-ke': 'Nhà Liền Kề (Hồng Châu & Ánh Ngọc)',
  'shophouse-can-ho': 'Shophouse & Căn Hộ',
  'can-tu-van-them': 'Cần tư vấn thêm',
};

export const sanitizeProductQueryParam = (param: string | null | undefined): string => {
  if (!param) return 'Cần tư vấn thêm';
  const clean = param.toLowerCase().trim();
  return VALID_PRODUCT_PARAM_MAP[clean] || 'Cần tư vấn thêm';
};

export const quickContactConfig: QuickContactConfig = {
  phoneNumber: '0987069770',
  zaloUrl: 'https://zalo.me/0987069770',
  enableScrollTop: true,
  enableMobileBottomBar: true,
};

// 4 Trụ Cột Giá Trị (USPs) nổi bật của Vinhomes Hải Vân Bay
export const valueItems: ValueItem[] = [
  {
    id: 'val-1',
    title: 'Vị trí độc tôn',
    description: 'Kề cận vịnh biển Hải Vân tuyệt mỹ, tâm điểm cung đường di sản ven biển Đà Nẵng – Hội An.',
    iconName: 'Compass',
  },
  {
    id: 'val-2',
    title: 'Chủ đầu tư uy tín',
    description: 'Phát triển bởi Vinhomes – Thương hiệu bất động sản số 1 Việt Nam với bảo chứng tiến độ và chất lượng.',
    iconName: 'Sparkles',
  },
  {
    id: 'val-3',
    title: 'Hệ tiện ích đẳng cấp',
    description: 'Hơn 50 tiện ích 5 sao: bến du thuyền quốc tế, Vincom Mega Mall, trường Vinschool và bệnh viện Vinmec.',
    iconName: 'Waves',
  },
  {
    id: 'val-4',
    title: 'Không gian xanh 240ha',
    description: 'Mật độ xây dựng thấp, ôm trọn 2km đường bờ biển và suối cảnh quan sinh thái trong lành.',
    iconName: 'Trees',
  },
];

// Dòng sản phẩm thực tế từ haivanbaydanang.com.vn
export const productsData: ProductItem[] = [
  {
    id: 'biet-thu-don-lap',
    name: 'Biệt Thự Đơn Lập (Lâm Phong)',
    category: 'villa',
    categoryLabel: 'Biệt thự đơn lập',
    area: '237 – 252 m²',
    priceNote: 'Từ 18,1 tỷ',
    description: 'Sở hữu 2 mặt tiền thoáng rộng với tầm nhìn hướng trọn vịnh biển và dòng suối mát lành, kiến tạo không gian an cư thượng lưu biệt lập tuyệt đối.',
    image: '/images/hilltop.webp',
    tags: ['2 Mặt tiền', 'View suối & biển', 'Phân khu Đảo Ngọc', 'Hàng ngoại giao'],
    specs: {
      subdivision: 'Phân khu Đảo Ngọc (Dãy Lâm Phong)',
      floors: '3 tầng + 1 tum',
      bedrooms: '4 – 5 Phòng ngủ Master',
      view: 'Trực diện Vịnh biển & Suối tự nhiên',
      frontage: '2 Mặt tiền thoáng rộng (15m)',
      legal: 'Sổ hồng sở hữu lâu dài',
      handover: 'Hoàn thiện mặt ngoài cao cấp',
      policies: [
        'Hỗ trợ lãi suất 0% tối đa 24 tháng',
        'Chiết khấu thanh toán sớm 9%',
        'Tặng gói Vinmec 100tr & Vinpearl 5 đêm',
      ],
    },
  },
  {
    id: 'biet-thu-song-lap',
    name: 'Biệt Thự Song Lập (Bạch Vân)',
    category: 'villa',
    categoryLabel: 'Biệt thự song lập',
    area: '140 – 178 m²',
    priceNote: 'Từ 9,1 tỷ',
    description: 'Nằm tại phân khu Bạch Vân yên bình, kế bên trường học và suối tự nhiên. Thiết kế 3 tầng sang trọng đón nắng sớm và gió biển trong lành.',
    image: '/images/bach-van.webp',
    tags: ['Kề suối mát mẻ', 'Gần Vinschool', 'Phân khu Bạch Vân', 'Hướng Nam'],
    specs: {
      subdivision: 'Phân khu Bạch Vân (Dãy BV)',
      floors: '3 tầng kiến trúc tân cổ điển',
      bedrooms: '3 – 4 Phòng ngủ thoáng sáng',
      view: 'Hướng Nam, kề suối sinh thái & trường học',
      frontage: 'Mặt tiền 9m – 10m',
      legal: 'Sổ hồng sở hữu lâu dài',
      handover: 'Hoàn thiện mặt ngoài cao cấp',
      policies: [
        'Vay ngân hàng đến 80% giá trị',
        'Miễn phí dịch vụ quản lý 2 năm',
        'Chiết khấu thanh toán sớm 9%',
      ],
    },
  },
  {
    id: 'nha-lien-ke',
    name: 'Nhà Phố Liền Kề (Hồng Châu & Ánh Ngọc)',
    category: 'townhouse',
    categoryLabel: 'Nhà liền kề',
    area: '70 – 80 m²',
    priceNote: 'Từ 7,3 tỷ',
    description: 'Dòng sản phẩm có mức giá tốt nhất dự án, tiềm năng tăng giá và tính thanh khoản vượt trội, kết nối trực tiếp đến các trục đại lộ trung tâm.',
    image: '/images/trien-nui.webp',
    tags: ['Giá tốt nhất dự án', 'Vị trí khan hiếm', 'Phân khu Đảo Ngọc', 'Còn hàng'],
    specs: {
      subdivision: 'Dãy Hồng Châu & Ánh Ngọc (HC - AN)',
      floors: '4 tầng hiện đại tối ưu công năng',
      bedrooms: '3 Phòng ngủ + Phòng sinh hoạt',
      view: 'Trực diện phố đi bộ & công viên',
      frontage: 'Mặt tiền 5m – 6m',
      legal: 'Sổ hồng sở hữu lâu dài',
      handover: 'Xây thô hoàn thiện mặt ngoài',
      policies: [
        'Mức giá khởi điểm hấp dẫn nhất toàn khu',
        'Vay 80%, HTLS 0% trong 24 tháng',
        'Tiềm năng tăng giá và thanh khoản cao',
      ],
    },
  },
  {
    id: 'shophouse-can-ho',
    name: 'Shophouse & Căn Hộ Nghỉ Dưỡng',
    category: 'shophouse',
    categoryLabel: 'Thương mại & Căn hộ',
    area: '45 – 120 m²',
    priceNote: 'Liên hệ báo giá',
    description: 'Đón đầu dòng du khách khổng lồ với tầm nhìn panorama hướng trọn vịnh Hải Vân, tối ưu hóa công năng vừa ở vừa kinh doanh sinh lời bền vững.',
    image: '/images/micc-nexme.webp',
    tags: ['Mặt tiền đại lộ', 'Khai thác cho thuê', 'Tiện ích 5 sao', 'Đón đầu tương lai'],
    specs: {
      subdivision: 'Phân khu Vịnh Mây & Tinh Vân',
      floors: 'Shophouse 5 tầng / Căn hộ cao cấp',
      bedrooms: '1 – 3 Phòng ngủ nghỉ dưỡng',
      view: 'Panorama toàn cảnh Vịnh & Bến du thuyền',
      frontage: 'Mặt tiền đại lộ thương mại sầm uất',
      legal: 'Sở hữu lâu dài / Thương mại dịch vụ',
      handover: 'Nội thất tiêu chuẩn 5 sao quốc tế',
      policies: [
        'Khai thác vận hành cho thuê du lịch cao cấp',
        'Chia sẻ doanh thu hoặc hỗ trợ lợi nhuận',
        'Đặc quyền tiện ích du thuyền & golf',
      ],
    },
  },
];

// Hệ thống tiện ích chuẩn Vinhomes Hải Vân Bay
export const amenitiesData: AmenityItem[] = [
  {
    id: 'amenity-beach-marina',
    title: 'Bãi biển riêng 2km & Bến du thuyền quốc tế',
    tag: 'TIỆN ÍCH ĐẶC QUYỀN',
    tagline: 'Khởi đầu hải trình thượng lưu bên bờ vịnh di sản',
    description: 'Sở hữu 2km đường bờ biển riêng biệt lập với cát mịn phẳng lặng và làn nước trong xanh. Bến du thuyền chuẩn quốc tế là điểm neo đậu của những du thuyền hạng sang, mở ra phong cách sống thời thượng.',
    image: '/images/vinh-bien.webp',
    features: [
      '2km bãi biển riêng tư tuyệt đối',
      'Bến du thuyền quốc tế cao cấp',
      'Beach club & quầy lounge ven biển',
    ],
  },
  {
    id: 'amenity-vincom-megamall',
    title: 'Vincom Mega Mall Hải Vân Bay',
    tag: 'THƯƠNG MẠI & GIẢI TRÍ',
    tagline: 'Trung tâm mua sắm sầm uất hàng đầu miền Trung',
    description: 'Tổ hợp thương mại quy mô lớn hội tụ hàng trăm thương hiệu thời trang, ẩm thực Á - Âu, rạp chiếu phim hiện đại và các khu vui chơi giải trí đa thế hệ sôi động suốt ngày đêm.',
    image: '/images/dao-ngoc.webp',
    features: [
      'Hàng trăm thương hiệu quốc tế',
      'Khu ẩm thực Á - Âu đa dạng',
      'Tổ hợp vui chơi giải trí trong nhà',
    ],
  },
  {
    id: 'amenity-vinschool-vinmec',
    title: 'Trường học Vinschool & Bệnh viện Vinmec',
    tag: 'Y TẾ & GIÁO DỤC',
    tagline: 'Môi trường phát triển toàn diện và an tâm trọn đời',
    description: 'Hệ thống trường liên cấp Vinschool chất lượng cao ươm mầm thế hệ công dân toàn cầu, kết hợp cùng Bệnh viện Đa khoa Quốc tế Vinmec chăm sóc sức khỏe chuẩn 5 sao 24/7 cho toàn thể cư dân.',
    image: '/images/bach-van.webp',
    features: [
      'Trường liên cấp Vinschool chuẩn quốc tế',
      'Bệnh viện Vinmec với trang thiết bị tối tân',
      'Dịch vụ y tế đặc quyền và bác sĩ gia đình',
    ],
  },
  {
    id: 'amenity-central-park',
    title: 'Công viên trung tâm & Suối cảnh quan sinh thái',
    tag: 'CÔNG VIÊN & WELLNESS',
    tagline: 'Tái tạo năng lượng cùng thiên nhiên trong lành',
    description: 'Chuỗi công viên chủ đề liên hoàn, đường dạo bộ ven suối tự nhiên uốn lượn, hồ bơi vô cực và khu thể thao phức hợp mang lại không gian sống thanh sạch, an yên mỗi ngày.',
    image: '/images/vuon-rieng.webp',
    features: [
      'Đường dạo bộ ven suối nước tự nhiên',
      'Hồ bơi cảnh quan vô cực view biển',
      'Sân thể thao đa năng, tennis & đường chạy bộ',
    ],
  },
];

export const galleryData: GalleryItem[] = [
  { id: 'gal-1', title: 'Vịnh Mây', caption: 'Toàn cảnh phân khu Vịnh Mây từ trên cao', image: '/images/vinh-may.webp', aspectClass: 'md:col-span-2 md:row-span-2 aspect-video md:aspect-auto' },
  { id: 'gal-2', title: 'Bạch Vân', caption: 'Toàn cảnh phân khu Bạch Vân từ trên cao', image: '/images/bach-van.webp', aspectClass: 'aspect-video' },
  { id: 'gal-3', title: 'Đảo Ngọc', caption: 'Toàn cảnh phân khu Đảo Ngọc từ trên cao', image: '/images/dao-ngoc.webp', aspectClass: 'aspect-video' },
  { id: 'gal-4', title: 'Vịnh biển', caption: 'Minh họa tầm nhìn hướng vịnh', image: '/images/vinh-bien.webp', aspectClass: 'aspect-square' },
  { id: 'gal-5', title: 'Vườn riêng', caption: 'Minh họa không gian vườn riêng', image: '/images/vuon-rieng.webp', aspectClass: 'aspect-square' },
  { id: 'gal-6', title: 'Triền núi', caption: 'Minh họa kiến trúc trên triền núi', image: '/images/trien-nui.webp', aspectClass: 'aspect-square' },
  { id: 'gal-7', title: 'Hilltop Collection', caption: 'Minh họa dinh thự tư gia', image: '/images/hilltop.webp', aspectClass: 'aspect-square' },
  { id: 'gal-8', title: 'MICC Group · NEXME', caption: 'Minh họa kiến trúc và không gian nội thất', image: '/images/micc-nexme.webp', aspectClass: 'aspect-square' },
];

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Dự án Vinhomes Hải Vân Bay có những loại hình sản phẩm nào?',
    answer: 'Vinhomes Hải Vân Bay Đà Nẵng phát triển đa dạng các dòng sản phẩm bất động sản cao cấp bao gồm: Biệt thự đơn lập (Lâm Phong 237-252m²), Biệt thự song lập (Bạch Vân, Thanh Khê 140-178m²), Nhà phố liền kề (Hồng Châu, Ánh Ngọc 70-80m²), Shophouse thương mại và Căn hộ nghỉ dưỡng cao cấp.',
  },
  {
    id: 'faq-2',
    question: 'Chính sách bán hàng và ưu đãi tài chính của dự án như thế nào?',
    answer: 'Khách hàng sở hữu sớm nhận được nhiều ưu đãi đặc biệt: Chiết khấu thanh toán sớm lên đến 9%, hỗ trợ lãi suất 0% tối đa 24 tháng, ngân hàng hỗ trợ cho vay đến 80% giá trị sản phẩm. Ngoài ra còn có quà tặng gói chăm sóc sức khỏe Vinmec 100 triệu, nghỉ dưỡng Vinpearl 5 đêm và miễn phí quản lý 2 năm.',
  },
  {
    id: 'faq-3',
    question: 'Vị trí Vinhomes Hải Vân Bay kết nối giao thông ra sao?',
    answer: 'Dự án tọa lạc ngay cung đường ven vịnh Hải Vân, Đà Nẵng: Chỉ mất 15 phút đến Ga Đà Nẵng, 20 phút đến Trung tâm thành phố, 25 phút đến Phố cổ Hội An và 30 phút đến Sân bay Quốc tế Đà Nẵng, kết nối trực tiếp cao tốc Hải Vân.',
  },
  {
    id: 'faq-4',
    question: 'Làm thế nào để tôi nhận bảng giá và đăng ký lịch xem thực tế?',
    answer: 'Quý khách vui lòng để lại thông tin trong biểu mẫu đăng ký tư vấn hoặc liên hệ trực tiếp hotline 0987 069 770. Chuyên viên tư vấn F1 sẽ gửi trọn bộ tài liệu chi tiết, mặt bằng phân lô, bảng giá ngoại giao và hỗ trợ đưa đón quý khách tham quan thực tế.',
  },
];
