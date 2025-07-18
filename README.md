# Perfume Shop - E-commerce Platform

A modern e-commerce platform built with Next.js for selling perfumes online, featuring user authentication, product management, shopping cart functionality, and checkout process.

## Features

- **User Authentication**: Login and registration system with secure password handling
- **Product Management**: Admin dashboard for adding, editing, and managing perfume products
- **Shopping Cart**: Add products to cart, adjust quantities, and persistent cart storage
- **Checkout Process**: Seamless checkout experience with order confirmation
- **Responsive Design**: Mobile-friendly layout that works across devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: CSS/SCSS
- **Authentication**: NextAuth.js with bcrypt password hashing
- **Database**: MongoDB with Mongoose ORM
- **State Management**: React Context API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB connection

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Perfume-e-commerce.git
cd Perfume-e-commerce/perfume-shop
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Main application pages and API routes
- `/src/components`: Reusable UI components
- `/src/lib`: Utilities and database connection
- `/src/models`: MongoDB models for users, products, and orders
- `/public`: Static assets

## Admin Dashboard

To access the admin dashboard, navigate to `/admin` after logging in with an admin account. Here you can:
- View all products
- Add new products
- Edit existing products
- Manage orders

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributors

- Your Name - Initial work

## Acknowledgments

- Thanks to Next.js team for the excellent framework
- MongoDB for the database solution