# 👗 FitMe – AI-Powered Virtual Try-On E-Commerce System

FitMe is a hybrid web-based e-commerce simulation system integrated with artificial intelligence, designed to provide a virtual fitting room experience for online fashion shopping.

The system allows users to browse clothing uploaded by sellers, select desired outfits, and enter a Virtual Try-On Room where AI models generate realistic try-on results based on user poses. Users can visualize clothing from multiple viewing angles such as front view, side view, and back view.

FitMe addresses common challenges in online fashion shopping.

- For users: reduces uncertainty when selecting clothing without physical trials.
- For sellers: helps reduce return rates and increases customer confidence.
- For businesses: enhances product visualization and shopping experience.

Technically, FitMe is built as a hybrid system consisting of:

- 🤖 AI Server (Python + FastAPI)
- 🛒 Commercial Backend (Node.js)
- 🎨 Frontend (React.js)
- 🗄️ Database (PostgreSQL)

The AI module integrates pretrained and fine-tuned deep learning models to generate virtual try-on results and determine user orientation.

---

# 🚀 Features

## 👤 User Features

- Register user account
- Login authentication
- Browse clothing products
- Enter Virtual Try-On Room
- Perform pose-based virtual try-on
- View clothing results from different angles

## 🛍️ Seller Features

- Register seller account
- Login authentication
- Upload clothing products
- Manage product catalog

## 🤖 AI Features

- Virtual Try-On image generation
- Pose-based clothing orientation detection
- Multi-angle clothing visualization
- AI inference via FastAPI server

---

# 🧠 AI Models

## 1️⃣ FASHN-VTON 1.5 (Pretrained)

**Purpose**

- Generate virtual try-on results
- Combine user image and clothing image

**Input**

- Person image
- Clothing image

**Output**

- Virtual try-on generated image

**Training**

- Pretrained model
- Used directly without retraining

---

## 2️⃣ EfficientNet-B1 (Fine-Tuned)

**Purpose**

- Classify user orientation:
  - Front
  - Back

This helps select the correct clothing type.

**Architecture**

- Backbone: Pretrained EfficientNet-B1
- Custom classification head

**Training Details**

- Custom dataset (~5000 images)
- Dataset created by merging YOLO detection datasets
- Manual labeling applied
- Fine-tuned for classification task

---

# 🏗️ System Architecture

## 📂 Project Structure

```text
FitMe/
│
├── backend/
│   │
│   ├── AI_Server/
│   │   ├── fashn_vton_1_5/        # Virtual Try-On model package
│   │   ├── ai_server.py           # FastAPI entry point
│   │   ├── requirements.txt       # Python dependencies
│   │
│   ├── Commercial_Server/
│   │   ├── controllers/           # Business logic handlers
│   │   ├── routes/                # API route definitions
│   │   ├── middleware/            # Authentication middleware
│   │   ├── models/                # Database models
│
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Application pages
│   │   ├── components/            # Reusable UI components
│   │   ├── tryOnApp/              # Virtual Try-On module
│
├── weights/                       # AI model weights
│
├── database/                      # Database schema / SQL files
│
├── docker/                        # Docker configuration
│
├── README.md                      # Project documentation
```

# ⚙️ Installation Guide

This section explains how to run the full system locally.

---

## 🧪 Step 1 — Create Virtual Environment

Create Python virtual environment:

```bash
python -m venv venv
```
Activate environment:

Linux / Mac
```bash
source venv/bin/activate
```
Windows
```bash
venv\Scripts\activate
```
## 🧩 Step 2 — Install System Dependencies (Linux Only)
sudo apt update
sudo apt install -y libgl1
## 🤖 Step 3 — Setup AI Server

Go to AI Server directory:

```bash
cd backend/AI_Server/
cd fashn_vton_1_5
```

Install local library:

```bash
pip install -e .
```

Install remaining dependencies:

```bash
cd ..
pip install -r requirements.txt
cd ../..
```

Download pretrained weights:

```bash
python backend/AI_Server/fashn_vton_1_5/scripts/download_weights.py \
--weights-dir ./weights/fashn_vton_weights
```

Run AI server:

```bash
uvicorn backend.AI_Server.ai_server:app \
--host 0.0.0.0 \
--port 8000
```
AI Server runs at:
http://localhost:8000
## 🛒 Step 4 — Run Commercial Server (Node.js)

Open a new terminal.

Install nodemon globally:

npm install -g nodemon

Go to Commercial Server:

cd backend/Commercial_Server

Install dependencies:

npm install

Run server:

npm run dev
🎨 Step 5 — Run Frontend (React)

Open another terminal:

cd frontend

Install dependencies:

npm install

Run frontend:

npm run dev

Frontend runs at:

http://localhost:5173
🔐 Authentication

The system uses:

Cookie-based authentication
JWT tokens
bcrypt password hashing

Used for:

User login
Seller login
Secure API communication
🧪 Example Workflow

Typical system workflow:

User registers an account
Seller uploads clothing products
User logs in
User selects clothing
User enters Virtual Try-On Room
User performs pose
AI Server generates try-on result
Result is displayed on UI
📊 Dataset Information

Custom dataset used for EfficientNet-B1 training.

Dataset details:

Total images: ~5000
Source: Merged YOLO detection datasets
Labels:
Front
Back

Used for:

User orientation classification
Clothing type selection
🧪 Deployment

Tested deployment setup:

AI Server deployed on Docker GPU environment
Commercial Server running on localhost
Frontend running on localhost
📸 Demo (Add Screenshots Here)

Recommended screenshots:

Register Page
Login Page
Seller Upload Product
Virtual Try-On Room
Generated Try-On Result
