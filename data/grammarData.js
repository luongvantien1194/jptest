const grammarData = [
  {
    "STT": 1,
    "Lesson": 1,
    "Structure": "N1 は N2 です",
    "Meaning": "N1 là N2",
    "Explanation": "Khẳng định N1 là N2. [は] đọc là 'wa'. Kết thúc bằng [です] để thể hiện sự lịch sự.",
    "Example": "私は学生です。[わたしはがくせいです] (Tôi là sinh viên.)"
  },
  {
    "STT": 2,
    "Lesson": 1,
    "Structure": "N1 は N2 じゃありません",
    "Meaning": "N1 không phải là N2",
    "Explanation": "Phủ định của [です]. Trong văn viết hoặc tình huống trang trọng có thể dùng [ではありません].",
    "Example": "ミラーさんは会社員じゃありません。[ミラーさんはかいしゃいんじゃありません] (Anh Miller không phải là nhân viên công ty.)"
  },
  {
    "STT": 3,
    "Lesson": 1,
    "Structure": "S か",
    "Meaning": "Câu hỏi",
    "Explanation": "Thêm trợ từ [か] vào cuối câu để biến thành câu hỏi.",
    "Example": "あの人はだれですか。[あのひとはだれですか] (Người kia là ai vậy?)"
  },
  {
    "STT": 4,
    "Lesson": 1,
    "Structure": "N も",
    "Meaning": "N cũng",
    "Explanation": "Thay thế trợ từ [は] khi danh từ có cùng đặc điểm với danh từ đã nhắc trước đó.",
    "Example": "サントスさんもブラジル人です。[サントスさんもブラジルじんです] (Anh Santos cũng là người Brazil.)"
  },
  {
    "STT": 5,
    "Lesson": 1,
    "Structure": "N1 の N2",
    "Meaning": "N2 của N1 / N2 thuộc N1",
    "Explanation": "Trợ từ [の] dùng để nối 2 danh từ. N1 bổ nghĩa cho N2 (sở hữu, nguồn gốc).",
    "Example": "私は IMC の社員です。[わたしは IMC のしゃいんです] (Tôi là nhân viên của IMC.)"
  },
  {
    "STT": 6,
    "Lesson": 2,
    "Structure": "これ / それ / あれ",
    "Meaning": "Cái này / đó / kia",
    "Explanation": "Đại từ chỉ định vật. [これ] gần người nói, [それ] gần người nghe, [あれ] xa cả hai.",
    "Example": "đó là cái gì vậy?"
  },
  {
    "STT": 7,
    "Lesson": 2,
    "Structure": "この N / その N / あの N",
    "Meaning": "Cái N này / đó / kia",
    "Explanation": "Bổ nghĩa cho danh từ đi kèm ngay sau. Không được dùng độc lập như [これ/それ/あれ].",
    "Example": "この本は私のです。[このほんはわたしのです] (Cuốn sách này là của tôi.)"
  },
  {
    "STT": 8,
    "Lesson": 2,
    "Structure": "そうです / そうじゃありません",
    "Meaning": "Đúng vậy / Không phải vậy",
    "Explanation": "Cách trả lời ngắn gọn cho câu hỏi danh từ [N ですか].",
    "Example": "それは辞書ですか。…はい、そうです。[それはじしょですか。…はい、そうです] (Đó là từ điển phải không? ...Vâng, đúng vậy.)"
  },
  {
    "STT": 9,
    "Lesson": 3,
    "Structure": "ここ / そこ / あそこ",
    "Meaning": "Chỗ này / đó / kia",
    "Explanation": "Đại từ chỉ địa điểm. [あそこ] là nơi xa cả người nói và người nghe.",
    "Example": "ここは受付です。[ここはうけつけです] (Đây là quầy lễ tân.)"
  },
  {
    "STT": 10,
    "Lesson": 3,
    "Structure": "こちら / そちら / あちら",
    "Meaning": "Phía này / đó / kia",
    "Explanation": "Cách nói lịch sự của [ここ/そこ/あそこ]. Dùng để chỉ hướng hoặc giới thiệu người.",
    "Example": "お手洗いはあちらです。[おてあらいはあちらです] (Nhà vệ sinh ở phía kia ạ.)"
  },
  {
    "STT": 11,
    "Lesson": 3,
    "Structure": "N1 は N2 (địa điểm) です",
    "Meaning": "N1 ở N2",
    "Explanation": "Dùng để chỉ vị trí của người hoặc vật.",
    "Example": "事務所はここです。[じむしょはここです] (Văn phòng ở chỗ này.)"
  },
  {
    "STT": 12,
    "Lesson": 3,
    "Structure": "どこ / どちら",
    "Meaning": "Ở đâu / Hướng nào",
    "Explanation": "[どちら] là cách hỏi lịch sự hơn của [どこ]. Thường dùng hỏi về công ty, quốc tịch.",
    "Example": "国はどちらですか。[くにはこちらですか] (Đất nước của bạn ở đâu?)"
  },
  {
    "STT": 13,
    "Lesson": 4,
    "Structure": "今 (いま) ...時 (じ) ...分 (ふん) です",
    "Meaning": "Bây giờ là ... giờ ... phút",
    "Explanation": "Dùng để nói thời gian hiện tại. Chú ý các biến âm của [分] như 'pun' hoặc 'fun'.",
    "Example": "今は９時７分です。[いまはくじななふんです] (Bây giờ là 9 giờ 7 phút.)"
  },
  {
    "STT": 14,
    "Lesson": 4,
    "Structure": "Vます",
    "Meaning": "Làm V",
    "Explanation": "Thể lịch sự của động từ. Diễn tả thói quen hoặc một sự thật, một hành động tương lai.",
    "Example": "毎朝６時に起きます。[まいあさろくじにおきます] (Mỗi sáng tôi dậy lúc 6 giờ.)"
  },
  {
    "STT": 15,
    "Lesson": 4,
    "Structure": "Vます ました / ませんでした",
    "Meaning": "Đã làm / Đã không làm",
    "Explanation": "Dạng quá khứ của động từ thể lịch sự. Thay [ます] bằng [ました/ませんでした].",
    "Example": "昨日は勉強しませんでした。[きのうはべんきょうしませんでした] (Hôm qua tôi đã không học.)"
  },
  {
    "STT": 16,
    "Lesson": 4,
    "Structure": "N (thời gian) に Vる",
    "Meaning": "Làm vào lúc...",
    "Explanation": "Dùng trợ từ [に] sau danh từ thời gian có con số cụ thể. Không dùng với [昨日, 今日...].",
    "Example": "７時に起きます。[ななじにおきます] (Tôi thức dậy lúc 7 giờ.)"
  },
  {
    "STT": 17,
    "Lesson": 4,
    "Structure": "N1 から N2 まで",
    "Meaning": "Từ N1 đến N2",
    "Explanation": "Chỉ phạm vi thời gian hoặc địa điểm.",
    "Example": "９時から５時まで働きます。[くじからごじまではたらきます] (Tôi làm việc từ 9 giờ đến 5 giờ.)"
  },
  {
    "STT": 18,
    "Lesson": 5,
    "Structure": "N (địa điểm) へ 行 (い) きます",
    "Meaning": "Đi đến N",
    "Explanation": "[へ] chỉ hướng di chuyển. Động từ thường đi kèm là [行きます], [来ます], [帰ります].",
    "Example": "スーパーへ行きます。[スーパーへいきます] (Tôi đi siêu thị.)"
  },
  {
    "STT": 19,
    "Lesson": 5,
    "Structure": "N (phương tiện) で 行 (い) きます",
    "Meaning": "Đi bằng N",
    "Explanation": "Trợ từ [で] chỉ phương tiện giao thông. Nếu đi bộ dùng [歩いて].",
    "Example": "電車で会社へ行きます。[でんしゃでかいしゃへいきます] (Tôi đi đến công ty bằng tàu điện.)"
  },
  {
    "STT": 20,
    "Lesson": 5,
    "Structure": "N (người) と Vる",
    "Meaning": "Làm V cùng với N",
    "Explanation": "Trợ từ [と] chỉ đối tượng cùng thực hiện hành động. Một mình dùng [一人で].",
    "Example": "家族と日本へ来ました。[かぞくにほんへきました] (Tôi đã đến Nhật cùng gia đình.)"
  },
  {
    "STT": 21,
    "Lesson": 6,
    "Structure": "N を Vる",
    "Meaning": "Làm N",
    "Explanation": "Trợ từ [を] chỉ đối tượng chịu tác động trực tiếp của tha động từ.",
    "Example": "パンを食べます。[パンをたべます] (Tôi ăn bánh mì.)"
  },
  {
    "STT": 22,
    "Lesson": 6,
    "Structure": "N を します",
    "Meaning": "Làm N",
    "Explanation": "Dùng với các danh từ chỉ hoạt động, thể thao, sự kiện.",
    "Example": "テニスをします。[テニスをします] (Tôi chơi tennis.)"
  },
  {
    "STT": 23,
    "Lesson": 6,
    "Structure": "何 (なに) を しますか",
    "Meaning": "Làm cái gì vậy?",
    "Explanation": "Dùng để hỏi về nội dung hành động.",
    "Example": "日曜日に何をしますか。[にちようびになにをしますか] (Chủ nhật bạn làm gì?)"
  },
  {
    "STT": 24,
    "Lesson": 6,
    "Structure": "Vます ませんか",
    "Meaning": "Cùng làm V nhé?",
    "Explanation": "Lời mời, rủ rê người nghe cùng thực hiện hành động.",
    "Example": "いっしょに京都へ行きませんか。[いっしょにきょうとへいきませんか] (Cùng đi Kyoto với tôi không?)"
  },
  {
    "STT": 25,
    "Lesson": 6,
    "Structure": "Vます ましょう",
    "Meaning": "Cùng làm V thôi",
    "Explanation": "Lời đề nghị cùng làm gì đó với thái độ chủ động hoặc đồng ý lời mời.",
    "Example": "ちょっと休みましょう。[ちょっとやすもう] (Cùng nghỉ một lát nào.)"
  },
  {
    "STT": 26,
    "Lesson": 7,
    "Structure": "N (công cụ/ngôn ngữ) で Vる",
    "Meaning": "Bằng N",
    "Explanation": "Chỉ phương thức, công cụ hoặc ngôn ngữ thực hiện hành động.",
    "Example": "日本語でレポートを書きます。[にほんごでレポートをかきます] (Tôi viết báo cáo bằng tiếng Nhật.)"
  },
  {
    "STT": 27,
    "Lesson": 7,
    "Structure": "N1 に N2 を あげます",
    "Meaning": "Tặng N2 cho N1",
    "Explanation": "N1 là người nhận. Tương tự với [貸します (cho mượn)], [教えます (dạy)].",
    "Example": "母に花をあげました。[ははにはなをあげました] (Tôi đã tặng hoa cho mẹ.)"
  },
  {
    "STT": 28,
    "Lesson": 7,
    "Structure": "N1 に N2 を もらいます",
    "Meaning": "Nhận N2 từ N1",
    "Explanation": "N1 là người đưa. Tương tự với [借ります (mượn)], [習います (học)].",
    "Example": "友達にプレゼントをもらいました。[ともだちにプレゼントをもらいました] (Tôi đã nhận quà từ bạn bè.)"
  },
  {
    "STT": 29,
    "Lesson": 7,
    "Structure": "もう Vます ました",
    "Meaning": "Đã làm V rồi",
    "Explanation": "Diễn tả hành động đã hoàn thành. Trả lời: [はい, もう...] hoặc [いいえ, まだです].",
    "Example": "もう昼ごはんを食べましたか。[もうひるごはんをたべましたか] (Bạn đã ăn trưa chưa?)"
  },
  {
    "STT": 30,
    "Lesson": 8,
    "Structure": "N は い形容詞 (けいようし) です",
    "Meaning": "N thì... (Tính từ i)",
    "Explanation": "Tính từ đuôi い giữ nguyên [い] kết hợp với [です]. Phủ định: Bỏ [い] + [くないです].",
    "Example": "この本はおもしろいです。[このほんはおもしろいです] (Cuốn sách này thú vị.)"
  },
  {
    "STT": 31,
    "Lesson": 8,
    "Structure": "N は な形容詞 (けいようし) です",
    "Meaning": "N thì... (Tính từ na)",
    "Explanation": "Tính từ đuôi な bỏ [な] khi kết hợp với [です]. Phủ định: [じゃありません].",
    "Example": "この町は静かです。[このまちはしずかです] (Thị trấn này yên tĩnh.)"
  },
  {
    "STT": 32,
    "Lesson": 8,
    "Structure": "い形容詞 N / な形容詞 な N",
    "Meaning": "N ... (Bổ nghĩa)",
    "Explanation": "Tính từ đuôi い giữ nguyên, tính từ đuôi な phải giữ [な] khi đứng trước danh từ.",
    "Example": "きれいな花を買いました。[きれいなはなをかいました] (Tôi đã mua một bông hoa đẹp.)"
  },
  {
    "STT": 33,
    "Lesson": 8,
    "Structure": "N は どうですか",
    "Meaning": "N thì thế nào?",
    "Explanation": "Hỏi về ấn tượng, cảm tưởng về sự vật/người.",
    "Example": "日本の生活はどうですか。[にほんのせいかつはどうですか] (Cuộc sống ở Nhật thế nào?)"
  },
  {
    "STT": 34,
    "Lesson": 8,
    "Structure": "N1 は どんな N2 ですか",
    "Meaning": "N1 là N2 như thế nào?",
    "Explanation": "Hỏi về đặc điểm cụ thể của N1. Trả lời: [Adj + N2].",
    "Example": "ハノイはどんな町ですか。[ハノイはどんなまちですか] (Hà Nội là thành phố như thế nào?)"
  },
  {
    "STT": 35,
    "Lesson": 8,
    "Structure": "S1 が、S2",
    "Meaning": "S1 nhưng S2",
    "Explanation": "Dùng trợ từ [が] nối hai mệnh đề có ý nghĩa tương phản.",
    "Example": "日本の食べ物はおいしいですが、高いです。[にほんのたべものはおいしいですが、たかいです] (Đồ ăn Nhật ngon nhưng đắt.)"
  },
  {
    "STT": 36,
    "Lesson": 9,
    "Structure": "N が あります / わかります",
    "Meaning": "Có / Hiểu N",
    "Explanation": "Dùng với đồ vật, thực vật hoặc kiến thức.",
    "Example": "私はお金があります。[わたしはおかねがあります] (Tôi có tiền.)"
  },
  {
    "STT": 37,
    "Lesson": 9,
    "Structure": "N が 好 (す) き / 嫌 (きら) い / 上手 (じょうず) / 下手 (へた) です",
    "Meaning": "Thích/Ghét/Giỏi/Kém N",
    "Explanation": "Các tính từ chỉ cảm xúc hoặc năng lực dùng trợ từ [가] cho đối tượng hướng tới.",
    "Example": "私はジャズが好きです。[わたしはジャズがすきです] (Tôi thích nhạc Jazz.)"
  },
  {
    "STT": 38,
    "Lesson": 9,
    "Structure": "S1 から、S2",
    "Meaning": "Vì S1 nên S2",
    "Explanation": "Mệnh đề đứng trước [から] chỉ nguyên nhân.",
    "Example": "時間がないから、タクシーで行きます。[じかんがないから、タクシーでいきます] (Vì không có thời gian nên tôi đi bằng taxi.)"
  },
  {
    "STT": 39,
    "Lesson": 10,
    "Structure": "N1 (địa điểm) に N2 が あります / います",
    "Meaning": "Ở N1 có N2",
    "Explanation": "[あります] dùng cho vật/cây. [います] dùng cho người/động vật. [に] chỉ vị trí.",
    "Example": "机の上に本があります。[つくえのうえにほんがあります] (Trên bàn có cuốn sách.)"
  },
  {
    "STT": 40,
    "Lesson": 10,
    "Structure": "N2 は N1 (địa điểm) に あります / います",
    "Meaning": "N2 ở N1",
    "Explanation": "Dùng khi đưa N2 lên làm chủ đề của câu.",
    "Example": "ミラーさんは事務所にいます。[ミラーさんはじむしつにいます] (Anh Miller ở văn phòng.)"
  },
  {
    "STT": 41,
    "Lesson": 11,
    "Structure": "N (số lượng) Vる",
    "Meaning": "Làm V bao nhiêu (số lượng)",
    "Explanation": "Các từ chỉ số lượng (つ, 人, 枚...) đặt ngay trước động từ. Không cần trợ từ sau số lượng.",
    "Example": "りんごを４つ買いました。[りんごをよっつかいました] (Tôi đã mua 4 quả táo.)"
  },
  {
    "STT": 42,
    "Lesson": 11,
    "Structure": "N (thời gian) に ...回 (かい) Vる",
    "Meaning": "Làm V ... lần trong (thời gian)",
    "Explanation": "Diễn tả tần suất thực hiện hành động.",
    "Example": "１か月に２回映画を見ます。[いっかげつににかいえいがをみます] (Tôi xem phim 2 lần trong 1 tháng.)"
  },
  {
    "STT": 43,
    "Lesson": 12,
    "Structure": "N1 は N2 より Adj です",
    "Meaning": "N1 ... hơn N2",
    "Explanation": "Cấu trúc so sánh hơn. N2 là mốc so sánh.",
    "Example": "この車はあの車より速いです。[このくるまはあのくるまよりはやいです] (Cái xe này nhanh hơn cái xe kia.)"
  },
  {
    "STT": 44,
    "Lesson": 12,
    "Structure": "N1 と N2 と どちらが Adj ですか",
    "Meaning": "N1 và N2 cái nào ... hơn?",
    "Explanation": "Dùng khi hỏi sự lựa chọn giữa 2 đối tượng. Trả lời: [N1 のほうが Adj です].",
    "Example": "サッカーと野球とどちらがおもしろいですか。[サッカーとやきゅうとどちらがおもしろいですか] (Bóng đá và bóng chày cái nào thú vị hơn?)"
  },
  {
    "STT": 45,
    "Lesson": 12,
    "Structure": "N [の中で] なに/どこ が いちばん Adj ですか",
    "Meaning": "Trong N cái nào/đâu ... nhất?",
    "Explanation": "So sánh nhất trong một phạm vi hoặc một nhóm.",
    "Example": "１年でいつがいちばん寒いですか。[いちねんでいつがいちばんさむいですか] (Trong 1 năm khi nào là lạnh nhất?)"
  },
  {
    "STT": 46,
    "Lesson": 13,
    "Structure": "N が 欲 (ほ) しい です",
    "Meaning": "Muốn có N",
    "Explanation": "Diễn tả mong muốn sở hữu đồ vật của người nói.",
    "Example": "私は新しいパソコンが欲しいです。[わたしはあたらしいパソコンがほしいです] (Tôi muốn có một chiếc máy tính mới.)"
  },
  {
    "STT": 47,
    "Lesson": 13,
    "Structure": "Vます たい です",
    "Meaning": "Muốn làm V",
    "Explanation": "Diễn tả ý muốn thực hiện hành động. Trợ từ [を] có thể đổi thành [が].",
    "Example": "日本へ行きたいです。[にほんへいきたいです] (Tôi muốn đi Nhật Bản.)"
  },
  {
    "STT": 48,
    "Lesson": 13,
    "Structure": "N (địa điểm) へ Vます に 行 (い) きます",
    "Meaning": "Đi đâu để làm gì",
    "Explanation": "Chỉ mục đích của hành động di chuyển. V chia Thể ます bỏ ます hoặc dùng Danh động từ.",
    "Example": "スーパーへ買い物に行きます。[スーパーへかいものにいきます] (Tôi đi siêu thị để mua sắm.)"
  },
  {
    "STT": 49,
    "Lesson": 14,
    "Structure": "Vて ください",
    "Meaning": "Hãy làm V",
    "Explanation": "Yêu cầu, nhờ vả lịch sự. Chia Thể て: Nhóm 1 [i->e tương ứng], Nhóm 2 [bỏ ます thêm て], Nhóm 3 [して/きて].",
    "Example": "ここに名前を書いてください。[ここになまえをかいてください] (Hãy viết tên vào đây.)"
  },
  {
    "STT": 50,
    "Lesson": 14,
    "Structure": "Vて います",
    "Meaning": "Đang làm V",
    "Explanation": "Diễn tả hành động đang diễn ra tại thời điểm nói.",
    "Example": "今雨が降っています。[いまあめがふっています] (Bây giờ trời đang mưa.)"
  },
  {
    "STT": 51,
    "Lesson": 14,
    "Structure": "Vます ましょうか",
    "Meaning": "Để tôi làm ... nhé?",
    "Explanation": "Lời đề nghị giúp đỡ người nghe một cách lịch sự.",
    "Example": "荷物を持ちましょうか。[にもつをもちましょうか] (Để tôi cầm hành lý giúp bạn nhé?)"
  },
  {
    "STT": 52,
    "Lesson": 15,
    "Structure": "Vて も いい ですか",
    "Meaning": "Làm V có được không?",
    "Explanation": "Xin phép thực hiện hành động.",
    "Example": "ここで写真を撮ってもいいですか。[ここでしゃしんをとってもいいですか] (Tôi chụp ảnh ở đây có được không?)"
  },
  {
    "STT": 53,
    "Lesson": 15,
    "Structure": "Vて は いけません",
    "Meaning": "Không được làm V",
    "Explanation": "Diễn tả sự cấm đoán (quy định, biển báo).",
    "Example": "ここでたばこを吸ってはいけません。[ここでたばこをすってはいけません] (Không được hút thuốc ở đây.)"
  },
  {
    "STT": 54,
    "Lesson": 15,
    "Structure": "Vて います (trạng thái)",
    "Meaning": "Đang (duy trì trạng thái)",
    "Explanation": "Diễn tả trạng thái hiện tại là kết quả của hành động trong quá khứ (sống, kết hôn, biết).",
    "Example": "私は結婚しています。[わたしはけっこんしています] (Tôi đã kết hôn.)"
  },
  {
    "STT": 55,
    "Lesson": 16,
    "Structure": "V1て",
    "Meaning": "V2て",
    "Explanation": "V3",
    "Example": "Làm V1"
  },
  {
    "STT": 56,
    "Lesson": 16,
    "Structure": "い形容詞 くて / な形容詞 で",
    "Meaning": "Vừa... vừa... (Nối tính từ)",
    "Explanation": "Tính từ đuôi い bỏ [い] thêm [くて]. Tính từ đuôi な và Danh từ thêm [で].",
    "Example": "この部屋は広くて、明るいです。[このへやはひろくて、あかるいです] (Căn phòng này vừa rộng vừa sáng.)"
  },
  {
    "STT": 57,
    "Lesson": 16,
    "Structure": "V1て から",
    "Meaning": "V2",
    "Explanation": "Sau khi làm V1 thì làm V2",
    "Example": "Nhấn mạnh trình tự: V2 chỉ thực hiện sau khi V1 kết thúc."
  },
  {
    "STT": 58,
    "Lesson": 17,
    "Structure": "Vない で ください",
    "Meaning": "Xin đừng làm V",
    "Explanation": "Yêu cầu đừng làm gì. Chia Thể ない: Nhóm 1 [i->a + nai], Nhóm 2 [+nai], Nhóm 3 [しない/こない].",
    "Example": "ここに車を止めないでください。[ここにくるまをとめないでください] (Xin đừng đỗ xe ở đây.)"
  },
  {
    "STT": 59,
    "Lesson": 17,
    "Structure": "Vない ければ なりません",
    "Meaning": "Phải làm V",
    "Explanation": "Diễn tả nghĩa vụ bắt buộc. Thể phủ định bỏ [い] thêm [ければなりません].",
    "Example": "毎日薬を飲まなければなりません。[まいにちくすりをのまなければなりません] (Hàng ngày tôi phải uống thuốc.)"
  },
  {
    "STT": 60,
    "Lesson": 17,
    "Structure": "Vない くても いい です",
    "Meaning": "Không làm V cũng được",
    "Explanation": "Diễn tả sự không cần thiết. Thể phủ định bỏ [い] thêm [くてもいいです].",
    "Example": "明日は来なくてもいいです。[あしたはこなくてもいいです] (Ngày mai không cần đến cũng được.)"
  },
  {
    "STT": 61,
    "Lesson": 18,
    "Structure": "Vる ことが できます",
    "Meaning": "Có thể làm V",
    "Explanation": "Diễn tả năng lực hoặc khả năng. Chia Thể từ điển (Vる): Nhóm 1 [i->u], Nhóm 2 [+ru], Nhóm 3 [する/くる].",
    "Example": "ミラーさんは漢字を読むことができます。[ミラーさんはかんじをよむことができます] (Anh Miller có thể đọc được chữ Kanji.)"
  },
  {
    "STT": 62,
    "Lesson": 18,
    "Structure": "趣味 (しゅみ) は Vる こと です",
    "Meaning": "Sở thích là việc làm V",
    "Explanation": "Danh từ hóa động từ bằng [こと] để định nghĩa sở thích.",
    "Example": "私の趣味は写真を撮ることです。[わたしのしゅみはしゃしんをとることです] (Sở thích của tôi là chụp ảnh.)"
  },
  {
    "STT": 63,
    "Lesson": 18,
    "Structure": "V1る / N の 前 (まえ) に",
    "Meaning": "V2",
    "Explanation": "Trước khi V1/N thì V2",
    "Example": "Chỉ trình tự thời gian. V2 xảy ra trước V1."
  },
  {
    "STT": 64,
    "Lesson": 19,
    "Structure": "Vた ことが あります",
    "Meaning": "Đã từng làm V",
    "Explanation": "Diễn tả kinh nghiệm quá khứ. Chia Thể た giống Thể て nhưng thay [te/de] bằng [ta/da].",
    "Example": "馬に乗ったことがあります。[うまにのったことがあります] (Tôi đã từng cưỡi ngựa.)"
  },
  {
    "STT": 65,
    "Lesson": 19,
    "Structure": "V1た り",
    "Meaning": "V2た り します",
    "Explanation": "Lúc làm V1",
    "Example": "lúc làm V2"
  },
  {
    "STT": 66,
    "Lesson": 19,
    "Structure": "Adj / N に なります",
    "Meaning": "Trở nên / Trở thành",
    "Explanation": "Diễn tả sự thay đổi trạng thái. Tính từ đuôi い bỏ [い] thành [く]. Tính từ đuôi な/Danh từ thêm [に].",
    "Example": "寒くなります。[さむくなります] (Trời trở nên lạnh.)"
  },
  {
    "STT": 67,
    "Lesson": 20,
    "Structure": "Thể thông thường",
    "Meaning": "Cách nói thân mật",
    "Explanation": "Dùng với bạn bè, gia đình. Động từ dùng Thể từ điển/ない/た. Tính từ な/Danh từ thay [です] bằng [だ].",
    "Example": "昨日,暇だった？[きのう,ひまだた？] (Hôm qua bạn có rảnh không?)"
  },
  {
    "STT": 68,
    "Lesson": 21,
    "Structure": "Thể thông thường と思 (おも) います",
    "Meaning": "Tôi nghĩ rằng...",
    "Explanation": "Diễn tả suy nghĩ, dự đoán. Tính từ な/Danh từ (hiện tại khẳng định) phải thêm [だ] trước [と].",
    "Example": "明日は雨が降ると思います。[あしたはあめがふるとおもいます] (Tôi nghĩ là ngày mai trời sẽ mưa.)"
  },
  {
    "STT": 69,
    "Lesson": 21,
    "Structure": "Thể thông thường と言 (い) いました",
    "Meaning": "Đã nói rằng...",
    "Explanation": "Dùng để trích dẫn lời nói.",
    "Example": "彼は「疲れた」と言いました。[かれは「つかれた」といいました] (Anh ấy đã nói là \"Mệt quá\".)"
  },
  {
    "STT": 70,
    "Lesson": 22,
    "Structure": "Thể thông thường N",
    "Meaning": "Mệnh đề bổ ngữ",
    "Explanation": "Dùng cả cụm câu bổ nghĩa cho danh từ N. Trợ từ [は] trong mệnh đề phụ đổi thành [が].",
    "Example": "これは私が撮った写真です。[これはわたしがとったしゃしんです] (Đây là bức ảnh mà tôi đã chụp.)"
  },
  {
    "STT": 71,
    "Lesson": 23,
    "Structure": "Vる / Vた 時 (とき)",
    "Meaning": "Khi làm V",
    "Explanation": "Diễn tả thời điểm. Vる: chưa xong hành động chính; Vた: đã xong hành động chính.",
    "Example": "本を借りる時,カードがいります。[ほんをかりるとき,カードがいります] (Khi mượn sách cần phải có thẻ.)"
  },
  {
    "STT": 72,
    "Lesson": 23,
    "Structure": "Vる と",
    "Meaning": "Nếu làm V thì... (Tất yếu)",
    "Explanation": "Diễn tả kết quả tất yếu, tự nhiên hoặc chỉ đường.",
    "Example": "vこのボタンを押すと、お釣りが出ます。[このボタンをおすと、おつりがでます] (Ấn nút này thì tiền thừa sẽ ra.)"
  },
  {
    "STT": 73,
    "Lesson": 24,
    "Structure": "N1 は 私 に N2 を くれます",
    "Meaning": "N1 cho tôi N2",
    "Explanation": "Dùng khi người nhận là người nói hoặc người thân của mình.",
    "Example": "佐藤さんは私に花をくれました。[さとうさんはわたしにはなをくれました] (Chị Sato đã tặng hoa cho tôi.)"
  },
  {
    "STT": 74,
    "Lesson": 24,
    "Structure": "Vて あげます / もらいます / くれます",
    "Meaning": "Làm V cho ai",
    "Explanation": "Cung cấp dịch vụ/giúp đỡ. あげます: mình làm cho; もらいます: mình nhận ơn; くれます: họ làm cho mình.",
    "Example": "私は木村さんに本を貸してあげました。[わたしはきむらさんにほんをかしてあげました] (Tôi đã cho chị Kimura mượn sách.)"
  },
  {
    "STT": 75,
    "Lesson": 25,
    "Structure": "Vた ら",
    "Meaning": "Nếu...",
    "Explanation": "Điều kiện giả định. Dùng rộng rãi cho mọi tình huống (ý chí, yêu cầu, mời mọc).",
    "Example": "お金があったら,旅行します。[おかねがあったら,りょこうします] (Nếu có tiền, tôi sẽ đi du lịch.)"
  },
  {
    "STT": 76,
    "Lesson": 25,
    "Structure": "Vて も / Adj くて も",
    "Meaning": "Dẫu cho...",
    "Explanation": "Diễn tả sự tương phản. Cho dù điều kiện xảy ra thì kết quả vẫn không đổi.",
    "Example": "雨が降っても,出かけます。[あめがふっても,でかけます] (Dù trời mưa tôi vẫn sẽ ra ngoài.)"
  },
  {
    "STT": 77,
    "Lesson": 26,
    "Structure": "Thể thông thường んです",
    "Meaning": "Giải thích lý do / Nhấn mạnh",
    "Explanation": "Dùng để nhấn mạnh thông tin hoặc giải thích nguyên nhân. Tính từ đuôi な và Danh từ thêm [な] trước [んです].",
    "Example": "頭 (あたま) が痛 (いた) いんです。[あたまがいたいんです] (Vì tôi bị đau đầu.)"
  },
  {
    "STT": 78,
    "Lesson": 26,
    "Structure": "Vて いただけませんか",
    "Meaning": "Anh/chị làm V giúp tôi được không?",
    "Explanation": "Mẫu câu nhờ vả cực kỳ lịch sự. Sử dụng động từ chia Thể て.",
    "Example": "書き方を教えていただけませんか。[かきかたをおしえていただけませんか] (Bạn có thể dạy tôi cách viết được không?)"
  },
  {
    "STT": 79,
    "Lesson": 27,
    "Structure": "V thể khả năng",
    "Meaning": "Có thể làm V",
    "Explanation": "Diễn tả năng lực hoặc điều kiện. Nhóm 1: [i] -> [e]る; Nhóm 2: bỏ ます thêm られる; Nhóm 3: [する -> できる], [くる -> こられる].",
    "Example": "日本語が少し話せます。[にほんごがすこしはなせます] (Tôi có thể nói một chút tiếng Nhật.)"
  },
  {
    "STT": 80,
    "Lesson": 27,
    "Structure": "N が 見 (み) えます / 聞 (き) こえます",
    "Meaning": "Nhìn thấy / Nghe thấy N",
    "Explanation": "Diễn tả khả năng tự nhiên của thị giác và thính giác (không phụ thuộc ý chí).",
    "Example": "窓から海が見えます。[まどからうみがみえます] (Từ cửa sổ có thể nhìn thấy biển.)"
  },
  {
    "STT": 81,
    "Lesson": 28,
    "Structure": "Vます ながら V2",
    "Meaning": "Vừa làm V1 vừa làm V2",
    "Explanation": "Diễn tả hai hành động diễn ra đồng thời, V2 là hành động chính. V1 bỏ ます.",
    "Example": "音楽を聞きながら勉強します。[おんがくをききながらべんきょうします] (Tôi vừa nghe nhạc vừa học bài.)"
  },
  {
    "STT": 82,
    "Lesson": 28,
    "Structure": "Vて います",
    "Meaning": "Thói quen hiện tại",
    "Explanation": "Diễn tả hành động lặp lại thường xuyên như thói quen hoặc nghề nghiệp.",
    "Example": "休みの日はいつもテニスをしています。[やすみのひはいつもテニスをしています] (Ngày nghỉ tôi luôn chơi tennis.)"
  },
  {
    "STT": 83,
    "Lesson": 29,
    "Structure": "Vて います",
    "Meaning": "Trạng thái kết quả (Tự động từ)",
    "Explanation": "Diễn tả trạng thái hiện hữu của sự vật sau khi một hành động tự phát xảy ra.",
    "Example": "窓が閉まっています。[まどがしまっています] (Cửa sổ đang đóng.)"
  },
  {
    "STT": 84,
    "Lesson": 29,
    "Structure": "Vて しまいました",
    "Meaning": "Đã hoàn thành / Lỡ làm...",
    "Explanation": "Diễn tả sự hoàn thành hoàn toàn của hành động hoặc sự tiếc nuối về một lỗi lầm.",
    "Example": "宿題を忘れてしまいました。[しゅくだいをわすれてしまいました] (Tôi lỡ quên bài tập mất rồi.)"
  },
  {
    "STT": 85,
    "Lesson": 30,
    "Structure": "Vて あります",
    "Meaning": "Đang có V (sẵn)",
    "Explanation": "Diễn tả trạng thái vật sau khi có người tác động vì mục đích nào đó. Dùng tha động từ chia Thể て.",
    "Example": "壁に地図が貼ってあります。[かべにちずがはってあります] (Trên tường có dán sẵn bản đồ.)"
  },
  {
    "STT": 86,
    "Lesson": 30,
    "Structure": "Vて おきます",
    "Meaning": "Làm sẵn / Làm chuẩn bị",
    "Explanation": "Thực hiện hành động để chuẩn bị cho tương lai hoặc giữ nguyên trạng thái.",
    "Example": "旅行の前に、切符を買っておきます。[りょこうのまえに、きっぷをかっておきます] (Trước khi đi du lịch, tôi sẽ mua vé sẵn.)"
  },
  {
    "STT": 87,
    "Lesson": 31,
    "Structure": "Vよう",
    "Meaning": "Thể ý định (thân mật)",
    "Explanation": "Dùng trong văn nói thân mật thay cho Vましょう. Nhóm 1: [i] -> [o]う; Nhóm 2: bỏ ます thêm よう; Nhóm 3: [しよう / こよう].",
    "Example": "ちょっと休みよう。[ちょっとやすもう] (Nghỉ một chút nào.)"
  },
  {
    "STT": 88,
    "Lesson": 31,
    "Structure": "Vよう と思 (おも) っています",
    "Meaning": "Đang định làm V",
    "Explanation": "Diễn tả dự định đã nhen nhóm từ trước và hiện tại vẫn giữ dự định đó.",
    "Example": "将来日本で働こうと思っています。[しょうらいにほんではたらこうとおもっています] (Tôi đang định sau này sẽ làm việc tại Nhật.)"
  },
  {
    "STT": 89,
    "Lesson": 32,
    "Structure": "Vた / Vない ほうがいいです",
    "Meaning": "Nên / Không nên làm V",
    "Explanation": "Dùng để đưa ra lời khuyên. Nên làm: Thể た; Không nên: Thể ない.",
    "Example": "毎日運動したほうがいいです。[まいにちうんどうしたほうがいいです] (Bạn nên vận động mỗi ngày.)"
  },
  {
    "STT": 90,
    "Lesson": 32,
    "Structure": "Thể thông thường でしょう / かもしれません",
    "Meaning": "Có lẽ / Có thể là...",
    "Explanation": "Dự đoán sự việc. [でしょう] (80%), [かもしれません] (50%).",
    "Example": "明日は雨が降るかもしれません。[あしたはあめがふるかもしれません] (Có thể ngày mai trời sẽ mưa.)"
  },
  {
    "STT": 91,
    "Lesson": 33,
    "Structure": "V mệnh lệnh / V cấm đoán",
    "Meaning": "Mệnh lệnh / Cấm đoán",
    "Explanation": "Mệnh lệnh: Nhóm 1 [i] -> [e]. Cấm đoán: [Vる + な]. Dùng trong trường hợp khẩn cấp hoặc cổ vũ.",
    "Example": "止まれ！[とまれ！] (Dừng lại!) / 動くな！[うごくな！] (Cấm cử động!)"
  },
  {
    "STT": 92,
    "Lesson": 34,
    "Structure": "V1た / N の あとで V2",
    "Meaning": "Sau khi làm V1 thì làm V2",
    "Explanation": "Diễn tả trình tự thời gian, V2 xảy ra sau khi V1 kết thúc hoàn toàn.",
    "Example": "仕事のあとで、飲みに行きます。[しごとのあとで、のみにいきます] (Sau khi xong việc, chúng ta đi uống nhé.)"
  },
  {
    "STT": 93,
    "Lesson": 35,
    "Structure": "Vば",
    "Meaning": "Thể điều kiện",
    "Explanation": "Diễn tả điều kiện giả định. Nhóm 1: [i] -> [e]ば; Nhóm 2: bỏ ます thêm れば; Nhóm 3: [すれば / くれば].",
    "Example": "ボタンを押せば、窓が開きます。[ボタンをおせば、まどがあきます] (Nếu ấn nút này, cửa sổ sẽ mở.)"
  },
  {
    "STT": 94,
    "Lesson": 36,
    "Structure": "Vる ように します",
    "Meaning": "Cố gắng làm V",
    "Explanation": "Diễn tả sự nỗ lực thực hiện một hành động như một thói quen.",
    "Example": "毎日、野菜を食べるようにしています。[まいにち、やさいをたべるようにしています] (Tôi đang cố gắng ăn rau mỗi ngày.)"
  },
  {
    "STT": 95,
    "Lesson": 37,
    "Structure": "V bị động",
    "Meaning": "Thể bị động",
    "Explanation": "Chủ ngữ bị tác động. Nhóm 1: [i] -> [a]れる; Nhóm 2: bỏ ます thêm られる; Nhóm 3: [される / こられる].",
    "Example": "私は部長にほめられました。[わたしはぶちょうにほめられました] (Tôi đã được trưởng phòng khen.)"
  },
  {
    "STT": 96,
    "Lesson": 38,
    "Structure": "Vる のは Adj です",
    "Meaning": "Việc làm V thì...",
    "Explanation": "Danh từ hóa động từ bằng [の] để làm chủ ngữ trong câu miêu tả tính chất.",
    "Example": "テニスをするのはおもしろいです。[テニスをするのはおもしろいです] (Việc chơi tennis thì thú vị.)"
  },
  {
    "STT": 97,
    "Lesson": 39,
    "Structure": "Vて / Vない くて",
    "Meaning": "Vì... nên...",
    "Explanation": "Chỉ nguyên nhân dẫn đến cảm xúc hoặc trạng thái không chủ ý.",
    "Example": "ニュースを聞いて、びっくりしました。[ニュースをきいて、びっくりしました] (Nghe tin xong tôi đã rất ngạc nhiên.)"
  },
  {
    "STT": 98,
    "Lesson": 40,
    "Structure": "疑問詞 Thể thông thường か",
    "Meaning": "Câu hỏi gián tiếp có từ để hỏi",
    "Explanation": "Lồng một câu hỏi vào trong một câu văn lớn.",
    "Example": "どこへ行くか、教えてください。[どこへいくか、おしえてください] (Hãy cho tôi biết bạn đi đâu.)"
  },
  {
    "STT": 99,
    "Lesson": 41,
    "Structure": "Vて いただきます / くださいます",
    "Meaning": "Nhận / Cho hành động (Kính ngữ)",
    "Explanation": "[いただきます]: Nhận từ người trên. [くださいます]: Người trên làm cho mình.",
    "Example": "先生に漢字を教えていただきました。[せんせいにかんじをおしえていただきました] (Tôi được thầy giáo dạy chữ Kanji cho.)"
  },
  {
    "STT": 100,
    "Lesson": 42,
    "Structure": "Vる ために",
    "Meaning": "Để làm V",
    "Explanation": "Diễn tả mục đích có ý chí. Vế sau là hành động để đạt mục đích.",
    "Example": "将来のために、貯金しています。[しょうらいのために、ちょきんしています] (Tôi đang tiết kiệm tiền vì tương lai.)"
  },
  {
    "STT": 101,
    "Lesson": 43,
    "Structure": "Vます そうです",
    "Meaning": "Có vẻ sắp...",
    "Explanation": "Phỏng đoán dựa trên quan sát trực tiếp. Bỏ ます thêm そうです.",
    "Example": "今にも雨が降りそうです。[いまにもあめがふりそうです] (Trời có vẻ sắp mưa đến nơi rồi.)"
  },
  {
    "STT": 102,
    "Lesson": 44,
    "Structure": "Vます すぎます",
    "Meaning": "Làm việc gì đó quá mức",
    "Explanation": "Vượt quá giới hạn, thường mang nghĩa tiêu cực. Bỏ ます thêm すぎます.",
    "Example": "昨日はお酒を飲みすぎました。[きのうはおさけをのみすぎました] (Hôm qua tôi đã uống quá nhiều rượu.)"
  },
  {
    "STT": 103,
    "Lesson": 45,
    "Structure": "Thể thông thường 場合 (ばあい) は",
    "Meaning": "Trong trường hợp...",
    "Explanation": "Giả định một tình huống cụ thể. Tính từ な thêm [な], Danh từ thêm [の].",
    "Example": "遅れる場合は、連絡してください。[おくれるばあいは、れんらくしてください] (Trong trường hợp muộn, hãy liên lạc nhé.)"
  },
  {
    "STT": 104,
    "Lesson": 45,
    "Structure": "Thể thông thường のに",
    "Meaning": "Thế mà / Vậy mà...",
    "Explanation": "Diễn tả sự tương phản gây bất ngờ hoặc bất mãn.",
    "Example": "約束したのに、彼は来ませんでした。[やくそくしたのに、かれはきませんでした] (Đã hẹn rồi thế mà anh ấy không đến.)"
  },
  {
    "STT": 105,
    "Lesson": 46,
    "Structure": "Vる ところです",
    "Meaning": "Đúng lúc sắp làm V",
    "Explanation": "Diễn tả giai đoạn ngay trước khi hành động bắt đầu.",
    "Example": "今から出かけるところです。[いまからでかけるところです] (Bây giờ tôi chuẩn bị đi đây.)"
  },
  {
    "STT": 106,
    "Lesson": 46,
    "Structure": "Vた ばかりです",
    "Meaning": "Vừa mới làm V (tâm lý)",
    "Explanation": "Diễn tả hành động vừa hoàn thành theo cảm nhận của người nói.",
    "Example": "彼は先月結婚したばかりです。[かれはせんげつけっこんしたばかりです] (Anh ấy vừa mới kết hôn tháng trước.)"
  },
  {
    "STT": 107,
    "Lesson": 47,
    "Structure": "Thể thông thường そうです",
    "Meaning": "Nghe nói là...",
    "Explanation": "Truyền đạt lại thông tin từ nguồn khác.",
    "Example": "天気予報によると、明日は晴れるそうです。[てんきよほうによると、あしたははれるそうです] (Theo dự báo thời tiết, nghe nói mai trời nắng.)"
  },
  {
    "STT": 108,
    "Lesson": 48,
    "Structure": "V sai khiến",
    "Meaning": "Thể sai khiến",
    "Explanation": "Bắt buộc hoặc cho phép người khác làm gì. Nhóm 1: [i] -> [a]せる; Nhóm 2: bỏ ます thêm させる; Nhóm 3: [させる / こさせる].",
    "Example": "部長は私を出張させました。[ぶちょうはわたしをしゅっちょうさせました] (Trưởng phòng bắt tôi đi công tác.)"
  },
  {
    "STT": 109,
    "Lesson": 49,
    "Structure": "V尊敬 (そんけい)",
    "Meaning": "Thể tôn kính",
    "Explanation": "Nâng cao hành động của đối phương. Các dạng: [お Vます になります], [V bị động].",
    "Example": "社長はもうお帰りになりました。[しゃちょうはもうおかえりになりました] (Giám đốc đã về rồi ạ.)"
  },
  {
    "STT": 110,
    "Lesson": 50,
    "Structure": "V khiêm nhường",
    "Meaning": "Thể khiêm nhường",
    "Explanation": "Hạ thấp hành động của bản thân để tôn kính người nghe. Cấu trúc: [お Vます します].",
    "Example": "私が荷物をお持ちします。[わたしがにもつをおもちします] (Tôi xin phép được cầm hành lý cho ạ.)"
  },
  {
    "STT": 111,
    "Lesson": 50,
    "Structure": "V sai khiến bị động",
    "Meaning": "Bị bắt phải làm V",
    "Explanation": "Diễn tả sự cưỡng ép. Chia sang sai khiến rồi chuyển sang bị động.",
    "Example": "私は母に買い物に行かせられました。[わたしはははにかいものにいかせられました] (Tôi bị mẹ bắt đi mua đồ.)"
  }
];
