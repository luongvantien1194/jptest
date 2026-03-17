# TÀI LIỆU CHUYÊN SÂU: THỂ ない (THỂ PHỦ ĐỊNH - NAI FORM)

Thể ない dùng để phủ định một hành động hoặc trạng thái ở hiện tại hoặc tương lai trong giao tiếp thân mật.

---

## 1. CÁCH CHIA THỂ ない (CONJUGATION)

### ● ĐỘNG TỪ (VERBS)
Đây là thể yêu cầu bạn phải nắm vững bảng chữ cái hàng **あ (a)**.

| Nhóm | Quy tắc biến đổi | Ví dụ (Từ điển → Thể ない) |
|:---:|:---|:---|
| **Nhóm 1** | Chuyển đuôi hàng **u** → **hàng a** + **ない** | 書く (ka**ku**) → **書かない** (ka**ka**nai) |
| | *Lưu ý riêng đuôi **う**:* Chuyển thành **わ** (không phải あ) | 買う (ka**u**) → **買わない** (ka**wa**nai) |
| **Nhóm 2** | Bỏ **る** + **ない** | 食べる → **食べない**; 見る → **見ない** |
| **Nhóm 3** | **Bất quy tắc (Học thuộc)** | する → **しない** |
| | | 来る (kuru) → **こない** (konai) |

> **Cảnh báo đặc biệt:** Động từ **ある (aru - có)** khi chuyển sang thể ない sẽ biến mất hoàn toàn và chỉ còn là **ない** (không phải aranai).

---

### ● TÍNH TỪ (ADJECTIVES)
Tính từ khi phủ định sẽ biến đổi phần đuôi để kết hợp với `nai`.

| Loại tính từ | Quy tắc biến đổi | Ví dụ (Từ điển → Thể ない) |
|:---:|:---|:---|
| **Tính từ đuôi -i** | Bỏ **い** + **くない** | 高い → **高くない** (Không đắt) |
| **Tính từ đuôi -na** | Bỏ **な** + **ではない / じゃない** | 暇な → **暇ではない** (Không rảnh) |
| **Trường hợp đặc biệt**| **いい** (Tốt) → **よくない** | |

---

### ● DANH TỪ (NOUNS)
Tương tự như tính từ đuôi -na, danh từ đi kèm với trợ từ phủ định.

| Quy tắc | Ví dụ |
|:---|:---|
| **Danh từ + ではない / じゃない** | 学生**ではない** (Không phải học sinh) |
| | 雨**じゃない** (Không phải mưa) |

---

## 2. CÁC CẤU TRÚC PHỔ BIẾN VỚI THỂ ない

Thể ない là "linh hồn" của nhiều mẫu ngữ pháp quan trọng:

1. **V-nai + でください:** Xin đừng làm gì đó (Yêu cầu).
2. **V-nai + なければなりません:** Phải làm gì đó (Bắt buộc).
3. **V-nai + なくてもいいです:** Không làm cũng được (Cho phép).
4. **V-nai + で:** Làm V2 mà không làm V1.
   * *Ví dụ:* 朝ご飯を食べないで、学校へ行く (Đi học mà không ăn sáng).
5. **V-nai + な:** Thể cấm đoán mạnh (Dạng ngắn của V-u na).

---

## 3. LƯU Ý VỀ THÌ QUÁ KHỨ PHỦ ĐỊNH

Khi đã có dạng **ない**, bạn có thể coi nó như một **Tính từ đuôi -i** để chia tiếp sang quá khứ:

* **Công thức:** Bỏ **い** + **かった**
* **Ví dụ:**
    * Động từ: 食べない → **食べなかった** (Đã không ăn).
    * Tính từ: 高くない → **高くなかった** (Đã không đắt).
    * Danh từ: じゃない → **じゃなかった** (Đã không phải là).

---

## 4. LOGIC LẬP TRÌNH (DEVELOPER NOTES)

* **Nhóm 1 âm "a":** Luôn kiểm tra các từ kết thúc bằng `u` (như `kau, iu, au`) để map sang `wa` thay vì `a`.
* **Trường hợp đặc biệt `aru`:** Trong database, hãy set cứng `aru.nai_form = "nai"` vì nó không tuân theo quy tắc `u -> a`.
* **Sự khác biệt ではない và じゃない:** `ではない` dùng trong văn viết/trang trọng, `じゃない` dùng trong văn nói.