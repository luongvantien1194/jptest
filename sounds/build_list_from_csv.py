import csv
import os
import re
from pathlib import Path


# ========================
# Hiragana → Romaji helpers
# (đồng bộ với audioFileNameFromHiragana trong js/main.js)
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
    "っ": "",   # xử lý riêng (nhân đôi phụ âm)
    "ー": "",   # xử lý riêng (kéo dài âm)
}


def _last_vowel(s: str) -> str:
    m = re.search(r"[aeiou](?!.*[aeiou])", s)
    return m.group(0) if m else ""


def extract_hiragana(text: str) -> str:
    """
    Giữ lại chỉ Hiragana + ký tự kéo dài âm ー,
    giống logic extractHiragana trong js/main.js.
    """
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
            rom_next = ""
            if after_pair in HIRA_DIGRAPHS:
                rom_next = HIRA_DIGRAPHS[after_pair]
            elif after in HIRA_TABLE:
                rom_next = HIRA_TABLE[after]

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


def audio_filename_from_hiragana(text: str) -> str:
    """
    Convert hiragana → romaji rồi chuẩn hoá thành key chỉ chứa [a-z],
    tương đương audioFileNameFromHiragana trong js/main.js.
    """
    romaji = hiragana_to_romaji(text)
    return re.sub(r"[^a-z]", "", romaji.lower())


def build_list_from_csv() -> None:
    base_dir = Path(__file__).resolve().parent
    csv_path = base_dir / "romaji.csv"
    out_path = base_dir / "list.txt"
    vol_dir = base_dir / "vol"

    seen: set[str] = set()
    existing: list[str] = []

    # Đọc list.txt cũ (nếu có) để không trùng romaji đã tồn tại
    if out_path.exists():
        with out_path.open("r", encoding="utf-8") as f:
            for line in f:
                key = line.strip()
                if not key:
                    continue
                if key not in seen:
                    seen.add(key)
                    existing.append(key)

    # Đọc CSV, lấy cột Hiragana, convert sang romaji và thêm nếu chưa có
    new_keys: list[str] = []
    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        header = next(reader, None)
        for row in reader:
            if not row:
                continue
            hira = row[0]
            key = audio_filename_from_hiragana(hira)
            if not key:
                continue
            if key in seen:
                continue
            seen.add(key)
            new_keys.append(key)

    all_keys = existing + new_keys

    # Ghi lại list.txt (đã bao gồm cả key cũ và key mới)
    with out_path.open("w", encoding="utf-8") as f:
        for key in all_keys:
            f.write(key + "\n")

    # Tạo thư mục vol (nếu chưa có)
    vol_dir.mkdir(parents=True, exist_ok=True)

    # Với mỗi romaji mới, tạo file mp3 trống tương ứng nếu chưa tồn tại
    # (placeholder, sau này bạn có thể ghi đè bằng file audio thật)
    for key in new_keys:
        mp3_path = vol_dir / f"{key}.mp3"
        if not mp3_path.exists():
            mp3_path.touch()


if __name__ == "__main__":
    build_list_from_csv()

