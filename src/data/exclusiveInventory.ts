/**
 * Quỹ hàng độc quyền 3 phân khu Bạch Vân · Đảo Ngọc · Vịnh Mây.
 * Nguồn: Google Sheet quỹ hàng của khách (13/11/2026), mỗi căn một thư mục Drive.
 * Chỉ dùng ảnh .png trong thư mục (poster căn + mặt bằng); các file bảng giá vay .jpg/.PNG bỏ qua.
 * Ảnh: public/images/quy-hang/<slug>.webp (lớn), <slug>-sm.webp (thẻ), <slug>-1.webp, -2… (mặt bằng, theo thứ tự `extras`).
 * Cột nội bộ của sheet (thưởng sale, giỏ bank, ngày ký, PTG) cố ý không đưa lên web.
 */

export type InventoryZoneId = 'bach-van' | 'dao-ngoc' | 'vinh-may';

export interface InventoryZone {
  id: InventoryZoneId;
  name: string;
  tagline: string;
  cover: string;
  /** Tỉ lệ poster gốc của phân khu (rộng/cao), để thẻ hiện trọn ảnh không cắt */
  ratio: string;
  portrait?: boolean;
}

export interface InventoryUnit {
  code: string;
  slug: string;
  zone: InventoryZoneId;
  kind: 'Biệt thự đơn lập' | 'Liền kề' | 'Liền kề góc';
  /** Tiêu chuẩn bàn giao / tiến độ */
  handover: string;
  /** m² */
  land: number;
  build: number;
  facing: string;
  /** Giá TTTĐ, tỷ đồng (tạm tính làm tròn) */
  price: number;
  location: string;
  /** Nhãn các ảnh mặt bằng đi kèm poster */
  extras: string[];
}

export const inventoryZones: InventoryZone[] = [
  { id: 'bach-van', name: 'Bạch Vân', tagline: 'Giữa hồ & suối cảnh quan', cover: '/images/lang-van/ho-canh-quan.webp', ratio: '3840/2444' },
  { id: 'dao-ngoc', name: 'Đảo Ngọc', tagline: 'Chạm biển · Cảm hứng Địa Trung Hải', cover: '/images/lang-van/cap-treo-bien.webp', ratio: '3683/2670' },
  { id: 'vinh-may', name: 'Vịnh Mây', tagline: 'Triền đồi · Cảm hứng Malibu Hills', cover: '/images/lang-van/ga-cap-treo.webp', ratio: '896/1406', portrait: true },
];

