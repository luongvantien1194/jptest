// Từ nối câu (接続詞) – N3
window.N3_TOPIC = {
  key: "noicau",
  short: "Từ nối câu",
  title: "接続詞 Từ nối câu",
  kind: "vocab",
  intro: "Từ nối xuất hiện ở **文法 (chọn từ nối)**, **文章の文法** (điền vào đoạn văn) và là chìa khóa đọc hiểu. Bước đầu tiên luôn là xác định **quan hệ giữa 2 câu**: nguyên nhân–kết quả? trái ngược? thêm vào? giải thích? đổi chủ đề?",
  groups: [
    {
      title: "順接 – Nguyên nhân → kết quả",
      desc: "Câu trước là **lý do / tình huống**, câu sau là **kết quả / hành động**.",
      compare: [
        ["だから / ですから", "vì vậy (khẩu ngữ, sau được ý chí, mệnh lệnh)", "だから、早く寝なさい"],
        ["それで", "vì thế nên (kết quả **đã xảy ra**; không theo sau mệnh lệnh/ý chí)", "それで、学校を休んだ"],
        ["そこで", "vì vậy (nên đã làm gì để giải quyết) – sau là **hành động có chủ ý**", "そこで、〜することにした"],
        ["したがって", "do đó (văn viết, logic, toán học)", "したがって、A＞C"],
        ["すると", "thế rồi thì (làm A thì B xảy ra ngay / phát hiện)", "ボタンを押した。すると…"],
        ["その結果[けっか]", "kết quả là", "その結果、合格できた"]
      ],
      tips: [
        "**それで vs そこで**: \"困った → そこで, 〜した\" (giải pháp chủ động); \"熱があった → それで, 休んだ\" (hệ quả tự nhiên).",
        "**すると** không dùng cho ý chí của người nói ở vế sau; vế sau là điều **xảy ra / phát hiện** (ドアが開いた, 〜がいた).",
        "Câu sau là **mệnh lệnh / rủ rê** → chỉ dùng **だから** (không dùng それで / したがって)."
      ],
      items: [
        { w: "だから", pos: "conj", lv: "N5", m: "vì vậy, cho nên", syn: "therefore", ex: "外[そと]は雨[あめ]が強[つよ]い。｛だから｝、今日[きょう]の試合[しあい]は中止[ちゅうし]だ。", vi: "Ngoài trời mưa to. Vì vậy trận đấu hôm nay bị hủy.", dis: ["しかし", "ところで", "または"] },
        { w: "それで", pos: "conj", lv: "N4", m: "vì thế nên (hệ quả đã xảy ra); rồi sao nữa?", syn: "therefore", ex: "昨日[きのう]は熱[ねつ]があった。｛それで｝、学校[がっこう]を休[やす]んだ。", vi: "Hôm qua tôi bị sốt. Vì thế nên đã nghỉ học.", dis: ["ところが", "さて", "しかも"] },
        { w: "そこで", pos: "conj", lv: "N3", m: "vì vậy (nên đã làm gì để giải quyết)", ex: "駅前[えきまえ]に駐車場[ちゅうしゃじょう]がなくて、住民[じゅうみん]が困[こま]っていた。｛そこで｝、市[し]は新[あたら]しい駐車場[ちゅうしゃじょう]を作[つく]ることにした。", vi: "Trước ga không có bãi đỗ xe, người dân gặp khó khăn. Vì vậy thành phố quyết định xây bãi đỗ mới.", dis: ["ところが", "なぜなら", "または"] },
        { w: "したがって", pos: "conj", lv: "N3", m: "do đó, bởi vậy (văn viết)", syn: "therefore", ex: "AはBより大[おお]きい。BはCより大[おお]きい。｛したがって｝、AはCより大[おお]きい。", vi: "A lớn hơn B. B lớn hơn C. Do đó A lớn hơn C.", dis: ["ところが", "ところで", "それとも"] },
        { w: "すると", pos: "conj", lv: "N3", m: "thế rồi thì, liền đó", ex: "ボタンを押[お]した。｛すると｝、ドアがゆっくり開[ひら]いた。", vi: "Tôi bấm nút. Thế là cánh cửa từ từ mở ra.", dis: ["ところで", "なぜなら", "または"] },
        { w: "その結果[けっか]", pos: "conj", lv: "N3", m: "kết quả là", ex: "毎日[まいにち]三時間[さんじかん]勉強[べんきょう]した。｛その結果[けっか]｝、N3に合格[ごうかく]できた。", vi: "Tôi học 3 tiếng mỗi ngày. Kết quả là đã đỗ N3.", dis: ["ところが", "たとえば", "それとも"] }
      ]
    },
    {
      title: "逆接 – Trái ngược",
      desc: "Câu sau **trái với điều mong đợi** từ câu trước.",
      compare: [
        ["しかし / けれども / でも", "nhưng (しかし: văn viết; でも: khẩu ngữ)", "trung tính"],
        ["ところが", "thế nhưng (kết quả **bất ngờ**, trái dự đoán) – vế sau là sự thật, không dùng ý chí", "〜と思っていた。ところが…"],
        ["それなのに", "vậy mà (kèm **bất mãn, tiếc nuối**)", "あんなに頑張った。それなのに…"],
        ["それでも", "dù vậy vẫn (giữ nguyên hành động/ý định)", "止められた。それでも…"]
      ],
      tips: [
        "**ところが**: người nói **bất ngờ** – vế trước hay có 〜と思った / 〜はずだった / 予報では〜.",
        "**それなのに** mang cảm xúc bất mãn: \"vậy mà…!\". **それでも** = dù thế vẫn (ý chí kiên trì).",
        "Đáp án nhiễu kinh điển của nhóm này là **だから / そのうえ** – kiểm tra chiều nghĩa của 2 câu."
      ],
      items: [
        { w: "しかし", pos: "conj", lv: "N4", m: "nhưng, tuy nhiên", syn: "but", ex: "この店[みせ]の料理[りょうり]はおいしい。｛しかし｝、値段[ねだん]が高[たか]すぎる。", vi: "Đồ ăn quán này ngon. Nhưng giá đắt quá.", dis: ["だから", "そのうえ", "すると"] },
        { w: "でも", pos: "conj", lv: "N5", m: "nhưng (khẩu ngữ)", syn: "but", ex: "旅行[りょこう]に行[い]きたい。｛でも｝、休[やす]みが取[と]れない。", vi: "Muốn đi du lịch. Nhưng không xin nghỉ được.", dis: ["だから", "それに", "すると"] },
        { w: "ところが", pos: "conj", lv: "N3", m: "thế nhưng (bất ngờ, trái dự đoán)", ex: "天気予報[てんきよほう]では晴[は]れだと言[い]っていた。｛ところが｝、午後[ごご]から大雨[おおあめ]になった。", vi: "Dự báo nói trời nắng. Thế nhưng từ chiều lại mưa to.", dis: ["だから", "そこで", "それに"] },
        { w: "それなのに", pos: "conj", lv: "N3", m: "vậy mà (bất mãn)", ex: "あんなに一生懸命[いっしょうけんめい]練習[れんしゅう]した。｛それなのに｝、試合[しあい]に負[ま]けてしまった。", vi: "Đã luyện tập chăm chỉ đến thế. Vậy mà vẫn thua.", dis: ["だから", "そのうえ", "すると"] },
        { w: "それでも", pos: "conj", lv: "N3", m: "dù vậy vẫn", ex: "医者[いしゃ]に何度[なんど]も注意[ちゅうい]された。｛それでも｝、彼[かれ]はたばこをやめなかった。", vi: "Bị bác sĩ nhắc nhiều lần. Dù vậy anh ta vẫn không bỏ thuốc.", dis: ["だから", "そこで", "すると"] }
      ]
    },
    {
      title: "添加 – Thêm vào (cùng chiều)",
      desc: "Câu sau **bổ sung thêm** thông tin **cùng chiều** (tốt + tốt, xấu + xấu).",
      tips: [
        "**そのうえ / しかも / それに** đều = \"hơn nữa\". **しかも** nhấn mạnh điều bất ngờ hơn; **それに** khẩu ngữ, hay đi với 〜し.",
        "Nếu 2 câu **trái chiều** (tốt + xấu) thì KHÔNG dùng nhóm này → dùng しかし / ただし.",
        "**さらに** = hơn nữa, thêm nữa (mức độ tăng); **また** = ngoài ra, đồng thời (liệt kê ngang hàng)."
      ],
      items: [
        { w: "そのうえ", pos: "conj", lv: "N3", m: "hơn nữa, thêm vào đó", syn: "moreover", ex: "この部屋[へや]は広[ひろ]くて明[あか]るい。｛そのうえ｝、家賃[やちん]も安[やす]い。", vi: "Phòng này rộng và sáng. Hơn nữa tiền thuê còn rẻ.", dis: ["しかし", "ところが", "それとも"] },
        { w: "それに", pos: "conj", lv: "N4", m: "thêm nữa, vả lại (khẩu ngữ)", syn: "moreover", ex: "今日[きょう]は雨[あめ]だし、｛それに｝風[かぜ]も強[つよ]い。出[で]かけるのはやめよう。", vi: "Hôm nay mưa, vả lại gió cũng mạnh. Thôi đừng đi ra ngoài.", dis: ["ところが", "それとも", "なぜなら"] },
        { w: "しかも", pos: "conj", lv: "N3", m: "hơn thế nữa, mà lại còn", syn: "moreover", ex: "彼女[かのじょ]は頭[あたま]がいい。｛しかも｝、スポーツも得意[とくい]だ。", vi: "Cô ấy thông minh. Mà lại còn giỏi thể thao.", dis: ["ところが", "それとも", "そこで"] },
        { w: "さらに", pos: "conj", lv: "N3", m: "hơn nữa, thêm nữa", syn: "moreover", ex: "雨[あめ]が強[つよ]くなってきた。｛さらに｝、雷[かみなり]も鳴[な]り始[はじ]めた。", vi: "Mưa nặng hạt hơn. Thêm nữa sấm cũng bắt đầu rền.", dis: ["ところで", "それとも", "なぜなら"] },
        { w: "また", pos: "conj", lv: "N4", m: "ngoài ra, đồng thời", ex: "この町[まち]は自然[しぜん]が豊[ゆた]かだ。｛また｝、歴史[れきし]のある建物[たてもの]も多[おお]い。", vi: "Thị trấn này thiên nhiên phong phú. Ngoài ra còn nhiều công trình lịch sử.", dis: ["ところが", "それとも", "すると"] }
      ]
    },
    {
      title: "対比・選択 – Đối chiếu, lựa chọn",
      desc: "So sánh 2 mặt (**一方 / それに対して**) hoặc chọn 1 trong 2 (**または / それとも / あるいは**).",
      tips: [
        "**それとも** chỉ dùng trong **câu hỏi** lựa chọn: 〜ますか。それとも〜ますか。",
        "**または / あるいは** dùng trong câu trần thuật, hướng dẫn: 郵送またはメールで.",
        "**一方** cũng là ngữ pháp: 〜一方だ (ngày càng) – đừng nhầm với 一方 (mặt khác)."
      ],
      items: [
        { w: "一方[いっぽう]", pos: "conj", lv: "N3", m: "mặt khác, trong khi đó", syn: "contrast", ex: "都会[とかい]は便利[べんり]だ。｛一方[いっぽう]｝、田舎[いなか]は自然[しぜん]が豊[ゆた]かだ。", vi: "Thành phố thì tiện lợi. Mặt khác nông thôn thiên nhiên phong phú.", dis: ["だから", "すると", "それとも"] },
        { w: "それに対[たい]して", pos: "conj", lv: "N3", m: "trái lại, ngược lại", syn: "contrast", ex: "兄[あに]は外[そと]で遊[あそ]ぶのが好[す]きだ。｛それに対[たい]して｝、弟[おとうと]は家[いえ]で本[ほん]を読[よ]むのが好[す]きだ。", vi: "Anh thích chơi ngoài trời. Trái lại em thích ở nhà đọc sách.", dis: ["だから", "すると", "そこで"] },
        { w: "または", pos: "conj", lv: "N3", m: "hoặc (văn viết)", syn: "or", ex: "申込書[もうしこみしょ]は、郵送[ゆうそう]｛または｝メールで送[おく]ってください。", vi: "Đơn đăng ký hãy gửi qua bưu điện hoặc email.", dis: ["しかし", "だから", "すると"] },
        { w: "それとも", pos: "conj", lv: "N4", m: "hay là (câu hỏi lựa chọn)", ex: "コーヒーにしますか。｛それとも｝、紅茶[こうちゃ]にしますか。", vi: "Anh dùng cà phê? Hay là trà?", dis: ["しかも", "だから", "すると"] },
        { w: "あるいは", pos: "conj", lv: "N3", m: "hoặc là (văn viết)", syn: "or", ex: "雨[あめ]の日[ひ]は、バス｛あるいは｝タクシーで来[き]てください。", vi: "Ngày mưa hãy đến bằng xe buýt hoặc taxi.", dis: ["しかし", "だから", "すると"] }
      ]
    },
    {
      title: "説明・補足 – Giải thích, ví dụ, bổ sung",
      desc: "Câu sau **giải thích lý do** (なぜなら), **nói lại** (つまり), **ví dụ** (たとえば) hoặc **thêm điều kiện / lưu ý** (ただし, なお).",
      compare: [
        ["なぜなら / というのは", "bởi vì (đuôi câu sau: **〜からだ / 〜のだ**)", "なぜなら〜からだ"],
        ["つまり", "tức là, nói cách khác", "母の兄、つまりおじ"],
        ["たとえば", "ví dụ như", "たとえば〜など"],
        ["ただし", "tuy nhiên (điều kiện, ngoại lệ cho câu trước)", "〜てもいい。ただし〜"],
        ["なお", "ngoài ra, xin lưu ý thêm (thông báo)", "なお、〜てください"]
      ],
      tips: [
        "Thấy cuối câu sau có **〜からだ / 〜からです** → gần như chắc chắn là **なぜなら / というのは**.",
        "**ただし** giới hạn lại điều vừa cho phép (\"được, nhưng…\"); **なお** chỉ thêm thông tin phụ, không giới hạn."
      ],
      items: [
        { w: "なぜなら", pos: "conj", lv: "N3", m: "bởi vì (〜からだ)", syn: "because", ex: "今日[きょう]は早[はや]く帰[かえ]ります。｛なぜなら｝、子供[こども]の誕生日[たんじょうび]だからです。", vi: "Hôm nay tôi về sớm. Bởi vì là sinh nhật con tôi.", dis: ["だから", "すると", "それとも"] },
        { w: "というのは", pos: "conj", lv: "N3", m: "lý do là (〜からだ / 〜のだ)", syn: "because", ex: "明日[あした]の会議[かいぎ]には出[で]られません。｛というのは｝、急[きゅう]に出張[しゅっちょう]が入[はい]ってしまったんです。", vi: "Tôi không dự cuộc họp ngày mai được. Lý do là đột nhiên có chuyến công tác.", dis: ["したがって", "すると", "それとも"] },
        { w: "つまり", pos: "conj", lv: "N3", m: "tức là, nói cách khác", ex: "彼[かれ]は母[はは]の兄[あに]、｛つまり｝私[わたし]のおじです。", vi: "Ông ấy là anh trai của mẹ tôi, tức là cậu tôi.", dis: ["しかし", "それとも", "ところで"] },
        { w: "たとえば", pos: "conj", lv: "N4", m: "ví dụ như", ex: "日本[にほん]には、｛たとえば｝すしや天[てん]ぷらなど、有名[ゆうめい]な料理[りょうり]がたくさんある。", vi: "Nhật Bản có nhiều món nổi tiếng, ví dụ như sushi, tempura.", dis: ["しかし", "それとも", "すると"] },
        { w: "ただし", pos: "conj", lv: "N3", m: "tuy nhiên, có điều (điều kiện kèm theo)", ex: "この部屋[へや]は自由[じゆう]に使[つか]ってもいいです。｛ただし｝、たばこは吸[す]わないでください。", vi: "Phòng này dùng thoải mái. Có điều đừng hút thuốc.", dis: ["だから", "そのうえ", "すると"] },
        { w: "なお", pos: "conj", lv: "N3", m: "ngoài ra, xin lưu ý (thông báo)", ex: "会議[かいぎ]は三時[さんじ]からです。｛なお｝、資料[しりょう]は各自[かくじ]で印刷[いんさつ]してきてください。", vi: "Cuộc họp bắt đầu từ 3 giờ. Ngoài ra, tài liệu xin mọi người tự in mang theo.", dis: ["ところが", "それとも", "すると"] }
      ]
    },
    {
      title: "転換 – Chuyển chủ đề",
      desc: "Chuyển sang **chủ đề mới** (ところで) hoặc **bước tiếp theo** (さて, では).",
      tips: [
        "**ところで** = nhân tiện, à này (chủ đề khác hẳn). Khác **ところが** (thế nhưng – trái ngược)! Cặp này hay bị đánh tráo.",
        "**さて / では / それでは** dùng khi chuyển sang phần tiếp theo của bài nói, cuộc họp."
      ],
      items: [
        { w: "ところで", pos: "conj", lv: "N4", m: "nhân tiện, à này (đổi chủ đề)", ex: "今日[きょう]は暑[あつ]いですね。｛ところで｝、来週[らいしゅう]の旅行[りょこう]の件[けん]ですが…", vi: "Hôm nay nóng nhỉ. À này, về chuyến du lịch tuần sau thì…", dis: ["だから", "それとも", "しかも"] },
        { w: "さて", pos: "conj", lv: "N3", m: "nào, thế thì (chuyển sang việc tiếp theo)", syn: "now", ex: "皆[みな]さん、そろったようですね。｛さて｝、そろそろ会議[かいぎ]を始[はじ]めましょう。", vi: "Mọi người đã đủ rồi nhỉ. Nào, chúng ta bắt đầu họp thôi.", dis: ["しかし", "それとも", "なぜなら"] },
        { w: "では", pos: "conj", lv: "N5", m: "vậy thì, thế thì", syn: "now", ex: "時間[じかん]になりました。｛では｝、試験[しけん]を始[はじ]めてください。", vi: "Đã đến giờ. Vậy thì, mời các bạn bắt đầu làm bài.", dis: ["しかし", "それとも", "なぜなら"] }
      ]
    }
  ],
  tips: [
    { h: "Quy trình 3 bước chọn từ nối", li: [
      "**1. Đọc câu trước và câu sau, bỏ qua chỗ trống** → xác định quan hệ: kết quả / trái ngược / thêm / giải thích / đổi chủ đề.",
      "**2. Loại các nhóm sai quan hệ** – thường loại được 2 đáp án ngay.",
      "**3. Phân biệt trong nhóm bằng đuôi câu**: mệnh lệnh → だから; 〜からだ → なぜなら; câu hỏi → それとも; kết quả bất ngờ → ところが; giải pháp chủ động → そこで."
    ] },
    { h: "Các cặp hay bị đánh tráo", li: [
      "**ところが (thế nhưng) ↔ ところで (à này)** – chỉ khác 1 chữ!",
      "**それで (hệ quả) ↔ そこで (giải pháp)**.",
      "**それとも (câu hỏi) ↔ または (trần thuật)**.",
      "**ただし (giới hạn) ↔ なお (bổ sung)**.",
      "**それなのに (bất mãn) ↔ それでも (vẫn kiên trì)**."
    ] },
    { h: "Mẹo đọc hiểu", li: [
      "Sau **しかし / ところが / つまり** thường là **ý chính** của tác giả → câu hỏi \"筆者の言いたいことは？\" hay nằm ở đây.",
      "**たとえば** mở ra ví dụ – ý chính nằm **trước** nó."
    ] }
  ]
};
