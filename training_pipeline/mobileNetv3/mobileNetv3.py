import torch
import torch.nn as nn
import torch.optim as optim

from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision import transforms
from torchvision.models import mobilenet_v3_small
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    roc_auc_score
)

from tqdm import tqdm

from ..myModel import myModel

import sys
import os

class Logger:
    """Redirect stdout to console and file simultaneously."""
    def __init__(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        self.terminal = sys.stdout
        self.log = open(filepath, "a", encoding="utf-8")

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)

    def flush(self):
        self.terminal.flush()
        self.log.flush()


class mobileNetv3(myModel):

    def __init__(self):

        super().__init__()

        # =====================
        # CONFIG
        # =====================

        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        self.batch_size = 32
        self.lr = 1e-3
        self.epochs = 30

        self.base_dir = "./human_front_back_final"

        self.train_dir = f"{self.base_dir}/train"
        self.valid_dir = f"{self.base_dir}/valid"
        self.test_dir = f"{self.base_dir}/test"

        self.img_size = 224

        # =====================
        # TRANSFORM
        # =====================

        transform = transforms.Compose([
            transforms.Resize((self.img_size, self.img_size)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

        # =====================
        # DATASET
        # =====================

        self.train_dataset = datasets.ImageFolder(
            root=self.train_dir,
            transform=transform
        )

        self.valid_dataset = datasets.ImageFolder(
            root=self.valid_dir,
            transform=transform
        )

        self.test_dataset = datasets.ImageFolder(
            root=self.test_dir,
            transform=transform
        )

        print("Classes:", self.train_dataset.classes)

        # =====================
        # DATALOADER
        # =====================

        self.train_loader = DataLoader(
            self.train_dataset,
            batch_size=self.batch_size,
            shuffle=True
        )

        self.valid_loader = DataLoader(
            self.valid_dataset,
            batch_size=self.batch_size,
            shuffle=False
        )

        self.test_loader = DataLoader(
            self.test_dataset,
            batch_size=self.batch_size,
            shuffle=False
        )

        # =====================
        # MODEL
        # =====================

        self.model = mobilenet_v3_small(
            weights="DEFAULT"
        )

        # Freeze backbone (khuyến nghị)

        for param in self.model.features.parameters():
            param.requires_grad = False

        # sửa classifier

        in_features = self.model.classifier[3].in_features

        self.model.classifier[3] = nn.Linear(
            in_features,
            2
        )

        self.model = self.model.to(self.device)

        # =====================
        # LOSS + OPTIMIZER
        # =====================

        self.criterion = nn.CrossEntropyLoss()

        self.optimizer = optim.Adam(
            self.model.parameters(),
            lr=self.lr
        )

    # =====================
    # TRAIN 1 EPOCH
    # =====================

    def train_one_epoch(self):

        self.model.train()

        total_loss = 0

        loop = tqdm(self.train_loader)

        for images, labels in loop:

            images = images.to(self.device)
            labels = labels.to(self.device)

            outputs = self.model(images)

            loss = self.criterion(outputs, labels)

            self.optimizer.zero_grad()

            loss.backward()

            self.optimizer.step()

            total_loss += loss.item()

            loop.set_description("Training")
            loop.set_postfix(loss=loss.item())

        return total_loss / len(self.train_loader)

    # =====================
    # VALIDATE
    # =====================

    def validate_loss(self):
        self.model.eval()
        total_loss = 0
        with torch.no_grad():
            for images, labels in self.valid_loader:
                images = images.to(self.device)
                labels = labels.to(self.device)
                outputs = self.model(images)
                loss = self.criterion(outputs, labels)
                total_loss += loss.item()
        return total_loss / len(self.valid_loader)

    # =====================
    # TEST
    # =====================

    def test(self):

        self.model.eval()

        all_labels = []
        all_preds = []
        all_probs = []

        with torch.no_grad():

            for images, labels in self.test_loader:

                images = images.to(self.device)
                labels = labels.to(self.device)

                outputs = self.model(images)

                probs = torch.softmax(outputs, dim=1)

                preds = outputs.argmax(1)

                # lưu dữ liệu
                all_labels.extend(labels.cpu().numpy())
                all_preds.extend(preds.cpu().numpy())

                # lấy xác suất class 1 cho AUC
                all_probs.extend(probs[:, 1].cpu().numpy())

        # =====================
        # METRICS
        # =====================

        acc = accuracy_score(
            all_labels,
            all_preds
        )

        precision = precision_score(
            all_labels,
            all_preds
        )

        recall = recall_score(
            all_labels,
            all_preds
        )

        auc = roc_auc_score(
            all_labels,
            all_probs
        )

        print("\n📊 Test Metrics:")
        print(f"Accuracy : {acc:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall   : {recall:.4f}")
        print(f"AUC-ROC  : {auc:.4f}")

    # =====================
    # MAIN TRAINING
    # =====================

    def training(self, patience=5):
        best_val_loss = float('inf')  # khởi tạo bằng vô cực
        epochs_no_improve = 0         # đếm số epoch liên tiếp không giảm

        for epoch in range(self.epochs):
            print(f"\nEpoch {epoch+1}/{self.epochs}")

            # 1️⃣ train 1 epoch
            train_loss = self.train_one_epoch()

            # 2️⃣ tính val_loss
            val_loss = self.validate_loss()

            print(f"Train Loss: {train_loss:.4f}")
            print(f"Val Loss  : {val_loss:.4f}")

            # 3️⃣ kiểm tra cải thiện val_loss
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                epochs_no_improve = 0  # reset counter
                torch.save(
                    self.model.state_dict(),
                    "./weights/mobileNetv3/mobilenetv3_front_back.pth"
                )
                print("Model saved! ✅")
            else:
                epochs_no_improve += 1
                print(f"No improvement for {epochs_no_improve} epoch(s)")

            # 4️⃣ kiểm tra patience
            if epochs_no_improve >= patience:
                print(f"\nEarly stopping triggered after {epoch+1} epochs.")
                break

        print("\nTraining finished.")

        # chạy test cuối
        self.test()

def main():

    log_path = "./training_pipeline/mobileNetv3/log.txt"

    # redirect stdout
    sys.stdout = Logger(log_path)

    print("🚀 Starting MobileNetV3 Training...")

    # tạo model
    model = mobileNetv3()

    # bắt đầu training
    model.training()

if __name__ == "__main__":
    main()