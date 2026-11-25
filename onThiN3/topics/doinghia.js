// Tính từ & cặp từ đối nghĩa – N3
window.N3_TOPIC = {
  key: "doinghia",
  short: "Đối nghĩa",
  title: "対義語 Tính từ & từ đối nghĩa",
  kind: "vocab",
  // Nghĩa của các từ trái nghĩa không có mục riêng trong chủ đề
  pairMeans: {
    "冷たい": "lạnh (vật, đồ uống); lạnh lùng", "涼しい": "mát mẻ", "濃い": "đậm, đặc (vị, màu)",
    "厳しい": "nghiêm khắc", "安い": "rẻ", "低い": "thấp", "粗い": "thô, to hạt", "大まか": "đại khái, sơ lược",
    "寒い": "lạnh (thời tiết)", "遅い": "muộn (thời điểm); chậm (tốc độ)", "簡単": "đơn giản, dễ", "不利": "bất lợi",
    "貧しい": "nghèo, nghèo nàn", "抽象的": "trừu tượng", "主観的": "chủ quan", "楽": "nhàn, thoải mái",
    "得る": "có được, đạt được", "捨てる": "vứt bỏ", "反対": "phản đối", "失敗": "thất bại", "結果": "kết quả",
    "短所": "nhược điểm", "輸出": "xuất khẩu", "減少": "sự giảm sút", "現実": "hiện thực", "辛い": "cay"
  },
  intro: "Đề N3 rất thích đặt **từ trái nghĩa làm đáp án nhiễu** ở phần 文脈規定, và hỏi **1 từ có nhiều từ trái nghĩa** (薄い ↔ 厚い / 濃い). Học theo **cụm từ** (薄いコーヒー, 甘い親) thay vì học từ đơn.",
  groups: [
    {
      title: "Kích thước · độ sâu · độ sắc",
      desc: "Tính từ い mô tả hình dạng vật. Chú ý **細い** (mảnh, nhỏ – đường kính) khác **細かい** (nhỏ li ti, chi tiết).",
      items: [
        { w: "太[ふと]い", pos: "i", lv: "N4", m: "to, dày (đường kính), mập", pair: "細[ほそ]い", ex: "このペンは線[せん]が｛太[ふと]い｝ので、遠[とお]くからでもよく見[み]える。", vi: "Bút này nét đậm (to) nên nhìn từ xa cũng rõ.", dis: ["細い", "浅い", "鈍い"] },
        { w: "細[ほそ]い", pos: "i", lv: "N4", m: "mảnh, thon, nhỏ (đường kính)", pair: "太[ふと]い", ex: "彼女[かのじょ]は指[ゆび]が｛細[ほそ]く｝て長[なが]い。", vi: "Cô ấy có ngón tay thon dài.", dis: ["太い", "浅い", "粗い"] },
        { w: "厚[あつ]い", pos: "i", lv: "N4", m: "dày (độ dày)", pair: "薄[うす]い", ex: "外[そと]はとても寒[さむ]いから、｛厚[あつ]い｝コートを着[き]ていきなさい。", vi: "Bên ngoài rất lạnh, hãy mặc áo khoác dày vào.", dis: ["薄い", "濃い", "浅い"] },
        { w: "深[ふか]い", pos: "i", lv: "N3", m: "sâu", pair: "浅[あさ]い", ex: "この湖[みずうみ]は｛深[ふか]い｝ので、泳[およ]ぐのは危険[きけん]だ。", vi: "Hồ này sâu nên bơi rất nguy hiểm.", dis: ["浅い", "細い", "粗い"] },
        { w: "浅[あさ]い", pos: "i", lv: "N3", m: "nông, cạn", pair: "深[ふか]い", ex: "この川[かわ]は｛浅[あさ]い｝から、子供[こども]でも安全[あんぜん]に遊[あそ]べる。", vi: "Sông này nông nên trẻ con cũng chơi an toàn được.", dis: ["深い", "鋭い", "濃い"], note: "Nghĩa bóng: **経験が浅い** = ít kinh nghiệm." },
        { w: "鋭[するど]い", pos: "i", lv: "N3", m: "sắc, nhọn; nhạy bén (勘が鋭い)", pair: "鈍[にぶ]い", ex: "このナイフは｛鋭[するど]い｝ので、気[き]をつけて使[つか]ってください。", vi: "Con dao này sắc, hãy cẩn thận khi dùng.", dis: ["鈍い", "浅い", "粗い"] },
        { w: "鈍[にぶ]い", pos: "i", lv: "N3", m: "cùn; chậm chạp, kém nhạy", pair: "鋭[するど]い", ex: "運動神経[うんどうしんけい]が｛鈍[にぶ]く｝て、スポーツは苦手[にがて]だ。", vi: "Phản xạ vận động kém nên tôi dở thể thao.", dis: ["鋭い", "細かい", "濃い"] }
      ]
    },
    {
      title: "Cảm giác: cứng/mềm · nóng/lạnh",
      desc: "**暖かい ↔ 涼しい** (khí hậu), **温かい ↔ 冷たい** (vật, lòng người), **熱い ↔ ぬるい / 冷たい** (nhiệt độ vật).",
      items: [
        { w: "硬[かた]い", pos: "i", lv: "N3", m: "cứng (固い・堅い・硬い)", pair: "柔[やわ]らかい", ex: "このパンは古[ふる]くて｛硬[かた]く｝なってしまった。", vi: "Bánh mì này cũ nên đã bị cứng.", dis: ["柔らかい", "濃い", "鈍い"], note: "**固い** (chắc: 固い約束), **堅い** (vững, cứng nhắc: 堅い話), **硬い** (cứng vật lý: 硬い石)." },
        { w: "柔[やわ]らかい", pos: "i", lv: "N3", m: "mềm", pair: "硬[かた]い", ex: "このお肉[にく]はとても｛柔[やわ]らかく｝て、おいしい。", vi: "Miếng thịt này rất mềm và ngon.", dis: ["硬い", "鋭い", "粗い"] },
        { w: "温[あたた]かい", alt: ["ぬるい"], pos: "i", lv: "N4", m: "ấm (vật, đồ ăn, tình cảm)", pair: "冷[つめ]たい", ex: "｛温[あたた]かい｝スープを飲[の]んで、体[からだ]が温[あたた]まった。", vi: "Uống súp ấm, cơ thể ấm lên.", dis: ["冷たい", "涼しい", "ぬるい"] },
        { w: "暖[あたた]かい", alt: ["寒い"], pos: "i", lv: "N4", m: "ấm áp (thời tiết, không khí)", pair: "涼[すず]しい", ex: "春[はる]になって、｛暖[あたた]かい｝日[ひ]が続[つづ]いている。", vi: "Sang xuân, những ngày ấm áp kéo dài.", dis: ["涼しい", "冷たい", "ぬるい"] },
        { w: "ぬるい", alt: ["冷たい"], pos: "i", lv: "N3", m: "âm ấm, nguội (không đủ nóng/lạnh)", pair: "熱[あつ]い", ex: "お風呂[ふろ]が｛ぬるく｝なったので、もう一度[いちど]温[あたた]めた。", vi: "Nước tắm nguội rồi nên tôi đun lại.", dis: ["熱い", "涼しい", "鋭い"] }
      ]
    },
    {
      title: "Bẫy: 1 từ – nhiều từ trái nghĩa / cùng âm khác chữ",
      desc: "Từ trái nghĩa **phụ thuộc vào danh từ đi kèm**. Đây là kiểu bẫy hay gặp nhất ở câu hỏi đối nghĩa và 表記.",
      compare: [
        ["薄[うす]い", "本[ほん]が薄い ↔ 厚[あつ]い／味[あじ]・色[いろ]が薄い ↔ 濃[こ]い", "độ dày / độ đậm"],
        ["甘[あま]い", "味[あじ]が甘い ↔ 辛[から]い／親[おや]が甘い ↔ 厳[きび]しい", "vị / thái độ"],
        ["高[たか]い", "値段[ねだん]が高い ↔ 安[やす]い／背[せ]が高い ↔ 低[ひく]い", "giá / chiều cao"],
        ["細[こま]かい", "砂[すな]が細かい ↔ 粗[あら]い／計画[けいかく]が細かい ↔ 大[おお]まか", "hạt / mức chi tiết"],
        ["あつい", "暑[あつ]い（thời tiết）↔ 寒[さむ]い／熱[あつ]い（vật）↔ 冷[つめ]たい", "表記"],
        ["はやい", "早[はや]い（thời điểm）↔ 遅[おそ]い／速[はや]い（tốc độ）↔ 遅[おそ]い", "表記"]
      ],
      head: ["Từ", "Trái nghĩa theo ngữ cảnh", "Phân biệt theo"],
      items: [
        { w: "薄[うす]い", ctx: "薄[うす]い本[ほん]", pos: "i", lv: "N3", m: "mỏng", pair: "厚[あつ]い", ex: "この本[ほん]は｛薄[うす]い｝から、一日[いちにち]で読[よ]める。", vi: "Quyển sách này mỏng nên đọc một ngày là xong.", dis: ["厚い", "濃い", "浅い"] },
        { w: "薄[うす]い", ctx: "薄[うす]いコーヒー", pos: "i", lv: "N3", m: "nhạt, loãng (vị, màu)", pair: "濃[こ]い", ex: "このコーヒーは｛薄[うす]く｝て、水[みず]みたいだ。", vi: "Cà phê này loãng, như nước lã.", dis: ["濃い", "厚い", "細い"] },
        { w: "甘[あま]い", ctx: "甘[あま]いカレー", pos: "i", lv: "N5", m: "ngọt, không cay", pair: "辛[から]い", ex: "このカレーは｛甘[あま]い｝ので、子供[こども]でも食[た]べられる。", vi: "Món cà ri này không cay (ngọt) nên trẻ con cũng ăn được.", dis: ["辛い", "厳しい", "苦い"] },
        { w: "甘[あま]い", ctx: "子供[こども]に甘[あま]い", pos: "i", lv: "N3", m: "nuông chiều, dễ dãi", pair: "厳[きび]しい", ex: "あの親[おや]は子供[こども]に｛甘[あま]い｝から、欲[ほ]しがる物[もの]を何[なん]でも買[か]ってあげる。", vi: "Bố mẹ kia nuông chiều con, con thích gì cũng mua cho.", dis: ["厳しい", "辛い", "苦い"] },
        { w: "高[たか]い", ctx: "値段[ねだん]が高[たか]い", pos: "i", lv: "N5", m: "đắt", pair: "安[やす]い", ex: "このかばんは｛高[たか]く｝て、私[わたし]の給料[きゅうりょう]では買[か]えない。", vi: "Cái túi này đắt quá, với lương của tôi không mua nổi.", dis: ["安い", "低い", "浅い"] },
        { w: "高[たか]い", ctx: "背[せ]が高[たか]い", pos: "i", lv: "N5", m: "cao", pair: "低[ひく]い", ex: "兄[あに]は背[せ]が｛高[たか]い｝ので、バスケットボールが得意[とくい]だ。", vi: "Anh tôi cao nên chơi bóng rổ giỏi.", dis: ["低い", "安い", "長い"] },
        { w: "細[こま]かい", ctx: "細[こま]かい砂[すな]", pos: "i", lv: "N3", m: "nhỏ li ti, mịn", pair: "粗[あら]い", ex: "この砂浜[すなはま]の砂[すな]は｛細[こま]かく｝て、さらさらしている。", vi: "Cát ở bãi biển này mịn, khô và tơi.", dis: ["粗い", "鋭い", "太い"] },
        { w: "細[こま]かい", ctx: "細[こま]かい計画[けいかく]", alt: ["粗い"], pos: "i", lv: "N3", m: "chi tiết, tỉ mỉ", pair: "大[おお]まか", ex: "出発[しゅっぱつ]時間[じかん]から食事[しょくじ]の店[みせ]まで、旅行[りょこう]の予定[よてい]を｛細[こま]かく｝決[き]めた。", vi: "Từ giờ xuất phát đến quán ăn, tôi đã lên lịch trình du lịch rất chi tiết.", dis: ["大まか", "鋭い", "鈍い"] },
        { w: "暑[あつ]い", ctx: "暑[あつ]い日[ひ]", alt: ["涼しい"], pos: "i", lv: "N5", m: "nóng (thời tiết)", pair: "寒[さむ]い", ex: "今日[きょう]は｛暑[あつ]く｝て、汗[あせ]が止[と]まらない。", vi: "Hôm nay nóng quá, mồ hôi chảy không ngừng.", dis: ["寒い", "熱い", "冷たい"] },
        { w: "熱[あつ]い", ctx: "熱[あつ]いお茶[ちゃ]", alt: ["ぬるい"], pos: "i", lv: "N5", m: "nóng (vật, đồ uống)", pair: "冷[つめ]たい", ex: "お茶[ちゃ]が｛熱[あつ]い｝ので、やけどしないように気[き]をつけてください。", vi: "Trà nóng, cẩn thận kẻo bỏng.", dis: ["冷たい", "暑い", "寒い"] },
        { w: "早[はや]い", ctx: "朝[あさ]早[はや]く", pos: "i", lv: "N5", m: "sớm (thời điểm)", pair: "遅[おそ]い", ex: "明日[あした]は朝[あさ]｛早[はや]く｝出発[しゅっぱつ]するので、今日[きょう]は早[はや]く寝[ね]よう。", vi: "Mai xuất phát sớm nên hôm nay đi ngủ sớm thôi.", dis: ["速い", "遅い", "短い"] },
        { w: "速[はや]い", ctx: "速[はや]い電車[でんしゃ]", pos: "i", lv: "N4", m: "nhanh (tốc độ)", pair: "遅[おそ]い", ex: "新幹線[しんかんせん]は｛速[はや]い｝ので、東京[とうきょう]から大阪[おおさか]まで二時間[にじかん]ちょっとで着[つ]く。", vi: "Shinkansen nhanh nên từ Tokyo đến Osaka chỉ hơn 2 tiếng.", dis: ["早い", "遅い", "短い"] }
      ]
    },
    {
      title: "Tính chất sự việc (tính từ な & 〜的)",
      desc: "Nhóm từ Hán hay xuất hiện ở đọc hiểu và 文脈規定. **苦手** = kém/không thích (chủ quan, dùng được cho đồ ăn, người) ≠ **下手** = vụng về (đánh giá kỹ năng).",
      items: [
        { w: "安全[あんぜん]", pos: "na", lv: "N4", m: "an toàn", pair: "危険[きけん]", ex: "この町[まち]は夜[よる]に一人[ひとり]で歩[ある]いても｛安全[あんぜん]｝だ。", vi: "Thị trấn này đi bộ một mình ban đêm cũng an toàn.", dis: ["危険", "複雑", "派手"] },
        { w: "危険[きけん]", pos: "na", lv: "N4", m: "nguy hiểm", pair: "安全[あんぜん]", ex: "この川[かわ]は流[なが]れが速[はや]くて｛危険[きけん]｝なので、泳[およ]がないでください。", vi: "Sông này nước chảy xiết nguy hiểm, đừng bơi.", dis: ["安全", "単純", "地味"] },
        { w: "複雑[ふくざつ]", pos: "na", lv: "N3", m: "phức tạp", pair: "簡単[かんたん]・単純[たんじゅん]", ex: "この機械[きかい]は使[つか]い方[かた]が｛複雑[ふくざつ]｝で、説明書[せつめいしょ]を読[よ]まないとわからない。", vi: "Máy này cách dùng phức tạp, không đọc hướng dẫn thì không hiểu.", dis: ["簡単", "安全", "派手"] },
        { w: "単純[たんじゅん]", pos: "na", lv: "N3", m: "đơn giản, đơn thuần; (người) ngây thơ, dễ đoán", pair: "複雑[ふくざつ]", ex: "彼[かれ]は｛単純[たんじゅん]｝だから、ほめられるとすぐ機嫌[きげん]がよくなる。", vi: "Anh ấy đơn giản lắm, được khen là vui lên ngay.", dis: ["複雑", "危険", "地味"] },
        { w: "派手[はで]", pos: "na", lv: "N3", m: "lòe loẹt, sặc sỡ, phô trương", pair: "地味[じみ]", ex: "赤[あか]や金色[きんいろ]の｛派手[はで]｝な服[ふく]は、お葬式[そうしき]には向[む]かない。", vi: "Quần áo sặc sỡ đỏ, vàng kim không hợp với đám tang.", dis: ["地味", "安全", "単純"] },
        { w: "地味[じみ]", pos: "na", lv: "N3", m: "giản dị, nhã, không nổi bật", pair: "派手[はで]", ex: "面接[めんせつ]には、紺[こん]や黒[くろ]などの｛地味[じみ]｝な色[いろ]のスーツがいい。", vi: "Đi phỏng vấn nên mặc vest màu nhã như xanh đậm hay đen.", dis: ["派手", "危険", "複雑"] },
        { w: "有利[ゆうり]", pos: "na", lv: "N3", m: "có lợi", pair: "不利[ふり]", ex: "英語[えいご]ができると、就職[しゅうしょく]に｛有利[ゆうり]｝だ。", vi: "Biết tiếng Anh thì có lợi khi xin việc.", dis: ["不利", "危険", "地味"] },
        { w: "豊[ゆた]か", pos: "na", lv: "N3", m: "phong phú, giàu có, sung túc", pair: "貧[まず]しい", ex: "この国[くに]は資源[しげん]が｛豊[ゆた]か｝で、経済[けいざい]が発展[はってん]している。", vi: "Đất nước này giàu tài nguyên, kinh tế phát triển.", dis: ["貧しい", "不利", "単純"] },
        { w: "得意[とくい]", pos: "na", lv: "N4", m: "giỏi, sở trường", pair: "苦手[にがて]", ex: "私[わたし]は数学[すうがく]が｛得意[とくい]｝で、テストはいつも満点[まんてん]だ。", vi: "Tôi giỏi toán, bài kiểm tra lúc nào cũng điểm tối đa.", dis: ["苦手", "下手", "地味"] },
        { w: "苦手[にがて]", pos: "na", lv: "N4", m: "kém, không giỏi; không ưa", pair: "得意[とくい]", ex: "辛[から]いものが｛苦手[にがて]｝なので、カレーはいつも甘口[あまくち]にしている。", vi: "Tôi không ăn được đồ cay nên cà ri lúc nào cũng chọn vị ngọt.", dis: ["得意", "上手", "派手"] },
        { w: "具体的[ぐたいてき]", pos: "na", lv: "N3", m: "cụ thể", pair: "抽象的[ちゅうしょうてき]", ex: "もっと｛具体的[ぐたいてき]｝に説明[せつめい]してください。例[たと]えば、どんな問題[もんだい]がありますか。", vi: "Hãy giải thích cụ thể hơn. Ví dụ, có vấn đề gì?", dis: ["抽象的", "消極的", "派手"] },
        { w: "客観的[きゃっかんてき]", pos: "na", lv: "N2", m: "khách quan", pair: "主観的[しゅかんてき]", ex: "自分[じぶん]の気持[きも]ちではなく、｛客観的[きゃっかんてき]｝な事実[じじつ]に基[もと]づいて判断[はんだん]しなさい。", vi: "Đừng dựa vào cảm xúc mà hãy phán đoán dựa trên sự thật khách quan.", dis: ["主観的", "抽象的", "単純"] }
      ]
    },
    {
      title: "Tính từ cảm xúc hay ra N3",
      desc: "Không có cặp trái nghĩa rõ ràng nhưng **rất hay ra 文脈規定**. Nhớ theo **tình huống điển hình**.",
      compare: [
        ["悔[くや]しい", "tiếc, cay cú (thua/thất bại do mình)", "負[ま]けて悔しい"],
        ["懐[なつ]かしい", "bồi hồi nhớ lại (chuyện xưa)", "昔[むかし]の写真[しゃしん]"],
        ["羨[うらや]ましい", "ghen tị, thèm muốn (cái người khác có)", "〜が羨ましい"],
        ["もったいない", "lãng phí, tiếc của", "捨[す]てるなんて"],
        ["情[なさ]けない", "thảm hại, đáng hổ thẹn (về bản thân)", "こんなこともできない"],
        ["面倒[めんどう]くさい", "phiền phức, ngại làm", "毎日[まいにち]〜するのは"]
      ],
      head: ["Từ", "Nghĩa", "Tình huống"],
      tips: [
        "**悔しい** (cay cú vì thua) ≠ **残念** (tiếc nói chung, lịch sự) ≠ **もったいない** (tiếc của, lãng phí).",
        "**辛[つら]い** (khổ sở) và **辛[から]い** (cay) cùng chữ 辛 → đề 漢字読み rất hay hỏi."
      ],
      items: [
        { w: "悔[くや]しい", pos: "i", lv: "N3", m: "cay cú, tiếc nuối (vì thua, thất bại)", ex: "一点差[いってんさ]で負[ま]けて、本当[ほんとう]に｛悔[くや]しい｝。", vi: "Thua có 1 điểm, thật là cay cú.", dis: ["懐かしい", "羨ましい", "面倒くさい"] },
        { w: "懐[なつ]かしい", pos: "i", lv: "N3", m: "nhớ nhung, bồi hồi (chuyện cũ)", ex: "小学校[しょうがっこう]の時[とき]の写真[しゃしん]を見[み]て、とても｛懐[なつ]かしく｝なった。", vi: "Xem ảnh hồi tiểu học, tôi thấy bồi hồi nhớ lại.", dis: ["悔しい", "羨ましい", "面倒くさい"] },
        { w: "羨[うらや]ましい", pos: "i", lv: "N3", m: "ghen tị, thèm muốn", ex: "毎年[まいとし]海外旅行[かいがいりょこう]に行[い]ける友達[ともだち]が｛羨[うらや]ましい｝。", vi: "Tôi ghen tị với người bạn năm nào cũng đi du lịch nước ngoài.", dis: ["懐かしい", "恥ずかしい", "もったいない"] },
        { w: "恥[は]ずかしい", pos: "i", lv: "N4", m: "xấu hổ, ngượng", ex: "みんなの前[まえ]で転[ころ]んで、とても｛恥[は]ずかしかった｝。", vi: "Ngã trước mặt mọi người, tôi rất xấu hổ.", dis: ["羨ましい", "懐かしい", "もったいない"] },
        { w: "もったいない", pos: "i", lv: "N3", m: "lãng phí, phí của", ex: "まだ使[つか]えるのに捨[す]てるなんて、｛もったいない｝。", vi: "Vẫn còn dùng được mà vứt đi thì phí quá.", dis: ["恥ずかしい", "懐かしい", "羨ましい"] },
        { w: "情[なさ]けない", pos: "i", lv: "N2", m: "thảm hại, đáng hổ thẹn", ex: "こんな簡単[かんたん]な問題[もんだい]も解[と]けないなんて、自分[じぶん]が｛情[なさ]けない｝。", vi: "Bài dễ thế này cũng không giải được, thấy mình thật thảm hại.", dis: ["羨ましい", "懐かしい", "もったいない"] },
        { w: "面倒[めんどう]くさい", pos: "i", lv: "N3", m: "phiền phức, ngại làm", ex: "疲[つか]れているときに料理[りょうり]をするのは｛面倒[めんどう]くさい｝。", vi: "Lúc mệt mà phải nấu ăn thì thật ngại.", dis: ["懐かしい", "羨ましい", "悔しい"] },
        { w: "辛[つら]い", pos: "i", lv: "N3", m: "khổ sở, vất vả (tinh thần/thể xác)", pair: "楽[らく]", ex: "冬[ふゆ]の朝[あさ]、五時[ごじ]に起[お]きるのは｛辛[つら]い｝。", vi: "Sáng mùa đông dậy lúc 5 giờ thật khổ sở.", dis: ["もったいない", "懐かしい", "羨ましい"], note: "Cùng chữ 辛 với **辛[から]い** (cay)." },
        { w: "寂[さび]しい", pos: "i", lv: "N4", m: "cô đơn, buồn tẻ", ex: "家族[かぞく]と離[はな]れて一人[ひとり]で暮[く]らすのは｛寂[さび]しい｝。", vi: "Sống một mình xa gia đình thật cô đơn.", dis: ["もったいない", "羨ましい", "懐かしい"] }
      ]
    },
    {
      title: "Động từ & danh từ Hán đối nghĩa",
      desc: "Cặp danh từ Hán (**賛成 ↔ 反対**, **増加 ↔ 減少**…) xuất hiện dày đặc ở đọc hiểu, biểu đồ (情報検索).",
      compare: [
        ["増[ふ]える ↔ 減[へ]る", "tăng ↔ giảm (số lượng)", "増加[ぞうか] ↔ 減少[げんしょう]"],
        ["上[あ]がる ↔ 下[さ]がる", "lên ↔ xuống (giá, nhiệt độ)", "上昇[じょうしょう] ↔ 低下[ていか]・下降[かこう]"],
        ["輸出[ゆしゅつ] ↔ 輸入[ゆにゅう]", "xuất khẩu ↔ nhập khẩu", ""],
        ["長所[ちょうしょ] ↔ 短所[たんしょ]", "ưu điểm ↔ nhược điểm", "= メリット ↔ デメリット"],
        ["原因[げんいん] ↔ 結果[けっか]", "nguyên nhân ↔ kết quả", ""],
        ["理想[りそう] ↔ 現実[げんじつ]", "lý tưởng ↔ hiện thực", ""]
      ],
      head: ["Cặp", "Nghĩa", "Từ Hán tương ứng"],
      items: [
        { w: "増[ふ]える", pos: "v", lv: "N4", m: "tăng lên", pair: "減[へ]る", ex: "空港[くうこう]が新[あたら]しくなってから、外国人[がいこくじん]観光客[かんこうきゃく]が｛増[ふ]えて｝いる。", vi: "Từ khi sân bay được làm mới, khách du lịch nước ngoài đang tăng.", dis: ["減る", "下がる", "落ちる"] },
        { w: "減[へ]る", pos: "v", lv: "N4", m: "giảm đi", pair: "増[ふ]える", ex: "毎日[まいにち]運動[うんどう]して、体重[たいじゅう]が三[さん]キロ｛減[へ]った｝。", vi: "Tập thể dục mỗi ngày, tôi đã giảm 3 cân.", dis: ["増える", "高まる", "広がる"] },
        { w: "失[うしな]う", pos: "v", lv: "N3", m: "mất, đánh mất", pair: "得[え]る", ex: "彼[かれ]は事故[じこ]で家族[かぞく]を｛失[うしな]った｝。", vi: "Anh ấy mất gia đình trong tai nạn.", dis: ["得る", "増える", "減る"] },
        { w: "拾[ひろ]う", pos: "v", lv: "N4", m: "nhặt", pair: "捨[す]てる", ex: "道[みち]で財布[さいふ]を｛拾[ひろ]った｝ので、交番[こうばん]に届[とど]けた。", vi: "Nhặt được ví ngoài đường nên tôi mang nộp đồn cảnh sát.", dis: ["捨てる", "失う", "得る"] },
        { w: "賛成[さんせい]", pos: "n", lv: "N3", m: "tán thành", pair: "反対[はんたい]", ex: "私[わたし]はその意見[いけん]に｛賛成[さんせい]｝です。いい考[かんが]えだと思[おも]います。", vi: "Tôi tán thành ý kiến đó. Tôi nghĩ đó là ý hay.", dis: ["反対", "成功", "失敗"] },
        { w: "成功[せいこう]", pos: "n", lv: "N3", m: "thành công", pair: "失敗[しっぱい]", ex: "何度[なんど]も実験[じっけん]を重[かさ]ねて、ついに｛成功[せいこう]｝した。", vi: "Thử nghiệm nhiều lần, cuối cùng đã thành công.", dis: ["失敗", "賛成", "反対"] },
        { w: "原因[げんいん]", pos: "n", lv: "N3", m: "nguyên nhân", pair: "結果[けっか]", ex: "警察[けいさつ]は、なぜ事故[じこ]が起[お]きたのか、その｛原因[げんいん]｝を調[しら]べている。", vi: "Cảnh sát đang điều tra nguyên nhân vì sao tai nạn xảy ra.", dis: ["結果", "長所", "理想"] },
        { w: "長所[ちょうしょ]", pos: "n", lv: "N3", m: "ưu điểm, sở trường", pair: "短所[たんしょ]", ex: "彼[かれ]の｛長所[ちょうしょ]｝は、誰[だれ]にでも優[やさ]しいところだ。", vi: "Ưu điểm của anh ấy là tốt bụng với tất cả mọi người.", dis: ["短所", "原因", "結果"] },
        { w: "輸入[ゆにゅう]", pos: "n", lv: "N3", m: "nhập khẩu", pair: "輸出[ゆしゅつ]", ex: "日本[にほん]は石油[せきゆ]のほとんどを外国[がいこく]から｛輸入[ゆにゅう]｝している。", vi: "Nhật Bản nhập khẩu gần như toàn bộ dầu mỏ từ nước ngoài.", dis: ["輸出", "増加", "成功"] },
        { w: "増加[ぞうか]", pos: "n", lv: "N3", m: "sự gia tăng", pair: "減少[げんしょう]", ex: "高齢化[こうれいか]が進[すす]み、高齢者[こうれいしゃ]の数[かず]は年々[ねんねん]｛増加[ぞうか]｝している。", vi: "Già hóa tiến triển, số người cao tuổi tăng lên hằng năm.", dis: ["減少", "輸入", "成功"] },
        { w: "理想[りそう]", pos: "n", lv: "N3", m: "lý tưởng", pair: "現実[げんじつ]", ex: "結婚[けっこん]相手[あいて]の｛理想[りそう]｝は高[たか]いが、現実[げんじつ]はなかなか厳[きび]しい。", vi: "Hình mẫu lý tưởng về người kết hôn thì cao, nhưng thực tế khá khắc nghiệt.", dis: ["現実", "長所", "原因"] }
      ]
    }
  ],
  tips: [
    { h: "Mẹo làm bài", li: [
      "Gặp chỗ trống tính từ: **tìm danh từ đi kèm trước** (コーヒー → 濃い/薄い; 本 → 厚い/薄い) rồi mới xét nghĩa.",
      "Đáp án nhiễu thường là **từ trái nghĩa** → đọc kỹ dấu hiệu ngữ cảnh (ので, のに, から) để biết chiều nghĩa.",
      "**のに** (trái kỳ vọng) đảo chiều nghĩa: 高いのに、おいしくない. **ので / から** giữ chiều: 浅いから、安全だ.",
      "Phần 表記 hay hỏi cặp cùng âm: 暑い/熱い/厚い (あつい), 早い/速い (はやい), 硬い/固い/堅い (かたい), 温かい/暖かい (あたたかい)."
    ] },
    { h: "Chiến thuật học", li: [
      "Học theo **cụm 2 từ** (薄いコーヒー, 甘い親, 浅い経験) – đúng cách đề ra.",
      "Tự kiểm tra: bật **Che nghĩa**, nhìn từ và nói to từ trái nghĩa trước khi lật.",
      "Làm **🎯 Kiểm tra** nhiều lần – câu \"Từ trái nghĩa là?\" có ngữ cảnh trong ngoặc, đừng chọn theo phản xạ."
    ] }
  ]
};
