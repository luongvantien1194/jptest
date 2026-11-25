// Từ vựng chỉ tính cách – N3 (kèm từ N4/N5 & vài từ N2 hay gặp trong đề đọc hiểu)
window.N3_TOPIC = {
  key: "tinhcach",
  short: "Tính cách",
  title: "性格 Từ vựng tính cách",
  kind: "vocab",
  // Nghĩa của các từ trái nghĩa không có mục riêng trong chủ đề
  pairMeans: {
    "暗い": "u ám, trầm (tính cách)", "不親切": "không tử tế, thiếu nhiệt tình", "嘘つき": "kẻ nói dối",
    "うるさい": "ồn ào, lắm lời", "騒がしい": "ồn ào, náo động", "激しい": "dữ dội, nóng nảy",
    "雑": "cẩu thả, qua loa", "愚か": "ngu ngốc, dại dột", "温かい": "ấm áp, tốt bụng (người)",
    "勇敢": "dũng cảm", "大胆": "táo bạo, gan dạ", "後ろ向き": "tiêu cực, thụt lùi (suy nghĩ)", "悲観的": "bi quan"
  },
  intro: "Từ tính cách xuất hiện nhiều ở **文脈規定** (điền từ theo ngữ cảnh), **言い換え類義** (chọn từ gần nghĩa) và **用法** (chọn câu dùng đúng). Học theo **cặp trái nghĩa** và để ý **trợ từ / cấu trúc đi kèm** (〜に厳しい, 気が〜, 〜っぽい).",
  groups: [
    {
      title: "Tính cách tốt (thường gặp nhất)",
      desc: "Nhóm từ khen. Trong đề 言い換え hay hỏi: **まじめ ≈ 一生懸命・きちんとしている**, **おとなしい ≈ 静か**, **素直 ≈ 人の言うことをよく聞く**.",
      tips: [
        "**優[やさ]しい** (hiền, tốt bụng) ≠ **易[やさ]しい** (dễ) – cùng cách đọc, khác kanji → hay ra ở phần 表記.",
        "**おとなしい** là \"hiền, ít nói, trật tự\" – không phải \"người lớn\" (大人[おとな]).",
        "**素直[すなお]** có 2 nghĩa: ngoan, biết nghe lời / thẳng thắn, không vòng vo (素直に謝[あやま]る)."
      ],
      items: [
        { w: "明[あか]るい", pos: "i", lv: "N5", m: "vui vẻ, cởi mở (tính cách)", pair: "暗[くら]い", ex: "彼女[かのじょ]はいつも｛明[あか]るく｝て、クラスの人気者[にんきもの]だ。", vi: "Cô ấy lúc nào cũng vui vẻ, là người được yêu mến trong lớp." },
        { w: "優[やさ]しい", alt: ["冷たい", "意地悪"], pos: "i", lv: "N4", m: "hiền, dịu dàng, tốt bụng", pair: "厳[きび]しい", ex: "祖母[そぼ]はいつも孫[まご]に｛優[やさ]しい｝。", vi: "Bà lúc nào cũng hiền với các cháu." },
        { w: "親切[しんせつ]", alt: ["意地悪", "冷たい"], pos: "na", lv: "N4", m: "tử tế, nhiệt tình giúp đỡ", pair: "不親切[ふしんせつ]", ex: "道[みち]に迷[まよ]ったとき、｛親切[しんせつ]｝な人[ひと]が駅[えき]まで案内[あんない]してくれた。", vi: "Khi lạc đường, một người tử tế đã dẫn tôi đến tận ga." },
        { w: "真面目[まじめ]", alt: ["だらしない", "大雑把"], pos: "na", lv: "N4", m: "nghiêm túc, chăm chỉ, đứng đắn", pair: "いい加減[かげん]", syn: "majime", ex: "彼[かれ]は｛真面目[まじめ]｝な学生[がくせい]で、一度[いちど]も授業[じゅぎょう]を休[やす]んだことがない。", vi: "Cậu ấy là sinh viên nghiêm túc, chưa nghỉ học buổi nào." },
        { w: "正直[しょうじき]", pos: "na", lv: "N3", m: "thật thà, trung thực", pair: "嘘[うそ]つき", ex: "｛正直[しょうじき]｝に話[はな]してくれれば、怒[おこ]らないよ。", vi: "Nếu con nói thật thì mẹ sẽ không giận đâu.", note: "**正直に言うと** = thú thật thì…" },
        { w: "素直[すなお]", pos: "na", lv: "N3", m: "ngoan, biết nghe lời; thẳng thắn", pair: "頑固[がんこ]", ex: "自分[じぶん]が悪[わる]いと思[おも]ったら、｛素直[すなお]｝に謝[あやま]りなさい。", vi: "Nếu thấy mình sai thì hãy thành thật xin lỗi." },
        { w: "大人[おとな]しい", pos: "i", lv: "N3", m: "hiền lành, ít nói, trầm tính", pair: "うるさい・騒[さわ]がしい", ex: "弟[おとうと]は｛大人[おとな]しく｝て、知[し]らない人[ひと]の前[まえ]ではほとんど話[はな]さない。", vi: "Em trai tôi trầm tính, trước người lạ hầu như không nói gì." },
        { w: "穏[おだ]やか", alt: ["短気", "乱暴", "気が短い"], pos: "na", lv: "N3", m: "điềm đạm, ôn hòa (người); êm (biển, thời tiết)", pair: "激[はげ]しい", ex: "父[ちち]は｛穏[おだ]やか｝な性格[せいかく]で、怒[おこ]ったところを見[み]たことがない。", vi: "Bố tôi tính điềm đạm, tôi chưa từng thấy ông nổi giận." },
        { w: "落[お]ち着[つ]いた", pos: "v", lv: "N3", m: "điềm tĩnh, chững chạc (落ち着いている)", pair: "そそっかしい", ex: "彼[かれ]は若[わか]いのに、とても｛落[お]ち着[つ]いて｝いる。", vi: "Cậu ấy còn trẻ mà rất điềm tĩnh, chững chạc." },
        { w: "丁寧[ていねい]", alt: ["いい加減", "大雑把"], pos: "na", lv: "N4", m: "lịch sự; cẩn thận, kỹ lưỡng", pair: "乱暴[らんぼう]・雑[ざつ]", ex: "店員[てんいん]が｛丁寧[ていねい]｝に説明[せつめい]してくれた。", vi: "Nhân viên cửa hàng đã giải thích cho tôi rất cẩn thận, lịch sự." },
        { w: "熱心[ねっしん]", pos: "na", lv: "N3", m: "nhiệt tình, say mê, hăng hái", ex: "田中[たなか]先生[せんせい]は｛熱心[ねっしん]｝に教[おし]えてくれるので、学生[がくせい]に人気[にんき]がある。", vi: "Thầy Tanaka dạy rất nhiệt tình nên được sinh viên yêu thích." },
        { w: "賢[かしこ]い", pos: "i", lv: "N3", m: "thông minh, khôn ngoan", pair: "愚[おろ]か", ex: "この犬[いぬ]はとても｛賢[かしこ]く｝て、人[ひと]の言葉[ことば]がわかるようだ。", vi: "Con chó này rất khôn, có vẻ hiểu được tiếng người." },
        { w: "我慢強[がまんづよ]い", pos: "i", lv: "N3", m: "kiên nhẫn, giỏi chịu đựng", ex: "彼女[かのじょ]は｛我慢強[がまんづよ]く｝、痛[いた]くても文句[もんく]を言[い]わない。", vi: "Cô ấy rất giỏi chịu đựng, đau cũng không than." },
        { w: "頼[たの]もしい", pos: "i", lv: "N2", m: "đáng tin cậy, có thể trông cậy", ex: "困[こま]ったときにすぐ助[たす]けてくれる、｛頼[たの]もしい｝先輩[せんぱい]だ。", vi: "Là đàn anh đáng tin cậy, lúc khó khăn luôn giúp ngay." },
        { w: "謙虚[けんきょ]", pos: "na", lv: "N2", m: "khiêm tốn", pair: "生意気[なまいき]・偉[えら]そう", ex: "彼[かれ]は優勝[ゆうしょう]しても自慢[じまん]せず、いつも｛謙虚[けんきょ]｝だ。", vi: "Anh ấy dù vô địch cũng không khoe khoang, luôn khiêm tốn." }
      ]
    },
    {
      title: "Tính cách xấu",
      desc: "Nhóm từ chê – rất hay làm **đáp án nhiễu** cho nhóm tốt. Chú ý sắc thái: **わがまま** (chỉ theo ý mình), **頑固** (cố chấp không đổi ý), **生意気** (xấc, ra vẻ dù ít tuổi/ít kinh nghiệm).",
      tips: [
        "**いい加減[かげん]**: cẩu thả, tắc trách (người) – nhưng **いい加減にしなさい!** = \"thôi đủ rồi đấy!\".",
        "**だらしない**: luộm thuộm (quần áo, phòng, giờ giấc) ↔ **きちんとしている / 几帳面[きちょうめん]**.",
        "**厳[きび]しい** dùng **人に厳しい / 自分に厳しい**; **甘[あま]い** dùng **子供に甘い** (nuông chiều)."
      ],
      items: [
        { w: "わがまま", pos: "na", lv: "N3", m: "ích kỷ, bướng, chỉ làm theo ý mình", syn: "wagamama", ex: "ほしい物[もの]を全部[ぜんぶ]買[か]ってもらえると思[おも]うなんて、｛わがまま｝な子[こ]だ。", vi: "Nghĩ rằng cái gì muốn cũng được mua cho thì đúng là đứa trẻ bướng bỉnh, ích kỷ." },
        { w: "自分勝手[じぶんかって]", pos: "na", lv: "N3", m: "tự tiện, chỉ biết mình", syn: "wagamama", ex: "相談[そうだん]もしないで決[き]めるなんて、｛自分勝手[じぶんかって]｝だ。", vi: "Không bàn bạc gì mà tự quyết thì thật tự tiện." },
        { w: "頑固[がんこ]", pos: "na", lv: "N3", m: "cứng đầu, cố chấp", pair: "素直[すなお]", ex: "祖父[そふ]は｛頑固[がんこ]｝で、一度[いちど]決[き]めたら絶対[ぜったい]に考[かんが]えを変[か]えない。", vi: "Ông tôi cứng đầu, đã quyết rồi thì nhất định không đổi ý." },
        { w: "生意気[なまいき]", pos: "na", lv: "N3", m: "xấc xược, láo, ra vẻ ta đây", pair: "謙虚[けんきょ]", syn: "erasou", ex: "新入社員[しんにゅうしゃいん]なのに先輩[せんぱい]に命令[めいれい]するなんて、｛生意気[なまいき]｝だ。", vi: "Là nhân viên mới mà ra lệnh cho đàn anh thì thật láo." },
        { w: "偉[えら]そう", pos: "na", lv: "N3", m: "ra vẻ ta đây, hách dịch", syn: "erasou", ex: "部長[ぶちょう]はいつも｛偉[えら]そう｝な態度[たいど]で話[はな]す。", vi: "Trưởng phòng lúc nào cũng nói chuyện với thái độ hách dịch." },
        { w: "意地悪[いじわる]", alt: ["優しい"], pos: "na", lv: "N3", m: "xấu tính, hay chơi xấu, trêu chọc", pair: "親切[しんせつ]", ex: "妹[いもうと]のおもちゃを隠[かく]すような｛意地悪[いじわる]｝をしてはいけない。", vi: "Không được chơi xấu kiểu giấu đồ chơi của em gái." },
        { w: "いい加減[かげん]", alt: ["几帳面", "丁寧"], pos: "na", lv: "N3", m: "cẩu thả, tắc trách, qua loa", pair: "真面目[まじめ]", ex: "彼[かれ]は仕事[しごと]が｛いい加減[かげん]｝で、ミスが多[おお]い。", vi: "Anh ta làm việc cẩu thả nên hay sai sót." },
        { w: "だらしない", alt: ["真面目"], pos: "i", lv: "N3", m: "luộm thuộm, bừa bộn, thiếu nề nếp", pair: "几帳面[きちょうめん]", ex: "部屋[へや]が散[ち]らかっていて、服[ふく]も脱[ぬ]ぎっぱなし。本当[ほんとう]に｛だらしない｝。", vi: "Phòng bừa bộn, quần áo cởi ra vứt đó. Thật luộm thuộm." },
        { w: "乱暴[らんぼう]", alt: ["穏やか", "優しい"], pos: "na", lv: "N3", m: "thô bạo, cục cằn", pair: "丁寧[ていねい]", ex: "ドアを｛乱暴[らんぼう]｝に閉[し]めないでください。", vi: "Đừng đóng cửa mạnh tay (thô bạo) như thế." },
        { w: "けち", pos: "na", lv: "N3", m: "keo kiệt, bủn xỉn", pair: "気前[きまえ]がいい", ex: "百円[ひゃくえん]も貸[か]してくれないなんて、｛けち｝だなあ。", vi: "100 yên cũng không cho mượn, keo thật." },
        { w: "冷[つめ]たい", alt: ["優しい", "親切"], pos: "i", lv: "N5", m: "lạnh lùng, vô tình (người)", pair: "温[あたた]かい", ex: "困[こま]っている人[ひと]を無視[むし]するなんて、｛冷[つめ]たい｝人[ひと]だ。", vi: "Phớt lờ người đang gặp khó khăn, đúng là người lạnh lùng." },
        { w: "厳[きび]しい", alt: ["優しい", "甘い"], pos: "i", lv: "N4", m: "nghiêm khắc", pair: "甘[あま]い", ex: "うちの父[ちち]は時間[じかん]に｛厳[きび]しく｝て、門限[もんげん]は九時[くじ]だ。", vi: "Bố tôi nghiêm khắc về giờ giấc, giờ giới nghiêm là 9h." },
        { w: "甘[あま]い", pos: "i", lv: "N4", m: "dễ dãi, nuông chiều (〜に甘い)", pair: "厳[きび]しい", ex: "おじいさんは孫[まご]に｛甘[あま]く｝て、何[なん]でも買[か]ってあげる。", vi: "Ông nuông chiều cháu, cái gì cũng mua cho." },
        { w: "臆病[おくびょう]", pos: "na", lv: "N2", m: "nhát gan", pair: "勇敢[ゆうかん]・大胆[だいたん]", syn: "coward", ex: "うちの犬[いぬ]は｛臆病[おくびょう]｝で、小[ちい]さな音[おと]にもびっくりする。", vi: "Con chó nhà tôi nhát gan, tiếng động nhỏ cũng giật mình." },
        { w: "図々[ずうずう]しい", pos: "i", lv: "N2", m: "trơ trẽn, mặt dày", ex: "毎日[まいにち]ただでご飯[はん]を食[た]べに来[く]るなんて、｛図々[ずうずう]しい｝人[ひと]だ。", vi: "Ngày nào cũng đến ăn chực, thật mặt dày." },
        { w: "そそっかしい", pos: "i", lv: "N2", m: "hấp tấp, đoảng, hay sơ suất", pair: "落[お]ち着[つ]いた", ex: "左右[さゆう]違[ちが]う靴[くつ]を履[は]いてくるなんて、｛そそっかしい｝ね。", vi: "Đi hai chiếc giày khác nhau đến, đoảng thật đấy." }
      ]
    },
    {
      title: "Thành ngữ với 気[き] – rất hay ra thi",
      desc: "**気が + tính từ** mô tả tính cách. Học thành cặp: **気が長い ↔ 気が短い**, **気が強い ↔ 気が弱い**. Chú ý **気が短い ≈ 短気[たんき]**, **気が長い ≈ のんびりしている**.",
      compare: [
        ["気[き]が短[みじか]い", "nóng tính, nóng vội (= 短気)", "すぐ怒[おこ]る・待[ま]てない"],
        ["気[き]が長[なが]い", "kiên nhẫn, thong thả", "何時間[なんじかん]でも待[ま]てる"],
        ["気[き]が強[つよ]い", "cứng cỏi, mạnh mẽ, hiếu thắng", "言[い]い返[かえ]す・負[ま]けず嫌[ぎら]い"],
        ["気[き]が弱[よわ]い", "yếu đuối, nhút nhát, không dám nói", "断[ことわ]れない"],
        ["気[き]が小[ちい]さい", "nhát, hay lo, để ý chuyện nhỏ", "細[こま]かいことを気[き]にする"],
        ["気[き]が利[き]く", "tinh ý, chu đáo", "言[い]われる前[まえ]にやる"],
        ["気[き]が合[あ]う", "hợp tính", "初[はじ]めて会[あ]ったのに〜"]
      ],
      head: ["Cụm", "Nghĩa", "Dấu hiệu trong câu"],
      tips: [
        "Dấu hiệu **すぐ怒る / 待てない** → 気が短い; **言いたいことが言えない / 断れない** → 気が弱い.",
        "**気にする** (bận tâm, để ý) ≠ **気になる** (thấy tò mò, lo lắng – tự nhiên nảy sinh) ≠ **気をつける** (cẩn thận)."
      ],
      items: [
        { w: "気[き]が短[みじか]い", pos: "exp", lv: "N3", m: "nóng tính, thiếu kiên nhẫn", pair: "気[き]が長[なが]い", syn: "tanki", ex: "兄[あに]は｛気[き]が短[みじか]い｝ので、五分[ごふん]も待[ま]たされると怒[おこ]りだす。", vi: "Anh tôi nóng tính, bị bắt chờ 5 phút là bắt đầu nổi cáu." },
        { w: "短気[たんき]", alt: ["穏やか"], pos: "na", lv: "N3", m: "nóng tính, nóng nảy", pair: "気[き]が長[なが]い", syn: "tanki", ex: "｛短気[たんき]｝を起[お]こさないで、最後[さいご]まで話[はなし]を聞[き]きなさい。", vi: "Đừng nóng nảy, hãy nghe cho hết chuyện." },
        { w: "気[き]が長[なが]い", pos: "exp", lv: "N3", m: "kiên nhẫn, thong thả", pair: "気[き]が短[みじか]い", ex: "釣[つ]りは｛気[き]が長[なが]い｝人[ひと]に向[む]いている。", vi: "Câu cá hợp với người kiên nhẫn." },
        { w: "気[き]が強[つよ]い", pos: "exp", lv: "N3", m: "cứng cỏi, mạnh mẽ, hiếu thắng", pair: "気[き]が弱[よわ]い", ex: "妹[いもうと]は｛気[き]が強[つよ]く｝て、男[おとこ]の子[こ]とけんかしても負[ま]けない。", vi: "Em gái tôi rất cứng cỏi, đánh nhau với con trai cũng không thua." },
        { w: "気[き]が弱[よわ]い", pos: "exp", lv: "N3", m: "yếu đuối, nhút nhát, không dám từ chối", pair: "気[き]が強[つよ]い", ex: "彼[かれ]は｛気[き]が弱[よわ]く｝て、頼[たの]まれると断[ことわ]れない。", vi: "Anh ấy nhút nhát, bị nhờ là không từ chối được." },
        { w: "気[き]が小[ちい]さい", pos: "exp", lv: "N3", m: "nhát gan, hay lo, để ý chuyện vặt", syn: "coward", ex: "そんな小[ちい]さなミスを一週間[いっしゅうかん]も気[き]にするなんて、｛気[き]が小[ちい]さい｝なあ。", vi: "Lỗi nhỏ vậy mà lo cả tuần, đúng là hay lo vặt." },
        { w: "気[き]が利[き]く", pos: "exp", lv: "N3", m: "tinh ý, chu đáo", ex: "頼[たの]む前[まえ]にお茶[ちゃ]を出[だ]してくれるなんて、｛気[き]が利[き]く｝ね。", vi: "Chưa nhờ đã mang trà ra, tinh ý thật." },
        { w: "気[き]が合[あ]う", pos: "exp", lv: "N3", m: "hợp tính, hợp nhau", ex: "彼女[かのじょ]とは初[はじ]めて会[あ]ったときから｛気[き]が合[あ]って｝、すぐ友達[ともだち]になった。", vi: "Tôi hợp tính với cô ấy từ lần đầu gặp nên thành bạn ngay." },
        { w: "気前[きまえ]がいい", pos: "exp", lv: "N2", m: "hào phóng, rộng rãi", pair: "けち", ex: "社長[しゃちょう]は｛気前[きまえ]がよく｝て、よく社員[しゃいん]にご飯[はん]をおごってくれる。", vi: "Giám đốc rất hào phóng, hay mời nhân viên đi ăn." }
      ]
    },
    {
      title: "Tích cực ↔ tiêu cực: 〜的・前向き・几帳面",
      desc: "Từ Hán gốc **〜的[てき]** hay gặp trong bài đọc (読解) mô tả tính cách, thái độ.",
      tips: [
        "**積極的 ↔ 消極的** dùng cho thái độ hành động (phát biểu, tham gia); **前向き ↔ 後ろ向き** dùng cho cách suy nghĩ.",
        "**楽観的 ↔ 悲観的** = lạc quan ↔ bi quan (nhìn tương lai)."
      ],
      items: [
        { w: "積極的[せっきょくてき]", alt: ["後ろ向き", "内気"], pos: "na", lv: "N3", m: "tích cực, chủ động", pair: "消極的[しょうきょくてき]", ex: "授業[じゅぎょう]では｛積極的[せっきょくてき]｝に質問[しつもん]しましょう。", vi: "Trong giờ học hãy chủ động đặt câu hỏi." },
        { w: "消極的[しょうきょくてき]", alt: ["前向き"], pos: "na", lv: "N3", m: "thụ động, tiêu cực (không chủ động)", pair: "積極的[せっきょくてき]", ex: "彼[かれ]は会議[かいぎ]でいつも｛消極的[しょうきょくてき]｝で、自分[じぶん]の意見[いけん]を言[い]わない。", vi: "Anh ấy luôn thụ động trong cuộc họp, không nói ý kiến của mình." },
        { w: "前向[まえむ]き", alt: ["悲観的", "消極的"], pos: "na", lv: "N3", m: "lạc quan, hướng về phía trước", pair: "後[うし]ろ向[む]き", ex: "失敗[しっぱい]しても｛前向[まえむ]き｝に考[かんが]えることが大切[たいせつ]だ。", vi: "Dù thất bại, suy nghĩ tích cực hướng về phía trước là quan trọng." },
        { w: "楽観的[らっかんてき]", alt: ["後ろ向き"], pos: "na", lv: "N2", m: "lạc quan", pair: "悲観的[ひかんてき]", ex: "彼[かれ]は｛楽観的[らっかんてき]｝で、「なんとかなるよ」が口癖[くちぐせ]だ。", vi: "Anh ấy lạc quan, câu cửa miệng là \"rồi sẽ ổn thôi\"." },
        { w: "社交的[しゃこうてき]", alt: ["人見知り", "恥ずかしがり屋", "消極的"], pos: "na", lv: "N2", m: "hòa đồng, giỏi giao tiếp", pair: "内気[うちき]", ex: "姉[あね]は｛社交的[しゃこうてき]｝で、どこへ行[い]ってもすぐ友達[ともだち]ができる。", vi: "Chị tôi hòa đồng, đi đâu cũng có bạn ngay." },
        { w: "几帳面[きちょうめん]", alt: ["いい加減"], pos: "na", lv: "N2", m: "cẩn thận, ngăn nắp, chỉn chu", pair: "だらしない・大雑把[おおざっぱ]", ex: "彼[かれ]は｛几帳面[きちょうめん]｝で、毎日[まいにち]の支出[ししゅつ]を一円[いちえん]まで記録[きろく]している。", vi: "Anh ấy rất chỉn chu, ghi lại chi tiêu hằng ngày đến từng yên." },
        { w: "大雑把[おおざっぱ]", alt: ["丁寧"], pos: "na", lv: "N2", m: "qua loa, đại khái, xuề xòa", pair: "几帳面[きちょうめん]", ex: "母[はは]は料理[りょうり]が｛大雑把[おおざっぱ]｝で、調味料[ちょうみりょう]を量[はか]らない。", vi: "Mẹ tôi nấu ăn đại khái, không đong gia vị." },
        { w: "内気[うちき]", alt: ["積極的", "明るい"], pos: "na", lv: "N2", m: "nhút nhát, hướng nội", pair: "社交的[しゃこうてき]", syn: "shy", ex: "｛内気[うちき]｝な娘[むすめ]は、人前[ひとまえ]で話[はな]すのが苦手[にがて]だ。", vi: "Con gái tôi nhút nhát, ngại nói trước đám đông." }
      ]
    },
    {
      title: "Hậu tố tạo từ tính cách: 〜っぽい・〜屋[や]・〜者[もの]",
      desc: "**Vます(bỏ ます)+っぽい** = hay…, dễ… (thói quen xấu). **〜屋** / **〜者** = người có tính… Đây cũng là ngữ pháp N3 (#73 〜っぽい).",
      tips: [
        "**忘れっぽい / 怒りっぽい / 飽きっぽい** = tính hay (xu hướng thường xuyên). Khác **〜がち** (dễ xảy ra – thường cho việc không tốt, không dùng cho tính cách cố định nhiều như っぽい).",
        "**恥ずかしがり屋・寂しがり屋**: tính từ bỏ い + **がり屋**; **頑張り屋**: Vます + 屋.",
        "**〜者**: 働き者 (người chăm chỉ) ↔ 怠け者 (kẻ lười); 人気者 (người được yêu mến); 正直者 (người thật thà)."
      ],
      items: [
        { w: "怒[おこ]りっぽい", pos: "i", lv: "N3", m: "dễ nổi nóng, hay cáu", ex: "最近[さいきん]の父[ちち]は｛怒[おこ]りっぽく｝て、ちょっとしたことですぐ大声[おおごえ]を出[だ]す。", vi: "Dạo này bố tôi hay cáu, chuyện nhỏ cũng quát ầm lên." },
        { w: "忘[わす]れっぽい", pos: "i", lv: "N3", m: "hay quên", ex: "祖母[そぼ]は年[とし]のせいで｛忘[わす]れっぽく｝なり、さっき言[い]ったことも覚[おぼ]えていない。", vi: "Bà tôi do tuổi tác trở nên hay quên, điều vừa nói cũng không nhớ." },
        { w: "飽[あ]きっぽい", pos: "i", lv: "N3", m: "nhanh chán, cả thèm chóng chán", ex: "私[わたし]は｛飽[あ]きっぽい｝ので、趣味[しゅみ]が長[なが]く続[つづ]かない。", vi: "Tôi nhanh chán nên sở thích không kéo dài." },
        { w: "恥[は]ずかしがり屋[や]", pos: "n", lv: "N3", m: "người hay ngại, hay xấu hổ", syn: "shy", ex: "娘[むすめ]は｛恥[は]ずかしがり屋[や]｝で、知[し]らない人[ひと]に挨拶[あいさつ]ができない。", vi: "Con gái tôi hay ngại, không chào được người lạ." },
        { w: "寂[さび]しがり屋[や]", pos: "n", lv: "N3", m: "người sợ cô đơn, hay thấy buồn khi một mình", fit: ["社交的"], ex: "彼[かれ]は｛寂[さび]しがり屋[や]｝なので、一人[ひとり]で家[いえ]にいるのが嫌[きら]いだ。", vi: "Anh ấy sợ cô đơn nên ghét ở nhà một mình." },
        { w: "頑張[がんば]り屋[や]", pos: "n", lv: "N3", m: "người chịu khó, luôn cố gắng", ex: "彼女[かのじょ]は｛頑張[がんば]り屋[や]｝で、毎晩[まいばん]遅[おそ]くまで練習[れんしゅう]している。", vi: "Cô ấy rất chịu khó, tối nào cũng luyện tập đến khuya." },
        { w: "人見知[ひとみし]り", pos: "n", lv: "N3", m: "ngại người lạ", syn: "shy", ex: "子供[こども]のころは｛人見知[ひとみし]り｝で、お客[きゃく]さんが来[く]ると隠[かく]れていた。", vi: "Hồi nhỏ tôi ngại người lạ, khách đến là trốn." },
        { w: "働[はたら]き者[もの]", pos: "n", lv: "N3", m: "người chăm chỉ làm lụng", pair: "怠[なま]け者[もの]", ex: "彼[かれ]は朝[あさ]から晩[ばん]まで休[やす]まずに働[はたら]く｛働[はたら]き者[もの]｝だ。", vi: "Anh ấy là người chăm chỉ, làm từ sáng tới tối không nghỉ." },
        { w: "怠[なま]け者[もの]", alt: ["頑張り屋"], pos: "n", lv: "N3", m: "kẻ lười biếng", pair: "働[はたら]き者[もの]", ex: "宿題[しゅくだい]もしないで寝[ね]てばかりいる｛怠[なま]け者[もの]｝。", vi: "Đồ lười, bài tập không làm mà chỉ ngủ." }
      ]
    }
  ],
  tips: [
    { h: "Dạng câu hỏi hay gặp", li: [
      "**文脈規定**: câu có dấu hiệu hành vi → chọn tính cách. Ví dụ \"一度も授業を休まない\" → まじめ; \"すぐ怒る\" → 気が短い/短気; \"断れない\" → 気が弱い.",
      "**言い換え類義**: おとなしい ≈ 静か; だらしない ≈ きちんとしていない; けち ≈ お金を使いたがらない; 生意気 ≈ 偉そう.",
      "**用法**: chọn câu dùng đúng. Bẫy: \"この部屋はおとなしい\" (sai – おとなしい dùng cho người/vật nuôi), \"気が長い\" dùng cho người, không cho thời gian."
    ] },
    { h: "Mẹo nhớ", li: [
      "Học **theo cặp trái nghĩa** – đề hay đặt từ trái nghĩa làm đáp án nhiễu.",
      "Để ý **trợ từ**: 〜に厳しい / 〜に甘い / 〜に優しい (đối với ai).",
      "Từ khen dùng cho bản thân thì khiêm tốn: không nói 私は真面目です khi phỏng vấn mà nói 責任感があると言われます.",
      "Tính từ な (まじめ, 素直, 頑固…) + **な + danh từ**, + **に + động từ** (素直に謝る); tính từ い + **く** (優しく教える)."
    ] }
  ]
};
