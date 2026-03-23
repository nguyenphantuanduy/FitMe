import torch
from torch import nn
from torchvision import models, transforms
from PIL import Image
from typing import Literal
from abc import ABC, abstractmethod
import os
from ..config.frontback_model_config import EfficientNetb1Config

# ── Base abstract class ──
class FrontBackModel(ABC):
    @abstractmethod
    def __init__(self, config):
        pass

    @abstractmethod
    def detect(
        self,
        img: Image.Image,
    ) -> Literal["back", "front"]:
        pass

# ── Implementation for EfficientNet-B1 ──
class EfficientNetb1(FrontBackModel):
    def __init__(self, config: EfficientNetb1Config):
        """
        config: dict chứa các thông số:
            - model_path: đường dẫn checkpoint
            - device: "cuda" hoặc "cpu"
            - img_size: kích thước resize ảnh
        """
        self.device = config.device
        self.img_size = config.img_size
        self.model_path = config.model_path

        # Load pretrained EfficientNet-B1
        weights = models.EfficientNet_B1_Weights.DEFAULT
        self.model = models.efficientnet_b1(weights=weights)

        # Thay classifier head (2 class)
        in_features = self.model.classifier[1].in_features
        self.model.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features, 2),
        )

        # Load checkpoint
        self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()

        # Transform giống khi train
        self.transform = transforms.Compose([
            transforms.Resize((self.img_size, self.img_size)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

        # Class names
        self.classes = ["back", "front"]  # đặt theo thứ tự training

    def detect(self, img: Image.Image) -> Literal["back", "front"]:
        """
        Nhận ảnh PIL, trả về front hoặc back
        """
        x = self.transform(img).unsqueeze(0).to(self.device)  # add batch dim
        with torch.no_grad():
            logits = self.model(x)
            pred_idx = logits.argmax(1).item()
        return self.classes[pred_idx]

# ── Example usage ──
if __name__ == "__main__":
    config = EfficientNetb1Config()

    model = EfficientNetb1(config)

    # Test với một ảnh
    img = Image.open("test_img.jpg")
    result = model.detect(img)
    print("Predicted:", result)