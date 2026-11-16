// Cụm ngữ pháp ôn thi N3.
// n3: STT trong data/grammarData_1.js (N3) | base: STT trong data/grammarData.js (N5/N4 – Minna)
// extra: mẫu bổ sung không có trong data { s, m, lv, ex } (ex có thể dùng furigana dạng 漢字[かんじ])
// compare: bảng so sánh [mẫu, ý chính / sắc thái, cách nối – dấu hiệu]
// tips: bẫy đề & mẹo làm bài (**đậm**)
window.N3_GRAMMAR_GROUPS = [
  {
    title: "ように – ために – ような: mục đích & so sánh",
    n3: [78, 4],
    base: [214, 186, 215],
    compare: [
      ["ために", "Mục đích có **chủ ý**; 2 vế cùng chủ ngữ", "Vる (động từ ý chí) / Nの + ために"],
      ["ように", "Mục đích **không chủ ý**: mong đạt trạng thái", "V khả năng / Vない / tự động từ + ように"],
      ["ような + N / ように + V", "So sánh, nêu ví dụ: \"giống như\"", "Nの / V thể thường + ような・ように"],
      ["ように言う/頼む", "Truyền đạt yêu cầu gián tiếp", "Vる/Vない + ように言われた"],
      ["～ますように", "Cầu mong", "Vます + ように (cuối câu)"]
    ],
    tips: [
      "Thấy **động từ khả năng** (読める, 見える, 聞こえる), **Vない**, **なる** trước chỗ trống → chọn **ように**, không chọn ために.",
      "Thấy động từ ý chí (買う, 行く, 貯める) + chủ ngữ là chính mình → **ために**.",
      "**ような** đứng trước danh từ, **ように** đứng trước động từ/tính từ: 先生のような人 / 先生のように話す."
    ]
  },
  {
    title: "ことにする/なる – ようにする/なる: quyết định, quy định, thói quen",
    n3: [1, 2, 3],
    base: [187, 188, 189, 222],
    extra: [
      { s: "Vる/Vない + ことにする", m: "quyết định (do bản thân)", lv: "N4", ex: "来年[らいねん]、日本[にほん]へ 留学[りゅうがく]することにしました。 (Tôi đã quyết định năm sau du học Nhật.)" },
      { s: "Vる/Vない + ことになる", m: "được quyết định (khách quan, tổ chức)", lv: "N4", ex: "来月[らいげつ] 大阪[おおさか]へ 転勤[てんきん]することになりました。 (Tôi được điều chuyển đi Osaka tháng sau.)" }
    ],
    compare: [
      ["ことにする", "**Tôi** quyết định (1 lần)", "Vる/Vない + ことにする"],
      ["ことにしている", "Quyết định đã thành **thói quen** của bản thân", "Vる/Vない + ことにしている"],
      ["ことになる", "**Được** quyết định (công ty, hoàn cảnh)", "Vる/Vない + ことになった"],
      ["ことになっている", "**Quy định**, lịch đã định sẵn", "Vる/Vない + ことになっている"],
      ["ようになる", "**Thay đổi** dần: trở nên có thể / có thói quen", "V khả năng / Vる + ようになる"],
      ["ようにする / ようにしている", "**Cố gắng** (duy trì) để...", "Vる/Vない + ようにする"],
      ["ようになっている", "Được **thiết kế/cơ chế** như vậy", "Vる + ようになっている"]
    ],
    tips: [
      "**する** = có chủ ý (thường chủ ngữ là \"tôi\"); **なる** = khách quan/tự nhiên.",
      "Đuôi **ている** = trạng thái kéo dài: thói quen (ことにしている) hoặc quy định (ことになっている).",
      "ことにする đi với **quyết định**, ようにする đi với **nỗ lực**: 毎日野菜を食べるようにしている (cố gắng ăn rau)."
    ]
  },
  {
    title: "Suy đoán theo mức độ chắc chắn",
    n3: [39, 76, 14, 110],
    base: [169, 168, 170, 229],
    extra: [
      { s: "～はずがない", m: "không thể nào (theo logic)", lv: "N4", ex: "あんなに 練習[れんしゅう]したんだから、負[ま]けるはずがない。 (Đã luyện tập nhiều như vậy, không thể nào thua.)" }
    ],
    compare: [
      ["かもしれない", "~50%: có lẽ, biết đâu", "thể thường (N/Na không だ) + かもしれない"],
      ["でしょう / だろう", "~70%: chắc là", "thể thường + でしょう"],
      ["はずだ", "~85%: lẽ ra là (có **căn cứ logic**)", "thể thường (Naな / Nの) + はずだ"],
      ["に違いない", "~95%: chắc chắn là (**cảm nhận mạnh**, văn viết)", "thể thường (N/Na không だ) + に違いない"],
      ["に決まっている", "~100%: chắc chắn (**chủ quan**, khẩu ngữ)", "thể thường (N/Na không だ) + に決まっている"],
      ["のではないだろうか", "Ý kiến **dè dặt**: chẳng phải là... sao", "thể thường (Naな / Nな) + のではないか"],
      ["おそれがある", "Có **nguy cơ** (việc **xấu**), tin tức", "Vる / Nの + おそれがある"]
    ],
    tips: [
      "**おそれがある** chỉ dùng cho việc xấu: 台風が上陸するおそれがある. Không nói ×合格するおそれがある.",
      "**に違いない / に決まっている** nối thẳng với N và Na (không có だ): 犯人に違いない.",
      "**のではないか** thực chất là **khẳng định nhẹ nhàng** ý kiến của người nói, không phải phủ định."
    ]
  },
  {
    title: "Có vẻ – giống như – nghe nói (そうだ・ようだ・みたいだ・らしい・っぽい)",
    n3: [5, 6, 73, 51],
    base: [217, 230, 231],
    compare: [
      ["Vます/Adj(bỏ い・な) + そうだ", "Trông có vẻ (nhìn **bề ngoài**), sắp xảy ra", "降りそう / おいしそう / 元気そう"],
      ["thể thường + そうだ", "**Nghe nói** (truyền đạt lại)", "降るそうだ / おいしいそうだ"],
      ["ようだ", "Hình như (phán đoán của **bản thân**), lịch sự", "Naな / Nの + ようだ"],
      ["みたいだ", "= ようだ nhưng **khẩu ngữ**", "N / Na + みたい (không の, không な)"],
      ["らしい", "Nghe nói/có vẻ (dựa **thông tin bên ngoài**); N + らしい = **ra dáng**", "N/Na + らしい"],
      ["っぽい", "Có vẻ, hơi giống (thường **tiêu cực**); Vます + っぽい = hay...", "子どもっぽい / 忘れっぽい"],
      ["ということだ", "Nghe nói (văn viết, tin tức) / tức là", "thể thường + ということだ"]
    ],
    tips: [
      "Ngoại lệ hay ra đề: いい → **よさそう**, ない → **なさそう**. Phủ định: 降りそうにない / 降らなさそう.",
      "**らしい** có 2 nghĩa: \"nghe nói\" (雨が降るらしい) và \"đúng chất\" (男らしい, 春らしい天気).",
      "Danh từ: **NのようだN** / **Nみたい** / **Nらしい** – nhìn trợ từ trước chỗ trống để chọn."
    ]
  },
  {
    title: "わけ – はず",
    n3: [80, 81, 82, 83, 84, 85],
    base: [229],
    extra: [
      { s: "～はずがない", m: "không thể nào (= わけがない)", lv: "N4", ex: "彼[かれ]が うそを つくはずがない。 (Anh ấy không thể nào nói dối.)" }
    ],
    compare: [
      ["はずだ", "Lẽ ra là, chắc chắn là (có căn cứ)", "thể thường (Naな / Nの) + はずだ"],
      ["わけだ", "Thảo nào / nghĩa là (**kết luận** từ lý do)", "thể thường (Naな / Nな・である) + わけだ"],
      ["わけがない (= はずがない)", "**Không thể nào**", "thể thường + わけがない"],
      ["わけではない", "**Không hẳn là** (phủ định một phần)", "thể thường + わけではない"],
      ["わけにはいかない", "Không thể (vì **đạo lý, hoàn cảnh xã hội**)", "Vる + わけにはいかない"],
      ["ないわけにはいかない", "**Không thể không** = buộc phải", "Vない + わけにはいかない"]
    ],
    tips: [
      "Gặp **全部 / いつも / 必ずしも / 別に** + ～わけではない → phủ định một phần.",
      "**わけにはいかない** ≠ できない: có khả năng làm nhưng **không nên/không được** (明日試験だから、遊ぶわけにはいかない).",
      "Câu trước nêu lý do, câu sau \"thảo nào\" → **わけだ** (道理で... わけだ)."
    ]
  },
  {
    title: "Bắt buộc – không cần – phủ định kép",
    n3: [48, 52, 54, 45, 79, 53],
    base: [96, 95, 120, 145],
    compare: [
      ["なければならない / ないと", "Phải", "Vない(bỏ い) + ければならない"],
      ["なくてもいい", "Không cần cũng được", "Vない(bỏ い) + くてもいい"],
      ["しかない / ほかない", "Chỉ còn cách", "Vる + しかない"],
      ["ことはない", "**Không cần phải** (khuyên, trấn an)", "Vる + ことはない"],
      ["ないことはない / ないこともない", "Không phải là không (**khẳng định yếu**)", "Vない + ことはない"],
      ["ようがない", "**Không có cách nào** để", "Vます(bỏ ます) + ようがない"],
      ["てからでないと～ない", "Phải A xong thì mới B được", "Vて + からでないと"],
      ["～こと", "Quy định trong văn bản: phải / không được", "Vる/Vない + こと。"]
    ],
    tips: [
      "**ことはない** (không cần) ≠ **ないことはない** (vẫn có thể) – đếm số phủ định!",
      "**ようがない** nối với Vます: 連絡しようがない (không có cách liên lạc).",
      "**しか** luôn đi với phủ định: 1000円しかない. Thấy しか ở chỗ trống mà vế sau khẳng định → loại."
    ]
  },
  {
    title: "Nguyên nhân – lý do (おかげ・せい・もので・からには)",
    n3: [18, 19, 55, 56, 66],
    base: [53, 202, 200, 201, 148],
    compare: [
      ["から", "Lý do **chủ quan**, vế sau tự do (mệnh lệnh, rủ rê)", "thể thường + から"],
      ["ので", "Lý do **khách quan**, lịch sự", "thể thường (Naな / Nな) + ので"],
      ["て / Nで", "Nguyên nhân → **cảm xúc/kết quả**, vế sau không ý chí", "Vて / Adjくて / Nで"],
      ["おかげで", "Nhờ (kết quả **tốt**)", "Nの / thể thường + おかげで"],
      ["せいで / せいか", "Tại vì (kết quả **xấu**, đổ lỗi)", "Nの / thể thường + せいで"],
      ["もの / もん", "Biện minh (khẩu ngữ, trẻ con/nữ)", "thể thường + もの"],
      ["ものだから / もので", "**Thanh minh** lý do (xin lỗi, giải thích)", "thể thường (Naな / Nな) + ものだから"],
      ["からには", "**Đã... thì phải** (quyết tâm, nghĩa vụ)", "thể thường + からには"]
    ],
    tips: [
      "**おかげ** đi với kết quả tốt, **せい** đi với kết quả xấu. おかげで dùng mỉa mai cho kết quả xấu là trường hợp hiếm.",
      "**ものだから / ので / て** không đi với mệnh lệnh, rủ rê ở vế sau → chọn **から**.",
      "Vế sau có **つもりだ / べきだ / なければならない / たい** → thường là **からには**."
    ]
  },
  {
    title: "Nhượng bộ – trái ngược (のに・くせに・わりに・ても・反面)",
    n3: [27, 105, 104, 91, 92, 95, 34],
    base: [224, 132, 133, 48, 113],
    compare: [
      ["のに", "Vậy mà (bất mãn, ngạc nhiên, tiếc)", "thể thường (Naな / Nな) + のに"],
      ["くせに", "Vậy mà (**chê bai** người khác, 2 vế cùng chủ ngữ)", "thể thường (Naな / Nの) + くせに"],
      ["わりに(は)", "So với... thì (không như mức **thông thường**)", "thể thường (Naな / Nの) + わりに"],
      ["ても / たとえ～ても", "Cho dù... cũng", "Vて / Adjくて / Nで + も"],
      ["からといって", "Chỉ vì... **không có nghĩa là**", "thể thường + からといって + ～わけではない"],
      ["に反して", "**Trái với** dự đoán/kỳ vọng/quy định", "N + に反して"],
      ["反面", "Mặt khác (**2 mặt** của cùng 1 sự vật)", "thể thường (Naな・である / Nである) + 反面"],
      ["に対して", "Trái lại (so sánh **2 đối tượng** khác nhau)", "N / thể thường + のに対して"]
    ],
    tips: [
      "**くせに** không dùng cho bản thân và luôn mang ý **trách móc**: 知っているくせに教えてくれない.",
      "**わりに** đi với từ chỉ mức độ: 年齢のわりに若く見える, 値段のわりにおいしい.",
      "**たとえ / いくら / どんなに** báo hiệu vế sau là **ても**."
    ]
  },
  {
    title: "Thời điểm: うちに・とたん・最中・たびに・以来・際に",
    n3: [31, 41, 44, 26, 46, 109, 50, 107],
    base: [123, 124, 102, 179, 87, 146],
    compare: [
      ["とき", "Khi (chung nhất)", "Vる/Vた/Adj/Nの + とき"],
      ["うちに", "**Trong lúc** (trước khi trạng thái thay đổi) / Vないうちに: trước khi", "Vる・ている / Adj / Nの + うちに"],
      ["最中に", "**Đúng lúc đang** (thường bị cắt ngang)", "Vている / Nの + 最中に"],
      ["たとたん(に)", "**Vừa... thì ngay** (bất ngờ, không ý chí)", "Vた + とたん"],
      ["たびに", "**Mỗi lần**", "Vる / Nの + たびに"],
      ["て以来", "**Kể từ khi** (đến nay vẫn tiếp diễn)", "Vて + 以来"],
      ["際(に)", "Khi (**trang trọng**, thông báo)", "Vる・た / Nの + 際に"],
      ["ついでに", "**Nhân tiện**", "Vる・た / Nの + ついでに"],
      ["をきっかけに", "**Nhân dịp**, bước ngoặt", "N + をきっかけに"]
    ],
    tips: [
      "**たとたん** vế sau là việc bất ngờ, KHÔNG dùng ý chí/mệnh lệnh: ×家に帰ったとたん、宿題をしよう.",
      "**うちに** nhấn mạnh tận dụng thời gian: 若いうちに, 暗くならないうちに.",
      "**て以来** vế sau là trạng thái kéo dài đến hiện tại (ずっと, 一度も～ない)."
    ]
  },
  {
    title: "ところ – ばかり – かける – きる",
    n3: [58, 59, 60, 102, 67],
    base: [225, 226, 227, 228],
    compare: [
      ["Vる ところだ", "**Sắp** làm", "Vる + ところだ"],
      ["Vている ところだ", "**Đang** làm", "Vている + ところだ"],
      ["Vた ところだ", "**Vừa xong** (ngay lúc này)", "Vた + ところだ"],
      ["Vた ばかりだ", "Vừa mới (theo **cảm nhận**, có thể đã lâu)", "Vた + ばかり"],
      ["Vた ところ", "Làm thử thì (**kết quả** bất ngờ)", "Vた + ところ、～た"],
      ["ところに/へ/を", "**Đúng lúc** (có người/việc xen vào)", "Vる・ている・た + ところに"],
      ["ところだった", "**Suýt** nữa thì", "Vる + ところだった"],
      ["かける / かけの", "**Dở dang**, chưa xong", "Vます + かける"],
      ["きる / きれない", "Làm **hết**, hoàn toàn / không thể hết", "Vます + きる"]
    ],
    tips: [
      "**ばかり** dùng được với khoảng thời gian dài (日本に来たばかりで… dù đã 3 tháng), **ところ** thì không.",
      "**ところだった** thường đi với もう少しで / 危うく: もう少しで遅れるところだった.",
      "かける ↔ きる là cặp đối: 読みかけの本 (sách đọc dở) ↔ 読みきる (đọc hết)."
    ]
  },
  {
    title: "Biến đổi song song: càng... càng (につれて・にしたがって・とともに・一方だ)",
    n3: [42, 43, 74, 75, 47, 62, 8],
    base: [185, 187, 218],
    compare: [
      ["ば～ほど", "Càng... càng", "Vば + Vる + ほど"],
      ["につれ(て)", "Cùng với (thay đổi **tự nhiên**)", "Vる / N + につれて"],
      ["にしたがって", "Theo (thay đổi) / **tuân theo** chỉ thị", "Vる / N + にしたがって"],
      ["とともに", "Cùng với (thay đổi) / **cùng với** ai / **đồng thời**", "Vる / N + とともに"],
      ["にともなって", "Đi kèm theo (**trang trọng**, xã hội)", "Vる(の) / N + にともなって"],
      ["一方だ", "**Ngày càng** (một chiều, thường **xấu**)", "Vる + 一方だ"],
      ["てくる / ていく", "Thay đổi từ quá khứ → nay / từ nay → tương lai", "Vて + くる / いく"]
    ],
    tips: [
      "Mẫu につれて / にしたがって / とともに / にともなって: **cả 2 vế đều phải là sự thay đổi**. ×年をとるにつれて、旅行に行った.",
      "Vế trước thường có từ chỉ thay đổi: 増える, 減る, 上がる, 年をとる, 時間がたつ, 〜化.",
      "**一方だ** đứng cuối câu: 物価は上がる一方だ."
    ]
  },
  {
    title: "Mức độ – so sánh (ほど・くらい・に比べて)",
    n3: [29, 61, 63, 30, 23],
    base: [66, 67, 68],
    extra: [
      { s: "N1は N2ほど ～ない", m: "N1 không ... bằng N2", lv: "N4", ex: "今年[ことし]の 夏[なつ]は 去年[きょねん]ほど 暑[あつ]くない。 (Mùa hè năm nay không nóng bằng năm ngoái.)" }
    ],
    compare: [
      ["くらい / ぐらい", "Đến mức (khẩu ngữ); cũng dùng để **xem nhẹ**", "V/Adj thể thường / Nの + くらい"],
      ["ほど", "Đến mức (**mức độ cao**, trang trọng hơn)", "V/Adj thể thường / N + ほど"],
      ["ほど～ない", "Không đến mức / **không bằng**", "N + ほど + phủ định"],
      ["くらいなら", "**Thà... còn hơn**", "Vる + くらいなら～方がいい"],
      ["に比べて", "**So với**", "N + に比べて"]
    ],
    tips: [
      "**くらい** dùng được để xem nhẹ (\"chỉ cỡ...\"): 自分の部屋くらい自分で掃除しなさい. **ほど** không dùng nghĩa này.",
      "Câu so sánh phủ định \"không bằng\" → **ほど～ない** (×くらい～ない ít dùng trong đề).",
      "**くらいなら** vế sau thường là ～ほうがいい / ～ないほうがまし."
    ]
  },
  {
    title: "Nhấn mạnh – giới hạn – liệt kê (こそ・さえ・だけ・なんて・とか)",
    n3: [88, 89, 100, 64, 99],
    base: [63, 145, 143, 144, 59, 107],
    compare: [
      ["こそ", "**Chính là** (nhấn mạnh duy nhất)", "N + こそ / Vて + こそ"],
      ["さえ", "**Ngay cả** (ví dụ cực đoan)", "N + (で)さえ"],
      ["さえ～ば", "**Chỉ cần**... là đủ", "N さえ Vば / Vます さえ すれば"],
      ["だけ", "Chỉ (khẳng định) / hết mức có thể (できるだけ)", "N / V + だけ"],
      ["しか～ない", "Chỉ (đi với **phủ định**, ý \"ít\")", "N + しか + phủ định"],
      ["など / なんか / なんて", "Ví dụ; **coi thường** / khiêm tốn / ngạc nhiên", "N + なんて"],
      ["とか～とか", "Nào là... (liệt kê, khẩu ngữ)", "N / V + とか"]
    ],
    tips: [
      "**さえ～ば** = điều kiện tối thiểu: お金さえあれば何でもできる.",
      "**なんて** thể hiện ngạc nhiên/khinh: 彼が犯人だなんて信じられない.",
      "**こそ** hay đi với 今度こそ, 今年こそ, あなたこそ (chính bạn mới...)."
    ]
  },
  {
    title: "Bổ sung – thay thế – lấy làm trung tâm",
    n3: [24, 101, 49, 33, 32, 86, 87],
    base: [149],
    compare: [
      ["に加えて", "**Thêm vào** đó (trang trọng)", "N + に加えて"],
      ["ばかりでなく / だけでなく", "**Không những**... mà còn", "thể thường (Naな / N) + ばかりでなく～も"],
      ["はもちろん / はもとより", "**Đương nhiên** là... (cả ... cũng)", "N + はもちろん～も"],
      ["をはじめ", "**Tiêu biểu là**, bắt đầu từ", "N + をはじめ(として)～など"],
      ["を中心に", "**Lấy làm trung tâm**", "N + を中心に"],
      ["かわりに", "**Thay vì** / bù lại / đổi lại", "Vる / Nの + かわりに"],
      ["にかわって", "**Thay mặt** ai đó", "N(người) + にかわって"]
    ],
    tips: [
      "**かわりに** có 3 nghĩa: thay thế (Nのかわりに), bù lại (高いかわりに丈夫だ), đổi lại (英語を教えるかわりに日本語を教えてもらう).",
      "**をはじめ** thường kết thúc bằng など / いろいろな / 多くの: 東京をはじめ、大阪など大都市.",
      "Dấu hiệu **も** ở vế sau → ばかりでなく / はもちろん / に加えて."
    ]
  },
  {
    title: "Đối tượng: について・に関して・に対して・にとって・として",
    n3: [21, 22, 25, 37, 90],
    compare: [
      ["について", "**Về** (chủ đề nói, nghĩ, điều tra)", "N + について"],
      ["に関して", "Về, liên quan đến (**trang trọng** hơn について)", "N + に関して / に関する N"],
      ["に対して", "**Đối với** (hành động, thái độ **hướng tới** đối tượng)", "N + に対して"],
      ["にとって", "**Đối với** (đứng ở **góc độ** ai đó → **đánh giá**)", "N + にとって"],
      ["として", "**Với tư cách** là", "N + として"]
    ],
    tips: [
      "**にとって** đi với từ đánh giá: 大切だ, 難しい, ありがたい. **に対して** đi với hành động/thái độ: 親切だ, 反対する, 質問する.",
      "×私にとって親切だ → ○私に対して親切だ.",
      "Trước danh từ: についての N / に関する N / に対する N / としての N."
    ]
  },
  {
    title: "Phạm vi thời gian – không gian (から～にかけて・にわたって・を通じて・において)",
    n3: [16, 36, 72, 35],
    base: [20, 98],
    compare: [
      ["から～まで", "Từ... đến (điểm đầu-cuối **rõ ràng**)", "N + から N + まで"],
      ["から～にかけて", "Từ... đến (**khoảng**, ranh giới mờ)", "N + から N + にかけて"],
      ["にわたって", "**Suốt, trải dài** toàn bộ (nhấn mạnh quy mô lớn)", "N(khoảng thời gian/phạm vi) + にわたって"],
      ["を通じて / 通して", "**Suốt** (cả thời kỳ) / **thông qua** (trung gian)", "N + を通じて"],
      ["において", "**Tại, trong** (= で, trang trọng)", "N + において"]
    ],
    tips: [
      "**にわたって** đi với con số/phạm vi lớn: 3日間にわたって, 全国にわたって.",
      "**を通じて** có 2 nghĩa: 一年を通じて (suốt năm) và 友人を通じて (qua bạn bè).",
      "**から～にかけて** hay gặp trong dự báo thời tiết: 夜から朝にかけて雨."
    ]
  },
  {
    title: "Căn cứ – dựa trên – theo (にもとづいて・をもとに・によって・とおり)",
    n3: [93, 94, 38, 20, 43],
    base: [194],
    compare: [
      ["にもとづいて", "Dựa trên **căn cứ chính xác** (luật, dữ liệu, sự thật)", "N + にもとづいて / にもとづく N"],
      ["をもとに(して)", "Lấy làm **chất liệu, gợi ý** để tạo ra", "N + をもとに"],
      ["によって / による", "**Bởi** (bị động) / **do** / **tùy** / **bằng**", "N + によって"],
      ["とおり(に) / どおり", "**Đúng như**", "Vる・た / Nの + とおり / N + どおり"],
      ["にしたがって", "**Tuân theo** chỉ thị, quy tắc", "N + にしたがって"]
    ],
    tips: [
      "**をもとに** = sáng tạo từ nguồn: 実話をもとにした映画. **にもとづいて** = tuân thủ căn cứ: 法律にもとづいて判断する.",
      "**によって** 4 nghĩa: 人によって違う (tùy), 台風によって (do), ベルによって発明された (bởi), 話し合いによって (bằng cách).",
      "**とおり** sau V/Nの, **どおり** gắn thẳng sau N: 予定どおり, 説明のとおり."
    ]
  },
  {
    title: "Điều kiện – giả định (と・ば・たら・なら・とする)",
    n3: [10, 108],
    base: [125, 182, 130, 131, 183, 133, 184, 136],
    compare: [
      ["と", "**Hễ**... thì (tất yếu, tự nhiên)", "Vる + と; vế sau **không** ý chí"],
      ["ば", "Nếu (điều kiện giả định)", "Vば / Adjければ / Nなら"],
      ["たら", "Nếu / **sau khi** (đa năng nhất)", "Vた + ら; vế sau tự do"],
      ["なら", "Nếu là chuyện đó thì (**lời khuyên**, tiếp lời người khác)", "thể thường / N + なら"],
      ["ばよかった / たらよかった", "**Giá mà**... (hối tiếc)", "Vば + よかった"],
      ["～のに (cuối câu)", "Tiếc nuối", "Vば/たら ～のに"],
      ["とする / としたら / とすれば", "**Giả sử**", "thể thường + とする"]
    ],
    tips: [
      "Vế sau là **mệnh lệnh, rủ rê, ý chí** (ください, ましょう, つもり) → **không dùng と**; dùng たら.",
      "Tiếp lời người khác (\"Nếu bạn định đi Kyoto thì...\") → **なら**: 京都へ行くなら、新幹線が便利だ.",
      "**仮に / もし** + とすれば / としたら = giả sử."
    ]
  },
  {
    title: "Xu hướng – tính chất (ぎみ・がち・っぽい・だらけ・向き・向け・み)",
    n3: [68, 69, 73, 17, 70, 71, 13],
    base: [217, 219, 220, 206],
    compare: [
      ["ぎみ", "**Hơi** có cảm giác (thể trạng, xu hướng nhẹ)", "Vます / N + ぎみ: 風邪ぎみ, 疲れぎみ"],
      ["がち", "**Hay, dễ** xảy ra (thường **xấu**, lặp lại)", "Vます / N + がち: 遅れがち, 病気がち"],
      ["っぽい", "**Có tính chất**, giống / hay...", "N / Vます / Aい(bỏ い) + っぽい"],
      ["だらけ", "**Đầy** (thứ không mong muốn, bẩn)", "N + だらけ: 間違いだらけ, 泥だらけ"],
      ["向き", "**Phù hợp** với (tự nhiên hợp)", "N + 向き: 子ども向きの本"],
      ["向け", "**Dành cho** (làm ra nhắm vào đối tượng)", "N + 向け: 子ども向けの番組"],
      ["さ / み", "Danh từ hóa: さ = mức độ đo được; み = cảm nhận", "Adj(bỏ い・な) + さ/み: 高さ, 楽しみ"]
    ],
    tips: [
      "**ぎみ** = trạng thái hiện tại nhẹ; **がち** = tần suất cao. 最近、太りぎみだ / 冬は風邪をひきがちだ.",
      "**向き**: vốn hợp (không chủ ý). **向け**: được làm ra cho (có chủ ý).",
      "**だらけ** luôn tiêu cực; với thứ tích cực dùng いっぱい."
    ]
  },
  {
    title: "Mong muốn – ý chí – cảm xúc mạnh",
    n3: [7, 9, 106, 103, 97, 98],
    base: [69, 70, 161, 163, 164, 205],
    compare: [
      ["たい / ほしい", "Muốn (bản thân)", "Vます + たい / N + がほしい"],
      ["てほしい / てもらいたい", "Muốn **người khác** làm", "Nに + Vて + ほしい"],
      ["つもり", "Dự định (đã quyết)", "Vる / Vない + つもり"],
      ["Vようと思う", "Định (vừa nghĩ ra)", "V thể ý chí + と思う"],
      ["てみる / てみせる", "Thử làm / **làm cho xem**, nhất định sẽ", "Vて + みる / みせる"],
      ["てたまらない", "~ **không chịu nổi** (cảm xúc, cảm giác)", "Vて / Aくて / Naで + たまらない"],
      ["てならない", "~ không thể không cảm thấy (**tự phát**, trang trọng)", "Vて / Aくて + ならない: 気がしてならない"],
      ["をこめて", "**Gửi gắm** (tình cảm, tâm huyết)", "N + をこめて: 心をこめて"]
    ],
    tips: [
      "**てほしい** chủ ngữ hành động là người khác → trợ từ **に**: 友達に来てほしい.",
      "**てならない** đi với động từ tự phát: 思える, 気がする, 心配だ. **てたまらない** hay đi với cảm giác cơ thể: 暑くてたまらない.",
      "**てみせる** thể hiện quyết tâm: 次は絶対に勝ってみせる."
    ]
  },
  {
    title: "Bị động – sai khiến – tự/tha động từ – cho nhận",
    n3: [96, 11, 12],
    base: [190, 191, 192, 193, 233, 234, 235, 236, 152, 157, 158, 210, 211, 212],
    extra: [
      { s: "Vさせられる (使役受身)", m: "bị bắt làm (không muốn)", lv: "N4", ex: "子[こ]どものころ、母[はは]に 野菜[やさい]を 食[た]べさせられた。 (Hồi nhỏ tôi bị mẹ bắt ăn rau.)" },
      { s: "迷惑の受身", m: "bị động gây phiền (cả tự động từ)", lv: "N4", ex: "雨[あめ]に 降[ふ]られて、服[ふく]が ぬれた。 (Bị mưa nên ướt hết quần áo.)" }
    ],
    compare: [
      ["Vられる", "**Bị / được** (bị động)", "N1は N2に Vられる"],
      ["Vさせる", "**Bắt / cho phép** làm", "N1は N2を/に Vさせる"],
      ["Vさせられる", "**Bị bắt** làm", "N1は N2に Vさせられる"],
      ["Vさせてください", "**Xin phép** cho tôi làm", "Vさせて + ください/もらえませんか"],
      ["自動詞 + ている", "Trạng thái **tự nhiên** (không nói ai làm)", "窓が開いている"],
      ["他動詞 + てある", "Trạng thái do **có người làm sẵn** (có mục đích)", "窓が開けてある"],
      ["ておく", "**Làm sẵn** / để nguyên", "Vて + おく"],
      ["てあげる / てもらう / てくれる", "Làm cho / được làm cho / ai đó làm cho tôi", "Vて + あげる・もらう・くれる"]
    ],
    tips: [
      "Cặp tự/tha hay ra: 開く/開ける, 閉まる/閉める, 始まる/始める, 壊れる/壊す, 決まる/決める, 届く/届ける.",
      "**てある** luôn đi với **tha động từ** và trợ từ **が**: 黒板に字が書いてある.",
      "Người làm hộ là người khác cho mình → **てくれる**; mình nhờ → **てもらう** (trợ từ に)."
    ]
  },
  {
    title: "Trích dẫn – định nghĩa – văn nói (って・とは・っけ・縮形)",
    n3: [28, 40, 51, 65, 77, 15],
    base: [114, 115, 176, 177, 178, 175],
    compare: [
      ["って", "= と(言う), という, は – **khẩu ngữ**", "thể thường / N + って"],
      ["とは / というのは", "**Định nghĩa**: ... nghĩa là", "N + とは ～ことだ / という意味だ"],
      ["ということだ", "Nghe nói / tức là", "thể thường + ということだ"],
      ["などと言う / なんて言う", "Nói rằng (coi nhẹ, ngạc nhiên)", "thể thường + などと言う"],
      ["っけ", "**Nhỉ?** (hỏi lại điều quên)", "thể thường (quá khứ) + っけ"],
      ["縮形", "Dạng rút gọn: ちゃう, とく, てる, なきゃ, なくちゃ", "てしまう→ちゃう, ておく→とく, ている→てる"]
    ],
    tips: [
      "Phần nghe & hội thoại hay dùng 縮形: **なきゃ** = なければ, **ちゃ** = ては, **とく** = ておく, **じゃう** = でしまう.",
      "Câu hỏi kết thúc bằng **とは何ですか** / **とは～のことだ** = câu định nghĩa.",
      "**っけ** chỉ dùng trong văn nói thân mật: 会議は何時だったっけ."
    ]
  },
  {
    title: "Biểu hiện với もの・こと",
    n3: [53, 52, 55, 56, 57],
    extra: [
      { s: "～ものだ", m: "đương nhiên là (bản chất) / hồi tưởng (たものだ)", lv: "N3", ex: "子[こ]どものころは よく この 川[かわ]で 泳[およ]いだものだ。 (Hồi nhỏ tôi hay bơi ở con sông này.)" },
      { s: "～ことだ", m: "nên (lời khuyên)", lv: "N3", ex: "上手[じょうず]に なりたければ、毎日[まいにち] 練習[れんしゅう]することだ。 (Muốn giỏi thì nên luyện tập mỗi ngày.)" }
    ],
    compare: [
      ["ものだ", "Lẽ đương nhiên / **hồi tưởng** (たものだ)", "Vる / Vた + ものだ"],
      ["ものか / もんか", "**Đời nào** (phủ định mạnh)", "thể thường + ものか"],
      ["ものだから", "Vì (thanh minh)", "thể thường + ものだから"],
      ["ことだ", "**Nên** (khuyên)", "Vる / Vない + ことだ"],
      ["こと", "Quy định (văn bản)", "Vる / Vない + こと"],
      ["ことはない", "Không cần", "Vる + ことはない"]
    ],
    tips: [
      "**ものだ** nói về bản chất chung (人の心は変わるものだ), **ことだ** khuyên cụ thể.",
      "**ものか** = tuyệt đối không: あんな店、二度と行くものか.",
      "Hồi tưởng thói quen trong quá khứ: **Vたものだ** (thường có よく)."
    ]
  }
];
