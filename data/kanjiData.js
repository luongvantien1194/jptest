
         /** 
      *DỮ LIỆU THẬT:
       * - Hãy export các file Excel (kanji.xlsx, tuvung.xlsx, nguphap.xlsx)
       *   sang CSV/JSON rồi chuyển thành object JS tương ứng với cấu trúc dưới đây.
       * - Sau đó thay nội dung 3 mảng kanjiData / vocabData / grammarData bằng dữ liệu thật.
       *
       * Cấu trúc:
       * 1) Kanji:
       *    STT | Kanji | name | Kun | On | bo_thu | Example
       *    -> { stt, kanji, name, kun, on, bo_thu, example }
       * 2) Từ vựng:
       *    Lesson | Hiragana | Kanji | Meaning | Vru | Vt | Vnai | Vrare | type | note | category
       *    -> { lesson, hiragana, kanji, meaning, vru, vt, vnai, vrare, type, note, category }
       * 3) Ngữ pháp:
       *    Lesson | Grammatical_structure | content
       *    -> { lesson, structure, content }
       */

      /**
       * DỮ LIỆU KANJI:
       * - Bạn hãy convert file kanji.csv thành JSON array
       *   rồi dán trực tiếp vào mảng kanjiData dưới đây.
       * - Mỗi phần tử là 1 object có dạng:
       *   {
       *     stt: number,
       *     kanji: string,
       *     name: string,
       *     kun: string,
       *     on: string,
       *     bo_thu: string,
       *     example: string
       *   }
       */
      /** @type {Array<{stt:number, kanji:string, name:string, kun:string, on:string, bo_thu:string, example:string}>} */
      const kanjiData = [
        {
          "STT": 1,
          "Kanji": "一",
          "name": "Nhất",
          "Kun": "ひと",
          "On": "いち;いつ",
          "bo_thu": "Nhất (一)",
          "Example": "一人 (ひとり): Một người;一つ (ひとつ): Một cái;一月 (いちがつ): Tháng 1;一年 (いちねん): Một năm;一番 (いちばん): Số 1",
          "JLPT": "N5"
        },
        {
          "STT": 2,
          "Kanji": "二",
          "name": "Nhị",
          "Kun": "ふた",
          "On": "に",
          "bo_thu": "Nhị (二)",
          "Example": "二つ (ふたつ): Hai cái;二人 (ふたり): Hai người;二月 (にがつ): Tháng 2;二回 (にかい): Hai lần;二十日 (はつか): Ngày 20",
          "JLPT": "N5"
        },
        {
          "STT": 3,
          "Kanji": "三",
          "name": "Tam",
          "Kun": "み",
          "On": "さん",
          "bo_thu": "Nhất (一)",
          "Example": "三つ (みっつ): Ba cái;三月 (さんがつ): Tháng 3;三人 (さんにん): Ba người;三年 (さんねん): Ba năm;三日 (みっか): Ngày mồng 3",
          "JLPT": "N5"
        },
        {
          "STT": 4,
          "Kanji": "四",
          "name": "Tứ",
          "Kun": "よ;よん",
          "On": "し",
          "bo_thu": "Vi (囗)",
          "Example": "四つ (よっつ): Bốn cái;四月 (しがつ): Tháng 4;四人 (よにん): Bốn người;四年 (よねん): Bốn năm;四日 (よっか): Ngày mồng 4",
          "JLPT": "N5"
        },
        {
          "STT": 5,
          "Kanji": "五",
          "name": "Ngũ",
          "Kun": "いつ",
          "On": "ご",
          "bo_thu": "Nhị (二)",
          "Example": "五つ (いつつ): Năm cái;五月 (ごがつ): Tháng 5;五人 (ごにん): Năm người;五年 (ごねん): Năm năm;五日 (いつか): Ngày mồng 5",
          "JLPT": "N5"
        },
        {
          "STT": 6,
          "Kanji": "六",
          "name": "Lục",
          "Kun": "む",
          "On": "ろく",
          "bo_thu": "Bát (八)",
          "Example": "六つ (むっつ): Sáu cái;六月 (ろくがつ): Tháng 6;六人 (ろくにん): Sáu người;六年 (ろくねん): Sáu năm;六日 (むいか): Ngày mồng 6",
          "JLPT": "N5"
        },
        {
          "STT": 7,
          "Kanji": "七",
          "name": "Thất",
          "Kun": "なな",
          "On": "しち",
          "bo_thu": "Nhất (一)",
          "Example": "七つ (ななつ): Bảy cái;七月 (しちがつ): Tháng 7;七人 (しちにん): Bảy người;七年 (しちねん): Bảy năm;七日 (なのか): Ngày mồng 7",
          "JLPT": "N5"
        },
        {
          "STT": 8,
          "Kanji": "八",
          "name": "Bát",
          "Kun": "や",
          "On": "はち",
          "bo_thu": "Bát (八)",
          "Example": "八つ (やっつ): Tám cái;八月 (はちがつ): Tháng 8;八人 (はちにん): Tám người;八年 (はちねん): Tám năm;八日 (ようか): Ngày mồng 8",
          "JLPT": "N5"
        },
        {
          "STT": 9,
          "Kanji": "九",
          "name": "Cửu",
          "Kun": "ここの",
          "On": "きゅう;く",
          "bo_thu": "Ất (乙)",
          "Example": "九つ (ここのつ): Chín cái;九月 (くがつ): Tháng 9;九人 (きゅうにん): Chín người;九年 (きゅうねん): Chín năm;九日 (ここのか): Ngày mồng 9",
          "JLPT": "N5"
        },
        {
          "STT": 10,
          "Kanji": "十",
          "name": "Thập",
          "Kun": "とお",
          "On": "じゅう",
          "bo_thu": "Thập (十)",
          "Example": "十 (とお): Mười cái;十月 (じゅうがつ): Tháng 10;十日 (とおか): Ngày mồng 10;十分 (じゅうぶん): Đầy đủ;二十歳 (はたち): 20 tuổi",
          "JLPT": "N5"
        },
        {
          "STT": 11,
          "Kanji": "百",
          "name": "Bách",
          "Kun": "",
          "On": "ひゃく;びゃく;ぴゃく",
          "bo_thu": "Bạch (白)",
          "Example": "百 (ひゃく): 100;二百 (にひゃく): 200;三百 (さんびゃく): 300;六百 (ろっぴゃく): 600;八百 (はっぴゃく): 800",
          "JLPT": "N5"
        },
        {
          "STT": 12,
          "Kanji": "千",
          "name": "Thiên",
          "Kun": "ち",
          "On": "せん;ぜん",
          "bo_thu": "Thập (十)",
          "Example": "千 (せん): 1000;二千 (にせん): 2000;三千 (さんぜん): 3000;八千 (はっせん): 8000;千枚 (せんまい): 1000 tờ",
          "JLPT": "N5"
        },
        {
          "STT": 13,
          "Kanji": "万",
          "name": "Vạn",
          "Kun": "",
          "On": "まん;ばん",
          "bo_thu": "Nhất (一)",
          "Example": "一万 (いちまん): 1 vạn (10.000);万一 (まんいち): Vạn nhất (nếu chẳng may);万人 (ばんにん): Mọi người;万国 (ばんこく): Tất cả các nước;万引き (まんびき): Ăn cắp vặt",
          "JLPT": "N5"
        },
        {
          "STT": 14,
          "Kanji": "円",
          "name": "Viên",
          "Kun": "まる",
          "On": "えん",
          "bo_thu": "Vi (囗)",
          "Example": "円い (まるい): Tròn;円 (えん): Đồng Yên;円高 (えんだか): Yên tăng giá;円安 (えんやす): Yên giảm giá;楕円 (だえん): Hình elip",
          "JLPT": "N5"
        },
        {
          "STT": 15,
          "Kanji": "日",
          "name": "Nhật;Nhựt",
          "Kun": "ひ;び",
          "On": "にち;じつ",
          "bo_thu": "Nhật (日)",
          "Example": "日本 (にほん): Nhật Bản;毎日 (まいにち): Mỗi ngày;日曜日 (にちようび): Chủ nhật;誕生日 (たんじょうび): Ngày sinh nhật;休日 (きゅうじつ): Ngày nghỉ",
          "JLPT": "N5"
        },
        {
          "STT": 16,
          "Kanji": "月",
          "name": "Nguyệt",
          "Kun": "つき",
          "On": "げつ;がつ",
          "bo_thu": "Nguyệt (月)",
          "Example": "月曜日 (げつようび): Thứ hai;一月 (いちがつ): Tháng 1;今月 (こんげつ): Tháng này;毎月 (まいつき): Mỗi tháng;三日月 (みかづき): Trăng khuyết",
          "JLPT": "N5"
        },
        {
          "STT": 17,
          "Kanji": "火",
          "name": "Hỏa",
          "Kun": "ひ",
          "On": "か",
          "bo_thu": "Hỏa (火)",
          "Example": "火曜日 (かようび): Thứ ba;火 (ひ): Lửa;火山 (かざん): Núi lửa;火事 (かじ): Hỏa hoạn;花火 (はなび): Pháo hoa",
          "JLPT": "N5"
        },
        {
          "STT": 18,
          "Kanji": "水",
          "name": "Thủy",
          "Kun": "みず",
          "On": "すい",
          "bo_thu": "Thủy (水)",
          "Example": "水曜日 (すいようび): Thứ tư;水 (みず): Nước;海水 (かいすい): Nước biển;水道 (すいどう): Nước máy;香水 (こうすい): Nước hoa",
          "JLPT": "N5"
        },
        {
          "STT": 19,
          "Kanji": "木",
          "name": "Mộc",
          "Kun": "き",
          "On": "もく;ぼく",
          "bo_thu": "Mộc (木)",
          "Example": "木曜日 (もくようび): Thứ năm;木 (き): Cây;木綿 (もめん): Bông;大木 (たいぼく): Cây lớn;土木 (どぼく): Công trình công cộng",
          "JLPT": "N5"
        },
        {
          "STT": 20,
          "Kanji": "金",
          "name": "Kim",
          "Kun": "かね",
          "On": "きん",
          "bo_thu": "Kim (金)",
          "Example": "金曜日 (きんようび): Thứ sáu;お金 (おかね): Tiền;料金 (りょうきん): Phí;貯金 (ちょきん): Tiết kiệm tiền;金物 (かなもの): Đồ kim loại",
          "JLPT": "N5"
        },
        {
          "STT": 21,
          "Kanji": "土",
          "name": "Thổ",
          "Kun": "つち",
          "On": "ど;と",
          "bo_thu": "Thổ (土)",
          "Example": "土曜日 (どようび): Thứ bảy;土 (つち): Đất;土地 (とち): Đất đai;お土産 (おみやげ): Quà lưu niệm;粘土 (ねんど): Đất sét",
          "JLPT": "N5"
        },
        {
          "STT": 22,
          "Kanji": "山",
          "name": "Sơn",
          "Kun": "やま",
          "On": "さん",
          "bo_thu": "Sơn (山)",
          "Example": "山 (やま): Núi;富士山 (ふじさん): Núi Phú Sĩ;火山 (かざん): Núi lửa;登山 (とざん): Leo núi;山道 (やまみち): Đường núi",
          "JLPT": "N5"
        },
        {
          "STT": 23,
          "Kanji": "川",
          "name": "Xuyên",
          "Kun": "かわ",
          "On": "せん",
          "bo_thu": "Xuyên (巛)",
          "Example": "川 (かわ): Sông;小川 (おがわ): Suối nhỏ;河川 (かせん): Sông ngòi;ナイル川 (ないるがわ): Sông Nile;川岸 (かわぎし): Bờ sông",
          "JLPT": "N5"
        },
        {
          "STT": 24,
          "Kanji": "田",
          "name": "Điền",
          "Kun": "た",
          "On": "でん",
          "bo_thu": "Điền (田)",
          "Example": "田んぼ (たんぼ): Ruộng;水田 (すいでん): Ruộng lúa nước;成田 (なりた): Sân bay Narita;油田 (ゆでん): Mỏ dầu;田中 (たなか): Tên người Tanaka",
          "JLPT": "N5"
        },
        {
          "STT": 25,
          "Kanji": "人",
          "name": "Nhân",
          "Kun": "ひと",
          "On": "じん;にん",
          "bo_thu": "Nhân (人)",
          "Example": "人 (ひと): Người;日本人 (にほんじん): Người Nhật;三人 (さんにん): Ba người;大人 (おとな): Người lớn;人口 (じんこう): Dân số",
          "JLPT": "N5"
        },
        {
          "STT": 26,
          "Kanji": "口",
          "name": "Khẩu",
          "Kun": "くち",
          "On": "こう;く",
          "bo_thu": "Khẩu (口)",
          "Example": "口 (くち): Miệng;入り口 (いりぐち): Lối vào;出口 (でぐち): Lối ra;人口 (じんこう): Dân số;窓口 (まどぐち): Cửa bán vé",
          "JLPT": "N5"
        },
        {
          "STT": 27,
          "Kanji": "車",
          "name": "Xa",
          "Kun": "くるま",
          "On": "しゃ",
          "bo_thu": "Xa (車)",
          "Example": "車 (くるま): Xe hơi;電車 (でんしゃ): Tàu điện;自転車 (じてんしゃ): Xe đạp;救急車 (きゅうきゅうしゃ): Xe cấp cứu;駐車場 (ちゅうしゃじょう): Bãi đỗ xe",
          "JLPT": "N5"
        },
        {
          "STT": 28,
          "Kanji": "門",
          "name": "Môn",
          "Kun": "かど",
          "On": "もん",
          "bo_thu": "Môn (門)",
          "Example": "門 (もん): Cổng;専門 (せんもん): Chuyên môn;正門 (せいもん): Cổng chính;名門 (めいもん): Danh môn;部門 (ぶもん): Bộ phận",
          "JLPT": "N5"
        },
        {
          "STT": 29,
          "Kanji": "火",
          "name": "Hỏa",
          "Kun": "ひ",
          "On": "か",
          "bo_thu": "Hỏa (火)",
          "Example": "火曜日 (かようび): Thứ ba;火 (ひ): Lửa;火山 (かざん): Núi lửa;火事 (kaji): Hỏa hoạn;点火 (てんか): Đánh lửa",
          "JLPT": "N5"
        },
        {
          "STT": 30,
          "Kanji": "水",
          "name": "Thủy",
          "Kun": "みず",
          "On": "すい",
          "bo_thu": "Thủy (水)",
          "Example": "水曜日 (すいようび): Thứ tư;水 (みず): Nước;水道 (すいどう): Nước máy;水泳 (すいえい): Bơi lội;香水 (こうすい): Nước hoa",
          "JLPT": "N5"
        },
        {
          "STT": 31,
          "Kanji": "木",
          "name": "Mộc",
          "Kun": "き",
          "On": "もく;ぼく",
          "bo_thu": "Mộc (木)",
          "Example": "木曜日 (もくようび): Thứ năm;木 (き): Cây;木綿 (もめん): Bông cotton;大木 (たいぼく): Cây lớn;土木 (どぼく): Công trình công cộng",
          "JLPT": "N5"
        },
        {
          "STT": 32,
          "Kanji": "金",
          "name": "Kim",
          "Kun": "かね",
          "On": "きん;こん",
          "bo_thu": "Kim (金)",
          "Example": "金曜日 (きんようび): Thứ sáu;お金 (おかね): Tiền;料金 (りょうきん): Phí;貯金 (ちょきん): Tiết kiệm;金物 (かなもの): Đồ kim loại",
          "JLPT": "N5"
        },
        {
          "STT": 33,
          "Kanji": "土",
          "name": "Thổ",
          "Kun": "つち",
          "On": "ど;と",
          "bo_thu": "Thổ (土)",
          "Example": "土曜日 (どようび): Thứ bảy;土 (つち): Đất;土地 (とち): Đất đai;土木 (どぼく): Công trình công cộng;お土産 (おみやげ): Quà lưu niệm",
          "JLPT": "N5"
        },
        {
          "STT": 34,
          "Kanji": "本",
          "name": "Bản",
          "Kun": "もと",
          "On": "ほん",
          "bo_thu": "Mộc (木)",
          "Example": "本 (ほん): Sách;日本 (にほん): Nhật Bản;山本 (やまもと): Tên người Yamamoto;本日 (ほんじつ): Hôm nay;一本 (いっぽん): Một cái (vật dài)",
          "JLPT": "N5"
        },
        {
          "STT": 35,
          "Kanji": "休",
          "name": "Hưu",
          "Kun": "やす",
          "On": "きゅう",
          "bo_thu": "Nhân (人)",
          "Example": "休む (やすむ): Nghỉ ngơi;休み (やすみ): Ngày nghỉ;休日 (きゅうじつ): Ngày nghỉ;冬休み (ふゆやすみ): Nghỉ đông;連休 (れんきゅう): Nghỉ lễ dài ngày",
          "JLPT": "N5"
        },
        {
          "STT": 36,
          "Kanji": "語",
          "name": "Ngữ",
          "Kun": "かた",
          "On": "ご",
          "bo_thu": "Ngôn (言)",
          "Example": "日本語 (にほんご): Tiếng Nhật;英語 (えいご): Tiếng Anh;物語 (ものがたり): Câu chuyện;単語 (たんご): Từ vựng;敬語 (けいご): Kính ngữ",
          "JLPT": "N5"
        },
        {
          "STT": 37,
          "Kanji": "何",
          "name": "Hà",
          "Kun": "なに;なん",
          "On": "か",
          "bo_thu": "Nhân (人)",
          "Example": "何 (なに): Cái gì;何時 (なんじ): Mấy giờ;何人 (なんにん): Mấy người;何度 (なんど): Mấy lần;何か (なにか): Cái gì đó",
          "JLPT": "N5"
        },
        {
          "STT": 38,
          "Kanji": "上",
          "name": "Thượng",
          "Kun": "うえ;あ;のぼ",
          "On": "じょう",
          "bo_thu": "Nhất (一)",
          "Example": "上 (うえ): Trên;上手 (じょうず): Giỏi;上がる (あがる): Tăng lên;上着 (うわぎ): Áo khoác;屋上 (おくじょう): Sân thượng",
          "JLPT": "N5"
        },
        {
          "STT": 39,
          "Kanji": "下",
          "name": "Hạ",
          "Kun": "した;さ;くだ",
          "On": "か;げ",
          "bo_thu": "Nhất (一)",
          "Example": "下 (した): Dưới;下手 (へた): Dở;地下鉄 (ちかてつ): Tàu điện ngầm;下がる (さがる): Hạ xuống;靴下 (くつした): Đôi tất",
          "JLPT": "N5"
        },
        {
          "STT": 40,
          "Kanji": "左",
          "name": "Tả",
          "Kun": "ひだり",
          "On": "さ",
          "bo_thu": "Công (工)",
          "Example": "左 (ひだり): Bên trái;左側 (ひだりがわ): Phía bên trái;左右 (さゆう): Trái phải;左利き (ひだりきき): Thuận tay trái;左折 (させつ): Rẽ trái",
          "JLPT": "N5"
        },
        {
          "STT": 41,
          "Kanji": "右",
          "name": "Hữu",
          "Kun": "みぎ",
          "On": "う;ゆう",
          "bo_thu": "Khẩu (口)",
          "Example": "右 (みぎ): Bên phải;右側 (みぎがわ): Phía bên phải;右手 (みぎて): Tay phải;右折 (うせつ): Rẽ phải;左右 (さゆう): Tương đương",
          "JLPT": "N5"
        },
        {
          "STT": 42,
          "Kanji": "中",
          "name": "Trung",
          "Kun": "なか",
          "On": "ちゅう",
          "bo_thu": "Côn (丨)",
          "Example": "中 (なか): Bên trong;中国 (ちゅうごく): Trung Quốc;一日中 (いちにちじゅう): Suốt cả ngày;中心 (ちゅうしん): Trung tâm;中学 (ちゅうがく): Trung học cơ sở",
          "JLPT": "N5"
        },
        {
          "STT": 43,
          "Kanji": "外",
          "name": "Ngoại",
          "Kun": "そと;はず",
          "On": "がい;げ",
          "bo_thu": "Tịch (夕)",
          "Example": "外 (そと): Bên ngoài;外国 (がいこく): Nước ngoài;外国人 (がいこくじん): Người nước ngoài;外科 (げか): Khoa ngoại;外す (はずす): Sai lệch",
          "JLPT": "N5"
        },
        {
          "STT": 44,
          "Kanji": "前",
          "name": "Tiền",
          "Kun": "まえ",
          "On": "ぜん",
          "bo_thu": "Đao (刀)",
          "Example": "前 (まえ): Trước;名前 (なまえ): Tên;午前 (ごぜん): Sáng (AM);前回 (ぜんかい): Lần trước;前方 (ぜんぽう): Phía trước",
          "JLPT": "N5"
        },
        {
          "STT": 45,
          "Kanji": "後",
          "name": "Hậu",
          "Kun": "うし;あと;おく",
          "On": "ご;こう",
          "bo_thu": "Xích (彳)",
          "Example": "後ろ (うしろ): Phía sau;後で (あとで): Lát nữa;午後 (ごご): Chiều (PM);最後 (さいご): Cuối cùng;後輩 (こうはい): Đàn em",
          "JLPT": "N5"
        },
        {
          "STT": 46,
          "Kanji": "午",
          "name": "Ngọ",
          "Kun": "",
          "On": "ご",
          "bo_thu": "Thập (十)",
          "Example": "午前 (ごぜん): Buổi sáng;午後 (ごご): Buổi chiều;正午 (しょうご): Chính ngọ;午睡 (ごすい): Ngủ trưa;午年 (うまどし): Năm Ngọ",
          "JLPT": "N5"
        },
        {
          "STT": 47,
          "Kanji": "時",
          "name": "Thời",
          "Kun": "とき",
          "On": "じ",
          "bo_thu": "Nhật (日)",
          "Example": "時 (とき): Khi;時間 (じかん): Thời gian;時計 (とけい): Đồng hồ;九時 (くじ): 9 giờ;同時 (どうじ): Đồng thời",
          "JLPT": "N5"
        },
        {
          "STT": 48,
          "Kanji": "間",
          "name": "Gian",
          "Kun": "あいだ;ま",
          "On": "かん;けん",
          "bo_thu": "Môn (門)",
          "Example": "間 (あいだ): Ở giữa;時間 (じかん): Thời gian;間に合う (まにあう): Kịp lúc;客間 (きゃくま): Phòng khách;人間 (にんげん): Con người",
          "JLPT": "N5"
        },
        {
          "STT": 49,
          "Kanji": "東",
          "name": "Đông",
          "Kun": "ひがし",
          "On": "とう",
          "bo_thu": "Mộc (木)",
          "Example": "東 (ひがし): Phía đông;東京 (とうきょう): Tokyo;東南アジア (とうなんあじあ): Đông Nam Á;中東 (ちゅうとう): Trung Đông;東口 (ひがしぐち): Cửa đông",
          "JLPT": "N5"
        },
        {
          "STT": 50,
          "Kanji": "西",
          "name": "Tây",
          "Kun": "にし",
          "On": "せい;さい",
          "bo_thu": "Á (襾)",
          "Example": "西 (にし): Phía tây;関西 (かんさい): Vùng Kansai;北西 (ほくせい): Tây bắc;西洋 (せいよう): Phương Tây;西口 (にしぐち): Cửa tây",
          "JLPT": "N5"
        },
        {
          "STT": 51,
          "Kanji": "南",
          "name": "Nam",
          "Kun": "みなみ",
          "On": "なん",
          "bo_thu": "Thập (十)",
          "Example": "南 (みなみ): Phía nam;東南 (とうなん): Đông nam;南口 (みなみぐち): Cửa nam;南極 (なんきょく): Nam cực;南米 (なんべい): Nam Mỹ",
          "JLPT": "N5"
        },
        {
          "STT": 52,
          "Kanji": "北",
          "name": "Bắc",
          "Kun": "きた",
          "On": "ほく;ほっ",
          "bo_thu": "Chủy (匕)",
          "Example": "北 (きた): Phía bắc;北海道 (ほっかいどう): Hokkaido;南北 (なんぼく): Nam bắc;北東 (ほくとう): Đông bắc;北口 (きたぐち): Cửa bắc",
          "JLPT": "N5"
        },
        {
          "STT": 53,
          "Kanji": "天",
          "name": "Thiên",
          "Kun": "あめ;あま",
          "On": "てん",
          "bo_thu": "Đại (大)",
          "Example": "天気 (てんき): Thời tiết;天国 (てんごく): Thiên đường;天才 (てんさい): Thiên tài;天皇 (てんのう): Thiên hoàng;天ぷら (てんぷら): Món Tempura",
          "JLPT": "N5"
        },
        {
          "STT": 54,
          "Kanji": "気",
          "name": "Khí",
          "Kun": "",
          "On": "き;け",
          "bo_thu": "Khí (气)",
          "Example": "気 (き): Khí chất;元気 (げんき): Khỏe mạnh;天気 (てんき): Thời tiết;電気 (でんき): Điện;気分 (きぶん): Tâm trạng",
          "JLPT": "N5"
        },
        {
          "STT": 55,
          "Kanji": "雨",
          "name": "Vũ",
          "Kun": "あめ;あま",
          "On": "う",
          "bo_thu": "Vũ (雨)",
          "Example": "雨 (あめ): Mưa;大雨 (おおあめ): Mưa lớn;雨天 (うてん): Trời mưa;雨傘 (あまがさ): Ô đi mưa;梅雨 (つゆ): Mùa mưa",
          "JLPT": "N5"
        },
        {
          "STT": 56,
          "Kanji": "花",
          "name": "Hoa",
          "Kun": "はな",
          "On": "か",
          "bo_thu": "Thảo (艹)",
          "Example": "花 (はな): Hoa;花火 (はなび): Pháo hoa;花瓶 (かびん): Bình hoa;生け花 (いけばな): Nghệ thuật cắm hoa;花見 (はなみ): Ngắm hoa",
          "JLPT": "N5"
        },
        {
          "STT": 57,
          "Kanji": "白",
          "name": "Bạch",
          "Kun": "しろ",
          "On": "はく;びゃく",
          "bo_thu": "Bạch (白)",
          "Example": "白い (しろい): Trắng;白人 (はくじん): Người da trắng;白鳥 (はくちょう): Thiên nga;面白い (おもしろい): Thú vị;告白 (こくはく): Tỏ tình",
          "JLPT": "N5"
        },
        {
          "STT": 58,
          "Kanji": "赤",
          "name": "Xích",
          "Kun": "あか",
          "On": "せき;しゃく",
          "bo_thu": "Xích (赤)",
          "Example": "赤い (あかい): Đỏ;赤ん坊 (あかんぼう): Em bé;赤十字 (せきじゅうじ): Chữ thập đỏ;赤道 (せきどう): Xích đạo;赤ちゃん (あかちゃん): Em bé",
          "JLPT": "N5"
        },
        {
          "STT": 59,
          "Kanji": "青",
          "name": "Thanh",
          "Kun": "あお",
          "On": "せい;しょう",
          "bo_thu": "Thanh (青)",
          "Example": "青い (あおい): Xanh;青年 (せいねん): Thanh niên;青森 (あおもり): Tỉnh Aomori;真っ青 (まっさお): Xanh ngắt;青空 (あおぞら): Bầu trời xanh",
          "JLPT": "N5"
        },
        {
          "STT": 60,
          "Kanji": "黒",
          "name": "Hắc",
          "Kun": "くろ",
          "On": "こく",
          "bo_thu": "Hắc (黒)",
          "Example": "黒い (くろい): Đen;黒板 (こくばん): Bảng đen;黒字 (くろじ): Lãi;真っ黒 (まっくろ): Đen kịt;黒糖 (こくとう): Đường đen",
          "JLPT": "N5"
        },
        {
          "STT": 61,
          "Kanji": "見",
          "name": "Kiến",
          "Kun": "み",
          "On": "けん",
          "bo_thu": "Kiến (見)",
          "Example": "見る (みる): Nhìn;見学 (けんがく): Tham quan học tập;意見 (いけん): Ý kiến;見本 (みほん): Hàng mẫu;花見 (はなみ): Ngắm hoa",
          "JLPT": "N5"
        },
        {
          "STT": 62,
          "Kanji": "行",
          "name": "Hành;Hàng",
          "Kun": "い;ゆ;おこな",
          "On": "こう;ぎょう",
          "bo_thu": "Hành (行)",
          "Example": "行く (いく): Đi;銀行 (ぎんこう): Ngân hàng;旅行 (りょこう): Du lịch;三行目 (さんぎょうめ): Dòng thứ 3;行動 (こうどう): Hành động",
          "JLPT": "N5"
        },
        {
          "STT": 63,
          "Kanji": "来",
          "name": "Lai",
          "Kun": "く;きた",
          "On": "らい",
          "bo_thu": "Nhân (人)",
          "Example": "来る (くる): Đến;来年 (らいねん): Sang năm;来週 (らいしゅう): Tuần sau;未来 (みらい): Tương lai;来日 (らいにち): Đến Nhật",
          "JLPT": "N5"
        },
        {
          "STT": 64,
          "Kanji": "食",
          "name": "Thực",
          "Kun": "た;く",
          "On": "しょく;じき",
          "bo_thu": "Thực (食)",
          "Example": "食べる (たべる): Ăn;食事 (しょくじ): Bữa ăn;食べ物 (たべもの): Đồ ăn;食堂 (しょくどう): Nhà ăn;朝食 (ちょうしょく): Bữa sáng",
          "JLPT": "N5"
        },
        {
          "STT": 65,
          "Kanji": "飲",
          "name": "Ẩm",
          "Kun": "の",
          "On": "いん",
          "bo_thu": "Thực (食)",
          "Example": "飲む (のむ): Uống;飲み物 (のみもの): Đồ uống;飲料水 (いんりょうすい): Nước uống;飲食店 (いんしょくてん): Nhà hàng;飲み会 (のみかい): Tiệc rượu",
          "JLPT": "N5"
        },
        {
          "STT": 66,
          "Kanji": "学",
          "name": "Học",
          "Kun": "まな",
          "On": "がく",
          "bo_thu": "Tử (子)",
          "Example": "学生 (がくせい): Sinh viên;大学 (だいがく): Đại học;学校 (がっこう): Trường học;学習 (がくしゅう): Học tập;修学旅行 (しゅうがくりょこう): Chuyến đi thực tế",
          "JLPT": "N5"
        },
        {
          "STT": 67,
          "Kanji": "校",
          "name": "Hiệu",
          "Kun": "",
          "On": "こう",
          "bo_thu": "Mộc (木)",
          "Example": "学校 (がっこう): Trường học;校長 (こうちょう): Hiệu trưởng;高校 (こうこう): Trường cấp 3;中学校 (ちゅうがっこう): Trường cấp 2;校舎 (こうしゃ): Tòa nhà trường học",
          "JLPT": "N5"
        },
        {
          "STT": 68,
          "Kanji": "先",
          "name": "Tiên",
          "Kun": "さき",
          "On": "せん",
          "bo_thu": "Nhi (儿)",
          "Example": "先生 (せんせい): Giáo viên;先週 (せんしゅう): Tuần trước;先に (さきに): Trước;先日 (せんじつ): Hôm trước;先月 (せんげつ): Tháng trước",
          "JLPT": "N5"
        },
        {
          "STT": 69,
          "Kanji": "生",
          "name": "Sinh",
          "Kun": "い;う;な;は;なま",
          "On": "せい;しょう",
          "bo_thu": "Sinh (生)",
          "Example": "先生 (せんせい): Giáo viên;学生 (がくせい): Sinh viên;誕生日 (たんじょうび): Sinh nhật;生きる (いきる): Sống;一生 (いっしょう): Cả đời",
          "JLPT": "N5"
        },
        {
          "STT": 70,
          "Kanji": "高",
          "name": "Cao",
          "Kun": "たか",
          "On": "こう",
          "bo_thu": "Cao (高)",
          "Example": "高い (たかい): Cao/đắt;高校 (こうこう): Trường cấp 3;高級 (こうきゅう): Cao cấp;最高 (さいこう): Tuyệt nhất;高橋 (たかはし): Tên người Takahashi",
          "JLPT": "N5"
        },
        {
          "STT": 71,
          "Kanji": "安",
          "name": "An",
          "Kun": "やす",
          "On": "あん",
          "bo_thu": "Miên (宀)",
          "Example": "安い (やすい): Rẻ;安全 (あんぜん): An toàn;安心 (あんしん): Yên tâm;不安 (ふあん): Bất an;安売り (やすうり): Bán rẻ",
          "JLPT": "N5"
        },
        {
          "STT": 72,
          "Kanji": "大",
          "name": "Đại",
          "Kun": "おお",
          "On": "だい;たい",
          "bo_thu": "Đại (大)",
          "Example": "大きい (おおきい): Lớn;大学 (だいがく): Đại học;大切 (たいせつ): Quan trọng;大人 (おとな): Người lớn;大変 (たいへん): Vất vả",
          "JLPT": "N5"
        },
        {
          "STT": 73,
          "Kanji": "小",
          "name": "Tiểu",
          "Kun": "ちい;こ;お",
          "On": "しょう",
          "bo_thu": "Tiểu (小)",
          "Example": "小さい (ちいさい): Nhỏ;小学校 (しょうがっこう): Trường tiểu học;小包 (こづつみ): Bưu kiện;小説 (しょうせつ): Tiểu thuyết;小川 (おがわ): Suối nhỏ",
          "JLPT": "N5"
        },
        {
          "STT": 74,
          "Kanji": "新",
          "name": "Tân",
          "Kun": "あたら",
          "On": "しん",
          "bo_thu": "Cân (斤)",
          "Example": "新しい (あたらしい): Mới;新聞 (しんぶん): Báo;新年 (しんねん): Năm mới;新幹線 (しんかんせん): Tàu Shinkansen;斬新 (ざんしん): Mới mẻ",
          "JLPT": "N5"
        },
        {
          "STT": 75,
          "Kanji": "古",
          "name": "Cổ",
          "Kun": "ふる",
          "On": "こ",
          "bo_thu": "Thập (十)",
          "Example": "古い (ふるい): Cũ;中古 (ちゅうこ): Đồ cũ;古本 (ふるほん): Sách cũ;古代 (こだい): Cổ đại;古河 (ふるかわ): Tên người Furukawa",
          "JLPT": "N5"
        },
        {
          "STT": 76,
          "Kanji": "多",
          "name": "Đa",
          "Kun": "おお",
          "On": "た",
          "bo_thu": "Tịch (夕)",
          "Example": "多い (おおい): Nhiều;多分 (たぶん): Có lẽ;多数 (たすう): Đa số;多忙 (たぼう): Rất bận;滅多に (めったに): Hiếm khi",
          "JLPT": "N5"
        },
        {
          "STT": 77,
          "Kanji": "少",
          "name": "Thiểu;Thiếu",
          "Kun": "すく;すこ",
          "On": "しょう",
          "bo_thu": "Tiểu (小)",
          "Example": "少し (すこし): Một chút;少ない (すくない): Ít;少々 (しょうしょう): Một chút;少年 (しょうねん): Thiếu niên;少女 (しょうじょ): Thiếu nữ",
          "JLPT": "N5"
        },
        {
          "STT": 78,
          "Kanji": "長",
          "name": "Trường;Trưởng",
          "Kun": "なが",
          "On": "ちょう",
          "bo_thu": "Trường (長)",
          "Example": "長い (ながい): Dài;社長 (しゃちょう): Giám đốc;校長 (こうちょう): Hiệu trưởng;部長 (ぶちょう): Trưởng phòng;身長 (しんちょう): Chiều cao",
          "JLPT": "N5"
        },
        {
          "STT": 79,
          "Kanji": "早",
          "name": "Tảo",
          "Kun": "はや",
          "On": "そう;さっ",
          "bo_thu": "Nhật (日)",
          "Example": "早い (はやい): Sớm;早速 (さっそく): Ngay lập tức;早起き (はやおき): Dậy sớm;早朝 (そうちょう): Sáng sớm;早退 (そうたい): Về sớm",
          "JLPT": "N5"
        },
        {
          "STT": 80,
          "Kanji": "近",
          "name": "Cận",
          "Kun": "ちか",
          "On": "きん",
          "bo_thu": "Sước (⻌)",
          "Example": "近い (ちかい): Gần;近く (ちかく): Gần đây;近所 (きんじょ): Hàng xóm;最近 (さいきん): Dạo này;近視 (きんし): Cận thị",
          "JLPT": "N5"
        },
        {
          "STT": 81,
          "Kanji": "遠",
          "name": "Viễn",
          "Kun": "とお",
          "On": "えん",
          "bo_thu": "Sước (⻌)",
          "Example": "遠い (とい): Xa;遠足 (えんそく): Dã ngoại;遠慮 (えんりょ): Ngần ngại;望遠鏡 (ぼうえんきょう): Kính thiên văn;遠回り (とおまわり): Đi đường vòng",
          "JLPT": "N5"
        },
        {
          "STT": 82,
          "Kanji": "明",
          "name": "Minh",
          "Kun": "あか;あ",
          "On": "めい;みょう",
          "bo_thu": "Nhật (日)",
          "Example": "明るい (あかるい): Sáng sủa;明日 (あした): Ngày mai;説明 (せつめい): Giải thích;発明 (はつめい): Phát minh;不明 (ふめい): Không rõ",
          "JLPT": "N5"
        },
        {
          "STT": 83,
          "Kanji": "暗",
          "name": "Ám",
          "Kun": "くら",
          "On": "あん",
          "bo_thu": "Nhật (日)",
          "Example": "暗い (くらい): Tối;暗記 (あんき): Học thuộc lòng;真っ暗 (まっくら): Tối đen;暗号 (あんごう): Mật mã;暗室 (あんしつ): Phòng tối",
          "JLPT": "N5"
        },
        {
          "STT": 84,
          "Kanji": "好",
          "name": "Hảo;Hiếu",
          "Kun": "す",
          "On": "こう",
          "bo_thu": "Nữ (女)",
          "Example": "好き (すき): Thích;大好き (だいすき): Rất thích;好物 (こうぶつ): Món khoái khẩu;好調 (こうちょう): Thuận lợi;好み (このみ): Sở thích",
          "JLPT": "N5"
        },
        {
          "STT": 85,
          "Kanji": "友",
          "name": "Hữu",
          "Kun": "とも",
          "On": "ゆう",
          "bo_thu": "Hựu (又)",
          "Example": "友達 (ともだち): Bạn bè;友人 (ゆうじん): Bạn bè (lịch sự);友情 (ゆうじょう): Tình bạn;親友 (しんゆう): Bạn thân;友軍 (ゆうぐん): Quân đồng minh",
          "JLPT": "N5"
        },
        {
          "STT": 86,
          "Kanji": "聞",
          "name": "Văn",
          "Kun": "き",
          "On": "ぶん;もん",
          "bo_thu": "Môn (門)",
          "Example": "聞く (きく): Nghe;新聞 (しんぶん): Báo;聞こえる (きこえる): Có thể nghe thấy;聞き取り (ききとり): Nghe hiểu;前代未聞 (ぜんだいみもん): Chưa từng nghe thấy",
          "JLPT": "N5"
        },
        {
          "STT": 87,
          "Kanji": "読",
          "name": "Độc",
          "Kun": "よ",
          "On": "どく;とく;とう",
          "bo_thu": "Ngôn (言)",
          "Example": "読む (よむ): Đọc;読書 (どくしょ): Đọc sách;読解 (どっかい): Đọc hiểu;読者 (どくしゃ): Độc giả;句読点 (くとうてん): Dấu câu",
          "JLPT": "N5"
        },
        {
          "STT": 88,
          "Kanji": "書",
          "name": "Thư",
          "Kun": "か",
          "On": "しょ",
          "bo_thu": "Duật (聿)",
          "Example": "書く (かく): Viết;図書館 (としょかん): Thư viện;教科書 (きょうかしょ): Sách giáo khoa;辞書 (じしょ): Từ điển;書道 (しょどう): Thư pháp",
          "JLPT": "N5"
        },
        {
          "STT": 89,
          "Kanji": "話",
          "name": "Thoại",
          "Kun": "はな;はなし",
          "On": "わ",
          "bo_thu": "Ngôn (言)",
          "Example": "話す (はなす): Nói;話 (はなし): Câu chuyện;電話 (でんわ): Điện thoại;会話 (かいわ): Hội thoại;世話 (せわ): Chăm sóc",
          "JLPT": "N5"
        },
        {
          "STT": 90,
          "Kanji": "買",
          "name": "Mãi",
          "Kun": "か",
          "On": "ばい",
          "bo_thu": "Bối (貝)",
          "Example": "買う (かう): Mua;買い物 (かいもの): Mua sắm;売買 (ばいばい): Mua bán;買収 (ばいしゅう): Thu mua/hối lộ;買い手 (かいて): Người mua",
          "JLPT": "N5"
        },
        {
          "STT": 91,
          "Kanji": "教",
          "name": "Giáo",
          "Kun": "おし;おそ",
          "On": "きょう",
          "bo_thu": "Phu (攵)",
          "Example": "教える (おしえる): Dạy;教室 (きょうしつ): Lớp học;教会 (きょうかい): Nhà thờ;教育 (きょういく): Giáo dục;教授 (きょうじゅ): Giáo sư",
          "JLPT": "N5"
        },
        {
          "STT": 92,
          "Kanji": "朝",
          "name": "Triều",
          "Kun": "あさ",
          "On": "ちょう",
          "bo_thu": "Nguyệt (月)",
          "Example": "朝 (あさ): Buổi sáng;今朝 (けさ): Sáng nay;毎朝 (まいあさ): Mỗi sáng;朝食 (ちょうしょく): Bữa sáng;朝刊 (ちょうかん): Báo sáng",
          "JLPT": "N5"
        },
        {
          "STT": 93,
          "Kanji": "昼",
          "name": "Trú",
          "Kun": "ひる",
          "On": "ちゅう",
          "bo_thu": "Nhật (日)",
          "Example": "昼 (ひる): Buổi trưa;昼休み (ひるやすみ): Nghỉ trưa;昼食 (ちゅうしょく): Bữa trưa;昼寝 (ひるね): Ngủ trưa;昼間 (ひるま): Ban ngày",
          "JLPT": "N5"
        },
        {
          "STT": 94,
          "Kanji": "夜",
          "name": "Dạ",
          "Kun": "よる;よ",
          "On": "や",
          "bo_thu": "Tịch (夕)",
          "Example": "夜 (よる): Ban đêm;今夜 (こんや): Tối nay;夜中 (よなか): Nửa đêm;夜食 (やしょく): Ăn đêm;夜明け (よあけ): Bình minh",
          "JLPT": "N5"
        },
        {
          "STT": 95,
          "Kanji": "道",
          "name": "Đạo",
          "Kun": "みち",
          "On": "どう",
          "bo_thu": "Sước (⻌)",
          "Example": "道 (みち): Con đường;茶道 (さどう): Trà đạo;書道 (しょどう): Thư pháp;水道 (すいどう): Nước máy;道路 (どうろ): Đường lộ",
          "JLPT": "N5"
        },
        {
          "STT": 96,
          "Kanji": "山",
          "name": "Sơn",
          "Kun": "やま",
          "On": "さん",
          "bo_thu": "Sơn (山)",
          "Example": "山 (やま): Núi;火山 (かざん): Núi lửa;富士山 (ふじさん): Núi Phú Sĩ;山道 (やまみち): Đường núi;登山 (とざん): Leo núi",
          "JLPT": "N5"
        },
        {
          "STT": 97,
          "Kanji": "川",
          "name": "Xuyên",
          "Kun": "かわ",
          "On": "せん",
          "bo_thu": "Xuyên (巛)",
          "Example": "川 (かわ): Sông;小川 (おがわ): Suối nhỏ;河川 (かせん): Sông ngòi;川下 (かわしも): Hạ lưu;中川 (なかがわ): Tên người Nakagawa",
          "JLPT": "N5"
        },
        {
          "STT": 98,
          "Kanji": "田",
          "name": "Điền",
          "Kun": "た",
          "On": "でん",
          "bo_thu": "Điền (田)",
          "Example": "田んぼ (たんぼ): Ruộng;田中 (たなか): Tên người Tanaka;成田 (なりた): Sân bay Narita;水田 (すいでん): Ruộng lúa;油田 (ゆでん): Mỏ dầu",
          "JLPT": "N5"
        },
        {
          "STT": 99,
          "Kanji": "魚",
          "name": "Ngư",
          "Kun": "さかな;うお",
          "On": "ぎょ",
          "bo_thu": "Ngư (魚)",
          "Example": "魚 (さかな): Cá;金魚 (きんぎょ): Cá vàng;人魚 (にんぎょ): Tiên cá;釣魚 (ちょうぎょ): Câu cá;鮮魚 (せんぎょ): Cá tươi",
          "JLPT": "N5"
        },
        {
          "STT": 100,
          "Kanji": "立",
          "name": "Lập",
          "Kun": "た",
          "On": "りつ;りゅう",
          "bo_thu": "Lập (立)",
          "Example": "立つ (たつ): Đứng;国立 (こくりつ): Quốc lập;建立 (こんりゅう): Xây dựng chùa chiền;立場 (たちば): Lập trường;独立 (どくりつ): Độc lập",
          "JLPT": "N5"
        },
        {
          "STT": 101,
          "Kanji": "入",
          "name": "Nhập",
          "Kun": "はい;い",
          "On": "にゅう",
          "bo_thu": "Nhập (入)",
          "Example": "入る (はいる): Vào;入り口 (いりぐち): Lối vào;入れる (いれる): Cho vào;入学 (にゅうがく): Nhập học;入院 (にゅういん): Nhập viện",
          "JLPT": "N5"
        },
        {
          "STT": 102,
          "Kanji": "出",
          "name": "Xuất",
          "Kun": "で;だ",
          "On": "しゅつ;すい",
          "bo_thu": "Khảm (凵)",
          "Example": "出る (でる): Ra;出口 (でぐち): Lối ra;出す (だす): Lấy ra;外出 (がいしゅつ): Ra ngoài;出席 (しゅっせき): Chuyên cần/Có mặt",
          "JLPT": "N5"
        },
        {
          "STT": 103,
          "Kanji": "名",
          "name": "Danh",
          "Kun": "な",
          "On": "めい;みょう",
          "bo_thu": "Khẩu (口)",
          "Example": "名前 (なまえ): Tên;有名 (ゆうめい): Nổi tiếng;名字 (みょうじ): Họ;名刺 (めいし): Danh thiếp;名物 (めいぶつ): Đặc sản",
          "JLPT": "N5"
        },
        {
          "STT": 104,
          "Kanji": "会",
          "name": "Hội",
          "Kun": "あ;あう",
          "On": "かい;え",
          "bo_thu": "Nhân (人)",
          "Example": "会う (あう): Gặp gỡ;会社 (かいしゃ): Công ty;会議 (かいぎ): Cuộc họp;教会 (きょうかい): Nhà thờ;新年会 (しんねんかい): Tiệc tân niên",
          "JLPT": "N4"
        },
        {
          "STT": 105,
          "Kanji": "社",
          "name": "Xã",
          "Kun": "やしろ",
          "On": "しゃ",
          "bo_thu": "Thị (礻)",
          "Example": "会社 (かいしゃ): Công ty;神社 (じんじゃ): Đền thờ;社会 (しゃかい): Xã hội;社長 (しゃちょう): Giám đốc;入社 (にゅうしゃ): Vào công ty",
          "JLPT": "N4"
        },
        {
          "STT": 106,
          "Kanji": "店",
          "name": "Điếm",
          "Kun": "みせ",
          "On": "てん",
          "bo_thu": "Nghiễm (广)",
          "Example": "店 (みせ): Cửa hàng;売店 (ばいてん): Quầy bán hàng;喫茶店 (きっさてん): Quán cà phê;店員 (てんいん): Nhân viên bán hàng;開店 (かいてん): Mở cửa hàng",
          "JLPT": "N4"
        },
        {
          "STT": 107,
          "Kanji": "駅",
          "name": "Dịch",
          "Kun": "",
          "On": "えき",
          "bo_thu": "Mã (馬)",
          "Example": "駅 (えき): Nhà ga;駅前 (えきまえ): Trước nhà ga;東京駅 (とうきょうえき): Ga Tokyo;駅員 (えきいん): Nhân viên nhà ga;降車駅 (こうしゃえき): Ga xuống xe",
          "JLPT": "N4"
        },
        {
          "STT": 108,
          "Kanji": "花",
          "name": "Hoa",
          "Kun": "はな",
          "On": "か",
          "bo_thu": "Thảo (艹)",
          "Example": "花 (はな): Hoa;花火 (はなび): Pháo hoa;花瓶 (かびん): Bình hoa;花見 (はなみ): Ngắm hoa;生け花 (いけばな): Nghệ thuật cắm hoa",
          "JLPT": "N4"
        },
        {
          "STT": 109,
          "Kanji": "国",
          "name": "Quốc",
          "Kun": "くに",
          "On": "こく",
          "bo_thu": "Vi (囗)",
          "Example": "国 (くに): Đất nước;外国 (がいこく): Nước ngoài;中国 (ちゅうごく): Trung Quốc;韓国 (かんこく): Hàn Quốc;国籍 (こくせき): Quốc tịch",
          "JLPT": "N4"
        },
        {
          "STT": 110,
          "Kanji": "白",
          "name": "Bạch",
          "Kun": "しろ;しら",
          "On": "はく;びゃく",
          "bo_thu": "Bạch (白)",
          "Example": "白い (しろい): Trắng;白人 (はくじん): Người da trắng;面白い (おもしろい): Thú vị;告白 (こくはく): Tỏ tình;白髪 (しらが): Tóc bạc",
          "JLPT": "N4"
        },
        {
          "STT": 111,
          "Kanji": "空",
          "name": "Không",
          "Kun": "そら;あ;から",
          "On": "くう",
          "bo_thu": "Huyệt (穴)",
          "Example": "空気 (くうき): Không khí;空港 (くうこう): Sân bay;空 (そら): Bầu trời;空く (あく): Trống;空間 (くうかん): Không gian",
          "JLPT": "N4"
        },
        {
          "STT": 112,
          "Kanji": "電",
          "name": "Điện",
          "Kun": "",
          "On": "でん",
          "bo_thu": "Vũ (雨)",
          "Example": "電車 (でんしゃ): Tàu điện;電話 (でんわ): Điện thoại;電気 (でんき): Điện/Đèn;電池 (でんち): Pin;電力 (でんりょく): Điện lực",
          "JLPT": "N4"
        },
        {
          "STT": 113,
          "Kanji": "車",
          "name": "Xa",
          "Kun": "くるま",
          "On": "しゃ",
          "bo_thu": "Xa (車)",
          "Example": "車 (くるま): Xe hơi;自転車 (じてんしゃ): Xe đạp;自動車 (じどうしゃ): Xe ô tô;電車 (でんしゃ): Tàu điện;救急車 (きゅうきゅうしゃ): Xe cấp cứu",
          "JLPT": "N4"
        },
        {
          "STT": 114,
          "Kanji": "何",
          "name": "Hà",
          "Kun": "なに;なん",
          "On": "か",
          "bo_thu": "Nhân (人)",
          "Example": "何 (なに): Cái gì;何時 (なんじ): Mấy giờ;何か (なにか): Cái gì đó;何人 (なんにん): Mấy người;何度も (なんども): Nhiều lần",
          "JLPT": "N4"
        },
        {
          "STT": 115,
          "Kanji": "右",
          "name": "Hữu",
          "Kun": "みぎ",
          "On": "う;ゆう",
          "bo_thu": "Khẩu (口)",
          "Example": "右 (みぎ): Bên phải;右手 (みぎて): Tay phải;右折 (うせつ): Rẽ phải;左右 (さゆう): Trái phải;右側 (みぎがわ): Phía bên phải",
          "JLPT": "N4"
        },
        {
          "STT": 116,
          "Kanji": "左",
          "name": "Tả",
          "Kun": "ひだり",
          "On": "さ",
          "bo_thu": "Công (工)",
          "Example": "左 (ひだり): Bên trái;左手 (ひだりて): Tay trái;左折 (させつ): Rẽ trái;左右 (さゆう): Trái phải;左側 (ひだりがわ): Phía bên trái",
          "JLPT": "N4"
        },
        {
          "STT": 117,
          "Kanji": "前",
          "name": "Tiền",
          "Kun": "まえ",
          "On": "ぜん",
          "bo_thu": "Đao (刂)",
          "Example": "前 (まえ): Trước;名前 (なまえ): Tên;午前 (ごぜん): Buổi sáng;前回 (ぜんかい): Lần trước;直前 (ちょくぜん): Ngay trước khi",
          "JLPT": "N4"
        },
        {
          "STT": 118,
          "Kanji": "後",
          "name": "Hậu",
          "Kun": "うし;あと;のち",
          "On": "ご;こう",
          "bo_thu": "Xích (彳)",
          "Example": "後ろ (うしろ): Phía sau;後で (あとで): Lát nữa;午後 (ごご): Buổi chiều;最後 (さいご): Cuối cùng;後半 (こうはん): Hiệp hai/Nửa sau",
          "JLPT": "N4"
        },
        {
          "STT": 119,
          "Kanji": "外",
          "name": "Ngoại",
          "Kun": "そと;はず",
          "On": "がい;げ",
          "bo_thu": "Tịch (夕)",
          "Example": "外 (そと): Bên ngoài;外国 (がいこく): Nước ngoài;外国人 (がいこくじん): Người nước ngoài;外出 (がいしゅつ): Ra ngoài;外科 (げか): Khoa ngoại",
          "JLPT": "N4"
        },
        {
          "STT": 120,
          "Kanji": "間",
          "name": "Gian",
          "Kun": "あいだ;ま",
          "On": "かん;けん",
          "bo_thu": "Môn (門)",
          "Example": "間 (あいだ): Giữa;時間 (じかん): Thời gian;間に合う (まニアう): Kịp lúc;客間 (きゃくま): Phòng khách;間違い (まちがい): Lỗi sai",
          "JLPT": "N4"
        },
        {
          "STT": 121,
          "Kanji": "時",
          "name": "Thời",
          "Kun": "とき",
          "On": "じ",
          "bo_thu": "Nhật (日)",
          "Example": "時 (とき): Khi;時間 (じかん): Thời gian;時計 (とけい): Đồng hồ;同時 (どうじ): Đồng thời;時代 (じだい): Thời đại",
          "JLPT": "N4"
        },
        {
          "STT": 122,
          "Kanji": "分",
          "name": "Phân;Phận",
          "Kun": "わ;わか",
          "On": "ぶん;ぷん;ぶ",
          "bo_thu": "Dao (刀)",
          "Example": "分かる (わかる): Hiểu;半分 (はんぶん): Một nửa;自分 (じぶん): Bản thân;五分 (ごふん): 5 phút;気分 (きぶん): Tâm trạng",
          "JLPT": "N4"
        },
        {
          "STT": 123,
          "Kanji": "半",
          "name": "Bán",
          "Kun": "",
          "On": "はん",
          "bo_thu": "Thập (十)",
          "Example": "半分 (はんぶん): Một nửa;三時半 (さんじはん): 3 giờ rưỡi;半年 (はんねん): Nửa năm;半島 (はんとう): Bán đảo;半額 (はんがく): Nửa giá",
          "JLPT": "N4"
        },
        {
          "STT": 124,
          "Kanji": "多",
          "name": "Đa",
          "Kun": "おお",
          "On": "た",
          "bo_thu": "Tịch (夕)",
          "Example": "多い (おおい): Nhiều;多分 (たぶん): Có lẽ;多数 (たすう): Đa số;多少 (たしょう): Ít nhiều;多忙 (たぼう): Rất bận",
          "JLPT": "N4"
        },
        {
          "STT": 125,
          "Kanji": "少",
          "name": "Thiểu;Thiếu",
          "Kun": "すく;すこ",
          "On": "しょう",
          "bo_thu": "Tiểu (小)",
          "Example": "少ない (すくない): Ít;少し (すこし): Một chút;少年 (しょうねん): Thiếu niên;少女 (しょうじょ): Thiếu nữ;少々 (しょうしょう): Một chút (lịch sự)",
          "JLPT": "N4"
        },
        {
          "STT": 126,
          "Kanji": "長",
          "name": "Trường;Trưởng",
          "Kun": "なが",
          "On": "ちょう",
          "bo_thu": "Trường (長)",
          "Example": "長い (ながい): Dài;社長 (しゃちょう): Giám đốc;校長 (こうちょう): Hiệu trưởng;部長 (ぶちょう): Trưởng phòng;身長 (しんちょう): Chiều cao",
          "JLPT": "N4"
        },
        {
          "STT": 127,
          "Kanji": "高",
          "name": "Cao",
          "Kun": "たか",
          "On": "こう",
          "bo_thu": "Cao (高)",
          "Example": "高い (たかい): Cao/đắt;高校 (こうこう): Trường cấp 3;最高 (さいこう): Tuyệt nhất;高級 (こうきゅう): Cao cấp;高橋 (たかはし): Tên người Takahashi",
          "JLPT": "N4"
        },
        {
          "STT": 128,
          "Kanji": "安",
          "name": "An",
          "Kun": "やす",
          "On": "あん",
          "bo_thu": "Miên (宀)",
          "Example": "安い (やすい): Rẻ;安全 (あんぜん): An toàn;安心 (あんしん): Yên tâm;不安 (ふあん): Bất an;安売り (やすうり): Bán rẻ",
          "JLPT": "N4"
        },
        {
          "STT": 129,
          "Kanji": "新",
          "name": "Tân",
          "Kun": "あたら",
          "On": "しん",
          "bo_thu": "Cân (斤)",
          "Example": "新しい (あたらしい): Mới;新聞 (しんぶん): Báo;新年 (しんねん): Năm mới;新幹線 (しんかんせん): Tàu Shinkansen;斬新 (ざんしん): Mới mẻ",
          "JLPT": "N4"
        },
        {
          "STT": 130,
          "Kanji": "古",
          "name": "Cổ",
          "Kun": "ふる",
          "On": "こ",
          "bo_thu": "Thập (十)",
          "Example": "古い (ふるい): Cũ;中古 (ちゅうこ): Đồ cũ;古本 (ふるほん): Sách cũ;古代 (こだい): Cổ đại;古河 (ふるかわ): Tên người Furukawa",
          "JLPT": "N4"
        },
        {
          "STT": 131,
          "Kanji": "入",
          "name": "Nhập",
          "Kun": "はい;い",
          "On": "にゅう",
          "bo_thu": "Nhập (入)",
          "Example": "入る (はいる): Vào;入り口 (いりぐち): Lối vào;入れる (いれる): Cho vào;入学 (にゅうがく): Nhập học;入院 (にゅういん): Nhập viện",
          "JLPT": "N4"
        },
        {
          "STT": 132,
          "Kanji": "出",
          "name": "Xuất",
          "Kun": "で;だ",
          "On": "しゅつ",
          "bo_thu": "Khảm (凵)",
          "Example": "出る (でる): Ra;出口 (でぐち): Lối ra;出す (だす): Lấy ra;外出 (がいしゅつ): Ra ngoài;出席 (しゅっせき): Tham gia",
          "JLPT": "N4"
        },
        {
          "STT": 133,
          "Kanji": "行",
          "name": "Hành;Hàng",
          "Kun": "い;ゆ;おこな",
          "On": "こう;ぎょう",
          "bo_thu": "Hành (行)",
          "Example": "行く (いく): Đi;銀行 (ぎんこう): Ngân hàng;旅行 (りょこう): Du lịch;行動 (こうどう): Hành động;一行目 (いちぎょうめ): Dòng đầu tiên",
          "JLPT": "N4"
        },
        {
          "STT": 134,
          "Kanji": "来",
          "name": "Lai",
          "Kun": "く;きた",
          "On": "らい",
          "bo_thu": "Nhân (人)",
          "Example": "来る (くる): Đến;来年 (らいねん): Sang năm;来週 (らいしゅう): Tuần sau;未来 (みらい): Tương lai;来日 (らいにち): Đến Nhật",
          "JLPT": "N4"
        },
        {
          "STT": 135,
          "Kanji": "食",
          "name": "Thực",
          "Kun": "た;く",
          "On": "しょく",
          "bo_thu": "Thực (食)",
          "Example": "食べる (たべる): Ăn;食事 (しょくじ): Bữa ăn;食べ物 (たべもの): Đồ ăn;食堂 (しょくどう): Nhà ăn;朝食 (ちょうしょく): Bữa sáng",
          "JLPT": "N4"
        },
        {
          "STT": 136,
          "Kanji": "飲",
          "name": "Ẩm",
          "Kun": "の",
          "On": "いん",
          "bo_thu": "Thực (食)",
          "Example": "飲む (のむ): Uống;飲み物 (のみもの): Đồ uống;飲食店 (いんしょくてん): Nhà hàng;飲料 (いんりょう): Đồ uống;飲み会 (のみかい): Tiệc rượu",
          "JLPT": "N4"
        },
        {
          "STT": 137,
          "Kanji": "見",
          "name": "Kiến",
          "Kun": "み",
          "On": "けん",
          "bo_thu": "Kiến (見)",
          "Example": "見る (みる): Nhìn;見学 (けんがく): Kiến tập;意見 (いけん): Ý kiến;見本 (みほん): Hàng mẫu;花見 (はなみ): Ngắm hoa",
          "JLPT": "N4"
        },
        {
          "STT": 138,
          "Kanji": "聞",
          "name": "Văn",
          "Kun": "き",
          "On": "ぶん;もん",
          "bo_thu": "Môn (門)",
          "Example": "聞く (きく): Nghe;新聞 (しんぶん): Báo;聞こえる (きこえる): Nghe thấy;聞き取り (ききとり): Nghe hiểu;前代未聞 (ぜんだいみもん): Chưa từng nghe thấy",
          "JLPT": "N4"
        },
        {
          "STT": 139,
          "Kanji": "読",
          "name": "Độc",
          "Kun": "よ",
          "On": "どく",
          "bo_thu": "Ngôn (言)",
          "Example": "読む (よむ): Đọc;読書 (どくしょ): Đọc sách;読解 (どっかい): Đọc hiểu;読者 (どくしゃ): Độc giả;句読点 (くとうてん): Dấu câu",
          "JLPT": "N4"
        },
        {
          "STT": 140,
          "Kanji": "書",
          "name": "Thư",
          "Kun": "か",
          "On": "しょ",
          "bo_thu": "Duật (聿)",
          "Example": "書く (かく): Viết;図書館 (としょかん): Thư viện;辞書 (じしょ): Từ điển;教科書 (きょうかしょ): Sách giáo khoa;書道 (しょどう): Thư pháp",
          "JLPT": "N4"
        },
        {
          "STT": 141,
          "Kanji": "話",
          "name": "Thoại",
          "Kun": "はな;はなし",
          "On": "わ",
          "bo_thu": "Ngôn (言)",
          "Example": "話す (はなす): Nói;電話 (でんわ): Điện thoại;会話 (かいわ): Hội thoại;世話 (せわ): Chăm sóc;昔話 (むかしばなし): Chuyện cổ tích",
          "JLPT": "N4"
        },
        {
          "STT": 142,
          "Kanji": "買",
          "name": "Mãi",
          "Kun": "か",
          "On": "ばい",
          "bo_thu": "Bối (貝)",
          "Example": "買う (かう): Mua;買い物 (かいもの): Mua sắm;売買 (ばいばい): Mua bán;買収 (ばいしゅう): Mua chuộc;買い手 (かいて): Người mua",
          "JLPT": "N4"
        },
        {
          "STT": 143,
          "Kanji": "教",
          "name": "Giáo",
          "Kun": "おし;おそ",
          "On": "きょう",
          "bo_thu": "Phu (攵)",
          "Example": "教える (おしえる): Dạy;教室 (きょうしつ): Lớp học;教会 (きょうかい): Nhà thờ;教育 (きょういく): Giáo dục;教授 (きょうじゅ): Giáo sư",
          "JLPT": "N4"
        },
        {
          "STT": 144,
          "Kanji": "学",
          "name": "Học",
          "Kun": "まな",
          "On": "がく",
          "bo_thu": "Tử (子)",
          "Example": "学生 (がくせい): Sinh viên;大学 (だいがく): Đại học;学校 (がっこう): Trường học;学習 (がくしゅう): Học tập;奨学金 (しょうがくきん): Học bổng",
          "JLPT": "N4"
        },
        {
          "STT": 145,
          "Kanji": "校",
          "name": "Hiệu",
          "Kun": "",
          "On": "こう",
          "bo_thu": "Mộc (木)",
          "Example": "学校 (がっこう): Trường học;高校 (こうこう): Trường cấp 3;校長 (ちょうちょう): Hiệu trưởng;校舎 (こうしゃ): Tòa nhà trường;校則 (こうそく): Nội quy trường",
          "JLPT": "N4"
        },
        {
          "STT": 146,
          "Kanji": "体",
          "name": "Thể",
          "Kun": "からだ",
          "On": "たい",
          "bo_thu": "Nhân (人)",
          "Example": "体 (からだ): Cơ thể;体力 (たいりょく): Thể lực;体育 (たいいく): Thể dục;体重 (たいじゅう): Cân nặng;全体 (ぜんたい): Toàn thể",
          "JLPT": "N4"
        },
        {
          "STT": 147,
          "Kanji": "目",
          "name": "Mục",
          "Kun": "め",
          "On": "もく",
          "bo_thu": "Mục (目)",
          "Example": "目 (め): Mắt;目的 (もくてき): Mục đích;目次 (もくじ): Mục lục;注目 (ちゅうもく): Chú ý;目立つ (めだつ): Nổi bật",
          "JLPT": "N4"
        },
        {
          "STT": 148,
          "Kanji": "耳",
          "name": "Nhĩ",
          "Kun": "みみ",
          "On": "じ",
          "bo_thu": "Nhĩ (耳)",
          "Example": "耳 (みみ): Tai;耳鼻科 (じびか): Khoa tai mũi họng;耳鳴り (みみなり): Ú tai;初耳 (はつみみ): Lần đầu nghe thấy;耳元 (みみもと): Bên tai",
          "JLPT": "N4"
        },
        {
          "STT": 149,
          "Kanji": "手",
          "name": "Thủ",
          "Kun": "て",
          "On": "しゅ",
          "bo_thu": "Thủ (手)",
          "Example": "手 (て): Tay;上手 (じょうず): Giỏi;下手 (へた): Dở;手紙 (てがみ): Bức thư;運転手 (うんてんしゅ): Tài xế",
          "JLPT": "N4"
        },
        {
          "STT": 150,
          "Kanji": "足",
          "name": "Túc",
          "Kun": "あし;た",
          "On": "そく",
          "bo_thu": "Túc (足)",
          "Example": "足 (あし): Chân;足りる (たりる): Đầy đủ;遠足 (えんそく): Dã ngoại;不足 (ふそく): Thiếu hụt;一足 (いっそく): Một đôi (giày",
          "JLPT": "tất)"
        },
        {
          "STT": 151,
          "Kanji": "力",
          "name": "Lực",
          "Kun": "ちから",
          "On": "りょく;りき",
          "bo_thu": "Lực (力)",
          "Example": "力 (ちから): Sức lực;体力 (たいりょく): Thể lực;努力 (どりょく): Nỗ lực;能力 (のうりょく): Năng lực;火力 (かりょく): Hỏa lực",
          "JLPT": "N4"
        },
        {
          "STT": 152,
          "Kanji": "自",
          "name": "Tự",
          "Kun": "みずか",
          "On": "じ;し",
          "bo_thu": "Tự (自)",
          "Example": "自分 (じぶん): Bản thân;自由 (じゆう): Tự do;自動車 (じどうしゃ): Xe ô tô;自転車 (じてんしゃ): Xe đạp;自然 (しぜん): Tự nhiên",
          "JLPT": "N4"
        },
        {
          "STT": 153,
          "Kanji": "事",
          "name": "Sự",
          "Kun": "こと",
          "On": "じ",
          "bo_thu": "Quyết (亅)",
          "Example": "仕事 (しごと): Công việc;事 (こと): Sự việc;食事 (しょくじ): Bữa ăn;火事 (かじ): Hỏa hoạn;大事 (だいじ): Quan trọng",
          "JLPT": "N4"
        },
        {
          "STT": 154,
          "Kanji": "代",
          "name": "Đại",
          "Kun": "か;しろ",
          "On": "だい;たい",
          "bo_thu": "Nhân (人)",
          "Example": "代わる (かわる): Thay thế;時代 (じだい): Thời đại;電気代 (でんきだい): Tiền điện;代わりに (かわりに): Thay vì;交代 (こうたい): Thay ca",
          "JLPT": "N4"
        },
        {
          "STT": 155,
          "Kanji": "使",
          "name": "Sứ;Sử",
          "Kun": "つか",
          "On": "し",
          "bo_thu": "Nhân (人)",
          "Example": "使う (つかう): Sử dụng;大使館 (たいしかん): Đại sứ quán;使用 (しよう): Sử dụng;使い道 (つかいみち): Cách dùng;使者 (ししゃ): Sứ giả",
          "JLPT": "N4"
        },
        {
          "STT": 156,
          "Kanji": "作",
          "name": "Tác",
          "Kun": "つく",
          "On": "さく;さ",
          "bo_thu": "Nhân (人)",
          "Example": "作る (つくる): Chế biến/Tạo ra;作文 (さくぶん): Bài tập làm văn;作品 (さくひん): Tác phẩm;手作り (てづくり): Làm bằng tay;動作 (どうさ): Động tác",
          "JLPT": "N4"
        },
        {
          "STT": 157,
          "Kanji": "住",
          "name": "Trú;Trú",
          "Kun": "す",
          "On": "じゅう",
          "bo_thu": "Nhân (人)",
          "Example": "住む (すむ): Sinh sống;住所 (じゅうしょ): Địa chỉ;住民 (じゅうみん): Dân cư;住居 (じゅうきょ): Chỗ ở;移住 (いじゅう): Di cư",
          "JLPT": "N4"
        },
        {
          "STT": 158,
          "Kanji": "低",
          "name": "Đê",
          "Kun": "ひく",
          "On": "てい",
          "bo_thu": "Nhân (人)",
          "Example": "低い (ひくい): Thấp;最低 (さいてい): Thấp nhất/Tồi tệ;低気圧 (ていきあつ): Áp suất thấp;低下 (ていか): Sự giảm sút;低音 (ていおん): Âm thấp",
          "JLPT": "N4"
        },
        {
          "STT": 159,
          "Kanji": "借",
          "name": "Tá",
          "Kun": "か",
          "On": "しゃく",
          "bo_thu": "Nhân (人)",
          "Example": "借りる (かりる): Mượn;借金 (しゃっきん): Khoản nợ;借家 (しゃくや): Nhà thuê;借用 (しゃくよう): Vay mượn;借り物 (かりもの): Đồ mượn",
          "JLPT": "N4"
        },
        {
          "STT": 160,
          "Kanji": "働",
          "name": "Động",
          "Kun": "はたら",
          "On": "どう",
          "bo_thu": "Nhân (人)",
          "Example": "働く (はたらく): Làm việc;労働 (ろうどう): Lao động;共働き (ともばたき): Cả hai vợ chồng cùng đi làm;労働者 (ろうどうしゃ): Người lao động;稼働 (かどう): Hoạt động",
          "JLPT": "N4"
        },
        {
          "STT": 161,
          "Kanji": "元",
          "name": "Nguyên",
          "Kun": "もと",
          "On": "げん;がん",
          "bo_thu": "Nhi (儿)",
          "Example": "元気 (げんき): Khỏe mạnh;元日 (がんじつ): Ngày mồng 1 tết;地元 (じもと): Địa phương;足元 (あしもと): Dưới chân;紀元前 (きげんぜん): Trước công nguyên",
          "JLPT": "N4"
        },
        {
          "STT": 162,
          "Kanji": "光",
          "name": "Quang",
          "Kun": "ひか;ひかり",
          "On": "こう",
          "bo_thu": "Nhi (儿)",
          "Example": "光 (ひかり): Ánh sáng;光る (ひかる): Tỏa sáng;日光 (にっこう): Ánh sáng mặt trời;観光 (かんこう): Tham quan;光線 (こうせん): Tia sáng",
          "JLPT": "N4"
        },
        {
          "STT": 163,
          "Kanji": "写",
          "name": "Tả",
          "Kun": "うつ",
          "On": "しゃ",
          "bo_thu": "Mịch (冖)",
          "Example": "写す (うつす): Sao chép/Chụp;写真 (しゃしん): Ảnh;写生 (しゃせい): Phác thảo;写経 (しゃきょう): Chép kinh;描写 (びょうしゃ): Miêu tả",
          "JLPT": "N4"
        },
        {
          "STT": 164,
          "Kanji": "冬",
          "name": "Đông",
          "Kun": "ふゆ",
          "On": "とう",
          "bo_thu": "Băng (冫)",
          "Example": "冬 (ふゆ): Mùa đông;冬休み (ふゆやすみ): Nghỉ đông;立冬 (りっとう): Lập đông;冬眠 (とうみん): Ngủ đông;真冬 (まふゆ): Giữa mùa đông",
          "JLPT": "N4"
        },
        {
          "STT": 165,
          "Kanji": "切",
          "name": "Thiết",
          "Kun": "き",
          "On": "せつ;さい",
          "bo_thu": "Đao (刀)",
          "Example": "切る (きる): Cắt;大切 (たいせつ): Quan trọng;切手 (きって): Tem;親切 (しんせつ): Thân thiện;売り切れ (うりきれ): Bán hết",
          "JLPT": "N4"
        },
        {
          "STT": 166,
          "Kanji": "別",
          "name": "Biệt",
          "Kun": "わか",
          "On": "べつ",
          "bo_thu": "Đao (刂)",
          "Example": "別れる (わかれる): Chia tay;別 (べつ): Khác biệt;特別 (とくべつ): Đặc biệt;差別 (さべつ): Phân biệt đối xử;別に (べつに): Không có gì đặc biệt",
          "JLPT": "N4"
        },
        {
          "STT": 167,
          "Kanji": "勉",
          "name": "Miễn",
          "Kun": "",
          "On": "べん",
          "bo_thu": "Lực (力)",
          "Example": "勉強 (べんきょう): Học tập;勤勉 (きんべん): Cần cù;勉学 (べんがく): Việc học;ガリ勉 (がりべん): Mọt sách",
          "JLPT": "N4"
        },
        {
          "STT": 168,
          "Kanji": "動",
          "name": "Động",
          "Kun": "うご",
          "On": "どう",
          "bo_thu": "Lực (力)",
          "Example": "動く (うごく): Di chuyển;自動車 (じどうしゃ): Xe ô tô;動物 (どうぶつ): Động vật;運動 (うんどう): Vận động;感動 (かんどう): Cảm động",
          "JLPT": "N4"
        },
        {
          "STT": 169,
          "Kanji": "区",
          "name": "Khu",
          "Kun": "",
          "On": "く",
          "bo_thu": "Hệ (匸)",
          "Example": "区 (く): Quận;区役所 (くやくしょ): Ủy ban quận;区分 (くぶん): Phân chia;区別 (くべつ): Phân biệt;区間 (くかん): Đoạn đường",
          "JLPT": "N4"
        },
        {
          "STT": 170,
          "Kanji": "医",
          "name": "Y",
          "Kun": "",
          "On": "い",
          "bo_thu": "Hệ (匸)",
          "Example": "医者 (いしゃ): Bác sĩ;医学 (いがく): Y học;医院 (いいん): Phòng khám;医療 (いりょう): Y tế;歯医者 (はいしゃ): Nha sĩ",
          "JLPT": "N4"
        },
        {
          "STT": 171,
          "Kanji": "去",
          "name": "Khứ",
          "Kun": "さ",
          "On": "きょ;こ",
          "bo_thu": "Khứ (去)",
          "Example": "去る (さる): Rời khỏi;去年 (きょねん): Năm ngoái;過去 (かこ): Quá khứ;消去 (しょうきょ): Xóa bỏ;死去 (しきょ): Qua đời",
          "JLPT": "N4"
        },
        {
          "STT": 172,
          "Kanji": "台",
          "name": "Đài",
          "Kun": "",
          "On": "だい;たい",
          "bo_thu": "Khẩu (口)",
          "Example": "台 (だい): Cái giá/Bệ;台所 (だいどころ): Nhà bếp;台風 (たいふ): Bão;二台 (にだい): 2 cái (xe",
          "JLPT": "máy móc);舞台 (ぶたい): Sân khấu"
        },
        {
          "STT": 173,
          "Kanji": "合",
          "name": "Hợp",
          "Kun": "あ",
          "On": "ごう;がっ;かっ",
          "bo_thu": "Khẩu (口)",
          "Example": "合う (あう): Phù hợp;間に合う (まにあう): Kịp lúc;具合 (ぐあい): Tình trạng;合格 (ごうかく): Thi đỗ;試合 (しあい): Trận đấu",
          "JLPT": "N4"
        },
        {
          "STT": 174,
          "Kanji": "味",
          "name": "Vị",
          "Kun": "あじ",
          "On": "み",
          "bo_thu": "Khẩu (口)",
          "Example": "味 (あじ): Vị;意味 (いみ): Ý nghĩa;趣味 (しゅみ): Sở thích;調味料 (ちょうみりょう): Gia vị;味噌 (みそ): Tương miso",
          "JLPT": "N4"
        },
        {
          "STT": 175,
          "Kanji": "品",
          "name": "Phẩm",
          "Kun": "しな",
          "On": "ひん",
          "bo_thu": "Khẩu (口)",
          "Example": "品物 (しなもの): Hàng hóa;作品 (さくひん): Tác phẩm;食料品 (しょくりょうひん): Thực phẩm;上品 (じょうひん): Sang trọng;手品 (てじな): Ảo thuật",
          "JLPT": "N4"
        },
        {
          "STT": 176,
          "Kanji": "員",
          "name": "Viên",
          "Kun": "",
          "On": "いん",
          "bo_thu": "Bối (貝)",
          "Example": "社員 (しゃいん): Nhân viên công ty;店員 (てんいん): Nhân viên bán hàng;銀行員 (ぎんこういん): Nhân viên ngân hàng;会員 (かいいん): Hội viên;公務員 (こうむいん): Công chức",
          "JLPT": "N4"
        },
        {
          "STT": 177,
          "Kanji": "問",
          "name": "Vấn",
          "Kun": "と",
          "On": "もん",
          "bo_thu": "Môn (門)",
          "Example": "質問 (しつもん): Câu hỏi;問題 (もんだい): Vấn đề/Bài tập;問う (とう): Hỏi;訪問 (ほうもん): Ghé thăm;学問 (がくもん): Học vấn",
          "JLPT": "N4"
        },
        {
          "STT": 178,
          "Kanji": "回",
          "name": "Hồi",
          "Kun": "まわ",
          "On": "かい;え",
          "bo_thu": "Vi (囗)",
          "Example": "回る (まわる): Xoay quanh;今回 (こんかい): Lần này;一回 (いっかい): Một lần;回転 (かいてん): Xoay chuyển;遠回 (とおまわり): Đường vòng",
          "JLPT": "N4"
        },
        {
          "STT": 179,
          "Kanji": "図",
          "name": "Đồ",
          "Kun": "はか",
          "On": "ず;と",
          "bo_thu": "Vi (囗)",
          "Example": "図書館 (としょかん): Thư viện;地図 (ちず): Bản đồ;図る (はかる): Lập kế hoạch;意図 (いと): Ý đồ;合図 (あいず): Ám hiệu",
          "JLPT": "N4"
        },
        {
          "STT": 180,
          "Kanji": "地",
          "name": "Địa",
          "Kun": "",
          "On": "ち;じ",
          "bo_thu": "Thổ (土)",
          "Example": "地下鉄 (ちかてつ): Tàu điện ngầm;地図 (ちず): Bản đồ;地震 (じしん): Động đất;地面 (じめん): Mặt đất;地方 (ちほう): Địa phương",
          "JLPT": "N4"
        },
        {
          "STT": 181,
          "Kanji": "堂",
          "name": "Đường",
          "Kun": "",
          "On": "どう",
          "bo_thu": "Thổ (土)",
          "Example": "食堂 (しょくどう): Nhà ăn;本堂 (ほんどう): Chánh điện;堂々 (どうどう): Hùng vĩ/Đường bệ;公会堂 (こうかいどう): Hội trường công cộng;講堂 (こうどう): Giảng đường",
          "JLPT": "N4"
        },
        {
          "STT": 182,
          "Kanji": "場",
          "name": "Trường",
          "Kun": "ば",
          "On": "じょう",
          "bo_thu": "Thổ (土)",
          "Example": "場所 (ばしょ): Địa điểm;工場 (こうじょう): Nhà máy;駐車場 (ちゅうしゃじょう): Bãi đỗ xe;場合 (ばあい): Trường hợp;会場 (かいじょう): Hội trường",
          "JLPT": "N4"
        },
        {
          "STT": 183,
          "Kanji": "声",
          "name": "Thanh",
          "Kun": "こえ",
          "On": "せい;しょう",
          "bo_thu": "Sĩ (士)",
          "Example": "声 (こえ): Tiếng/Giọng nói;大声 (おおごえ): Tiếng lớn;音声 (おんせい): Âm thanh;声優 (せいゆう): Diễn viên lồng tiếng;声明 (せいめい): Tuyên bố",
          "JLPT": "N4"
        },
        {
          "STT": 184,
          "Kanji": "売",
          "name": "Mại",
          "Kun": "う",
          "On": "ばい",
          "bo_thu": "Sĩ (士)",
          "Example": "売る (うる): Bán;売店 (ばいてん): Quầy bán hàng;売り場 (うりば): Nơi bán hàng;売買 (ばいばい): Mua bán;発売 (はつばい): Phát hành/Bán ra",
          "JLPT": "N4"
        },
        {
          "STT": 185,
          "Kanji": "夏",
          "name": "Hạ",
          "Kun": "なつ",
          "On": "か;げ",
          "bo_thu": "Truy (夂)",
          "Example": "夏 (なつ): Mùa hè;夏休み (なつやすみ): Nghỉ hè;初夏 (しょか): Đầu hè;夏至 (げし): Hạ chí;真夏 (まなつ): Giữa hè",
          "JLPT": "N4"
        },
        {
          "STT": 186,
          "Kanji": "夕",
          "name": "Tịch",
          "Kun": "ゆう",
          "On": "せき",
          "bo_thu": "Tịch (夕)",
          "Example": "夕方 (ゆうがた): Chiều tà;夕食 (ゆうしょく): Bữa tối;夕日 (ゆうひ): Hoàng hôn;夕立 (ゆうだち): Mưa rào ban chiều;七夕 (たなばた): Lễ Thất tịch",
          "JLPT": "N4"
        },
        {
          "STT": 187,
          "Kanji": "太",
          "name": "Thái",
          "Kun": "ふと",
          "On": "たい;た",
          "bo_thu": "Đại (大)",
          "Example": "太い (ふとい): Béo/Dày;太陽 (たいよう): Mặt trời;太る (ふとる): Béo lên;太平洋 (たいへいよう): Thái Bình Dương;太鼓 (たいこ): Trống",
          "JLPT": "N4"
        },
        {
          "STT": 188,
          "Kanji": "妹",
          "name": "Muội",
          "Kun": "いもうと",
          "On": "まい",
          "bo_thu": "Nữ (女)",
          "Example": "妹 (いもうと): Em gái;姉妹 (しまい): Chị em;義妹 (ぎまい): Em dâu/Em vợ;三女 (さんじょ): Con gái thứ ba;妹分 (いもうとぶん): Em kết nghĩa",
          "JLPT": "N4"
        },
        {
          "STT": 189,
          "Kanji": "姉",
          "name": "Tỷ",
          "Kun": "あね",
          "On": "し",
          "bo_thu": "Nữ (女)",
          "Example": "姉 (あね): Chị gái;姉妹 (しまい): Chị em;お姉さん (おねえさん): Chị gái (gọi lịch sự);義姉 (ぎし): Chị dâu/Chị vợ;長姉 (ちょうし): Chị cả",
          "JLPT": "N4"
        },
        {
          "STT": 190,
          "Kanji": "始",
          "name": "Thủy",
          "Kun": "はじ",
          "On": "し",
          "bo_thu": "Nữ (女)",
          "Example": "始める (はじめる): Bắt đầu;開始 (かいし): Khai mẻ/Bắt đầu;年始 (ねんし): Đầu năm;始終 (しじゅう): Từ đầu đến cuối;終始 (しゅうし): Trước sau như một",
          "JLPT": "N4"
        },
        {
          "STT": 191,
          "Kanji": "字",
          "name": "Tự",
          "Kun": "あざ",
          "On": "じ",
          "bo_thu": "Miên (宀)",
          "Example": "漢字 (かんじ): Chữ Hán;文字 (もじ): Chữ cái;名字 (みょうじ): Họ;数字 (すうじ): Chữ số;活字 (かつじ): Chữ in",
          "JLPT": "N4"
        },
        {
          "STT": 192,
          "Kanji": "室",
          "name": "Thất",
          "Kun": "むろ",
          "On": "しつ",
          "bo_thu": "Miên (宀)",
          "Example": "教室 (きょうしつ): Lớp học;室温 (しつおん): Nhiệt độ phòng;和室 (わしつ): Phòng kiểu Nhật;洋室 (ようしつ): Phòng kiểu Tây;地下室 (ちかしつ): Tầng hầm",
          "JLPT": "N4"
        },
        {
          "STT": 193,
          "Kanji": "家",
          "name": "Gia",
          "Kun": "いえ;や",
          "On": "か;け",
          "bo_thu": "Miên (宀)",
          "Example": "家 (いえ): Nhà;家族 (かぞく): Gia đình;家賃 (やちん): Tiền nhà;家事 (かじ): Việc nhà;画家 (がか): Họa sĩ",
          "JLPT": "N4"
        },
        {
          "STT": 194,
          "Kanji": "寒",
          "name": "Hàn",
          "Kun": "さむ",
          "On": "かん",
          "bo_thu": "Miên (宀)",
          "Example": "寒い (さむい): Lạnh (thời tiết);寒冷 (かんれい): Lạnh lẽo;寒波 (かんぱ): Luồng khí lạnh;寒中 (かんちゅう): Giữa mùa lạnh;防寒 (ぼうかん): Phòng lạnh",
          "JLPT": "N4"
        },
        {
          "STT": 195,
          "Kanji": "屋",
          "name": "Ốc",
          "Kun": "や",
          "On": "おく",
          "bo_thu": "Thi (尸)",
          "Example": "本屋 (ほんや): Tiệm sách;屋上 (おくじょう): Sân thượng;部屋 (へや): Căn phòng;名古屋 (なごや): Thành phố Nagoya;八百屋 (やおや): Cửa hàng rau",
          "JLPT": "N4"
        },
        {
          "STT": 196,
          "Kanji": "工",
          "name": "Công",
          "Kun": "",
          "On": "こう;く",
          "bo_thu": "Công (工)",
          "Example": "工場 (こうじょう): Nhà máy;工事 (こうじ): Công trường;工業 (こうぎょう): Công nghiệp;大工 (だいく): Thợ mộc;工学 (こうがく): Kỹ thuật học",
          "JLPT": "N4"
        },
        {
          "STT": 197,
          "Kanji": "市",
          "name": "Thị",
          "Kun": "いち",
          "On": "し",
          "bo_thu": "Cân (巾)",
          "Example": "市 (し): Thành phố;市場 (いちば): Chợ;市民 (しみん): Dân thành phố;市長 (しちょう): Thị trưởng;市役所 (しやくしょ): Ủy ban thành phố",
          "JLPT": "N4"
        },
        {
          "STT": 198,
          "Kanji": "広",
          "name": "Quảng",
          "Kun": "ひろ",
          "On": "こう",
          "bo_thu": "Nghiễm (广)",
          "Example": "広い (ひろい): Rộng;広大 (こうだい): Bao la;広場 (ひろば): Quảng trường;広告 (こうこく): Quảng cáo;広める (ひろめる): Làm rộng ra",
          "JLPT": "N4"
        },
        {
          "STT": 199,
          "Kanji": "度",
          "name": "Độ",
          "Kun": "たび",
          "On": "ど;たく;と",
          "bo_thu": "Nghiễm (广)",
          "Example": "一度 (いちど): Một lần;今度 (こんど): Lần này/Lần sau;温度 (おんど): Nhiệt độ;速度 (そくど): Tốc độ;程度 (ていど): Mức độ",
          "JLPT": "N4"
        },
        {
          "STT": 200,
          "Kanji": "建",
          "name": "Kiến",
          "Kun": "た",
          "On": "けん;こん",
          "bo_thu": "Dẫn (廴)",
          "Example": "建てる (たてる): Xây dựng;建物 (たてもの): Tòa nhà;建設 (けんせつ): Kiến thiết;二階建て (にかいだて): Nhà 2 tầng;再建 (さいけん): Xây dựng lại",
          "JLPT": "N4"
        },
        {
          "STT": 201,
          "Kanji": "引",
          "name": "Dẫn",
          "Kun": "ひ",
          "On": "いん",
          "bo_thu": "Cung (弓)",
          "Example": "引く (ひく): Kéo/Gạch chân;引き出し (ひきだし): Ngăn kéo;割引 (わりびき): Giảm giá;引き算 (ひきざん): Phép trừ;強引 (ごういん): Cưỡng ép",
          "JLPT": "N4"
        },
        {
          "STT": 202,
          "Kanji": "弟",
          "name": "Đệ",
          "Kun": "おとうと",
          "On": "だい;で;てい",
          "bo_thu": "Cung (弓)",
          "Example": "弟 (おとうと): Em trai;兄弟 (きょうだい): Anh em;弟子 (でし): Đệ tử;義弟 (ぎてい): Em rể;末弟 (まってい): Em út",
          "JLPT": "N4"
        },
        {
          "STT": 203,
          "Kanji": "弱",
          "name": "Nhược",
          "Kun": "よわ",
          "On": "じゃく",
          "bo_thu": "Cung (弓)",
          "Example": "弱い (よわい): Yếu;弱点 (じゃくてん): Điểm yếu;弱音 (よわね): Tiếng rên rỉ;病弱 (びょうじゃく): Ốm yếu;弱まる (よわまる): Suy yếu",
          "JLPT": "N4"
        },
        {
          "STT": 204,
          "Kanji": "強",
          "name": "Cường;Cưỡng",
          "Kun": "つよ;し",
          "On": "きょう;ごう",
          "bo_thu": "Cung (弓)",
          "Example": "強い (つよい): Mạnh;勉強 (べんきょう): Học tập;強盗 (ごうとう): Cướp giật;強調 (きょうちょう): Nhấn mạnh;強力 (きょうりょく): Mạnh mẽ",
          "JLPT": "N4"
        },
        {
          "STT": 205,
          "Kanji": "待",
          "name": "Đãi",
          "Kun": "ま",
          "On": "たい",
          "bo_thu": "Xích (彳)",
          "Example": "待つ (まつ): Đợi;待ち合わせ (まちあわせ): Hẹn gặp;期待 (きたい): Kỳ vọng;招待 (しょうたい): Chiêu đãi/Mời;待合室 (まちあいしつ): Phòng chờ",
          "JLPT": "N4"
        },
        {
          "STT": 206,
          "Kanji": "心",
          "name": "Tâm",
          "Kun": "こころ",
          "On": "しん",
          "bo_thu": "Tâm (心)",
          "Example": "心 (こころ): Trái tim;心配 (しんぱい): Lo lắng;安心 (あんしん): Yên tâm;中心 (ちゅうしん): Trung tâm;心理学 (しんりがく): Tâm lý học",
          "JLPT": "N4"
        },
        {
          "STT": 207,
          "Kanji": "思",
          "name": "Tư",
          "Kun": "おも",
          "On": "し",
          "bo_thu": "Tâm (心)",
          "Example": "思う (おもう): Nghĩ;思い出す (おもいだす): Nhớ lại;意思 (いし): Ý chí;不思議 (ふしぎ): Kỳ lạ;思考 (しこう): Suy nghĩ",
          "JLPT": "N4"
        },
        {
          "STT": 208,
          "Kanji": "急",
          "name": "Cấp",
          "Kun": "いそ",
          "On": "きゅう",
          "bo_thu": "Tâm (心)",
          "Example": "急ぐ (いそぐ): Vội vã;急行 (きゅうこう): Tàu tốc hành;急に (きゅうに): Đột ngột;特急 (とっきゅう): Tàu siêu tốc;緊急 (きんきゅう): Khẩn cấp",
          "JLPT": "N4"
        },
        {
          "STT": 209,
          "Kanji": "悪",
          "name": "Ác;Ố",
          "Kun": "わる",
          "On": "あく;お",
          "bo_thu": "Tâm (心)",
          "Example": "悪い (わるい): Xấu;悪口 (わるぐち): Nói xấu;最悪 (さいあく): Tồi tệ nhất;悪魔 (あくま): Ác quỷ;悪化 (あっか): Xấu đi",
          "JLPT": "N4"
        },
        {
          "STT": 210,
          "Kanji": "意",
          "name": "Ý",
          "Kun": "",
          "On": "い",
          "bo_thu": "Tâm (心)",
          "Example": "意味 (いみ): Ý nghĩa;注意 (ちゅうい): Chú ý;意見 (いけん): Ý kiến;用意 (ようい): Chuẩn bị;意外 (いがい): Ngoài dự tính",
          "JLPT": "N4"
        },
        {
          "STT": 211,
          "Kanji": "所",
          "name": "Sở",
          "Kun": "ところ",
          "On": "しょ",
          "bo_thu": "Hộ (戸)",
          "Example": "所 (ところ): Nơi chốn;場所 (ばしょ): Địa điểm;近所 (きんじょ): Hàng xóm;住所 (じゅうしょ): Địa chỉ;名所 (めいしょ): Danh lam",
          "JLPT": "N4"
        },
        {
          "STT": 212,
          "Kanji": "持",
          "name": "Trì",
          "Kun": "も",
          "On": "じ",
          "bo_thu": "Thủ (扌)",
          "Example": "持つ (まつ): Cầm/Nắm;金持ち (かねもち): Giàu có;気持ち (きもち): Cảm giác;支持 (しじ): Ủng hộ;維持 (いじ): Duy trì",
          "JLPT": "N4"
        },
        {
          "STT": 213,
          "Kanji": "文",
          "name": "Văn",
          "Kun": "ふみ",
          "On": "ぶん;もん",
          "bo_thu": "Văn (文)",
          "Example": "作文 (さくぶん): Bài văn;文字 (もじ): Chữ cái;文化 (ぶんか): Văn hóa;文学 (ぶんがく): Văn học;文法 (ぶんぽう): Ngữ pháp",
          "JLPT": "N4"
        },
        {
          "STT": 214,
          "Kanji": "料",
          "name": "Liệu",
          "Kun": "",
          "On": "りょう",
          "bo_thu": "Mễ (米)",
          "Example": "料理 (りょうり): Nấu ăn;料金 (りょうきん): Phí;材料 (ざいりょう): Nguyên liệu;資料 (しりょう): Tài liệu;無料 (むりょう): Miễn phí",
          "JLPT": "N4"
        },
        {
          "STT": 215,
          "Kanji": "方",
          "name": "Phương",
          "Kun": "かた",
          "On": "ほう",
          "bo_thu": "Phương (方)",
          "Example": "方 (かた): Cách thức/Vị;方法 (ほうほう): Phương pháp;夕方 (ゆうがた): Chiều tà;両方 (りょうほう): Cả hai;方向 (ほうこう): Phương hướng",
          "JLPT": "N4"
        },
        {
          "STT": 216,
          "Kanji": "旅",
          "name": "Lữ",
          "Kun": "たび",
          "On": "りょ",
          "bo_thu": "Phương (方)",
          "Example": "旅 (たび): Chuyến đi;旅行 (りょこう): Du lịch;旅館 (りょかん): Nhà trọ kiểu Nhật;旅券 (りょけん): Hộ chiếu;一人旅 (ひとりたび): Du lịch một mình",
          "JLPT": "N4"
        },
        {
          "STT": 217,
          "Kanji": "族",
          "name": "Tộc",
          "Kun": "",
          "On": "ぞく",
          "bo_thu": "Phương (方)",
          "Example": "家族 (かぞく): Gia đình;民族 (みんぞく): Dân tộc;親族 (しんぞく): Thân tộc;暴走族 (ぼうそうぞく): Quái xế;貴族 (きぞく): Quý tộc",
          "JLPT": "N4"
        },
        {
          "STT": 218,
          "Kanji": "映",
          "name": "Ánh",
          "Kun": "うつ",
          "On": "えい",
          "bo_thu": "Nhật (日)",
          "Example": "映画 (えいが): Phim;映る (うつる): Chiếu/Phản chiếu;上映 (じょうえい): Trình chiếu;映画館 (えいがかん): Rạp phim;映像 (えいぞう): Hình ảnh",
          "JLPT": "N4"
        },
        {
          "STT": 219,
          "Kanji": "春",
          "name": "Xuân",
          "Kun": "はる",
          "On": "しゅん",
          "bo_thu": "Nhật (日)",
          "Example": "春 (はる): Mùa xuân;春休み (はるやすみ): Nghỉ xuân;青春 (せいしゅん): Thanh xuân;新春 (しんしゅん): Đầu xuân;春分 (しゅんぶん): Xuân phân",
          "JLPT": "N4"
        },
        {
          "STT": 220,
          "Kanji": "昼",
          "name": "Trú",
          "Kun": "ひる",
          "On": "ちゅう",
          "bo_thu": "Nhật (日)",
          "Example": "昼 (ひる): Buổi trưa;昼休み (ひるやすみ): Nghỉ trưa;昼食 (ちゅうしょく): Bữa trưa;昼寝 (ひるね): Ngủ trưa;昼間 (ひるま): Ban ngày",
          "JLPT": "N4"
        },
        {
          "STT": 221,
          "Kanji": "暑",
          "name": "Thử",
          "Kun": "あつ",
          "On": "しょ",
          "bo_thu": "Nhật (日)",
          "Example": "暑い (あつい): Nóng (thời tiết);暑中見舞い (しょちゅうみまい): Thăm hỏi ngày nóng;猛暑 (もうしょ): Nóng gay gắt;避暑 (ひしょ): Tránh nóng;暑気 (しょき): Cái nóng",
          "JLPT": "N4"
        },
        {
          "STT": 222,
          "Kanji": "曜",
          "name": "Diệu",
          "Kun": "",
          "On": "よう",
          "bo_thu": "Nhật (日)",
          "Example": "日曜日 (にちようび): Chủ nhật;月曜日 (げつようび): Thứ hai;七曜 (しちよう): 7 ngày trong tuần;土曜 (どよう): Thứ bảy;金曜 (きんよう): Thứ sáu",
          "JLPT": "N4"
        },
        {
          "STT": 223,
          "Kanji": "有",
          "name": "Hữu",
          "Kun": "あ",
          "On": "ゆう;う",
          "bo_thu": "Nguyệt (月)",
          "Example": "有名 (ゆうめい): Nổi tiếng;有り難う (ありがとう): Cảm ơn;有料 (ゆうりょう): Có phí;所有 (しょゆう): Sở hữu;有力 (ゆうりょく): Có quyền lực",
          "JLPT": "N4"
        },
        {
          "STT": 224,
          "Kanji": "服",
          "name": "Phục",
          "Kun": "",
          "On": "ふく",
          "bo_thu": "Nguyệt (月)",
          "Example": "服 (ふく): Quần áo;洋服 (ようふく): Quần áo Tây;和服 (わふく): Quần áo Nhật;制服 (せいふく): Đồng phục;服用 (ふくよう): Uống thuốc",
          "JLPT": "N4"
        },
        {
          "STT": 225,
          "Kanji": "朝",
          "name": "Triều",
          "Kun": "あさ",
          "On": "ちょう",
          "bo_thu": "Nguyệt (月)",
          "Example": "朝 (あさ): Buổi sáng;今朝 (けさ): Sáng nay;朝食 (ちょうしょく): Bữa sáng;毎朝 (まいあさ): Mỗi sáng;早朝 (そうちょう): Sáng sớm",
          "JLPT": "N4"
        },
        {
          "STT": 226,
          "Kanji": "林",
          "name": "Lâm",
          "Kun": "はやし",
          "On": "りん",
          "bo_thu": "Mộc (木)",
          "Example": "林 (はやし): Rừng thưa;森林 (しんりん): Rừng rậm;小林 (こばやし): Tên người Kobayashi;林道 (りんどう): Đường rừng;山林 (さんりん): Núi rừng",
          "JLPT": "N4"
        },
        {
          "STT": 227,
          "Kanji": "森",
          "name": "Sâm",
          "Kun": "もり",
          "On": "しん",
          "bo_thu": "Mộc (木)",
          "Example": "森 (もり): Rừng;森林 (しんりん): Rừng rậm;青森 (あおもり): Tỉnh Aomori;森口 (もりぐち): Tên người Moriguchi;大森 (おおもり): Rừng lớn",
          "JLPT": "N4"
        },
        {
          "STT": 228,
          "Kanji": "業",
          "name": "Nghiệp",
          "Kun": "わざ",
          "On": "ぎょう;ごう",
          "bo_thu": "Mộc (木)",
          "Example": "仕事 (しごと): Công việc;工業 (こうぎょう): Công nghiệp;授業 (じゅぎょう): Tiết học;卒業 (そつぎょう): Tốt nghiệp;残業 (ざんぎょう): Làm thêm giờ",
          "JLPT": "N4"
        },
        {
          "STT": 229,
          "Kanji": "楽",
          "name": "Lạc;Nhạc",
          "Kun": "たの",
          "On": "らく;がく",
          "bo_thu": "Mộc (木)",
          "Example": "楽しい (たのしい): Vui vẻ;音楽 (おんがく): Âm nhạc;楽器 (がっき): Nhạc cụ;楽 (らく): Nhàn nhã;娯楽 (ごらく): Giải trí",
          "JLPT": "N4"
        },
        {
          "STT": 230,
          "Kanji": "歌",
          "name": "Ca",
          "Kun": "うた",
          "On": "か",
          "bo_thu": "Khiếm (欠)",
          "Example": "歌 (うた): Bài hát;歌う (うたう): Hát;歌手 (かしゅ): Ca sĩ;国歌 (こっか): Quốc ca;歌舞伎 (かぶき): Kịch Kabuki",
          "JLPT": "N4"
        },
        {
          "STT": 231,
          "Kanji": "止",
          "name": "Chỉ",
          "Kun": "と;ど",
          "On": "し",
          "bo_thu": "Chỉ (止)",
          "Example": "止まる (とまる): Dừng lại;中止 (ちゅうし): Hủy bỏ;通行止め (つうこうどめ): Cấm thông hành;止める (とめる): Làm dừng lại;停止 (ていし): Đình chỉ",
          "JLPT": "N4"
        },
        {
          "STT": 232,
          "Kanji": "正",
          "name": "Chính",
          "Kun": "ただ;まさ",
          "On": "せい;しょう",
          "bo_thu": "Chỉ (止)",
          "Example": "正しい (ただしい): Đúng;正月 (しょうがつ): Tết;正直 (しょうじき): Thành thật;正午 (しょうご): Chính ngọ;正解 (せいかい): Đáp án đúng",
          "JLPT": "N4"
        },
        {
          "STT": 233,
          "Kanji": "歩",
          "name": "Bộ",
          "Kun": "ある;あゆ",
          "On": "ほ;ふ;ぶ",
          "bo_thu": "Chỉ (止)",
          "Example": "歩く (あるく): Đi bộ;散歩 (さんぽ): Tản bộ;歩道 (ほどう): Đường bộ;一歩 (いっぽ): Một bước;歩合 (ぶあい): Tỷ lệ chiết khấu",
          "JLPT": "N4"
        },
        {
          "STT": 234,
          "Kanji": "死",
          "name": "Tử",
          "Kun": "し",
          "On": "し",
          "bo_thu": "Đãi (歹)",
          "Example": "死ぬ (しぬ): Chết;死体 (したい): Xác chết;必死 (ひっし): Quyết tâm;急死 (きゅうし): Đột tử;死者 (ししゃ): Người chết",
          "JLPT": "N4"
        },
        {
          "STT": 235,
          "Kanji": "民",
          "name": "Dân",
          "Kun": "たみ",
          "On": "みん",
          "bo_thu": "Thị (氏)",
          "Example": "市民 (しみん): Dân thành phố;国民 (こくみん): Quốc dân;民族 (みんぞく): Dân tộc;民主主義 (みんしゅしゅぎ): Chủ nghĩa dân chủ;民間 (みんかん): Tư nhân",
          "JLPT": "N4"
        },
        {
          "STT": 236,
          "Kanji": "池",
          "name": "Trì",
          "Kun": "いけ",
          "On": "ち",
          "bo_thu": "Thủy (氵)",
          "Example": "池 (いけ): Cái ao;電池 (でんち): Pin;貯水池 (ちょすいち): Hồ chứa nước;池袋 (いけぶくろ): Địa danh Ikebukuro;小池 (こいけ): Ao nhỏ",
          "JLPT": "N4"
        },
        {
          "STT": 237,
          "Kanji": "注",
          "name": "Chú",
          "Kun": "そそ",
          "On": "ちゅう",
          "bo_thu": "Thủy (氵)",
          "Example": "注意 (ちゅうい): Chú ý;注文 (ちゅうもん): Đặt hàng;注目 (ちゅうもく): Chú ý/Để mắt;注ぐ (そそぐ): Rót/Đổ;注射 (ちゅうしゃ): Tiêm thuốc",
          "JLPT": "N4"
        },
        {
          "STT": 238,
          "Kanji": "洋",
          "name": "Dương",
          "Kun": "",
          "On": "よう",
          "bo_thu": "Thủy (氵)",
          "Example": "洋服 (ようふく): Quần áo Tây;西洋 (せいよう): Phương Tây;太平洋 (たいへいよう): Thái Bình Dương;洋食 (ようしょく): Món ăn Tây;洋室 (ようしつ): Phòng kiểu Tây",
          "JLPT": "N4"
        },
        {
          "STT": 239,
          "Kanji": "洗",
          "name": "Tẩy",
          "Kun": "あら",
          "On": "せん",
          "bo_thu": "Thủy (氵)",
          "Example": "洗う (あらう): Rửa;洗濯 (せんたく): Giặt giũ;お手洗い (おてあらい): Nhà vệ sinh;洗剤 (せんざい): Chất tẩy rửa;洗面所 (せんめんじょ): Phòng rửa mặt",
          "JLPT": "N4"
        },
        {
          "STT": 240,
          "Kanji": "海",
          "name": "Hải",
          "Kun": "うみ",
          "On": "かい",
          "bo_thu": "Thủy (氵)",
          "Example": "海 (うみ): Biển;海外 (かいがい): Ngoài nước;海水浴 (かいすいよく): Tắm biển;北海道 (ほっかいどう): Hokkaido;海軍 (かいぐん): Hải quân",
          "JLPT": "N4"
        },
        {
          "STT": 241,
          "Kanji": "漢",
          "name": "Hán",
          "Kun": "",
          "On": "かん",
          "bo_thu": "Thủy (氵)",
          "Example": "漢字 (かんじ): Chữ Hán;漢方薬 (かんぽうやく): Thuốc Bắc;漢文 (かんぶん): Văn bản Hán cổ;漢和辞典 (かんわじてん): Từ điển Hán Nhật;痴漢 (ちかん): Kẻ biến thái",
          "JLPT": "N4"
        },
        {
          "STT": 242,
          "Kanji": "牛",
          "name": "Ngưu",
          "Kun": "うし",
          "On": "ぎゅう",
          "bo_thu": "Ngưu (牛)",
          "Example": "牛 (うし): Con bò;牛肉 (ぎゅうにく): Thịt bò;牛乳 (ぎゅうにゅう): Sữa bò;子牛 (こうし): Bê;和牛 (わぎゅう): Bò Nhật",
          "JLPT": "N4"
        },
        {
          "STT": 243,
          "Kanji": "物",
          "name": "Vật",
          "Kun": "もの",
          "On": "ぶつ;もつ",
          "bo_thu": "Ngưu (牛)",
          "Example": "食べ物 (たべもの): Đồ ăn;荷物 (にもつ): Hành lý;動物 (どうぶつ): Động vật;建物 (たてもの): Tòa nhà;見物 (けんぶつ): Tham quan",
          "JLPT": "N4"
        },
        {
          "STT": 244,
          "Kanji": "特",
          "name": "Đặc",
          "Kun": "",
          "On": "とく",
          "bo_thu": "Ngưu (牛)",
          "Example": "特別 (とくべつ): Đặc biệt;特急 (とっきゅう): Tàu siêu tốc;特に (とくに): Đặc biệt là;特長 (とくちょう): Đặc điểm nổi bật;独特 (どくとく): Độc đáo",
          "JLPT": "N4"
        },
        {
          "STT": 245,
          "Kanji": "犬",
          "name": "Khuyển",
          "Kun": "いぬ",
          "On": "けん",
          "bo_thu": "Khuyển (犬)",
          "Example": "犬 (いぬ): Con chó;子犬 (こいぬ): Chó con;秋田犬 (あきたいぬ): Chó Akita;番犬 (ばんけん): Chó giữ nhà;盲導犬 (もうどうけん): Chó dẫn đường",
          "JLPT": "N4"
        },
        {
          "STT": 246,
          "Kanji": "理",
          "name": "Lý",
          "Kun": "",
          "On": "り",
          "bo_thu": "Ngọc (王)",
          "Example": "料理 (りょうり): Nấu ăn;理由 (りゆう): Lý do;地理 (ちり): Địa lý;理解 (りかい): Hiểu;修理 (しゅうり): Sửa chữa",
          "JLPT": "N4"
        },
        {
          "STT": 247,
          "Kanji": "産",
          "name": "Sản",
          "Kun": "う",
          "On": "さん",
          "bo_thu": "Sinh (生)",
          "Example": "お土産 (おみやげ): Quà lưu niệm;生産 (せいさん): Sản xuất;産業 (さんぎょう): Công nghiệp;出産 (しゅっさん): Sinh đẻ;不動産 (ふどうさん): Bất động sản",
          "JLPT": "N4"
        },
        {
          "STT": 248,
          "Kanji": "用",
          "name": "Dụng",
          "Kun": "もち",
          "On": "よう",
          "bo_thu": "Dụng (用)",
          "Example": "用意 (ようい): Chuẩn bị;用事 (ようじ): Việc bận;使用 (しよう): Sử dụng;子供用 (こどもよう): Dùng cho trẻ em;利用 (りよう): Lợi dụng/Sử dụng",
          "JLPT": "N4"
        },
        {
          "STT": 249,
          "Kanji": "町",
          "name": "Đinh",
          "Kun": "まち",
          "On": "ちょう",
          "bo_thu": "Điền (田)",
          "Example": "町 (まち): Thị trấn/Phố;町長 (ちょうちょう): Thị trưởng;下町 (したまち): Khu phố cổ;町中 (まちじゅう): Khắp thị trấn;港町 (みなとまち): Phố cảng",
          "JLPT": "N4"
        },
        {
          "STT": 250,
          "Kanji": "画",
          "name": "Họa;Hoạch",
          "Kun": "",
          "On": "が;かく",
          "bo_thu": "Điền (田)",
          "Example": "映画 (えいが): Phim;計画 (けいかく): Kế hoạch;漫画 (まんが): Truyện tranh;画家 (がか): Họa sĩ;画面 (がめん): Màn hình",
          "JLPT": "N4"
        },
        {
          "STT": 251,
          "Kanji": "界",
          "name": "Giới",
          "Kun": "",
          "On": "かい",
          "bo_thu": "Điền (田)",
          "Example": "世界 (せかい): Thế giới;界限 (かいげん): Giới hạn;政界 (せいかい): Giới chính trị;視界 (しかい): Tầm nhìn;業界 (ぎょうかい): Giới kinh doanh",
          "JLPT": "N4"
        },
        {
          "STT": 252,
          "Kanji": "病",
          "name": "Bệnh",
          "Kun": "や",
          "On": "びょう",
          "bo_thu": "Nạch (疒)",
          "Example": "病院 (びょういん): Bệnh viện;病気 (びょうき): Bệnh;病人 (びょうにん): Người bệnh;急病 (きゅうびょう): Bệnh cấp tính;重病 (じゅうびょう): Bệnh nặng",
          "JLPT": "N4"
        },
        {
          "STT": 253,
          "Kanji": "発",
          "name": "Phát",
          "Kun": "",
          "On": "はつ;ほつ",
          "bo_thu": "Bát (癶)",
          "Example": "出発 (しゅっぱつ): Xuất phát;発見 (はっけん): Phát hiện;発表 (はっぴょう): Phát biểu;発売 (はつばい): Bán ra;発行 (はっこう): Phát hành",
          "JLPT": "N4"
        },
        {
          "STT": 254,
          "Kanji": "県",
          "name": "Huyện",
          "Kun": "",
          "On": "けん",
          "bo_thu": "Mục (目)",
          "Example": "県 (けん): Tỉnh;県庁 (けんちょう): Ủy ban tỉnh;県民 (けんみん): Dân trong tỉnh;県立 (けんりつ): Do tỉnh lập;県道 (けんどう): Đường tỉnh lộ",
          "JLPT": "N4"
        },
        {
          "STT": 255,
          "Kanji": "真",
          "name": "Chân",
          "Kun": "ま",
          "On": "しん",
          "bo_thu": "Mục (目)",
          "Example": "写真 (しゃしん): Ảnh;真っ白 (まっしろ): Trắng toát;真ん中 (まんなか): Ở chính giữa;真実 (しんじつ): Sự thật;真面目 (まじめ): Chăm chỉ",
          "JLPT": "N4"
        },
        {
          "STT": 256,
          "Kanji": "着",
          "name": "Trước",
          "Kun": "き;つ",
          "On": "ちゃく",
          "bo_thu": "Dương (羊)",
          "Example": "着る (きる): Mặc;着く (つく): Đến nơi;到着 (とうちゃく): Đến nơi;下着 (したぎ): Quần áo lót;水着 (みずぎ): Đồ bơi",
          "JLPT": "N4"
        },
        {
          "STT": 257,
          "Kanji": "知",
          "name": "Tri",
          "Kun": "し",
          "On": "ち",
          "bo_thu": "Thị (矢)",
          "Example": "知る (しる): Biết;通知 (つうち): Thông báo;知人 (ちじん): Người quen;知識 (ちしき): Kiến thức;承知 (しょうち): Chấp nhận",
          "JLPT": "N4"
        },
        {
          "STT": 258,
          "Kanji": "短",
          "name": "Đoản",
          "Kun": "みじか",
          "On": "たん",
          "bo_thu": "Thị (矢)",
          "Example": "短い (みじかい): Ngắn;短所 (たんしょ): Nhược điểm;短歌 (たんか): Thơ Tanka;短期間 (たんきかん): Thời gian ngắn;短大 (たんだい): Trường cao đẳng",
          "JLPT": "N4"
        },
        {
          "STT": 259,
          "Kanji": "研",
          "name": "Nghiên",
          "Kun": "と",
          "On": "けん",
          "bo_thu": "Thạch (石)",
          "Example": "研究 (けんきゅう): Nghiên cứu;研修 (けんしゅう): Tu nghiệp;研ぐ (とぐ): Mài/Vo gạo;研究室 (けんきゅうしつ): Phòng nghiên cứu;研究者 (けんきゅうしゃ): Nhà nghiên cứu",
          "JLPT": "N4"
        },
        {
          "STT": 260,
          "Kanji": "私",
          "name": "Tư",
          "Kun": "わたし;わたくし",
          "On": "し",
          "bo_thu": "Hòa (禾)",
          "Example": "私 (わたし): Tôi;私立 (しりつ): Tư lập;私用 (しよう): Việc riêng;私書箱 (ししょばこ): Hộp thư cá nhân;無私 (むし): Vô tư",
          "JLPT": "N4"
        },
        {
          "STT": 261,
          "Kanji": "秋",
          "name": "Thu",
          "Kun": "あき",
          "On": "しゅう",
          "bo_thu": "Hòa (禾)",
          "Example": "秋 (あき): Mùa thu;秋休み (あきやすみ): Nghỉ thu;晩秋 (ばんしゅう): Cuối thu;秋分 (しゅうぶん): Thu phân;春秋 (しゅんじゅう): Xuân thu",
          "JLPT": "N4"
        },
        {
          "STT": 262,
          "Kanji": "究",
          "name": "Cứu",
          "Kun": "きわ",
          "On": "きゅう",
          "bo_thu": "Huyệt (穴)",
          "Example": "研究 (けんきゅう): Nghiên cứu;究める (きわめる): Tìm hiểu sâu;学究 (がっきゅう): Nghiên cứu học vấn;探究 (たんきゅう): Thăm dò;追究 (ついきゅう): Truy cứu",
          "JLPT": "N4"
        },
        {
          "STT": 263,
          "Kanji": "答",
          "name": "Đáp",
          "Kun": "こた",
          "On": "とう",
          "bo_thu": "Trúc (竹)",
          "Example": "答える (こたえる): Trả lời;答え (こたえ): Câu trả lời;回答 (かいとう): Giải đáp;問答 (もんどう): Hỏi đáp;口頭回答 (こうとうかいとう): Trả lời miệng",
          "JLPT": "N4"
        },
        {
          "STT": 264,
          "Kanji": "紙",
          "name": "Chỉ",
          "Kun": "かみ",
          "On": "し",
          "bo_thu": "Mịch (糸)",
          "Example": "手紙 (てがみ): Bức thư;紙 (かみ): Giấy;コピー用紙 (こぴーようし): Giấy photocopy;和紙 (わし): Giấy kiểu Nhật;折り紙 (origami): Nghệ thuật gấp giấy",
          "JLPT": "N4"
        },
        {
          "STT": 265,
          "Kanji": "終",
          "name": "Chung",
          "Kun": "お",
          "On": "しゅう",
          "bo_thu": "Mịch (糸)",
          "Example": "終わる (おわる): Kết thúc;終わり (おわり): Sự kết thúc;終電 (しゅうでん): Chuyến tàu cuối;最終 (さいしゅう): Cuối cùng;終点 (しゅうてん): Điểm cuối",
          "JLPT": "N4"
        },
        {
          "STT": 266,
          "Kanji": "習",
          "name": "Tập",
          "Kun": "なら",
          "On": "しゅう",
          "bo_thu": "Vũ (羽)",
          "Example": "習う (ならう): Học;練習 (れんしゅう): Luyện tập;自習 (じしゅう): Tự học;復習 (ふくしゅう): Ôn tập;予習 (よしゅう): Chuẩn bị bài",
          "JLPT": "N4"
        },
        {
          "STT": 267,
          "Kanji": "考",
          "name": "Khảo",
          "Kun": "かんが",
          "On": "こう",
          "bo_thu": "Lão (耂)",
          "Example": "考える (かんがえる): Suy nghĩ;考え (かんがえ): Ý nghĩ;参考 (さんこう): Tham khảo;考古学 (こうこがく): Khảo cổ học;選考 (せんこう): Tuyển chọn",
          "JLPT": "N4"
        },
        {
          "STT": 268,
          "Kanji": "者",
          "name": "Giả",
          "Kun": "もの",
          "On": "しゃ",
          "bo_thu": "Lão (耂)",
          "Example": "医者 (いしゃ): Bác sĩ;学者 (がくしゃ): Học giả;若者 (わかもの): Người trẻ;読者 (どくしゃ): Độc giả;記者 (きしゃ): Ký giả",
          "JLPT": "N4"
        },
        {
          "STT": 269,
          "Kanji": "肉",
          "name": "Nhục",
          "Kun": "",
          "On": "にく",
          "bo_thu": "Nhục (肉)",
          "Example": "肉 (にく): Thịt;牛肉 (ぎゅうにく): Thịt bò;豚肉 (ぶたにく): Thịt lợn;筋肉 (きんにく): Cơ bắp;肉屋 (にくや): Cửa hàng thịt",
          "JLPT": "N4"
        },
        {
          "STT": 270,
          "Kanji": "色",
          "name": "Sắc",
          "Kun": "いろ",
          "On": "しき;しょく",
          "bo_thu": "Sắc (色)",
          "Example": "色 (いろ): Màu sắc;景色 (けしき): Phong cảnh;茶色 (ちゃいろ): Màu nâu;特色 (とくしょく): Đặc sắc;三色 (さんしょく): Ba màu",
          "JLPT": "N4"
        },
        {
          "STT": 271,
          "Kanji": "茶",
          "name": "Trà",
          "Kun": "",
          "On": "ちゃ;さ",
          "bo_thu": "Thảo (艹)",
          "Example": "お茶 (おちゃ): Trà;茶色 (ちゃいろ): Màu nâu;喫茶店 (きっさてん): Quán cà phê;茶道 (さどう): Trà đạo;紅茶 (こうちゃ): Trà đen",
          "JLPT": "N4"
        },
        {
          "STT": 272,
          "Kanji": "菜",
          "name": "Thái",
          "Kun": "な",
          "On": "さい",
          "bo_thu": "Thảo (艹)",
          "Example": "野菜 (やさい): Rau;菜食 (さいしょく): Ăn chay;白菜 (はくさい): Cải thảo;菜園 (さいえん): Vườn rau;生野菜 (なまやさい): Rau sống",
          "JLPT": "N4"
        },
        {
          "STT": 273,
          "Kanji": "薬",
          "name": "Dược",
          "Kun": "くすり",
          "On": "やく",
          "bo_thu": "Thảo (艹)",
          "Example": "薬 (くすり): Thuốc;薬局 (やっきょく): Hiệu thuốc;目薬 (めぐすり): Thuốc nhỏ mắt;風邪薬 (かぜぐすり): Thuốc cảm;農薬 (のうやく): Thuốc trừ sâu",
          "JLPT": "N4"
        },
        {
          "STT": 274,
          "Kanji": "親",
          "name": "Thân",
          "Kun": "おや;した",
          "On": "しん",
          "bo_thu": "Kiến (見)",
          "Example": "親 (おや): Cha mẹ;親切 (しんせつ): Thân thiện;両親 (りょうしん): Bố mẹ;親友 (しんゆう): Bạn thân;親しい (したしい): Thân thiết",
          "JLPT": "N4"
        },
        {
          "STT": 275,
          "Kanji": "計",
          "name": "Kế",
          "Kun": "はか",
          "On": "けい",
          "bo_thu": "Ngôn (言)",
          "Example": "時計 (とけい): Đồng hồ;計画 (けいかく): Kế hoạch;会計 (かいけい): Kế toán/Thanh toán;合計 (ごうけい): Tổng cộng;計算 (けいさん): Tính toán",
          "JLPT": "N4"
        },
        {
          "STT": 276,
          "Kanji": "試",
          "name": "Thí",
          "Kun": "こころ;ため",
          "On": "し",
          "bo_thu": "Ngôn (言)",
          "Example": "試験 (しけん): Kỳ thi;試す (ためす): Thử nghiệm;試合 (しあい): Trận đấu;入試 (にゅうし): Thi nhập học;試食 (ししょく): Ăn thử",
          "JLPT": "N4"
        },
        {
          "STT": 277,
          "Kanji": "説",
          "name": "Thuyết",
          "Kun": "と",
          "On": "せつ;ぜい",
          "bo_thu": "Ngôn (言)",
          "Example": "説明 (せつめい): Giải thích;小説 (しょうせつ): Tiểu thuyết;伝説 (でんせつ): Truyền thuyết;説教 (せっきょう): Thuyết giáo;演説 (えんぜつ): Diễn thuyết",
          "JLPT": "N4"
        },
        {
          "STT": 278,
          "Kanji": "貸",
          "name": "Thải",
          "Kun": "か",
          "On": "たい",
          "bo_thu": "Bối (貝)",
          "Example": "貸す (かす): Cho vay/Cho thuê;貸し出し (かしだし): Cho mượn;賃貸 (ちんたい): Cho thuê nhà;貸家 (かしや): Nhà cho thuê;貸し切り (かしきり): Cho thuê trọn gói",
          "JLPT": "N4"
        },
        {
          "STT": 279,
          "Kanji": "質",
          "name": "Chất",
          "Kun": "",
          "On": "しつ;しち;ち",
          "bo_thu": "Bối (貝)",
          "Example": "質問 (しつもん): Câu hỏi;品質 (ひんしつ): Chất lượng;性質 (せいしつ): Tính chất;質屋 (しちや): Tiệm cầm đồ;物質 (ぶっしつ): Vật chất",
          "JLPT": "N4"
        },
        {
          "STT": 280,
          "Kanji": "走",
          "name": "Tẩu",
          "Kun": "はし",
          "On": "そう",
          "bo_thu": "Tẩu (走)",
          "Example": "走る (はしる): Chạy;走行 (そうこう): Xe đang chạy;競走 (きょうそう): Cuộc đua;脱走 (だっそう): Đào tẩu;暴走 (ぼうそう): Chạy loạn",
          "JLPT": "N4"
        },
        {
          "STT": 281,
          "Kanji": "起",
          "name": "Khởi",
          "Kun": "お",
          "On": "き",
          "bo_thu": "Tẩu (走)",
          "Example": "起きる (おきる): Thức dậy;起こす (おこす): Đánh thức;起動 (きどう): Khởi động;早起き (はやおき): Dậy sớm;起立 (きりつ): Đứng lên",
          "JLPT": "N4"
        },
        {
          "STT": 282,
          "Kanji": "転",
          "name": "Chuyển",
          "Kun": "ころ",
          "On": "てん",
          "bo_thu": "Xa (車)",
          "Example": "自転車 (じてんしゃ): Xe đạp;運転 (うんてん): Lái xe;回転 (かいてん): Xoay chuyển;転ぶ (ころぶ): Ngã;移転 (いてん): Di chuyển địa điểm",
          "JLPT": "N4"
        },
        {
          "STT": 283,
          "Kanji": "軽",
          "name": "Khinh",
          "Kun": "かる",
          "On": "けい",
          "bo_thu": "Xa (車)",
          "Example": "軽い (かるい): Nhẹ;軽食 (けいしょく): Ăn nhẹ;軽快 (けいかい): Nhẹ nhàng;軽蔑 (けいべつ): Khinh miệt;軽自動車 (けいじどうしゃ): Xe ô tô hạng nhẹ",
          "JLPT": "N4"
        },
        {
          "STT": 284,
          "Kanji": "送",
          "name": "Tống",
          "Kun": "おく",
          "On": "そう",
          "bo_thu": "Sước (⻌)",
          "Example": "送る (おくる): Gửi đi;送信 (そうしん): Truyền đi/Gửi;見送る (みおくる): Tiễn;放送 (ほうそう): Phát sóng;送金 (そうきん): Gửi tiền",
          "JLPT": "N4"
        },
        {
          "STT": 285,
          "Kanji": "通",
          "name": "Thông",
          "Kun": "とお;かよ",
          "On": "つう;つ",
          "bo_thu": "Sước (⻌)",
          "Example": "通る (とおる): Đi qua;通う (かよう): Đi học/Đi làm;交通 (こうつう): Giao thông;通り (とおり): Đường phố;普通 (ふつう): Thông thường",
          "JLPT": "N4"
        },
        {
          "STT": 286,
          "Kanji": "進",
          "name": "Tiến",
          "Kun": "すす",
          "On": "しん",
          "bo_thu": "Sước (⻌)",
          "Example": "進む (すすむ): Tiến lên;進学 (しんがく): Học lên cao;進歩 (しんぽ): Tiến bộ;行進 (こうしん): Diễu hành;前進 (ぜんしん): Tiến về phía trước",
          "JLPT": "N4"
        },
        {
          "STT": 287,
          "Kanji": "運",
          "name": "Vận",
          "Kun": "はこ",
          "On": "うん",
          "bo_thu": "Sước (⻌)",
          "Example": "運ぶ (はこぶ): Vận chuyển;運転 (うんてん): Lái xe;運動 (うんどう): Vận động;運がいい (うんがいい): May mắn;運賃 (うんちん): Cước vận chuyển",
          "JLPT": "N4"
        },
        {
          "STT": 288,
          "Kanji": "都",
          "name": "Đô",
          "Kun": "みやこ",
          "On": "と;つ",
          "bo_thu": "Ấp (⻏)",
          "Example": "京都 (きょうと): Kyoto;東京都 (とうきょうと): Thủ đô Tokyo;都会 (とかい): Thành thị;都合 (つごう): Điều kiện thuận tiện;都市 (とし): Đô thị",
          "JLPT": "N4"
        },
        {
          "STT": 289,
          "Kanji": "重",
          "name": "Trọng;Trùng",
          "Kun": "おも;かさ",
          "On": "じゅう;ちょう",
          "bo_thu": "Lý (里)",
          "Example": "重い (おもい): Nặng;大切 (たいせつ): Quan trọng;体重 (たいじゅう): Cân nặng;重ねる (かさねる): Chồng lên;重力 (じゅうりょく): Trọng lực",
          "JLPT": "N4"
        },
        {
          "STT": 290,
          "Kanji": "野",
          "name": "Dã",
          "Kun": "の",
          "On": "や",
          "bo_thu": "Lý (里)",
          "Example": "野菜 (やさい): Rau;分野 (ぶんや): Lĩnh vực;長野 (ながの): Tỉnh Nagano;野原 (のはら): Cánh đồng;野球 (やきゅう): Bóng chày",
          "JLPT": "N4"
        },
        {
          "STT": 291,
          "Kanji": "銀",
          "name": "Ngân",
          "Kun": "",
          "On": "ぎん",
          "bo_thu": "Kim (金)",
          "Example": "銀行 (ぎんこう): Ngân hàng;銀 (ぎん): Bạc;銀色 (ぎんいろ): Màu bạc;水銀 (すいぎん): Thủy ngân;銀河 (ぎんが): Ngân hà",
          "JLPT": "N4"
        },
        {
          "STT": 292,
          "Kanji": "開",
          "name": "Khai",
          "Kun": "あ;ひら",
          "On": "かい",
          "bo_thu": "Môn (門)",
          "Example": "開ける (あける): Mở;開店 (かいてん): Mở cửa hàng;開始 (かいし): Bắt đầu;開会 (かいかい): Khai mạc;公開 (こうかい): Công khai",
          "JLPT": "N4"
        },
        {
          "STT": 293,
          "Kanji": "院",
          "name": "Viện",
          "Kun": "",
          "On": "いん",
          "bo_thu": "Phụ (⻖)",
          "Example": "病院 (びょうin): Bệnh viện;入院 (にゅういん): Nhập viện;大学院 (だいがくいん): Cao học;院長 (いんちょう): Viện trưởng;寺院 (じいん): Chùa chiền",
          "JLPT": "N4"
        },
        {
          "STT": 294,
          "Kanji": "集",
          "name": "Tập",
          "Kun": "あつ",
          "On": "しゅう",
          "bo_thu": "Truy (隹)",
          "Example": "集まる (あつまる): Tập trung;集める (あつめる): Thu thập;集合 (しゅうごう): Tập hợp;集中 (しゅうちゅう): Tập trung cao độ;特集 (とくしゅう): Số đặc biệt",
          "JLPT": "N4"
        },
        {
          "STT": 295,
          "Kanji": "音",
          "name": "Âm",
          "Kun": "おと;ね",
          "On": "おん;いん",
          "bo_thu": "Âm (音)",
          "Example": "音 (おと): Âm thanh;音楽 (おんがく): Âm nhạc;発音 (はつおん): Phát âm;本音 (ほんね): Ý định thật sự;録音 (ろくおん): Ghi âm",
          "JLPT": "N4"
        },
        {
          "STT": 296,
          "Kanji": "頭",
          "name": "Đầu",
          "Kun": "あたま;かしら",
          "On": "とう;ず;と",
          "bo_thu": "Hiệt (頁)",
          "Example": "頭 (あたま): Đầu;頭痛 (ずつう): Đau đầu;一頭 (いっとう): Một con (động vật lớn);先頭 (せんとう): Dẫn đầu;頭脳 (ずのう): Bộ não",
          "JLPT": "N4"
        },
        {
          "STT": 297,
          "Kanji": "題",
          "name": "Đề",
          "Kun": "",
          "On": "だい",
          "bo_thu": "Hiệt (頁)",
          "Example": "宿題 (しゅくだい): Bài tập về nhà;問題 (もんだい): Vấn đề;話題 (わだい): Đề tài;題名 (だいめい): Nhan đề;主題 (しゅだい): Chủ đề",
          "JLPT": "N4"
        },
        {
          "STT": 298,
          "Kanji": "顔",
          "name": "Nhan",
          "Kun": "かお",
          "On": "がん",
          "bo_thu": "Hiệt (頁)",
          "Example": "顔 (かお): Khuôn mặt;洗顔 (せんがん): Rửa mặt;笑顔 (えがお): Gương mặt tươi cười;顔色 (かおいろ): Sắc mặt;素顔 (すがお): Mặt mộc",
          "JLPT": "N4"
        },
        {
          "STT": 299,
          "Kanji": "風",
          "name": "Phong",
          "Kun": "かぜ",
          "On": "ふう;ふ",
          "bo_thu": "Phong (風)",
          "Example": "風 (かぜ): Gió;台風 (たいふ): Bão;お風呂 (おふろ): Bồn tắm;和風 (わふう): Kiểu Nhật;風景 (ふうけい): Phong cảnh",
          "JLPT": "N4"
        },
        {
          "STT": 300,
          "Kanji": "飯",
          "name": "Phạn",
          "Kun": "めし",
          "On": "はん",
          "bo_thu": "Thực (食)",
          "Example": "ご飯 (ごはん): Cơm/Bữa ăn;夕飯 (ゆうはん): Bữa tối;朝飯 (あさめし): Bữa sáng;炊飯器 (すいはんき): Nồi cơm điện;赤飯 (せきはん): Xôi đậu đỏ",
          "JLPT": "N4"
        },
        {
          "STT": 301,
          "Kanji": "館",
          "name": "Quán",
          "Kun": "やかた",
          "On": "かん",
          "bo_thu": "Thực (食)",
          "Example": "図書館 (としょかん): Thư viện;大使館 (たいしかん): Đại sứ quán;映画館 (えいがかん): Rạp chiếu phim;体育館 (たいいくかん): Nhà thi đấu;旅館 (りょかん): Nhà trọ kiểu Nhật",
          "JLPT": "N4"
        },
        {
          "STT": 302,
          "Kanji": "首",
          "name": "Thủ",
          "Kun": "くび",
          "On": "しゅ",
          "bo_thu": "Thủ (首)",
          "Example": "首 (くび): Cổ;手首 (てくび): Cổ tay;足首 (あしくび): Cổ chân;首相 (しゅしょう): Thủ tướng;首都 (しゅと): Thủ đô",
          "JLPT": "N4"
        },
        {
          "STT": 303,
          "Kanji": "験",
          "name": "Nghiệm",
          "Kun": "",
          "On": "けん;げん",
          "bo_thu": "Mã (馬)",
          "Example": "試験 (しけん): Kỳ thi;経験 (けいけん): Kinh nghiệm;受験 (じゅけん): Dự thi;実験 (じっけん): Thí nghiệm;体験 (たいけん): Trải nghiệm",
          "JLPT": "N4"
        },
        {
          "STT": 304,
          "Kanji": "鳥",
          "name": "Điểu",
          "Kun": "とり",
          "On": "ちょう",
          "bo_thu": "Điểu (鳥)",
          "Example": "鳥 (とり): Con chim;一石二鳥 (いっせきにちょう): Một mũi tên trúng hai đích;白鳥 (はくちょう): Thiên nga;小鳥 (ことり): Chim nhỏ;焼き鳥 (やきとり): Gà nướng",
          "JLPT": "N4"
        },
        {
          "STT": 305,
          "Kanji": "黒",
          "name": "Hắc",
          "Kun": "くろ",
          "On": "こく",
          "bo_thu": "Hắc (黒)",
          "Example": "黒い (くろい): Đen;黒板 (こくばん): Bảng đen;真っ黒 (まっくろ): Đen kịt;黒字 (くろじ): Lãi;黒糖 (こくとう): Đường đen",
          "JLPT": "N4"
        },
        {
          "STT": 306,
          "Kanji": "忙",
          "name": "Mang",
          "Kun": "いそが",
          "On": "ぼう",
          "bo_thu": "Tâm (忄)",
          "Example": "忙しい (いそがしい): Bận rộn;多忙 (たぼう): Rất bận;多忙を極める (たぼうをきわめる): Cực kỳ bận rộn;忙中 (ぼうちゅう): Lúc bận rộn;繁忙期 (はんぼうき): Thời kỳ cao điểm bận rộn",
          "JLPT": "N4"
        },
        {
          "STT": 307,
          "Kanji": "階",
          "name": "Giai",
          "Kun": "",
          "On": "かい",
          "bo_thu": "Phụ (⻖)",
          "Example": "階段 (かいだん): Cầu thang;三階 (さんがい): Tầng 3;階級 (かいきゅう): Giai cấp;段階 (だんかい): Giai đoạn;地階 (ちかい): Tầng hầm",
          "JLPT": "N4"
        },
        {
          "STT": 308,
          "Kanji": "段",
          "name": "Đoạn",
          "Kun": "",
          "On": "だん",
          "bo_thu": "Thù (殳)",
          "Example": "階段 (かいだん): Cầu thang;値段 (ねだん): Giá cả;手段 (しゅだん): Thủ đoạn/Cách thức;普段 (ふだん): Thông thường;特段 (とくだん): Đặc biệt",
          "JLPT": "N4"
        },
        {
          "STT": 309,
          "Kanji": "箱",
          "name": "Tương",
          "Kun": "はこ",
          "On": "そう",
          "bo_thu": "Trúc (竹)",
          "Example": "箱 (はこ): Cái hộp;ゴミ箱 (ごみばこ): Thùng rác;箱入り (はこいり): Đóng hộp;巣箱 (すばこ): Chuồng chim;重箱 (じゅうばこ): Hộp sơn mài nhiều tầng",
          "JLPT": "N4"
        },
        {
          "STT": 310,
          "Kanji": "鼻",
          "name": "Tị",
          "Kun": "はな",
          "On": "び",
          "bo_thu": "Tị (鼻)",
          "Example": "鼻 (はな): Cái mũi;鼻水 (はなみず): Nước mũi;鼻血 (はなぢ): Chảy máu cam;耳鼻科 (じびか): Khoa tai mũi họng;鼻声 (はなごえ): Giọng mũi",
          "JLPT": "N4"
        },
        {
          "STT": 311,
          "Kanji": "皿",
          "name": "Mãnh",
          "Kun": "さら",
          "On": "べい",
          "bo_thu": "Mãnh (皿)",
          "Example": "皿 (さら): Cái đĩa;小皿 (こざら): Đĩa nhỏ;灰皿 (はいざら): Gạt tàn;大皿 (おおざら): Đĩa lớn;皿洗い (さらあらい): Rửa bát",
          "JLPT": "N4"
        },
        {
          "STT": 312,
          "Kanji": "歯",
          "name": "Xỉ",
          "Kun": "は",
          "On": "し",
          "bo_thu": "Xỉ (歯)",
          "Example": "歯 (は): Răng;歯医者 (はいしゃ): Nha sĩ;虫歯 (むしば): Răng sâu;歯ブラシ (はぶらし): Bàn chải đánh răng;歯科 (しか): Nha khoa",
          "JLPT": "N4"
        },
        {
          "STT": 313,
          "Kanji": "氷",
          "name": "Băng",
          "Kun": "こおり;ひ",
          "On": "ひょう",
          "bo_thu": "Thủy (水)",
          "Example": "氷 (こおり): Băng/Đá;かき氷 (かきごおり): Đá bào;氷山 (ひょうざん): Núi băng;結氷 (けっぴょう): Đóng băng;氷河 (ひょうが): Sông băng",
          "JLPT": "N4"
        },
        {
          "STT": 314,
          "Kanji": "港",
          "name": "Cảng",
          "Kun": "みなと",
          "On": "こう",
          "bo_thu": "Thủy (氵)",
          "Example": "港 (みなと): Cảng;空港 (くうこう): Sân bay;出港 (しゅっこう): Xuất cảng;入港 (にゅうこう): Nhập cảng;港町 (みなとまち): Phố cảng",
          "JLPT": "N4"
        },
        {
          "STT": 315,
          "Kanji": "雲",
          "name": "Vân",
          "Kun": "くも",
          "On": "うん",
          "bo_thu": "Vũ (雨)",
          "Example": "雲 (くも): Đám mây;雨雲 (あまぐも): Mây mưa;入道雲 (にゅうどうぐも): Mây tích;積乱雲 (せきらんうん): Mây dông;暗雲 (あんうん): Mây đen",
          "JLPT": "N4"
        },
        {
          "STT": 316,
          "Kanji": "晴",
          "name": "Tình",
          "Kun": "は",
          "On": "せい",
          "bo_thu": "Nhật (日)",
          "Example": "晴れ (はれ): Trời nắng;晴れる (はれる): Nắng lên;晴天 (せいてん): Trời quang đãng;秋晴れ (あきばれ): Trời thu trong xanh;晴天白日 (せいてんはくじつ): Thanh thiên bạch nhật",
          "JLPT": "N4"
        },
        {
          "STT": 317,
          "Kanji": "雪",
          "name": "Tuyết",
          "Kun": "ゆき",
          "On": "せつ",
          "bo_thu": "Vũ (雨)",
          "Example": "雪 (ゆき): Tuyết;大雪 (おおゆき): Tuyết rơi nhiều;新雪 (しんせつ): Tuyết mới;降雪 (こうせつ): Tuyết rơi;雪だるま (ゆきだるま): Người tuyết",
          "JLPT": "N4"
        },
        {
          "STT": 318,
          "Kanji": "震",
          "name": "Chấn",
          "Kun": "ふる",
          "On": "しん",
          "bo_thu": "Vũ (雨)",
          "Example": "地震 (じしん): Động đất;震える (ふるえる): Run rẩy;震度 (しんど): Cường độ địa chấn;震災 (しんさい): Thảm họa động đất;震動 (しんどう): Chấn động",
          "JLPT": "N4"
        },
        {
          "STT": 319,
          "Kanji": "波",
          "name": "Ba",
          "Kun": "なみ",
          "On": "は",
          "bo_thu": "Thủy (氵)",
          "Example": "波 (なみ): Sóng;津波 (つなみ): Sóng thần;電波 (でんぱ): Sóng điện từ;波浪 (はろう): Sóng lớn;難波 (なにわ): Tên cổ của Osaka",
          "JLPT": "N4"
        },
        {
          "STT": 320,
          "Kanji": "窓",
          "name": "Song",
          "Kun": "まど",
          "On": "そう",
          "bo_thu": "Huyệt (穴)",
          "Example": "窓 (まど): Cửa sổ;窓口 (まどぐち): Cửa bán vé;同窓会 (どうそうかい): Họp lớp;窓側 (まどぎわ): Cạnh cửa sổ;車窓 (しゃそう): Cửa sổ xe",
          "JLPT": "N4"
        },
        {
          "STT": 321,
          "Kanji": "練",
          "name": "Luyện",
          "Kun": "ね",
          "On": "れん",
          "bo_thu": "Mịch (糸)",
          "Example": "練習 (れんしゅう): Luyện tập;訓練 (くんれん): Huấn luyện;練る (ねる): Nhào trộn/Trau chuốt;試練 (しれん): Thử thách;洗練 (せんれん): Tinh tế/Lịch thiệp",
          "JLPT": "N4"
        },
        {
          "STT": 322,
          "Kanji": "経",
          "name": "Kinh",
          "Kun": "へ",
          "On": "けい;きょう",
          "bo_thu": "Mịch (糸)",
          "Example": "経験 (けいけん): Kinh nghiệm;経済 (けいざい): Kinh tế;経つ (たつ): Trải qua (thời gian);経由 (けいゆ): Thông qua;お経 (おきょう): Kinh Phật",
          "JLPT": "N4"
        },
        {
          "STT": 323,
          "Kanji": "済",
          "name": "Tế",
          "Kun": "す",
          "On": "さい;ざい",
          "bo_thu": "Thủy (氵)",
          "Example": "経済 (けいざい): Kinh tế;済む (すむ): Kết thúc/Xong xuôi;決済 (けっさい): Quyết toán;共済 (きょうさい): Cộng tác/Trợ giúp;返済 (へんさい): Hoàn trả",
          "JLPT": "N4"
        },
        {
          "STT": 324,
          "Kanji": "相",
          "name": "Tương;Tướng",
          "Kun": "あい",
          "On": "そう;しょう",
          "bo_thu": "Mộc (木)",
          "Example": "相談 (そうだん): Thảo luận;相手 (あいて): Đối phương;首相 (しゅしょう): Thủ tướng;相当 (そうとう): Tương đương;相互 (そうご): Qua lại lẫn nhau",
          "JLPT": "N4"
        },
        {
          "STT": 325,
          "Kanji": "談",
          "name": "Đàm",
          "Kun": "",
          "On": "だん",
          "bo_thu": "Ngôn (言)",
          "Example": "相談 (そうだん): Thảo luận;談話 (だんわ): Đàm thoại;会談 (かいだん): Hội đàm;冗談 (じょうだん): Nói đùa;対談 (たいだん): Đối thoại",
          "JLPT": "N4"
        },
        {
          "STT": 326,
          "Kanji": "世",
          "name": "Thế",
          "Kun": "よ",
          "On": "せい;せ",
          "bo_thu": "Nhất (一)",
          "Example": "世界 (せかい): Thế giới;世話 (せわ): Chăm sóc;世の中 (よのなか): Thế gian;二世 (にせい): Đời thứ hai;世紀 (せいき): Thế kỷ",
          "JLPT": "N4"
        },
        {
          "STT": 327,
          "Kanji": "紀",
          "name": "Kỷ",
          "Kun": "",
          "On": "き",
          "bo_thu": "Mịch (糸)",
          "Example": "世紀 (せいき): Thế kỷ;紀元 (きげn): Kỷ nguyên;紀行 (きこう): Ký sự hành trình;紀律 (きりつ): Kỷ luật;風紀 (ふうき): Phong kỷ/Đạo đức công cộng",
          "JLPT": "N4"
        },
        {
          "STT": 328,
          "Kanji": "表",
          "name": "Biểu",
          "Kun": "おもて;あらわ",
          "On": "ひょう",
          "bo_thu": "Y (衣)",
          "Example": "発表 (はっぴょう): Phát biểu;表 (おもて): Mặt phải/Phía trước;表面 (ひょうめん): Bề mặt;代表 (だいひょう): Đại diện;表現 (ひょうげん): Biểu hiện",
          "JLPT": "N4"
        },
        {
          "STT": 329,
          "Kanji": "理",
          "name": "Lý",
          "Kun": "",
          "On": "り",
          "bo_thu": "Ngọc (王)",
          "Example": "理由 (りゆう): Lý do;料理 (りょうり): Nấu ăn;無理 (むり): Vô lý/Quá sức;理解 (りかい): Hiểu;管理 (かんり): Quản lý",
          "JLPT": "N4"
        },
        {
          "STT": 330,
          "Kanji": "由",
          "name": "Do",
          "Kun": "よし",
          "On": "ゆう;ゆ",
          "bo_thu": "Điền (田)",
          "Example": "理由 (りゆう): Lý do;自由 (じゆう): Tự do;経由 (けいゆ): Thông qua;不自由 (ふじゆう): Tàn tật/Bất tiện;由来 (ゆらい): Nguồn gốc",
          "JLPT": "N4"
        },
        {
          "STT": 331,
          "Kanji": "決",
          "name": "Quyết",
          "Kun": "き",
          "On": "けつ",
          "bo_thu": "Thủy (氵)",
          "Example": "決める (きめる): Quyết định;解決 (かいけつ): Giải quyết;決意 (けつい): Quyết tâm;決して (けっして): Tuyệt đối không;決定 (けってい): Quyết định",
          "JLPT": "N4"
        },
        {
          "STT": 332,
          "Kanji": "定",
          "name": "Định",
          "Kun": "さだ",
          "On": "てい;じょう",
          "bo_thu": "Miên (宀)",
          "Example": "決定 (けってい): Quyết định;予定 (よてい): Dự định;定食 (ていしょく): Suất ăn cố định;定休日 (ていきゅうび): Ngày nghỉ cố định;否定 (ひてい): Phủ định",
          "JLPT": "N4"
        },
        {
          "STT": 333,
          "Kanji": "忘",
          "name": "Vong",
          "Kun": "わす",
          "On": "ぼう",
          "bo_thu": "Tâm (心)",
          "Example": "忘れる (わすれる): Quên;忘れ物 (わすれもの): Đồ bỏ quên;忘年会 (ぼうねんかい): Tiệc tất niên;備忘録 (びぼうろく): Sổ tay ghi chép;忘却 (ぼうきゃく): Quên bẵng",
          "JLPT": "N4"
        },
        {
          "STT": 334,
          "Kanji": "覚",
          "name": "Giác",
          "Kun": "おぼ;さ",
          "On": "かく",
          "bo_thu": "Kiến (見)",
          "Example": "覚える (おぼえる): Nhớ;目覚まし (めざまし): Đánh thức;感覚 (かんかく): Cảm giác;覚悟 (かくご): Chuẩn bị tâm lý;味覚 (みかく): Vị giác",
          "JLPT": "N4"
        },
        {
          "STT": 335,
          "Kanji": "困",
          "name": "Khốn",
          "Kun": "こま",
          "On": "こん",
          "bo_thu": "Vi (囗)",
          "Example": "困る (こまる): Khó khăn/Bối rối;困難 (こんなん): Khó khăn;困窮 (こんきゅう): Khốn cùng;貧困 (ひんこん): Nghèo đói;困惑 (こんわく): Lúng túng",
          "JLPT": "N4"
        },
        {
          "STT": 336,
          "Kanji": "疲",
          "name": "Bì",
          "Kun": "つか",
          "On": "ひ",
          "bo_thu": "Nạch (疒)",
          "Example": "疲れる (つかれる): Mệt mỏi;疲れ (つかれ): Sự mệt mỏi;疲労 (ひろう): Phối sức/Mệt nhọc;心身疲弊 (しんしんひへい): Kiệt sức tâm thân;疲労困憊 (ひろうこんぱい): Mệt rã rời",
          "JLPT": "N4"
        },
        {
          "STT": 337,
          "Kanji": "浴",
          "name": "Dục",
          "Kun": "あび",
          "On": "よく",
          "bo_thu": "Thủy (氵)",
          "Example": "浴びる (あびる): Tắm;浴室 (よくしつ): Phòng tắm;海水浴 (かいすいよく): Tắm biển;入浴 (にゅうよく): Việc tắm rửa;浴衣 (ゆかた): Áo Yukata",
          "JLPT": "N4"
        },
        {
          "STT": 338,
          "Kanji": "降",
          "name": "Giáng;Hàng",
          "Kun": "お;ふ",
          "On": "こう",
          "bo_thu": "Phụ (⻖)",
          "Example": "降りる (おりる): Xuống xe;降る (ふる): Rơi (mưa",
          "JLPT": "tuyết);降車 (こうしゃ): Xuống xe;以降 (いこう): Sau đó;降雪 (こうせつ): Tuyết rơi"
        },
        {
          "STT": 339,
          "Kanji": "落",
          "name": "Lạc",
          "Kun": "お",
          "On": "らく",
          "bo_thu": "Thảo (艹)",
          "Example": "落ちる (おちる): Rơi/Rụng;落とす (おとす): Làm rơi;落ち着く (おちつく): Bình tĩnh;落選 (らくせん): Trượt cử;落雷 (らくらい): Sét đánh",
          "JLPT": "N4"
        },
        {
          "STT": 340,
          "Kanji": "迎",
          "name": "Nghênh",
          "Kun": "むか",
          "On": "げい",
          "bo_thu": "Sước (⻌)",
          "Example": "迎える (むかえる): Đón;迎え (むかえ): Việc đi đón;歓迎 (かんげん): Hoan nghênh;送迎 (そうげい): Đưa đón;出迎え (でむかえ): Đi đón",
          "JLPT": "N4"
        },
        {
          "STT": 341,
          "Kanji": "願",
          "name": "Nguyện",
          "Kun": "ねが",
          "On": "がん",
          "bo_thu": "Hiệt (頁)",
          "Example": "願う (ねがう): Cầu mong;お願い (おねがい): Yêu cầu/Làm ơn;願書 (がんしょ): Đơn nhập học;祈願 (きがん): Cầu nguyện;念願 (ねんがん): Tâm nguyện",
          "JLPT": "N4"
        },
        {
          "STT": 342,
          "Kanji": "橋",
          "name": "Kiều",
          "Kun": "はし",
          "On": "きょう",
          "bo_thu": "Mộc (木)",
          "Example": "橋 (はし): Cái cầu;歩道橋 (ほどうきょう): Cầu vượt bộ hành;日本橋 (にほんばし): Cầu Nihonbashi;鉄橋 (てっきょう): Cầu sắt;架け橋 (かけはし): Cây cầu nối/Trung gian",
          "JLPT": "N4"
        },
        {
          "STT": 343,
          "Kanji": "寺",
          "name": "Tự",
          "Kun": "てら",
          "On": "じ",
          "bo_thu": "Thập (十)",
          "Example": "お寺 (おてら): Chùa;寺院 (じいん): Chùa chiền;山寺 (やまでら): Chùa núi;金閣寺 (きんかくじ): Chùa Vàng;東大寺 (とうだいじ): Chùa Todaiji",
          "JLPT": "N4"
        },
        {
          "STT": 344,
          "Kanji": "側",
          "name": "Trắc",
          "Kun": "かわ",
          "On": "そく",
          "bo_thu": "Nhân (人)",
          "Example": "側 (かわ): Phía/Bên;右側 (みぎがわ): Phía bên phải;左側 (ひだりがわ): Phía bên trái;両側 (りょうがわ): Cả hai bên;側面 (そくめん): Mặt bên",
          "JLPT": "N4"
        },
        {
          "STT": 345,
          "Kanji": "島",
          "name": "Đảo",
          "Kun": "しま",
          "On": "とう",
          "bo_thu": "Sơn (山)",
          "Example": "島 (しま): Hòn đảo;半島 (はんとう): Bán đảo;広島 (ひろしま): Hiroshima;島国 (しまぐに): Quốc gia hải đảo;無人島 (むじんとう): Đảo không người",
          "JLPT": "N4"
        },
        {
          "STT": 346,
          "Kanji": "映",
          "name": "Ánh",
          "Kun": "うつ",
          "On": "えい",
          "bo_thu": "Nhật (日)",
          "Example": "映画 (えいが): Phim;映る (うつる): Phản chiếu;上映 (じょうえい): Trình chiếu;映像 (えいぞう): Hình ảnh;映画館 (えいがかん): Rạp phim",
          "JLPT": "N4"
        },
        {
          "STT": 347,
          "Kanji": "画",
          "name": "Họa;Hoạch",
          "Kun": "",
          "On": "が;かく",
          "bo_thu": "Điền (田)",
          "Example": "計画 (けいかく): Kế hoạch;漫画 (まんが): Truyện tranh;画面 (がめん): Màn hình;画数 (かくすう): Số nét vẽ;動画 (どうが): Video",
          "JLPT": "N4"
        },
        {
          "STT": 348,
          "Kanji": "願",
          "name": "Nguyện",
          "Kun": "ねが",
          "On": "がん",
          "bo_thu": "Hiệt (頁)",
          "Example": "願う (ねがう): Cầu nguyện;願書 (がんしょ): Đơn từ;念願 (ねんがん): Nguyện vọng;祈願 (きがん): Cầu khấn;出願 (しゅつがん): Nộp đơn",
          "JLPT": "N4"
        },
        {
          "STT": 349,
          "Kanji": "特",
          "name": "Đặc",
          "Kun": "",
          "On": "とく",
          "bo_thu": "Ngưu (牛)",
          "Example": "特に (とくに): Đặc biệt là;特別 (とくべつ): Đặc biệt;特急 (とっきゅう): Tàu siêu tốc;特長 (とくちょう): Đặc điểm nổi bật;独特 (どくとく): Độc đáo",
          "JLPT": "N4"
        },
        {
          "STT": 350,
          "Kanji": "別",
          "name": "Biệt",
          "Kun": "わか",
          "On": "べつ",
          "bo_thu": "Đao (刂)",
          "Example": "別れる (わかれる): Chia tay;特別 (とくべつ): Đặc biệt;別々に (べつべつに): Riêng biệt;区別 (くべつ): Phân biệt;性別 (せいべつ): Giới tính",
          "JLPT": "N4"
        },
        {
          "STT": 351,
          "Kanji": "私",
          "name": "Tư",
          "Kun": "わたし;わたくし",
          "On": "し",
          "bo_thu": "Hòa (禾)",
          "Example": "私 (わたし): Tôi;私立 (しりつ): Tư lập;私用 (しよう): Việc riêng;私生活 (しせいかつ): Đời tư;無私 (むし): Vô tư",
          "JLPT": "N4"
        },
        {
          "STT": 352,
          "Kanji": "夫",
          "name": "Phu",
          "Kun": "おっと",
          "On": "ふ;ふう",
          "bo_thu": "Đại (大)",
          "Example": "夫 (おっと): Chồng;丈夫 (じょうぶ): Bền/Chắc;夫妻 (ふさい): Vợ chồng;工夫 (くふう): Công phu/Tìm tòi;夫人 (ふじん): Phu nhân",
          "JLPT": "N4"
        },
        {
          "STT": 353,
          "Kanji": "妻",
          "name": "Thê",
          "Kun": "つま",
          "On": "さい",
          "bo_thu": "Nữ (女)",
          "Example": "妻 (つま): Vợ;夫妻 (ふさい): Vợ chồng;愛妻 (あいさい): Vợ yêu;一妻多夫 (いっさいたふ): Một vợ nhiều chồng;妻子 (さいし): Vợ con",
          "JLPT": "N4"
        },
        {
          "STT": 354,
          "Kanji": "暖",
          "name": "Noãn",
          "Kun": "あたた",
          "On": "だん",
          "bo_thu": "Nhật (日)",
          "Example": "暖かい (あたたかい): Ấm áp (thời tiết);暖房 (だんぼう): Máy sưởi;温暖 (おんだん): Ôn hòa;暖冬 (だんとう): Mùa đông ấm;暖流 (だんりゅう): Dòng hải lưu ấm",
          "JLPT": "N4"
        },
        {
          "STT": 355,
          "Kanji": "涼",
          "name": "Lương",
          "Kun": "すず",
          "On": "りょう",
          "bo_thu": "Thủy (氵)",
          "Example": "涼しい (すずしい): Mát mẻ;涼風 (りょうふう): Gió mát;清涼 (せいりょう): Thanh lương/Mát rượi;夕涼み (ゆうすずみ): Hóng mát ban chiều;涼気 (りょうき): Khí mát",
          "JLPT": "N4"
        },
        {
          "STT": 356,
          "Kanji": "静",
          "name": "Tĩnh",
          "Kun": "しず",
          "On": "せい;じょう",
          "bo_thu": "Thanh (青)",
          "Example": "静か (しずか): Yên tĩnh;冷静 (れいせい): Bình tĩnh;静止 (せいし): Tĩnh lặng;静養 (せいよう): Tĩnh dưỡng;安静 (あんせい): An tĩnh/Nghỉ ngơi",
          "JLPT": "N4"
        },
        {
          "STT": 357,
          "Kanji": "忙",
          "name": "Mang",
          "Kun": "いそが",
          "On": "ぼう",
          "bo_thu": "Tâm (忄)",
          "Example": "忙しい (いそがしい): Bận rộn;多忙 (たぼう): Rất bận;多忙期 (たぼうき): Thời kỳ bận rộn;忙中 (ぼうちゅう): Lúc bận;繁忙 (はんぼう): Bận rộn",
          "JLPT": "N4"
        },
        {
          "STT": 358,
          "Kanji": "様",
          "name": "Dạng",
          "Kun": "さま",
          "On": "よう",
          "bo_thu": "Mộc (木)",
          "Example": "様 (さま): Ngài/Bà;様子 (ようす): Tình hình;多様 (たよう): Đa dạng;同様 (どうよう): Giống như;様式 (ようしき): Hình thức/Phong cách",
          "JLPT": "N4"
        },
        {
          "STT": 359,
          "Kanji": "皆",
          "name": "Giai",
          "Kun": "みな",
          "On": "かい",
          "bo_thu": "Bạch (白)",
          "Example": "皆 (みな): Mọi người;皆さん (みなさん): Các bạn;皆勤 (かいきん): Chuyên cần;皆既 (かいき): Toàn phần (nhật thực);皆無 (かいむ): Không có gì",
          "JLPT": "N4"
        },
        {
          "STT": 360,
          "Kanji": "座",
          "name": "Tọa",
          "Kun": "すわ",
          "On": "ざ",
          "bo_thu": "Nghiễm (广)",
          "Example": "座る (すわる): Ngồi;口座 (こうざ): Tài khoản ngân hàng;座席 (ざせき): Chỗ ngồi;星座 (せいざ): Chòm sao;正座 (せいざ): Ngồi kiểu Nhật",
          "JLPT": "N4"
        },
        {
          "STT": 361,
          "Kanji": "辞",
          "name": "Từ",
          "Kun": "や",
          "On": "じ",
          "bo_thu": "Tân (辛)",
          "Example": "辞書 (じしょ): Từ điển;辞める (やめる): Từ bỏ;世辞 (せじ): Nịnh nọt;辞退 (じたい): Từ chối;祝辞 (しゅくじ): Lời chúc",
          "JLPT": "N4"
        },
        {
          "STT": 362,
          "Kanji": "宿",
          "name": "Túc",
          "Kun": "やど",
          "On": "しゅく",
          "bo_thu": "Miên (宀)",
          "Example": "宿題 (しゅくだい): Bài tập về nhà;下宿 (げしゅく): Nhà trọ;宿泊 (しゅくはく): Trọ lại;新宿 (しんじゅく): Shinjuku;宿舎 (しゅくしゃ): Ký túc xá",
          "JLPT": "N4"
        },
        {
          "STT": 363,
          "Kanji": "調",
          "name": "Điều;Điệu",
          "Kun": "しら",
          "On": "ちょう",
          "bo_thu": "Ngôn (言)",
          "Example": "調べる (しらべる): Điều tra;体調 (たいちょう): Tình trạng cơ thể;強調 (きょうちょう): Nhấn mạnh;調査 (ちょうさ): Điều tra;調味料 (ちょうみりょう): Gia vị",
          "JLPT": "N4"
        },
        {
          "STT": 364,
          "Kanji": "査",
          "name": "Tra",
          "Kun": "",
          "On": "さ",
          "bo_thu": "Mộc (木)",
          "Example": "調査 (ちょうさ): Điều tra;検査 (けんさ): Kiểm tra;審査 (しんさ): Thẩm tra;査定 (さてい): Đánh giá;捜査 (そうさ): Điều tra tội phạm",
          "JLPT": "N4"
        },
        {
          "STT": 365,
          "Kanji": "番",
          "name": "Phiên",
          "Kun": "",
          "On": "ばん",
          "bo_thu": "Điền (田)",
          "Example": "一番 (いちばん): Số 1;番号 (ばんごう): Số điện thoại/Số hiệu;交番 (こうばん): Đồn cảnh sát;順番 (じゅんばん): Thứ tự;番組 (ばんぐみ): Chương trình tivi",
          "JLPT": "N4"
        },
        {
          "STT": 366,
          "Kanji": "号",
          "name": "Hiệu",
          "Kun": "",
          "On": "ごう",
          "bo_thu": "Khẩu (口)",
          "Example": "番号 (ばんごう): Số hiệu;信号 (しんごう): Đèn giao thông;記号 (きごう): Ký hiệu;号外 (ごうがい): Bản tin đặc biệt;年号 (ねんごう): Niên hiệu",
          "JLPT": "N4"
        },
        {
          "STT": 367,
          "Kanji": "移",
          "name": "Di",
          "Kun": "うつ",
          "On": "い",
          "bo_thu": "Hòa (禾)",
          "Example": "移る (うつる): Di chuyển;移動 (いどう): Di chuyển;移転 (いてん): Di dời;移民 (いみん): Di dân;移り変わり (うつりかわり): Sự biến đổi",
          "JLPT": "N4"
        },
        {
          "STT": 368,
          "Kanji": "植",
          "name": "Thực",
          "Kun": "う",
          "On": "しょく",
          "bo_thu": "Mộc (木)",
          "Example": "植える (うえる): Trồng cây;植物 (しょくぶつ): Thực vật;植木 (うえき): Cây trồng trong chậu;田植え (たうえ): Trồng lúa;植民地 (しょくみんち): Thuộc địa",
          "JLPT": "N4"
        },
        {
          "STT": 369,
          "Kanji": "慣",
          "name": "Quán",
          "Kun": "な",
          "On": "かん",
          "bo_thu": "Tâm (忄)",
          "Example": "慣れる (なれる): Quen với;習慣 (しゅうかん): Thói quen;見慣れる (みなれる): Nhìn quen mắt;慣用句 (かんようく): Thành ngữ;慣習 (かんしゅう): Tập quán",
          "JLPT": "N4"
        },
        {
          "STT": 370,
          "Kanji": "予",
          "name": "Dự",
          "Kun": "あらかじ",
          "On": "よ",
          "bo_thu": "Mâu (矛)",
          "Example": "予定 (よてい): Dự định;予約 (よやく): Đặt trước;予習 (よしゅう): Chuẩn bị bài;天気予報 (てんきよほう): Dự báo thời tiết;予算 (よさん): Ngân sách",
          "JLPT": "N4"
        },
        {
          "STT": 371,
          "Kanji": "約",
          "name": "Ước",
          "Kun": "",
          "On": "やく",
          "bo_thu": "Mịch (糸)",
          "Example": "予約 (よやく): Đặt trước;約束 (やくそく): Lời hứa;約 (やく): Khoảng chừng;婚約 (こんやく): Đính hôn;条約 (じょうやく): Điều ước",
          "JLPT": "N4"
        },
        {
          "STT": 372,
          "Kanji": "束",
          "name": "Thúc",
          "Kun": "たば",
          "On": "そく",
          "bo_thu": "Mộc (木)",
          "Example": "約束 (やくそく): Lời hứa;花束 (はなたば): Bó hoa;結束 (けっそく): Đoàn kết;束縛 (そくばく): Trói buộc;札束 (さつたば): Xấp tiền",
          "JLPT": "N4"
        },
        {
          "STT": 373,
          "Kanji": "必",
          "name": "Tất",
          "Kun": "かなら",
          "On": "ひつ",
          "bo_thu": "Tâm (心)",
          "Example": "必ず (かならず): Nhất định;必要 (ひつよう): Cần thiết;必死 (ひっし): Quyết tâm/Liều lĩnh;必勝 (ひっしょう): Quyết thắng;必然 (ひつぜん): Tất nhiên",
          "JLPT": "N4"
        },
        {
          "STT": 374,
          "Kanji": "要",
          "name": "Yếu",
          "Kun": "い",
          "On": "よう",
          "bo_thu": "Á (襾)",
          "Example": "必要 (ひつよう): Cần thiết;重要 (じゅうよう): Quan trọng;要点 (ようてん): Điểm chính;主要 (しゅよう): Chủ yếu;要る (いる): Cần",
          "JLPT": "N4"
        },
        {
          "STT": 375,
          "Kanji": "合",
          "name": "Hợp",
          "Kun": "あ",
          "On": "ごう;がっ;かっ",
          "bo_thu": "Khẩu (口)",
          "Example": "合う (あう): Hợp;間に合う (まにあう): Kịp lúc;試合 (しあい): Trận đấu;合計 (ごうけい): Tổng cộng;合格 (ごうかく): Thi đỗ",
          "JLPT": "N4"
        },
        {
          "STT": 376,
          "Kanji": "格",
          "name": "Cách",
          "Kun": "",
          "On": "かく;こう",
          "bo_thu": "Mộc (木)",
          "Example": "合格 (ごうかく): Thi đỗ;性格 (せいかく): Tính cách;価格 (かかく): Giá cả;資格 (しかく): Bằng cấp/Tư cách;格好 (かっこう): Ngoại hình",
          "JLPT": "N4"
        },
        {
          "STT": 377,
          "Kanji": "練",
          "name": "Luyện",
          "Kun": "ね",
          "On": "れん",
          "bo_thu": "Mịch (糸)",
          "Example": "練習 (れんしゅう): Luyện tập;訓練 (くんれん): Huấn luyện;洗練 (せんれん): Tinh tế;練達 (れんたつ): Thành thạo;熟練 (じゅくれん): Lành nghề",
          "JLPT": "N4"
        },
        {
          "STT": 378,
          "Kanji": "習",
          "name": "Tập",
          "Kun": "なら",
          "On": "しゅう",
          "bo_thu": "Vũ (羽)",
          "Example": "習う (ならう): Học;練習 (れんしゅう): Luyện tập;復習 (ふくしゅう): Ôn tập;予習 (よしゅう): Chuẩn bị bài;習字 (しゅうじ): Luyện chữ",
          "JLPT": "N4"
        },
        {
          "STT": 379,
          "Kanji": "勉",
          "name": "Miễn",
          "Kun": "つと",
          "On": "べん",
          "bo_thu": "Lực (力)",
          "Example": "勉強 (べんきょう): Học tập;勤勉 (きんべん): Cần cù;勉める (つとめる): Nỗ lực;勉学 (べんがく): Việc học;ガリ勉 (がりべん): Mọt sách",
          "JLPT": "N4"
        },
        {
          "STT": 380,
          "Kanji": "強",
          "name": "Cường;Cưỡng",
          "Kun": "つよ;し",
          "On": "きょう;ごう",
          "bo_thu": "Cung (弓)",
          "Example": "強い (つよい): Mạnh;勉強 (べんきょう): Học tập;強盗 (ごうとう): Tên cướp;強調 (きょうちょう): Nhấn mạnh;強引 (ごういん): Cưỡng ép",
          "JLPT": "N4"
        },
        {
          "STT": 381,
          "Kanji": "研",
          "name": "Nghiên",
          "Kun": "と",
          "On": "けん",
          "bo_thu": "Thạch (石)",
          "Example": "研究 (けんきゅう): Nghiên cứu;研修 (けんしゅう): Tu nghiệp;研ぐ (とぐ): Mài/Vo gạo;研究者 (けんきゅうしゃ): Nhà nghiên cứu;研磨 (けんま): Mài giũa",
          "JLPT": "N4"
        },
        {
          "STT": 382,
          "Kanji": "究",
          "name": "Cứu",
          "Kun": "きわ",
          "On": "きゅう",
          "bo_thu": "Huyệt (穴)",
          "Example": "研究 (けんきゅう): Nghiên cứu;探究 (たんきゅう): Thăm dò;究める (きわめる): Tìm hiểu sâu;学究 (がっきゅう): Nghiên cứu học vấn;究極 (きゅうきょく): Cuối cùng/Cùng cực",
          "JLPT": "N4"
        },
        {
          "STT": 383,
          "Kanji": "留",
          "name": "Lưu",
          "Kun": "と",
          "On": "りゅう;る",
          "bo_thu": "Điền (田)",
          "Example": "留学生 (りゅうがくせい): Du học sinh;留まる (とまる): Dừng lại;留学 (りゅうがく): Du học;留守 (るす): Vắng nhà;停留所 (ていりゅうじょ): Trạm dừng xe buýt",
          "JLPT": "N4"
        },
        {
          "STT": 384,
          "Kanji": "質",
          "name": "Chất",
          "Kun": "",
          "On": "しつ;しち;ち",
          "bo_thu": "Bối (貝)",
          "Example": "質問 (しつもん): Câu hỏi;品質 (ひんしつ): Chất lượng;性質 (せいしつ): Tính chất;質屋 (しちや): Tiệm cầm đồ;物質 (ぶっしつ): Vật chất",
          "JLPT": "N4"
        },
        {
          "STT": 385,
          "Kanji": "問",
          "name": "Vấn",
          "Kun": "と",
          "On": "もん",
          "bo_thu": "Môn (門)",
          "Example": "質問 (しつもん): Câu hỏi;問題 (もんだい): Vấn đề;学問 (がっきもん): Học vấn;訪問 (ほうもん): Ghé thăm;問い合わせ (といあわせ): Liên hệ/Hỏi",
          "JLPT": "N4"
        },
        {
          "STT": 386,
          "Kanji": "題",
          "name": "Đề",
          "Kun": "",
          "On": "だい",
          "bo_thu": "Hiệt (頁)",
          "Example": "問題 (もんだい): Vấn đề;宿題 (しゅくだい): Bài tập về nhà;話題 (わだい): Đề tài;題名 (だいめい): Nhan đề;主題 (しゅだい): Chủ đề",
          "JLPT": "N4"
        },
        {
          "STT": 387,
          "Kanji": "答",
          "name": "Đáp",
          "Kun": "こた",
          "On": "とう",
          "bo_thu": "Trúc (竹)",
          "Example": "答える (こたえる): Trả lời;答え (こたえ): Câu trả lời;回答 (かいとう): Giải đáp;問答 (もんどう): Hỏi đáp;返答 (へんとう): Hồi đáp",
          "JLPT": "N4"
        },
        {
          "STT": 388,
          "Kanji": "宿",
          "name": "Túc",
          "Kun": "やど",
          "On": "しゅく",
          "bo_thu": "Miên (宀)",
          "Example": "宿題 (しゅくだい): Bài tập về nhà;下宿 (げしゅく): Nhà trọ;宿泊 (しゅくはく): Trọ lại;宿舎 (しゅくしゃ): Ký túc xá;宿命 (しゅくめい): Định mệnh",
          "JLPT": "N4"
        },
        {
          "STT": 389,
          "Kanji": "政",
          "name": "Chính",
          "Kun": "まつりごと",
          "On": "せい;しょう",
          "bo_thu": "Phu (攵)",
          "Example": "政治 (せいじ): Chính trị;政府 (せいふ): Chính phủ;行政 (ぎょうせい): Hành chính;政策 (せいさく): Chính sách;摂政 (せっしょう): Nhiếp chính",
          "JLPT": "N4"
        },
        {
          "STT": 390,
          "Kanji": "治",
          "name": "Trị",
          "Kun": "なお;おさ",
          "On": "じ;ち",
          "bo_thu": "Thủy (氵)",
          "Example": "政治 (せいじ): Chính trị;治る (なおる): Hồi phục;治める (おさめる): Cai trị;治療 (ちりょう): Trị liệu;自治 (じち): Tự trị",
          "JLPT": "N4"
        },
        {
          "STT": 391,
          "Kanji": "経",
          "name": "Kinh",
          "Kun": "へ",
          "On": "けい;きょう",
          "bo_thu": "Mịch (糸)",
          "Example": "経済 (けいざい): Kinh tế;経験 (けいけん): Kinh nghiệm;経理 (けいり): Kế toán;経由 (けいゆ): Thông qua;お経 (おきょう): Kinh Phật",
          "JLPT": "N4"
        },
        {
          "STT": 392,
          "Kanji": "済",
          "name": "Tế",
          "Kun": "す",
          "On": "さい;ざい",
          "bo_thu": "Thủy (氵)",
          "Example": "経済 (けいざい): Kinh tế;済む (すむ): Xong xuôi;返済 (へんさい): Hoàn trả;決済 (けっさい): Quyết toán;共済 (きょうさい): Trợ giúp lẫn nhau",
          "JLPT": "N4"
        },
        {
          "STT": 393,
          "Kanji": "険",
          "name": "Hiểm",
          "Kun": "けわ",
          "On": "けん",
          "bo_thu": "Phụ (⻖)",
          "Example": "危険 (きけん): Nguy hiểm;保険 (ほけん): Bảo hiểm;冒険 (ぼうけん): Phiêu lưu;険しい (けわしい): Hiểm trở;探険 (たんけん): Thám hiểm",
          "JLPT": "N4"
        },
        {
          "STT": 394,
          "Kanji": "危",
          "name": "Nguy",
          "Kun": "あぶ;あや",
          "On": "き",
          "bo_thu": "Nguy (卩)",
          "Example": "危険 (きけん): Nguy hiểm;危ない (あぶない): Nguy hiểm;危うい (あやうい): Nguy kịch;危機 (きき): Khủng hoảng;危惧 (きぐ): Sợ hãi",
          "JLPT": "N4"
        },
        {
          "STT": 395,
          "Kanji": "険",
          "name": "Hiểm",
          "Kun": "けわ",
          "On": "けん",
          "bo_thu": "Phụ (⻖)",
          "Example": "危険 (きけん): Nguy hiểm;保険 (ほけん): Bảo hiểm;冒険 (ぼうけん): Phiêu lưu;険しい (けわしい): Hiểm trở;探険 (たんけん): Thám hiểm",
          "JLPT": "N4"
        },
        {
          "STT": 396,
          "Kanji": "険",
          "name": "Hiểm",
          "Kun": "けわ",
          "On": "けん",
          "bo_thu": "Phụ (⻖)",
          "Example": "危険 (きけん): Nguy hiểm;保険 (ほけん): Bảo hiểm;冒険 (ぼうけん): Phiêu lưu;険しい (けわしい): Hiểm trở;探険 (たんけん): Thám hiểm",
          "JLPT": "N4"
        },
        {
          "STT": 397,
          "Kanji": "官",
          "name": "Quan",
          "Kun": "",
          "On": "かん",
          "bo_thu": "Miên (宀)",
          "Example": "警官 (けいかん): Cảnh sát;官僚 (かんりょう): Quan liêu;官庁 (かんちょう): Cơ quan chính phủ;外交官 (がいこうかん): Nhà ngoại giao;官能 (かんのう): Quan năng",
          "JLPT": "N4"
        },
        {
          "STT": 398,
          "Kanji": "署",
          "name": "Thự",
          "Kun": "",
          "On": "しょ",
          "bo_thu": "Võng (罒)",
          "Example": "警察署 (けいさつしょ): Đồn cảnh sát;署名 (しょめい): Ký tên;部署 (ぶしょ): Bộ phận;消防署 (しょうぼうしょ): Trạm cứu hỏa;税務署 (ぜいむしょ): Cục thuế",
          "JLPT": "N4"
        },
        {
          "STT": 399,
          "Kanji": "警",
          "name": "Cảnh",
          "Kun": "いまし",
          "On": "けい",
          "bo_thu": "Ngôn (言)",
          "Example": "警察 (けいさつ): Cảnh sát;警官 (けいかん): Cảnh sát;警告 (けいこく): Cảnh báo;警備 (けいび): Bảo vệ;警戒 (けいかい): Cảnh giác",
          "JLPT": "N4"
        },
        {
          "STT": 400,
          "Kanji": "察",
          "name": "Sát",
          "Kun": "",
          "On": "さつ",
          "bo_thu": "Miên (宀)",
          "Example": "警察 (けいさつ): Cảnh sát;観察 (かんさつ): Quan sát;察する (さっする): Cảm thấy/Đoán;考察 (こうさつ): Khảo sát;視察 (しさつ): Thị sát",
          "JLPT": "N4"
        },
        {
          "STT": 401,
          "Kanji": "指",
          "name": "Chỉ",
          "Kun": "ゆび;さ",
          "On": "し",
          "bo_thu": "Thủ (扌)",
          "Example": "指 (ゆび): Ngón tay;指す (さす): Chỉ;指定 (してい): Chỉ định;指輪 (ゆびわ): Nhẫn;指導 (しどう): Chỉ đạo",
          "JLPT": "N4"
        },
        {
          "STT": 402,
          "Kanji": "定",
          "name": "Định",
          "Kun": "さだ",
          "On": "てい;じょう",
          "bo_thu": "Miên (宀)",
          "Example": "予定 (よてい): Dự định;決定 (けってい): Quyết định;定食 (ていしょく): Suất ăn cố định;定員 (ていいん): Sức chứa người;定休日 (ていきゅうび): Ngày nghỉ định kỳ",
          "JLPT": "N4"
        },
        {
          "STT": 403,
          "Kanji": "席",
          "name": "Tịch",
          "Kun": "",
          "On": "せき",
          "bo_thu": "Nghiễm (广)",
          "Example": "席 (せき): Chỗ ngồi;出席 (しゅっせき): Có mặt;欠席 (けっせき): Vắng mặt;座席 (ざせき): Ghế ngồi;指定席 (していせき): Ghế chỉ định",
          "JLPT": "N4"
        },
        {
          "STT": 404,
          "Kanji": "由",
          "name": "Do",
          "Kun": "よし",
          "On": "ゆう;ゆ",
          "bo_thu": "Điền (田)",
          "Example": "自由 (じゆう): Tự do;理由 (りゆう): Lý do;経由 (けいゆ): Thông qua;不自由 (ふじゆう): Tàn tật/Bất tiện;由緒 (ゆいしょ): Phả hệ/Dòng dõi",
          "JLPT": "N4"
        },
        {
          "STT": 405,
          "Kanji": "番",
          "name": "Phiên",
          "Kun": "",
          "On": "ばん",
          "bo_thu": "Điền (田)",
          "Example": "一番 (いちばん): Số 1;番号 (ばんごう): Số hiệu;交番 (こうばん): Đồn cảnh sát;番組 (ばんぐみ): Chương trình;順番 (じゅんばん): Thứ tự",
          "JLPT": "N4"
        },
        {
          "STT": 406,
          "Kanji": "窓",
          "name": "Song",
          "Kun": "まど",
          "On": "そう",
          "bo_thu": "Huyệt (穴)",
          "Example": "窓 (まど): Cửa sổ;窓口 (まどぐち): Cửa bán vé;同窓会 (どうそうかい): Họp lớp;窓側 (まどぎわ): Phía cửa sổ;車窓 (しゃそう): Cửa sổ xe",
          "JLPT": "N4"
        },
        {
          "STT": 407,
          "Kanji": "側",
          "name": "Trắc",
          "Kun": "かわ",
          "On": "そく",
          "bo_thu": "Nhân (人)",
          "Example": "側 (かわ): Phía/Bên;右側 (みぎがわ): Bên phải;左側 (ひだりがわ): Bên trái;両側 (りょうがわ): Cả hai bên;側面 (そくめん): Mặt bên",
          "JLPT": "N4"
        },
        {
          "STT": 408,
          "Kanji": "路",
          "name": "Lộ",
          "Kun": "じ",
          "On": "ろ",
          "bo_thu": "Túc (⻊)",
          "Example": "道路 (どうろ): Đường lộ;通路 (つうろ): Lối đi;線路 (せんろ): Đường ray;迷路 (めいろ): Mê cung;路面 (ろめん): Mặt đường",
          "JLPT": "N4"
        },
        {
          "STT": 409,
          "Kanji": "線",
          "name": "Tuyến",
          "Kun": "",
          "On": "せん",
          "bo_thu": "Mịch (糸)",
          "Example": "下線 (かせん): Gạch chân;直線 (ちょくせん): Đường thẳng;線路 (せんろ): Đường ray;新幹線 (しんかんせん): Tàu Shinkansen;線 (せん): Đường kẻ",
          "JLPT": "N4"
        },
        {
          "STT": 410,
          "Kanji": "刻",
          "name": "Khắc",
          "Kun": "きざ",
          "On": "こく",
          "bo_thu": "Đao (刂)",
          "Example": "時刻 (じこく): Thời điểm;刻む (きざむ): Thái/Điêu khắc;遅刻 (ちこく): Muộn;深刻 (しんこく): Nghiêm trọng;定刻 (ていこく): Giờ quy định",
          "JLPT": "N4"
        },
        {
          "STT": 411,
          "Kanji": "普",
          "name": "Phổ",
          "Kun": "",
          "On": "ふ",
          "bo_thu": "Nhật (日)",
          "Example": "普通 (ふつう): Thông thường;普及 (ふきゅう): Phổ cập;普通列車 (ふつうれっしゃ): Tàu thường;普遍 (ふへん): Phổ biến;普段 (ふだん): Thường ngày",
          "JLPT": "N4"
        },
        {
          "STT": 412,
          "Kanji": "各",
          "name": "Các",
          "Kun": "おのおの",
          "On": "かく",
          "bo_thu": "Khẩu (口)",
          "Example": "各駅 (かくえき): Mỗi ga;各国 (かっこく): Các nước;各自 (かくじ): Mỗi người;各々 (おのおの): Từng cái một;各種 (かくしゅ): Các loại",
          "JLPT": "N4"
        },
        {
          "STT": 413,
          "Kanji": "次",
          "name": "Thứ",
          "Kun": "つぎ;つ",
          "On": "じ;し",
          "bo_thu": "Khiếm (欠)",
          "Example": "次 (つぎ): Tiếp theo;次に (つぎに): Tiếp đến;目次 (もくじ): Mục lục;次第 (しだい): Dần dần;次回 (じかい): Lần tới",
          "JLPT": "N4"
        },
        {
          "STT": 414,
          "Kanji": "快",
          "name": "Khoái",
          "Kun": "こころよ",
          "On": "かい",
          "bo_thu": "Tâm (忄)",
          "Example": "快い (こころよい): Dễ chịu;快速 (かいそく): Tốc độ cao;快適 (かいてき): Sảng khoái;快晴 (かいせい): Trời nắng đẹp;快挙 (かいきょ): Thành tích rực rỡ",
          "JLPT": "N4"
        },
        {
          "STT": 415,
          "Kanji": "速",
          "name": "Tốc",
          "Kun": "はや",
          "On": "そく",
          "bo_thu": "Sước (⻌)",
          "Example": "速い (はやい): Nhanh;速度 (そくど): Tốc độ;高速 (こうそく): Cao tốc;快速 (かいそく): Tàu nhanh;速達 (そくたつ): Chuyển phát nhanh",
          "JLPT": "N4"
        },
        {
          "STT": 416,
          "Kanji": "過",
          "name": "Quá",
          "Kun": "す",
          "On": "か",
          "bo_thu": "Sước (⻌)",
          "Example": "過ぎる (すぎる): Quá;過ごす (すごす): Trải qua;過去 (かこ): Quá khứ;通過 (つうか): Thông qua;過失 (かしつ): Sai lầm",
          "JLPT": "N4"
        },
        {
          "STT": 417,
          "Kanji": "鉄",
          "name": "Thiết",
          "Kun": "",
          "On": "てつ",
          "bo_thu": "Kim (金)",
          "Example": "地下鉄 (ちかてつ): Tàu điện ngầm;鉄道 (てつどう): Đường sắt;鉄 (てつ): Sắt;私鉄 (してつ): Đường sắt tư nhân;鉄橋 (てっきょう): Cầu sắt",
          "JLPT": "N4"
        },
        {
          "STT": 418,
          "Kanji": "乗",
          "name": "Thừa",
          "Kun": "の",
          "On": "じょう",
          "bo_thu": "Nhất (一)",
          "Example": "乗る (のる): Lên xe;乗り物 (のりもの): Phương tiện;乗客 (じょうきゃく): Hành khách;乗車 (じょうしゃ): Lên tàu xe;乗馬 (じょうば): Cưỡi ngựa",
          "JLPT": "N4"
        },
        {
          "STT": 419,
          "Kanji": "降",
          "name": "Giáng;Hàng",
          "Kun": "お;ふ",
          "On": "こう;ご",
          "bo_thu": "Phụ (⻖)",
          "Example": "降りる (おりる): Xuống xe;降る (ふる): Rơi (mưa);降車 (こうしゃ): Xuống xe;以降 (いこう): Sau đó;降雪 (こうせつ): Tuyết rơi",
          "JLPT": "N4"
        },
        {
          "STT": 420,
          "Kanji": "座",
          "name": "Tọa",
          "Kun": "すわ",
          "On": "ざ",
          "bo_thu": "Nghiễm (广)",
          "Example": "座る (すわる): Ngồi;座席 (ざせき): Chỗ ngồi;口座 (こうざ): Tài khoản;正座 (せいざ): Ngồi kiểu Nhật;星座 (せいざ): Chòm sao",
          "JLPT": "N4"
        }
      ];