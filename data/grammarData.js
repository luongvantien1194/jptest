const grammarData = [
  {
    "STT": 1,
    "Lesson": 1,
    "Structure": "N1 は　N2　です",
    "Meaning": "N1 là N2",
    "Explanation": "Dùng để giới thiệu tên、 danh tính hoặc nghề nghiệp. です biểu thị sự lịch sự.",
    "Example": "わたしは　マイク・ミラーです。[Watashi wa Maiku Miraa desu.] (Tôi là Mike Miller.)"
  },
  {
    "STT": 2,
    "Lesson": 1,
    "Structure": "N1　は　N2　じゃ　ありません",
    "Meaning": "N1 không phải là N2",
    "Explanation": "Dạng phủ định của です. Trong văn viết trang trọng dùng では ありません",
    "Example": "ワンさんは　医者[いしゃ]じゃ　ありません。[Wan-san wa isha ja arimasen.] (Ông Wang không phải là bác sĩ.)"
  },
  {
    "STT": 3,
    "Lesson": 1,
    "Structure": "～も～です",
    "Meaning": "~ cũng là ~",
    "Explanation": "Dùng trợ từ も thay cho は khi thông tin về đối tượng tương tự với đối tượng trước đó",
    "Example": "ミラーさんは　会社員[かいしゃいん]です。グプタさんも　会社員[かいしゃいん]です。[Miraa-san wa kaishain desu. Guputa-san mo kaishain desu.] (Anh Miller là nhân viên công ty. Anh Gupta cũng là nhân viên công ty.)"
  },
  {
    "STT": 4,
    "Lesson": 1,
    "Structure": "N1　の　N2　です。S は　～さいです",
    "Meaning": "N2 của N1. S thì ~ tuổi",
    "Explanation": "Trợ từ の nối 2 danh từ (N1 bổ nghĩa cho N2). Số tuổi + さい để nói về tuổi",
    "Example": "わたしは　IMCの　社員[しゃいん]です。[Watashi wa IMC no shain desu.] (Tôi là nhân viên của công ty IMC.) | たろうくんは　９歳[きゅうさい]です。[Tarou-kun wa kyuusai desu.] (Bé Taro 9 tuổi.)"
  },
  {
    "STT": 5,
    "Lesson": 2,
    "Structure": "これ/ それ/ あれ",
    "Meaning": "Cái này/ cái đó/ cái kia",
    "Explanation": "Chỉ định từ làm chủ ngữ. これ (gần người nói)、 それ (gần người nghe)、 あれ (xa cả hai)",
    "Example": "これは　本[ほん]です。[Kore wa hon desu.] (Đây là cuốn sách) | それは　辞書[じしょ]です。[Sore wa jisho desu.] (Đó là từ điển) | あれは　コンピューターです。[Are wa konpyuutaa desu.] (Kia là máy tính)"
  },
  {
    "STT": 6,
    "Lesson": 2,
    "Structure": "このN/ そのN/ あのN",
    "Meaning": "Cái N này/ đó/ kia",
    "Explanation": "Dùng để bổ nghĩa trực tiếp cho danh từ đi kèm ngay sau đó",
    "Example": "この　本[ほん]は　わたしのです。[Kono hon wa watashi no desu.] (Cuốn sách này là của tôi.)"
  },
  {
    "STT": 7,
    "Lesson": 2,
    "Structure": "そうです/ そうじゃ　ありません",
    "Meaning": "Đúng vậy/ Không phải vậy",
    "Explanation": "Dùng để trả lời cho câu hỏi xác nhận danh từ N1 は N2 ですか",
    "Example": "はい、そうです。[Hai、 sou desu.] (Vâng、 đúng vậy.) | いいえ、そうじゃ　ありません。[Iie、 sou ja arimasen.] (Không、 không phải vậy.)"
  },
  {
    "STT": 8,
    "Lesson": 2,
    "Structure": "～は S1 ですか 、S2 ですか",
    "Meaning": "Lựa chọn S1 hay S2",
    "Explanation": "Câu hỏi lựa chọn giữa hai hay nhiều phương án",
    "Example": "これは　「９」ですか、「７」ですか。[Kore wa 9 desu ka、 7 desu ka.] (Đây là số 9 hay số 7?)"
  },
  {
    "STT": 9,
    "Lesson": 2,
    "Structure": "N1のN2",
    "Meaning": "N2 của N1",
    "Explanation": "Trợ từ の biểu thị quan hệ sở hữu hoặc nội dung của danh từ",
    "Example": "それは　だれの　傘[かさ]ですか。[Sore wa dare no kasa desu ka.] (Đó là cái ô của ai?)"
  },
  {
    "STT": 10,
    "Lesson": 2,
    "Structure": "そうですか",
    "Meaning": "Ra thế/ Vậy à",
    "Explanation": "Dùng khi nhận được thông tin mới và thể hiện rằng mình đã hiểu",
    "Example": "この　傘[かさ]は　佐藤[さとう]さんのです。ー　そうですか。[Kono kasa wa Satou-san no desu. - Sou desu ka.] (Cái ô này là của chị Sato. - Ra thế.)"
  },
  {
    "STT": 11,
    "Lesson": 3,
    "Structure": "ここ/そこ/あそこ/こちら/そちら/あちら",
    "Meaning": "Ở đây/đó/kia",
    "Explanation": "こちら/そちら/あちら là dạng lịch sự hơn của ここ/そこ/あそこ",
    "Example": "ここは　食堂[しょくどう]です。[Koko wa shokudou desu.] (Đây là nhà ăn.) | お手洗[てあら]いは　あちらです。[Otearai wa achira desu.] (Nhà vệ sinh ở phía kia.)"
  },
  {
    "STT": 12,
    "Lesson": 3,
    "Structure": "N1は　N2（địa điểm）です",
    "Meaning": "N1 ở N2",
    "Explanation": "Dùng để chỉ vị trí của người、 vật hoặc địa điểm",
    "Example": "電話[でんわ]は　２階[にかい]です。[Denwa wa nikai desu.] (Điện thoại ở tầng 2.)"
  },
  {
    "STT": 13,
    "Lesson": 3,
    "Structure": "どこ/どちら",
    "Meaning": "Ở đâu/ Phía nào",
    "Explanation": "Từ để hỏi địa điểm. どちら lịch sự hơn どこ",
    "Example": "お手洗[てあら]いは　どこですか。[Otearai wa doko desu ka.] (Nhà vệ sinh ở đâu vậy?)"
  },
  {
    "STT": 14,
    "Lesson": 3,
    "Structure": "N1のN2",
    "Meaning": "N2 của N1 (xuất xứ)",
    "Explanation": "N1 thường là tên quốc gia hoặc tên công ty sản xuất N2",
    "Example": "これは　日本[にほん]の　車[くるま]です。[Kore wa Nihon no kuruma desu.] (Đây là xe hơi của Nhật Bản.)"
  },
  {
    "STT": 15,
    "Lesson": 3,
    "Structure": "～は　いくらですか　―＞　～は～円です。",
    "Meaning": "Cái này giá bao nhiêu?",
    "Explanation": "Cấu trúc hỏi giá tiền của đồ vật",
    "Example": "この　ネクタイは　いくらですか。ー　１５００円[せんごひゃくえん]です。[Kono nekutai wa ikura desu ka. - Sengohyaku-en desu.] (Cái cà vạt này giá bao nhiêu? - 1500 Yên.)"
  },
  {
    "STT": 16,
    "Lesson": 4,
    "Structure": "今(いま)　～時(じ)　～分(ふん)です",
    "Meaning": "Bây giờ là ~ giờ ~ phút",
    "Explanation": "Dùng để nói về thời gian hiện tại",
    "Example": "今[いま]　４時[よじ]５分[ごふん]です。[Ima yoji go-fun desu.] (Bây giờ là 4 giờ 5 phút.)"
  },
  {
    "STT": 17,
    "Lesson": 4,
    "Structure": "Vます",
    "Meaning": "Động từ thể ます",
    "Explanation": "Diễn tả một thói quen hoặc một sự thật trong hiện tại hoặc tương lai",
    "Example": "わたしは　毎日[まいにち]　勉強[べんきょう]します。[Watashi wa mainichi benkyou shimasu.] (Hàng ngày tôi học bài.)"
  },
  {
    "STT": 18,
    "Lesson": 4,
    "Structure": "Vます/Vません/Vました/Vませんでした",
    "Meaning": "Khẳng định/ Phủ định (Hiện tại - Quá khứ)",
    "Explanation": "Hệ thống chia thời và thể của động từ lịch sự",
    "Example": "あした　働[はたら]きます。[Ashita hatarakimasu.] (Ngày mai tôi làm việc.) | きのう　働[はたら]きませんでした。[Kinou hatarakimasen deshita.] (Hôm qua tôi đã không làm việc.)"
  },
  {
    "STT": 19,
    "Lesson": 4,
    "Structure": "N (thời gian) に V",
    "Meaning": "Làm gì vào lúc nào",
    "Explanation": "Thêm trợ từ に sau danh từ chỉ thời gian có con số cụ thể",
    "Example": "６時[ろくじ]に　起[お]きます。[Rokuji ni okimasu.] (Tôi thức dậy vào lúc 6 giờ.)"
  },
  {
    "STT": 20,
    "Lesson": 4,
    "Structure": "N1 から N2 まで",
    "Meaning": "Từ N1 đến N2",
    "Explanation": "Chỉ điểm bắt đầu và điểm kết thúc của thời gian hoặc không gian",
    "Example": "８時[はちじ]から　５時[ごじ]まで　働[はたら]きます。[Hachiji kara goji made hatarakimasu.] (Tôi làm việc từ 8 giờ đến 5 giờ.)"
  },
  {
    "STT": 21,
    "Lesson": 4,
    "Structure": "N1 と N2",
    "Meaning": "N1 và N2",
    "Explanation": "Dùng と để nối hai danh từ",
    "Example": "銀行[ぎんこう]の　休[やす]みは　土曜日[どようび]と　日曜日[にちようび]です。[Ginkou no yasumi wa doyoubi to nikiyoubi desu.] (Ngày nghỉ của ngân hàng là thứ bảy và chủ nhật.)"
  },
  {
    "STT": 22,
    "Lesson": 5,
    "Structure": "N ( địa điểm) へ　いきます/　きます/ かえります",
    "Meaning": "Đi/ Đến/ Về địa điểm N",
    "Explanation": "Trợ từ へ chỉ hướng di chuyển",
    "Example": "京都[きょうと]へ　行[い]きます。[Kyouto e ikimasu.] (Tôi đi Kyoto.)"
  },
  {
    "STT": 23,
    "Lesson": 5,
    "Structure": "( Từ để hỏi ) + [ trợ từ ]+ [ も ]+ [ phủ định ]",
    "Meaning": "Không ... cái gì cả",
    "Explanation": "Dùng để phủ định hoàn toàn",
    "Example": "どこへも　行[い]きません。[Doko e mo ikimasen.] (Tôi không đi đâu cả.) | なにも　食[た]べません。[Nani mo tabemasen.] (Tôi không ăn gì cả.)"
  },
  {
    "STT": 24,
    "Lesson": 5,
    "Structure": "N (phương tiện giao thông )　で いきます/きます/かえります",
    "Meaning": "Đi bằng phương tiện N",
    "Explanation": "Trợ từ で chỉ phương thức、 phương tiện di chuyển",
    "Example": "電車[でんしゃ]で　行[い]きます。[Densha de ikimasu.] (Tôi đi bằng tàu điện.)"
  },
  {
    "STT": 25,
    "Lesson": 5,
    "Structure": "N (người/ con vật) と　V",
    "Meaning": "Làm gì cùng với N",
    "Explanation": "Trợ từ と chỉ đối tượng cùng thực hiện hành động",
    "Example": "家族[かぞく]と　日本[にほん]へ　来[き]ました。[Kazoku to Nihon e kimashita.] (Tôi đã đến Nhật cùng với gia đình.)"
  },
  {
    "STT": 26,
    "Lesson": 5,
    "Structure": "いつ",
    "Meaning": "Khi nào",
    "Explanation": "Từ để hỏi về thời gian. Không dùng trợ từ に sau いつ",
    "Example": "いつ　日本[にほん]へ　来[き]ましたか。[Itsu Nihon e kimashita ka.] (Bạn đã đến Nhật khi nào?)"
  },
  {
    "STT": 27,
    "Lesson": 5,
    "Structure": "Sよ",
    "Meaning": "Đấy/ nhé",
    "Explanation": "Đặt ở cuối câu để truyền đạt thông tin mới hoặc nhấn mạnh ý kiến",
    "Example": "次[つぎ]の　急行[きゅうこう]ですよ。[Tsugi no kyuukou desu yo.] (Chuyến tàu nhanh tiếp theo đấy nhé.)"
  },
  {
    "STT": 28,
    "Lesson": 6,
    "Structure": "N　を　V",
    "Meaning": "Làm N",
    "Explanation": "Trợ từ を chỉ đối tượng trực tiếp của ngoại động từ",
    "Example": "ジュースを　飲[の]みます。[Juusu o nomimasu.] (Tôi uống nước trái cây.)"
  },
  {
    "STT": 29,
    "Lesson": 6,
    "Structure": "Nをします",
    "Meaning": "Làm/ Chơi/ Thực hiện N",
    "Explanation": "Dùng cho các môn thể thao、 sự kiện、 nghề nghiệp",
    "Example": "サッカーを　します。[Sakkaa o shimasu.] (Tôi chơi bóng đá.)"
  },
  {
    "STT": 30,
    "Lesson": 6,
    "Structure": "なにを　しますか",
    "Meaning": "Làm cái gì vậy?",
    "Explanation": "Câu hỏi về hành động của ai đó",
    "Example": "月曜日[げつようび]　なにを　しますか。[Getsuyoubi nani o shimasu ka.] (Thứ hai bạn làm gì?)"
  },
  {
    "STT": 31,
    "Lesson": 6,
    "Structure": "なん và なに",
    "Meaning": "Cái gì",
    "Explanation": "なん dùng trước t、 d、 n hoặc số đếm. なに dùng trong các trường hợp khác",
    "Example": "それは　何[なん]ですか。[Sore wa nan desu ka.] (Đó là cái gì?) | 何[なに]を　買[か]いましたか。[Nani o kaimashita ka.] (Bạn đã mua cái gì?)"
  },
  {
    "STT": 32,
    "Lesson": 6,
    "Structure": "N（ địa điểm ）で　V",
    "Meaning": "Làm việc gì tại N",
    "Explanation": "Trợ từ で chỉ địa điểm xảy ra hành động",
    "Example": "駅[えき]で　新聞[しんぶん]を　買[か]います。[Eki de shinbun o kaimasu.] (Tôi mua báo ở nhà ga.)"
  },
  {
    "STT": 33,
    "Lesson": 6,
    "Structure": "Vませんか",
    "Meaning": "Cùng làm ... nhé?",
    "Explanation": "Dùng để mời ai đó làm gì với thái độ lịch sự",
    "Example": "いっしょに　京都[きょうと]へ　行[い]きませんか。[Issho ni Kyouto e ikimasen ka.] (Cùng đi Kyoto với tôi nhé?)"
  },
  {
    "STT": 34,
    "Lesson": 6,
    "Structure": "Vましょう",
    "Meaning": "Cùng làm ... thôi!",
    "Explanation": "Dùng để rủ rê hoặc đáp lại lời mời Vませんか một cách tích cực",
    "Example": "ちょっと　休[やす]みましょう。[Chotto yasumimashou.] (Nghỉ một chút thôi nào!)"
  },
  {
    "STT": 35,
    "Lesson": 6,
    "Structure": "お～",
    "Meaning": "Tiền tố lịch sự",
    "Explanation": "Thêm vào trước danh từ để thể hiện sự lịch sự",
    "Example": "お酒[さけ]を　飲[の]みますか。[Osake o nomimasu ka.] (Bạn có uống rượu không?)"
  },
  {
    "STT": 36,
    "Lesson": 7,
    "Structure": "Dụng cụ/ phương tiện で　V",
    "Meaning": "Làm bằng gì",
    "Explanation": "Trợ từ で chỉ công cụ、 phương thức thực hiện hành động",
    "Example": "はしで　食[た]べます。[Hashi de tabemasu.] (Tôi ăn bằng đũa.)"
  },
  {
    "STT": 37,
    "Lesson": 7,
    "Structure": "“ Từ/ câu” は　～ごで　何(なん)ですか。",
    "Meaning": "Từ/câu này trong tiếng ~ là gì?",
    "Explanation": "Dùng để hỏi cách nói một từ hoặc câu bằng ngôn ngữ khác",
    "Example": "「Thank you」は　日本語[にほんご]で　何[なん]ですか。[Thank you wa Nihongo de nan desu ka.] (Thank you trong tiếng Nhật là gì?)"
  },
  {
    "STT": 38,
    "Lesson": 7,
    "Structure": "N( người) に あげます、かします、おしえます、かけます、..",
    "Meaning": "Cho/ dạy N",
    "Explanation": "Trợ từ に chỉ đối tượng nhận hành động từ người thực hiện",
    "Example": "木村[きむら]さんに　花[はな]を　あげました。[Kimura-san ni hana o agemashita.] (Tôi đã tặng hoa cho chị Kimura.)"
  },
  {
    "STT": 39,
    "Lesson": 7,
    "Structure": "N( người) に　もらいます、ならいます、かりま す、...",
    "Meaning": "Nhận/ học từ N",
    "Explanation": "Trợ từ に chỉ đối tượng mà người nói nhận hành động từ đó",
    "Example": "カリナさんに　CDを　借[か]りました。[Karina-san ni CD o karimashita.] (Tôi đã mượn đĩa CD từ chị Karina.)"
  },
  {
    "STT": 40,
    "Lesson": 7,
    "Structure": "もう　Vました",
    "Meaning": "Đã làm ... rồi",
    "Explanation": "Diễn tả một hành động đã hoàn thành tại thời điểm nói",
    "Example": "もう　荷物[にもつ]を　送[おく]りましたか。[Mou nimotsu o okurimashita ka.] (Bạn đã gửi hành lý chưa?)"
  },
  {
    "STT": 41,
    "Lesson": 8,
    "Structure": "けいようし ( Tính từ )",
    "Meaning": "Tính từ trong tiếng Nhật",
    "Explanation": "Gồm 2 loại: Tính từ đuôi な (na-adj) và Tính từ đuôi い (i-adj).",
    "Example": "富士山[ふじさん]は　高[たか]いです。[Fujisan wa takai desu.] (Núi Phú Sĩ cao.)"
  },
  {
    "STT": 42,
    "Lesson": 8,
    "Structure": "Nは　なーけいようし（な）です Nは　いーけいようし（～い）です。",
    "Meaning": "N thì (tính chất)",
    "Explanation": "Cấu trúc cơ bản để miêu tả đặc điểm của danh từ N. Chú ý tính từ đuôi な bỏ な khi đứng trước です。",
    "Example": "ワットさんは　親切[しんせつ]です。[Watto-san wa shinsetsu desu.] (Thầy Watt thân thiện。) | 日本[にほん]の　食[た]べ物は　おいしいです。[Nihon no tabemono wa oishii desu.] (Đồ ăn Nhật Bản ngon。)"
  },
  {
    "STT": 43,
    "Lesson": 8,
    "Structure": "Dạng nghi vấn của câu tính từ",
    "Meaning": "N có (tính chất) không?",
    "Explanation": "Câu hỏi xác nhận tính chất。 Trả lời bằng はい hoặc いいえ。 Phủ định của な-adj là じゃありません、 của い-adj là bỏ い thêm くないです。",
    "Example": "この　辞書[じしょ]は　いいですか。[Kono jisho wa ii desu ka.] (Cuốn từ điển này có tốt không？) | いいえ、あまり　よくないです。[Iie、 amari yokunai desu.] (Không、 không tốt lắm。)"
  },
  {
    "STT": 44,
    "Lesson": 8,
    "Structure": "なーけいようし : Phần thân + な N | いーけいようし : Phần thân+い N",
    "Meaning": "Tính từ bổ nghĩa cho danh từ",
    "Explanation": "Đặt tính từ trước danh từ để bổ nghĩa。 な-adj phải giữ lại な。",
    "Example": "奈良[なら]は　静[しず]かな　町[まち]です。[Nara wa shizuka na machi desu.] (Nara là một thành phố yên tĩnh。) | おもしろい　本[ほん]を　読[よ]みました。[Omoshiroi hon o yomimashita.] (Tôi đã đọc một cuốn sách thú vị。)"
  },
  {
    "STT": 45,
    "Lesson": 8,
    "Structure": "とても/　あまり",
    "Meaning": "Rất / Không ... lắm",
    "Explanation": "Trạng từ chỉ mức độ。 とても dùng trong câu khẳng định、 あまり dùng trong câu phủ định。",
    "Example": "北京[ぺきん]は　とても　寒[さむ]いです。[Pekin wa totemo samui desu.] (Bắc Kinh rất lạnh。) | この　料理[りょうり]は　あまり　辛[から]くないです。[Kono ryouri wa amari karakunai desu.] (Món ăn này không cay lắm。)"
  },
  {
    "STT": 46,
    "Lesson": 8,
    "Structure": "N　は　どうですか。",
    "Meaning": "N thì thế nào?",
    "Explanation": "Dùng để hỏi về cảm nhận hoặc ý kiến của ai đó về N。",
    "Example": "日本[にほん]の　生活[せいかつ]は　どうですか。[Nihon no seikatsu wa dou desu ka.] (Cuộc sống ở Nhật thế nào？)"
  },
  {
    "STT": 47,
    "Lesson": 8,
    "Structure": "N1は　どんな　N2　ですか。",
    "Meaning": "N1 là N2 như thế nào?",
    "Explanation": "Dùng để hỏi về tính chất cụ thể của một đối tượng trong một phạm vi hoặc loại hình N2。",
    "Example": "ハノイは　どんな　町[まち]ですか。[Hanoi wa donna machi desu ka.] (Hà Nội là một thành phố như thế nào？)"
  },
  {
    "STT": 48,
    "Lesson": 8,
    "Structure": "S1 が、S2",
    "Meaning": "S1 nhưng S2",
    "Explanation": "Trợ từ が nối hai mệnh đề có ý nghĩa tương phản nhau。",
    "Example": "日本[にほん]の　食[た]べ物は　おいしいですが、高[たか]いです。[Nihon no tabemono wa oishii desu ga、 takai desu.] (Đồ ăn Nhật ngon nhưng đắt。)"
  },
  {
    "STT": 49,
    "Lesson": 8,
    "Structure": "どれ",
    "Meaning": "Cái nào",
    "Explanation": "Từ để hỏi lựa chọn một vật trong một nhóm từ ba vật trở lên。",
    "Example": "ミラーさんの　傘[かさ]は　どれですか。[Miraa-san no kasa wa dore desu ka.] (Ô của anh Miller là cái nào？)"
  },
  {
    "STT": 50,
    "Lesson": 9,
    "Structure": "N　が　あります/わかります N　が　すきです/きらいです /じょうずです /へたです",
    "Meaning": "Có/Hiểu N hoặc Thích/Ghét/Giỏi/Kém N",
    "Explanation": "Các động từ và tính từ chỉ sở hữu、 năng lực、 sở thích đi với trợ từ が thay vì を。",
    "Example": "わたしは　イタリア料理[りょうり]が　好[す]きです。[Watashi wa Itaria ryouri ga suki desu.] (Tôi thích món Ý。) | 英語[えいご]が　わかりますか。[Eigo ga wakarimasu ka.] (Bạn có hiểu tiếng Anh không？)"
  },
  {
    "STT": 51,
    "Lesson": 9,
    "Structure": "どんな + N",
    "Meaning": "N như thế nào (thể loại)",
    "Explanation": "Hỏi về sở thích cụ thể trong một nhóm đối tượng danh từ。",
    "Example": "どんな　スポーツが　好[す]きですか。[Donna supootsu ga suki desu ka.] (Bạn thích môn thể thao nào？)"
  },
  {
    "STT": 52,
    "Lesson": 9,
    "Structure": "よく/だいたい/たくさん/すこし/あまり/ぜんぜん",
    "Meaning": "Rất tốt/Đại khái/Nhiều/Ít/Không lắm/Hoàn toàn không",
    "Explanation": "Các trạng từ chỉ mức độ và số lượng。 あまり và ぜんぜん đi với phủ định。",
    "Example": "英語[えいご]が　よく　わかります。[Eigo ga yoku wakarimasu.] (Tôi hiểu rất rõ tiếng Anh。) | お金[かね]が　全然[ぜんぜん]　ありません。[Okane ga zenzen arimasen.] (Tôi hoàn toàn không có tiền。)"
  },
  {
    "STT": 53,
    "Lesson": 9,
    "Structure": "S1から、S2.",
    "Meaning": "Vì S1 nên S2",
    "Explanation": "Mệnh đề trước から chỉ lý do hoặc nguyên nhân。",
    "Example": "時間[じかん]が　ありませんから、タクシーで　行[い]きます。[Jikan ga arimasen kara、 takushii de ikimasu.] (Vì không có thời gian nên tôi đi bằng taxi。)"
  },
  {
    "STT": 54,
    "Lesson": 9,
    "Structure": "どうして",
    "Meaning": "Tại sao",
    "Explanation": "Từ để hỏi lý do。 Câu trả lời kết thúc bằng から。",
    "Example": "どうして　遅[おく]れましたか。ー　バスが　来[き]ませんでしたから。[Doushite okuremashita ka. - Basu ga kimasen deshita kara.] (Tại sao bạn đến muộn？ - Vì xe buýt không đến。)"
  },
  {
    "STT": 55,
    "Lesson": 10,
    "Structure": "N　が　あります/います",
    "Meaning": "Có N",
    "Explanation": "あります dùng cho vật vô tri、 います dùng cho người và động vật。",
    "Example": "コンピューターが　あります。[Konpyuutaa ga arimasu.] (Có máy tính。) | 犬[いぬ]が　います。[Inu ga imasu.] (Có con chó。)"
  },
  {
    "STT": 56,
    "Lesson": 10,
    "Structure": "N1 ( địa điểm)　に　N2　が　あります/います",
    "Meaning": "Ở N1 có N2",
    "Explanation": "Diễn tả sự hiện hữu của N2 tại một địa điểm N1。",
    "Example": "机[つくえ]の　上[うえ]に　写真[しゃしん]が　あります。[Tsukue no ue ni shashin ga arimasu.] (Trên bàn có bức ảnh。)"
  },
  {
    "STT": 57,
    "Lesson": 10,
    "Structure": "N1　は　N2 (địa điểm )　に　あります/います",
    "Meaning": "N1 ở tại N2",
    "Explanation": "Dùng khi muốn nói về vị trí của một chủ thể N1 đã biết。",
    "Example": "ミラーさんは　事務所[じむしょ]に　います。[Miraa-san wa jimusho ni imasu.] (Anh Miller ở văn phòng。)"
  },
  {
    "STT": 58,
    "Lesson": 10,
    "Structure": "N1 ( đồ vật/ con người/ địa điểm)　の　N2( vị trí)　=　N",
    "Meaning": "Vị trí của N1",
    "Explanation": "Sử dụng các danh từ chỉ vị trí như: うえ (trên)、 した (dưới)、 まえ (trước)、 うしろ (sau)、 なか (trong)、 となり (bên cạnh)。",
    "Example": "本[ほん]は　箱[はこ]の　中[なか]に　あります。[Hon wa hako no naka ni arimasu.] (Sách ở trong hộp。)"
  },
  {
    "STT": 59,
    "Lesson": 10,
    "Structure": "N1　や　N2",
    "Meaning": "N1 và N2 (và một số thứ khác)",
    "Explanation": "Dùng để liệt kê danh từ mang tính tiêu biểu (không liệt kê hết tất cả)。",
    "Example": "箱[はこ]の　中[なか]に　手紙[てがみ]や　写真[しゃしん]が　あります。[Hako no naka ni tegami ya shashin ga arimasu.] (Trong hộp có thư、 ảnh và những thứ khác。)"
  },
  {
    "STT": 60,
    "Lesson": 10,
    "Structure": "「Từ hoặc cụm từ 」ですか。",
    "Meaning": "...có phải không?",
    "Explanation": "Dùng để xác nhận lại thông tin vừa nghe。",
    "Example": "すみません、ユナさんは　いますか。ー　ユナさんですか。あちらです。[Sumimasen、 Yuna-san wa imasu ka. - Yuna-san desu ka. Achira desu.] (Xin lỗi、 có cô Yuna ở đây không？ - Cô Yuna hả？ Ở đằng kia kìa。)"
  },
  {
    "STT": 61,
    "Lesson": 10,
    "Structure": "N　は　ありませんか。",
    "Meaning": "Bạn có N không?",
    "Explanation": "Cách hỏi mượn hoặc hỏi mua một món đồ một cách lịch sự tại cửa hàng。",
    "Example": "すみません、日本[にほん]の　地図[ちず]は　ありませんか。[Sumimasen、 Nihon no chizu wa arimasen ka.] (Xin lỗi、 bạn có bản đồ Nhật Bản không？)"
  },
  {
    "STT": 62,
    "Lesson": 11,
    "Structure": "Số từ ( khoảng thời gian)　に　～かい　V",
    "Meaning": "Làm ~ lần trong (khoảng thời gian)",
    "Explanation": "Diễn tả tần suất thực hiện hành động trong một đơn vị thời gian。",
    "Example": "１か月[いっかげつ]に　２回[にかい]　映画[えいが]を　見[み]ます。[Ikkagetsu ni nikai eiga o mimasu.] (Một tháng tôi đi xem phim 2 lần。)"
  },
  {
    "STT": 63,
    "Lesson": 11,
    "Structure": "Số từ　だけ / N　だけ",
    "Meaning": "Chỉ ~",
    "Explanation": "Biểu thị giới hạn về số lượng hoặc đối tượng。 Thường dùng trong câu khẳng định。",
    "Example": "休[やす]みは　日曜日[にちようび]だけです。[Yasumi wa nichiyoubi dake desu.] (Ngày nghỉ chỉ có chủ nhật。)"
  },
  {
    "STT": 64,
    "Lesson": 12,
    "Structure": "Thời quá khứ của câu danh từ (N) và câu tính từ đuôi な (na-adj)",
    "Meaning": "Đã là.../ Đã không là...",
    "Explanation": "Khẳng định: N/Na でした。 Phủ định: N/Na じゃありませんでした。",
    "Example": "きのうは　雨[あめ]でした。[Kinou wa ame deshita.] (Hôm qua đã mưa。) | 先週[せんしゅう]は　暇[ひま]じゃ　ありませんでした。[Senshuu wa hima ja arimasen deshita.] (Tuần trước tôi đã không rảnh rỗi。)"
  },
  {
    "STT": 65,
    "Lesson": 12,
    "Structure": "Thời quá khứ của câu tính từ đuôi い",
    "Meaning": "Đã (tính chất)...",
    "Explanation": "Khẳng định: Bỏ い thêm かったです。 Phủ định: Bỏ い thêm くなかったです。",
    "Example": "きのうは　暑[あつ]かったです。[Kinou wa atsukatta desu.] (Hôm qua đã nóng。) | パーティーは　あまり　楽[たの]しくなかったです。[Paatii wa amari tanoshikunakatta desu.] (Bữa tiệc đã không vui lắm。)"
  },
  {
    "STT": 66,
    "Lesson": 12,
    "Structure": "N1　は　N2　より + “ Tính từ”　です。",
    "Meaning": "N1 (tính chất) hơn N2",
    "Explanation": "So sánh hơn giữa hai đối tượng。",
    "Example": "この　車[くるま]は　あの　車[くるま]より　速[はや]いです。[Kono kuruma wa ano kuruma yori hayai desu.] (Chiếc xe này chạy nhanh hơn chiếc xe kia。)"
  },
  {
    "STT": 67,
    "Lesson": 12,
    "Structure": "N1　と　N2　と　どちらが 　“ Tính từ” 　ですか。　N1　N2　の　ほうが　“ Tính từ” です。",
    "Meaning": "Giữa N1 và N2 cái nào (tính chất) hơn? N1/N2 (tính chất) hơn。",
    "Explanation": "Câu hỏi so sánh lựa chọn giữa hai vật。 Trả lời dùng ～のほうが。",
    "Example": "サッカーと　野球[やきゅう]と　どちらが　おもしろいですか。ー　サッカーのほうが　おもしろいです。[Sakkaa to yakyuu to dochira ga omoshiroi desu ka. - Sakkaa no hou ga omoshiroi desu.] (Bóng đá và bóng chày、 cái nào thú vị hơn？ - Bóng đá thú vị hơn。)"
  },
  {
    "STT": 68,
    "Lesson": 12,
    "Structure": "N1　[ のなか ]　で　[なに/どこ/だれ/いつ]　が　いちばん “ Tính từ” 　ですか。N2　が　いちばん　“ Tính từ” です。",
    "Meaning": "Trong phạm vi N1 thì cái gì/đâu/ai/khi nào là nhất?",
    "Explanation": "So sánh nhất trong một tập hợp từ 3 đối tượng trở lên。",
    "Example": "日本料理[にほんりょうり]の　中[なか]で　何[なに]が　いちばん　好[す]きですか。ー　天[てん]ぷらが　いちばん　好[す]きです。[Nihon ryouri no naka de nani ga ichiban suki desu ka. - Tenpura ga ichiban suki desu.] (Trong các món ăn Nhật、 bạn thích món nào nhất？ - Tôi thích Tempura nhất。)"
  },
  {
    "STT": 69,
    "Lesson": 13,
    "Structure": "N 　が　ほしい　です",
    "Meaning": "Muốn có N",
    "Explanation": "Bày tỏ nguyện vọng sở hữu một đồ vật của người nói。",
    "Example": "わたしは　新[あたら]しい　車[くるま]が　欲[ほ]しいです。[Watashi wa atarashii kuruma ga hoshii desu.] (Tôi muốn có một chiếc xe hơi mới。)"
  },
  {
    "STT": 70,
    "Lesson": 13,
    "Structure": "Thể Vます　＋　たいです",
    "Meaning": "Muốn làm V",
    "Explanation": "Bày tỏ nguyện vọng thực hiện một hành động của người nói。 Trợ từ を có thể chuyển thành が。",
    "Example": "わたしは　日本[にほん]へ　行[い]きたいです。[Watashi wa Nihon e ikitai desu.] (Tôi muốn đi Nhật。) | 水[みず]を（が）飲[の]みたいです。[Mizu o (ga) nomitai desu.] (Tôi muốn uống nước。)"
  },
  {
    "STT": 71,
    "Lesson": 13,
    "Structure": "N　(địa điểm)　へ　[ Thể ます/N ] に　行(い)きます/来(き)ます/帰(かえ)ります",
    "Meaning": "Đi/đến/về để làm gì đó",
    "Explanation": "Mục đích của việc di chuyển。 Nếu là động từ thì bỏ ます、 nếu là danh từ thì phải là danh động từ。",
    "Example": "神戸[こうべ]へ　日本料理[にほんりょうり]を　食[た]べに　行[い]きます。[Koube e Nihon ryouri o tabe ni ikimasu.] (Tôi đi Kobe để ăn món Nhật。) | デパートへ　買[か]い物[もの]に　行[い]きます。[Depaato e kaimono ni ikimasu.] (Tôi đi bách hóa để mua sắm。)"
  },
  {
    "STT": 72,
    "Lesson": 13,
    "Structure": "N に V / N を V",
    "Meaning": "Vào N / Làm N (với trợ từ đặc biệt)",
    "Explanation": "Phân biệt trợ từ tùy theo động từ: に thường dùng với động từ mang tính tiếp cận hoặc đích đến。",
    "Example": "喫茶店[きっさてん]に　入[はい]ります。[Kissaten ni hairimasu.] (Vào quán giải khát。) | 喫茶店[きっさてん]を　出[で]ます。[Kissaten o demasu.] (Ra khỏi quán giải khát。)"
  },
  {
    "STT": 73,
    "Lesson": 13,
    "Structure": "どこか / なにか",
    "Meaning": "Đâu đó / Cái gì đó",
    "Explanation": "Dùng khi không xác định cụ thể địa điểm hoặc vật thể。 Trợ từ へ、 を thường được lược bỏ。",
    "Example": "どこか　行[い]きましたか。[Doko ka ikimashita ka.] (Bạn có đi đâu đó không？) | 何[なに]か　飲[の]みたいです。[Nani ka nomitai desu.] (Tôi muốn uống cái gì đó。)"
  },
  {
    "STT": 74,
    "Lesson": 13,
    "Structure": "ごちゅうもん",
    "Meaning": "Việc gọi món (lịch sự)",
    "Explanation": "Thêm ご trước danh từ âm Hán để thể hiện sự kính trọng của nhân viên với khách hàng。",
    "Example": "ご注文[ちゅうもん]は？[Go-chuumon wa?] (Quý khách dùng gì ạ？)"
  },
  {
    "STT": 75,
    "Lesson": 14,
    "Structure": "Thể て",
    "Meaning": "Động từ chia thể て",
    "Explanation": "Thể nối của động từ。 Cách chia tùy thuộc vào nhóm động từ 1、 2 hoặc 3。",
    "Example": "書[か]いて [kaite] (viết) | 食[た]べて [tabete] (ăn) | 来[き]て [kite] (đến)"
  },
  {
    "STT": 76,
    "Lesson": 14,
    "Structure": "Thểて　+　ください",
    "Meaning": "Hãy làm V",
    "Explanation": "Dùng để yêu cầu、 sai khiến hoặc mời ai đó làm gì một cách lịch sự。",
    "Example": "ここに　名前[なまえ]を　書[か]いて　ください。[Koko ni namae o kaite kudasai.] (Hãy viết tên vào đây。)"
  },
  {
    "STT": 77,
    "Lesson": 14,
    "Structure": "Thểて＋います",
    "Meaning": "Đang làm V",
    "Explanation": "Diễn tả một hành động đang diễn ra tại thời điểm nói。",
    "Example": "ミラーさんは　今[いま]　電話[でんわ]を　かけて　います。[Miraa-san wa ima denwa o kakete imasu.] (Anh Miller đang gọi điện thoại。)"
  },
  {
    "STT": 78,
    "Lesson": 14,
    "Structure": "Thể ます　＋　ましょうか",
    "Meaning": "Để tôi làm ... cho nhé?",
    "Explanation": "Dùng khi người nói đề nghị giúp đỡ người nghe。",
    "Example": "荷物[にもつ]を　持[も]ちましょうか。[Nimotsu o mochimashou ka.] (Để tôi cầm hành lý giúp bạn nhé？)"
  },
  {
    "STT": 79,
    "Lesson": 14,
    "Structure": "S1　が、S2",
    "Meaning": "S1、 nhưng S2 (Nối câu)",
    "Explanation": "Tương tự bài 8、 nhưng dùng để nối hai mệnh đề bất kỳ có ý tương phản。",
    "Example": "失礼[しつれい]ですが、お名前[なまえ]は？[Shitsurei desu ga、 onamae wa?] (Xin lỗi、 nhưng tên bạn là gì？)"
  },
  {
    "STT": 80,
    "Lesson": 14,
    "Structure": "N　が　V",
    "Meaning": "N làm V (miêu tả hiện tượng)",
    "Explanation": "Dùng が để nhấn mạnh chủ thể của một hành động khách quan hoặc miêu tả hiện tượng thiên nhiên。",
    "Example": "雨[あめ]が　降[ふ]って　います。[Ame ga futte imasu.] (Trời đang mưa。)"
  },
  {
    "STT": 81,
    "Lesson": 15,
    "Structure": "Vてもいいです",
    "Meaning": "Được phép làm V",
    "Explanation": "Diễn tả sự cho phép hoặc xin phép làm một việc gì đó。",
    "Example": "写真[しゃしん]を　撮[と]っても　いいですか。[Shashin o totte mo ii desu ka.] (Tôi chụp ảnh có được không？)"
  },
  {
    "STT": 82,
    "Lesson": 15,
    "Structure": "Vては　いけません",
    "Meaning": "Không được làm V",
    "Explanation": "Diễn tả sự cấm đoán hoặc quy định không được làm gì。",
    "Example": "ここで　たばこを　吸[す]ってはいけません。[Koko de tabako o sutte wa ikemasen.] (Không được hút thuốc ở đây。)"
  },
  {
    "STT": 83,
    "Lesson": 15,
    "Structure": "Vて　います",
    "Meaning": "Đang làm V (Trạng thái)",
    "Explanation": "Diễn tả một trạng thái là kết quả của một hành động trong quá khứ vẫn còn tiếp diễn。",
    "Example": "わたしは　結婚[けっこん]して　います。[Watashi wa kekkon shite imasu.] (Tôi đã kết hôn / Tôi đang có gia đình。)"
  },
  {
    "STT": 84,
    "Lesson": 15,
    "Structure": "Vて　います (Những hành động có tính lâu dài)",
    "Meaning": "Đang làm V (Nghề nghiệp / Thói quen)",
    "Explanation": "Diễn tả những hành động lặp đi lặp lại hoặc nghề nghiệp、 nơi cư trú。",
    "Example": "IMCで　働[はたら]いて　います。[IMC de hataraite imasu.] (Tôi đang làm việc tại công ty IMC。) | スーパーで　売[う]って　います。[Suupaa de utte imasu.] (Có bán ở siêu thị。)"
  },
  {
    "STT": 85,
    "Lesson": 15,
    "Structure": "しりません",
    "Meaning": "Không biết",
    "Explanation": "Dạng phủ định của しっています。 Chú ý không dùng しっていません。",
    "Example": "市役所[しやくしょ]の　電話番号[でんわばんごう]を　知[し]っていますか。ー　いいえ、知りません。[Shiyakusho no denwabangou o shitte imasu ka. - Iie、 shirimasen.] (Bạn có biết số điện thoại tòa thị chính không？ - Không、 tôi không biết。)"
  },
  {
    "STT": 86,
    "Lesson": 16,
    "Structure": "V1て、V2て、～",
    "Meaning": "Làm V1、 rồi V2...",
    "Explanation": "Dùng để liệt kê các hành động theo trình tự thời gian。",
    "Example": "朝[あさ]　ジョギングをして、シャワーを　浴[あ]びて、会社[かいしゃ]へ　行[い]きます。[Asa jogingu o shite、 shawaa o abite、 kaisha e ikimasu.] (Sáng tôi chạy bộ、 tắm rồi đi làm。)"
  },
  {
    "STT": 87,
    "Lesson": 16,
    "Structure": "V1て　+　から、　V2。",
    "Meaning": "Sau khi làm V1 thì làm V2",
    "Explanation": "Nhấn mạnh trình tự: hành động V2 chỉ xảy ra sau khi V1 đã kết thúc。",
    "Example": "仕事[しごと]が　終[お]わってから、飲[の]みに　行[い]きませんか。[Shigoto ga owatte kara、 nomi ni ikimasen ka.] (Sau khi xong việc、 cùng đi uống nhé？)"
  },
  {
    "STT": 88,
    "Lesson": 16,
    "Structure": "い - adj ( ～い ) => ～くて、～",
    "Meaning": "Tính từ đuôi い (Nối câu)",
    "Explanation": "Cách nối hai tính từ đuôi い hoặc tính từ đuôi い với một mệnh đề khác (bỏ い thêm くて)。",
    "Example": "この　部屋[へや]は　広[ひろ]くて、明[あか]るいです。[Kono heya wa hirokute、 akarui desu.] (Căn phòng này rộng và sáng。)"
  },
  {
    "STT": 89,
    "Lesson": 16,
    "Structure": "[N / な- adj] + で、～",
    "Meaning": "Danh từ / Tính từ đuôi な (Nối câu)",
    "Explanation": "Cách nối danh từ hoặc tính từ đuôi な (thêm で)。",
    "Example": "ミラーさんは　ハンサムで、親切[しんせつ]です。[Miraa-san wa hansamu de、 shinsetsu desu.] (Anh Miller vừa đẹp trai vừa tử tế。) | カリナさんは　学生[がくせい]で、マリアさんは　主婦[しゅふ]です。[Karina-san wa gakusei de、 Maria-san wa shufu desu.] (Karina là sinh viên、 còn Maria là nội trợ。)"
  },
  {
    "STT": 90,
    "Lesson": 16,
    "Structure": "N1　は　N2が “ Tính từ”",
    "Meaning": "N1 có N2 thì (tính chất)",
    "Explanation": "Dùng để miêu tả đặc điểm một bộ phận (N2) của một chủ thể (N1)。",
    "Example": "マリアさんは　髪[かみ]が　長[なが]いです。[Maria-san wa kami ga nagai desu.] (Chị Maria có mái tóc dài。)"
  },
  {
    "STT": 91,
    "Lesson": 16,
    "Structure": "どうやって",
    "Meaning": "Làm thế nào / Bằng cách nào",
    "Explanation": "Dùng để hỏi về cách thức hoặc quy trình thực hiện。",
    "Example": "大学[だいがく]まで　どうやって　行[い]きますか。[Daigaku made dou yatte ikimasu ka.] (Làm thế nào để đi đến trường đại học？)"
  },
  {
    "STT": 92,
    "Lesson": 16,
    "Structure": "どの　N",
    "Meaning": "Cái N nào",
    "Explanation": "Từ để hỏi nhằm xác định một đối tượng cụ thể trong nhóm từ 3 đối tượng trở lên。",
    "Example": "サントスさんは　どの　人[ひと]ですか。[Santosu-san wa dono hito desu ka.] (Anh Santos là người nào？)"
  },
  {
    "STT": 93,
    "Lesson": 17,
    "Structure": "Thể ない",
    "Meaning": "Động từ thể phủ định ngắn",
    "Explanation": "Cách chia động từ sang thể ない (Nhóm 1: cột i -> cột a + nai; Nhóm 2: bỏ masu + nai; Nhóm 3: konai、 shinai)。",
    "Example": "書[か]かない [kakanai] (không viết) | 食[た]べない [tabenai] (không ăn) | しない [shinai] (không làm)"
  },
  {
    "STT": 94,
    "Lesson": 17,
    "Structure": "Thể ない　+　ないで　ください",
    "Meaning": "Xin đừng làm V",
    "Explanation": "Dùng để yêu cầu ai đó không thực hiện hành động nào đó。",
    "Example": "ここで　写真[しゃしん]を　撮[と]らないで　ください。[Koko de shashin o toranaide kudasai.] (Xin đừng chụp ảnh ở đây。)"
  },
  {
    "STT": 95,
    "Lesson": 17,
    "Structure": "Thể ない＋　なくても　いいです",
    "Meaning": "Không làm V cũng được",
    "Explanation": "Diễn tả sự không cần thiết phải thực hiện một hành động。",
    "Example": "あした　来[こ]なくても　いいです。[Ashita konakute mo ii desu.] (Ngày mai không đến cũng được。)"
  },
  {
    "STT": 96,
    "Lesson": 17,
    "Structure": "Thể ない＋　なければ　なりません",
    "Meaning": "Phải làm V",
    "Explanation": "Diễn tả một nghĩa vụ hoặc sự cần thiết bắt buộc phải làm。",
    "Example": "薬[くすり]を　飲[の]まなければ　なりません。[Kusuri o nomanakereba narimasen.] (Phải uống thuốc。)"
  },
  {
    "STT": 97,
    "Lesson": 17,
    "Structure": "N (đối tượng) は",
    "Meaning": "Về N thì... (Nhấn mạnh tân ngữ)",
    "Explanation": "Đưa tân ngữ lên làm chủ đề của câu để nhấn mạnh hoặc so sánh。",
    "Example": "ここに　荷物[にもつ]を　置[お]かないで　ください。荷物[にもつ]は　あちらに　置[お]いて　ください。[Koko ni nimotsu o okanaide kudasai. Nimotsu wa achira ni oite kudasai.] (Đừng để hành lý ở đây。 Hành lý thì hãy để ở đằng kia。)"
  },
  {
    "STT": 98,
    "Lesson": 17,
    "Structure": "N　(thời gian)　までに　V",
    "Meaning": "Trước N (hạn chót)",
    "Explanation": "Chỉ giới hạn thời gian mà một hành động phải được thực hiện xong。",
    "Example": "レポートは　金曜日[きんようび]までに　出[だ]して　ください。[Repooto wa kinyoubi made ni dashite kudasai.] (Hãy nộp báo cáo trước thứ Sáu。)"
  },
  {
    "STT": 99,
    "Lesson": 18,
    "Structure": "Thể từ điển（じしょけい)",
    "Meaning": "Động từ thể nguyên dạng",
    "Explanation": "Thể cơ bản của động từ dùng để tra từ điển。",
    "Example": "書[か]く [kaku] (viết) | 食[た]べる [taberu] (ăn) | 来[く]る [kuru] (đến)"
  },
  {
    "STT": 100,
    "Lesson": 18,
    "Structure": "[Danh từ / Vる こと] ができます",
    "Meaning": "Có thể làm V / Có thể (khả năng)",
    "Explanation": "Diễn tả năng lực hoặc khả năng thực hiện một việc gì đó。",
    "Example": "ミラーさんは　日本語[にほんご]が　できます。[Miraa-san wa Nihongo ga dekimasu.] (Anh Miller có thể nói tiếng Nhật。) | 漢字[かんじ]を　読[よ]むことが　できます。[Kanji o yomu koto ga dekimasu.] (Tôi có thể đọc được chữ Hán。)"
  },
  {
    "STT": 101,
    "Lesson": 18,
    "Structure": "わたしの しゅみは [N / Vること] です",
    "Meaning": "Sở thích của tôi là N / việc làm V",
    "Explanation": "Dùng để giới thiệu về sở thích cá nhân。",
    "Example": "わたしの　趣味[しゅみ]は　音楽[おんがく]です。[Watashi no shumi wa ongaku desu.] (Sở thích của tôi là âm nhạc。) | わたしの　趣味[しゅみ]は　絵[え]を　描[か]くことです。[Watashi no shumi wa e o kaku koto desu.] (Sở thích của tôi là vẽ tranh。)"
  },
  {
    "STT": 102,
    "Lesson": 18,
    "Structure": "[V1る / Nの / Số từ chỉ một khoảng thời gian] まえに、 V2",
    "Meaning": "Trước khi làm V1/N thì làm V2",
    "Explanation": "Chỉ trình tự thời gian của hành động。",
    "Example": "寝[ね]る　まえに、本[ほん]を　読[よ]みます。[Neru mae ni、 hon o yomimasu.] (Trước khi ngủ tôi đọc sách。) | 食事[しょくじ]の　まえに、手[て]を　洗[あら]います。[Shokuji no mae ni、 te o araimasu.] (Trước bữa ăn tôi rửa tay。) | ３年[さんねん]まえに、日本[にほん]へ　来[き]ました。[Sannen mae ni、 Nihon e kimashita.] (Tôi đã đến Nhật 3 năm trước。)"
  },
  {
    "STT": 103,
    "Lesson": 18,
    "Structure": "なかなか",
    "Meaning": "Mãi mà chưa... / Khó mà...",
    "Explanation": "Thường đi với phủ định để diễn tả một việc mong đợi nhưng chưa thực hiện được。",
    "Example": "日本[にほん]では　なかなか　馬[うま]を　見[み]ることが　できません。[Nihon de wa naka naka uma o miru koto ga dekimasen.] (Ở Nhật mãi mà chẳng thể nhìn thấy ngựa / Khó lòng mà thấy ngựa ở Nhật。)"
  },
  {
    "STT": 104,
    "Lesson": 18,
    "Structure": "ぜひ",
    "Meaning": "Nhất định",
    "Explanation": "Dùng để nhấn mạnh nguyện vọng hoặc lời mời。",
    "Example": "ぜひ　北海道[ほっかいどう]へ　行[い]きたいです。[Zehi Hokkaido e ikitai desu.] (Tôi rất muốn đi Hokkaido。) | ぜひ　遊[あそ]びに　来[き]て　ください。[Zehi asobi ni kite kudasai.] (Nhất định hãy ghé chơi nhé。)"
  },
  {
    "STT": 105,
    "Lesson": 19,
    "Structure": "Thể た",
    "Meaning": "Động từ thể quá khứ ngắn",
    "Explanation": "Cách chia tương tự thể て nhưng thay [te/de] bằng [ta/da]。",
    "Example": "書[か]いた [kaita] (đã viết) | 食[た]べた [tabeta] (đã ăn) | 来[き]た [kita] (đã đến)"
  },
  {
    "STT": 106,
    "Lesson": 19,
    "Structure": "V たことが あります",
    "Meaning": "Đã từng làm V",
    "Explanation": "Diễn tả một trải nghiệm hoặc kinh nghiệm trong quá khứ。",
    "Example": "日本[にほん]へ　行[い]ったことが　あります。[Nihon e itta koto ga arimasu.] (Tôi đã từng đi Nhật。)"
  },
  {
    "STT": 107,
    "Lesson": 19,
    "Structure": "Vたり、 Vたり　します",
    "Meaning": "Làm V1、 làm V2... (Liệt kê)",
    "Explanation": "Dùng để liệt kê một vài hành động tiêu biểu trong số nhiều hành động。",
    "Example": "日曜日は　テニスをしたり、映画を　見たり　します。[Nichiyoubi wa tenisu o shitari、 eiga o mitari shimasu.] (Chủ nhật tôi lúc thì chơi tennis、 lúc thì xem phim。)"
  },
  {
    "STT": 108,
    "Lesson": 19,
    "Structure": "[Tính từ đuôi い（～い）→ く / Tính từ đuôi な（～な）→ に / N に] なります",
    "Meaning": "Trở nên / Trở thành",
    "Explanation": "Diễn tả sự thay đổi về trạng thái hoặc tính chất。",
    "Example": "寒[さむ]く　なります。[Samuku narimasu.] (Trời trở nên lạnh。) | 元気[げんき]に　なります。[Genki ni narimasu.] (Trở nên khỏe mạnh。) | ２５歳[にじゅうごさい]に　なります。[Nijuugosai ni narimasu.] (Sẽ sang tuổi 25。)"
  },
  {
    "STT": 109,
    "Lesson": 19,
    "Structure": "そうですね",
    "Meaning": "Đúng vậy nhỉ / Để tôi xem...",
    "Explanation": "Dùng để đồng tình với ý kiến người khác hoặc câu đệm khi đang suy nghĩ trả lời。",
    "Example": "もう　冬[ふゆ]ですね。ー　そうですね。[Mou fuyu desu ne. - Sou desu ne.] (Đã mùa đông rồi nhỉ。 - Đúng vậy nhỉ。)"
  },
  {
    "STT": 110,
    "Lesson": 20,
    "Structure": "Thể văn lịch sự và thể văn thông thường",
    "Meaning": "Kính ngữ vs Thể ngắn",
    "Explanation": "Thể lịch sự (Desu/Masu) dùng với người lạ / trên; Thể thông thường (Thể ngắn) dùng với bạn bè / người thân。",
    "Example": "行[い]きます (Lịch sự) - 行[い]く (Thông thường) [Ikimasu - Iku] | 美味[おい]しいです (Lịch sự) - 美味[おい]しい (Thông thường) [Oishii desu - Oishii]"
  },
  {
    "STT": 111,
    "Lesson": 20,
    "Structure": "Sử dụng thể văn thông thường hay thể văn lịch sự ?",
    "Meaning": "Quy tắc giao tiếp",
    "Explanation": "Giải thích về đối tượng và hoàn cảnh sử dụng hai loại văn phong này。",
    "Example": "（Học quy tắc không có ví dụ trực tiếp bằng câu）"
  },
  {
    "STT": 112,
    "Lesson": 20,
    "Structure": "Hội thoại bằng thể thông thường",
    "Meaning": "Giao tiếp thân mật",
    "Explanation": "Trong hội thoại ngắn、 trợ từ có thể lược bỏ、 câu hỏi không dùng か mà lên giọng cuối câu。",
    "Example": "ごはん　食[た]べる？ー　うん、食[た]べる。[Gohan taberu? - Un、 taberu.] (Ăn cơm không？ - Ừ、 ăn。)"
  },
  {
    "STT": 113,
    "Lesson": 20,
    "Structure": "けど",
    "Meaning": "Nhưng (thông thường)",
    "Explanation": "Là dạng thông thường của trợ từ が (nghĩa là \"nhưng\")。",
    "Example": "その　カレー、おいしい？ー　辛[から]いけど、おいしい。[Sono karee、 oishii? - Karai kedo、 oishii.] (Món cà ri đó ngon không？ - Cay nhưng mà ngon。)"
  },
  {
    "STT": 114,
    "Lesson": 21,
    "Structure": "（Thể văn thông thường）と おもいます",
    "Meaning": "Tôi nghĩ rằng...",
    "Explanation": "Dùng để bày tỏ ý kiến hoặc suy đoán của người nói。",
    "Example": "あしたは　雨[あめ]だと　思[おom]います。[Ashita wa ame da to omoimasu.] (Tôi nghĩ ngày mai trời sẽ mưa。)"
  },
  {
    "STT": 115,
    "Lesson": 21,
    "Structure": "“Câu nói” と　いいます ( Thể văn thông thường )",
    "Meaning": "Nói rằng...",
    "Explanation": "Dùng để trích dẫn trực tiếp hoặc gián tiếp một lời nói。",
    "Example": "田中[たなか]さんは　「おやすみなさい」と　言[い]いました。[Tanaka-san wa oyasuminasai to iimashita.] (Anh Tanaka đã nói là \"\"Chúc ngủ ngon\"\"。)"
  },
  {
    "STT": 116,
    "Lesson": 21,
    "Structure": "V | Tính từ đuôi い | Tính từ đuôi な | Thể văn thông thường（～だ）",
    "Meaning": "Dạng bổ nghĩa cho danh từ",
    "Explanation": "Xác nhận lại cách chia các loại từ về thể thông thường để bổ nghĩa cho cấu trúc khác。",
    "Example": "あした　暇[ひま]だと　思[おも]います。[Ashita hima da to omoimasu.] (Tôi nghĩ ngày mai rảnh。)"
  },
  {
    "STT": 117,
    "Lesson": 21,
    "Structure": "N1 (địa điểm) で　N2　が　あります。",
    "Meaning": "N2 được tổ chức/xảy ra tại N1",
    "Explanation": "Dùng あります với nghĩa là tổ chức (sự kiện、 lễ hội、 tai nạn) thay vì sở hữu。",
    "Example": "東京[とうきょう]で　お祭[まつ]りが　あります。[Toukyou de omatsuri ga arimasu.] (Ở Tokyo có lễ hội。)"
  },
  {
    "STT": 118,
    "Lesson": 21,
    "Structure": "N ( dịp) で",
    "Meaning": "Vào dịp N",
    "Explanation": "Dùng trợ từ で để chỉ bối cảnh hoặc cơ hội。",
    "Example": "会議[かいぎ]で　意見[いけん]を　言[い]いました。[Kaigi de iken o iimashita.] (Tôi đã phát biểu ý kiến trong cuộc họp。)"
  },
  {
    "STT": 119,
    "Lesson": 21,
    "Structure": "NđemoV",
    "Meaning": "Làm V ngay cả N (ví dụ)",
    "Explanation": "Dùng để đưa ra một gợi ý hoặc ví dụ tiêu biểu。",
    "Example": "ちょっと　ビールでも　飲[の]みませんか。[Chotto biiru demo nomimasen ka.] (Uống chút bia hay gì đó không？)"
  },
  {
    "STT": 120,
    "Lesson": 21,
    "Structure": "Thể ない＋ないと...",
    "Meaning": "Phải...",
    "Explanation": "Là dạng rút gọn của ～なければなりません trong hội thoại thân mật。",
    "Example": "もう　帰[かえ]らないと…。[Mou kaeranaito...] (Tôi phải về rồi...)"
  },
  {
    "STT": 121,
    "Lesson": 22,
    "Structure": "Mệnh đề định ngữ:",
    "Meaning": "Mệnh đề bổ nghĩa cho danh từ",
    "Explanation": "Dùng một câu (kết thúc bằng thể thông thường) để bổ nghĩa cho một danh từ。",
    "Example": "これは　ミラーさんが　書[か]いた　本[ほん]です。[Kore wa Miraa-san ga kaita hon desu.] (Đây là cuốn sách anh Miller đã viết。)"
  },
  {
    "STT": 122,
    "Lesson": 22,
    "Structure": "Thể từ điển +　じかん/やくそく/ようじ",
    "Meaning": "Thời gian/Hẹn/Việc để làm V",
    "Explanation": "Dùng mệnh đề định ngữ để nói rõ nội dung của thời gian、 cuộc hẹn hoặc công việc。",
    "Example": "わたしは　漢字[かんじ]を　勉強[べんきょう]する　時間[じかん]が　ありません。[Watashi wa kanji o benkyou suru jikan ga arimasen.] (Tôi không có thời gian để học chữ Hán。)"
  },
  {
    "STT": 123,
    "Lesson": 23,
    "Structure": "Động từ、 tính từ đuôi い ở とき、～　: Mệnh đề trạng",
    "Meaning": "Khi...",
    "Explanation": "Dùng để nối hai mệnh đề chỉ thời điểm xảy ra một trạng thái hay hành động。",
    "Example": "図書館[としょかん]で　本[ほん]を　借[か]くとき、カードが　要[い]ります。[Toshokan de hon o kariru toki、 kaado ga irimasu.] (Khi mượn sách ở thư viện cần có thẻ。)"
  },
  {
    "STT": 124,
    "Lesson": 23,
    "Structure": "Thể từ điển（Vる) 、 Thể た（Vた）",
    "Meaning": "Vる とき vs Vた とき",
    "Explanation": "Vる とき: Trước khi làm/Trong khi làm。 Vた とき: Sau khi đã làm xong。",
    "Example": "国[くに]へ　帰[かえ]る　とき、かばんを　買[か]いました。[Kuni e kaeru toki、 kaban o kaimashita.] (Trên đường về nước tôi đã mua cặp。) | 国[くに]へ　帰[かえ]った　とき、かばんを　買[か]いました。[Kuni e kaetta toki、 kaban o kaimashita.] (Sau khi về nước tôi đã mua cặp。)"
  },
  {
    "STT": 125,
    "Lesson": 23,
    "Structure": "Thể từ điển＋と",
    "Meaning": "Hễ làm V thì...",
    "Explanation": "Diễn tả một kết quả tất yếu、 một hệ quả tự nhiên hoặc hướng dẫn đường đi。",
    "Example": "この　ボタンを　押[お]すと、お釣[つ]りが　出[で]ます。[Kono botan o osu to、 otsuri ga demasu.] (Hễ ấn nút này thì tiền thừa sẽ ra。)"
  },
  {
    "STT": 126,
    "Lesson": 23,
    "Structure": "N が　tính từ/ động từ:",
    "Meaning": "Chủ ngữ trong mệnh đề phụ",
    "Explanation": "Trong mệnh đề có とき hoặc と、 chủ ngữ được biểu thị bằng trợ từ が。",
    "Example": "音[おと]が　小[ちい]さいとき、この　つまみを　回[まわ]してください。[Oto ga chiisai toki、 kono tsumami o mawashite kudasai.] (Khi âm thanh nhỏ、 hãy vặn cái núm này。)"
  },
  {
    "STT": 127,
    "Lesson": 23,
    "Structure": "N ( địa điểm) 　を　V ( động từ miêu tả sự di chuyển)",
    "Meaning": "Đi qua/Dọc theo N",
    "Explanation": "Dùng を với các động từ di chuyển để chỉ không gian di chuyển。",
    "Example": "公園[こうえん]を　散歩[さんぽ]します。[Kouen o sanpo shimasu.] (Đi dạo trong công viên。)"
  },
  {
    "STT": 128,
    "Lesson": 24,
    "Structure": "くれます",
    "Meaning": "Cho (tôi)",
    "Explanation": "Dùng khi người khác cho người nói hoặc người trong gia đình người nói một vật gì đó。",
    "Example": "佐藤[さとう]さんは　わたしに　花[はな]を　くれました。[Satou-san wa watashi ni hana o kuremashita.] (Chị Sato đã tặng hoa cho tôi。)"
  },
  {
    "STT": 129,
    "Lesson": 24,
    "Structure": "Thể て + あげます、 もらいます、 くれます",
    "Meaning": "Làm V cho/được làm V cho",
    "Explanation": "Diễn tả việc tặng/nhận một hành động (giúp đỡ、 phục vụ)。",
    "Example": "わたしは　木村[きむら]さんに　本[ほん]を　貸[か]して　あげました。[Watashi wa Kimura-san ni hon o kashite agemashita.] (Tôi đã cho chị Kimura mượn sách。) | わたしは　鈴木[すずき]さんに　日本語[にほんご]を　教[おし]えて　もらいました。[Watashi wa Suzuki-san ni Nihongo o oshiete moraimashita.] (Tôi đã được anh Suzuki dạy tiếng Nhật cho。) | 家内[かない]は　わたしに　ネクタイを　買[か]って　くれました。[Kanai wa watashi ni nekutai o katte kuremashita.] (Vợ tôi đã mua cà vạt cho tôi。)"
  },
  {
    "STT": 130,
    "Lesson": 25,
    "Structure": "Thể quá khứ thông thường +ら",
    "Meaning": "Nếu/Sau khi...",
    "Explanation": "Cách chia thể điều kiện ～たら (Vた/N/Adj quá khứ thêm ら)。",
    "Example": "雨[あめ]が　降[ふ]ったら、行[い]きません。[Ame ga futtara、 ikimasen.] (Nếu trời mưa tôi sẽ không đi。)"
  },
  {
    "STT": 131,
    "Lesson": 25,
    "Structure": "Vた＋ら、～：",
    "Meaning": "Sau khi làm V thì...",
    "Explanation": "Nhấn mạnh một hành động xảy ra sau khi một hành động khác kết thúc。",
    "Example": "１０時[じゅうじ]に　なったら、出[で]かけましょう。[Juuji ni nattara、 dekakemashou.] (Sau khi đến 10 giờ thì chúng ta cùng đi nhé。)"
  },
  {
    "STT": 132,
    "Lesson": 25,
    "Structure": "Thể て | Tính từ đuôi い、 な",
    "Meaning": "Mặc dù... nhưng...",
    "Explanation": "Cách chia thể ～ても (V/Adj/N sang thể て thêm も)。",
    "Example": "雨[あめ]が　降[ふ]っても、洗濯[せんたく]します。[Ame ga futte mo、 sentaku shimasu.] (Mặc dù trời mưa nhưng tôi vẫn giặt đồ。)"
  },
  {
    "STT": 133,
    "Lesson": 25,
    "Structure": "もし　và　いくら",
    "Meaning": "Nếu / Cho dù...",
    "Explanation": "もし đi kèm với たら để nhấn mạnh giả định。 いくら đi kèm với ても để nhấn mạnh sự đối lập。",
    "Example": "もし　１億円[いちおくえん]　あったら、旅行[りょこう]します。[Moshi ichioku-en attara、 ryokou shimasu.] (Nếu có 100 triệu Yên tôi sẽ đi du lịch。) | いくら　考[かんが]えても、わかりません。[Ikura kangaete mo、 wakarimasen.] (Cho dù có suy nghĩ bao nhiêu đi nữa tôi cũng không hiểu。)"
  },
  {
    "STT": 134,
    "Lesson": 25,
    "Structure": "N が",
    "Meaning": "Chủ ngữ trong mệnh đề điều kiện",
    "Explanation": "Giống bài 23、 chủ ngữ của mệnh đề chứa たら/ても dùng trợ từ が。",
    "Example": "友達[ともだち]が　来[く]るまえに、掃除[そうじ]します。[Tomodachi ga kuru mae ni、 souji shimasu.] (Trước khi bạn đến tôi sẽ dọn dẹp。)"
  },
  {
    "STT": 135,
    "Lesson": 26,
    "Structure": "Vていただけませんか",
    "Meaning": "Làm ơn V giúp tôi được không?",
    "Explanation": "Mẫu câu nhờ vả lịch sự hơn Vてください。",
    "Example": "いい　先生[せんせい]を　紹介[しょうかい]して　いただけませんか。[Ii sensei o shoukai shite itadakemasen ka.] (Anh/chị có thể giới thiệu cho tôi một giáo viên tốt được không？)"
  },
  {
    "STT": 136,
    "Lesson": 26,
    "Structure": "Từ để hỏi + Vたら　いいですか",
    "Meaning": "Tôi nên làm V thế nào?",
    "Explanation": "Dùng để xin lời khuyên hoặc hướng dẫn từ người khác。",
    "Example": "どこで　カメラを　買[か]ったら　いいですか。[Doko de kamera o kattara ii desu ka.] (Tôi nên mua máy ảnh ở đâu thì tốt nhỉ？)"
  },
  {
    "STT": 137,
    "Lesson": 26,
    "Structure": "Thể thông thường + んです",
    "Meaning": "Giải thích lý do/Nhấn mạnh",
    "Explanation": "Dùng để giải thích hoàn cảnh、 nhấn mạnh thông tin hoặc hỏi sâu thêm về lý do (N/Na + な + んです)。",
    "Example": "どうして　遅[おく]れたんですか。ー　バスが　来[こ]なかったんです。[Doushite okureta n desu ka. - Basu ga konakatta n desu.] (Tại sao bạn lại đến muộn vậy？ - Vì xe buýt đã không đến。)"
  },
  {
    "STT": 138,
    "Lesson": 26,
    "Structure": "N( đối tượng) は [(好きです/嫌いです) / (上手です/下手です) / あります]",
    "Meaning": "Về N thì...",
    "Explanation": "Đưa đối tượng đang được nhắc đến làm chủ đề để nhấn mạnh đặc điểm。",
    "Example": "運動会[うんどうかい]には　行[い]きますか。[Undoukai ni wa ikimasu ka.] (Về hội thao thì bạn có đi không？)"
  },
  {
    "STT": 139,
    "Lesson": 27,
    "Structure": "Thể khả năng của động từ",
    "Meaning": "Có thể làm V",
    "Explanation": "Nhóm 1: Chuyển đuôi [i] sang [e] + masu。 Nhóm 2: Bỏ [masu] thêm [raremasu]。 Nhóm 3: kuru -> koraremasu; suru -> dekimasu。",
    "Example": "書[か]けます [kakemasu] (có thể viết) | 食[た]べられます [taberaremasu] (có thể ăn) | 来[こ]られます [koraremasu] (có thể đến)"
  },
  {
    "STT": 140,
    "Lesson": 27,
    "Structure": "Câu văn có động từ khả năng",
    "Meaning": "Có thể làm N",
    "Explanation": "Trợ từ を thường được chuyển thành が khi đi với động từ khả năng。",
    "Example": "わたしは　漢字[かんじ]が　読[よ]めます。[Watashi wa kanji ga yomemasu.] (Tôi có thể đọc được chữ Hán。)"
  },
  {
    "STT": 141,
    "Lesson": 27,
    "Structure": "見(み)えます　và　聞(き)こえます",
    "Meaning": "Nhìn thấy / Nghe thấy",
    "Explanation": "Diễn tả khả năng tự nhiên của mắt hoặc tai (không phụ thuộc ý chí người nói)。",
    "Example": "ここから　海[うみ]が　見[み]えます。[Koko kara umi ga miemasu.] (Từ đây có thể nhìn thấy biển。) | 波[なみ]の　音[おと]が　聞[き]こえます。[Nami no oto ga kikoemasu.] (Nghe thấy tiếng sóng。)"
  },
  {
    "STT": 142,
    "Lesson": 27,
    "Structure": "できます",
    "Meaning": "Được hoàn thành / Xong",
    "Explanation": "Dùng để chỉ một công trình、 cửa hàng hoặc vật gì đó đã hoàn thiện。",
    "Example": "駅[えき]の　前[まえ]に　大[おお]きい　スーパーが　できました。[Eki no mae ni ookii suupaa ga dekimashita.] (Một siêu thị lớn đã được xây xong trước nhà ga。)"
  },
  {
    "STT": 143,
    "Lesson": 27,
    "Structure": "は",
    "Meaning": "Trợ từ nhấn mạnh",
    "Explanation": "Dùng は để nhấn mạnh hoặc so sánh trong câu phủ định。",
    "Example": "ひらがなは　書[か]けますが、漢字[かんじ]は　書[か]けません。[Hiragana wa kakemasu ga、 kanji wa kakemasen.] (Chữ Hiragana thì tôi viết được、 nhưng chữ Hán thì không。)"
  },
  {
    "STT": 144,
    "Lesson": 27,
    "Structure": "も",
    "Meaning": "Trợ từ cũng",
    "Explanation": "Dùng も thay cho が hoặc を để chỉ sự tương tự。",
    "Example": "昨日[きのう]も　お酒[さけ]が　飲[の]めました。[Kinou mo osake ga nomemashita.] (Hôm qua tôi cũng đã có thể uống rượu。)"
  },
  {
    "STT": 145,
    "Lesson": 27,
    "Structure": "しか",
    "Meaning": "Chỉ (đi với phủ định)",
    "Explanation": "Nhấn mạnh sự ít ỏi hoặc giới hạn。 Luôn đi với động từ thể phủ định。",
    "Example": "５００円[ごひゃくえん]しか　ありません。[Gohyaku-en shika arimasen.] (Tôi chỉ còn có 500 Yên。)"
  },
  {
    "STT": 146,
    "Lesson": 28,
    "Structure": "V1 （thể ます）＋　ながら　V2",
    "Meaning": "Vừa làm V1 vừa làm V2",
    "Explanation": "Diễn tả hai hành động diễn ra đồng thời、 trong đó V2 là hành động chính。",
    "Example": "音楽[おんがく]を　聞[き]きながら　食事[しょくじ]します。[Ongaku o kikinagara shokuji shimasu.] (Tôi vừa nghe nhạc vừa dùng bữa。)"
  },
  {
    "STT": 147,
    "Lesson": 28,
    "Structure": "Vています",
    "Meaning": "Đang làm V (Thói quen)",
    "Explanation": "Diễn tả một thói quen hoặc hành động lặp đi lặp lại trong một thời gian dài。",
    "Example": "毎日[まいにち]　日記[にっき]を　書[か]いて　います。[Mainichi nikki o kaite imasu.] (Hàng ngày tôi đều viết nhật ký。)"
  },
  {
    "STT": 148,
    "Lesson": 28,
    "Structure": "Thể thông thường + し、～",
    "Meaning": "Vừa... lại vừa... (Liệt kê lý do)",
    "Explanation": "Dùng để liệt kê các đặc điểm hoặc lý do dẫn đến một kết quả。",
    "Example": "ワットさんは　熱心[ねっしん]だし、真面目[まじめ]だし、経験[けいけん]も　あります。[Watto-san wa nesshin dashi、 majime dashi、 keiken mo arimasu.] (Thầy Watt vừa nhiệt tình、 vừa nghiêm túc lại có cả kinh nghiệm nữa。)"
  },
  {
    "STT": 149,
    "Lesson": 28,
    "Structure": "それに",
    "Meaning": "Hơn nữa / Thêm vào đó",
    "Explanation": "Trạng từ dùng để bổ sung thêm thông tin vào ý trước。",
    "Example": "この　店[みせ]は　料理[りょうり]も　おいしいです。それに　安[やす]いです。[Kono mise wa ryouri mo oishii desu. Sore ni yasui desu.] (Cửa hàng này đồ ăn ngon。 Hơn nữa lại rẻ。)"
  },
  {
    "STT": 150,
    "Lesson": 28,
    "Structure": "それで",
    "Meaning": "Vì thế / Do đó",
    "Explanation": "Trạng từ dùng để chỉ kết quả từ các nguyên nhân đã nêu ở trước。",
    "Example": "この　レストランは　安[やす]くて、おいしいです。それで　人[ひと]が　多[おお]いんです。[Kono resutoran wa yasukute、 oishii desu. Sorede hito ga ooi n desu.] (Nhà hàng này rẻ và ngon。 Vì thế nên đông khách。)"
  },
  {
    "STT": 151,
    "Lesson": 28,
    "Structure": "よく　この　喫茶店 に　来るんですか。",
    "Meaning": "Bạn có hay đến quán cà phê này không？",
    "Explanation": "Cách hỏi về thói quen sử dụng cấu trúc nhấn mạnh ～んです。",
    "Example": "よく　この　喫茶店[きっさてん]に　来[く]るんですか。[Yoku kono kissaten ni kuru n desu ka.] (Bạn có hay đến quán cà phê này không？)"
  },
  {
    "STT": 152,
    "Lesson": 29,
    "Structure": "Vています",
    "Meaning": "Đang làm V (Trạng thái kết quả)",
    "Explanation": "Diễn tả trạng thái hiện tại là kết quả của một hành động đã xảy ra (thường dùng tự động từ)。",
    "Example": "窓[まど]が　閉[し]まって　います。[Mado ga shimatte imasu.] (Cửa sổ đang đóng。)"
  },
  {
    "STT": 153,
    "Lesson": 29,
    "Structure": "Vて　しまいました / しまいます:",
    "Meaning": "Lỡ / Đã hoàn thành",
    "Explanation": "Diễn tả sự hối tiếc về một việc đã xảy ra hoặc một việc đã được hoàn thành triệt để。",
    "Example": "パスポートを　忘[わす]れて　しまいました。[Pasupooto o wasurete shimaimashita.] (Tôi lỡ quên hộ chiếu mất rồi。)"
  },
  {
    "STT": 154,
    "Lesson": 29,
    "Structure": "Vてしまいました",
    "Meaning": "Lỡ làm V (Hối tiếc)",
    "Explanation": "Dạng quá khứ nhấn mạnh sự đáng tiếc hoặc không mong muốn。",
    "Example": "電車[でんしゃ]に　傘[かさ]を　忘[わす]れて　しまいました。[Densha ni kasa o wasurete shimaimashita.] (Tôi đã để quên ô trên tàu mất rồi。)"
  },
  {
    "STT": 155,
    "Lesson": 29,
    "Structure": "ありました",
    "Meaning": "Tìm thấy / Đã có",
    "Explanation": "Dùng để thông báo rằng một vật bị mất đã được tìm thấy。",
    "Example": "あ、ありました！[A、 arimashita!] (A、 thấy rồi！)"
  },
  {
    "STT": 156,
    "Lesson": 29,
    "Structure": "どこかで / どこかに :",
    "Meaning": "Ở đâu đó (xác định trạng thái)",
    "Explanation": "Phân biệt trợ từ で (hành động xảy ra) và に (tồn tại) khi đi cùng どこか。",
    "Example": "どこかで　財布[さいふ]を　落[お]としました。[Dokoka de saifu o otoshimashita.] (Tôi đã đánh rơi ví ở đâu đó。) | どこかに　電話[でんわ]が　あります。[Dokoka ni denwa ga arimasu.] (Ở đâu đó có cái điện thoại。)"
  },
  {
    "STT": 157,
    "Lesson": 30,
    "Structure": "V (他動詞）てあります:",
    "Meaning": "Đã được V (Sẵn có)",
    "Explanation": "Diễn tả trạng thái của một vật là kết quả của một hành động có ý chí của ai đó。",
    "Example": "壁[かべ]に　カレンダーが　掛[か]けて　あります。[Kabe ni karendaa ga kakete arimasu.] (Trên tường có treo một cuốn lịch。)"
  },
  {
    "STT": 158,
    "Lesson": 30,
    "Structure": "V (他動詞)　ておきます",
    "Meaning": "Làm sẵn V / Cứ để nguyên V",
    "Explanation": "Làm sẵn một việc để chuẩn bị cho lần sau hoặc giữ nguyên trạng thái。",
    "Example": "旅行[りょこう]の　まえに、切符[きっぷ]を　買[か]っておきます。[Ryokou no mae ni、 kippu o katte okimasu.] (Trước khi đi du lịch tôi sẽ mua vé sẵn。)"
  },
  {
    "STT": 159,
    "Lesson": 30,
    "Structure": "まだ　V( thể khẳng định) :",
    "Meaning": "Vẫn còn V",
    "Explanation": "Diễn tả một trạng thái vẫn đang tiếp diễn。",
    "Example": "まだ　雨[あめ]が　降[ふ]って　います。[Mada ame ga futte imasu.] (Trời vẫn còn đang mưa。)"
  },
  {
    "STT": 160,
    "Lesson": 30,
    "Structure": "それは～",
    "Meaning": "Cái đó thì...",
    "Explanation": "Dùng để tiếp nối câu chuyện hoặc giải thích về sự vật vừa được nhắc tới。",
    "Example": "それは　いいですね。[Sore wa ii desu ne.] (Cái đó hay đấy nhỉ。)"
  },
  {
    "STT": 161,
    "Lesson": 31,
    "Structure": "Thể ý chí （Vよう）",
    "Meaning": "Sẽ làm V / Hãy cùng làm V",
    "Explanation": "Dạng thông thường của Vましょう。 Nhóm 1: [i] -> [o] + u。 Nhóm 2: bỏ [masu] + you。 Nhóm 3: kuru -> koyou; suru -> shiyou。",
    "Example": "書[か]こう [kakou] (sẽ viết) | 食[た]べよう [tabeyou] (sẽ ăn) | 来[こ]よう [koyou] (sẽ đến)"
  },
  {
    "STT": 162,
    "Lesson": 31,
    "Structure": "Cách sử dụng thể ý chí",
    "Meaning": "Rủ rê / Đề nghị (Thân mật)",
    "Explanation": "Dùng trong các tình huống giao tiếp thân mật với bạn bè hoặc người thân。",
    "Example": "ちょっと　休[やす]しよう。[Chotto yasumou.] (Nghỉ một chút nào。)"
  },
  {
    "STT": 163,
    "Lesson": 31,
    "Structure": "(Vる / Vない) つもりです",
    "Meaning": "Dự định làm / không làm V",
    "Explanation": "Diễn tả một ý định chắc chắn của người nói về hành động trong tương lai。",
    "Example": "来年[らいねん]　結婚[けっこん]する　つもりです。[Rainen kekkon suru tsumori desu.] (Năm sau tôi định sẽ kết hôn。)"
  },
  {
    "STT": 164,
    "Lesson": 31,
    "Structure": "[Động từ ở thể từ điển / N の] 予定です",
    "Meaning": "Theo kế hoạch là...",
    "Explanation": "Diễn tả một lịch trình hoặc kế hoạch đã được quyết định sẵn。",
    "Example": "７月[しちがつ]に　日本[にほん]へ　行[い]く　予定[よてい]です。[Shichigatsu ni Nihon e iku yotei desu.] (Theo kế hoạch tôi sẽ đi Nhật vào tháng 7。)"
  },
  {
    "STT": 165,
    "Lesson": 31,
    "Structure": "まだ　Vて　いません",
    "Meaning": "Vẫn chưa làm V",
    "Explanation": "Diễn tả một hành động chưa được thực hiện tại thời điểm hiện tại。",
    "Example": "銀行[ぎんこう]は　まだ　開[あ]いて　いません。[Ginkou wa mada aite imasen.] (Ngân hàng vẫn chưa mở cửa。)"
  },
  {
    "STT": 166,
    "Lesson": 31,
    "Structure": "こ～ / そ～",
    "Meaning": "Cái này / Cái đó (Chỉ định)",
    "Explanation": "Hệ thống chỉ định từ こ (gần người nói) và そ (gần người nghe)。",
    "Example": "これ [kore] | それ [sore] | ここ [koko] | そこ [soko]"
  },
  {
    "STT": 167,
    "Lesson": 32,
    "Structure": "[Vた / Vない]　ほうが　いいです",
    "Meaning": "Nên / Không nên làm V",
    "Explanation": "Dùng để đưa ra lời khuyên hoặc gợi ý cho người nghe。",
    "Example": "毎日[まいにち]　運動[うんどう]した　ほうが　いいです。[Mainichi undou shita hou ga ii desu.] (Bạn nên vận động hàng ngày。) | お酒[さけ]を　飲[の]まない　ほうが　いいです。[Osake o nomanai hou ga ii desu.] (Bạn không nên uống rượu。)"
  },
  {
    "STT": 168,
    "Lesson": 32,
    "Structure": "([V / い-adj / な-adj / N] Thể thông thường) + でしょう",
    "Meaning": "Chắc là / Có lẽ là...",
    "Explanation": "Dùng để dự đoán dựa trên thông tin có sẵn (lên giọng cuối câu để hỏi sự đồng tình)。",
    "Example": "あしたは　雨[あめ]が　降[ふ]るでしょう。[Ashita wa ame ga furu deshou.] (Chắc là ngày mai trời sẽ mưa。)"
  },
  {
    "STT": 169,
    "Lesson": 32,
    "Structure": "([V / い-adj / な-adj / N] Thể thông thường) + かも　しれません",
    "Meaning": "Có thể là / Có lẽ là...",
    "Explanation": "Diễn tả một khả năng thấp (khoảng 50%) hoặc sự suy đoán không chắc chắn。",
    "Example": "午後[ごご]から　雪[ゆき]が　降[ふ]るかも　しれません。[Gogo kara yuki ga furu kamo shiremasen.] (Có thể là từ chiều tuyết sẽ rơi。)"
  },
  {
    "STT": 170,
    "Lesson": 32,
    "Structure": "きっと / たぶん / もしかしたら",
    "Meaning": "Nhất định / Có lẽ / Biết đâu chừng",
    "Explanation": "Các trạng từ đi kèm để tăng / giảm mức độ chắc chắn của dự đoán。",
    "Example": "あしたは　きっと　いい　天気[てんき]に　なります。[Ashita wa kitto ii tenki ni narimasu.] (Ngày mai nhất định trời sẽ đẹp。)"
  },
  {
    "STT": 171,
    "Lesson": 32,
    "Structure": "Từ để hỏi + か + Tính từ + N",
    "Meaning": "Cái gì đó (không xác định)",
    "Explanation": "Kết hợp từ để hỏi với trợ từ か để tạo cụm danh từ không xác định。",
    "Example": "何[なに]か　冷[つめ]たい　飲[の]み物[もの]が　飲[n]みたいです。[Nani ka tsumetai nomimono ga nomitai desu.] (Tôi muốn uống cái gì đó lạnh。)"
  },
  {
    "STT": 172,
    "Lesson": 32,
    "Structure": "Từ chỉ số lượng 　＋　で：",
    "Meaning": "Trong phạm vi (số lượng)",
    "Explanation": "Dùng để giới hạn mức giá、 thời gian hoặc số lượng cần thiết。",
    "Example": "３万円[さんまんえん]で　パソコンが　買[か]えますか。[Sanman-en de pasokon ga kaemasu ka.] (Với 3 vạn Yên có mua được máy tính không？)"
  },
  {
    "STT": 173,
    "Lesson": 33,
    "Structure": "Thể mệnh lệnh và thể cấm đoán:",
    "Meaning": "Ra lệnh / Cấm đoán",
    "Explanation": "Mệnh lệnh (Nhóm 1: i->e; Nhóm 2: bỏ masu + ro; Nhóm 3: koi/shiro)。 Cấm đoán: V-từ điển + na。",
    "Example": "書[か]け [kake] (Viết mau！) | 食べるな [taberu na] (Cấm ăn！)"
  },
  {
    "STT": 174,
    "Lesson": 33,
    "Structure": "Cách sử dụng thể mệnh lệnh và thể cấm đoán",
    "Meaning": "Hoàn cảnh sử dụng",
    "Explanation": "Dùng trong quân đội、 cổ vũ thể thao、 biển báo hoặc nam giới nói với người dưới。",
    "Example": "あきらめるな！[Akirameru na!] (Đừng bỏ cuộc！) | 入[はい]るな [hairu na] (Cấm vào)"
  },
  {
    "STT": 175,
    "Lesson": 33,
    "Structure": "～と　読みます　và　～と　書いて　あります",
    "Meaning": "Đọc là... / Viết là...",
    "Explanation": "Dùng để giải thích nội dung văn bản hoặc cách phát âm。",
    "Example": "あの　漢字[かんじ]は　何[なん]と　読[よ]みますか。[Ano kanji wa nan to yomimasu ka?] (Chữ Hán kia đọc là gì？)"
  },
  {
    "STT": 176,
    "Lesson": 33,
    "Structure": "X 　は　Y　という　意味です。",
    "Meaning": "X nghĩa là Y",
    "Explanation": "Dùng để giải thích ý nghĩa của một từ ngữ hoặc ký hiệu。",
    "Example": "この　マークは　禁煙[きんえん]という　意味[いみ]です。[Kono maaku wa kinen to iu imi desu.] (Ký hiệu này nghĩa là cấm hút thuốc。)"
  },
  {
    "STT": 177,
    "Lesson": 33,
    "Structure": "(Thể văn thông thường / “Câu nói”) + と　言(い)って　いました",
    "Meaning": "Đã nói rằng...",
    "Explanation": "Dùng để truyền đạt lại lời nói của một người thứ ba。",
    "Example": "田中[たなか]さんは　「あした　休[やす]みます」と　言[い]っていました。[Tanaka-san wa ashita yasumimasu to itte imashita.] (Anh Tanaka nói là ngày mai anh ấy nghỉ。)"
  },
  {
    "STT": 178,
    "Lesson": 33,
    "Structure": "(“Câu nói” / Thể văn thông thường)　+　と　伝(つた)えて　いただけませんか",
    "Meaning": "Làm ơn nhắn lại giúp tôi rằng...",
    "Explanation": "Dùng để nhờ ai đó truyền đạt lại lời nhắn cho người khác。",
    "Example": "すみませんが、渡辺[わたなべ]さんに　あしたの　パーティーは　６時[ろくじ]からだと　伝[つた]えて　いただけませんか。[Sumimasen ga、 Watanabe-san ni ashita no paatii wa rokuji kara da to tsutaete itadakemasen ka.] (Xin lỗi、 anh/chị có thể nhắn lại cho anh Watanabe rằng bữa tiệc ngày mai bắt đầu từ 6 giờ được không？)"
  },
  {
    "STT": 179,
    "Lesson": 34,
    "Structure": "(V1た / Nの) あとで、V2",
    "Meaning": "Sau khi làm V1/N thì làm V2",
    "Explanation": "Chỉ trình tự thời gian rõ rệt giữa hai hành động。",
    "Example": "仕事[しごと]が　終[お]わった　あとで、飲[の]みに　行[い]きませんか。[Shigoto ga owatta ato de、 nomi ni ikimasen ka.] (Sau khi xong việc、 đi uống chút gì không？)"
  },
  {
    "STT": 180,
    "Lesson": 34,
    "Structure": "(V1( thể て) / V1( thể ない)　ないで) + V2",
    "Meaning": "Làm V2 trong trạng thái V1",
    "Explanation": "Diễn tả cách thức hoặc trạng thái kèm theo khi thực hiện hành động chính V2。",
    "Example": "しょうゆを　つけて　食[た]べます。[Shouyu o tsukete tabemasu.] (Ăn kèm với nước tương。) | しょうゆを　つけないで　食[た]べます。[Shouyu o tsukenaide tabemasu.] (Ăn mà không kèm nước tương。)"
  },
  {
    "STT": 181,
    "Lesson": 34,
    "Structure": "V1 (thể ない) ないで、V2",
    "Meaning": "Thay vì làm V1 thì làm V2",
    "Explanation": "Diễn tả sự lựa chọn giữa hai hành động đối lập。",
    "Example": "日曜日は　どこも　行[い]かないで、家[うち]で　ゆっくり　休[やす]みます。[Nichiyoubi wa doko mo ikanaide、 uchi de yukkuri yasumimasu.] (Chủ nhật tôi không đi đâu cả mà nghỉ ngơi thong thả ở nhà。)"
  },
  {
    "STT": 182,
    "Lesson": 35,
    "Structure": "Thể điều kiện (Vえば / Adjければ / Nなら)",
    "Meaning": "Thể điều kiện (Nếu...)",
    "Explanation": "Nhóm 1: [i] -> [e] + ba。 Nhóm 2: bỏ [masu] + reba。 Nhóm 3: kuru -> kureba; suru -> sureba。 Tính từ đuôi い bỏ い thêm kereba。",
    "Example": "安[やす]ければ　買[か]います。[Yasukereba kaimasu.] (Nếu rẻ tôi sẽ mua。)"
  },
  {
    "STT": 183,
    "Lesson": 35,
    "Structure": "Vる / Vない + なら",
    "Meaning": "Nếu là V...",
    "Explanation": "Dùng để đưa ra lời khuyên hoặc gợi ý dựa trên chủ đề người đối diện vừa nhắc tới。",
    "Example": "パソコンを　買[か]うなら　秋葉原[あきはばら]が　いいですよ。[Pasokon o kau nara Akihabara ga ii desu yo.] (Nếu mua máy tính thì Akihabara được đấy。)"
  },
  {
    "STT": 184,
    "Lesson": 35,
    "Structure": "Từ để hỏi + V thể điều kiện + いいですか",
    "Meaning": "Nên làm gì thì tốt nhỉ?",
    "Explanation": "Dùng để xin lời khuyên (tương tự bài 26 nhưng dùng thể điều kiện)。",
    "Example": "どこで　カメラを　買[か]えば　いいですか。[Doko de kamera o kaeba ii desu ka.] (Tôi nên mua máy ảnh ở đâu thì tốt nhỉ？)"
  },
  {
    "STT": 185,
    "Lesson": 35,
    "Structure": "V thể điều kiện + Vるほど / Adj điều kiện + Adj nguyên dạng ほど",
    "Meaning": "Càng... càng...",
    "Explanation": "Diễn tả sự thay đổi tỉ lệ thuận của hai vế。",
    "Example": "ビールの　飲[の]めば　飲[の]むほど　おいしいです。[Biiru no meba nomu hodo oishii desu.] (Bia càng uống càng thấy ngon。)"
  },
  {
    "STT": 186,
    "Lesson": 36,
    "Structure": "V1る / V1ない + ように、V2",
    "Meaning": "Để làm V1 (mục đích)",
    "Explanation": "V1 thường là động từ khả năng hoặc động từ không mang ý chí để chỉ trạng thái mục tiêu。",
    "Example": "忘[わす]れないように　メモします。[Wasurenai you ni memo shimasu.] (Tôi ghi chép lại để không bị quên。)"
  },
  {
    "STT": 187,
    "Lesson": 36,
    "Structure": "Vる ように なります",
    "Meaning": "Trở nên có thể làm V",
    "Explanation": "Diễn tả sự thay đổi từ trạng thái không thể sang có thể làm gì đó。",
    "Example": "日本語[にほんご]が　話[はな]せるように　なりました。[Nihongo ga hanaseru you ni narimashita.] (Tôi đã trở nên có thể nói được tiếng Nhật。)"
  },
  {
    "STT": 188,
    "Lesson": 36,
    "Structure": "Vる / Vない ように しています",
    "Meaning": "Đang cố gắng làm / không làm V",
    "Explanation": "Diễn tả nỗ lực duy trì một thói quen hoặc hành động đều đặn。",
    "Example": "毎日[まいにち]　運動[うんどう]するように　しています。[Mainichi undou suru you ni shite imasu.] (Tôi đang cố gắng vận động mỗi ngày。)"
  },
  {
    "STT": 189,
    "Lesson": 36,
    "Structure": "Vる / Vない ように してください",
    "Meaning": "Hãy chú ý làm / không làm V",
    "Explanation": "Lời yêu cầu hoặc khuyên nhủ ai đó thực hiện thói quen hoặc hành động cụ thể。",
    "Example": "もっと　野菜[やさい]を　食[た]べるように　してください。[Motto yasai o taberu you ni shite kudasai.] (Hãy chú ý ăn nhiều rau hơn nữa nhé。)"
  },
  {
    "STT": 190,
    "Lesson": 37,
    "Structure": "Thể bị động (Vられる)",
    "Meaning": "Thể bị động (Bị / Được)",
    "Explanation": "Nhóm 1: [i] -> [a] + reru。 Nhóm 2: bỏ [masu] + rareru。 Nhóm 3: kuru -> korareru; suru -> sareru。",
    "Example": "褒[ほ]められました [homeraremashita] (được khen) | 叱[しか]られました [shikararemashita] (bị mắng)"
  },
  {
    "STT": 191,
    "Lesson": 37,
    "Structure": "N1 (người) は N2 (người) に Vられる",
    "Meaning": "N1 bị/được N2 làm V",
    "Explanation": "Cấu trúc bị động cơ bản khi N1 là đối tượng chịu tác động từ N2。",
    "Example": "わたしは　課長[かちょう]に　褒[ほ]められました。[Watashi wa kachou ni homeraremashita.] (Tôi đã được trưởng phòng khen。)"
  },
  {
    "STT": 192,
    "Lesson": 37,
    "Structure": "N1 は N2 に N3 を Vられる",
    "Meaning": "N1 bị N2 làm gì đó đối với N3 (vật sở hữu)",
    "Explanation": "Thường dùng khi hành động đó gây phiền toái cho N1。",
    "Example": "わたしは　弟[おとうと]に　パソコンを　壊[こわ]されました。[Watashi wa otouto ni pasokon o kwasaremashita.] (Tôi bị em trai làm hỏng máy tính。)"
  },
  {
    "STT": 193,
    "Lesson": 37,
    "Structure": "N (vật/việc) が / は Vられる",
    "Meaning": "N được (tổ chức / xây dựng / sản xuất)",
    "Explanation": "Dùng khi không cần thiết phải nhắc tới người thực hiện hành động。",
    "Example": "この　本[ほん]は　世界中[せかいじゅう]で　読[よ]まれています。[Kono hon wa sekaijuu de yomarete imasu.] (Cuốn sách này đang được đọc trên toàn thế giới。)"
  },
  {
    "STT": 194,
    "Lesson": 37,
    "Structure": "N から / N によって",
    "Meaning": "Từ N / Bởi N",
    "Explanation": "Dùng から khi chỉ nguồn gốc thông tin và によって khi chỉ người sáng tạo (tác giả、 kiến trúc sư)。",
    "Example": "この　家[いえ]は　有名[ゆうめい]な　建築家[けんちくか]によって　建[た]てられました。[Kono ie wa yuumei na kenchikuka ni yotte tateraremashita.] (Ngôi nhà này được xây bởi một kiến trúc sư nổi tiếng。)"
  },
  {
    "STT": 195,
    "Lesson": 38,
    "Structure": "Vる のは Adj です",
    "Meaning": "Việc làm V thì...",
    "Explanation": "Danh từ hóa động từ bằng の để làm chủ ngữ trong câu tính từ。",
    "Example": "テニスを　するのは　おもしろいです。[Tenisu o suru no wa omoshiroi desu.] (Việc chơi tennis thì thú vị。)"
  },
  {
    "STT": 196,
    "Lesson": 38,
    "Structure": "Vる のが Adj です",
    "Meaning": "Thích / Giỏi / Ghét việc làm V",
    "Explanation": "Dùng の để biến động từ thành danh từ đi với các tính từ chỉ sở thích hoặc năng lực。",
    "Example": "わたしは　花[はな]を　育[そだ]てるのが　好[す]きです。[Watashi wa hana o sodateru no ga suki desu.] (Tôi thích việc trồng hoa。)"
  },
  {
    "STT": 197,
    "Lesson": 38,
    "Structure": "Vる のを 忘れました",
    "Meaning": "Quên mất việc làm V",
    "Explanation": "Danh từ hóa cụm động từ làm tân ngữ cho động từ 忘れます。",
    "Example": "牛乳[ぎゅうにゅう]を　買[か]うのを　忘[わす]れました。[Gyuunyuu o kau no o wasuremashita.] (Tôi đã quên mất việc mua sữa。)"
  },
  {
    "STT": 198,
    "Lesson": 38,
    "Structure": "V (thể thông thường) のを 知っていますか",
    "Meaning": "Bạn có biết việc... không?",
    "Explanation": "Dùng để hỏi về sự hiểu biết đối với một sự việc nào đó。",
    "Example": "来月[らいげつ]　田中[たなか]さんが　結婚[けっこん]するのを　知[し]っていますか。[Raigetsu Tanaka-san ga kekkon suru no o shitte imasu ka.] (Bạn có biết việc tháng sau anh Tanaka kết hôn không？)"
  },
  {
    "STT": 199,
    "Lesson": 38,
    "Structure": "V (thể thông thường) のは N です",
    "Meaning": "Người / Nơi / Lúc mà... là N",
    "Explanation": "Dùng để nhấn mạnh danh từ N ở cuối câu。",
    "Example": "娘[むすめ]が　生[う]まれたのは　北海道[ほっかいどう]です。[Musume ga umareta no wa Hokkaido desu.] (Nơi con gái tôi sinh ra là ở Hokkaido。)"
  },
  {
    "STT": 200,
    "Lesson": 39,
    "Structure": "Vて / Vないで / Adj くて / Adj で、 ～",
    "Meaning": "Vì... nên...",
    "Explanation": "Mệnh đề trước chỉ nguyên nhân gây ra cảm xúc hoặc trạng thái ở vế sau (không dùng ý chí)。",
    "Example": "ニュースを　聞[き]いて　びっくりしました。[Nyuusu o kiite bikkuri shimashita.] (Tôi đã giật mình khi nghe tin tức。)"
  },
  {
    "STT": 201,
    "Lesson": 39,
    "Structure": "N で",
    "Meaning": "Vì N (thiên tai / sự cố)",
    "Explanation": "Chỉ nguyên nhân khách quan gây ra hậu quả xấu。",
    "Example": "事故[じこ]で　電車[でんしゃ]が　止[と]まりました。[Jiko de densha ga tomarimashita.] (Vì tai nạn nên tàu điện đã dừng lại。)"
  },
  {
    "STT": 202,
    "Lesson": 39,
    "Structure": "～ので、 ～",
    "Meaning": "Vì... nên (lịch sự)",
    "Explanation": "Dùng để giải thích lý do một cách nhẹ nhàng và lịch sự hơn から。",
    "Example": "用事[ようじ]が　あるので　お先[さき]に　失礼[しつれい]します。[Youji ga aru node osaki ni shitsurei shimasu.] (Vì có chút việc nên tôi xin phép về trước。)"
  },
  {
    "STT": 203,
    "Lesson": 40,
    "Structure": "Từ để hỏi + V (thể thông thường) か、 ～",
    "Meaning": "Câu hỏi nghi vấn lồng trong câu",
    "Explanation": "Dùng để lồng một câu hỏi có từ để hỏi vào trong một câu văn khác。",
    "Example": "結婚[けっこん]のお祝[いわ]いに　何[なに]を　あげたら　いいか、考[かんが]えています。[Kekkon no oiwai ni nani o agetara ii ka、 kangaete imasu.] (Tôi đang suy nghĩ xem nên tặng gì làm quà mừng cưới。)"
  },
  {
    "STT": 204,
    "Lesson": 40,
    "Structure": "V (thể thông thường) か どうか、 ～",
    "Meaning": "Có hay không... (lồng câu hỏi)",
    "Explanation": "Dùng để lồng một câu hỏi không có từ để hỏi vào trong một câu văn khác。",
    "Example": "間違い[まちがい]が　ないか　どうか、調べ[しらべ]てください。[Machigai ga nai ka douka、 shirabete kudasai.] (Hãy kiểm tra xem có lỗi hay không nhé。)"
  },
  {
    "STT": 205,
    "Lesson": 40,
    "Structure": "Vて みます",
    "Meaning": "Thử làm V",
    "Explanation": "Diễn tả việc thực hiện một hành động để xem kết quả hoặc trải nghiệm。",
    "Example": "新しい[あたらしい]　靴[くつ]を　履い[はい]て　みます。[Atarashii kutsu o haite mimasu.] (Tôi sẽ đi thử đôi giày mới。)"
  },
  {
    "STT": 206,
    "Lesson": 40,
    "Structure": "Adj (bỏ い) / Adj (bỏ な) + さ",
    "Meaning": "Danh từ hóa tính từ",
    "Explanation": "Biến tính từ thành danh từ chỉ mức độ (độ cao、 độ dài、 độ nặng)。",
    "Example": "富士山[ふじさん]の　高さ[たかさ]は　どのくらいですか。[Fujisan no takasa wa dono kurai desu ka.] (Độ cao của núi Phú Sĩ là bao nhiêu？)"
  },
  {
    "STT": 207,
    "Lesson": 41,
    "Structure": "N1 に N2 を　( やります / あげます / さしあげます )",
    "Meaning": "Tặng / Cho N2 cho N1",
    "Explanation": "Dùng やります với người dưới/động vật、 あげます với người ngang hàng、 さしあげます với người trên。",
    "Example": "息子[むすこ]に　おもちゃを　やりました。[Musuko ni omocha o yarimashita.] (Tôi đã cho con trai đồ chơi。) | 先生[せんせい]に　お土産[おみやげ]を　差し上げ[さしあげ]ました。[Sensei ni omiyage o sashiagemashita.] (Tôi đã biếu thầy giáo quà quê。)"
  },
  {
    "STT": 208,
    "Lesson": 41,
    "Structure": "N1 に N2 を ( もらいます / いただきます )",
    "Meaning": "Nhận N2 từ N1",
    "Explanation": "いただきます là kính ngữ của もらいます (nhận từ người bề trên)。",
    "Example": "わたしは　社長[しゃちょう]に　時計[とけい]を　いただきました。[Watashi wa shachou ni tokei o itadakimashita.] (Tôi đã nhận được chiếc đồng hồ từ giám đốc。)"
  },
  {
    "STT": 209,
    "Lesson": 41,
    "Structure": "N1 が わたしに N2 を ( くれます / くださいます )",
    "Meaning": "N1 cho tôi N2",
    "Explanation": "くださいます là kính ngữ của くれます (người bề trên cho mình)。",
    "Example": "部長[ぶちょう]の　奥様[おくさま]が　お菓子[おかし]を　くださいました。[Buchou no okusama ga okashi o kudasaimashita.] (Vợ trưởng phòng đã cho tôi bánh kẹo。)"
  },
  {
    "STT": 210,
    "Lesson": 41,
    "Structure": "Vて ( やります / あげます / さしあげます )",
    "Meaning": "Làm V giúp cho ai đó",
    "Explanation": "Tương tự bài 24 nhưng có thêm sắc thái kính ngữ hoặc dùng với cấp dưới。",
    "Example": "娘[むすめ]に　本[ほん]を　読ん[よん]で　やりました。[Musume ni hon o yonde yarimashita.] (Tôi đã đọc sách cho con gái nghe。)"
  },
  {
    "STT": 211,
    "Lesson": 41,
    "Structure": "Vて ( もらいます / いただきます )",
    "Meaning": "Được ai đó làm V cho",
    "Explanation": "いただきます thể hiện sự biết ơn sâu sắc khi được người bề trên giúp đỡ。",
    "Example": "わたしは　課長[かちょう]に　手紙[てがみ]を　直し[なおし]て　いただきました。[Watashi wa kachou ni tegami o naoshite itadakimashita.] (Tôi đã được trưởng phòng sửa thư giúp cho。)"
  },
  {
    "STT": 212,
    "Lesson": 41,
    "Structure": "Vて ( くれます / くださいます )",
    "Meaning": "Ai đó làm V cho mình",
    "Explanation": "くださいます thể hiện sự kính trọng khi người bề trên chủ động giúp mình。",
    "Example": "先生[せんせい]が　漢字[かんじ]を　教え[おしえ]て　くださいました。[Sensei ga kanji o oshiete kudasaimashita.] (Thầy giáo đã dạy chữ Hán cho tôi。)"
  },
  {
    "STT": 213,
    "Lesson": 41,
    "Structure": "Vて くださいませんか",
    "Meaning": "Làm ơn V giúp tôi được không？",
    "Explanation": "Cách nhờ vả lịch sự (mức độ trung bình giữa Vてください và Vていただけませんか)。",
    "Example": "コピーの　やり方を　教え[おしえ]て　くださいませんか。[Kopii no yarigata o oshiete kudasaimasen ka.] (Làm ơn dạy tôi cách photo được không ạ？)"
  },
  {
    "STT": 214,
    "Lesson": 42,
    "Structure": "Vる / N の + ために",
    "Meaning": "Để / Vì (Mục đích)",
    "Explanation": "Mục đích mang tính ý chí rõ rệt hoặc vì lợi ích của một đối tượng。",
    "Example": "家族[かぞく]の　ために　一生懸命[いっしょうけんめい]　働き[はたら]きます。[Kazoku no tame ni isshoukenmei hatarakimasu.] (Tôi làm việc hết mình vì gia đình。)"
  },
  {
    "STT": 215,
    "Lesson": 42,
    "Structure": "Vる / N の + に ( つかいます / いいです / べんりです )",
    "Meaning": "Để làm V / Cho việc N thì...",
    "Explanation": "Chỉ mục đích sử dụng hoặc đánh giá đối với một công cụ/việc gì đó。",
    "Example": "この　はさみは　花[はな]を　切る[きる]のに　使い[つかい]ます。[Kono hasami wa hana o kiru no ni tsukaimasu.] (Cái kéo này dùng để cắt hoa。)"
  },
  {
    "STT": 216,
    "Lesson": 42,
    "Structure": "Số lượng + は / も",
    "Meaning": "Ít nhất là / Đến tận...",
    "Explanation": "は chỉ mức tối thiểu (ít nhất)。 も chỉ mức độ nhiều gây ngạc nhiên (đến tận)。",
    "Example": "日本[にほん]で　結婚式[けっこんしき]を　するのに　２００万円[にひゃくまんえん]は　いります。[Nihon de kekkonshiki o suru no ni nihyakuman-en wa irimasu.] (Để tổ chức đám cưới ở Nhật thì cần ít nhất 2 triệu Yên。)"
  },
  {
    "STT": 217,
    "Lesson": 43,
    "Structure": "V (thể ます) / Adj (bỏ い/な) + そうです",
    "Meaning": "Có vẻ như...",
    "Explanation": "Dự đoán dựa trên vẻ bề ngoài hoặc trạng thái quan sát được。",
    "Example": "今にも[いまにも]　雨[あめ]が　降り[ふり]そうです。[Ima ni mo ame ga furisou desu.] (Trông có vẻ sắp mưa đến nơi rồi。)"
  },
  {
    "STT": 218,
    "Lesson": 43,
    "Structure": "Vて 来ます",
    "Meaning": "Đi đâu đó rồi quay lại",
    "Explanation": "Đi thực hiện một hành động tại một địa điểm khác rồi trở về vị trí cũ。",
    "Example": "ちょっと　タバコを　買っ[かっ]て　来ます。[Chotto tabako o katte kimasu.] (Tôi đi mua thuốc lá một chút rồi quay lại ngay。)"
  },
  {
    "STT": 219,
    "Lesson": 44,
    "Structure": "V (thể ます) / Adj (bỏ い/な) + すぎます",
    "Meaning": "Quá...",
    "Explanation": "Diễn tả một trạng thái hoặc hành động vượt quá mức độ bình thường (thường mang nghĩa tiêu cực)。",
    "Example": "昨日[きのう]　お酒[さけ]を　飲み[のみ]すぎました。[Kinou osake o nomisugimashita.] (Hôm qua tôi đã uống quá nhiều rượu。)"
  },
  {
    "STT": 220,
    "Lesson": 44,
    "Structure": "V (thể ます) + やすいです / にくいです",
    "Meaning": "Dễ / Khó làm V",
    "Explanation": "Chỉ tính chất của một vật khiến việc thực hiện hành động trở nên dễ hoặc khó。",
    "Example": "この　ペンは　書き[かき]やすいです。[Kono pen wa kakiyasui desu.] (Cây bút này dễ viết。)"
  },
  {
    "STT": 221,
    "Lesson": 44,
    "Structure": "Adj (bỏ い -> く) / Adj (bỏ な -> に) + します",
    "Meaning": "Làm cho trở nên...",
    "Explanation": "Diễn tả việc tác động để làm thay đổi trạng thái của đối tượng (tha động từ)。",
    "Example": "音[おと]を　大きく[おおきく]　します。[Oto o ookiku shimasu.] (Tôi vặn âm thanh to lên。)"
  },
  {
    "STT": 222,
    "Lesson": 44,
    "Structure": "N に します",
    "Meaning": "Chọn / Quyết định chọn N",
    "Explanation": "Dùng khi đưa ra lựa chọn trong thực đơn hoặc mua sắm。",
    "Example": "会議[かいぎ]は　明日[あした]に　します。[Kaigi wa ashita ni shimasu.] (Tôi quyết định họp vào ngày mai。)"
  },
  {
    "STT": 223,
    "Lesson": 45,
    "Structure": "V (thể thông thường) / Adj / N の + 場合は、 ～",
    "Meaning": "Trong trường hợp... thì...",
    "Explanation": "Dùng để giả định một tình huống cụ thể và đưa ra cách giải quyết hoặc kết quả。",
    "Example": "会議[かいぎ]に　遅れる[おくれる]　場合[ばあい]は、連絡[れんらく]して　ください。[Kaigi ni okureru baai wa、 renraku shite kudasai.] (Trong trường hợp đến muộn cuộc họp thì hãy liên lạc nhé。)"
  },
  {
    "STT": 224,
    "Lesson": 45,
    "Structure": "V (thể thông thường) / Adj / N な + のに、 ～",
    "Meaning": "Mặc dù... nhưng...",
    "Explanation": "Diễn tả sự đối lập bất ngờ hoặc thất vọng so với mong đợi (mạnh hơn が)。",
    "Example": "約束[やくそく]をしたのに、彼女[かのじょ]は　来[き]ませんでした。[Yakusoku o shita noni、 kanojo wa kimasen deshita.] (Mặc dù đã hẹn rồi nhưng cô ấy đã không đến。)"
  },
  {
    "STT": 225,
    "Lesson": 46,
    "Structure": "Vる ところです",
    "Meaning": "Sắp sửa làm V",
    "Explanation": "Diễn tả một hành động chuẩn bị bắt đầu ngay tại thời điểm nói。",
    "Example": "今[いま]から　昼[ひる]ごはんを　食べる[たべる]　ところです。[Ima kara hirugohan o taberu tokoro desu.] (Bây giờ tôi chuẩn bị ăn cơm trưa đây。)"
  },
  {
    "STT": 226,
    "Lesson": 46,
    "Structure": "Vて いる ところです",
    "Meaning": "Đang làm V",
    "Explanation": "Diễn tả một hành động đang thực hiện dở dang tại thời điểm nói。",
    "Example": "今[いま]　故障[こしょう]の　原因[げんいん]を　調べて[しらべて]いる　ところです。[Ima koshou no gen-in o shirabete iru tokoro desu.] (Bây giờ tôi đang tìm nguyên nhân hỏng hóc。)"
  },
  {
    "STT": 227,
    "Lesson": 46,
    "Structure": "Vた ところです",
    "Meaning": "Vừa mới làm V xong",
    "Explanation": "Diễn tả một hành động vừa kết thúc tức thì。",
    "Example": "たった今[いま]　バスが　出た[でた]　ところです。[Tatta ima basu ga deta tokoro desu.] (Xe buýt vừa mới chạy xong tích tắc thôi。)"
  },
  {
    "STT": 228,
    "Lesson": 46,
    "Structure": "Vた ばかりです",
    "Meaning": "Vừa mới làm V (cảm giác)",
    "Explanation": "Diễn tả một hành động đã xảy ra cách đây không lâu theo cảm nhận của người nói。",
    "Example": "先月[せんげつ]　日本[にほん]へ　来[き]た　ばかりです。[Sengetsu Nihon e kita bakari desu.] (Tôi vừa mới đến Nhật vào tháng trước。)"
  },
  {
    "STT": 229,
    "Lesson": 46,
    "Structure": "V (thể thông thường) / Adj / N + はずです",
    "Meaning": "Chắc chắn là...",
    "Explanation": "Dùng để đưa ra dự đoán có căn cứ xác thực hoặc logic。",
    "Example": "田中[たなか]さんは　今日[きょう]　来る[くる]　はずです。[Tanaka-san wa kyou kuru hazu desu.] (Anh Tanaka chắc chắn hôm nay sẽ đến。)"
  },
  {
    "STT": 230,
    "Lesson": 47,
    "Structure": "V (thể thông thường) + そうです",
    "Meaning": "Nghe nói là...",
    "Explanation": "Dùng để truyền đạt lại thông tin nhận được từ nguồn khác (nghe、 đọc)。",
    "Example": "天気予報[てんきよほう]によると　あしたは　晴れる[はれる]　そうです。[Tenkiyohou ni yoru to ashita wa hareru sou desu.] (Theo dự báo thời tiết thì nghe nói ngày mai trời nắng。)"
  },
  {
    "STT": 231,
    "Lesson": 47,
    "Structure": "V (thể thông thường) / Adj / N + ようです",
    "Meaning": "Hình như là... / Có vẻ như là...",
    "Explanation": "Dùng để đưa ra suy đoán dựa trên cảm giác hoặc chứng cứ trực tiếp thấy được。",
    "Example": "隣[となり]の　部屋[へや]に　だれか　いる　ようです。[Tonari no heya ni dareka iru you desu.] (Hình như có ai đó ở phòng bên cạnh。)"
  },
  {
    "STT": 232,
    "Lesson": 47,
    "Structure": "N (âm thanh / mùi / vị) が します",
    "Meaning": "Có (âm thanh / mùi / vị)",
    "Explanation": "Dùng để miêu tả những thứ cảm nhận được bằng giác quan。",
    "Example": "いい　においが　します。[Ii nioi ga shimasu.] (Có mùi thơm thế。)"
  },
  {
    "STT": 233,
    "Lesson": 48,
    "Structure": "Thể sai khiến (Vさせる)",
    "Meaning": "Bắt / Cho phép làm V",
    "Explanation": "Nhóm 1: [i] -> [a] + seru。 Nhóm 2: bỏ [masu] + saseru。 Nhóm 3: kuru -> kosaseru; suru -> saseru。",
    "Example": "書[か]かせる [kakaseru] (bắt viết) | 食べ[たべ]させる [tabesaseru] (cho ăn)"
  },
  {
    "STT": 234,
    "Lesson": 48,
    "Structure": "N1 は N2 を V (tự động từ) させる",
    "Meaning": "N1 bắt / cho N2 làm V",
    "Explanation": "Chủ thể N1 gây ra hoặc cho phép hành động V của N2。",
    "Example": "部長[ぶちょう]は　加藤[かとう]さんを　出張[しゅっちょう]させます。[Buchou wa Katou-san o shutchou sasemasu.] (Trưởng phòng bắt anh Kato đi công tác。)"
  },
  {
    "STT": 235,
    "Lesson": 48,
    "Structure": "N1 は N2 に N3 を V (tha động từ) させる",
    "Meaning": "N1 bắt / cho N2 làm V lên N3",
    "Explanation": "Dùng trợ từ に cho đối tượng thực hiện hành động khi có tân ngữ を。",
    "Example": "わたしは　娘[むすめ]に　ピアノを　習わ[ならわ]せます。[Watashi wa musume ni piano o narawasemasu.] (Tôi cho con gái học piano。)"
  },
  {
    "STT": 236,
    "Lesson": 48,
    "Structure": "V (thể sai khiến) て いただけませんか",
    "Meaning": "Làm ơn cho phép tôi làm V được không？",
    "Explanation": "Cách xin phép làm gì đó một cách cực kỳ lịch sự。",
    "Example": "明日[あした]　休ま[やすま]せて　いただけませんか。[Ashita yasumasete itadakemasen ka.] (Ngày mai làm ơn cho phép tôi nghỉ được không ạ？)"
  },
  {
    "STT": 237,
    "Lesson": 49,
    "Structure": "Tôn kính ngữ (Sử dụng bị động / お V ます になります)",
    "Meaning": "Kính ngữ (Tôn kính)",
    "Explanation": "Dùng khi nói về hành động của người bề trên để thể hiện sự kính trọng。",
    "Example": "社長[しゃちょう]は　もう　帰られ[かえられ]ました。[Shachou wa mou kaeraremashita.] (Giám đốc đã về rồi ạ。) | 社長[しゃちょう]は　もう　お帰り[おかえり]に　なりました。[Shachou wa mou okaeri ni narimashita.] (Giám đốc đã về rồi ạ - Lịch sự hơn。)"
  },
  {
    "STT": 238,
    "Lesson": 49,
    "Structure": "Động từ tôn kính ngữ đặc biệt",
    "Meaning": "Kính ngữ (Từ đặc biệt)",
    "Explanation": "Các từ như: いらっしゃいます (đi/đến/ở)、 おっしゃいます (nói)、 なさいます (làm)。",
    "Example": "何[なに]を　召し上がり[めしあがり]ますか。[Nani o meshiagarimasu ka.] (Ngài dùng món gì ạ？)"
  },
  {
    "STT": 239,
    "Lesson": 49,
    "Structure": "お V ます ください",
    "Meaning": "Mời làm V (Lịch sự)",
    "Explanation": "Dùng để mời hoặc yêu cầu người trên làm gì một cách nhẹ nhàng。",
    "Example": "どうぞ　お掛け[かけ]　ください。[Douzo okake kudasai.] (Mời ngài ngồi ạ。)"
  },
  {
    "STT": 240,
    "Lesson": 50,
    "Structure": "Khiêm nhường ngữ (お V ます します / ご N します)",
    "Meaning": "Kính ngữ (Khiêm nhường)",
    "Explanation": "Dùng khi nói về hành động của mình liên quan đến người bề trên để thể hiện sự khiêm tốn。",
    "Example": "重い[おもい]　荷物[にもつ]を　お持ち[もち]　します。[Omoi nimotsu o omochi shimasu.] (Để cháu mang hành lý nặng giúp bác ạ。)"
  },
  {
    "STT": 241,
    "Lesson": 50,
    "Structure": "Động từ khiêm nhường ngữ đặc biệt",
    "Meaning": "Kính ngữ (Từ đặc biệt)",
    "Explanation": "Các từ như: 参り[まいり]ます (đi/đến)、 申し[もうし]ます (nói)、 いたし[いたし]ます (làm)。",
    "Example": "わたしは　ミラーと　申し[もうし]ます。[Watashi wa Miraa to moushimasu.] (Tôi tên là Miller ạ。)"
  },
  {
    "STT": 242,
    "Lesson": 50,
    "Structure": "Lịch sự ngữ (ございます / ～で ございます)",
    "Meaning": "Kính ngữ (Lịch sự)",
    "Explanation": "Dùng để nói năng lịch sự với khách hàng hoặc trong các tình huống trang trọng。",
    "Example": "電話[でんわ]は　あちらで　ございます。[Denwa wa achira de gozaimasu.] (Điện thoại ở đằng kia ạ。)"
  }
];
