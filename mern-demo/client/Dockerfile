# Câu 51: Khai báo Node.js Image làm Base Image
FROM node:20

# Câu 52: Thiết lập thư mục làm việc bên trong Frontend Container
WORKDIR /app

# Câu 53: Sao chép package.json và package-lock.json
COPY package*.json ./

# Câu 54: Cài đặt các package của React Application
RUN npm install

# Câu 55: Sao chép source code React vào Container
COPY . .

# Câu 56: Build React Application thành các file tĩnh
RUN npm run build

EXPOSE 4173

# Lệnh khởi chạy server (Thêm dòng này vào cuối)
CMD ["npm", "run", "preview"]