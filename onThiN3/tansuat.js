// Từ chỉ tần suất & thời gian – N3
window.N3_TOPIC = {
  key: "tansuat",
  short: "Tần suất",
  title: "頻度 Từ chỉ tần suất & thời gian",
  kind: "vocab",
  intro: "Phó từ tần suất / thời gian gần như **đề nào cũng có** ở phần 文脈規定 và 文法 (chọn phó từ). Hai điều quan trọng nhất: (1) **thang tần suất** từ cao → thấp, (2) từ nào **bắt buộc đi với ない** (めったに・ちっとも・決して…).",
  groups: [
    {
      title: "Thang tần suất (câu khẳng định)",
      desc: "Từ cao xuống thấp: **いつも・常に** (100%) > **しょっちゅう** > **よく・しばしば・たびたび** > **時々・時折** > **たまに**.",
      compare: [
        ["いつも / 常[つね]に", "luôn luôn (常に: văn viết, trang trọng)", "毎日[まいにち]・毎朝[まいあさ]"],
        ["しょっちゅう", "rất hay, suốt (khẩu ngữ, thường việc không tốt)", "毎日[まいにち]のように"],
        ["よく / しばしば / たびたび", "thường, hay (しばしば, たびたび: văn viết)", "たびたびご迷惑[めいわく]を…"],
        ["時々[ときどき] / 時折[ときおり]", "thỉnh thoảng", "晴[は]れ時々[ときどき]雨[あめ]"],
        ["たまに", "thi thoảng, hiếm (たまには = lâu lâu một lần)", "たまには外食[がいしょく]"]
      ],
      tips: [
        "**よく** còn có nghĩa \"kỹ\" (よく考える) và \"giỏi thật, dám\" (よく頑張ったね) – đọc cả câu để chọn nghĩa.",
        "**しょっちゅう** mang sắc thái than phiền: しょっちゅう遅刻する / しょっちゅう壊れる.",
        "**たまに** khác **めったに**: たまに + câu khẳng định; めったに + **ない**."
      ],
      items: [
        { w: "いつも", pos: "adv", lv: "N5", m: "luôn luôn, lúc nào cũng", syn: "always", ex: "兄[あに]は毎朝[まいあさ]、｛いつも｝同[おな]じパン屋[や]でパンを買[か]う。", vi: "Anh tôi sáng nào cũng mua bánh ở cùng một tiệm.", dis: ["めったに", "たまに", "ちっとも"] },
        { w: "常[つね]に", pos: "adv", lv: "N3", m: "luôn luôn, thường xuyên (văn viết)", syn: "always", ex: "運転[うんてん]するときは、｛常[つね]に｝周[まわ]りに注意[ちゅうい]しなければならない。", vi: "Khi lái xe, phải luôn chú ý xung quanh.", dis: ["たまに", "めったに", "二度と"] },
        { w: "しょっちゅう", pos: "adv", lv: "N3", m: "rất hay, suốt (khẩu ngữ)", syn: "often", ex: "彼[かれ]は｛しょっちゅう｝遅刻[ちこく]するので、毎日[まいにち]のように先生[せんせい]に叱[しか]られている。", vi: "Cậu ấy suốt ngày đi muộn nên gần như ngày nào cũng bị thầy mắng.", dis: ["めったに", "たまに", "二度と"] },
        { w: "よく", pos: "adv", lv: "N5", m: "thường, hay; (còn nghĩa: kỹ, giỏi)", syn: "often", ex: "子供[こども]のころ、この川[かわ]で｛よく｝泳[およ]いだものだ。", vi: "Hồi nhỏ tôi thường bơi ở con sông này.", dis: ["めったに", "ちっとも", "決して"] },
        { w: "しばしば", pos: "adv", lv: "N3", m: "thường, nhiều lần (văn viết)", syn: "often", ex: "この道路[どうろ]では事故[じこ]が｛しばしば｝起[お]こるので、注意[ちゅうい]が必要[ひつよう]だ。", vi: "Trên con đường này thường xảy ra tai nạn nên cần chú ý.", dis: ["めったに", "少しも", "二度と"] },
        { w: "たびたび", pos: "adv", lv: "N3", m: "nhiều lần, hay (度々)", syn: "often", ex: "｛たびたび｝ご迷惑[めいわく]をおかけして、申[もう]し訳[わけ]ありません。", vi: "Thành thật xin lỗi vì đã nhiều lần làm phiền anh/chị.", dis: ["めったに", "決して", "ちっとも"] },
        { w: "時々[ときどき]", pos: "adv", lv: "N5", m: "thỉnh thoảng", syn: "sometimes", ex: "明日[あした]の天気[てんき]は晴[は]れ、｛時々[ときどき]｝雨[あめ]でしょう。", vi: "Thời tiết ngày mai nắng, thỉnh thoảng có mưa.", dis: ["めったに", "一度も", "決して"] },
        { w: "時折[ときおり]", pos: "adv", lv: "N2", m: "thỉnh thoảng (văn viết)", syn: "sometimes", ex: "静[しず]かな夜[よる]、｛時折[ときおり]｝遠[とお]くで犬[いぬ]の鳴[な]き声[ごえ]が聞[き]こえる。", vi: "Đêm yên tĩnh, thỉnh thoảng nghe tiếng chó sủa xa xa.", dis: ["めったに", "一度も", "決して"] },
        { w: "たまに", pos: "adv", lv: "N4", m: "thi thoảng, lâu lâu (たまには: lâu lâu cũng…)", ex: "普段[ふだん]は自炊[じすい]しているが、｛たまに｝は外食[がいしょく]もする。", vi: "Thường ngày tôi tự nấu, nhưng lâu lâu cũng ăn ngoài.", dis: ["めったに", "ちっとも", "全然"] }
      ]
    },
    {
      title: "Phải đi với phủ định 〜ない (bẫy kinh điển)",
      desc: "Những phó từ dưới đây **bắt buộc** đi với thể phủ định. Thấy câu kết thúc bằng **ない** mà có chỗ trống phó từ → ưu tiên nhóm này; thấy câu khẳng định → loại nhóm này ngay.",
      compare: [
        ["めったに〜ない", "hiếm khi (tần suất rất thấp)", "年[ねん]に一度[いちど]くらい"],
        ["ほとんど〜ない", "hầu như không", "ほとんど寝[ね]ていない"],
        ["あまり〜ない", "không… lắm", "あまり好[す]きではない"],
        ["ちっとも / 少[すこ]しも〜ない", "chẳng… chút nào (ちっとも: khẩu ngữ)", "ちっともわからない"],
        ["全然[ぜんぜん]〜ない", "hoàn toàn không", "全然知[し]らない"],
        ["一度[いちど]も〜ない", "chưa một lần", "〜たことがない"],
        ["決[けっ]して〜ない", "nhất định không (ý chí, cấm đoán)", "決して忘[わす]れない"],
        ["なかなか〜ない", "mãi mà không (khó thực hiện)", "なかなか来[こ]ない"],
        ["二度[にど]と〜ない", "không bao giờ… nữa", "二度と行[い]かない"]
      ],
      tips: [
        "**なかなか** + khẳng định = \"khá là\" (なかなかおいしい); + **ない** = \"mãi mà không\" (なかなか決まらない).",
        "**決して** thường đi với ý chí / lời cấm: 決して〜ない, 決して〜ないでください. Không dùng cho tần suất.",
        "**一度も** thường đi với **〜たことがない**; **二度と** đi với ý chí \"không bao giờ nữa\".",
        "**ほとんど** + khẳng định = \"hầu hết\" (ほとんど終わった); + ない = \"hầu như không\"."
      ],
      items: [
        { w: "めったに", pos: "adv", lv: "N3", m: "hiếm khi (+ない)", syn: "rarely", ex: "このあたりは暖[あたた]かいので、雪[ゆき]は｛めったに｝降[ふ]らない。", vi: "Vùng này ấm nên hiếm khi có tuyết.", dis: ["しょっちゅう", "いつも", "しばしば"] },
        { w: "ほとんど", pos: "adv", lv: "N4", m: "hầu như không (+ない); hầu hết", syn: "rarely", ex: "心配[しんぱい]で、昨日[きのう]の夜[よる]は｛ほとんど｝眠[ねむ]れなかった。", vi: "Vì lo lắng nên đêm qua tôi hầu như không ngủ được.", dis: ["しょっちゅう", "たまに", "たびたび"] },
        { w: "あまり", pos: "adv", lv: "N5", m: "không… lắm (+ない)", ex: "値段[ねだん]が高[たか]いわりに、この店[みせ]の料理[りょうり]は｛あまり｝おいしくない。", vi: "So với giá cao thì đồ ăn quán này không ngon lắm.", dis: ["しばしば", "たびたび", "しょっちゅう"] },
        { w: "ちっとも", pos: "adv", lv: "N3", m: "chẳng… chút nào (+ない, khẩu ngữ)", syn: "notatall", ex: "何度[なんど]説明[せつめい]しても、彼[かれ]は｛ちっとも｝わかってくれない。", vi: "Giải thích bao nhiêu lần anh ta cũng chẳng hiểu chút nào.", dis: ["たびたび", "さっそく", "いよいよ"] },
        { w: "少[すこ]しも", pos: "adv", lv: "N3", m: "không… một chút nào (+ない)", syn: "notatall", ex: "お金[かね]のことなんか、私[わたし]は｛少[すこ]しも｝気[き]にしていない。", vi: "Chuyện tiền bạc tôi chẳng bận tâm chút nào.", dis: ["さっそく", "しばしば", "ようやく"] },
        { w: "全然[ぜんぜん]", pos: "adv", lv: "N4", m: "hoàn toàn không (+ない)", syn: "notatall", ex: "テストの問題[もんだい]が難[むずか]しくて、｛全然[ぜんぜん]｝わからなかった。", vi: "Đề thi khó quá, tôi hoàn toàn không hiểu.", dis: ["ようやく", "さっそく", "しばしば"] },
        { w: "一度[いちど]も", pos: "adv", lv: "N4", m: "chưa một lần (+ない / 〜たことがない)", ex: "私[わたし]は海外[かいがい]へ｛一度[いちど]も｝行[い]ったことがない。", vi: "Tôi chưa từng ra nước ngoài lần nào.", dis: ["何度も", "たびたび", "しばしば"] },
        { w: "決[けっ]して", pos: "adv", lv: "N3", m: "nhất định không, tuyệt đối không (+ない)", ex: "このことは｛決[けっ]して｝誰[だれ]にも言[い]わないでください。", vi: "Chuyện này tuyệt đối đừng nói với ai.", dis: ["たまに", "時々", "しばしば"] },
        { w: "なかなか", pos: "adv", lv: "N4", m: "mãi mà không (+ない); khá là (+khẳng định)", ex: "バスが｛なかなか｝来[こ]なくて、三十分[さんじゅっぷん]も待[ま]った。", vi: "Xe buýt mãi không đến, tôi đã đợi tận 30 phút.", dis: ["さっき", "たまに", "二度と"] },
        { w: "二度[にど]と", pos: "adv", lv: "N3", m: "không bao giờ… nữa (+ない)", ex: "あんなにまずい店[みせ]には｛二度[にど]と｝行[い]かない。", vi: "Quán dở như thế tôi sẽ không bao giờ đến nữa.", dis: ["何度も", "たびたび", "しばしば"] }
      ]
    },
    {
      title: "Lặp lại · liên tục · chu kỳ (〜おきに / 〜ごとに / 〜たびに)",
      desc: "Nhóm diễn tả **sự lặp lại** và **chu kỳ**. Bẫy lớn nhất: **〜おきに** và **〜ごとに**.",
      compare: [
        ["1日[いちにち]おきに", "cách 1 ngày (ngày có, ngày không) = 2日ごと", "月[げつ]・水[すい]・金[きん]…"],
        ["1日[いちにち]ごとに", "mỗi ngày (= 毎日)", "月・火・水…"],
        ["2時間[にじかん]おきに", "với đơn vị thời gian/khoảng cách liên tục: おき ≈ ごと", "2時間ごと = 2時間おき"],
        ["〜たびに", "mỗi lần làm V thì (luôn) …", "Vる/Nの + たびに"]
      ],
      head: ["Cách nói", "Nghĩa", "Ví dụ"],
      tips: [
        "**相変わらず** = vẫn như xưa (không đổi) – hay ra 言い換え: ≈ **前と同じで**.",
        "**再び** = もう一度 (văn viết); **次々に** = lần lượt cái này đến cái khác; **絶えず** = không ngừng.",
        "**ずっと** có 2 nghĩa: suốt (ずっと雨だった) và hơn hẳn (こっちのほうがずっと安い)."
      ],
      items: [
        { w: "ずっと", pos: "adv", lv: "N4", m: "suốt, liên tục; (so sánh) hơn hẳn", syn: "continuous", ex: "昨日[きのう]は朝[あさ]から晩[ばん]まで、｛ずっと｝雨[あめ]が降[ふ]っていた。", vi: "Hôm qua mưa suốt từ sáng đến tối.", dis: ["めったに", "たまに", "さっき"] },
        { w: "相変[あいか]わらず", pos: "adv", lv: "N3", m: "vẫn như mọi khi, vẫn như cũ", ex: "久[ひさ]しぶりに会[あ]ったが、彼[かれ]は｛相変[あいか]わらず｝元気[げんき]だった。", vi: "Lâu rồi mới gặp lại, anh ấy vẫn khỏe như ngày nào.", dis: ["ようやく", "二度と", "めったに"] },
        { w: "何度[なんど]も", pos: "adv", lv: "N4", m: "nhiều lần", ex: "わからないところは、｛何度[なんど]も｝繰[く]り返[かえ]して読[よ]んだ。", vi: "Chỗ không hiểu tôi đã đọc đi đọc lại nhiều lần.", dis: ["一度も", "めったに", "決して"] },
        { w: "毎回[まいかい]", pos: "adv", lv: "N3", m: "mỗi lần, lần nào cũng", ex: "彼[かれ]は会議[かいぎ]で｛毎回[まいかい]｝同[おな]じ質問[しつもん]をする。", vi: "Lần họp nào anh ta cũng hỏi cùng một câu.", dis: ["一度も", "めったに", "決して"] },
        { w: "再[ふたた]び", pos: "adv", lv: "N3", m: "lại, lần nữa (= もう一度, văn viết)", ex: "火事[かじ]で焼[や]けた寺[てら]が、十年後[じゅうねんご]に｛再[ふたた]び｝建[た]てられた。", vi: "Ngôi chùa bị cháy đã được xây lại sau 10 năm.", dis: ["一度も", "めったに", "ちっとも"] },
        { w: "次々[つぎつぎ]に", pos: "adv", lv: "N3", m: "lần lượt, liên tiếp", ex: "開場[かいじょう]と同時[どうじ]に、客[きゃく]が｛次々[つぎつぎ]に｝入[はい]ってきた。", vi: "Vừa mở cửa là khách lần lượt kéo vào.", dis: ["めったに", "少しも", "二度と"] },
        { w: "絶[た]えず", pos: "adv", lv: "N2", m: "không ngừng, liên tục", ex: "この川[かわ]の水[みず]は｛絶[た]えず｝流[なが]れている。", vi: "Nước con sông này chảy không ngừng.", dis: ["たまに", "めったに", "一度も"] },
        { w: "〜おきに", pos: "suf", lv: "N3", m: "cách… một (cách quãng)", ex: "この薬[くすり]は六時間[ろくじかん]｛おきに｝飲[の]んでください。", vi: "Thuốc này hãy uống cách 6 tiếng một lần.", dis: ["ばかり", "だらけ", "ずつ"], note: "**1日おき** = cách 1 ngày (2 ngày 1 lần) ≠ **1日ごと** (mỗi ngày)." },
        { w: "〜ごとに", pos: "suf", lv: "N3", m: "mỗi…, cứ mỗi…", ex: "オリンピックは四年[よねん]｛ごとに｝開[ひら]かれる。", vi: "Thế vận hội được tổ chức 4 năm một lần.", dis: ["ばかり", "ずつ", "だらけ"], note: "**4年おき** về lý thuyết là 5 năm 1 lần → đề thi hay bẫy chỗ này." },
        { w: "〜たびに", pos: "suf", lv: "N3", m: "mỗi lần… thì (luôn)", ex: "この歌[うた]を聞[き]く｛たびに｝、故郷[ふるさと]を思[おも]い出[だ]す。", vi: "Mỗi lần nghe bài hát này tôi lại nhớ quê.", dis: ["とたん", "最中", "ばかり"], note: "Ngữ pháp N3 #26. **Vる / Nの + たびに**." }
      ]
    },
    {
      title: "Thời điểm & tiến trình (そろそろ・いよいよ・ようやく…)",
      desc: "Không phải tần suất nhưng **luôn đi cùng** trong đề phó từ. Phân biệt theo **thời điểm** (sắp / vừa / đã / vẫn) và **cảm xúc** (mong đợi, sau nỗ lực).",
      compare: [
        ["そろそろ", "sắp đến lúc (nên làm gì đó)", "そろそろ帰[かえ]ろう"],
        ["いよいよ", "sắp đến lúc quan trọng đã chờ đợi", "いよいよ明日[あした]は本番[ほんばん]"],
        ["ようやく / やっと", "cuối cùng cũng (sau thời gian dài / nỗ lực)", "やっと終[お]わった"],
        ["とうとう / ついに", "rốt cuộc, cuối cùng (kết quả tốt **hoặc xấu**)", "とうとう来[こ]なかった"],
        ["さっそく", "ngay lập tức (làm điều vừa có được/nghe được)", "さっそく使[つか]ってみる"],
        ["いまだに", "đến giờ vẫn (+ thường phủ định, ý bất ngờ)", "いまだに見[み]つからない"]
      ],
      tips: [
        "**やっと/ようやく** hầu như chỉ dùng cho kết quả **mong muốn**; **とうとう** dùng được cả kết quả xấu (とうとう雨が降り出した, とうとう来なかった).",
        "**そろそろ** + ý chí / đề nghị (帰ろう・始めましょう); **いよいよ** + sự kiện quan trọng (試合・本番・出発).",
        "**今にも〜そうだ**: sắp sửa (ngay bây giờ) – luôn đi với **そうだ (dáng vẻ)**."
      ],
      items: [
        { w: "そろそろ", pos: "adv", lv: "N4", m: "sắp, đến lúc (nên làm gì)", ex: "もう十時[じゅうじ]だ。｛そろそろ｝帰[かえ]ろう。", vi: "Đã 10 giờ rồi. Sắp đến lúc về thôi.", dis: ["とうとう", "さっき", "いまだに"] },
        { w: "いよいよ", pos: "adv", lv: "N3", m: "cuối cùng thì (sắp đến lúc quan trọng)", ex: "長[なが]い準備[じゅんび]が終[お]わり、｛いよいよ｝明日[あした]は本番[ほんばん]だ。", vi: "Chuẩn bị lâu dài đã xong, cuối cùng ngày mai là buổi diễn chính thức.", dis: ["さっき", "相変わらず", "めったに"] },
        { w: "ようやく", pos: "adv", lv: "N3", m: "cuối cùng cũng (sau thời gian dài) ≈ やっと", syn: "finally", ex: "三時間[さんじかん]並[なら]んで、｛ようやく｝チケットが買[か]えた。", vi: "Xếp hàng 3 tiếng, cuối cùng cũng mua được vé.", dis: ["そろそろ", "さっそく", "いまだに"] },
        { w: "とうとう", pos: "adv", lv: "N3", m: "rốt cuộc, cuối cùng (tốt hoặc xấu) ≈ ついに", syn: "finally", ex: "一時間[いちじかん]待[ま]ったが、彼[かれ]は｛とうとう｝来[こ]なかった。", vi: "Đợi một tiếng, rốt cuộc anh ta vẫn không đến.", dis: ["そろそろ", "さっそく", "いよいよ"], note: "Câu kết quả xấu (来なかった) → không dùng やっと/ようやく." },
        { w: "さっそく", pos: "adv", lv: "N3", m: "ngay lập tức (早速)", ex: "新[あたら]しいパソコンが届[とど]いたので、｛さっそく｝使[つか]ってみた。", vi: "Máy tính mới vừa giao tới nên tôi dùng thử ngay.", dis: ["いまだに", "そろそろ", "めったに"] },
        { w: "いまだに", pos: "adv", lv: "N2", m: "đến giờ vẫn (未だに)", ex: "十年前[じゅうねんまえ]の事件[じけん]だが、犯人[はんにん]は｛いまだに｝見[み]つかっていない。", vi: "Vụ án từ 10 năm trước mà đến giờ vẫn chưa tìm ra thủ phạm.", dis: ["さっそく", "そろそろ", "とうとう"] },
        { w: "すでに", pos: "adv", lv: "N3", m: "đã… rồi (= もう, văn viết)", ex: "駅[えき]に着[つ]いたときには、電車[でんしゃ]は｛すでに｝出[で]てしまっていた。", vi: "Khi tôi đến ga thì tàu đã chạy mất rồi.", dis: ["そろそろ", "いよいよ", "いまだに"] },
        { w: "今[いま]にも", pos: "adv", lv: "N3", m: "sắp sửa, chực (+そうだ)", ex: "空[そら]が暗[くら]くなって、｛今[いま]にも｝雨[あめ]が降[ふ]りそうだ。", vi: "Trời tối sầm, chực đổ mưa.", dis: ["すでに", "さっき", "とうとう"] },
        { w: "しばらく", pos: "adv", lv: "N4", m: "một lúc, một thời gian", ex: "担当者[たんとうしゃ]が参[まい]りますので、｛しばらく｝お待[ま]ちください。", vi: "Người phụ trách sẽ đến, xin vui lòng đợi một lát.", dis: ["さっき", "とうとう", "すでに"] },
        { w: "いつの間[ま]にか", pos: "adv", lv: "N3", m: "lúc nào không hay", ex: "本[ほん]を読[よ]んでいたら、｛いつの間[ま]にか｝寝[ね]てしまった。", vi: "Đang đọc sách thì ngủ quên lúc nào không hay.", dis: ["さっそく", "そろそろ", "いよいよ"] }
      ]
    },
    {
      title: "Thay đổi dần (だんだん・どんどん・ますます・次第に)",
      desc: "Diễn tả **tốc độ thay đổi**: từ từ (だんだん・次第に・少しずつ), nhanh và mạnh (どんどん), ngày càng hơn mức hiện tại (ますます).",
      tips: [
        "**ますます** = mức độ vốn đã cao lại càng cao hơn (ますます寒くなる). Hay đi với **〜一方だ**, **〜につれて**.",
        "**どんどん** nhấn mạnh tốc độ nhanh, mạnh mẽ; **だんだん / 次第に** chậm rãi (次第に: văn viết).",
        "**急に** (đột nhiên) ↔ **だんだん** (dần dần) – cặp trái nghĩa hay ra."
      ],
      items: [
        { w: "だんだん", pos: "adv", lv: "N4", m: "dần dần", syn: "gradually", pair: "急[きゅう]に", ex: "春[はる]になって、｛だんだん｝暖[あたた]かくなってきた。", vi: "Sang xuân, trời ấm dần lên.", dis: ["さっき", "めったに", "一度も"] },
        { w: "次第[しだい]に", pos: "adv", lv: "N3", m: "dần dần (văn viết)", syn: "gradually", ex: "台風[たいふう]が近[ちか]づき、風[かぜ]が｛次第[しだい]に｝強[つよ]くなってきた。", vi: "Bão đến gần, gió mạnh dần lên.", dis: ["一度も", "めったに", "さっそく"] },
        { w: "少[すこ]しずつ", pos: "adv", lv: "N4", m: "từng chút một", syn: "gradually", ex: "毎日[まいにち]練習[れんしゅう]して、｛少[すこ]しずつ｝話[はな]せるようになった。", vi: "Luyện tập mỗi ngày nên tôi dần nói được từng chút một.", dis: ["一度も", "めったに", "二度と"] },
        { w: "どんどん", pos: "adv", lv: "N3", m: "nhanh chóng, ào ào, liên tục", syn: "rapid", ex: "練習[れんしゅう]を始[はじ]めてから、彼[かれ]は｛どんどん｝上手[じょうず]になっている。", vi: "Từ khi bắt đầu luyện tập, cậu ấy tiến bộ nhanh chóng.", dis: ["めったに", "ちっとも", "しばらく"] },
        { w: "ますます", pos: "adv", lv: "N3", m: "ngày càng, càng thêm", syn: "rapid", ex: "物価[ぶっか]が上[あ]がって、生活[せいかつ]が｛ますます｝苦[くる]しくなった。", vi: "Vật giá tăng, cuộc sống càng thêm khó khăn.", dis: ["めったに", "ちっとも", "さっそく"] },
        { w: "急[きゅう]に", pos: "adv", lv: "N4", m: "đột nhiên, bất ngờ", pair: "だんだん", ex: "晴[は]れていたのに、｛急[きゅう]に｝雨[あめ]が降[ふ]り出[だ]した。", vi: "Đang nắng thì đột nhiên trời đổ mưa.", dis: ["めったに", "一度も", "二度と"] }
      ]
    }
  ],
  tips: [
    { h: "Chiến thuật làm câu phó từ", li: [
      "**Bước 1 – nhìn đuôi câu**: có **ない** → ưu tiên めったに・ほとんど・ちっとも・決して…; khẳng định → loại ngay nhóm đó.",
      "**Bước 2 – tìm từ khoá tần suất**: 毎日/毎朝 → いつも; 年に一度 → めったに/たまに; 毎日のように → しょっちゅう.",
      "**Bước 3 – xem kết quả tốt hay xấu**: kết quả xấu (来なかった) → とうとう, không phải やっと/ようやく.",
      "**Bước 4 – xem đuôi đặc biệt**: 〜そうだ → 今にも; 〜たことがない → 一度も; 〜ないでください → 決して."
    ] },
    { h: "Cặp hay bị đánh tráo", li: [
      "**たまに (khẳng định) ↔ めったに (+ない)** – cùng tần suất thấp, khác cấu trúc.",
      "**なかなか〜ない (mãi không) ↔ ちっとも〜ない (không chút nào)**: なかなか = khó/chậm đạt được, ちっとも = mức độ bằng 0.",
      "**1日おき ↔ 1日ごと**, **4年おき ↔ 4年ごと**.",
      "**そろそろ (đến lúc nên làm) ↔ いよいよ (sắp tới sự kiện quan trọng)**."
    ] }
  ]
};
