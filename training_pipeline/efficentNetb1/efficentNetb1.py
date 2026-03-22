import os
import sys
import copy
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from torch.optim.lr_scheduler import CosineAnnealingLR
from tqdm import tqdm
from sklearn.metrics import accuracy_score, precision_score, recall_score, roc_auc_score

from ..myModel import myModel

# ── Logger ───────────────────────────────
class Logger:
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

# ── Trainer Class ────────────────────────
class EfficientNetB1Trainer(myModel):
    def __init__(self):
        super().__init__()

        # ===================== CONFIG =====================
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        torch.backends.cudnn.benchmark = True  # tối ưu GPU cho input size cố định

        self.DATA_DIR       = './human_front_back_final'
        self.IMG_SIZE       = 240
        self.BATCH_SIZE     = 32
        self.NUM_WORKERS    = 4
        self.NUM_EPOCHS     = 20
        self.LR_HEAD        = 1e-3
        self.LR_BACKBONE    = 1e-4
        self.UNFREEZE_EPOCH = 5
        self.NUM_CLASSES    = 2

        # ===================== TRANSFORMS =====================
        transform = transforms.Compose([
            transforms.Resize((self.IMG_SIZE, self.IMG_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
        ])

        # ===================== DATASET & DATALOADER =====================
        self.train_dataset = datasets.ImageFolder(os.path.join(self.DATA_DIR, 'train'), transform=transform)
        self.valid_dataset = datasets.ImageFolder(os.path.join(self.DATA_DIR, 'valid'), transform=transform)
        self.test_dataset  = datasets.ImageFolder(os.path.join(self.DATA_DIR, 'test'),  transform=transform)

        self.train_loader = DataLoader(self.train_dataset, batch_size=self.BATCH_SIZE, shuffle=True, num_workers=self.NUM_WORKERS, pin_memory=True)
        self.valid_loader = DataLoader(self.valid_dataset, batch_size=self.BATCH_SIZE, shuffle=False, num_workers=self.NUM_WORKERS, pin_memory=True)
        self.test_loader  = DataLoader(self.test_dataset,  batch_size=self.BATCH_SIZE, shuffle=False, num_workers=self.NUM_WORKERS, pin_memory=True)

        print("Classes:", self.train_dataset.classes)
        print("Dataset sizes:", {'train': len(self.train_dataset), 'valid': len(self.valid_dataset), 'test': len(self.test_dataset)})

        # ===================== MODEL =====================
        weights = models.EfficientNet_B1_Weights.DEFAULT
        self.model = models.efficientnet_b1(weights=weights).to(self.device)

        # Freeze backbone
        for param in self.model.features.parameters():
            param.requires_grad = False

        # Replace classifier
        in_features = self.model.classifier[1].in_features
        self.model.classifier = nn.Sequential(
            nn.Dropout(0.3, inplace=True),
            nn.Linear(in_features, self.NUM_CLASSES)
        ).to(self.device)

        # ===================== LOSS + OPTIMIZER + SCHEDULER =====================
        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = optim.Adam(filter(lambda p: p.requires_grad, self.model.parameters()), lr=self.LR_HEAD)
        self.scheduler = CosineAnnealingLR(self.optimizer, T_max=self.NUM_EPOCHS)

        # ===================== EARLY STOPPING =====================
        self.early_stopping = self.EarlyStopping(patience=4)

    class EarlyStopping:
        def __init__(self, patience=4, min_delta=1e-4):
            self.patience = patience
            self.min_delta = min_delta
            self.counter = 0
            self.best_loss = float('inf')
            self.should_stop = False

        def step(self, val_loss):
            if val_loss < self.best_loss - self.min_delta:
                self.best_loss = val_loss
                self.counter = 0
            else:
                self.counter += 1
                print(f'  EarlyStopping: {self.counter}/{self.patience}')
                if self.counter >= self.patience:
                    self.should_stop = True
            return self.should_stop

    # ===================== TRAIN/VALID =====================
    def train_one_epoch(self, loader):
        self.model.train()
        running_loss, correct = 0.0, 0
        for imgs, lbls in tqdm(loader, desc="Training"):
            imgs, lbls = imgs.to(self.device), lbls.to(self.device)
            self.optimizer.zero_grad()
            outputs = self.model(imgs)
            loss = self.criterion(outputs, lbls)
            loss.backward()
            self.optimizer.step()
            running_loss += loss.item() * imgs.size(0)
            correct += (outputs.argmax(1) == lbls).sum().item()
        return running_loss / len(loader.dataset), correct / len(loader.dataset)

    @torch.no_grad()
    def validate(self, loader):
        self.model.eval()
        running_loss, correct = 0.0, 0
        for imgs, lbls in loader:
            imgs, lbls = imgs.to(self.device), lbls.to(self.device)
            outputs = self.model(imgs)
            loss = self.criterion(outputs, lbls)
            running_loss += loss.item() * imgs.size(0)
            correct += (outputs.argmax(1) == lbls).sum().item()
        return running_loss / len(loader.dataset), correct / len(loader.dataset)

    @torch.no_grad()
    def test(self):
        self.model.eval()
        all_labels, all_preds, all_probs = [], [], []
        for imgs, lbls in self.test_loader:
            imgs, lbls = imgs.to(self.device), lbls.to(self.device)
            outputs = self.model(imgs)
            probs = torch.softmax(outputs, dim=1)
            preds = outputs.argmax(1)
            all_labels.extend(lbls.cpu().numpy())
            all_preds.extend(preds.cpu().numpy())
            all_probs.extend(probs[:,1].cpu().numpy())

        print("\n📊 Test Metrics:")
        print(f"Accuracy : {accuracy_score(all_labels, all_preds):.4f}")
        print(f"Precision: {precision_score(all_labels, all_preds):.4f}")
        print(f"Recall   : {recall_score(all_labels, all_preds):.4f}")
        print(f"AUC-ROC  : {roc_auc_score(all_labels, all_probs):.4f}")

    # ===================== TRAINING LOOP =====================
    def training(self):
        best_acc = 0.0
        best_weights = copy.deepcopy(self.model.state_dict())

        for epoch in range(1, self.NUM_EPOCHS+1):
            # Unfreeze backbone
            if epoch == self.UNFREEZE_EPOCH:
                print(f'\n[Epoch {epoch}] Unfreezing backbone, LR={self.LR_BACKBONE}')
                for param in self.model.features.parameters():
                    param.requires_grad = True
                self.optimizer = optim.Adam(self.model.parameters(), lr=self.LR_BACKBONE)
                self.scheduler = CosineAnnealingLR(self.optimizer, T_max=self.NUM_EPOCHS - self.UNFREEZE_EPOCH)

            t_loss, t_acc = self.train_one_epoch(self.train_loader)
            v_loss, v_acc = self.validate(self.valid_loader)
            self.scheduler.step()

            tag = ' ← best' if v_acc > best_acc else ''
            if v_acc > best_acc:
                best_acc = v_acc
                best_weights = copy.deepcopy(self.model.state_dict())
                torch.save(best_weights, './weights/efficientNetb1_best.pth')

            print(f'Epoch {epoch}/{self.NUM_EPOCHS} | Train loss {t_loss:.4f} acc {t_acc:.4f} | Val loss {v_loss:.4f} acc {v_acc:.4f}{tag}')

            if self.early_stopping.step(v_loss):
                print(f'\nEarly stopping at epoch {epoch}.')
                break

        self.model.load_state_dict(best_weights)
        print(f'\nBest val acc: {best_acc:.4f}')
        self.test()


def main():
    sys.stdout = Logger('./training_pipeline/efficientNetb1/log.txt')
    print("🚀 Starting EfficientNet-B1 Training on GPU...")
    trainer = EfficientNetB1Trainer()
    trainer.training()

if __name__ == "__main__":
    main()