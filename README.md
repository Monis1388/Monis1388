# Eyewear E-Commerce Platform

A modern, full-stack e-commerce solution for eyewear, built with the MERN stack (MongoDB, Express, React/Next.js, Node.js).

## Features
- **Responsive Design**: Mobile-first UI with Vanilla CSS and Tailwind-like utility classes.
- **Product Management**: Search, Filter, and Sort products.
- **User Accounts**: Order history, Profile management, and Prescription uploads.
- **Admin Dashboard**: Sales overview, Order processing (Shiprocket integration mock), and User management.
- **Secure Handling**: JWT Authentication and Password Hashing.

## Tech Stack
- **Frontend**: Next.js 14, React, Context API, Axios.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **Tools**: Multer (Uploads), Morgan (Logging), Concurrently (Dev).

## Getting Started

1. **Clone the repository**
2. **Install Dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. **Environment Setup**
   - Create `server/.env` with:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/eyewear_ecommerce
     JWT_SECRET=your_secret
     ```
4. **Run Application**
   - Server: `cd server && npm run dev`
   - Client: `cd client && npm run dev`

## Deployment
- **Backend**: Deploy to Render/Heroku/DigitalOcean.
- **Frontend**: Deploy to Vercel/Netlify.
- **Database**: Use MongoDB Atlas.

## License
MIT
