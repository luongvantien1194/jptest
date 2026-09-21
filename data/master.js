// Master danh mục "Từ loại" (category) dùng chung cho toàn bộ dữ liệu từ vựng
// (data/vocabData.js, data/vocabData_1.js, data/vocabExtra/extra.js, addVocab/index.html, ...).
//
// Từ nay field "category" trong data CHỈ lưu số id ở master này (hoặc "" nếu chưa xác định
// loại từ) — không lưu tự do bằng chữ nữa, để tránh mỗi nơi ghi một kiểu ("noun" / "danh từ" /
// "Danh từ" / "名詞" ...) như trước.
(function (root) {
  "use strict";

  var VOCAB_CATEGORY_MASTER = [
    { id: 1, label: "Danh từ", aliases: ["danh từ", "noun", "名詞"] },
    { id: 2, label: "Động từ", aliases: ["động từ", "verb"] },
    { id: 3, label: "Trợ từ", aliases: ["trợ từ", "particle"] },
    { id: 4, label: "Tính từ đuôi い", aliases: ["tính từ đuôi い", "tính từ -i", "tính từ i", "adjective i", "i-adjective"] },
    { id: 5, label: "Tính từ đuôi な", aliases: ["tính từ đuôi な", "tính từ na", "adjective na", "na-adjective"] },
    { id: 6, label: "Phó từ", aliases: ["phó từ", "adverb"] },
    { id: 7, label: "Thán từ", aliases: ["thán từ", "interjection", "cảm thán"] },
    { id: 8, label: "Liên từ", aliases: ["liên từ", "conjunction", "conjunctions"] },
    { id: 9, label: "Đại từ", aliases: ["đại từ", "pronoun"] },
    { id: 10, label: "Cụm từ/Thành ngữ", aliases: ["cụm từ/thành ngữ", "cụm từ", "thành ngữ", "phrase", "idiom"] }
  ];

  function findById(id) {
    var num = Number(id);
    for (var i = 0; i < VOCAB_CATEGORY_MASTER.length; i++) {
      if (VOCAB_CATEGORY_MASTER[i].id === num) {
        return VOCAB_CATEGORY_MASTER[i];
      }
    }
    return null;
  }

  // id (số) -> nhãn hiển thị tiếng Việt. Trả về "" nếu chưa chọn / không xác định.
  function getVocabCategoryLabel(id) {
    if (id === "" || id == null) {
      return "";
    }
    var found = findById(id);
    return found ? found.label : String(id);
  }

  // Quy 1 giá trị category "tự do" (chữ, có thể là tiếng Việt/tiếng Anh/tiếng Nhật, hoa/thường
  // khác nhau) về đúng id trong master. Trả về "" nếu không nhận diện được.
  // Dùng khi chuẩn hoá data cũ hoặc parse category do người dùng/AI nhập tự do.
  function resolveVocabCategoryId(raw) {
    if (raw == null) {
      return "";
    }
    if (typeof raw === "number") {
      return findById(raw) ? raw : "";
    }
    var s = String(raw).trim();
    if (s === "") {
      return "";
    }
    if (/^\d+$/.test(s)) {
      var n = Number(s);
      return findById(n) ? n : "";
    }
    var norm = s.toLowerCase();
    for (var i = 0; i < VOCAB_CATEGORY_MASTER.length; i++) {
      if (VOCAB_CATEGORY_MASTER[i].aliases.indexOf(norm) !== -1) {
        return VOCAB_CATEGORY_MASTER[i].id;
      }
    }
    return "";
  }

  root.VOCAB_CATEGORY_MASTER = VOCAB_CATEGORY_MASTER;
  root.getVocabCategoryLabel = getVocabCategoryLabel;
  root.resolveVocabCategoryId = resolveVocabCategoryId;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      VOCAB_CATEGORY_MASTER: VOCAB_CATEGORY_MASTER,
      getVocabCategoryLabel: getVocabCategoryLabel,
      resolveVocabCategoryId: resolveVocabCategoryId
    };
  }
})(typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : this));
