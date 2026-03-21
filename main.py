# from fashn_vton_1_5.src.fashn_vton.pipeline import TryOnPipeline
# from PIL import Image
# import os

# # Base directory (thư mục hiện tại)
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# # Initialize pipeline
# pipeline = TryOnPipeline(
#     weights_dir=os.path.join(BASE_DIR, "weights", "fashn_vton_weights")
# )

# # Load images
# person = Image.open(
#     os.path.join(
#         BASE_DIR,
#         "fashn_vton_1_5",
#         "examples",
#         "data",
#         "Thuan.jpg"
#     )
# ).convert("RGB")

# garment = Image.open(
#     os.path.join(
#         BASE_DIR,
#         "fashn_vton_1_5",
#         "examples",
#         "data",
#         "white_suit.jpg"
#     )
# ).convert("RGB")

# # Run inference
# result = pipeline(
#     person_image=person,
#     garment_image=garment,
#     category="tops",  # "tops" | "bottoms" | "one-pieces"
#     num_timesteps=12,
# )

# # Tạo thư mục output nếu chưa có
# output_dir = os.path.join(BASE_DIR, "output")
# os.makedirs(output_dir, exist_ok=True)

# # Save output
# output_path = os.path.join(output_dir, "output03.png")
# result.images[0].save(output_path)

# for img in result.images:
#     print(type(img))