// Từ đồng nghĩa / nghĩa gần giống – dạng 言い換え類義 (問題4) của đề N3
// w: từ gạch chân trong đề · pair: cách nói tương đương (đáp án) · pm: nghĩa của pair
window.N3_TOPIC = {
  key: "dongnghia",
  short: "Đồng nghĩa (言い換え)",
  title: "類義語 Từ đồng nghĩa & 言い換え",
  kind: "vocab",
  synMode: true,
  pairSym: "≈",
  pairHead: ["Từ trong đề (gạch chân)", "≈ Cách nói tương đương"],
  pairQ: "Từ / cách nói gần nghĩa nhất là?",
  intro: "**問題4 言い換え類義** (5 câu): đề gạch chân 1 từ, chọn cách nói có nghĩa gần nhất. Đáp án thường là **từ dễ hơn** (Hán → thuần Nhật, Katakana → tiếng Nhật, từ khó → cụm giải thích). Học theo cặp ở bảng dưới; chạm vào dòng để xem câu ví dụ.",
  groups: [
    {
      title: "Phó từ (副詞) – nhóm hay ra nhất",
      desc: "Phó từ gần như **kỳ nào cũng có 1–2 câu**. Đáp án thường là phó từ quen thuộc hơn hoặc cụm giải thích.",
      tips: [
        "**突然 / いきなり / 急に** cùng nghĩa \"đột nhiên\" – thấy 1 từ thì 2 từ kia là đáp án.",
        "**ほぼ ≈ ほとんど ≈ だいたい** (gần như), **およそ ≈ 約 ≈ だいたい** (khoảng – đi với con số).",
        "Từ tượng thái (ぐっすり, うっかり, こっそり) thường được đổi thành **cụm giải thích** – đọc kỹ cả cụm."
      ],
      items: [
        { w: "たまに", pos: "adv", lv: "N4", m: "thỉnh thoảng", pair: "ときどき", pm: "thỉnh thoảng", ex: "週末[しゅうまつ]は｛たまに｝映画[えいが]を見[み]に行[い]きます。", vi: "Cuối tuần thỉnh thoảng tôi đi xem phim." },
        { w: "突然[とつぜん]", pos: "adv", lv: "N3", m: "đột nhiên", pair: "急[きゅう]に", pm: "đột nhiên", syn: "sudden", ex: "｛突然[とつぜん]｝部屋[へや]の電気[でんき]が消[き]えた。", vi: "Đột nhiên đèn trong phòng tắt." },
        { w: "いきなり", pos: "adv", lv: "N3", m: "bất thình lình", pair: "突然[とつぜん]", pm: "đột nhiên", syn: "sudden", ex: "知[し]らない人[ひと]に｛いきなり｝話[はな]しかけられた。", vi: "Bất thình lình bị người lạ bắt chuyện." },
        { w: "およそ", pos: "adv", lv: "N3", m: "khoảng, chừng (+ số)", pair: "だいたい", pm: "khoảng, đại khái", syn: "approx", ex: "駅[えき]まで｛およそ｝十分[じゅっぷん]かかります。", vi: "Đến ga mất khoảng 10 phút." },
        { w: "ほぼ", pos: "adv", lv: "N3", m: "gần như, hầu như", pair: "ほとんど", pm: "hầu hết, gần như", syn: "approx", ex: "工事[こうじ]は｛ほぼ｝終[お]わった。", vi: "Công trình gần như đã xong." },
        { w: "すべて", pos: "adv", lv: "N3", m: "tất cả", pair: "全部[ぜんぶ]", pm: "toàn bộ", ex: "宿題[しゅくだい]は｛すべて｝終[お]わりました。", vi: "Bài tập đã làm xong tất cả." },
        { w: "直[ただ]ちに", pos: "adv", lv: "N3", m: "ngay lập tức (văn viết)", pair: "すぐに", pm: "ngay lập tức", ex: "火事[かじ]のときは、｛直[ただ]ちに｝建物[たてもの]の外[そと]に出[で]てください。", vi: "Khi có hỏa hoạn hãy lập tức ra khỏi tòa nhà." },
        { w: "やはり", pos: "adv", lv: "N3", m: "quả nhiên, đúng như dự đoán", pair: "思[おも]ったとおり", pm: "đúng như đã nghĩ", ex: "｛やはり｝彼[かれ]は来[こ]なかった。", vi: "Quả nhiên anh ta không đến." },
        { w: "非常[ひじょう]に", pos: "adv", lv: "N3", m: "vô cùng, rất", pair: "とても", pm: "rất", ex: "今日[きょう]は｛非常[ひじょう]に｝寒[さむ]い。", vi: "Hôm nay vô cùng lạnh." },
        { w: "実[じつ]は", pos: "adv", lv: "N3", m: "thật ra là", pair: "本当[ほんとう]は", pm: "sự thật là", ex: "｛実[じつ]は｝、来月[らいげつ]結婚[けっこん]するんです。", vi: "Thật ra tháng sau tôi kết hôn." },
        { w: "再[ふたた]び", pos: "adv", lv: "N3", m: "lại, lần nữa", pair: "もう一度[いちど]", pm: "một lần nữa", ex: "いつか｛再[ふたた]び｝この町[まち]を訪[おとず]れたい。", vi: "Một ngày nào đó tôi muốn đến thăm lại thị trấn này." },
        { w: "あらかじめ", pos: "adv", lv: "N3", m: "trước, sẵn từ trước", pair: "前[まえ]もって", pm: "làm trước", ex: "会議[かいぎ]の資料[しりょう]は｛あらかじめ｝読[よ]んでおいてください。", vi: "Hãy đọc trước tài liệu cuộc họp." },
        { w: "次第[しだい]に", pos: "adv", lv: "N3", m: "dần dần", pair: "だんだん", pm: "dần dần", ex: "空[そら]が｛次第[しだい]に｝暗[くら]くなってきた。", vi: "Trời tối dần." },
        { w: "ちょうど", pos: "adv", lv: "N4", m: "vừa đúng", pair: "ぴったり", pm: "vừa khít, đúng", ex: "代金[だいきん]は｛ちょうど｝千円[せんえん]です。", vi: "Tiền hàng vừa đúng 1000 yên." },
        { w: "すっかり", pos: "adv", lv: "N3", m: "hoàn toàn, hết sạch", pair: "完全[かんぜん]に", pm: "hoàn toàn", ex: "約束[やくそく]を｛すっかり｝忘[わす]れていた。", vi: "Tôi quên béng lời hẹn." },
        { w: "ぐっすり", pos: "adv", lv: "N3", m: "(ngủ) say", pair: "よく", pm: "(ngủ) ngon", ex: "疲[つか]れていたので、昨夜[ゆうべ]は｛ぐっすり｝眠[ねむ]れた。", vi: "Vì mệt nên đêm qua tôi ngủ say." },
        { w: "うっかり", pos: "adv", lv: "N3", m: "lơ đễnh, sơ ý", pair: "不注意[ふちゅうい]で", pm: "do không chú ý", ex: "｛うっかり｝電車[でんしゃ]に傘[かさ]を忘[わす]れた。", vi: "Sơ ý để quên ô trên tàu." },
        { w: "こっそり", pos: "adv", lv: "N3", m: "lén lút", pair: "人[ひと]に知[し]られないように", pm: "để không ai biết", ex: "授業中[じゅぎょうちゅう]に｛こっそり｝お菓子[かし]を食[た]べた。", vi: "Lén ăn bánh kẹo trong giờ học." },
        { w: "しばらく", pos: "adv", lv: "N4", m: "một lúc, một thời gian", pair: "少[すこ]しの間[あいだ]", pm: "một khoảng thời gian ngắn", ex: "｛しばらく｝お待[ま]ちください。", vi: "Xin vui lòng đợi một lát." },
        { w: "さっき", pos: "adv", lv: "N4", m: "lúc nãy", pair: "少[すこ]し前[まえ]に", pm: "cách đây không lâu", ex: "｛さっき｝田中[たなか]さんから電話[でんわ]がありました。", vi: "Lúc nãy có điện thoại từ anh Tanaka." },
        { w: "ずっと", pos: "adv", lv: "N4", m: "suốt", pair: "長[なが]い間[あいだ]", pm: "trong thời gian dài", ex: "駅[えき]で一時間[いちじかん]｛ずっと｝友達[ともだち]を待[ま]っていた。", vi: "Tôi đã đợi bạn ở ga suốt một tiếng." }
      ]
    },
    {
      title: "Tính từ (形容詞)",
      desc: "Đáp án hay là **tính từ dễ hơn** hoặc **dạng phủ định của từ ngược nghĩa** (苦手 ≈ 得意ではない, 楽 ≈ 大変ではない).",
      tips: [
        "**きつい**: chật (服がきつい ≈ 小さい) / vất vả (仕事がきつい ≈ 大変). Xem danh từ đi kèm.",
        "Cấu trúc **〜ではない / 〜くない** của từ trái nghĩa là kiểu đáp án rất hay gặp."
      ],
      items: [
        { w: "きつい", pos: "i", lv: "N3", m: "chật (quần áo); vất vả", pair: "小[ちい]さい", pm: "nhỏ (→ chật)", ex: "太[ふと]ったので、このズボンは｛きつい｝。", vi: "Vì béo lên nên cái quần này bị chật." },
        { w: "賢[かしこ]い", pos: "i", lv: "N3", m: "thông minh", pair: "頭[あたま]がいい", pm: "thông minh, sáng dạ", ex: "この犬[いぬ]はとても｛賢[かしこ]い｝。", vi: "Con chó này rất khôn." },
        { w: "おとなしい", pos: "i", lv: "N3", m: "hiền, trầm tính", pair: "静[しず]か", pm: "yên lặng, trầm", ex: "あの子[こ]はとても｛おとなしい｝。", vi: "Đứa bé đó rất hiền lành, ít nói." },
        { w: "退屈[たいくつ]", pos: "na", lv: "N3", m: "chán, buồn tẻ", pair: "つまらない", pm: "chán, vô vị", ex: "この映画[えいが]は｛退屈[たいくつ]｝だった。", vi: "Bộ phim này thật tẻ nhạt." },
        { w: "不安[ふあん]", pos: "na", lv: "N3", m: "bất an, lo lắng", pair: "心配[しんぱい]", pm: "lo lắng", ex: "一人[ひとり]で外国[がいこく]へ行[い]くのは｛不安[ふあん]｝だ。", vi: "Đi nước ngoài một mình thấy bất an." },
        { w: "危険[きけん]", pos: "na", lv: "N4", m: "nguy hiểm", pair: "危[あぶ]ない", pm: "nguy hiểm", ex: "夜[よる]、一人[ひとり]で歩[ある]くのは｛危険[きけん]｝です。", vi: "Đi bộ một mình ban đêm thì nguy hiểm." },
        { w: "平気[へいき]", pos: "na", lv: "N3", m: "không sao, bình thản", pair: "大丈夫[だいじょうぶ]", pm: "không sao", ex: "少[すこ]しくらい寒[さむ]くても｛平気[へいき]｝です。", vi: "Lạnh một chút tôi cũng không sao." },
        { w: "新鮮[しんせん]", pos: "na", lv: "N3", m: "tươi", pair: "新[あたら]しい", pm: "mới, tươi", ex: "この店[みせ]の魚[さかな]はいつも｛新鮮[しんせん]｝だ。", vi: "Cá ở cửa hàng này lúc nào cũng tươi." },
        { w: "地味[じみ]", pos: "na", lv: "N3", m: "giản dị, không nổi", pair: "目立[めだ]たない", pm: "không nổi bật", ex: "彼女[かのじょ]はいつも｛地味[じみ]｝な服[ふく]を着[き]ている。", vi: "Cô ấy lúc nào cũng mặc đồ giản dị." },
        { w: "慎重[しんちょう]", pos: "na", lv: "N3", m: "thận trọng", pair: "よく注意[ちゅうい]して", pm: "chú ý kỹ", ex: "雪[ゆき]の日[ひ]は｛慎重[しんちょう]｝に運転[うんてん]してください。", vi: "Ngày tuyết rơi hãy lái xe thận trọng." },
        { w: "必死[ひっし]", pos: "na", lv: "N3", m: "liều mạng, dốc hết sức", pair: "一生懸命[いっしょうけんめい]", pm: "hết sức mình", ex: "合格[ごうかく]するために｛必死[ひっし]｝に勉強[べんきょう]した。", vi: "Tôi học dốc sức để thi đỗ." },
        { w: "不思議[ふしぎ]", pos: "na", lv: "N3", m: "kỳ lạ, khó hiểu", pair: "変[へん]", pm: "lạ", ex: "夜中[よなか]に｛不思議[ふしぎ]｝な音[おと]が聞[き]こえた。", vi: "Nửa đêm nghe thấy tiếng động lạ." },
        { w: "単純[たんじゅん]", pos: "na", lv: "N3", m: "đơn giản", pair: "簡単[かんたん]", pm: "đơn giản, dễ", ex: "この問題[もんだい]は｛単純[たんじゅん]｝だ。", vi: "Vấn đề này đơn giản." },
        { w: "苦手[にがて]", pos: "na", lv: "N4", m: "kém, không giỏi", pair: "得意[とくい]ではない", pm: "không giỏi", ex: "私[わたし]は人前[ひとまえ]で話[はな]すのが｛苦手[にがて]｝だ。", vi: "Tôi kém khoản nói trước đám đông." },
        { w: "楽[らく]", pos: "na", lv: "N3", m: "nhàn, nhẹ nhàng", pair: "大変[たいへん]ではない", pm: "không vất vả", ex: "新[あたら]しい仕事[しごと]は前[まえ]より｛楽[らく]｝だ。", vi: "Công việc mới nhàn hơn trước." },
        { w: "確[たし]か", pos: "na", lv: "N3", m: "chắc chắn, đáng tin", pair: "間違[まちが]いない", pm: "không sai", ex: "その情報[じょうほう]は｛確[たし]か｝だ。", vi: "Thông tin đó chính xác." },
        { w: "適当[てきとう]", pos: "na", lv: "N3", m: "thích hợp", pair: "ちょうどいい", pm: "vừa phải, phù hợp", ex: "｛適当[てきとう]｝な大[おお]きさの箱[はこ]を探[さが]している。", vi: "Tôi đang tìm hộp có kích cỡ phù hợp.", note: "Khẩu ngữ, 適当 còn có nghĩa \"qua loa, tùy tiện\" (適当に答える)." },
        { w: "細[こま]かい", pos: "i", lv: "N3", m: "chi tiết, tỉ mỉ", pair: "詳[くわ]しい", pm: "chi tiết, tường tận", ex: "｛細[こま]かい｝説明[せつめい]は後[あと]でします。", vi: "Giải thích chi tiết tôi sẽ nói sau." }
      ]
    },
    {
      title: "Động từ (動詞)",
      desc: "Từ Hán **〜する** hay được đổi thành **động từ thuần Nhật** (修理する ≈ 直す, 外出する ≈ 出かける) và ngược lại.",
      tips: [
        "**Hán ↔ thuần Nhật** là cặp ra nhiều nhất: 帰宅する ≈ 家に帰る, 欠席する ≈ 休む, 回復する ≈ よくなる.",
        "Từ cảm xúc tượng thái: **ほっとする ≈ 安心する**, **がっかりする ≈ 残念に思う**, **びっくりする ≈ 驚く**.",
        "**慌てて ≈ 急いで** (thể て làm trạng ngữ) – rất hay gặp."
      ],
      items: [
        { w: "驚[おどろ]く", pos: "v", lv: "N3", m: "ngạc nhiên", pair: "びっくりする", pm: "giật mình, ngạc nhiên", ex: "急[きゅう]に大[おお]きな音[おと]がして｛驚[おどろ]いた｝。", vi: "Đột nhiên có tiếng động lớn làm tôi giật mình." },
        { w: "間違[まちが]える", pos: "v", lv: "N4", m: "nhầm, sai", pair: "ミスする", pm: "mắc lỗi", ex: "計算[けいさん]を｛間違[まちが]えて｝しまった。", vi: "Tôi lỡ tính sai." },
        { w: "片付[かたづ]ける", pos: "v", lv: "N4", m: "dọn dẹp", pair: "整理[せいり]する", pm: "sắp xếp gọn gàng", ex: "机[つくえ]の上[うえ]を｛片付[かたづ]けて｝ください。", vi: "Hãy dọn dẹp mặt bàn." },
        { w: "怒[おこ]る", pos: "v", lv: "N4", m: "giận, nổi cáu", pair: "腹[はら]を立[た]てる", pm: "nổi giận", syn: "angry", ex: "約束[やくそく]を破[やぶ]ったので、友達[ともだち]が｛怒[おこ]った｝。", vi: "Vì tôi thất hứa nên bạn tôi nổi giận." },
        { w: "叱[しか]る", pos: "v", lv: "N3", m: "mắng, la rầy", pair: "注意[ちゅうい]する", pm: "nhắc nhở, khiển trách", ex: "宿題[しゅくだい]を忘[わす]れて、先生[せんせい]に｛叱[しか]られた｝。", vi: "Quên bài tập nên bị thầy mắng." },
        { w: "確[たし]かめる", pos: "v", lv: "N3", m: "xác nhận, kiểm tra", pair: "確認[かくにん]する", pm: "xác nhận", ex: "出[で]かける前[まえ]に、鍵[かぎ]を閉[し]めたか｛確[たし]かめた｝。", vi: "Trước khi ra ngoài tôi kiểm tra đã khóa cửa chưa." },
        { w: "頼[たの]む", pos: "v", lv: "N4", m: "nhờ", pair: "お願[ねが]いする", pm: "nhờ, xin", syn: "request", ex: "友達[ともだち]に引[ひ]っ越[こ]しの手伝[てつだ]いを｛頼[たの]んだ｝。", vi: "Tôi nhờ bạn giúp chuyển nhà." },
        { w: "注文[ちゅうもん]する", pos: "v", lv: "N3", m: "gọi món, đặt hàng", pair: "頼[たの]む", pm: "gọi (món)", syn: "request", ex: "レストランでカレーを｛注文[ちゅうもん]した｝。", vi: "Tôi gọi món cà ri ở nhà hàng." },
        { w: "黙[だま]る", pos: "v", lv: "N3", m: "im lặng", pair: "何[なに]も言[い]わない", pm: "không nói gì", ex: "彼[かれ]は｛黙[だま]って｝部屋[へや]を出[で]て行[い]った。", vi: "Anh ấy im lặng ra khỏi phòng." },
        { w: "謝[あやま]る", pos: "v", lv: "N4", m: "xin lỗi", pair: "わびる", pm: "tạ lỗi", ex: "遅[おく]れたことを先生[せんせい]に｛謝[あやま]った｝。", vi: "Tôi xin lỗi thầy vì đến muộn." },
        { w: "慌[あわ]てる", pos: "v", lv: "N3", m: "cuống, vội vàng", pair: "急[いそ]いで", pm: "vội vàng (làm gì)", ex: "寝坊[ねぼう]して、｛慌[あわ]てて｝家[いえ]を出[で]た。", vi: "Ngủ quên nên cuống cuồng ra khỏi nhà.", note: "Dạng hay ra: **慌てて〜する ≈ 急いで〜する**." },
        { w: "済[す]む", pos: "v", lv: "N3", m: "xong, kết thúc", pair: "終[お]わる", pm: "kết thúc", ex: "仕事[しごと]が思[おも]ったより早[はや]く｛済[す]んだ｝。", vi: "Công việc xong sớm hơn dự kiến." },
        { w: "中止[ちゅうし]する", pos: "v", lv: "N3", m: "hủy, đình chỉ", pair: "やめる", pm: "thôi, hủy", ex: "雨[あめ]のため、試合[しあい]を｛中止[ちゅうし]した｝。", vi: "Vì mưa nên đã hủy trận đấu." },
        { w: "延期[えんき]する", pos: "v", lv: "N3", m: "hoãn lại", pair: "日[ひ]にちを遅[おく]らせる", pm: "lùi ngày", ex: "台風[たいふう]で旅行[りょこう]を｛延期[えんき]した｝。", vi: "Hoãn chuyến du lịch vì bão." },
        { w: "協力[きょうりょく]する", pos: "v", lv: "N3", m: "hợp tác", pair: "力[ちから]を合[あ]わせる", pm: "chung sức", ex: "みんなで｛協力[きょうりょく]して｝パーティーの準備[じゅんび]をした。", vi: "Mọi người cùng hợp tác chuẩn bị bữa tiệc." },
        { w: "迷[まよ]う", pos: "v", lv: "N3", m: "phân vân; lạc (đường)", pair: "どうするか決[き]められない", pm: "không quyết định được", ex: "赤[あか]と青[あお]、どちらを買[か]うか｛迷[まよ]って｝いる。", vi: "Tôi đang phân vân mua cái đỏ hay xanh." },
        { w: "断[ことわ]る", pos: "v", lv: "N3", m: "từ chối", pair: "引[ひ]き受[う]けない", pm: "không nhận lời", ex: "忙[いそが]しかったので、友達[ともだち]の頼[たの]みを｛断[ことわ]った｝。", vi: "Vì bận nên tôi từ chối lời nhờ của bạn." },
        { w: "修理[しゅうり]する", pos: "v", lv: "N3", m: "sửa chữa", pair: "直[なお]す", pm: "sửa", ex: "壊[こわ]れた自転車[じてんしゃ]を｛修理[しゅうり]した｝。", vi: "Tôi sửa chiếc xe đạp hỏng." },
        { w: "外出[がいしゅつ]する", pos: "v", lv: "N3", m: "ra ngoài", pair: "出[で]かける", pm: "đi ra ngoài", ex: "父[ちち]は今[いま]、｛外出[がいしゅつ]して｝います。", vi: "Bố tôi hiện đang ra ngoài." },
        { w: "帰宅[きたく]する", pos: "v", lv: "N3", m: "về nhà", pair: "家[いえ]に帰[かえ]る", pm: "về nhà", ex: "昨日[きのう]は夜[よる]十時[じゅうじ]に｛帰宅[きたく]した｝。", vi: "Hôm qua tôi về nhà lúc 10 giờ tối." },
        { w: "回復[かいふく]する", pos: "v", lv: "N3", m: "hồi phục", pair: "よくなる", pm: "khá hơn, tốt lên", ex: "薬[くすり]を飲[の]んで、体調[たいちょう]が｛回復[かいふく]した｝。", vi: "Uống thuốc xong sức khỏe đã hồi phục." },
        { w: "欠席[けっせき]する", pos: "v", lv: "N3", m: "vắng mặt", pair: "休[やす]む", pm: "nghỉ", ex: "風邪[かぜ]で会議[かいぎ]を｛欠席[けっせき]した｝。", vi: "Tôi vắng họp vì bị cảm." },
        { w: "ほっとする", pos: "v", lv: "N3", m: "nhẹ nhõm", pair: "安心[あんしん]する", pm: "yên tâm", ex: "試験[しけん]に合格[ごうかく]して｛ほっとした｝。", vi: "Đỗ kỳ thi tôi thấy nhẹ nhõm." },
        { w: "がっかりする", pos: "v", lv: "N3", m: "thất vọng", pair: "残念[ざんねん]に思[おも]う", pm: "thấy tiếc", ex: "旅行[りょこう]が中止[ちゅうし]になって｛がっかりした｝。", vi: "Chuyến du lịch bị hủy nên tôi thất vọng." },
        { w: "増[ふ]える", pos: "v", lv: "N4", m: "tăng", pair: "多[おお]くなる", pm: "nhiều lên", ex: "最近[さいきん]、外国人[がいこくじん]の観光客[かんこうきゃく]が｛増[ふ]えた｝。", vi: "Gần đây khách du lịch nước ngoài tăng lên." }
      ]
    },
    {
      title: "Danh từ & Katakana",
      desc: "Katakana gần như luôn được đổi thành **từ tiếng Nhật tương đương** (キャンセル ≈ 取り消し, ルール ≈ 決まり) và ngược lại.",
      tips: [
        "**原因 ≈ 理由**: trong 言い換え được xem tương đương (nguyên nhân / lý do).",
        "Danh từ trừu tượng hay được giải thích bằng cụm: 用事 ≈ しなければならないこと, 欠点 ≈ 悪いところ."
      ],
      items: [
        { w: "用事[ようじ]", pos: "n", lv: "N4", m: "việc bận", pair: "しなければならないこと", pm: "việc phải làm", ex: "今日[きょう]は｛用事[ようじ]｝があるので、早[はや]く帰[かえ]ります。", vi: "Hôm nay có việc bận nên tôi về sớm." },
        { w: "原因[げんいん]", pos: "n", lv: "N3", m: "nguyên nhân", pair: "理由[りゆう]", pm: "lý do", ex: "警察[けいさつ]が事故[じこ]の｛原因[げんいん]｝を調[しら]べている。", vi: "Cảnh sát đang điều tra nguyên nhân tai nạn." },
        { w: "支度[したく]", pos: "n", lv: "N3", m: "sự chuẩn bị", pair: "準備[じゅんび]", pm: "chuẩn bị", ex: "母[はは]は夕食[ゆうしょく]の｛支度[したく]｝をしている。", vi: "Mẹ đang chuẩn bị bữa tối." },
        { w: "日程[にってい]", pos: "n", lv: "N3", m: "lịch trình", pair: "スケジュール", pm: "lịch trình", ex: "旅行[りょこう]の｛日程[にってい]｝が決[き]まった。", vi: "Lịch trình chuyến đi đã được quyết định." },
        { w: "方法[ほうほう]", pos: "n", lv: "N3", m: "phương pháp", pair: "やり方[かた]", pm: "cách làm", ex: "いい勉強[べんきょう]の｛方法[ほうほう]｝を教[おし]えてください。", vi: "Hãy chỉ cho tôi phương pháp học tốt." },
        { w: "欠点[けってん]", pos: "n", lv: "N3", m: "khuyết điểm", pair: "悪[わる]いところ", pm: "điểm xấu", ex: "誰[だれ]にでも｛欠点[けってん]｝はある。", vi: "Ai cũng có khuyết điểm." },
        { w: "長所[ちょうしょ]", pos: "n", lv: "N3", m: "ưu điểm", pair: "いいところ", pm: "điểm tốt", ex: "彼[かれ]の｛長所[ちょうしょ]｝は明[あか]るいところだ。", vi: "Ưu điểm của anh ấy là vui vẻ." },
        { w: "共通点[きょうつうてん]", pos: "n", lv: "N3", m: "điểm chung", pair: "同[おな]じところ", pm: "điểm giống nhau", ex: "二人[ふたり]には｛共通点[きょうつうてん]｝が多[おお]い。", vi: "Hai người có nhiều điểm chung." },
        { w: "機会[きかい]", pos: "n", lv: "N3", m: "cơ hội", pair: "チャンス", pm: "cơ hội", ex: "留学[りゅうがく]する｛機会[きかい]｝があった。", vi: "Tôi đã có cơ hội du học." },
        { w: "景色[けしき]", pos: "n", lv: "N4", m: "phong cảnh", pair: "眺[なが]め", pm: "cảnh nhìn ra", ex: "山[やま]の上[うえ]から見[み]る｛景色[けしき]｝はすばらしい。", vi: "Phong cảnh nhìn từ trên núi thật tuyệt." },
        { w: "家事[かじ]", pos: "n", lv: "N3", m: "việc nhà", pair: "家[いえ]の仕事[しごと]", pm: "công việc trong nhà", ex: "夫[おっと]と｛家事[かじ]｝を分担[ぶんたん]している。", vi: "Tôi chia việc nhà với chồng." },
        { w: "収入[しゅうにゅう]", pos: "n", lv: "N3", m: "thu nhập", pair: "入[はい]ってくるお金[かね]", pm: "tiền kiếm được", ex: "転職[てんしょく]して｛収入[しゅうにゅう]｝が増[ふ]えた。", vi: "Đổi việc nên thu nhập tăng." },
        { w: "キャンセル", pos: "n", lv: "N3", m: "hủy", pair: "取[と]り消[け]し", pm: "sự hủy bỏ", ex: "ホテルの予約[よやく]を｛キャンセル｝した。", vi: "Tôi đã hủy đặt phòng khách sạn." },
        { w: "ミス", pos: "n", lv: "N3", m: "lỗi", pair: "間違[まちが]い", pm: "sai sót", ex: "テストで小[ちい]さな｛ミス｝をしてしまった。", vi: "Tôi mắc lỗi nhỏ trong bài kiểm tra." },
        { w: "ルール", pos: "n", lv: "N3", m: "quy tắc", pair: "決[き]まり", pm: "quy định", ex: "ゲームの｛ルール｝を説明[せつめい]します。", vi: "Tôi sẽ giải thích luật chơi." },
        { w: "アイデア", pos: "n", lv: "N3", m: "ý tưởng", pair: "考[かんが]え", pm: "suy nghĩ, ý kiến", ex: "それはいい｛アイデア｝ですね。", vi: "Đó là ý tưởng hay đấy." },
        { w: "サイズ", pos: "n", lv: "N4", m: "kích cỡ", pair: "大[おお]きさ", pm: "độ lớn", ex: "この服[ふく]は｛サイズ｝が合[あ]わない。", vi: "Bộ quần áo này không vừa cỡ." },
        { w: "スピード", pos: "n", lv: "N3", m: "tốc độ", pair: "速[はや]さ", pm: "độ nhanh", ex: "車[くるま]の｛スピード｝を落[お]としてください。", vi: "Hãy giảm tốc độ xe." },
        { w: "アドバイス", pos: "n", lv: "N3", m: "lời khuyên", pair: "助言[じょげん]", pm: "lời khuyên", ex: "先輩[せんぱい]から｛アドバイス｝をもらった。", vi: "Tôi nhận được lời khuyên từ đàn anh." },
        { w: "トレーニング", pos: "n", lv: "N3", m: "tập luyện", pair: "練習[れんしゅう]", pm: "luyện tập", ex: "毎朝[まいあさ]、｛トレーニング｝をしている。", vi: "Sáng nào tôi cũng tập luyện." },
        { w: "プラン", pos: "n", lv: "N3", m: "kế hoạch", pair: "計画[けいかく]", pm: "kế hoạch", ex: "夏休[なつやす]みの｛プラン｝を立[た]てた。", vi: "Tôi đã lên kế hoạch cho kỳ nghỉ hè." }
      ]
    },
    {
      title: "Cụm từ & thành ngữ (慣用句)",
      desc: "Thành ngữ với **気・腹・頭・手・腕** hay được hỏi nghĩa tương đương.",
      tips: [
        "**腹が立つ / 頭にくる ≈ 怒る** – cùng nghĩa giận.",
        "Từ láy trạng thái: **くたくた ≈ とても疲れている**, **ぺこぺこ ≈ とてもお腹がすいている**, **ぺらぺら ≈ 上手に話せる**."
      ],
      items: [
        { w: "腹[はら]が立[た]つ", pos: "exp", lv: "N3", m: "bực mình, tức giận", pair: "怒[おこ]る", pm: "giận", syn: "angry", ex: "彼[かれ]の失礼[しつれい]な態度[たいど]に｛腹[はら]が立[た]った｝。", vi: "Tôi bực mình vì thái độ thất lễ của anh ta." },
        { w: "頭[あたま]にくる", pos: "exp", lv: "N3", m: "nổi điên, phát cáu", pair: "怒[おこ]る", pm: "giận", syn: "angry", ex: "何度[なんど]言[い]っても聞[き]かないので、｛頭[あたま]にきた｝。", vi: "Nói bao lần không nghe nên tôi phát cáu." },
        { w: "気[き]に入[い]る", pos: "exp", lv: "N3", m: "thích, ưng ý", pair: "好[す]きになる", pm: "trở nên thích", ex: "このかばんがとても｛気[き]に入[い]った｝。", vi: "Tôi rất ưng cái túi này." },
        { w: "気[き]をつける", pos: "exp", lv: "N4", m: "cẩn thận", pair: "注意[ちゅうい]する", pm: "chú ý", ex: "車[くるま]に｛気[き]をつけて｝ください。", vi: "Hãy cẩn thận xe cộ." },
        { w: "役[やく]に立[た]つ", pos: "exp", lv: "N3", m: "có ích", pair: "便利[べんり]", pm: "tiện lợi", ex: "この辞書[じしょ]はとても｛役[やく]に立[た]つ｝。", vi: "Cuốn từ điển này rất có ích." },
        { w: "手[て]に入[い]れる", pos: "exp", lv: "N3", m: "có được, kiếm được", pair: "自分[じぶん]のものにする", pm: "biến thành của mình", ex: "やっとコンサートのチケットを｛手[て]に入[い]れた｝。", vi: "Cuối cùng cũng kiếm được vé buổi hòa nhạc." },
        { w: "世話[せわ]をする", pos: "exp", lv: "N3", m: "chăm sóc", pair: "面倒[めんどう]を見[み]る", pm: "trông nom", ex: "旅行中[りょこうちゅう]、隣[となり]の人[ひと]が犬[いぬ]の｛世話[せわ]をして｝くれた。", vi: "Trong lúc tôi đi du lịch, hàng xóm đã chăm sóc con chó giúp." },
        { w: "首[くび]になる", pos: "exp", lv: "N3", m: "bị đuổi việc", pair: "仕事[しごと]を辞[や]めさせられる", pm: "bị cho thôi việc", ex: "遅刻[ちこく]ばかりして、会社[かいしゃ]を｛首[くび]になった｝。", vi: "Đi muộn suốt nên bị công ty đuổi việc." },
        { w: "くたくた", pos: "exp", lv: "N3", m: "mệt lả", pair: "とても疲[つか]れている", pm: "rất mệt", ex: "一日中[いちにちじゅう]歩[ある]いて、｛くたくた｝だ。", vi: "Đi bộ cả ngày nên mệt lả." },
        { w: "ぺこぺこ", pos: "exp", lv: "N3", m: "(đói) cồn cào", pair: "とてもお腹[なか]がすいている", pm: "rất đói", ex: "朝[あさ]から何[なに]も食[た]べていないので、お腹[なか]が｛ぺこぺこ｝だ。", vi: "Từ sáng chưa ăn gì nên đói cồn cào." },
        { w: "ぺらぺら", pos: "exp", lv: "N3", m: "(nói) trôi chảy", pair: "上手[じょうず]に話[はな]せる", pm: "nói giỏi", ex: "彼[かれ]は英語[えいご]が｛ぺらぺら｝だ。", vi: "Anh ấy nói tiếng Anh trôi chảy." },
        { w: "腕[うで]がいい", pos: "exp", lv: "N3", m: "tay nghề giỏi", pair: "上手[じょうず]", pm: "giỏi", ex: "あの店[みせ]のコックは｛腕[うで]がいい｝。", vi: "Đầu bếp quán đó tay nghề giỏi." }
      ]
    }
  ],
  tips: [
    { h: "Cách làm 問題4 言い換え", li: [
      "**Thay đáp án vào chỗ gạch chân rồi đọc lại cả câu** – câu phải giữ nguyên nghĩa và tự nhiên.",
      "Đáp án thường **dễ hơn** từ gốc: Hán → thuần Nhật (帰宅する → 家に帰る), Katakana → tiếng Nhật (キャンセル → 取り消し), tượng thái → cụm giải thích (うっかり → 不注意で).",
      "Cẩn thận **đáp án trái nghĩa**: 苦手 ≈ 得意**ではない** (có ではない!), đừng chọn 得意.",
      "Đáp án nhiễu hay là từ **cùng chủ đề nhưng khác nghĩa** (ほぼ ↔ すべて, しばらく ↔ さっき)."
    ] },
    { h: "Cách học", li: [
      "Bật **Che nghĩa**, nhìn cột trái và tự nói cách nói tương đương.",
      "Ôn theo nhóm → 🎯 Kiểm tra (có câu 言い換え kèm câu ví dụ giống đề).",
      "Xem thêm trang **Tính cách** và **Tần suất** – nhiều từ ở đó cũng hay ra 言い換え (おとなしい ≈ 静か, たびたび ≈ 何度も)."
    ] }
  ]
};
