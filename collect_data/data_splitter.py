import os
import shutil
from pathlib import Path
from sklearn.model_selection import train_test_split

def split_dataset_sklearn(src_dir, output_dir, seed=40):
    src_path = Path(src_dir)
    out_path = Path(output_dir)
    classes = ["0", "1"]
    
    # 1. Tạo sẵn các thư mục đích
    for split in ["train", "valid", "test"]:
        for cls in classes:
            (out_path / split / cls).mkdir(parents=True, exist_ok=True)
            
    print(f"Bắt đầu chia dữ liệu bằng Scikit-Learn (Seed: {seed})")

    # 2. Xử lý từng class
    for cls in classes:
        cls_dir = src_path / cls
        if not cls_dir.exists():
            continue
            
        images = list(cls_dir.glob("*.*"))
        total_images = len(images)
        if total_images == 0:
            continue

        # Lần 1: Tách 80% Train và 20% Temp
        train_files, temp_files = train_test_split(
            images, 
            test_size=0.2,        # Cắt 20% cho phần còn lại
            random_state=seed     # Cố định seed
        )
        
        # Lần 2: Tách 20% Temp thành 10% Valid và 10% Test (tức là chia đôi Temp)
        valid_files, test_files = train_test_split(
            temp_files, 
            test_size=0.5,        # Lấy một nửa của Temp
            random_state=seed     # Giữ nguyên seed
        )

        # 3. Hàm copy file
        def copy_files(file_list, split_name):
            dst_dir = out_path / split_name / cls
            for img in file_list:
                shutil.copy(img, dst_dir / img.name)
                
        # Thực hiện copy
        copy_files(train_files, "train")
        copy_files(valid_files, "valid")
        copy_files(test_files, "test")
        
        print(f"Class {cls} - Train: {len(train_files)} | Valid: {len(valid_files)} | Test: {len(test_files)}")

# ==========================================
# THỰC THI
# ==========================================
if __name__ == "__main__":
    SOURCE_DIR = "collect_data/human_front_back"
    OUTPUT_DIR = "human_front_back_final"
    
    split_dataset_sklearn(src_dir=SOURCE_DIR, output_dir=OUTPUT_DIR, seed=40)