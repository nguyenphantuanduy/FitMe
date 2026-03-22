import albumentations as A
import cv2
import os
from pathlib import Path

def create_aug_pipeline():
    """Định nghĩa các phép biến đổi ảnh (như lật, xoay, nhiễu hạt...)."""
    return A.Compose([
        A.HorizontalFlip(p=0.5),              # Lật ngang với xác suất 50%
        A.RandomBrightnessContrast(p=0.5),    # Thay đổi độ sáng/tương phản
        A.Rotate(limit=30, p=0.7),            # Xoay ngẫu nhiên từ -30 đến 30 độ
        A.GaussNoise(p=0.3)                   # Thêm nhiễu hạt
    ])

def augment_dataset(src_root, dst_root, num_augmented_per_image=3):
    """
    Tự động quét đệ quy, tạo và lưu ảnh augmented vào thư mục đích.
    """
    src_root = Path(src_root)
    dst_root = Path(dst_root)
    
    # 1. Quét toàn bộ file ảnh (jpeg, jpg, png) từ thư mục gốc và con
    image_paths = []
    for ext in ['*.jpg', '*.jpeg', '*.png']:
        image_paths.extend(src_root.rglob(ext))
        
    print(f"\nTìm thấy {len(image_paths)} ảnh gốc trong {src_root}...")
    print(f"Bắt đầu tạo dữ liệu mới vào {dst_root} (tạo {num_augmented_per_image} ảnh/ảnh gốc)\n")
    
    # Khởi tạo pipeline biến đổi
    aug_pipeline = create_aug_pipeline()
    total_generated = 0

    # 2. Lặp qua từng ảnh gốc tìm được
    for img_path in image_paths:
        image = cv2.imread(str(img_path))
        if image is None:
            print(f"Bỏ qua file: {img_path} (Không thể đọc)")
            continue
            
        # Chuyển hệ màu để xử lý chuẩn xác
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Tạo tên file mới
        base_name = img_path.stem
        
        # 3. Tạo ra số lượng ảnh augmented theo yêu cầu
        for i in range(num_augmented_per_image):
            # Áp dụng augmentation
            augmented = aug_pipeline(image=image)
            aug_img = augmented['image']
            
            # Chuyển lại hệ màu BGR để lưu file bằng OpenCV
            aug_img_bgr = cv2.cvtColor(aug_img, cv2.COLOR_RGB2BGR)
            
            # Xây dựng đường dẫn lưu file mới, giữ nguyên cấu trúc thư mục
            relative_path = img_path.relative_to(src_root).parent
            final_dst_dir = dst_root / relative_path
            final_dst_dir.mkdir(parents=True, exist_ok=True)
            
            aug_save_name = f"{base_name}_aug_{i}.jpg"
            save_path = final_dst_dir / aug_save_name
            
            # Lưu file
            cv2.imwrite(str(save_path), aug_img_bgr)
            total_generated += 1
            
        print(f" - Đã xử lý {img_path.name}")

    print(f"\nĐã tạo tổng cộng {total_generated} ảnh augmented.")

# ==========================================
# CÁCH SỬ DỤNG
# ==========================================
if __name__ == "__main__":
    # 1. Thư mục chứa ảnh gốc (Tự động quét cả thư mục con)
    # src_folder = "./đường_dẫn_tới_thư_mục_gốc"
    src_folder = "collect_data/human_front_back/0"
    
    # 2. Thư mục bạn muốn lưu tập dữ liệu mới
    # dst_folder = "./đường_dẫn_tới_thư_mục_đích"
    dst_folder = "collect_data/human_front_back/0"
    
    # 3. Số lượng ảnh augmented muốn tạo ra TỪ MỖI ảnh gốc
    num_to_generate = 3
    
    # Gọi hàm chạy
    # Lưu ý: Chắc chắn thư mục nguồn 'src_folder' có tồn tại trước khi chạy!
    if os.path.exists(src_folder):
        augment_dataset(src_folder, dst_folder, num_to_generate)
    else:
        print(f"Lỗi: Không tìm thấy thư mục nguồn {src_folder}")