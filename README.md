# VirtualTryMe - FabUric

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
   uvicorn backend.AI_Server.ai_server:app --host 0.0.0.0 --port 8000

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

Rất hợp lý. Nếu bạn muốn đẩy riêng frontend lên Git sạch và dễ cho người khác chạy, thì nên làm 2 thứ:

1. README rõ ràng, có thể chạy ngay
2. Gitignore đủ chặt để không lộ file rác, secret, build output

Dưới đây là mẫu thực tế bạn có thể dùng luôn.

**README mẫu (cho frontend React + Vite)**

````md
## FitMe Frontend

Frontend cho hệ thống FitMe, xây dựng bằng React + Vite.

### 1. Yêu cầu môi trường

- Node.js >= 18
- npm >= 9

### 2. Cài đặt

```bash
npm install
```
````

### 3. Chạy local

```bash
npm run dev
```

Mặc định app chạy tại:

- http://localhost:5173

### 4. Build production

```bash
npm run build
```

Kết quả nằm trong thư mục `dist`.

### 5. Preview bản build

```bash
npm run preview
```

### 6. Biến môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Ví dụ `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AI_BASE_URL=http://localhost:8000
```

### 7. Scripts chính

- `npm run dev`: chạy local development
- `npm run build`: build production
- `npm run preview`: preview sau build
- `npm run lint`: kiểm tra lint (nếu có)

### 8. Cấu trúc thư mục chính

- `src/pages`: các page
- `src/components`: UI components
- `src/pages/auth`: login/register/forgot/reset
- `src/pages/customer`: customer dashboard
- `src/pages/seller`: seller dashboard + seller flow
- `src/pages/tryOnApp`: virtual try-on

### 9. Troubleshooting

#### Lỗi không gọi được backend

- Kiểm tra backend đang chạy ở đúng port
- Kiểm tra CORS backend có cho origin frontend
- Kiểm tra đúng URL trong `.env`

#### Lỗi font/CSS import

- Restart dev server:

```bash
npm run dev
```
