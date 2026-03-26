# Project Name

## Mục đích

Hướng dẫn thiết lập môi trường ảo và chạy các server + frontend của dự án.

## Bước 1: Thiết lập và kích hoạt môi trường ảo

1. Tạo môi trường ảo:
   python -m venv venv

2. Kích hoạt môi trường ảo:
   source venv/bin/activate

## Bước 3: Cài đặt các thư viện hệ thống cần thiết

Trên Linux, bạn có thể cần cài thêm thư viện OpenGL:
sudo apt update
sudo apt install -y libgl1

## Bước 4: Cài đặt các thư viện của AI_Server và chạy server

1. Đi tới thư mục AI_Server:
   cd backend/AI_Server/
   cd fashn_vton_1_5

2. Cài đặt thư viện local:
   pip install -e .

3. Quay về thư mục AI_Server và cài các requirements còn lại:
   cd ..
   pip install -r requirements.txt
   cd ../..

4. Tải trọng số (weights) cần thiết:
   python backend/AI_Server/fashn_vton_1_5/scripts/download_weights.py --weights-dir ./weights/fashn_vton_weights

5. Chạy AI server:
   uvicorn backend.AI_Server.ai_server:app --reload --host 0.0.0.0 --port 8000

> Khi server chạy, bạn có thể truy cập API tại http://localhost:8000

## Bước 5: Chạy Commercial Server (Node.js)

1. Mở terminal mới, đảm bảo Node.js đã được cài.

2. Cài Nodemon toàn cục (nếu chưa có):
   npm install -g nodemon

3. Vào thư mục Commercial_Server:
   cd backend/Commercial_Server

4. Cài các dependencies của dự án:
   npm install

5. Chạy server:
   npm run dev

> Commercial Server sẽ chạy ở chế độ phát triển và kết nối với AI_Server.

## Bước 6: Chạy Frontend

1. Mở terminal mới và vào thư mục frontend:
   cd frontend

2. Cài các dependencies nếu chưa có:
   npm install

3. Chạy frontend:
   npm run dev

> Frontend sẽ chạy ở chế độ phát triển, kết nối với Commercial Server và AI_Server.
