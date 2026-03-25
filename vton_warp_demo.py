# file: vton_warp_demo.py
import sys
import os
import glob
import cv2
import torch
import numpy as np
from collections import OrderedDict
from PIL import Image
import argparse

# ===== Thêm core vào path =====
sys.path.append("backend/AI_Server/RAFT/core")

from backend.AI_Server.RAFT.core.raft import RAFT
from backend.AI_Server.RAFT.core.utils.utils import InputPadder
from backend.AI_Server.RAFT.core.utils import flow_viz  # nếu muốn hiển thị flow

# ===== Device =====
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ===== Helper: load image =====
def load_image(imfile, target_size=None):
    img = np.array(Image.open(imfile)).astype(np.uint8)
    if target_size is not None:
        img = cv2.resize(img, (target_size[1], target_size[0]))  # (width, height)
    img = torch.from_numpy(img).permute(2,0,1).float()
    return img[None].to(DEVICE)

# ===== Warp VTON =====
def warp_vton(vton_old, flow):
    flow_np = flow[0].permute(1,2,0).cpu().numpy()
    dx = flow_np[:,:,0]
    dy = flow_np[:,:,1]
    h, w, _ = vton_old.shape
    map_x, map_y = np.meshgrid(np.arange(w), np.arange(h))
    map_x = (map_x + dx).astype(np.float32)
    map_y = (map_y + dy).astype(np.float32)
    warped = cv2.remap(vton_old, map_x, map_y, interpolation=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    return warped

# ===== Optional: viz flow giống demo gốc =====
def viz(img, flo):
    img = img[0].permute(1,2,0).cpu().numpy()
    flo = flo[0].permute(1,2,0).cpu().numpy()
    flo = flow_viz.flow_to_image(flo)
    img_flo = np.concatenate([img, flo], axis=0)
    cv2.imshow('image', img_flo[:, :, [2,1,0]]/255.0)
    cv2.waitKey(0)

# ===== Demo =====
def demo(args):
    # ===== Init RAFT =====
    model = RAFT(args)

    # ===== Load checkpoint =====
    state_dict = torch.load(args.model, map_location=DEVICE)
    new_state_dict = OrderedDict()
    for k, v in state_dict.items():
        name = k[7:] if k.startswith("module.") else k
        new_state_dict[name] = v
    model.load_state_dict(new_state_dict)

    model.to(DEVICE)
    model.eval()

    # ===== Load ảnh từ folder =====
    images = glob.glob(os.path.join(args.path, "*.png")) + \
             glob.glob(os.path.join(args.path, "*.jpg"))
    images = sorted(images)
    if len(images) < 2:
        raise ValueError("Cần ít nhất 2 ảnh trong folder để tính optical flow!")

    # ===== Xử lý từng cặp ảnh =====
    for imfile1, imfile2 in zip(images[:-1], images[1:]):
        print(f"Processing: {imfile1} → {imfile2}")

        # Load ảnh đầu tiên
        image1 = load_image(imfile1)
        h, w = image1.shape[2], image1.shape[3]

        # Load ảnh thứ hai: resize về cùng size ảnh 1
        image2 = load_image(imfile2, target_size=(h, w))

        # Pad để size bội số 8
        padder = InputPadder(image1.shape)
        image1, image2 = padder.pad(image1, image2)

        # Tính flow
        with torch.no_grad():
            flow_low, flow_up = model(image1, image2, iters=20, test_mode=True)

        # Warp VTON: dùng frame đầu tiên làm vton_old
        vton_old = cv2.imread(imfile1)
        vton_new_fake = warp_vton(vton_old, flow_up)

        # Hiển thị kết quả
        cv2.imshow("vton_old", vton_old)
        cv2.imshow("vton_fake", vton_new_fake)
        # Nếu muốn xem flow giống demo gốc, dùng: viz(image1, flow_up)
        cv2.waitKey(0)

    cv2.destroyAllWindows()

# ===== Main =====
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', required=True, help="restore checkpoint")
    parser.add_argument('--path', required=True, help="folder chứa frames để tính flow")
    parser.add_argument('--small', action='store_true', help='use small model')
    parser.add_argument('--mixed_precision', action='store_true', help='use mixed precision')
    parser.add_argument('--alternate_corr', action='store_true', help='use efficient correlation implementation')
    args = parser.parse_args()

    demo(args)