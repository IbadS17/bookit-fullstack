# BookIt - Experience Booking Platform

A full-stack MERN application for booking travel experiences.

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm

## Setup & Run

### 1. Clone Repository

```bash
git clone https://github.com/IbadS17/bookit-fullstack.git
cd bookit-fullstack
```

### 2. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd ../frontend
npm install
```

### 3. Configure Environment

Create `.env` file in `backend` directory:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/bookit
```

### 4. Start MongoDB

**Windows:**

```bash
net start MongoDB
```

**macOS/Linux:**

```bash
sudo systemctl start mongod
```

### 5. Seed Database

```bash
cd backend
node seed.js
```

### 6. Run Application

**Backend (Terminal 1):**

```bash
cd backend
npm start
```

Server runs on: `http://localhost:8080`

**Frontend (Terminal 2):**

```bash
cd frontend
npm run dev
```

App runs on: `http://localhost:5173`

### 7. Access Application

Open browser: `http://localhost:5173`

## Test Promo Codes

- `SAVE10` - 10% discount
- `WELCOME` - ₹200 off
- `FIRSTBOOKING` - 15% discount

## Troubleshooting

**Backend won't start:**

- Ensure MongoDB is running
- Check port 8080 availability

**Frontend errors:**

```bash
cd frontend
rm -rf node_modules
npm install
```

---

**Author:** Ibad S - [@IbadS17](https://github.com/IbadS17)
