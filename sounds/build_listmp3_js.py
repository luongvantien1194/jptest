"""
Đọc list.txt → ghi lại biến listMp3 trong listMp3.js
Chạy: python app/sounds/build_listmp3_js.py
"""
from pathlib import Path


ITEMS_PER_LINE = 10


def build_listmp3_js() -> None:
    base_dir = Path(__file__).resolve().parent
    list_path = base_dir / "list.txt"
    js_path   = base_dir / "listMp3.js"

    print("=" * 50)
    print("  BUILD listMp3.js FROM list.txt")
    print("=" * 50)

    if not list_path.exists():
        print(f"[ERROR] Không tìm thấy: {list_path}")
        return

    # Đọc list.txt
    keys: list[str] = []
    with list_path.open("r", encoding="utf-8") as f:
        for line in f:
            key = line.strip()
            if key:
                keys.append(key)

    print(f"[INFO] Đọc được {len(keys)} key từ list.txt")

    # Build nội dung JS
    lines: list[str] = ["const listMp3 = ["]
    for i in range(0, len(keys), ITEMS_PER_LINE):
        chunk = keys[i : i + ITEMS_PER_LINE]
        row = ", ".join(f"'{k}'" for k in chunk)
        # Thêm dấu phẩy cuối dòng nếu chưa phải chunk cuối
        suffix = "," if i + ITEMS_PER_LINE < len(keys) else ""
        lines.append(f"    {row}{suffix}")
    lines.append("];")
    content = "\n".join(lines) + "\n"

    # Ghi file
    js_path.write_text(content, encoding="utf-8")
    print(f"[INFO] Đã ghi {js_path}")
    print(f"[INFO] Tổng: {len(keys)} key, {len(lines) - 2} dòng data")
    print("=" * 50)


if __name__ == "__main__":
    build_listmp3_js()
