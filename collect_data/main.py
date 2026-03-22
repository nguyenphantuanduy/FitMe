from roboflow import Roboflow

def download_data(
    api_key="inr9jRHmkEY62398BiMk",
    workspace="duys-workspace-4jeqe",
    project_name="human-front-zfmgf",
    version_number=1,
    format_type="yolov8"   # classification format
):
    """
    Download dataset từ Roboflow (classification).

    Args:
        api_key (str): Roboflow API key
        workspace (str): Workspace name
        project_name (str): Project name
        version_number (int): Dataset version
        format_type (str): Dataset format (multiclass cho classification)

    Returns:
        dataset: Dataset object
    """

    rf = Roboflow(api_key=api_key)

    project = rf.workspace(workspace).project(project_name)

    version = project.version(version_number)

    dataset = version.download(format_type)

    print("✅ Download completed!")

    return dataset

import shutil
from pathlib import Path


def get_image_label(label_path):
    """
    Đọc label YOLO txt và quyết định label cho image.

    Return:
        0 hoặc 1 nếu hợp lệ
        None nếu bỏ ảnh
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

        # chỉ lấy class 0 hoặc 1
        if cls_id in [0, 1]:
            labels.append(cls_id)

    if len(labels) == 0:
        return None

    unique_labels = set(labels)

    # nếu nhiều obj cùng label
    if len(unique_labels) == 1:
        return unique_labels.pop()

    # nếu khác label → bỏ
    return None


def process_split(src_split_path, dst_split_path):
    """
    Xử lý từng split: train / valid / test
    """

    images_dir = src_split_path / "images"
    labels_dir = src_split_path / "labels"

    if not images_dir.exists():
        return

    # tạo folder class 0 và 1
    (dst_split_path / "0").mkdir(parents=True, exist_ok=True)
    (dst_split_path / "1").mkdir(parents=True, exist_ok=True)

    image_files = list(images_dir.glob("*.*"))

    kept = 0
    skipped = 0

    for img_path in image_files:

        label_path = labels_dir / (img_path.stem + ".txt")

        img_label = get_image_label(label_path)

        if img_label is None:
            skipped += 1
            continue

        dst_img_path = (
            dst_split_path
            / str(img_label)
            / img_path.name
        )

        shutil.copy(img_path, dst_img_path)

        kept += 1

    print(f"{src_split_path.name}: kept={kept}, skipped={skipped}")


def collect_data():
    """
    Convert YOLOv8 detection dataset
    → classification dataset
    """

    # dataset gốc
    src_root = Path("./human-front-1")

    # dataset mới
    dst_root = Path("./human_front_back")

    splits = ["train", "valid", "test"]

    for split in splits:

        src_split = src_root / split
        dst_split = dst_root / split

        process_split(src_split, dst_split)

    print("\nDone collecting dataset!")

from pathlib import Path

def print_class_distribution(root_path="./human_front_back"):
    """
    In số lượng ảnh mỗi class trong từng split.

    Args:
        root_path: đường dẫn dataset classification
    """

    root = Path(root_path)

    splits = ["train", "valid", "test"]

    total_0 = 0
    total_1 = 0

    print("\n📊 Dataset Distribution:\n")

    for split in splits:

        split_path = root / split

        class_0_dir = split_path / "0"
        class_1_dir = split_path / "1"

        count_0 = len(list(class_0_dir.glob("*.*")))
        count_1 = len(list(class_1_dir.glob("*.*")))

        total_0 += count_0
        total_1 += count_1

        print(f"{split.upper()}:")
        print(f"  class 0: {count_0}")
        print(f"  class 1: {count_1}")
        print()

    print("TOTAL:")
    print(f"  class 0: {total_0}")
    print(f"  class 1: {total_1}")

    # tính tỉ lệ %
    total = total_0 + total_1

    if total > 0:
        p0 = total_0 / total * 100
        p1 = total_1 / total * 100

        print("\nRatio:")
        print(f"  class 0: {p0:.2f}%")
        print(f"  class 1: {p1:.2f}%")

# Chạy trực tiếp file
if __name__ == "__main__":
    # download_data()
    # collect_data()
    print_class_distribution()

    