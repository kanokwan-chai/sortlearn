# ใช้อิมเมจ Node.js เล็กๆ สำหรับการ build สเตจแรก
FROM node:18-alpine AS build

# กำหนดโฟลเดอร์ทำงานในคอนเทนเนอร์
WORKDIR /app

# คัดลอก package.json และ package-lock.json เพื่อติดตั้ง dependencies
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกซอร์สโค้ดทั้งหมด (ไฟล์ที่ไม่จำเป็นถูกกรองออกด้วย .dockerignore แล้ว)
COPY . .

# สั่ง build React สำหรับ Production
RUN npm run build

# สเตจที่สอง สำหรับรันแอปพลิเคชัน (แบบไม่ใช้ Nginx)
FROM node:18-alpine

# กำหนดโฟลเดอร์ทำงาน
WORKDIR /app

# ติดตั้งแพ็กเกจ 'serve' โกลบอล เพื่อใช้เป็น Static Web Server แทน Nginx
RUN npm install -g serve

# คัดลอกเฉพาะไฟล์ที่เพิ่ง build เสร็จจากสเตจแรกมาใช้งาน
COPY --from=build /app/build ./build

# ระบุพอร์ตที่ตัว serve จะรัน (ค่าเริ่มต้นของ serve ส่วนมากคือ 3000)
EXPOSE 80

# รันคำสั่งเปิดเซิร์ฟเวอร์
# -s คือโหมด SPA (Single Page Application) ซึ่งจะช่วยให้รองรับ React Router
# -p ระบุพอร์ต
CMD ["serve", "-s", "build", "-p", "80"]
