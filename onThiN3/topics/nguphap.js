// Ngữ pháp thường dùng & hay ra thi N3 (kèm số thứ tự trong 110 mẫu N3 của app – stt)
window.N3_TOPIC = {
  key: "nguphap",
  short: "Ngữ pháp hay thi",
  title: "頻出文法 Ngữ pháp hay ra thi N3",
  kind: "grammar",
  intro: "Danh sách **chọn lọc các mẫu ra nhiều nhất** ở phần 文法 N3 (問題1 chọn mẫu, 問題2 sắp xếp câu ★, 問題3 文章の文法). ★★★ = gần như kỳ nào cũng có. Mỗi mẫu có **cách nối** – đề rất hay bẫy ở cách nối (Vる hay Vた, có の hay không).",
  groups: [
    {
      title: "Phỏng đoán & truyền đạt (らしい・ようだ・そうだ・はずだ)",
      desc: "Nhóm **luôn có trong đề**. Phân biệt theo **căn cứ**: nghe nói → らしい/そうだ(伝聞); thấy trực tiếp → ようだ/みたいだ; nhìn bề ngoài → Vます+そうだ; suy luận logic → はずだ; tin chắc → に違いない.",
      compare: [
        ["そうだ（伝聞）", "nghe nói (nguồn rõ ràng)", "**普通形** + そうだ"],
        ["そうだ（様態）", "trông có vẻ, sắp (nhìn bề ngoài)", "**Vます / Aい bỏ い / Aな** + そうだ"],
        ["らしい", "nghe nói / có vẻ (căn cứ gián tiếp)", "普通形・N + らしい"],
        ["ようだ／みたいだ", "có vẻ như (cảm nhận trực tiếp)", "普通形 + ようだ・Nの + ようだ / N + みたいだ"],
        ["はずだ", "chắc chắn là (suy luận có căn cứ logic)", "普通形 + はずだ・Nの + はずだ"],
        ["に違[ちが]いない", "chắc chắn (người nói tin chắc)", "普通形・N + に違いない"]
      ],
      tips: [
        "**Vます + そうだ** (降りそうだ) vs **普通形 + そうだ** (降るそうだ) – đề cho 4 đáp án cùng ý nhưng khác cách nối, chọn theo **chữ đứng trước chỗ trống**.",
        "**いい → よさそうだ**, **ない → なさそうだ** (bất quy tắc).",
        "**はずだ** (suy luận khách quan) ≠ **に違いない** (trực giác chủ quan, mạnh)."
      ],
      items: [
        { w: "～らしい", stt: 6, star: 3, form: "普通形・N + らしい", m: "nghe nói, có vẻ (căn cứ gián tiếp)", ex: "天気予報[てんきよほう]によると、明日[あした]は雪[ゆき]が降[ふ]る｛らしい｝。", vi: "Theo dự báo thời tiết, ngày mai có vẻ sẽ có tuyết.", dis: ["ばかりだ", "ことにする", "つもりだ"] },
        { w: "～ようだ", stt: 4, star: 3, syn: "seem", form: "普通形 + ようだ・Nの + ようだ", m: "có vẻ như (cảm nhận trực tiếp)", ex: "部屋[へや]の電気[でんき]が消[き]えている。田中[たなか]さんはもう帰[かえ]った｛ようだ｝。", vi: "Đèn phòng đã tắt. Có vẻ anh Tanaka về rồi.", dis: ["一方だ", "ことだ", "ものか"] },
        { w: "Vます＋そうだ（様態）", star: 3, form: "Vます・Aい(bỏ い)・Aな + そうだ", m: "trông có vẻ, sắp sửa (nhìn bề ngoài)", ex: "空[そら]が暗[くら]くなってきた。今[いま]にも雨[あめ]が降[ふ]り｛そうだ｝。", vi: "Trời tối sầm. Chực đổ mưa đến nơi.", dis: ["らしい", "ようだ", "みたいだ"], note: "降り＋らしい／ようだ／みたいだ đều **sai cách nối** – chỉ そうだ đi với Vます." },
        { w: "普通形＋そうだ（伝聞）", star: 3, form: "普通形 + そうだ", m: "nghe nói (truyền đạt lại)", ex: "ニュースによると、来月[らいげつ]から電車[でんしゃ]の料金[りょうきん]が上[あ]がる｛そうだ｝。", vi: "Theo tin tức, từ tháng sau giá vé tàu sẽ tăng.", dis: ["ところだ", "ものだ", "ばかりだ"] },
        { w: "～はずだ", stt: 80, star: 3, syn: "sure", form: "普通形 + はずだ・Nの・Aな + はずだ", m: "chắc chắn là, lẽ ra (suy luận có căn cứ)", ex: "彼[かれ]は日本[にほん]に十年[じゅうねん]住[す]んでいたから、日本語[にほんご]が上手[じょうず]な｛はずだ｝。", vi: "Anh ấy sống ở Nhật 10 năm nên chắc chắn giỏi tiếng Nhật.", dis: ["ものか", "ばかりだ", "ところだ"] },
        { w: "～に違いない", stt: 39, star: 3, syn: "sure", form: "普通形・N + に違いない", m: "chắc chắn là (tin chắc)", ex: "あんなに練習[れんしゅう]したのだから、合格[ごうかく]する｛に違[ちが]いない｝。", vi: "Luyện tập đến thế thì chắc chắn sẽ đỗ.", dis: ["わけではない", "ことはない", "おそれがある"] },
        { w: "～っけ", stt: 77, star: 2, form: "普通形(た) + っけ", m: "…nhỉ? (hỏi lại điều quên)", ex: "あの人[ひと]の名前[なまえ]、何[なん]だった｛っけ｝。", vi: "Tên người đó là gì ấy nhỉ?", dis: ["らしい", "ものか", "ことか"] }
      ]
    },
    {
      title: "Nguyên nhân – kết quả (おかげで・せいで・わけだ…)",
      desc: "Phân biệt bằng **sắc thái kết quả**: tốt → おかげで; xấu → せいで; xin lỗi, phân trần → ものだから; \"thảo nào\" → わけだ.",
      compare: [
        ["おかげで", "nhờ (kết quả tốt, biết ơn)", "Vた・Nの + おかげで"],
        ["せいで", "tại, do (kết quả xấu, đổ lỗi)", "Vた・Nの + せいで"],
        ["ものだから", "vì (phân trần, xin lỗi – khẩu ngữ)", "普通形 + ものだから"],
        ["からには", "đã… thì phải (quyết tâm, nghĩa vụ)", "Vる・Vた + からには"],
        ["わけだ", "thảo nào, hèn gì (hiểu ra lý do)", "普通形 + わけだ"]
      ],
      tips: [
        "**わけだ / わけがない / わけではない / わけにはいかない** – 4 mẫu này hay xuất hiện **cùng lúc trong 4 đáp án**. Học kỹ bảng ở nhóm \"Phủ định đặc biệt\".",
        "**せいか** = có lẽ tại… (không chắc) – biến thể hay gặp trong đọc hiểu."
      ],
      items: [
        { w: "～おかげで", stt: 18, star: 3, form: "Vた・Nの + おかげで", m: "nhờ có (kết quả tốt)", ex: "先生[せんせい]が丁寧[ていねい]に教[おし]えてくださった｛おかげで｝、試験[しけん]に合格[ごうかく]できた。", vi: "Nhờ thầy dạy tận tình mà em đã đỗ kỳ thi.", dis: ["せいで", "くせに", "わりに"] },
        { w: "～せいで", stt: 19, star: 3, form: "Vた・Nの + せいで", m: "tại, do (kết quả xấu)", ex: "電車[でんしゃ]が遅[おく]れた｛せいで｝、会議[かいぎ]に間[ま]に合[あ]わなかった。", vi: "Tại tàu trễ mà tôi không kịp cuộc họp.", dis: ["おかげで", "ついでに", "とたんに"] },
        { w: "～ものだから", stt: 56, star: 2, form: "普通形 + ものだから", m: "vì (phân trần, xin lỗi)", ex: "道[みち]が混[こ]んでいた｛ものだから｝、遅[おく]れてしまいました。", vi: "Vì đường đông quá nên tôi đến muộn.", dis: ["くせに", "わりに", "うちに"] },
        { w: "～からには", stt: 66, star: 2, form: "Vる・Vた + からには", m: "đã… thì (phải)", ex: "約束[やくそく]した｛からには｝、最後[さいご]までやらなければならない。", vi: "Đã hứa thì phải làm đến cùng.", dis: ["くせに", "とたん", "ついでに"] },
        { w: "～わけだ", stt: 81, star: 3, form: "普通形 + わけだ", m: "thảo nào, hèn gì; tức là", ex: "彼[かれ]は十年[じゅうねん]もアメリカにいたのか。英語[えいご]が上手[じょうず]な｛わけだ｝。", vi: "Anh ấy ở Mỹ những 10 năm à. Thảo nào giỏi tiếng Anh.", dis: ["わけがない", "わけではない", "わけにはいかない"] },
        { w: "～によって", stt: 38, star: 3, form: "N + によって／による", m: "do, bởi (nguyên nhân, tác giả); tùy theo", ex: "地震[じしん]｛によって｝、多[おお]くの建物[たてもの]が壊[こわ]れた。", vi: "Do động đất mà nhiều tòa nhà bị sập.", dis: ["にとって", "に対して", "について"], note: "Còn nghĩa: **tùy theo** (人によって考え方が違う), **bởi** (bị động: この絵はピカソによって描かれた)." }
      ]
    },
    {
      title: "Thời điểm (うちに・とたん・最中・ところだった…)",
      desc: "Chú ý **thể đứng trước**: とたん cần **Vた**; うちに cần **Vる / Vている / Vない / Aい / Nの**; 最中 cần **Vている / Nの**.",
      compare: [
        ["うちに", "trong lúc (còn…) / trước khi (thay đổi)", "Vる・Vている・Vない・Aい・Nの"],
        ["たとたん", "vừa… thì ngay lập tức (bất ngờ)", "**Vた** + とたん"],
        ["最中[さいちゅう]に", "đang giữa lúc… thì", "Vている・Nの + 最中に"],
        ["ところだった", "suýt nữa thì", "Vる + ところだった"],
        ["て以来[いらい]", "kể từ khi… (đến giờ)", "Vて + 以来"]
      ],
      tips: [
        "**とたん**: vế sau là sự việc **bất ngờ ngoài ý muốn**, không dùng ý chí (✗ 家に帰ったとたん、勉強しよう).",
        "**うちに** + biến đổi tự nhiên: 話しているうちに眠くなった (trong lúc… thì lúc nào không biết)."
      ],
      items: [
        { w: "～うちに", stt: 31, star: 3, form: "Vる・Vている・Vない・Aい・Nの + うちに", m: "trong lúc (còn), trước khi", ex: "若[わか]い｛うちに｝、いろいろな国[くに]へ行[い]っておきたい。", vi: "Tôi muốn đi nhiều nước khi còn trẻ.", dis: ["とたんに", "最中に", "以来"] },
        { w: "～たとたん（に）", stt: 41, star: 3, form: "Vた + とたん", m: "vừa… thì ngay", ex: "ドアを開[あ]けた｛とたん｝、猫[ねこ]が飛[と]び出[だ]してきた。", vi: "Vừa mở cửa thì con mèo phóng ra.", dis: ["うちに", "最中に", "ついでに"] },
        { w: "～最中に", stt: 44, star: 2, form: "Vている・Nの + 最中に", m: "đang giữa lúc… thì", ex: "会議[かいぎ]の｛最中[さいちゅう]に｝、携帯電話[けいたいでんわ]が鳴[な]った。", vi: "Đang giữa cuộc họp thì điện thoại reo.", dis: ["とたんに", "ついでに", "以来"] },
        { w: "～ところだった", stt: 60, star: 2, form: "Vる + ところだった", m: "suýt nữa thì", ex: "もう少[すこ]しで車[くるま]にひかれる｛ところだった｝。", vi: "Suýt nữa thì bị xe đâm.", dis: ["ばかりだった", "ものだった", "ことだった"] },
        { w: "～て以来", stt: 46, star: 2, form: "Vて + 以来", m: "kể từ khi", ex: "日本[にほん]に来[き]て｛以来[いらい]｝、一度[いちど]も国[くに]に帰[かえ]っていない。", vi: "Từ khi sang Nhật tôi chưa về nước lần nào.", dis: ["からでないと", "とたん", "うちに"] },
        { w: "～ついでに", stt: 50, star: 2, form: "Vる・Vた・Nの + ついでに", m: "nhân tiện, tiện thể", ex: "コンビニへ行[い]く｛ついでに｝、この手紙[てがみ]を出[だ]してきてくれない？", vi: "Tiện đi cửa hàng tiện lợi thì gửi giúp lá thư này được không?", dis: ["とたんに", "最中に", "以来"] },
        { w: "～際（に）", stt: 109, star: 2, form: "Vる・Vた・Nの + 際に", m: "khi, lúc (trang trọng, thông báo)", ex: "お降[お]りの｛際[さい]は｝、お忘[わす]れ物[もの]のないようご注意[ちゅうい]ください。", vi: "Khi xuống xe, xin quý khách chú ý không để quên đồ.", dis: ["うちは", "最中は", "とたんは"] }
      ]
    },
    {
      title: "Đối tượng · lập trường (にとって・に対して・として…)",
      desc: "Nhóm trợ từ phức – đề hay cho **4 mẫu này cùng lúc**. Hỏi: danh từ trước là **người đánh giá** (にとって), **đối tượng hành động hướng tới** (に対して), **chủ đề** (について), hay **tư cách** (として)?",
      compare: [
        ["にとって", "đối với (ai đó – đánh giá, cảm nhận)", "私にとって大切だ"],
        ["に対[たい]して", "đối với (thái độ, hành động hướng vào)", "客に対して丁寧に"],
        ["について", "về (chủ đề nói, viết, nghĩ)", "歴史について調べる"],
        ["として", "với tư cách là", "留学生として"],
        ["によって", "do / tùy theo / bởi", "国によって違う"]
      ],
      tips: [
        "Sau **にとって** thường là tính từ đánh giá: 大切だ・難しい・ありがたい. Sau **に対して** là hành động/thái độ: 怒る・丁寧に話す・反対する.",
        "**をはじめ** (tiêu biểu là A, và cả B, C…) thường đi với **など / も**."
      ],
      items: [
        { w: "～にとって", stt: 37, star: 3, form: "N + にとって", m: "đối với (ai – đánh giá)", ex: "私[わたし]｛にとって｝、家族[かぞく]は一番[いちばん]大切[たいせつ]なものだ。", vi: "Đối với tôi, gia đình là quan trọng nhất.", dis: ["に対して", "について", "によって"] },
        { w: "～に対して", stt: 34, star: 3, form: "N + に対して", m: "đối với (thái độ, hành động); trái với", ex: "お客様[きゃくさま]｛に対[たい]して｝、失礼[しつれい]な言葉[ことば]を使[つか]ってはいけない。", vi: "Không được dùng lời thất lễ với khách hàng.", dis: ["にとって", "について", "として"] },
        { w: "～について", stt: 21, star: 3, syn: "about", form: "N + について", m: "về (chủ đề)", ex: "日本[にほん]の歴史[れきし]｛について｝レポートを書[か]いた。", vi: "Tôi đã viết báo cáo về lịch sử Nhật Bản.", dis: ["にとって", "に対して", "として"] },
        { w: "～として", stt: 90, star: 3, form: "N + として", m: "với tư cách là", ex: "彼[かれ]は留学生[りゅうがくせい]｛として｝日本[にほん]に来[き]た。", vi: "Anh ấy sang Nhật với tư cách du học sinh.", dis: ["にとって", "について", "によって"] },
        { w: "～をはじめ", stt: 33, star: 2, form: "N + をはじめ（として）", m: "tiêu biểu là, trước tiên là", ex: "東京[とうきょう]｛をはじめ｝、大阪[おおさか]や京都[きょうと]にも店[みせ]がある。", vi: "Có cửa hàng ở Tokyo và cả Osaka, Kyoto nữa.", dis: ["にとって", "として", "について"] },
        { w: "～を中心に", stt: 32, star: 2, form: "N + を中心に（して）", m: "lấy… làm trung tâm", ex: "このサークルは留学生[りゅうがくせい]｛を中心[ちゅうしん]に｝活動[かつどう]している。", vi: "Câu lạc bộ này hoạt động với nòng cốt là du học sinh.", dis: ["にとって", "に対して", "について"] },
        { w: "～にわたって", stt: 36, star: 2, form: "N(thời gian, phạm vi) + にわたって", m: "suốt, trải dài khắp", ex: "工事[こうじ]は三年間[さんねんかん]｛にわたって｝行[おこな]われた。", vi: "Công trình được tiến hành suốt 3 năm.", dis: ["にとって", "について", "に対して"] },
        { w: "～を通じて", stt: 72, star: 2, form: "N + を通じて／を通して", m: "thông qua; suốt (thời gian)", ex: "インターネット｛を通[つう]じて｝、世界中[せかいじゅう]の人[ひと]と知[し]り合[あ]えた。", vi: "Thông qua Internet tôi quen được người khắp thế giới.", dis: ["にとって", "に対して", "について"] }
      ]
    },
    {
      title: "Thay đổi song song (につれて・ば〜ほど・一方だ…)",
      desc: "Diễn tả **A thay đổi kéo theo B thay đổi**. Vế trước và sau đều phải là **sự biến đổi** (✗ 年をとるにつれて、旅行した).",
      tips: [
        "**一方だ** = ngày càng (thường theo hướng xấu): 悪くなる一方だ. Khác **一方（で）** = mặt khác.",
        "**ば〜ほど**: lặp lại cùng động từ – **Vば + Vる + ほど** (読めば読むほど), tính từ: 安ければ安いほど."
      ],
      items: [
        { w: "～につれて", stt: 42, star: 3, syn: "along", form: "Vる・N + につれて", m: "cùng với (việc A thay đổi, B cũng thay đổi)", ex: "年[とし]をとる｛につれて｝、体力[たいりょく]が落[お]ちてくる。", vi: "Càng có tuổi, thể lực càng giảm.", dis: ["について", "にとって", "に対して"] },
        { w: "～とともに", stt: 74, star: 2, syn: "along", form: "Vる・N + とともに", m: "cùng với; đồng thời", ex: "経済[けいざい]の発展[はってん]｛とともに｝、環境問題[かんきょうもんだい]が深刻[しんこく]になった。", vi: "Cùng với sự phát triển kinh tế, vấn đề môi trường trở nên nghiêm trọng.", dis: ["にとって", "として", "について"] },
        { w: "～ば～ほど", stt: 62, star: 3, form: "Vば + Vる + ほど / Aければ + Aい + ほど", m: "càng… càng", ex: "考[かんが]えれば考[かんが]える｛ほど｝、わからなくなる。", vi: "Càng nghĩ càng không hiểu.", dis: ["ばかり", "くらい", "うちに"] },
        { w: "～一方だ", stt: 47, star: 2, form: "Vる + 一方だ", m: "ngày càng (một chiều, thường xấu)", ex: "円安[えんやす]で、物価[ぶっか]は上[あ]がる｛一方[いっぽう]だ｝。", vi: "Do đồng yên yếu, vật giá cứ tăng mãi.", dis: ["ことだ", "ものか", "っけ"] }
      ]
    },
    {
      title: "Phủ định đặc biệt (わけ〜・ことはない・ものか・しかない)",
      desc: "Nhóm **bẫy nặng nhất** – 4 mẫu わけ hay xuất hiện cùng lúc. Dịch sát nghĩa từng mẫu trước khi chọn.",
      compare: [
        ["わけがない", "không thể nào (phủ định mạnh khả năng)", "できるわけがない"],
        ["わけではない", "không hẳn là (phủ định một phần)", "嫌いなわけではない"],
        ["わけにはいかない", "không thể (vì đạo lý, hoàn cảnh)", "休むわけにはいかない"],
        ["ないわけにはいかない", "không thể không, buộc phải", "行かないわけにはいかない"],
        ["ことはない", "không cần phải", "心配することはない"],
        ["ものか", "đời nào, nhất định không (cảm xúc mạnh)", "行くものか"]
      ],
      tips: [
        "**わけがない ≈ はずがない** (không thể nào). **わけではない ≈ とは限らない** (không hẳn).",
        "**わけにはいかない**: có khả năng nhưng **không được phép** vì lý do xã hội/đạo đức (明日は試験だから休むわけにはいかない)."
      ],
      items: [
        { w: "～わけがない", stt: 82, star: 3, form: "普通形 + わけがない", m: "không thể nào", ex: "一度[いちど]も練習[れんしゅう]していない人[ひと]が、優勝[ゆうしょう]できる｛わけがない｝。", vi: "Người chưa luyện tập lần nào thì không thể nào vô địch.", dis: ["わけだ", "わけにはいかない", "ことだ"] },
        { w: "～わけではない", stt: 83, star: 3, form: "普通形 + わけではない", m: "không hẳn là, không phải là", ex: "日本料理[にほんりょうり]が嫌[きら]いな｛わけではない｝が、毎日[まいにち]は食[た]べられない。", vi: "Không phải tôi ghét đồ Nhật, nhưng ngày nào cũng ăn thì không nổi.", dis: ["わけがない", "わけだ", "はずだ"] },
        { w: "～わけにはいかない", stt: 84, star: 3, form: "Vる + わけにはいかない", m: "không thể (vì hoàn cảnh, đạo lý)", ex: "明日[あした]は大事[だいじ]な試験[しけん]があるので、休[やす]む｛わけにはいかない｝。", vi: "Mai có kỳ thi quan trọng nên không thể nghỉ được.", dis: ["わけがない", "わけではない", "わけだ"] },
        { w: "～ないわけにはいかない", stt: 85, star: 2, form: "Vない + わけにはいかない", m: "không thể không, buộc phải", ex: "お世話[せわ]になった先生[せんせい]の頼[たの]みだから、引[ひ]き受[う]けない｛わけにはいかない｝。", vi: "Là lời nhờ của thầy đã giúp đỡ mình nên không thể không nhận.", dis: ["わけだ", "ところだ", "ばかりだ"] },
        { w: "～ことはない", stt: 52, star: 2, form: "Vる + ことはない", m: "không cần phải", ex: "簡単[かんたん]な手術[しゅじゅつ]だから、心配[しんぱい]する｛ことはない｝よ。", vi: "Phẫu thuật đơn giản thôi, không cần phải lo đâu.", dis: ["わけにはいかない", "ものだ", "ところだ"] },
        { w: "～ものか", stt: 57, star: 2, form: "普通形 + ものか（もんか）", m: "đời nào, nhất định không", ex: "あんなまずい店[みせ]、二度[にど]と行[い]く｛ものか｝。", vi: "Quán dở thế, đời nào tôi đến lần nữa.", dis: ["ことか", "わけだ", "はずだ"] },
        { w: "～ようがない", stt: 79, star: 2, form: "Vます + ようがない", m: "không có cách nào để", ex: "住所[じゅうしょ]も電話番号[でんわばんごう]もわからないので、連絡[れんらく]し｛ようがない｝。", vi: "Không biết cả địa chỉ lẫn số điện thoại nên không cách nào liên lạc.", dis: ["がちだ", "かけだ", "っぽい"] },
        { w: "～しかない", stt: 48, star: 3, form: "Vる + しかない", m: "chỉ còn cách", ex: "終電[しゅうでん]に乗[の]り遅[おく]れたから、タクシーで帰[かえ]る｛しかない｝。", vi: "Lỡ chuyến tàu cuối nên chỉ còn cách về bằng taxi.", dis: ["ことはない", "わけがない", "ものか"] }
      ]
    },
    {
      title: "Nhấn mạnh · mức độ (こそ・さえ・ばかりでなく・くらい・なんて)",
      tips: [
        "**さえ** (ngay cả) thường đi với phủ định hoặc **さえ〜ば** (chỉ cần… là): お金さえあれば.",
        "**こそ** nhấn mạnh \"chính là\": 今度こそ, こちらこそ, だからこそ.",
        "**くらい / ほど** chỉ mức độ: 泣きたいくらい (đến mức muốn khóc)."
      ],
      items: [
        { w: "～こそ", stt: 88, star: 2, form: "N + こそ", m: "chính là, nhất định (nhấn mạnh)", ex: "今度[こんど]｛こそ｝合格[ごうかく]してみせる。", vi: "Lần này nhất định tôi sẽ đỗ cho xem.", dis: ["さえ", "なんか", "ばかり"] },
        { w: "～さえ", stt: 89, star: 3, form: "N + さえ / Vます + さえ", m: "ngay cả; (さえ〜ば) chỉ cần", ex: "忙[いそが]しくて、昼[ひる]ご飯[はん]を食[た]べる時間[じかん]｛さえ｝ない。", vi: "Bận đến mức ngay cả thời gian ăn trưa cũng không có.", dis: ["こそ", "ばかり", "ほど"] },
        { w: "～ばかりでなく", stt: 101, star: 2, form: "普通形・N + ばかりでなく", m: "không chỉ… mà còn", ex: "彼[かれ]は英語[えいご]｛ばかりでなく｝、中国語[ちゅうごくご]も話[はな]せる。", vi: "Anh ấy không chỉ nói được tiếng Anh mà cả tiếng Trung.", dis: ["さえ", "こそ", "として"] },
        { w: "～くらい／ぐらい", stt: 29, star: 2, form: "普通形 + くらい", m: "đến mức", ex: "足[あし]が痛[いた]くて、歩[ある]けない｛くらい｝だ。", vi: "Chân đau đến mức không đi được.", dis: ["ばかり", "こそ", "さえ"] },
        { w: "～なんて", stt: 64, star: 2, form: "普通形・N + なんて", m: "…thật là (ngạc nhiên, coi nhẹ)", ex: "宝[たから]くじが当[あ]たる｛なんて｝、夢[ゆめ]みたいだ。", vi: "Trúng xổ số thật như mơ.", dis: ["こそ", "さえ", "ばかりか"] }
      ]
    },
    {
      title: "Xu hướng & trạng thái (がち・ぎみ・っぽい・だらけ・かけ・きる)",
      desc: "Nhóm **hậu tố** – đề hay bẫy ở **cách nối** và **sắc thái**: がち (hay xảy ra, xấu), ぎみ (hơi có triệu chứng), っぽい (có vẻ, giống), だらけ (đầy, dính toàn thứ không hay).",
      compare: [
        ["がち", "hay bị, dễ (lặp lại, xấu)", "Vます・N + がち"],
        ["ぎみ", "hơi bị (cảm giác, triệu chứng)", "Vます・N + ぎみ"],
        ["っぽい", "có vẻ như, hay (tính chất)", "Vます・N・Aい(bỏ い) + っぽい"],
        ["だらけ", "đầy (thứ không hay)", "N + だらけ"],
        ["かけ", "đang dở dang", "Vます + かけ（の N）"],
        ["きる", "làm hết, hoàn toàn", "Vます + きる"]
      ],
      items: [
        { w: "～がち", stt: 69, star: 3, form: "Vます・N + がち", m: "hay, dễ (xu hướng không tốt)", ex: "冬[ふゆ]は運動不足[うんどうぶそく]になり｛がち｝だ。", vi: "Mùa đông dễ bị thiếu vận động.", dis: ["だらけ", "っぽい", "向け"] },
        { w: "～ぎみ", stt: 68, star: 2, form: "Vます・N + ぎみ", m: "hơi có vẻ, hơi bị", ex: "最近[さいきん]、ちょっと風邪[かぜ]｛ぎみ｝で、のどが痛[いた]い。", vi: "Dạo này hơi bị cảm, đau họng.", dis: ["だらけ", "向け", "きり"] },
        { w: "～だらけ", stt: 17, star: 2, form: "N + だらけ", m: "đầy, toàn là (không hay)", ex: "子供[こども]たちは泥[どろ]｛だらけ｝になって遊[あそ]んでいる。", vi: "Bọn trẻ chơi lấm lem toàn bùn.", dis: ["ぎみ", "っぽい", "がち"] },
        { w: "～っぽい", stt: 73, star: 2, form: "Vます・N・Aい(bỏ い) + っぽい", m: "có vẻ, giống; hay (tính cách)", ex: "彼[かれ]は大人[おとな]なのに、子供[こども]｛っぽい｝ところがある。", vi: "Anh ấy là người lớn mà vẫn có nét trẻ con.", dis: ["だらけ", "がち", "ぎみ"] },
        { w: "～かけ", stt: 102, star: 2, form: "Vます + かけ（の N）／かける", m: "đang dở dang", ex: "テーブルの上[うえ]に、食[た]べ｛かけ｝のパンが置[お]いてある。", vi: "Trên bàn có miếng bánh mì đang ăn dở.", dis: ["がち", "ぎみ", "向け"] },
        { w: "～きる", stt: 67, star: 2, form: "Vます + きる", m: "làm hết, hoàn toàn", ex: "一晩[ひとばん]で、この長[なが]い小説[しょうせつ]を読[よ]み｛きった｝。", vi: "Tôi đọc hết cuốn tiểu thuyết dài này trong một đêm.", dis: ["がちだった", "ぎみだった", "っぽかった"] }
      ]
    },
    {
      title: "Trái kỳ vọng (くせに・わりに・からといって・反面・たとえ〜ても)",
      tips: [
        "**くせに** có sắc thái **trách móc, khinh** và chủ ngữ 2 vế phải giống nhau. **のに** trung tính hơn.",
        "**わりに** = so với mức thông thường thì… (bất ngờ, có thể tốt hoặc xấu): 安いわりにおいしい.",
        "**からといって** thường đi với **〜とは限らない / 〜わけではない** ở cuối câu."
      ],
      items: [
        { w: "～くせに", stt: 105, star: 3, form: "普通形・Nの・Aな + くせに", m: "vậy mà, thế mà (trách móc)", ex: "知[し]っている｛くせに｝、教[おし]えてくれない。", vi: "Biết rõ thế mà không chịu nói cho tôi.", dis: ["おかげで", "ついでに", "からには"] },
        { w: "～わりに（は）", stt: 104, star: 3, form: "普通形・Nの・Aな + わりに", m: "so với… thì (khá bất ngờ)", ex: "この店[みせ]は値段[ねだん]が安[やす]い｛わりに｝、料理[りょうり]がおいしい。", vi: "Quán này so với giá rẻ thì đồ ăn ngon.", dis: ["せいで", "からには", "ついでに"] },
        { w: "～からといって", stt: 91, star: 2, form: "普通形 + からといって", m: "dù… nhưng không có nghĩa là", ex: "お金[かね]がある｛からといって｝、幸[しあわ]せだとは限[かぎ]らない。", vi: "Có tiền không có nghĩa là hạnh phúc.", dis: ["からには", "おかげで", "ついでに"] },
        { w: "～反面", stt: 95, star: 2, form: "普通形・Aな/Nである + 反面", m: "mặt khác, ngược lại", ex: "都会[とかい]の生活[せいかつ]は便利[べんり]な｛反面[はんめん]｝、ストレスも多[おお]い。", vi: "Cuộc sống thành thị tiện lợi, mặt khác cũng nhiều căng thẳng.", dis: ["おかげで", "からには", "ついでに"] },
        { w: "たとえ～ても", stt: 27, star: 2, form: "たとえ + Vて・Aくて・Aで/Nで + も", m: "cho dù… cũng", ex: "｛たとえ｝反対[はんたい]されても、私[わたし]はこの仕事[しごと]を続[つづ]ける。", vi: "Cho dù bị phản đối tôi vẫn tiếp tục công việc này.", dis: ["まるで", "ぜひ", "きっと"] }
      ]
    },
    {
      title: "Kính ngữ · cho nhận · sai khiến bị động (luôn có trong đề)",
      desc: "Mỗi đề N3 thường có **1–2 câu kính ngữ** và **1 câu 〜てもらう/〜てくれる**. Xác định **ai làm hành động**: người trên → 尊敬語 (おっしゃる, ご覧になる); mình → 謙譲語 (伺う, 拝見する, させていただく).",
      compare: [
        ["言う", "おっしゃる (tôn kính)", "申す・申し上げる (khiêm nhường)"],
        ["見る", "ご覧になる", "拝見する"],
        ["行く・来る", "いらっしゃる・おいでになる", "参る・伺う (đến chỗ người trên)"],
        ["する", "なさる", "いたす"],
        ["もらう", "—", "いただく"],
        ["くれる", "くださる", "—"]
      ],
      head: ["Động từ", "尊敬語 (người trên làm)", "謙譲語 (mình làm)"],
      tips: [
        "**N に Vてもらう** (được N làm cho) vs **N が Vてくれる** (N làm cho mình): trợ từ **に** → もらう; **が** → くれる.",
        "**Vさせられる** (sai khiến bị động) = bị bắt phải làm: 母に野菜を食べさせられた."
      ],
      items: [
        { w: "させていただく", star: 3, form: "Vさせて + いただく", m: "xin phép được làm (khiêm nhường)", ex: "では、私[わたし]から説明[せつめい]｛させていただきます｝。", vi: "Vậy xin phép tôi được giải thích.", dis: ["なさいます", "くださいます", "させられます"] },
        { w: "～ていただけませんか", star: 3, form: "Vて + いただけませんか", m: "có thể làm giúp… được không (rất lịch sự)", ex: "すみません、この荷物[にもつ]を運[はこ]んで｛いただけません｝か。", vi: "Xin lỗi, anh có thể chuyển giúp hành lý này được không?", dis: ["さしあげません", "いたしません", "おりません"] },
        { w: "おっしゃる", star: 3, form: "言う の尊敬語", m: "nói (tôn kính – người trên nói)", ex: "先生[せんせい]が｛おっしゃった｝とおりに、毎日[まいにち]復習[ふくしゅう]しています。", vi: "Em ôn bài mỗi ngày đúng như thầy đã nói.", dis: ["申した", "伺った", "拝見した"] },
        { w: "伺う", star: 3, form: "行く・訪ねる・聞く の謙譲語", m: "đến thăm; hỏi (khiêm nhường)", ex: "明日[あした]、先生[せんせい]の研究室[けんきゅうしつ]に｛伺[うかが]って｝もよろしいでしょうか。", vi: "Ngày mai em đến phòng nghiên cứu của thầy được không ạ?", dis: ["いらっしゃって", "おいでになって", "ご覧になって"] },
        { w: "ご覧になる", star: 2, form: "見る の尊敬語", m: "xem (tôn kính)", ex: "先生[せんせい]、この写真[しゃしん]を｛ご覧[らん]になり｝ましたか。", vi: "Thưa thầy, thầy đã xem bức ảnh này chưa ạ?", dis: ["拝見し", "お見せし", "参り"] },
        { w: "拝見する", star: 2, form: "見る の謙譲語", m: "xem (khiêm nhường)", ex: "先生[せんせい]のお手紙[てがみ]、喜[よろこ]んで｛拝見[はいけん]しました｝。", vi: "Em đã đọc thư của thầy với niềm vui.", dis: ["ご覧になりました", "いらっしゃいました", "なさいました"] },
        { w: "～てもらう／～てくれる", star: 3, form: "N に Vてもらう ／ N が Vてくれる", m: "được (ai) làm cho / (ai) làm cho mình", ex: "雨[あめ]が降[ふ]っていたので、友達[ともだち]に駅[えき]まで車[くるま]で送[おく]って｛もらった｝。", vi: "Trời mưa nên tôi được bạn chở ra ga.", dis: ["くれた", "あげた", "やった"], note: "Có **友達に** → もらった. Nếu là **友達が** → くれた." },
        { w: "Vさせられる（使役受身）", star: 3, form: "Vさせ + られる（Nhóm 1: Vあ + される）", m: "bị bắt phải làm", ex: "子供[こども]のころ、母[はは]に嫌[きら]いな野菜[やさい]を食[た]べ｛させられた｝。", vi: "Hồi nhỏ tôi bị mẹ bắt ăn rau mình ghét.", dis: ["させた", "られた", "させてあげた"] }
      ]
    }
  ],
  tips: [
    { h: "Chiến thuật phần 文法 N3", li: [
      "**問題1 (chọn mẫu)**: nhìn **chữ ngay trước chỗ trống** để loại đáp án sai cách nối (Vた + とたん, Vます + そうだ/がち/ようがない, Nの + おかげで…).",
      "**問題2 (sắp xếp ★)**: ghép **cụm cố định** trước (〜に違いない, 〜わけにはいかない, 〜ば〜ほど), rồi mới xếp phần còn lại. Đánh số 1-2-3-4 trước khi tô ★.",
      "**問題3 (文章の文法)**: từ nối & chỉ thị từ (この/その), thể bị động/sai khiến – đọc cả đoạn trước & sau.",
      "Không chắc → loại theo **sắc thái**: kết quả tốt/xấu (おかげ/せい), có trách móc không (くせに), người nói chắc chắn đến đâu (はず/に違いない/らしい)."
    ] },
    { h: "Thứ tự ôn đề xuất", li: [
      "Tuần 1: nhóm ★★★ (lọc trong 📋 Bảng tóm tắt) – thuộc cách nối.",
      "Tuần 2: bảng so sánh trong từng nhóm (わけ〜, にとって/に対して, うちに/とたん/最中).",
      "Tuần 3: làm 🎯 Kiểm tra nhiều lần, ghi lại câu sai; mở trang **Ôn ngữ pháp N3** (số #STT) để xem ví dụ đầy đủ."
    ] }
  ]
};
