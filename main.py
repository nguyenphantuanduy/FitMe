from fashn_vton_1_5.src.fashn_vton.pipeline import TryOnPipeline
from PIL import Image

# Initialize pipeline
pipeline = TryOnPipeline(weights_dir=r"D:\FitMe\weights\fashn_vton_weights")

# Load images
person = Image.open(r"D:\FitMe\fashn_vton_1_5\examples\data\Thuan.jpg").convert("RGB")
garment = Image.open(r"D:\FitMe\fashn_vton_1_5\examples\data\white_suit.jpg").convert("RGB")

# Run inference
result = pipeline(
    person_image=person,
    garment_image=garment,
    category="tops",  # "tops" | "bottoms" | "one-pieces"
)

# Save output
result.images[0].save(r"D:\FitMe\output02.png")
for img in result.images:
    print(type(img))
    img.show()
