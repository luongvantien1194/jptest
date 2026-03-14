import csv
import re
import sys
import time
from pathlib import Path

# ========================
# gTTS: pip install gtts
# ========================
try:
    from gtts import gTTS
    GTTS_AVAILABLE = True
except ImportError:
    GTTS_AVAILABLE = False

# ========================
# Hiragana → Romaji helpers
# ========================

HIRA_DIGRAPHS = {
    "きゃ": "kya", "きゅ": "kyu", "きょ": "kyo",
    "しゃ": "sha", "しゅ": "shu", "しょ": "sho",
    "ちゃ": "cha", "ちゅ": "chu", "ちょ": "cho",
    "にゃ": "nya", "にゅ": "nyu", "にょ": "nyo",
    "ひゃ": "hya", "ひゅ": "hyu", "ひょ": "hyo",
    "みゃ": "mya", "みゅ": "myu", "みょ": "myo",
    "りゃ": "rya", "りゅ": "ryu", "りょ": "ryo",
    "ぎゃ": "gya", "ぎゅ": "gyu", "ぎょ": "gyo",
    "じゃ": "ja",  "じゅ": "ju",  "じょ": "jo",
    "びゃ": "bya", "びゅ": "byu", "びょ": "byo",
    "ぴゃ": "pya", "ぴゅ": "pyu", "ぴょ": "pyo",
}

HIRA_TABLE = {
    "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
    "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
    "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
    "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
    "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
    "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
    "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
    "や": "ya", "ゆ": "yu", "よ": "yo",
    "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
    "わ": "wa", "を": "o",
    "ん": "n",
    "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
    "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
    "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do",
    "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
    "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po",
    "ぁ": "a", "ぃ": "i", "ぅ": "u", "ぇ": "e", "ぉ": "o",
    "ゃ": "ya", "ゅ": "yu", "ょ": "yo",
    "っ": "",
    "ー": "",
}


def log(msg: str) -> None:
    print(msg, flush=True)


def _last_vowel(s: str) -> str:
    m = re.search(r"[aeiou](?!.*[aeiou])", s)
    return m.group(0) if m else ""


def extract_hiragana(text: str) -> str:
    return re.sub(r"[^\u3040-\u309Fー]", "", text or "")


def hiragana_to_romaji(hira_raw: str) -> str:
    hira = extract_hiragana(hira_raw)
    result: list[str] = []
    i = 0
    while i < len(hira):
        ch = hira[i]
        nxt = hira[i + 1] if i + 1 < len(hira) else ""
        pair = ch + nxt
        if pair in HIRA_DIGRAPHS:
            result.append(HIRA_DIGRAPHS[pair])
            i += 2
            continue
        if ch == "っ":
            after = hira[i + 1] if i + 1 < len(hira) else ""
            after_next = hira[i + 2] if i + 2 < len(hira) else ""
            after_pair = after + after_next
            rom_next = HIRA_DIGRAPHS.get(after_pair) or HIRA_TABLE.get(after, "")
            if rom_next:
                c = rom_next[0]
                if re.match(r"[bcdfghjklmnpqrstvwxyz]", c):
                    result.append(c)
            i += 1
            continue
        if ch in HIRA_TABLE:
            rom = HIRA_TABLE[ch]
            if nxt == "ー":
                v = _last_vowel(rom)
                if v:
                    rom += v
            result.append(rom)
        i += 1
    return "".join(result)


def audio_key_from_hiragana(text: str) -> str:
    romaji = hiragana_to_romaji(text)
    return re.sub(r"[^a-z]", "", romaji.lower())


def generate_audio(text: str, out_path: Path) -> bool:
    """Tạo file mp3 bằng gTTS. Trả về True nếu thành công."""
    try:
        tts = gTTS(text=text, lang="ja", slow=False)
        tts.save(str(out_path))
        return True
    except Exception as e:
        log(f"    [ERROR] gTTS thất bại: {e}")
        return False


