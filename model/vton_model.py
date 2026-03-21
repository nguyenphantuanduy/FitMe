from abc import ABC, abstractmethod
from PIL import Image
from config.vton_model_config import FashnVtonModelConfig
from fashn_vton_1_5.src.fashn_vton.pipeline import TryOnPipeline
from typing import Literal, Tuple, List

class VTonModel(ABC):
    @abstractmethod
    def __init__(self, config):
        pass
    
    @abstractmethod
    def collage(
        self,
        person: Image.Image,
        garments: List[Tuple[Image.Image, Literal["tops", "bottoms", "one-pieces"]]]
    ) -> Image.Image:
        pass

class FashnVtonModel(VTonModel):
    def __init__(
            self,
            config: FashnVtonModelConfig
    ):
        self.weights_dir = config.weights_dir
        self.num_timesteps = config.num_timesteps
        self.num_samples = config.num_samples
        self.pipeline = TryOnPipeline(
            weights_dir=self.weights_dir
        )
    
    def ensure_rgb(self, img: Image.Image) -> Image.Image:
        return img.convert("RGB") if img.mode != "RGB" else img

    def collage(
            self,
            person: Image.Image,
            garments: List[Tuple[Image.Image, Literal["tops", "bottoms", "one-pieces"]]]
    ) -> Image.Image:
        
        result = self.ensure_rgb(person)

        for garment, category in garments:
            result = self.ensure_rgb(result)
            garment = self.ensure_rgb(garment)
            result = self.pipeline(
                person_image=result,
                garment_image=garment,
                num_timesteps=self.num_timesteps,
                category=category,
                num_samples=self.num_samples
            ).images[0]

        return result


import os
from PIL import Image
from config.vton_model_config import FashnVtonModelConfig

if __name__ == "__main__":
    # ==== Cấu hình model ====
    config = FashnVtonModelConfig(
        weights_dir="./weights/fashn_vton_weights",  # sửa đường dẫn nếu cần
        num_timesteps=12,
        num_samples=1
    )
    model = FashnVtonModel(config)

    # ==== Đường dẫn input ====
    person_path = "./person.jpg"
    garments_info = [
        ("./T_shirt.webp", "tops"),
        ("./jogger.webp", "bottoms"),
        # thêm garment khác nếu muốn
    ]

    # ==== Load ảnh và chuẩn hóa RGB ====
    person_img = Image.open(person_path)
    garments = [(Image.open(path), category) for path, category in garments_info]

    # ==== Chạy collage ====
    result = model.collage(person=person_img, garments=garments)

    # ==== Tạo thư mục output nếu chưa có ====
    output_dir = "./output"
    os.makedirs(output_dir, exist_ok=True)

    # ==== Lưu kết quả ====
    output_path = os.path.join(output_dir, "result.png")
    result.save(output_path)
    print(f"Saved result to {output_path}")