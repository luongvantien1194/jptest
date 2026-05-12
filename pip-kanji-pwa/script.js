<script>
(function () {
  "use strict";

  const CANVAS_W = 405;
  const CANVAS_H = 500;

  const state = {
    items: [],
    selected: null,
    stream: null,
    pipActive: false,
    rafId: null,
    pipHeartbeat: null,
    audioCtx: null
  };

  const els = {
    loadStatus: document.getElementById("load-status"),
    detailPanel: document.getElementById("detail-panel"),
    canvas: document.getElementById("main-canvas"),
    btnPip: document.getElementById("btn-pip"),
    video: document.getElementById("pip-video"),
    fallback: document.getElementById("fallback-box")
  };

  const ctx = els.canvas.getContext("2d");

  // =========================================================
  // SILENT AUDIO TRACK
  // =========================================================

  function createSilentAudioTrack() {

    try {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        return null;
      }

      state.audioCtx =
        new AudioContext();

      const oscillator =
        state.audioCtx.createOscillator();

      const gain =
        state.audioCtx.createGain();

      gain.gain.value = 0;

      const dst =
        state.audioCtx
          .createMediaStreamDestination();

      oscillator.connect(gain);

      gain.connect(dst);

      oscillator.start();

      return dst.stream
        .getAudioTracks()[0];

    } catch (e) {

      console.warn(
        "Silent audio failed:",
        e
      );

      return null;
    }
  }

  // =========================================================
  // MEDIA SESSION
  // =========================================================

  function updateMediaSession() {

    if (
      !("mediaSession" in navigator) ||
      !state.selected
    ) {
      return;
    }

    try {

      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
          <rect width="512" height="512" fill="#0f172a"/>
          <text
            x="50%"
            y="50%"
            font-size="250"
            fill="white"
            text-anchor="middle"
            dominant-baseline="central"
          >
            ${state.selected.kanji}
          </text>
        </svg>`;

      const metadataConfig = {

        title:
          "Học Kanji: " +
          state.selected.kanji,

        artist:
          state.selected.hanviet ||
          "Kanji PiP",

        album:
          "Japanese Learning",

        artwork: [
          {
            src:
              "data:image/svg+xml;charset=utf-8," +
              encodeURIComponent(svg),

            sizes: "512x512",

            type: "image/svg+xml"
          }
        ]
      };

      if ("MediaMetadata" in window) {

        navigator.mediaSession.metadata =
          new MediaMetadata(
            metadataConfig
          );
      }

      navigator.mediaSession
        .playbackState = "playing";

    } catch (e) {

      console.warn(
        "MediaSession update failed:",
        e
      );
    }
  }

  // =========================================================
  // VOCAB PARSER
  // =========================================================

  function parseLegacyPipeVocab(s) {

    const out = [];

    String(s)
      .split("|")
      .forEach(function (seg) {

        const t =
          String(seg).trim();

        if (!t) return;

        const m =
          t.match(
            /^(.+?)\(([^)]+)\)\s*:\s*(.+)$/
          );

        if (m) {

          out.push({
            word: m[1].trim(),
            reading: m[2].trim(),
            meaning: m[3].trim()
          });

        } else {

          out.push({
            word: t,
            reading: "",
            meaning: ""
          });
        }
      });

    return out;
  }

  function normalizeVocabularyList(raw) {

    if (Array.isArray(raw.vocabulary)) {

      return raw.vocabulary.map(function (e) {

        if (typeof e === "string") {

          return {
            word: e,
            reading: "",
            meaning: ""
          };
        }

        return {
          word:
            e.word != null
              ? String(e.word)
              : "",

          reading:
            e.reading != null
              ? String(e.reading)
              : "",

          meaning:
            e.meaning != null
              ? String(e.meaning)
              : ""
        };
      });
    }

    if (
      typeof raw.vocabulary === "string" &&
      raw.vocabulary.trim()
    ) {
      return parseLegacyPipeVocab(
        raw.vocabulary
      );
    }

    return [];
  }

  // =========================================================
  // TEXT WRAP
  // =========================================================

  function wrapLinesToArray(
    text,
    maxW
  ) {

    const s =
      String(text || "").trim();

    if (!s) return [];

    const lines = [];

    const parts =
      s.split(/(\s+)/);

    let cur = "";

    for (let i = 0; i < parts.length; i++) {

      const p = parts[i];

      if (!p) continue;

      const test = cur + p;

      if (
        ctx.measureText(test).width <= maxW
      ) {

        cur = test;

        continue;
      }

      if (cur.trim()) {

        lines.push(cur.trim());
      }

      cur = p;
    }

    if (cur.trim()) {

      lines.push(cur.trim());
    }

    return lines;
  }

  function drawParagraphCenter(
    cx,
    y,
    maxW,
    lineHeight,
    lines
  ) {

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    for (let i = 0; i < lines.length; i++) {

      ctx.fillText(
        lines[i],
        cx,
        y + lineHeight / 2
      );

      y += lineHeight;
    }

    return y;
  }

  // =========================================================
  // DRAW CANVAS
  // =========================================================

  function drawCanvas() {

    const item = state.selected;

    if (!item || !ctx) {
      return;
    }

    ctx.fillStyle = "#020617";

    ctx.fillRect(
      0,
      0,
      CANVAS_W,
      CANVAS_H
    );

    ctx.save();

    ctx.beginPath();

    ctx.rect(
      0,
      0,
      CANVAS_W,
      CANVAS_H
    );

    ctx.clip();

    const cx = CANVAS_W / 2;

    const maxW =
      CANVAS_W - 28;

    let y = 54;

    // Kanji
    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillStyle = "#f8fafc";

    ctx.font =
      "bold 96px 'Hiragino Sans','Yu Gothic',sans-serif";

    ctx.fillText(
      item.kanji || "",
      cx,
      y
    );

    y += 56;

    // Hanviet
    if (item.hanviet) {

      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "600 19px system-ui,sans-serif";

      ctx.fillText(
        item.hanviet,
        cx,
        y
      );

      y += 28;
    }

    // Meaning
    ctx.fillStyle = "#cbd5e1";

    ctx.font =
      "18px system-ui,sans-serif";

    const meaningLines =
      wrapLinesToArray(
        item.meaning || "",
        maxW
      );

    y =
      drawParagraphCenter(
        cx,
        y,
        maxW,
        22,
        meaningLines
      ) + 12;

    // On/Kun
    ctx.fillStyle = "#94a3b8";

    ctx.font =
      "16px system-ui,sans-serif";

    ctx.fillText(
      "On: " + (item.on || "—"),
      cx,
      y
    );

    y += 24;

    ctx.fillText(
      "Kun: " + (item.kun || "—"),
      cx,
      y
    );

    y += 24;

    ctx.fillText(
      "Nét: " +
      (item.strokes || "—"),
      cx,
      y
    );

    y += 28;

    // Radical
    if (item.radicals) {

      ctx.fillStyle = "#78716c";

      ctx.font =
        "14px system-ui,sans-serif";

      y =
        drawParagraphCenter(
          cx,
          y,
          maxW,
          19,
          wrapLinesToArray(
            "Bộ thủ: " +
              item.radicals,
            maxW
          )
        ) + 10;
    }

    // Memory tip
    if (item.memory_tip) {

      ctx.fillStyle = "#64748b";

      ctx.font =
        "13px system-ui,sans-serif";

      y =
        drawParagraphCenter(
          cx,
          y,
          maxW,
          18,
          wrapLinesToArray(
            item.memory_tip,
            maxW
          )
        ) + 12;
    }

    // Vocabulary
    const vocabs =
      item._vocabs || [];

    if (vocabs.length) {

      ctx.fillStyle = "#64748b";

      ctx.font =
        "bold 14px system-ui,sans-serif";

      ctx.fillText(
        "Từ vựng",
        cx,
        y
      );

      y += 24;

      ctx.fillStyle = "#94a3b8";

      ctx.font =
        "13px system-ui,sans-serif";

      vocabs.forEach(function (v) {

        const line =
          (v.word || "") +
          (
            v.reading
              ? " (" +
                v.reading +
                ")"
              : ""
          ) +
          (
            v.meaning
              ? " — " +
                v.meaning
              : ""
          );

        y =
          drawParagraphCenter(
            cx,
            y,
            maxW,
            18,
            wrapLinesToArray(
              line,
              maxW
            )
          ) + 8;
      });
    }

    ctx.restore();
  }

  // =========================================================
  // LOOP
  // =========================================================

  function loop() {

    if (!document.hidden) {

      drawCanvas();
    }

    state.rafId =
      setTimeout(loop, 100);
  }

  // =========================================================
  // STREAM
  // =========================================================

  function attachStreamToVideo() {

    if (
      !els.canvas.captureStream ||
      !els.video.requestPictureInPicture
    ) {

      els.btnPip.disabled = true;

      return;
    }

    try {

      if (state.stream) {

        state.stream
          .getTracks()
          .forEach(function (t) {
            t.stop();
          });
      }

      const canvasStream =
        els.canvas.captureStream(10);

      const silentAudio =
        createSilentAudioTrack();

      if (silentAudio) {

        canvasStream.addTrack(
          silentAudio
        );
      }

      state.stream =
        canvasStream;

      els.video.srcObject =
        state.stream;

      els.video.muted = true;

      els.video.autoplay = true;

      els.video.playsInline = true;

      els.video.setAttribute(
        "playsinline",
        ""
      );

      els.video.setAttribute(
        "webkit-playsinline",
        ""
      );

      els.btnPip.disabled = false;

    } catch (e) {

      console.error(
        "Stream attach failed:",
        e
      );
    }
  }

  // =========================================================
  // OPEN PIP
  // =========================================================

  async function openPip() {

    if (
      !document.pictureInPictureEnabled ||
      !els.video.requestPictureInPicture
    ) {
      return;
    }

    try {

      await els.video.play();

      await els.video
        .requestPictureInPicture();

      state.pipActive = true;

      updateMediaSession();

    } catch (err) {

      console.warn(
        "PiP Error:",
        err
      );
    }
  }

  els.btnPip.addEventListener(
    "click",
    openPip
  );

  // =========================================================
  // PIP EVENTS
  // =========================================================

  els.video.addEventListener(
    "enterpictureinpicture",
    function () {

      state.pipActive = true;
    }
  );

  els.video.addEventListener(
    "leavepictureinpicture",
    function () {

      state.pipActive = false;
    }
  );

  // =========================================================
  // VISIBILITY CHANGE
  // =========================================================

  document.addEventListener(
    "visibilitychange",

    async function () {

      if (document.hidden) {

        if (!state.pipHeartbeat) {

          state.pipHeartbeat =
            setInterval(function () {

              drawCanvas();

            }, 1000);
        }

      } else {

        if (state.pipHeartbeat) {

          clearInterval(
            state.pipHeartbeat
          );

          state.pipHeartbeat = null;
        }

        drawCanvas();

        // iPhone wake-up fix
        if (state.pipActive) {

          try {

            if (state.stream) {

              state.stream
                .getTracks()
                .forEach(function (t) {
                  t.stop();
                });
            }

            els.video.pause();

            els.video.srcObject =
              null;

            attachStreamToVideo();

            drawCanvas();

            // GPU refresh trick
            ctx.fillStyle =
              "transparent";

            ctx.fillRect(
              0,
              0,
              1,
              1
            );

            await els.video.play();

          } catch (e) {

            console.warn(
              "PiP restore failed:",
              e
            );
          }
        }
      }
    }
  );

  // =========================================================
  // CLEANUP
  // =========================================================

  function cleanup() {

    if (state.rafId) {

      clearTimeout(
        state.rafId
      );
    }

    if (state.pipHeartbeat) {

      clearInterval(
        state.pipHeartbeat
      );
    }

    if (state.stream) {

      state.stream
        .getTracks()
        .forEach(function (t) {
          t.stop();
        });
    }

    if (state.audioCtx) {

      state.audioCtx.close();
    }
  }

  window.addEventListener(
    "beforeunload",
    cleanup
  );

  // =========================================================
  // BOOT
  // =========================================================

  function bootFromKanjiData(arr) {

    state.items =
      (
        Array.isArray(arr)
          ? arr
          : []
      ).map(function (raw, idx) {

        return {

          id:
            String(
              raw.stt ||
              idx + 1
            ),

          kanji:
            raw.kanji || "",

          meaning:
            raw.core_meaning || "",

          on:
            String(
              raw.on_reading || ""
            ).replace(/\|/g, "、"),

          kun:
            String(
              raw.kun_reading || ""
            ).replace(/\|/g, "、"),

          strokes:
            raw.stroke_count || "",

          hanviet:
            raw.hanviet || "",

          radicals:
            String(
              raw.radicals || ""
            ),

          memory_tip:
            String(
              raw.memory_tip || ""
            ),

          _vocabs:
            normalizeVocabularyList({
              vocabulary:
                raw.vocabulary
            })
        };
      });

    const m =
      (
        window.location.hash ||
        ""
      ).match(
        /^#kanji=(.+)$/
      );

    if (m) {

      const id =
        decodeURIComponent(
          m[1]
        );

      state.selected =
        state.items.find(
          x =>
            String(x.id) ===
            String(id)
        );
    }

    if (
      !state.selected &&
      state.items.length
    ) {

      state.selected =
        state.items[0];
    }

    if (state.selected) {

      els.detailPanel.hidden =
        false;

      attachStreamToVideo();

      drawCanvas();

      loop();
    }
  }

  // =========================================================
  // START
  // =========================================================

  if (
    typeof kanjiData !==
    "undefined"
  ) {

    bootFromKanjiData(
      kanjiData
    );

  } else {

    if (els.loadStatus) {

      els.loadStatus.hidden =
        false;
    }
  }

})();
</script>