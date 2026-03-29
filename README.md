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

```bash
npm install -g nodemon
```

Go to Commercial Server:

```bash
cd backend/Commercial_Server
```

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm run dev
```
Commercial Server runs at:
http://localhost:3000
## 🎨 Step 5 — Run Frontend (React)

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:
http://localhost:5173

# 🔐 Authentication

The system implements secure authentication mechanisms to protect user data and system access.

## Security Methods Used

- **Cookie-based authentication**
- **JWT (JSON Web Token)**
- **bcrypt password hashing**

## Applied For

- User login authentication
- Seller login authentication
- Secure API communication between frontend and backend

---

# 🧪 Example Workflow

Below is a typical workflow demonstrating how users interact with the system.

```text
1. User registers an account
2. Seller uploads clothing products
3. User logs into the system
4. User selects desired clothing
5. User enters the Virtual Try-On Room
6. User performs body pose
7. AI Server processes the input
8. Virtual try-on result is generated
9. Result is displayed on the user interface
```

---

# 📊 Dataset Information

A custom dataset was created to train the **EfficientNet-B1** model for user orientation classification.

## Dataset Details

- **Total images:** ~5000 images
- **Source:** Merged YOLO detection datasets
- **Labels:**
  - **Front** — User facing forward
  - **Back** — User facing backward

## Dataset Usage

This dataset is used for:

- User orientation classification
- Selecting correct clothing orientation (front/back)
- Improving virtual try-on accuracy

---

# 🧪 Deployment

The system has been tested using a hybrid deployment setup.

## Deployment Environment

- 🤖 **AI Server**
  - Deployed using **Docker**
  - GPU-enabled environment
  - Handles AI inference and virtual try-on processing

- 🛒 **Commercial Server**
  - Running on **localhost**
  - Handles authentication, product management, and API logic

- 🎨 **Frontend**
  - Running on **localhost**
  - Provides user interface for try-on interaction

---

# 📸 Demo (Screenshots)

Screenshots help demonstrate system functionality and UI workflow.

## Recommended Screenshots

You should include:

- Register Page
- Login Page
- Seller Upload Product Page
- Virtual Try-On Room
- Generated Try-On Result

---
# 👨‍💻 Authors

- **Nguyen Phan Tuan Duy** – Computer Science Student, Ho Chi Minh City University of Technology (HCMUT)  
- **Pham Duy Anh** –  – Computer Science Student, Ho Chi Minh City University of Technology (HCMUT)  

GitHub Profiles (optional):  
- [Nguyen Phan Tuan Duy](https://github.com/nguyenphantuanduy)  
- [Pham Duy Anh](https://github.com/superiorhamster)  

---

# 📄 License / Citation

This project incorporates the **FASHN VTON v1.5** model.  

> ⚠️ **Important:** The FASHN VTON v1.5 authors require proper citation if you use their model in your research.

### How to Cite FASHN VTON v1.5:

```bibtex
@article{bochman2026fashnvton,
  title={FASHN VTON v1.5: Efficient Maskless Virtual Try-On in Pixel Space},
  author={Bochman, Dan and Bochman, Aya},
  journal={arXiv preprint},
  year={2026},
  note={Paper coming soon}
}