export const inventoryUnits: InventoryUnit[] = [
  { code: 'VK5-09', slug: 'vk5-09', zone: 'bach-van', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 63, build: 182.6, facing: 'Bắc', price: 6.184, location: 'Gần công viên', extras: [] },
  { code: 'VK5-47', slug: 'vk5-47', zone: 'bach-van', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 63, build: 182.6, facing: 'Bắc', price: 6.188, location: 'Gần hồ Ngọc Trai, chung cư', extras: [] },
  { code: 'VU-59', slug: 'vu-59', zone: 'bach-van', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 63, build: 188.3, facing: 'Đông Bắc', price: 5.571, location: 'Gần đại lộ Hải Vân', extras: [] },
  { code: 'VU-60', slug: 'vu-60', zone: 'bach-van', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 75, build: 226.9, facing: 'Tây Nam', price: 6.451, location: 'Gần đại lộ Hải Vân', extras: [] },
  { code: 'VK4-99', slug: 'vk4-99', zone: 'bach-van', kind: 'Liền kề góc', handover: 'Giãn xây 18T', land: 99.6, build: 225.1, facing: 'Tây Nam', price: 14.059, location: 'Căn góc cạnh chung cư, gần suối', extras: [] },
  { code: 'VU4-29', slug: 'vu4-29', zone: 'bach-van', kind: 'Liền kề', handover: 'Thô', land: 70, build: 210.8, facing: 'Đông Nam', price: 6.556, location: 'View biển, gần công viên thể thao', extras: [] },
  { code: 'ĐLHV-94', slug: 'dlhv-94', zone: 'bach-van', kind: 'Liền kề', handover: 'Thô', land: 75, build: 226.9, facing: 'Đông Bắc', price: 8.158, location: 'Gần công viên', extras: [] },
  { code: 'ĐLHV-84', slug: 'dlhv-84', zone: 'bach-van', kind: 'Liền kề', handover: 'Thô', land: 75.2, build: 212.9, facing: 'Đông Bắc', price: 8.039, location: 'Gần công viên', extras: [] },
  { code: 'ĐLHV-144', slug: 'dlhv-144', zone: 'bach-van', kind: 'Liền kề', handover: 'Thô', land: 75.4, build: 200.8, facing: 'Bắc', price: 7.941, location: 'Gần công viên', extras: [] },
  { code: 'ĐLHV-359', slug: 'dlhv-359', zone: 'bach-van', kind: 'Liền kề', handover: 'Thô', land: 80, build: 242.8, facing: 'Đông Nam', price: 8.386, location: 'Gần công viên', extras: [] },
  { code: 'ĐLMC-05', slug: 'dlmc-05', zone: 'dao-ngoc', kind: 'Biệt thự đơn lập', handover: 'Giãn xây 18T', land: 200, build: 345.6, facing: 'Tây Nam', price: 23.32, location: '', extras: [] },
  { code: 'ĐLMC-13', slug: 'dlmc-13', zone: 'dao-ngoc', kind: 'Biệt thự đơn lập', handover: 'Giãn xây 18T', land: 200, build: 345.6, facing: 'Tây Nam', price: 24.201, location: 'Gần công viên Hương Biển', extras: [] },
  { code: 'LV5-17', slug: 'lv5-17', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 70, build: 214, facing: 'Đông Bắc', price: 9.597, location: 'Gần biển, gần công viên', extras: [] },
  { code: 'LV5-14', slug: 'lv5-14', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 70, build: 214, facing: 'Tây Nam', price: 9.651, location: 'Gần biển, gần công viên', extras: [] },
  { code: 'LV7-15', slug: 'lv7-15', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 70, build: 214, facing: 'Đông Bắc', price: 9.705, location: 'Gần công viên Thế giới Bách Thảo', extras: [] },
  { code: 'LV5-23', slug: 'lv5-23', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 70, build: 214, facing: 'Đông Bắc', price: 9.327, location: 'Gần biển, gần công viên Thế giới Bách Thảo', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'SV7-26', slug: 'sv7-26', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 70, build: 217.1, facing: 'Tây Nam', price: 9.843, location: 'Gần công viên Đảo Ngọc', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'LV5-18', slug: 'lv5-18', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 70, build: 214, facing: 'Tây Nam', price: 9.651, location: 'Gần biển, gần công viên Thế giới Bách Thảo', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'AN11-20', slug: 'an11-20', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 80, build: 252.8, facing: 'Đông Bắc', price: 9.481, location: 'Gần công viên Tái Tạo', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'LV4-14', slug: 'lv4-14', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 80, build: 254, facing: 'Tây Nam', price: 11.037, location: 'Gần biển, gần công viên Thế giới Bách Thảo', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'SV6-24', slug: 'sv6-24', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 80, build: 246.6, facing: 'Tây Nam', price: 10.717, location: 'Gần công viên Đảo Ngọc', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'SV8-27', slug: 'sv8-27', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 80, build: 246.6, facing: 'Đông Bắc', price: 11.149, location: '', extras: [] },
  { code: 'LV3-34', slug: 'lv3-34', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 88.9, build: 201.4, facing: 'TB-TN', price: 14.82, location: 'Gần công viên Hương Biển', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'LV1-32', slug: 'lv1-32', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 89.6, build: 207.7, facing: 'TB-TN', price: 14.98, location: 'Gần công viên Hương Biển', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'SV9-21', slug: 'sv9-21', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 95, build: 328.5, facing: 'Đông Bắc', price: 14.973, location: 'Gần công viên Đảo Ngọc', extras: [] },
  { code: 'LV6-35', slug: 'lv6-35', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 99.3, build: 241, facing: 'ĐB-TB', price: 16.432, location: 'Gần công viên Thế giới Bách Thảo', extras: [] },
  { code: 'SV9-23', slug: 'sv9-23', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 95, build: 307.4, facing: 'Đông Bắc', price: 14.84, location: 'Gần công viên Địa Đàng, công viên Tái Tạo', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'LV2-19', slug: 'lv2-19', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 105, build: 235.1, facing: 'Đông Bắc', price: 12.64, location: 'Gần biển, gần công viên Đảo Ngọc', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'LV7-21', slug: 'lv7-21', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 105, build: 235.1, facing: 'Đông Bắc', price: 12.418, location: 'Gần biển, gần công viên Đảo Ngọc', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'LV5-20', slug: 'lv5-20', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 105, build: 235.1, facing: 'Tây Nam', price: 12.418, location: 'Gần biển, gần công viên', extras: [] },
  { code: 'AN11-01', slug: 'an11-01', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 105.1, build: 231.7, facing: 'TB-TN', price: 13.722, location: 'Kề cận Vinwonders', extras: [] },
  { code: 'HC9-03', slug: 'hc9-03', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 69.9, build: 208.4, facing: 'Tây Nam', price: 12.145, location: 'Gần Vinwonders, trường học', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'HC5-10', slug: 'hc5-10', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 70, build: 202.8, facing: 'Đông Bắc', price: 11.775, location: 'Gần Vinwonders, trường học', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'HC5-03', slug: 'hc5-03', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 70, build: 208.4, facing: 'Tây Nam', price: 12.156, location: 'Gần Vinwonders, trường học', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'LV7-33', slug: 'lv7-33', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 70, build: 214, facing: 'Đông Bắc', price: 9.543, location: 'Gần công viên Thế giới Bách Thảo', extras: [] },
  { code: 'LV5-21', slug: 'lv5-21', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Giãn xây 18T', land: 105, build: 235.1, facing: 'Đông Bắc', price: 12.337, location: 'Gần công viên Thế giới Bách Thảo', extras: [] },
  { code: 'LV2-31', slug: 'lv2-31', zone: 'dao-ngoc', kind: 'Liền kề góc', handover: 'Giãn xây 18T', land: 126, build: 319.7, facing: 'Đông Bắc', price: 20.868, location: 'Gần công viên Hương Biển', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'SV3-15', slug: 'sv3-15', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 80, build: 232.3, facing: 'Đông Bắc', price: 15.768, location: 'Gần công viên Đảo Ngọc', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'SV4-14', slug: 'sv4-14', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 80, build: 234.4, facing: 'Tây Nam', price: 15.881, location: 'Gần công viên Đảo Ngọc', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'SV5-34', slug: 'sv5-34', zone: 'dao-ngoc', kind: 'Liền kề góc', handover: 'Giãn xây 18T', land: 125.3, build: 287, facing: 'TB-TN', price: 20.496, location: 'Gần công viên Địa Đàng', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất', 'Cận cảnh căn'] },
  { code: 'HC5-04', slug: 'hc5-04', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 70, build: 208.4, facing: 'Đông Bắc', price: 12.024, location: 'Gần công viên Botanica Park', extras: [] },
  { code: 'HC5-09', slug: 'hc5-09', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 70, build: 202.8, facing: 'Tây Nam', price: 11.906, location: 'Gần công viên Botanica Park', extras: [] },
  { code: 'SV3-31', slug: 'sv3-31', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 80, build: 232.3, facing: 'Đông Bắc', price: 17.12, location: 'Gần công viên Đảo Ngọc', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'SV4-32', slug: 'sv4-32', zone: 'dao-ngoc', kind: 'Liền kề', handover: 'Hoàn thiện', land: 80, build: 232.3, facing: 'Tây Nam', price: 17.195, location: 'Gần công viên Đảo Ngọc', extras: ['Mặt bằng phối cảnh', 'Mặt bằng lô đất'] },
  { code: 'VM4-42', slug: 'vm4-42', zone: 'vinh-may', kind: 'Biệt thự đơn lập', handover: 'Giãn xây 24T', land: 283.8, build: 463, facing: 'Tây Nam', price: 17.589, location: '', extras: ['Mặt bằng lô đất'] },
  { code: 'VM6-16', slug: 'vm6-16', zone: 'vinh-may', kind: 'Biệt thự đơn lập', handover: 'Giãn xây 24T', land: 329.6, build: 492.7, facing: 'Tây Nam', price: 45.516, location: '', extras: ['Mặt bằng lô đất'] },
  { code: 'VM-69', slug: 'vm-69', zone: 'vinh-may', kind: 'Liền kề', handover: 'Giãn xây 24T', land: 70, build: 203, facing: 'Đông Bắc', price: 5.585, location: 'Gần tổ hợp spa, sức khỏe và fitness cao cấp', extras: ['Mặt bằng lô đất'] },
  { code: 'VM-58', slug: 'vm-58', zone: 'vinh-may', kind: 'Liền kề', handover: 'Giãn xây 24T', land: 75.1, build: 213, facing: 'Nam', price: 5.942, location: 'Gần tổ hợp spa, sức khỏe và fitness cao cấp', extras: ['Mặt bằng lô đất'] },
  { code: 'VM-03', slug: 'vm-03', zone: 'vinh-may', kind: 'Liền kề', handover: 'Giãn xây 24T', land: 70, build: 213, facing: 'Đông Bắc', price: 5.781, location: 'Gần tổ hợp spa, sức khỏe và fitness cao cấp', extras: ['Mặt bằng lô đất'] },
  { code: 'VM-10', slug: 'vm-10', zone: 'vinh-may', kind: 'Liền kề', handover: 'Giãn xây 24T', land: 75, build: 231, facing: 'Tây Nam', price: 6.537, location: 'Gần tổ hợp spa, sức khỏe và fitness cao cấp', extras: [] },
  { code: 'ĐLHV-445', slug: 'dlhv-445', zone: 'vinh-may', kind: 'Liền kề', handover: 'Giãn xây 24T', land: 80, build: 245, facing: 'Tây Nam', price: 7.676, location: 'Gần tổ hợp spa, sức khỏe và fitness cao cấp', extras: ['Mặt bằng lô đất'] },
  { code: 'ĐLHV-447', slug: 'dlhv-447', zone: 'vinh-may', kind: 'Liền kề', handover: 'Giãn xây 24T', land: 80, build: 245, facing: 'Tây Nam', price: 7.676, location: 'Gần tổ hợp spa, sức khỏe và fitness cao cấp', extras: [] },
  { code: 'ĐLHV-449', slug: 'dlhv-449', zone: 'vinh-may', kind: 'Liền kề', handover: 'Giãn xây 24T', land: 80, build: 245, facing: 'Tây Nam', price: 7.676, location: 'Gần tổ hợp spa, sức khỏe và fitness cao cấp', extras: ['Mặt bằng lô đất'] },
  { code: 'VM-11', slug: 'vm-11', zone: 'vinh-may', kind: 'Liền kề', handover: 'Giãn xây 24T', land: 105, build: 233.3, facing: 'Đông Bắc', price: 7.221, location: 'Gần tổ hợp spa, sức khỏe và fitness cao cấp', extras: ['Mặt bằng lô đất'] },
];
