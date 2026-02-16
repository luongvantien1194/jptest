/**
       * DỮ LIỆU NGỮ PHÁP:
       * - Bạn hãy convert file nguphap.csv thành JSON array
       *   rồi dán trực tiếp vào mảng grammarData dưới đây.
       * - Mỗi phần tử là 1 object có dạng:
       *   {
       *     lesson: number,
       *     structure: string,
       *     content: string
       *   }
       */
      /** @type {Array<{lesson:number, structure:string, content:string}>} */

      const grammarData = [
        {
          "Lesson": 1,
          "Grammatical_structure": "N1 は N2 です",
          "content": "N1 là N2",
          "explain": "Dùng để giới thiệu hoặc định nghĩa danh từ. Mẫu câu cơ bản nhất trong tiếng Nhật lịch sự.",
          "example": "私は学生です。[わたしはがくせいです。] (Tôi là sinh viên。)"
        },
        {
          "Lesson": 1,
          "Grammatical_structure": "N1 は N2 じゃありません",
          "content": "N1 không phải N2",
          "explain": "Dạng phủ định của です. Dùng trong hội thoại lịch sự.",
          "example": "私は先生じゃありません。[わたしはせんせいじゃありません。] (Tôi không phải là giáo viên。)"
        },
        {
          "Lesson": 1,
          "Grammatical_structure": "N1 は N2 ですか",
          "content": "N1 có phải là N2 không",
          "explain": "Dùng để hỏi xác nhận",
          "example": "thêm か cuối câu."
        },
        {
          "Lesson": 2,
          "Grammatical_structure": "これ/それ/あれ は N です",
          "content": "Cái này/đó/kia là...",
          "explain": "Dùng chỉ vật theo khoảng cách với người nói/nghe.",
          "example": "これは本です。[これはほんです。] (Đây là sách。)"
        },
        {
          "Lesson": 2,
          "Grammatical_structure": "この/その/あの + N",
          "content": "Này/đó/kia + danh từ",
          "explain": "Dùng bổ nghĩa trực tiếp cho danh từ.",
          "example": "この本は面白いです。[このほんはおもしろいです。] (Cuốn sách này thú vị。)"
        },
        {
          "Lesson": 3,
          "Grammatical_structure": "ここ/そこ/あそこ は N です",
          "content": "Đây/đó/kia là địa điểm...",
          "explain": "Dùng chỉ vị trí địa điểm theo khoảng cách.",
          "example": "ここは図書館です。[ここはとしょかんです。] (Đây là thư viện。)"
        },
        {
          "Lesson": 3,
          "Grammatical_structure": "N は どこ ですか",
          "content": "N ở đâu",
          "explain": "Dùng hỏi vị trí người/vật.",
          "example": "トイレはどこですか。[トイレはどこですか。] (Nhà vệ sinh ở đâu。)"
        },
        {
          "Lesson": 4,
          "Grammatical_structure": "いま ～じ ～ふん です",
          "content": "Bây giờ là...giờ...",
          "explain": "Dùng nói thời gian hiện tại.",
          "example": "今７時です。[いましちじです。] (Bây giờ là 7 giờ。)"
        },
        {
          "Lesson": 4,
          "Grammatical_structure": "～から～まで",
          "content": "Từ...đến...",
          "explain": "Chỉ khoảng thời gian hoặc phạm vi.",
          "example": "９時から５時まで働きます。[くじからごじまではたらきます。] (Tôi làm việc từ 9 giờ đến 5 giờ。)"
        },
        {
          "Lesson": 5,
          "Grammatical_structure": "～へ いきます/きます/かえります",
          "content": "Đi/đến/về...",
          "explain": "へ chỉ hướng di chuyển.",
          "example": "学校へ行きます。[がっこうへいきます。] (Tôi đi đến trường。)"
        },
        {
          "Lesson": 5,
          "Grammatical_structure": "～で いきます",
          "content": "Đi bằng...",
          "explain": "で chỉ phương tiện di chuyển.",
          "example": "バスで行きます。[ばすでいきます。] (Tôi đi bằng xe buýt。)"
        },
        {
          "Lesson": 6,
          "Grammatical_structure": "～を V",
          "content": "Tân ngữ của động từ",
          "explain": "を đánh dấu đối tượng trực tiếp của hành động.",
          "example": "パンを食べます。[ぱんをたべます。] (Tôi ăn bánh mì。)"
        },
        {
          "Lesson": 6,
          "Grammatical_structure": "～を します",
          "content": "Làm...",
          "explain": "Dùng với danh từ chỉ hành động.",
          "example": "宿題をします。[しゅくだいをします。] (Tôi làm bài tập。)"
        },
        {
          "Lesson": 7,
          "Grammatical_structure": "～で (ばしょ)",
          "content": "Làm ở đâu",
          "explain": "で chỉ nơi xảy ra hành động.",
          "example": "図書館で勉強します。[としょかんでべんきょうします。] (Tôi học ở thư viện。)"
        },
        {
          "Lesson": 7,
          "Grammatical_structure": "～ませんか",
          "content": "Mời/rủ...",
          "explain": "Cách rủ nhẹ nhàng lịch sự.",
          "example": "一緒に行きませんか。[いっしょにいきませんか。] (Bạn đi cùng tôi không。)"
        },
        {
          "Lesson": 8,
          "Grammatical_structure": "いけいようし です",
          "content": "Tính từ đuôi い",
          "explain": "Dùng mô tả tính chất.",
          "example": "この本は面白いです。[このほんはおもしろいです。] (Cuốn sách này thú vị。)"
        },
        {
          "Lesson": 8,
          "Grammatical_structure": "なけいようし です",
          "content": "Tính từ đuôi な",
          "explain": "Dùng mô tả trạng thái.",
          "example": "この町は静かです。[このまちはしずかです。] (Thị trấn này yên tĩnh。)"
        },
        {
          "Lesson": 9,
          "Grammatical_structure": "～が あります",
          "content": "Có (đồ vật)",
          "explain": "Dùng cho vật vô tri.",
          "example": "机の上に本があります。[つくえのうえにほんがあります。] (Trên bàn có sách。)"
        },
        {
          "Lesson": 9,
          "Grammatical_structure": "～が います",
          "content": "Có (người/động vật)",
          "explain": "Dùng cho người và động vật.",
          "example": "教室に学生がいます。[きょうしつにがくせいがいます。] (Trong lớp có sinh viên。)"
        },
        {
          "Lesson": 10,
          "Grammatical_structure": "～が すきです",
          "content": "Thích...",
          "explain": "Diễn tả cảm xúc",
          "example": "dùng が."
        },
        {
          "Lesson": 10,
          "Grammatical_structure": "あまり～ない",
          "content": "Không...lắm",
          "explain": "Dùng với phủ định.",
          "example": "私はあまりテレビを見ません。[わたしはあまりてれびをみません。] (Tôi không xem TV nhiều lắm。)"
        },
        {
          "Lesson": 11,
          "Grammatical_structure": "～にん/～まい/～だい",
          "content": "Cách đếm...",
          "explain": "Tiếng Nhật dùng lượng từ khi đếm.",
          "example": "学生が３人います。[がくせいがさんにんいます。] (Có 3 sinh viên。)"
        },
        {
          "Lesson": 12,
          "Grammatical_structure": "～より～のほうが",
          "content": "So sánh hơn",
          "explain": "So sánh hai đối tượng.",
          "example": "日本語より英語のほうが難しいです。[にほんごよりえいごのほうがむずかしいです。] (Tiếng Anh khó hơn tiếng Nhật。)"
        },
        {
          "Lesson": 13,
          "Grammatical_structure": "～たいです",
          "content": "Muốn...",
          "explain": "Diễn tả mong muốn cá nhân.",
          "example": "日本へ行きたいです。[にほんへいきたいです。] (Tôi muốn đi Nhật。)"
        },
        {
          "Lesson": 14,
          "Grammatical_structure": "～てください",
          "content": "Hãy...",
          "explain": "Yêu cầu lịch sự.",
          "example": "ドアを閉めてください。[どあをしめてください。] (Hãy đóng cửa。)"
        },
        {
          "Lesson": 15,
          "Grammatical_structure": "～てもいいです",
          "content": "Được phép...",
          "explain": "Xin phép hoặc cho phép.",
          "example": "入ってもいいですか。[はいってもいいですか。] (Tôi vào được không。)"
        },
        {
          "Lesson": 16,
          "Grammatical_structure": "～てから",
          "content": "Sau khi...",
          "explain": "Nhấn mạnh thứ tự hành động.",
          "example": "ご飯を食べてから勉強します。[ごはんをたべてからべんきょうします。] (Tôi ăn cơm xong rồi học。)"
        },
        {
          "Lesson": 17,
          "Grammatical_structure": "～なければなりません",
          "content": "Phải...",
          "explain": "Diễn tả nghĩa vụ.",
          "example": "勉強しなければなりません。[べんきょうしなければなりません。] (Tôi phải học。)"
        },
        {
          "Lesson": 18,
          "Grammatical_structure": "じしょけい + ことができます",
          "content": "Có thể...",
          "explain": "Diễn tả khả năng.",
          "example": "日本語を話すことができます。[にほんごをはなすことができます。] (Tôi có thể nói tiếng Nhật。)"
        },
        {
          "Lesson": 19,
          "Grammatical_structure": "じしょけい + ことがあります",
          "content": "Thỉnh thoảng...",
          "explain": "Hành động xảy ra không thường xuyên.",
          "example": "寿司を食べることがあります。[すしをたべることがあります。] (Thỉnh thoảng tôi ăn sushi。)"
        },
        {
          "Lesson": 20,
          "Grammatical_structure": "ふつうけい + といいます",
          "content": "Nói rằng...",
          "explain": "Tường thuật lời nói.",
          "example": "彼は行くと言いました。[かれはいくといいました。] (Anh ấy nói là sẽ đi。)"
        },
        {
          "Lesson": 21,
          "Grammatical_structure": "～とおもいます",
          "content": "Tôi nghĩ...",
          "explain": "Diễn tả ý kiến cá nhân.",
          "example": "日本語は難しいと思います。[にほんごはむずかしいとおもいます。] (Tôi nghĩ tiếng Nhật khó。)"
        },
        {
          "Lesson": 22,
          "Grammatical_structure": "ふつうけい + N",
          "content": "Bổ nghĩa danh từ",
          "explain": "Mệnh đề đứng trước danh từ.",
          "example": "私が買った本です。[わたしがかったほんです。] (Đây là cuốn sách tôi đã mua。)"
        },
        {
          "Lesson": 23,
          "Grammatical_structure": "～ながら",
          "content": "Vừa...vừa...",
          "explain": "Hai hành động đồng thời.",
          "example": "音楽を聞きながら勉強します。[おんがくをききながらべんきょうします。] (Tôi vừa nghe nhạc vừa học。)"
        },
        {
          "Lesson": 24,
          "Grammatical_structure": "～てくれます/～てもらいます",
          "content": "Cho/nhận hành động",
          "explain": "Diễn tả cho và nhận hành động.",
          "example": "友達が本をくれました。[ともだちがほんをくれました。] (Bạn tôi đã cho tôi sách。)"
        },
        {
          "Lesson": 25,
          "Grammatical_structure": "～たら",
          "content": "Nếu...",
          "explain": "Điều kiện giả định.",
          "example": "雨が降ったら行きません。[あめがふったらいきません。] (Nếu trời mưa tôi sẽ không đi。)"
        },
        {
          "Lesson": 26,
          "Grammatical_structure": "～んです",
          "content": "Giải thích...",
          "explain": "Nhấn mạnh lý do hoặc hoàn cảnh.",
          "example": "頭が痛いんです。[あたまがいたいんです。] (Vì tôi đau đầu。)"
        },
        {
          "Lesson": 27,
          "Grammatical_structure": "かのうけい",
          "content": "Có thể...",
          "explain": "Thể khả năng.",
          "example": "漢字が読めます。[かんじがよめます。] (Tôi có thể đọc kanji。)"
        },
        {
          "Lesson": 28,
          "Grammatical_structure": "～し、～し",
          "content": "Vừa...vừa...",
          "explain": "Liệt kê nhiều lý do.",
          "example": "安いし便利です。[やすいしべんりです。] (Vừa rẻ vừa tiện。)"
        },
        {
          "Lesson": 29,
          "Grammatical_structure": "～てしまいます",
          "content": "Lỡ/hoàn toàn...",
          "explain": "Nhấn mạnh tiếc nuối hoặc hoàn tất.",
          "example": "宿題を忘れてしまいました。[しゅくだいをわすれてしまいました。] (Tôi lỡ quên bài tập。)"
        },
        {
          "Lesson": 30,
          "Grammatical_structure": "いこうけい + とおもっています",
          "content": "Dự định...",
          "explain": "Kế hoạch đã suy nghĩ từ trước.",
          "example": "日本へ行こうと思っています。[にほんへいこうとおもっています。] (Tôi đang dự định đi Nhật。)"
        },
        {
          "Lesson": 31,
          "Grammatical_structure": "～ほうがいいです",
          "content": "Nên...",
          "explain": "Đưa lời khuyên.",
          "example": "早く寝たほうがいいです。[はやくねたほうがいいです。] (Bạn nên ngủ sớm。)"
        },
        {
          "Lesson": 32,
          "Grammatical_structure": "めいれいけい",
          "content": "Mệnh lệnh",
          "explain": "Ra lệnh trực tiếp.",
          "example": "早く行け。[はやくいけ。] (Đi nhanh lên。)"
        },
        {
          "Lesson": 33,
          "Grammatical_structure": "～とおりに",
          "content": "Làm theo...",
          "explain": "Làm đúng theo hướng dẫn.",
          "example": "説明のとおりにしてください。[せつめいのとおりにしてください。] (Hãy làm theo như hướng dẫn。)"
        },
        {
          "Lesson": 34,
          "Grammatical_structure": "～ば",
          "content": "Nếu...",
          "explain": "Điều kiện mang tính logic.",
          "example": "行けば分かります。[いけばわかります。] (Nếu đi thì sẽ hiểu。)"
        },
        {
          "Lesson": 35,
          "Grammatical_structure": "～ようになります",
          "content": "Trở nên...",
          "explain": "Diễn tả sự thay đổi.",
          "example": "日本語が話せるようになりました。[にほんごがはなせるようになりました。] (Tôi đã có thể nói tiếng Nhật。)"
        },
        {
          "Lesson": 36,
          "Grammatical_structure": "うけみけい",
          "content": "Bị/Được...",
          "explain": "Thể bị động.",
          "example": "先生にほめられました。[せんせいにほめられました。] (Tôi được giáo viên khen。)"
        },
        {
          "Lesson": 37,
          "Grammatical_structure": "しえきけい",
          "content": "Bắt/Cho phép...",
          "explain": "Thể sai khiến.",
          "example": "母は子供を勉強させます。[はははこどもをべんきょうさせます。] (Mẹ bắt con học。)"
        },
        {
          "Lesson": 38,
          "Grammatical_structure": "～てほしい",
          "content": "Mong muốn ai...",
          "explain": "Diễn tả mong muốn người khác làm gì.",
          "example": "手伝ってほしいです。[てつだってほしいです。] (Tôi muốn bạn giúp tôi。)"
        },
        {
          "Lesson": 39,
          "Grammatical_structure": "～てみます",
          "content": "Thử...",
          "explain": "Thử làm một hành động.",
          "example": "食べてみます。[たべてみます。] (Tôi sẽ thử ăn。)"
        },
        {
          "Lesson": 40,
          "Grammatical_structure": "～すぎます",
          "content": "Quá...",
          "explain": "Mức độ vượt quá giới hạn.",
          "example": "食べすぎました。[たべすぎました。] (Tôi đã ăn quá nhiều。)"
        },
        {
          "Lesson": 41,
          "Grammatical_structure": "～ために",
          "content": "Để...",
          "explain": "Diễn tả mục đích.",
          "example": "日本語を勉強するために日本へ来ました。[にほんごをべんきょうするためににほんへきました。] (Tôi đến Nhật để học tiếng Nhật。)"
        },
        {
          "Lesson": 42,
          "Grammatical_structure": "～そうです (ようす)",
          "content": "Có vẻ...",
          "explain": "Phán đoán qua quan sát.",
          "example": "この料理はおいしそうです。[このりょうりはおいしそうです。] (Món này trông ngon。)"
        },
        {
          "Lesson": 43,
          "Grammatical_structure": "～ばあいは",
          "content": "Trong trường hợp...",
          "explain": "Dùng trong quy định/hướng dẫn.",
          "example": "雨の場合は中止です。[あめのばあいはちゅうしです。] (Trong trường hợp mưa thì hủy。)"
        },
        {
          "Lesson": 44,
          "Grammatical_structure": "～ていただけませんか",
          "content": "Có thể... không?",
          "explain": "Yêu cầu rất lịch sự.",
          "example": "もう一度説明していただけませんか。[もういちどせつめいしていただけませんか。] (Anh/chị có thể giải thích lại không。)"
        },
        {
          "Lesson": 45,
          "Grammatical_structure": "～ところです",
          "content": "Đang/sắp/vừa...",
          "explain": "Diễn tả thời điểm của hành động.",
          "example": "今から出かけるところです。[いまからでかけるところです。] (Tôi đang chuẩn bị ra ngoài。)"
        },
        {
          "Lesson": 46,
          "Grammatical_structure": "～まま",
          "content": "Giữ nguyên trạng thái...",
          "explain": "Hành động tiếp theo xảy ra khi trạng thái trước giữ nguyên.",
          "example": "靴をはいたまま入ります。[くつをはいたままはいります。] (Vào mà vẫn mang giày。)"
        },
        {
          "Lesson": 47,
          "Grammatical_structure": "そんけいご",
          "content": "Kính ngữ",
          "explain": "Nâng hành động của người trên.",
          "example": "先生がいらっしゃいます。[せんせいがいらっしゃいます。] (Thầy giáo đang đến。)"
        },
        {
          "Lesson": 48,
          "Grammatical_structure": "けんじょうご",
          "content": "Khiêm nhường ngữ",
          "explain": "Hạ thấp hành động của bản thân.",
          "example": "私は参ります。[わたしはまいります。] (Tôi xin đến。)"
        },
        {
          "Lesson": 49,
          "Grammatical_structure": "～ことにします",
          "content": "Quyết định...",
          "explain": "Tự quyết định làm gì.",
          "example": "帰ることにします。[かえることにします。] (Tôi quyết định về。)"
        },
        {
          "Lesson": 50,
          "Grammatical_structure": "～らしいです",
          "content": "Hình như/Nghe nói...",
          "explain": "Suy đoán dựa trên thông tin gián tiếp.",
          "example": "彼は来ないらしいです。[かれはこないらしいです。] (Nghe nói anh ấy không đến。)"
        }
      ];
