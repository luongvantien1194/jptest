// Tab "Sửa từ vựng" — chỉnh sửa dữ liệu trong app_files/vocabData_1_TvkS.js dưới dạng bảng.
// Không đụng vào danh sách từ vựng đang dùng để học (vocabData/window._vocabExtra) — đây là
// công cụ soạn thảo riêng, chỉnh xong thì bấm "Copy JS" rồi tự dán đè vào file & deploy thủ công.
(function () {
  "use strict";

  var FIELDS = ["Lesson", "Hiragana", "Romaji", "Kanji", "Meaning", "category", "Vru", "type", "note"];
  var FIELD_LABELS = {
    Lesson: "Bài",
    Hiragana: "Hiragana",
    Romaji: "Romaji",
    Kanji: "Kanji",
    Meaning: "Nghĩa",
    category: "Category",
    Vru: "Vru",
    type: "Type",
    note: "Note"
  };
  var STORAGE_KEY = "jp_vocab_editor_data";
  var BASELINE_KEY = "jp_vocab_editor_baseline";

  var editorData = [];

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (typeof text === "string") {
      el.textContent = text;
    }
    return el;
  }

  function normalizeRow(item) {
    var row = {};
    FIELDS.forEach(function (f) {
      row[f] = item && item[f] != null ? item[f] : "";
    });
    return row;
  }

  // window._vocabExtra1ToEdit được vocabData_1_TvkS.js tự nạp qua thẻ <script> chung của app
  // (cùng cơ chế với window._vocabExtra) — không fetch file riêng, nên luôn đúng theo data
  // hiện tại của file này ngay khi trang vừa tải xong, kể cả khi mở bằng file://.
  function cloneSource() {
    var src = window._vocabExtra1ToEdit || [];
    return src.map(normalizeRow);
  }

  function loadEditorData() {
    var currentSourceJson = JSON.stringify(cloneSource());
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var baseline = localStorage.getItem(BASELINE_KEY);
      // Chỉ dùng bản edit đã lưu trên máy này nếu file vocabData_1_TvkS.js chưa hề thay đổi
      // kể từ lần lưu gần nhất — nếu file gốc đã cập nhật (git pull, deploy bản mới, ...) thì
      // luôn nạp lại đúng theo data hiện tại của file, bỏ qua bản edit cũ để tránh hiển thị sai.
      if (raw && baseline === currentSourceJson) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          editorData = parsed.map(normalizeRow);
          return;
        }
      }
    } catch (e) { }
    editorData = cloneSource();
    try {
      localStorage.setItem(BASELINE_KEY, currentSourceJson);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) { }
  }

  function saveEditorData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editorData));
      localStorage.setItem(BASELINE_KEY, JSON.stringify(cloneSource()));
    } catch (e) { }
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

  function renderSummary() {
    var el = document.getElementById("vocab-edit-summary");
    if (el) {
      el.textContent = editorData.length + " từ";
    }
  }

  function setFieldValue(row, field, rawVal) {
    if (field === "Lesson") {
      var num = parseInt(rawVal, 10);
      row[field] = isNaN(num) ? String(rawVal || "").trim() : num;
    } else {
      row[field] = rawVal != null ? String(rawVal) : "";
    }
  }

  function renderTable() {
    var wrap = document.getElementById("vocab-edit-table-wrap");
    if (!wrap) {
      return;
    }
    wrap.innerHTML = "";

    var table = createEl("table", "vocab-edit-table");
    var thead = createEl("thead");
    var headRow = createEl("tr");
    headRow.appendChild(createEl("th", "vocab-edit-th-stt", "STT"));
    FIELDS.forEach(function (f) {
      headRow.appendChild(createEl("th", null, FIELD_LABELS[f]));
    });
    headRow.appendChild(createEl("th", null, ""));
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = createEl("tbody");
    editorData.forEach(function (row, idx) {
      var tr = createEl("tr");
      tr.appendChild(createEl("td", "vocab-edit-stt", String(idx + 1)));

      FIELDS.forEach(function (f) {
        var td = createEl("td");
        var input = document.createElement("input");
        input.type = "text";
        input.className = "vocab-edit-input" + (f === "Lesson" ? " vocab-edit-input--narrow" : "");
        input.value = row[f] != null ? row[f] : "";
        input.addEventListener("change", function () {
          setFieldValue(row, f, input.value);
          saveEditorData();
        });
        td.appendChild(input);
        tr.appendChild(td);
      });

      var delTd = createEl("td");
      var delBtn = createEl("button", "vocab-edit-del-btn", "🗑");
      delBtn.type = "button";
      delBtn.title = "Xoá từ này";
      delBtn.addEventListener("click", function () {
        var i = editorData.indexOf(row);
        if (i < 0) {
          return;
        }
        if (!window.confirm("Xoá từ \"" + (row.Hiragana || row.Kanji || "") + "\"?")) {
          return;
        }
        editorData.splice(i, 1);
        saveEditorData();
        renderTable();
        renderSummary();
      });
      delTd.appendChild(delBtn);
      tr.appendChild(delTd);

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
  }

  function addNewRow() {
    editorData.push(normalizeRow(null));
    saveEditorData();
    renderTable();
    renderSummary();
    var wrap = document.getElementById("vocab-edit-table-wrap");
    if (wrap) {
      wrap.scrollTop = wrap.scrollHeight;
    }
  }

  function reloadFromSource() {
    if (!window.confirm("Bỏ hết các chỉnh sửa hiện tại (trên trình duyệt này) và tải lại đúng như file vocabData_1_TvkS.js gốc?")) {
      return;
    }
    editorData = cloneSource();
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(BASELINE_KEY, JSON.stringify(cloneSource()));
    } catch (e) { }
    renderTable();
    renderSummary();
  }

  function buildVocabJsContent() {
    var lines = [
      "// N3 Vocab - Lesson 1-71",
      "window._vocabExtra = window._vocabExtra || [];",
      "// Bản riêng dùng cho tab \"Sửa từ vựng\" — đi theo cùng cơ chế load <script> chung của app",
      "// (không fetch file riêng), nên luôn đúng theo data hiện tại của file này.",
      "window._vocabExtra1ToEdit = window._vocabExtra1ToEdit || [];",
      "window._vocabExtra1ToEdit.push("
    ];
    var lastLesson = null;
    editorData.forEach(function (row) {
      if (row.Lesson !== lastLesson) {
        lines.push("  // --- Lesson " + (row.Lesson != null && row.Lesson !== "" ? row.Lesson : "?") + ": " + (row.Hiragana || "") + " ---");
        lastLesson = row.Lesson;
      }
      var obj = {};
      FIELDS.forEach(function (f) { obj[f] = row[f] != null ? row[f] : ""; });
      lines.push("  " + JSON.stringify(obj) + ",");
    });
    lines.push(");");
    lines.push("window._vocabExtra.push.apply(window._vocabExtra, window._vocabExtra1ToEdit);");
    lines.push("");
    return lines.join("\n");
  }

  // ----- CSV export / import (dùng thư viện XLSX đã load sẵn trong app) -----

  function buildColumnCheckboxes(container, idPrefix) {
    if (!container) {
      return;
    }
    container.innerHTML = "";
    FIELDS.forEach(function (f) {
      var label = createEl("label", "checkbox-chip");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = true;
      cb.id = idPrefix + "-" + f;
      cb.setAttribute("data-field", f);
      label.appendChild(cb);
      label.appendChild(createEl("span", null, FIELD_LABELS[f]));
      container.appendChild(label);
    });
  }

  /** Đồng bộ 2 chiều: tick/bỏ tick 1 cột ở panel này thì panel kia cũng đổi theo cùng cột đó. */
  function syncColumnCheckboxes(containerA, containerB) {
    if (!containerA || !containerB) {
      return;
    }
    function mirror(from, to) {
      Array.prototype.forEach.call(from.querySelectorAll("input[type=checkbox]"), function (cb) {
        cb.addEventListener("change", function () {
          var field = cb.getAttribute("data-field");
          var other = to.querySelector('input[data-field="' + field + '"]');
          if (other) {
            other.checked = cb.checked;
          }
        });
      });
    }
    mirror(containerA, containerB);
    mirror(containerB, containerA);
  }

  function getCheckedFields(container) {
    if (!container) {
      return [];
    }
    return Array.prototype.slice.call(container.querySelectorAll("input[type=checkbox]"))
      .filter(function (cb) { return cb.checked; })
      .map(function (cb) { return cb.getAttribute("data-field"); });
  }

  function runExportCsv() {
    var fromEl = document.getElementById("vocab-edit-export-from");
    var toEl = document.getElementById("vocab-edit-export-to");
    var colsContainer = document.getElementById("vocab-edit-export-cols");
    var from = Math.max(1, parseInt(fromEl.value, 10) || 1);
    var to = Math.min(editorData.length, parseInt(toEl.value, 10) || editorData.length);
    if (to < from) {
      alert("Khoảng \"từ thứ .. đến thứ ..\" không hợp lệ.");
      return;
    }
    var fields = getCheckedFields(colsContainer);
    if (!fields.length) {
      alert("Chọn ít nhất 1 cột để xuất.");
      return;
    }
    if (typeof XLSX === "undefined" || !XLSX.utils) {
      alert("Không tìm thấy thư viện XLSX để xuất CSV.");
      return;
    }
    var rows = [];
    for (var i = from - 1; i <= to - 1; i++) {
      var row = editorData[i];
      var out = { stt: i + 1 };
      fields.forEach(function (f) { out[f] = row[f] != null ? row[f] : ""; });
      rows.push(out);
    }
    var sheet = XLSX.utils.json_to_sheet(rows, { header: ["stt"].concat(fields) });
    var csv = XLSX.utils.sheet_to_csv(sheet);
    downloadTextFile("vocabData_1_export.csv", "\uFEFF" + csv, "text/csv;charset=utf-8");
  }

  function runImportCsv() {
    var fileInput = document.getElementById("vocab-edit-import-file");
    var colsContainer = document.getElementById("vocab-edit-import-cols");
    var file = fileInput && fileInput.files && fileInput.files[0];
    if (!file) {
      alert("Hãy chọn file CSV trước.");
      return;
    }
    var fields = getCheckedFields(colsContainer);
    if (!fields.length) {
      alert("Chọn ít nhất 1 cột để nhập.");
      return;
    }
    if (typeof XLSX === "undefined" || !XLSX.read) {
      alert("Không tìm thấy thư viện XLSX để đọc CSV.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var text = String(e.target.result || "").replace(/^\uFEFF/, "");
        var wb = XLSX.read(text, { type: "string" });
        var sheet = wb.Sheets[wb.SheetNames[0]];
        var parsedRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        var addedCount = 0;
        var updatedCount = 0;
        parsedRows.forEach(function (pr) {
          var sttRaw = pr.stt != null ? pr.stt : pr.STT;
          var stt = parseInt(sttRaw, 10);
          var targetRow;
          if (!isNaN(stt) && stt >= 1 && stt <= editorData.length) {
            targetRow = editorData[stt - 1];
            updatedCount++;
          } else {
            targetRow = normalizeRow(null);
            editorData.push(targetRow);
            addedCount++;
          }
          fields.forEach(function (f) {
            if (Object.prototype.hasOwnProperty.call(pr, f)) {
              setFieldValue(targetRow, f, pr[f]);
            }
          });
        });
        saveEditorData();
        renderTable();
        renderSummary();
        toggleImportPanel(false);
        alert("Đã nhập CSV: cập nhật " + updatedCount + " từ, thêm mới " + addedCount + " từ.");
      } catch (err) {
        alert("Không đọc được file CSV: " + err.message);
      }
    };
    reader.readAsText(file, "UTF-8");
  }

  function toggleExportPanel(show) {
    var panel = document.getElementById("vocab-edit-export-panel");
    if (!panel) {
      return;
    }
    if (show) {
      var toEl = document.getElementById("vocab-edit-export-to");
      if (toEl && !toEl.value) {
        toEl.value = editorData.length;
      }
    }
    panel.hidden = !show;
  }

  function toggleImportPanel(show) {
    var panel = document.getElementById("vocab-edit-import-panel");
    if (!panel) {
      return;
    }
    panel.hidden = !show;
  }

  function setupEvents() {
    var addBtn = document.getElementById("vocab-edit-add-row-btn");
    if (addBtn) {
      addBtn.addEventListener("click", addNewRow);
    }

    var reloadBtn = document.getElementById("vocab-edit-reload-btn");
    if (reloadBtn) {
      reloadBtn.addEventListener("click", reloadFromSource);
    }

    var copyBtn = document.getElementById("vocab-edit-copy-js-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var content = buildVocabJsContent();
        copyToClipboard(content, function (ok) {
          if (ok) {
            alert("Đã copy nội dung vocabData_1_TvkS.js vào clipboard. Dán đè vào file rồi tự deploy lại.");
          } else {
            window.prompt("Không copy tự động được, hãy tự chọn & copy nội dung bên dưới:", content);
          }
        });
      });
    }

    var exportToggleBtn = document.getElementById("vocab-edit-export-toggle-btn");
    if (exportToggleBtn) {
      exportToggleBtn.addEventListener("click", function () {
        toggleImportPanel(false);
        toggleExportPanel(true);
      });
    }
    var exportCloseBtn = document.getElementById("vocab-edit-export-close-btn");
    if (exportCloseBtn) {
      exportCloseBtn.addEventListener("click", function () { toggleExportPanel(false); });
    }
    var exportRunBtn = document.getElementById("vocab-edit-export-run-btn");
    if (exportRunBtn) {
      exportRunBtn.addEventListener("click", runExportCsv);
    }

    var importToggleBtn = document.getElementById("vocab-edit-import-toggle-btn");
    if (importToggleBtn) {
      importToggleBtn.addEventListener("click", function () {
        toggleExportPanel(false);
        toggleImportPanel(true);
      });
    }
    var importCloseBtn = document.getElementById("vocab-edit-import-close-btn");
    if (importCloseBtn) {
      importCloseBtn.addEventListener("click", function () { toggleImportPanel(false); });
    }
    var importRunBtn = document.getElementById("vocab-edit-import-run-btn");
    if (importRunBtn) {
      importRunBtn.addEventListener("click", runImportCsv);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("section-vocab-edit")) {
      return;
    }
    var exportColsEl = document.getElementById("vocab-edit-export-cols");
    var importColsEl = document.getElementById("vocab-edit-import-cols");
    buildColumnCheckboxes(exportColsEl, "vocab-edit-export-col");
    buildColumnCheckboxes(importColsEl, "vocab-edit-import-col");
    syncColumnCheckboxes(exportColsEl, importColsEl);
    setupEvents();

    loadEditorData();
    renderTable();
    renderSummary();
  });
})();
