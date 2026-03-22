from roboflow import Roboflow

def download_data(
    api_key="inr9jRHmkEY62398BiMk",
    workspace="duys-workspace-4jeqe",
    project_name="human-front-zfmgf",
    version_number=1,
    format_type="yolov8"
):
    rf = Roboflow(api_key=api_key)
    project = rf.workspace(workspace).project(project_name)
    version = project.version(version_number)
    dataset = version.download(format_type)
    print("Download completed!")
    return dataset


import shutil
from pathlib import Path


def get_image_label(label_path):
    """
    Đọc label YOLO txt và quyết định label cho image.
    Return: 0 hoặc 1 nếu hợp lệ, None nếu bỏ ảnh
    """
    if not label_path.exists():
        return None

    labels = []

    with open(label_path, "r") as f:
        lines = f.readlines()

    for line in lines:
        parts = line.strip().split()
        if len(parts) == 0:
            continue
        cls_id = int(parts[0])
        if cls_id in [0, 1]:
            labels.append(cls_id)

    if len(labels) == 0:
        return None

    unique_labels = set(labels)

    if len(unique_labels) == 1:
        return unique_labels.pop()

    # nếu nhiều class khác nhau → bỏ
    return None


def collect_data(
    src_root="./human-front-1",
    dst_root="./human_front_back"
):
    """
    Convert YOLOv8 detection dataset → classification dataset.
    Gộp tất cả split vào một thư mục duy nhất theo class.
    """
    src_root = Path(src_root)
    dst_root = Path(dst_root)

    # Tạo folder class 0 và 1
    (dst_root / "0").mkdir(parents=True, exist_ok=True)
    (dst_root / "1").mkdir(parents=True, exist_ok=True)

    splits = ["train", "valid", "test"]

    total_kept = 0
    total_skipped = 0

    for split in splits:
        images_dir = src_root / split / "images"
        labels_dir = src_root / split / "labels"

        if not images_dir.exists():
            print(f"{split}: no images folder, skipping")
            continue

        image_files = list(images_dir.glob("*.*"))
        kept = 0
        skipped = 0

        for img_path in image_files:
            label_path = labels_dir / (img_path.stem + ".txt")
            img_label = get_image_label(label_path)

            if img_label is None:
                skipped += 1
                continue

            dst_img_path = dst_root / str(img_label) / img_path.name

            # Tránh overwrite nếu trùng tên
            if dst_img_path.exists():
                new_name = img_path.stem + f"_{split}" + img_path.suffix
                dst_img_path = dst_root / str(img_label) / new_name

            shutil.copy(img_path, dst_img_path)
            kept += 1

        print(f"{split}: kept={kept}, skipped={skipped}")
        total_kept += kept
        total_skipped += skipped

    print(f"\nTotal: kept={total_kept}, skipped={total_skipped}")
    print("Done collecting dataset!")


def print_class_distribution(root_path="./human_front_back"):
    """
    In số lượng ảnh mỗi class.
    """
    root = Path(root_path)

    class_0_dir = root / "0"
    class_1_dir = root / "1"

    count_0 = len(list(class_0_dir.glob("*.*")))
    count_1 = len(list(class_1_dir.glob("*.*")))
    total = count_0 + count_1

    print("\nDataset Distribution:\n")
    print(f"  class 0: {count_0}")
    print(f"  class 1: {count_1}")
    print(f"  total  : {total}")

    if total > 0:
        p0 = count_0 / total * 100
        p1 = count_1 / total * 100
        print(f"\nRatio:")
        print(f"  class 0: {p0:.2f}%")
        print(f"  class 1: {p1:.2f}%")


def add_back_dataset_to_class0(
    src_root="./human-back-views-only-1",
    dst_root="./human_front_back"
):
    """
    Lấy ảnh từ dataset back-only (tất cả split)
    và add vào class 0 của dataset classification.
    """
    src_root = Path(src_root)
    dst_root = Path(dst_root)

    dst_class0 = dst_root / "0"
    dst_class0.mkdir(parents=True, exist_ok=True)

    splits = ["train", "valid", "test"]
    total_added = 0

    print("\nAdding BACK dataset to class 0...\n")

    for split in splits:
        src_images = src_root / split / "images"

        if not src_images.exists():
            print(f"{split}: no images folder, skipping")
            continue

        image_files = list(src_images.glob("*.*"))
        added = 0

        for img_path in image_files:
            dst_img_path = dst_class0 / img_path.name

            # Tránh overwrite nếu trùng tên
            if dst_img_path.exists():
                new_name = img_path.stem + f"_{split}_back" + img_path.suffix
                dst_img_path = dst_class0 / new_name

            shutil.copy(img_path, dst_img_path)
            added += 1

        print(f"{split}: added {added} images")
        total_added += added

    print(f"\nTotal added: {total_added}")
    print("Done adding BACK dataset!")


if __name__ == "__main__":
    download_data()
    collect_data()
    print_class_distribution()
    download_data(
        api_key="inr9jRHmkEY62398BiMk",
        workspace="duys-workspace-4jeqe",
        project_name="human-back-views-only-js9pt",
    )
    add_back_dataset_to_class0()