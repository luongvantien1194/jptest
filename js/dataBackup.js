/**
 * Sao lưu / khôi phục dữ liệu học lưu trong localStorage (đã thuộc, điểm test, yêu thích,
 * từ ẩn, cài đặt hiển thị, bộ lọc, từ vựng/kanji thêm tay, dữ liệu sửa từ vựng...)
 * để mang sang trình duyệt / máy khác.
 *
 * Xuất: tải file JSON chứa nguyên chuỗi raw của từng key.
 * Nhập: thay thế dữ liệu app hiện có bằng dữ liệu trong file (riêng các key trong KEY_MERGE
 * như "đã thuộc" thì gộp local ∪ file), rồi tải lại trang.
 */
(function () {
  "use strict";

  var BACKUP_APP_ID = "jp-study-app";
  var BACKUP_VERSION = 1;

  /** Các key của app: theo tiền tố hoặc tên chính xác */
  var KEY_PREFIXES = ["jp_", "searchKanji_"];
  var KEY_EXACT = ["vocab_extra_list", "kanji_extra_list"];
  /** Cờ debug, không mang theo */
  var KEY_EXCLUDE = ["jp_pip_debug"];
  /** Các key dạng object được GỘP (local ∪ file) khi nhập thay vì thay thế */
  var KEY_MERGE = ["jp_vocab_mastered"];

  function isAppKey(key) {
    if (!key || KEY_EXCLUDE.indexOf(key) !== -1) return false;
    if (KEY_EXACT.indexOf(key) !== -1) return true;
    for (var i = 0; i < KEY_PREFIXES.length; i++) {
      if (key.indexOf(KEY_PREFIXES[i]) === 0) return true;
    }
    return false;
  }

  function collectAppData() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (isAppKey(key)) data[key] = localStorage.getItem(key);
    }
    return data;
  }

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function backupFileName() {
    var d = new Date();
    return "jp-study-backup-" + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) +
      "-" + pad2(d.getHours()) + pad2(d.getMinutes()) + ".json";
  }

  function downloadTextFile(filename, content, mime) {
    var blob = new Blob([content], { type: mime || "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function countEntries(raw) {
    try {
      var v = JSON.parse(raw);
      if (Array.isArray(v)) return v.length;
      if (v && typeof v === "object") return Object.keys(v).length;
    } catch (e) { }
    return null;
  }

  /** Tóm tắt vài nhóm dữ liệu chính để người dùng kiểm tra trước khi xuất/nhập */
  function describeData(data, skipKeys) {
    var labels = [
      ["jp_vocab_mastered", "Từ vựng đã thuộc"],
      ["jp_vocab_mastery", "Điểm test từ vựng"],
      ["jp_kanji_mastery", "Điểm test kanji"],
      ["jp_vocab_favorites", "Từ vựng yêu thích"],
      ["jp_kanji_favorites", "Kanji yêu thích"],
      ["jp_kanji_vocab_favorites", "Từ vựng kanji yêu thích"],
      ["jp_vocab_hidden_words", "Tuỳ chỉnh ẩn từ trùng"],
      ["vocab_extra_list", "Từ vựng thêm tay"],
      ["kanji_extra_list", "Kanji thêm tay"]
    ];
    var lines = [];
    labels.forEach(function (pair) {
      if (!Object.prototype.hasOwnProperty.call(data, pair[0])) return;
      if (skipKeys && skipKeys.indexOf(pair[0]) !== -1) return;
      var n = countEntries(data[pair[0]]);
      lines.push("• " + pair[1] + (n == null ? "" : ": " + n));
    });
    return lines.join("\n");
  }

  function exportBackup() {
    var data;
    try {
      data = collectAppData();
    } catch (e) {
      alert("Không đọc được dữ liệu local: " + (e && e.message ? e.message : e));
      return;
    }
    var keys = Object.keys(data);
    if (!keys.length) {
      alert("Chưa có dữ liệu học nào được lưu trên trình duyệt này.");
      return;
    }
    var payload = {
      app: BACKUP_APP_ID,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data: data
    };
    downloadTextFile(backupFileName(), JSON.stringify(payload), "application/json;charset=utf-8");
  }

  /** Trả về object data hợp lệ, hoặc ném lỗi với thông báo dễ hiểu */
  function parseBackup(text) {
    var payload;
    try {
      payload = JSON.parse(text);
    } catch (e) {
      throw new Error("File không phải JSON hợp lệ.");
    }
    if (!payload || payload.app !== BACKUP_APP_ID || !payload.data || typeof payload.data !== "object") {
      throw new Error("File không phải bản sao lưu của app này.");
    }
    if (typeof payload.version !== "number" || payload.version > BACKUP_VERSION) {
      throw new Error("Bản sao lưu được tạo từ phiên bản app mới hơn, không thể nhập.");
    }
    var data = {};
    Object.keys(payload.data).forEach(function (key) {
      var val = payload.data[key];
      if (isAppKey(key) && typeof val === "string") data[key] = val;
    });
    if (!Object.keys(data).length) {
      throw new Error("File sao lưu không chứa dữ liệu nào.");
    }
    return { data: data, exportedAt: payload.exportedAt };
  }

  function parseObject(raw) {
    try {
      var v = JSON.parse(raw);
      if (v && typeof v === "object" && !Array.isArray(v)) return v;
    } catch (e) { }
    return null;
  }

  /**
   * Gộp các key trong KEY_MERGE giữa local hiện tại và file (local ∪ file) vào bản sao của data.
   * Trả về { data, stats: [{ key, local, file, merged }] } để hiển thị khi xác nhận.
   */
  function mergeWithLocal(data) {
    var result = Object.assign({}, data);
    var stats = [];
    KEY_MERGE.forEach(function (key) {
      var local = parseObject(localStorage.getItem(key));
      var fromFile = Object.prototype.hasOwnProperty.call(data, key) ? parseObject(data[key]) : null;
      if (!local && !fromFile) return;
      var merged = Object.assign({}, local || {}, fromFile || {});
      result[key] = JSON.stringify(merged);
      stats.push({
        key: key,
        local: local ? Object.keys(local).length : 0,
        file: fromFile ? Object.keys(fromFile).length : 0,
        merged: Object.keys(merged).length
      });
    });
    return { data: result, stats: stats };
  }

  /** Thay toàn bộ key của app bằng dữ liệu mới; nếu lỗi (vd. hết dung lượng) thì khôi phục lại như cũ */
  function replaceAppData(data) {
    var previous = collectAppData();
    function writeAll(src) {
      Object.keys(collectAppData()).forEach(function (key) { localStorage.removeItem(key); });
      Object.keys(src).forEach(function (key) { localStorage.setItem(key, src[key]); });
    }
    try {
      writeAll(data);
    } catch (e) {
      try { writeAll(previous); } catch (e2) { }
      throw e;
    }
  }

  function formatDateTime(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear() +
      " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }

  function importBackupText(text) {
    var parsed;
    try {
      parsed = parseBackup(text);
    } catch (e) {
      alert("Không nhập được: " + e.message);
      return;
    }
    var when = formatDateTime(parsed.exportedAt);
    var merge;
    try {
      merge = mergeWithLocal(parsed.data);
    } catch (e) {
      alert("Không đọc được dữ liệu local: " + (e && e.message ? e.message : e));
      return;
    }
    var summary = describeData(parsed.data, KEY_MERGE);
    var mergeLines = merge.stats.map(function (s) {
      return "• Từ vựng đã thuộc: " + s.local + " (máy này) + " + s.file + " (file) → " + s.merged + " sau khi gộp";
    });
    var ok = window.confirm(
      "Nhập dữ liệu học từ file sao lưu" + (when ? " (tạo lúc " + when + ")" : "") + "?\n\n" +
      (mergeLines.length ? "GỘP với dữ liệu hiện có:\n" + mergeLines.join("\n") + "\n\n" : "") +
      (summary ? "THAY THẾ dữ liệu hiện có:\n" + summary + "\n\n" : "") +
      "Các dữ liệu học khác (điểm test, yêu thích, cài đặt...) trên trình duyệt này sẽ bị thay thế bằng dữ liệu trong file. " +
      "Nên xuất bản sao lưu dữ liệu hiện tại trước nếu cần giữ lại."
    );
    if (!ok) return;
    try {
      replaceAppData(merge.data);
    } catch (e) {
      alert("Nhập thất bại, dữ liệu cũ được giữ nguyên.\n" + (e && e.message ? e.message : e));
      return;
    }
    alert("Đã nhập dữ liệu thành công. Trang sẽ tải lại.");
    window.location.reload();
  }

  function closeNavMenu() {
    var popup = document.getElementById("nav-menu-popup");
    if (popup) popup.classList.remove("nav-menu-popup--open");
    document.querySelectorAll(".nav-menu-btn").forEach(function (b) { b.textContent = "☰"; });
  }

  function init() {
    var exportBtn = document.getElementById("nav-menu-export");
    var importBtn = document.getElementById("nav-menu-import");
    var fileInput = document.getElementById("backup-import-input");
    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        closeNavMenu();
        exportBackup();
      });
    }
    if (importBtn && fileInput) {
      importBtn.addEventListener("click", function () {
        closeNavMenu();
        fileInput.value = "";
        fileInput.click();
      });
      fileInput.addEventListener("change", function () {
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () { importBackupText(String(reader.result || "")); };
        reader.onerror = function () { alert("Không đọc được file."); };
        reader.readAsText(file, "utf-8");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