def build_list_from_csv() -> None:
    base_dir = Path(__file__).resolve().parent
    csv_path = base_dir / "romaji.csv"
    out_path = base_dir / "list.txt"
    vol_dir  = base_dir / "vol"

    log("=" * 50)
    log("  BUILD LIST FROM CSV — TẠO ÂM THANH")
    log("=" * 50)

    if not GTTS_AVAILABLE:
        log("[WARN] gTTS chưa được cài. Chạy: pip install gtts")
        log("[WARN] Sẽ chỉ tạo file mp3 trống (placeholder).")

    if not csv_path.exists():
        log(f"[ERROR] Không tìm thấy file CSV: {csv_path}")
        sys.exit(1)

    log(f"[INFO] CSV     : {csv_path}")
    log(f"[INFO] Output  : {out_path}")
    log(f"[INFO] Audio   : {vol_dir}")
    log("")

    # Đọc list.txt cũ
    seen: set[str] = set()
    existing: list[str] = []
    if out_path.exists():
        with out_path.open("r", encoding="utf-8") as f:
            for line in f:
                key = line.strip()
                if key and key not in seen:
                    seen.add(key)
                    existing.append(key)
        log(f"[INFO] Đã có {len(existing)} key trong list.txt")
    else:
        log("[INFO] list.txt chưa tồn tại, sẽ tạo mới")

    # Đọc CSV
    rows: list[tuple[str, str]] = []  # (hiragana, key)
    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        next(reader, None)  # bỏ header
        for row in reader:
            if not row:
                continue
            hira = row[0].strip()
            key = audio_key_from_hiragana(hira)
            if not key:
                log(f"[SKIP] '{hira}' → không convert được romaji")
                continue
            rows.append((hira, key))

    log(f"[INFO] Đọc được {len(rows)} dòng từ CSV")
    log("")

    # Lọc ra key mới chưa có trong list.txt
    new_entries: list[tuple[str, str]] = []
    for hira, key in rows:
        if key not in seen:
            seen.add(key)
            new_entries.append((hira, key))

    log(f"[INFO] Số key mới cần xử lý: {len(new_entries)}")
    if not new_entries:
        log("[INFO] Không có gì mới. Kết thúc.")
        return

    log("")
    vol_dir.mkdir(parents=True, exist_ok=True)

    # Tạo audio cho từng key mới
    ok_count = 0
    skip_count = 0
    err_count = 0
    created_keys: list[str] = []  # chỉ những key tạo thành công

    for i, (hira, key) in enumerate(new_entries, 1):
        mp3_path = vol_dir / f"{key}.mp3"
        prefix = f"[{i:>4}/{len(new_entries)}]"

        if mp3_path.exists() and mp3_path.stat().st_size > 0:
            log(f"{prefix} SKIP  {hira:15s} → {key}.mp3 (đã tồn tại)")
            skip_count += 1
            # File đã tồn tại nhưng chưa có trong list.txt → vẫn ghi lại
            created_keys.append(key)
            continue

        if GTTS_AVAILABLE:
            log(f"{prefix} GEN   {hira:15s} → {key}.mp3 ...")
            success = generate_audio(hira, mp3_path)
            if success:
                size_kb = mp3_path.stat().st_size / 1024
                log(f"{prefix} OK    {hira:15s} → {key}.mp3 ({size_kb:.1f} KB)")
                ok_count += 1
                created_keys.append(key)
                time.sleep(0.3)
            else:
                log(f"{prefix} ERR   {hira:15s} → {key}.mp3 (không ghi vào list.txt)")
                err_count += 1
        else:
            # Tạo file trống placeholder
            mp3_path.touch()
            log(f"{prefix} EMPTY {hira:15s} → {key}.mp3 (placeholder)")
            ok_count += 1
            created_keys.append(key)

    # Cập nhật list.txt — chỉ ghi những key đã tạo thành công
    all_keys = existing + created_keys
    with out_path.open("w", encoding="utf-8") as f:
        for key in all_keys:
            f.write(key + "\n")
    log(f"[INFO] Đã ghi {len(created_keys)} key mới vào list.txt")

    log("")
    log("=" * 50)
    log(f"  XONG: {ok_count} tạo mới | {skip_count} bỏ qua | {err_count} lỗi")
    log(f"  list.txt: {len(all_keys)} key tổng cộng")
    log("=" * 50)


if __name__ == "__main__":
    build_list_from_csv()
