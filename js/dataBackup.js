/**
 * Sao lưu / khôi phục dữ liệu học lưu trong localStorage (đã thuộc, điểm test, yêu thích,
 * từ ẩn, cài đặt hiển thị, bộ lọc, từ vựng/kanji thêm tay, dữ liệu sửa từ vựng...)
 * để mang sang trình duyệt / máy khác.
 *
 * Xuất: copy vào clipboard hoặc tải file JSON chứa nguyên chuỗi raw của từng key.
 * Nhập (chọn file hoặc dán chuỗi đã copy): thay thế dữ liệu app hiện có bằng bản sao lưu
 * (riêng các key trong KEY_MERGE như "đã thuộc" thì gộp local ∪ bản sao lưu), rồi tải lại trang.
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

  function copyToClipboard(text, cb) {
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        cb(!!ok);
      } catch (e) {
        cb(false);
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { cb(true); }).catch(fallback);
    } else {
      fallback();
    }
  }

  /** Chuỗi JSON sao lưu dữ liệu hiện tại (dùng chung cho copy và tải file) */
  function buildBackupText(data) {
    return JSON.stringify({
      app: BACKUP_APP_ID,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data: data
    });
  }

  function formatSize(bytes) {
    return bytes < 1024 ? bytes + " B" : (bytes / 1024).toFixed(bytes < 10240 ? 1 : 0) + " KB";
  }

  /** Trả về object data hợp lệ, hoặc ném lỗi với thông báo dễ hiểu */
  function parseBackup(text) {
    var payload;
    try {
      payload = JSON.parse(text);
    } catch (e) {
      throw new Error("Dữ liệu không phải JSON hợp lệ.");
    }
    if (!payload || payload.app !== BACKUP_APP_ID || !payload.data || typeof payload.data !== "object") {
      throw new Error("Dữ liệu không phải bản sao lưu của app này.");
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
      throw new Error("Bản sao lưu không chứa dữ liệu nào.");
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
      setStatus("Không nhập được: " + e.message, "error");
      return;
    }
    var when = formatDateTime(parsed.exportedAt);
    var merge;
    try {
      merge = mergeWithLocal(parsed.data);
    } catch (e) {
      setStatus("Không đọc được dữ liệu local: " + (e && e.message ? e.message : e), "error");
      return;
    }
    var summary = describeData(parsed.data, KEY_MERGE);
    var mergeLines = merge.stats.map(function (s) {
      return "• Từ vựng đã thuộc: " + s.local + " (máy này) + " + s.file + " (bản sao lưu) → " + s.merged + " sau khi gộp";
    });
    var ok = window.confirm(
      "Nhập dữ liệu học từ bản sao lưu" + (when ? " (tạo lúc " + when + ")" : "") + "?\n\n" +
      (mergeLines.length ? "GỘP với dữ liệu hiện có:\n" + mergeLines.join("\n") + "\n\n" : "") +
      (summary ? "THAY THẾ dữ liệu hiện có:\n" + summary + "\n\n" : "") +
      "Các dữ liệu học khác (điểm test, yêu thích, cài đặt...) trên trình duyệt này sẽ bị thay thế bằng dữ liệu trong bản sao lưu. " +
      "Nên xuất bản sao lưu dữ liệu hiện tại trước nếu cần giữ lại."
    );
    if (!ok) return;
    try {
      replaceAppData(merge.data);
    } catch (e) {
      setStatus("Nhập thất bại, dữ liệu cũ được giữ nguyên. " + (e && e.message ? e.message : e), "error");
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

  // ========================
  // MODAL
  // ========================

  function $(id) {
    return document.getElementById(id);
  }

  /** kind: "ok" | "error" | undefined (xoá trạng thái) */
  function setStatus(msg, kind) {
    var el = $("backup-modal-status");
    if (!el) {
      if (msg) alert(msg);
      return;
    }
    el.textContent = msg || "";
    el.classList.toggle("backup-modal__status--ok", kind === "ok");
    el.classList.toggle("backup-modal__status--error", kind === "error");
  }

  /** mode: "export" | "import" */
  function openModal(mode) {
    var modal = $("backup-modal");
    if (!modal) return;
    var isExport = mode === "export";
    $("backup-modal-title").textContent = isExport ? "Xuất dữ liệu học" : "Nhập dữ liệu học";
    $("backup-export-panel").classList.toggle("backup-modal__panel--active", isExport);
    $("backup-import-panel").classList.toggle("backup-modal__panel--active", !isExport);
    setStatus("");
    if (isExport) {
      renderExportSummary();
    } else {
      $("backup-import-text").value = "";
    }
    modal.classList.add("detail-modal--open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    var modal = $("backup-modal");
    if (!modal) return;
    modal.classList.remove("detail-modal--open");
    modal.setAttribute("aria-hidden", "true");
  }

  function isModalOpen() {
    var modal = $("backup-modal");
    return !!modal && modal.classList.contains("detail-modal--open");
  }

  /** Đọc dữ liệu app hiện tại; nếu rỗng/lỗi thì hiện thông báo và trả về null */
  function readDataForExport() {
    var data;
    try {
      data = collectAppData();
    } catch (e) {
      setStatus("Không đọc được dữ liệu local: " + (e && e.message ? e.message : e), "error");
      return null;
    }
    if (!Object.keys(data).length) {
      setStatus("Chưa có dữ liệu học nào được lưu trên trình duyệt này.", "error");
      return null;
    }
    return data;
  }

  function renderExportSummary() {
    var data = readDataForExport();
    var summary = data ? describeData(data) : "";
    $("backup-export-summary").textContent = summary
      ? "Dữ liệu sẽ được xuất:\n" + summary
      : "";
    $("backup-export-copy").disabled = !data;
    $("backup-export-file").disabled = !data;
  }

  function exportToClipboard() {
    var data = readDataForExport();
    if (!data) return;
    var text = buildBackupText(data);
    copyToClipboard(text, function (ok) {
      if (ok) {
        setStatus("Đã copy " + formatSize(new Blob([text]).size) + " vào clipboard. Sang trình duyệt khác chọn \"Nhập dữ liệu học\" rồi dán vào.", "ok");
      } else {
        setStatus("Không copy được vào clipboard, hãy dùng \"Tải file .json\".", "error");
      }
    });
  }

  function exportToFile() {
    var data = readDataForExport();
    if (!data) return;
    var name = backupFileName();
    downloadTextFile(name, buildBackupText(data), "application/json;charset=utf-8");
    setStatus("Đã tải file " + name + ".", "ok");
  }

  function init() {
    var modal = $("backup-modal");
    var exportBtn = $("nav-menu-export");
    var importBtn = $("nav-menu-import");
    var fileInput = $("backup-import-input");
    if (!modal) return;

    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        closeNavMenu();
        openModal("export");
      });
    }
    if (importBtn) {
      importBtn.addEventListener("click", function () {
        closeNavMenu();
        openModal("import");
      });
    }

    $("backup-modal-close").addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isModalOpen()) closeModal();
    });

    $("backup-export-copy").addEventListener("click", exportToClipboard);
    $("backup-export-file").addEventListener("click", exportToFile);

    $("backup-import-paste").addEventListener("click", function () {
      var text = $("backup-import-text").value.trim();
      if (!text) {
        setStatus("Hãy dán dữ liệu đã copy vào ô trên.", "error");
        return;
      }
      importBackupText(text);
    });

    if (fileInput) {
      $("backup-import-file").addEventListener("click", function () {
        fileInput.value = "";
        fileInput.click();
      });
      fileInput.addEventListener("change", function () {
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () { importBackupText(String(reader.result || "")); };
        reader.onerror = function () { setStatus("Không đọc được file.", "error"); };
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
