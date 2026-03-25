# ai_server.py
import os
from io import BytesIO
from typing import Optional, List

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Cookie
from fastapi.responses import StreamingResponse
from PIL import Image
import torch
import jwt

# =========================
# IMPORT MODELS
# =========================
from .models.vton_model import FashnVtonModel
from .models.frontback_model import EfficientNetb1
from .config.vton_model_config import FashnVtonModelConfig
from .config.frontback_model_config import EfficientNetb1Config

# =========================
# CONFIG JWT
# =========================
JWT_SECRET = os.environ.get("JWT_SECRET", "fitme_secret")

# =========================
# INIT MODELS
# =========================

# FrontBack model
fb_config = EfficientNetb1Config()
fb_model = EfficientNetb1(fb_config)

# VTON model
vton_config = FashnVtonModelConfig()
vton_model = FashnVtonModel(vton_config)

# =========================
# UTILS
# =========================

def read_pil(file: UploadFile) -> Image.Image:
    return Image.open(BytesIO(file.file.read())).convert("RGB")


def verify_cookie(fitme_auth: Optional[str] = Cookie(None)):
    """
    Verify JWT cookie from frontend (Node.js style)
    """
    if not fitme_auth:
        raise HTTPException(status_code=401, detail="Chưa đăng nhập")

    try:
        payload = jwt.decode(fitme_auth, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="JWT đã hết hạn")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="JWT không hợp lệ")

    # payload có dạng: { "uuid": "...", "username": "...", "role": "..." }
    return payload

# =========================
# FASTAPI APP
# =========================

app = FastAPI(title="Virtual Try-On AI Server")


@app.post("/vton/generate")
async def generate_vton(
    person_img: UploadFile = File(...),
    tops_front: Optional[UploadFile] = File(None),
    tops_back: Optional[UploadFile] = File(None),
    bottoms_front: Optional[UploadFile] = File(None),
    bottoms_back: Optional[UploadFile] = File(None),
    onepieces_front: Optional[UploadFile] = File(None),
    onepieces_back: Optional[UploadFile] = File(None),
    user_data: dict = Depends(verify_cookie)  # <- payload JWT
):
    """
    Generate virtual try-on image
    """
    # payload JWT đã được verify, không cần check role nữa
    # user_uuid = user_data.get("uuid")
    # username = user_data.get("username")
    # role = user_data.get("role")

    # 1️⃣ Load person image
    person = read_pil(person_img)

    # 2️⃣ Detect front/back
    person_orientation = fb_model.detect(person)  # "front" hoặc "back"

    # 3️⃣ Build garments list
    garments = []

    if person_orientation == "front":
        if tops_front:
            garments.append((read_pil(tops_front), "tops"))
        if bottoms_front:
            garments.append((read_pil(bottoms_front), "bottoms"))
        if onepieces_front:
            garments.append((read_pil(onepieces_front), "one-pieces"))
    else:  # back
        if tops_back:
            garments.append((read_pil(tops_back), "tops"))
        if bottoms_back:
            garments.append((read_pil(bottoms_back), "bottoms"))
        if onepieces_back:
            garments.append((read_pil(onepieces_back), "one-pieces"))

    # 4️⃣ Generate collage
    if not garments:
        raise HTTPException(status_code=400, detail="No garment provided")

    result_img = vton_model.collage(person, garments)

    # 5️⃣ Return image as bytes
    img_bytes = BytesIO()
    result_img.save(img_bytes, format="PNG")
    img_bytes.seek(0)

    return StreamingResponse(img_bytes, media_type="image/png")