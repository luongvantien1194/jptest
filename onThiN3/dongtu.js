// Động từ kanji N3 đọc âm Kun khi đứng một mình (送り仮名 đi kèm)
// Danh sách & thứ tự được sinh bởi tools/build_dongtu.js → dongtu.data.js (window.N3_TOPIC_GROUPS)
(function () {
  var groups = (window.N3_TOPIC_GROUPS || []).map(function (g) { return Object.assign({}, g); });

  // Các động từ cùng cách đọc không làm đáp án nhiễu cho nhau ở câu hỏi nghĩa (変える / 替える / 換える…)
  groups.forEach(function (g) {
    g.items = g.items.map(function (x) { return Object.assign({}, x, { syn: "r:" + x.r }); });
  });

  if (groups[0]) {
    groups[0].compare = [
      ["かえる", "返る (trở lại)・変える (thay đổi)・替える (thay thế)・換える (đổi, hoán đổi)", "変わる/替わる/換わる cũng vậy"],
      ["なおす・なおる", "直す/直る (sửa đồ vật, lỗi)・治す/治る (chữa bệnh, vết thương)", "病気 → 治る; 時計 → 直る"],
      ["つとめる", "勤める (làm việc ở công ty)・務める (đảm nhiệm vai trò)・努める (nỗ lực)", "会社に勤める / 司会を務める"],
      ["あらわす・あらわれる", "表す (biểu thị cảm xúc, ý)・現す/現れる (xuất hiện, lộ diện)", "気持ちを表す / 姿を現す"],
      ["さす", "指す (chỉ, trỏ)・差す (giương ô, chiếu nắng)", "時計の針が3時を指す / 傘を差す"],
      ["はかる", "量る (khối lượng, dung tích)・計る (thời gian, số)・測る (chiều dài, nhiệt độ)", "体重を量る / 時間を計る"],
      ["なく", "泣く (người khóc)・鳴く (chim, thú kêu)", "赤ちゃんが泣く / 鳥が鳴く"],
      ["あたたかい・あたたまる", "暖 (không khí, thời tiết)・温 (đồ vật, đồ ăn, tình cảm)", "部屋が暖まる / スープを温める"]
    ];
    groups[0].head = ["Cách đọc", "Các chữ & nghĩa", "Mẹo phân biệt"];
    groups[0].tips = [
      "Phần **漢字読み** của đề N3 hay hỏi đúng những động từ này: chữ Hán N3 + 送り仮名. Đáp án nhiễu thường là cách đọc của **động từ khác có cùng đuôi** (よごれる / こわれる / おくれる).",
      "Tắt **Furigana** ở thanh công cụ để tự kiểm tra cách đọc, bật **Che nghĩa** để luyện nghĩa.",
      "Chạm vào một dòng để xem **âm On + từ ghép** – cùng chữ đó khi ghép thường đọc âm On (断る ことわる ↔ 判断 はんだん / 認める みとめる ↔ 確認 かくにん)."
    ];
  }

  window.N3_TOPIC = {
    key: "dongtu",
    short: "Động từ kanji đọc Kun",
    title: "訓読み Động từ kanji N3 đứng một mình",
    kind: "vocab",
    readingQ: true,
    intro: "Tổng hợp **động từ viết bằng 1 chữ Hán N3 + 送り仮名**, đọc theo **âm Kun** khi đứng một mình (届く とどく, 断る ことわる, 汚れる よごれる…). " +
      "Thứ tự: nhóm **★★★** là các động từ đời sống hay ra ở phần 漢字読み / 表記; nhóm **★★** là từ vựng N3 & động từ thông dụng; trong mỗi nhóm xếp theo **tần suất BCCWJ** (phổ biến nhất ở trên). " +
      "Danh sách lấy từ kun_reading của 328 kanji N3 trong app.",
    groups: groups,
    tips: [
      { h: "Mẹo làm 漢字読み với động từ", li: [
        "**Đọc cả 送り仮名**: phần kana phía sau giúp loại đáp án. Ví dụ 汚**れる** → chỉ có thể là 〜れる (よごれる), loại ngay đáp án kết thúc 〜す.",
        "**Đứng một mình → âm Kun, ghép 2 chữ → âm On**: 断る (ことわる) nhưng 判断 (はんだん); 認める (みとめる) nhưng 確認 (かくにん); 加える (くわえる) nhưng 参加 (さんか).",
        "**Một chữ, nhiều động từ**: 降りる (おりる) / 降る (ふる) / 降ろす (おろす); 冷える / 冷やす / 冷める / 冷ます – nhìn 送り仮名 để chọn.",
        "**Cặp tự / tha** (閉まる / 閉める, 届く / 届ける) – xem thêm trang **Tự / tha động từ**."
      ] },
      { h: "Mẹo làm 表記 (chọn chữ Hán)", li: [
        "Gặp cách đọc có nhiều chữ (かえる, なおす, つとめる, はかる) → mở **📌 Bảng phân biệt nhanh** ở nhóm đầu tiên.",
        "Nhìn **danh từ đi kèm**: 病気が**治る** / 時計が**直る**; 会社に**勤める** / 議長を**務める**."
      ] },
      { h: "Cách học đề xuất", li: [
        "Mỗi ngày 1 phần (≈ 25 từ): đọc bảng → tắt Furigana tự đọc → 🎯 Kiểm tra nhóm → đánh dấu ✓ từ đã thuộc.",
        "Dùng nút **↓ Chưa thuộc** để nhảy tới từ còn sót."
      ] }
    ]
  };
})();
