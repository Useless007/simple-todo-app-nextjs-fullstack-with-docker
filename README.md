# 📝 Todo App - แอพจัดการงานแบบครบครัน

Todo App ที่สร้างด้วย Next.js 15, TypeScript, Prisma ORM และ PostgreSQL พร้อมฟีเจอร์ครบครัน

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/simple-todo-app)

## ✨ ฟีเจอร์หลัก

- ✅ **จัดการ Todo** - เพิ่ม แก้ไข ลบ และทำเครื่องหมายเสร็จ
- 🎯 **ลำดับความสำคัญ** - ต่ำ, ปานกลาง, สูง, เร่งด่วน
- 📅 **จัดการวันที่** - กำหนดวันเริ่มต้นและวันสิ้นสุด
- 🔍 **กรองและค้นหา** - กรองตามสถานะและลำดับความสำคัญ
- 📊 **แสดงความคืบหนา** - แสดงจำนวนงานที่เสร็จแล้ว
- 🎨 **UI สวยงาม** - ออกแบบด้วย Tailwind CSS
- 📱 **Responsive Design** - ใช้งานได้บนมือถือและเดสก์ท็อป

## 🛠 เทคโนโลยีที่ใช้

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Package Manager**: Bun
- **Icons**: Lucide React
- **Validation**: Zod

## 🚀 การติดตั้งและรัน

### ข้อกำหนดเบื้องต้น
- Bun
- Docker (สำหรับ PostgreSQL)

### 1. เริ่มต้น Database
```bash
docker-compose up -d
```

### 2. ติดตั้ง Dependencies
```bash
bun install
```

### 3. ตั้งค่า Database
```bash
# สร้าง migration
bun run db:migrate

# สร้าง Prisma client
bun run db:generate
```

### 4. เริ่มต้น Development Server
```bash
bun run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Todo Model
```prisma
model Todo {
  id          String     @id @default(cuid())
  title       String
  description String?
  completed   Boolean    @default(false)
  priority    Priority   @default(MEDIUM)
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## 🔗 API Endpoints

### Todos
- `GET /api/todos` - ดึงข้อมูล todos ทั้งหมด
- `POST /api/todos` - สร้าง todo ใหม่
- `GET /api/todos/[id]` - ดึงข้อมูล todo ตาม id
- `PUT /api/todos/[id]` - อัปเดต todo
- `DELETE /api/todos/[id]` - ลบ todo

### Query Parameters สำหรับ GET /api/todos
- `completed` - กรองตามสถานะ (true/false)
- `priority` - กรองตามลำดับความสำคัญ (LOW, MEDIUM, HIGH, URGENT)

## 🛠 คำสั่งที่มีประโยชน์

```bash
# Database commands
bun run db:studio      # เปิด Prisma Studio
bun run db:push        # Push schema ไปยัง database
bun run db:reset       # Reset database

# Development
bun run dev            # เริ่ม development server
bun run build          # Build สำหรับ production
bun run start          # เริ่ม production server
bun run lint           # ตรวจสอบ code quality
```

## 🐳 Docker Services

โปรเจคใช้ Docker Compose เพื่อรัน services ต่อไปนี้:

- **PostgreSQL** - Database หลัก (port 5432)
- **Adminer** - Web-based database admin (port 8080)
- **pgAdmin** - PostgreSQL admin tool (port 5050)

### เข้าถึง Database Admin Tools
- **Adminer**: http://localhost:8080
- **pgAdmin**: http://localhost:5050
  - Email: pgadmin@codepruner.com
  - Password: pgadminP@ssw0rd!

## 📝 การใช้งาน

1. **เพิ่ม Todo**: คลิกปุ่ม "เพิ่ม Todo ใหม่"
2. **แก้ไข Todo**: คลิกไอคอนดินสอในการ์ด Todo
3. **ทำเครื่องหมายเสร็จ**: คลิกช่องสี่เหลี่ยมด้านซ้าย
4. **ลบ Todo**: คลิกไอคอนถังขยะ
5. **กรอง**: ใช้ตัวกรองด้านบนเพื่อดู Todo ตามต้องการ

## 🚀 Deploy บน Vercel

### วิธีการ Deploy แบบง่าย

1. **Push โค้ดขึ้น GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **เชื่อมต่อกับ Vercel**
   - ไปที่ [vercel.com](https://vercel.com)
   - เชื่อมต่อกับ GitHub account
   - Import โปรเจค
   - Vercel จะ detect Next.js โดยอัตโนมัติ

3. **ตั้งค่า Environment Variables**
   ใน Vercel Dashboard ไปที่ Settings > Environment Variables และเพิ่ม:
   ```
   DATABASE_URL=your_neon_database_url_here
   ```

4. **Deploy**
   - Vercel จะ build และ deploy โดยอัตโนมัติ
   - Prisma จะ generate client ตอน build ผ่าน `postinstall` script

### วิธีการ Deploy ด้วย Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# ตั้งค่า environment variable
vercel env add DATABASE_URL

# Deploy production
vercel --prod
```

### หมายเหตุสำหรับ Production

1. **Database**: ใช้ Neon PostgreSQL (รองรับ connection pooling)
2. **Environment Variables**: ตั้งค่า DATABASE_URL ใน Vercel Dashboard
3. **Build**: Prisma Client จะถูก generate อัตโนมัติใน build process
4. **Functions**: API routes จะรันบน Vercel Edge Functions

## 🤝 การพัฒนาต่อ

สามารถพัฒนาฟีเจอร์เพิ่มเติมได้ เช่น:
- การแจ้งเตือน (Notifications)
- การจัดหมวดหมู่ (Categories/Tags)
- การค้นหาแบบ Full-text
- การแชร์ Todo กับผู้อื่น
- Dark mode
- การ Export/Import ข้อมูล

## 📄 License

MIT License
