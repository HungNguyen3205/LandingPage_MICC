const zones = [
  {
    id: 'vinh-may', name: 'Vịnh Mây', priceLabel: 'Giá TTTĐ', date: '05/11/2026',
    policy: 'Voucher tối đa 30% giá trị căn nhà. Thanh toán sớm chiết khấu dòng tiền 13%/năm. Ưu đãi VinClub lên đến 0,9%.',
    policyFile: '1WjXCHFre2a8-Iuh-70MJV-zZO2fHScVr', inventoryFile: '1_Qpc1FPH7-7RXgpWKpfvotfdbpS7UMLK',
    units: [
      ['VM-03', 'Liền kề', '5,781'], ['VM-10', 'Liền kề', '6,537'], ['VM-11', 'Liền kề', '7,221'],
      ['ĐLHV-445', 'Liền kề', '7,676'], ['ĐLHV-447', 'Liền kề', '7,676'],
      ['VM4-42', 'Đơn lập', '17,589'], ['VM6-16', 'Đơn lập', '45,516'],
    ],
  },
  {
    id: 'bach-van', name: 'Bạch Vân', priceLabel: 'Giá Full',
    policy: 'Poster quỹ căn giãn xây và thô xây luôn ghi chiết khấu dòng tiền 13%/năm khi thanh toán sớm. Ưu đãi về ở sớm 10% chỉ áp dụng cho 345 căn thô xây luôn.',
    policyFile: '1qjhViAxsH3voOxT6W9xN5hK2ylaUFVCm', inventoryFile: '1z9UoYbPUZtLOjP0raAP-o7e6p0U6DDu7',
    units: [
      ['ĐLHV-180', 'Liền kề', '8,592'], ['ĐLHV-176', 'Liền kề', '8,621'], ['ĐLHV-201', 'Liền kề', '8,735'],
      ['ĐLHV-210', 'Liền kề', '8,735'], ['ĐLHV-203', 'Liền kề', '8,756'], ['ĐLHV-369', 'Liền kề', '9,041'],
      ['ĐLHV-224', 'Liền kề', '9,325'], ['ĐLHV-169', 'Liền kề', '9,396'],
    ],
  },
  {
    id: 'dao-ngoc', name: 'Đảo Ngọc', priceLabel: 'Giá Full', date: '06/11/2026',
    policy: 'Quỹ căn hoàn thiện xây luôn khu 3 có chiết khấu dòng tiền 13%/năm khi thanh toán sớm. Ưu đãi về ở sớm 10% và cam kết tiền thuê 7%/năm áp dụng có điều kiện theo quỹ căn.',
    policyFile: '1UpRznYtSCbLUEemcXtS7nqANIqpryy4U', inventoryFile: '1tkL6oTUG4vRcg3UU9CJnk6NcTK_0fDCh',
    units: [
      ['LV4-16', 'Liền kề', '11,080'], ['SV1-36', 'Liền kề', '11,167'], ['LV4-29', 'Liền kề', '11,315'],
      ['LV6-18', 'Liền kề', '11,704'], ['HC5-24', 'Liền kề', '11,923'], ['HC5-14', 'Liền kề', '11,936'],
      ['AN5-22', 'Liền kề', '11,950'], ['LV6-33', 'Liền kề', '11,952'], ['AN3-12', 'Liền kề', '12,025'],
      ['AN5-05', 'Liền kề', '12,148'], ['AN3-21', 'Liền kề', '12,180'], ['AN5-08', 'Liền kề', '12,181'],
      ['AN5-26', 'Liền kề', '12,313'], ['AN3-03', 'Liền kề', '12,378'], ['AN5-25', 'Liền kề', '12,379'],
      ['SV5-23', 'Liền kề', '12,933'], ['SV5-29', 'Liền kề', '13,169'], ['SV5-31', 'Liền kề', '13,527'],
    ],
  },
];

const driveFile = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const SalesPolicy = () => (
  <section id="bang-gia" className="scroll-mt-24 bg-sand px-4 py-16 sm:px-8">
    <div className="mx-auto max-w-content">
      <p className="text-xs font-semibold uppercase tracking-[.22em] text-forest">Vinhomes Hải Vân Bay</p>
      <h2 className="mt-3 font-serif text-3xl text-forest-dark sm:text-5xl">Quỹ căn & chính sách bán hàng</h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/75">Giá tham khảo theo tài liệu từng phân khu, đơn vị tỷ đồng. Tài liệu Vịnh Mây ghi giá TTTĐ, còn Bạch Vân và Đảo Ngọc ghi giá Full. Vui lòng xác nhận giá và tình trạng căn trước khi giao dịch.</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {zones.map((zone) => (
          <article id={`phan-khu-${zone.id}`} key={zone.name} className="scroll-mt-24 rounded-2xl border border-forest/15 bg-white p-5 shadow-sm">
            <h3 className="font-serif text-2xl text-forest-dark">{zone.name}</h3>
            <p className="mt-2 text-xs font-semibold text-forest">{zone.date ? `Quỹ căn cập nhật ${zone.date}` : 'Quỹ căn theo ảnh tài liệu'}</p>
            <p className="mt-3 text-sm leading-relaxed">{zone.policy}</p>
            {zone.id === 'bach-van' && <p className="mt-2 text-xs text-ink/75">Tên tệp ghi Bạch Vân, logo trên poster ghi Đảo Ngọc. Cần xác nhận phạm vi áp dụng.</p>}
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-forest">
              <a className="underline underline-offset-4" href={driveFile(zone.policyFile)} target="_blank" rel="noopener noreferrer">Ảnh chính sách</a>
              <a className="underline underline-offset-4" href={driveFile(zone.inventoryFile)} target="_blank" rel="noopener noreferrer">Mặt bằng quỹ căn</a>
            </div>
            <div className="mt-5 max-h-80 overflow-auto rounded-lg border border-forest/10" tabIndex={0} role="region" aria-label={`Bảng giá ${zone.name}`}>
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-forest-dark text-white"><tr><th scope="col" className="p-2">Mã căn</th><th scope="col" className="p-2">Loại</th><th scope="col" className="p-2 text-right">{zone.priceLabel}</th></tr></thead>
                <tbody>{zone.units.map(([code, type, price]) => (
                  <tr key={code} className="border-b border-forest/10 last:border-0"><th scope="row" className="whitespace-nowrap p-2 font-medium">{code}</th><td className="p-2">{type}</td><td className="whitespace-nowrap p-2 text-right font-semibold">{price} tỷ</td></tr>
                ))}</tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-ink/75">Các poster ghi chính sách áp dụng từ 05/10/2026 đến khi có chính sách thay thế. Điều kiện cụ thể nằm trong tài liệu từng quỹ căn.</p>
    </div>
  </section>
);
