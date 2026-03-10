from gtts import gTTS
import json
import os

input_file = "data.json"
output_folder = "./sounds/"

# Tạo thư mục mp3 nếu chưa có
os.makedirs(output_folder, exist_ok=True)

# Đọc file JSON
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

for item in data:
    file_id = item["id"]
    text = item["Hiragana"]

    tts = gTTS(text=text, lang='ja')
    output_path = os.path.join(output_folder, f"{file_id}.mp3")
    tts.save(output_path)

    print(f"Đã tạo: {output_path}")

print("Hoàn thành!")
