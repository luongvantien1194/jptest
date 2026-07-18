import os

# Cấu hình thư mục đích (để trống nếu muốn tạo ngay tại thư mục chứa file python này)
# Ví dụ nếu muốn bỏ vào thư mục data/vocabExtra: folder_path = "data/vocabExtra"
folder_path = "" 

# Tạo thư mục nếu cấu hình đường dẫn và thư mục đó chưa tồn tại
if folder_path and not os.path.exists(folder_path):
    os.makedirs(folder_path)

# Vòng lặp từ 2 đến 100 (range trong Python không tính số cuối nên phải để là 101)
for i in range(1, 101):
    file_name = f"{i}.js"
    file_url = os.path.join(folder_path, file_name) if folder_path else file_name
    
    # Mở file với chế độ 'w' (write) và đóng lại ngay để tạo file rỗng
    with open(file_url, 'w', encoding='utf-8') as f:
        pass

print("Đã tạo thành công các file rỗng từ 2.js đến 100.js!")