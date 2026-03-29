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
