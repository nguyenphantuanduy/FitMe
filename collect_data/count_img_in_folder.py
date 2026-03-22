from pathlib import Path

def count_files_in_folders(folder_list):
    """
    Nhận list các đường dẫn thư mục và trả về tuple chứa số lượng file của từng thư mục.
    """
    counts = []
    
    for folder in folder_list:
        path = Path(folder)
        
        # Kiểm tra xem đường dẫn có tồn tại và đúng là một thư mục không
        if path.exists() and path.is_dir():
            # Đếm số lượng phần tử là file (bỏ qua thư mục con)
            file_count = sum(1 for item in path.iterdir() if item.is_file())
            counts.append(file_count)
        else:
            # Nếu thư mục không tồn tại, mặc định số file là 0
            counts.append(0)
            
    # Chuyển đổi list kết quả thành tuple và trả về
    return tuple(counts)

# ==========================================
# CÁCH SỬ DỤNG
# ==========================================
if __name__ == "__main__":
    # Ví dụ bạn có list 3 thư mục tương ứng với 3 tập dữ liệu
    folders_to_check = [
        "collect_data/human_front_back/1",
        "collect_data/human_front_back/0",
    ]
    
    # Gọi hàm
    result_tuple = count_files_in_folders(folders_to_check)
    
    print(f"List thư mục đầu vào: {folders_to_check}")
    print(f"Tuple kết quả trả về: {result_tuple}")
    
    # Bạn có thể unpack (giải nén) tuple này ra các biến riêng lẻ nếu cần
    # train_count, valid_count, test_count = result_tuple