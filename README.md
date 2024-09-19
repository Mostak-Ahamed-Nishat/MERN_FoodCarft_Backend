
# FoodCraft - Online Food Ordering System

Welcome to **FoodCraft**, an online food ordering platform built using the MERN stack. This project allows users to browse food items, place orders, and manage their accounts, while providing restaurant owners with an efficient way to handle their inventory and customer orders.

## Live Demo
Check out the live demo here: [FoodCraft](https://foodcraft.onrender.com/)

## Features
- **User Authentication**: Secure sign-up, login, and authentication using JWT tokens.
- **Food Menu**: Users can browse a variety of dishes, filter by categories, and view detailed descriptions.
- **Cart and Orders**: Add items to the cart, place orders, and view past orders.
- **Admin Dashboard**: Restaurant owners can manage menu items, view orders, and track customer activity.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Tech Stack
- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MongoDB
- **API Testing**: Postman

## Installation & Setup

### Backend Setup
1. Clone the backend repository:
   ```bash
   git clone https://github.com/Mostak-Ahamed-Nishat/MERN_FoodCarft_Backend.git
   ```
2. Install dependencies:
   ```bash
   cd MERN_FoodCarft_Backend
   npm install
   ```
3. Create a `.env` file in the root directory and add your MongoDB connection string and other environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Run the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Clone the frontend repository:
   ```bash
   git clone https://github.com/Mostak-Ahamed-Nishat/MERN_FoodCarft_Frontend.git
   ```
2. Install dependencies:
   ```bash
   cd MERN_FoodCarft_Frontend
   npm install
   ```
3. Create a `.env` file and add the backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Run the frontend server:
   ```bash
   npm start
   ```

## Screenshots
- **Landing Page**
- **Menu Page**
- **Cart & Orders**
- **Admin Dashboard**

(Include relevant screenshots or GIFs of the platform.)

## Contributing
Feel free to submit issues or pull requests. Contributions are welcome to make this project even better!

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
