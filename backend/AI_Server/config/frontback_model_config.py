from dataclasses import dataclass
import torch

@dataclass
class EfficientNetb1Config:
    model_path: str = "./weights/efficentNetb1/efficientnet_b1.pt"
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    img_size: str = 240