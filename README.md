Restaurant Management System (RMS)
📌 Project Overview
The Restaurant Management System (RMS) is a web-based application designed to efficiently manage multiple restaurant locations. It features user authentication, order management, table reservations, and more. Currently supports Sunshine Cafe and German Cafe.

🚀 Key Features
🔑 User Authentication (Login with role-based access control)

🏬 Multi-Location Management (Sunshine Cafe & German Cafe)

📦 Comprehensive Order & Product Management

📊 Admin Dashboard (Analytics & reporting)

💾 MongoDB Database Integration

🔄 Session Management with Flash Messages

🔐 Secure API using JWT Authentication

📸 Image Upload Support (via Multer)

🛠 Technology Stack
Frontend: Bootstrap, Handlebars (HBS)

Backend: Node.js, Express.js

Database: MongoDB (with Mongoose ODM)

Authentication: JWT, bcrypt.js

Session Management: express-session, connect-mongo

Additional Tools: dotenv, method-override, multer

🔑 Default Login Credentials
1️⃣ Sunshine Cafe
Store ID: sunshineCafe

Username: admin@gmail.com

Password: admin123

2️⃣ German Cafe
Store ID: germanCafe

Username: admin@admin.com

Password: admin123

🏗 Project Structure

RMS/
├── models/          # Mongoose data models
├── node_modules/    # Project dependencies
├── public/          # Static assets (CSS, JS, images)
├── routes/          # API endpoint definitions
├── utils/           # Utility functions
├── views/           # Handlebars templates
├── app.js           # Main application file
├── .env             # Environment configuration
├── .gitignore       # Version control exclusions
└── package.json     # Project metadata

🔧 Installation & Setup Guide
1️⃣ Clone the Repository
git clone https://github.com/your-username/rms.git
cd rms


2️⃣ Install Dependencies
npm install

3️⃣ Database Configuration
Open MongoDB Compass

Create a new database named RMSDB

Prepare the database backup:

Locate the RMSDB folder in the project's db/ directory

Create a backup folder in your C: drive (Windows) or home directory (Mac/Linux)

Copy the RMSDB folder into your backup location

Import the database:

Windows:
mongorestore --db=RMSDB "C:\backup\RMSDB"

Mac/Linux:
mongorestore --db=RMSDB "/home/user/backup/RMSDB"


Configure the connection:
Add your MongoDB connection string to the .env file:

MONGO_URI=your_mongodb_connection_string_here

4️⃣ Launch the Application

npm start

Important Note: An active internet connection is required as the project uses CDN links for scripts and stylesheets.