🍽️ Menu Management Backend (Node.js + Express + MongoDB)

A fully functional Menu Management System built with Node.js, Express, and MongoDB, supporting Categories, Subcategories, and Items with CRUD operations, image uploads (Cloudinary), and search functionality.

🚀 Features

✅ Create, Read, Update, and Delete:

Categories

Subcategories (under categories)

Items (under categories or subcategories)

✅ Search for items by name
✅ Image Uploads with Cloudinary
✅ API Documentation via clear route definitions
✅ Modular structure (Controllers, Routes, Middleware, Config)


🧩 Tech Stack

| Layer                  | Technology              |
| ---------------------- | ----------------------- |
| Backend Framework      | Express.js              |
| Database               | MongoDB (Mongoose ORM)  |
| File Uploads           | Multer + Cloudinary     |
| Environment Management | dotenv                  |
| Language               | JavaScript (ES Modules) |

📁 Project Structure

menu-management-backend/
│
├── config/
│   └── db.js              # MongoDB connection
│
├── controllers/
│   ├── category.controller.js
│   ├── subCategory.controller.js
│   └── item.controller.js
│
├── middleware/
│   └── upload.js          # Multer + Cloudinary setup
│
├── models/
│   ├── Category.js
│   ├── SubCategory.js
│   └── Item.js
│
├── routes/
│   ├── category.routes.js
│   ├── subCategory.routes.js
│   └── item.routes.js
│
├── .env
├── package.json
├── server.js
└── README.md

⚙️ Installation and Setup
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/menu-management-backend.git
cd menu-management-backend

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables
Create a .env file in the root directory:

PORT=6000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

4️⃣ Run the Application
npm start


🧠 API Endpoints
🔹 Category Routes (/api/categories)
| Method | Endpoint  | Description           |
| ------ | --------- | --------------------- |
| POST   | /create   | Create a new category |
| GET    |    /      | Get all categories    |
| GET    |  /:id     | Get category by ID    |
| PUT    |   /:id    | Update category       |
| DELETE |    /:id   | Delete category       |

🔹 SubCategory Routes (/api/sub-categories)
| Method | Endpoint                  | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| POST   | `/create`                 | Create a new subcategory               |
| GET    | `/`                       | Get all subcategories                  |
| GET    | `/:id`                    | Get subcategory by ID                  |
| GET    | `/:categoryId/categories` | Get all subcategories under a category |
| PUT    | `/:id`                    | Update subcategory                     |
| DELETE | `/:id`                    | Delete subcategory                     |

🔹 Item Routes (/api/items)

| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| POST   | `/create`                 | Create a new item                 |
| GET    | `/`                       | Get all items                     |
| GET    | `/:id`                    | Get item by ID                    |
| GET    | `/:categoryId/categories` | Get all items under a category    |
| GET    | `/:id/subCategories`      | Get all items under a subcategory |
| PUT    | `/:id`                    | Update item                       |
| DELETE | `/:id`                    | Delete item                       |

🔍 Search Endpoint
| Method | Endpoint                       | Description         |
| ------ | ------------------------------ | ------------------- |
| GET    | `/api/items?search=<itemName>` | Search item by name |

🧠 Answers to Assignment Questions

🗄️ Which database did you choose and why?
I chose MongoDB because it is schema-flexible, easy to integrate with Node.js using Mongoose, and ideal for hierarchical relationships like Categories → Subcategories → Items.

💡 3 Things I Learned

How to structure a scalable backend project with modular controllers and routes.
Implementing Cloudinary image uploads using Multer middleware.
Designing RESTful APIs with proper relational data handling in MongoDB.

⚙️ Most Difficult Part

Handling the relationships between categories, subcategories, and items while maintaining clean APIs and ensuring correct cascading CRUD operations.

⏳ What I Would Do Differently with More Time

Add Swagger API documentation for better developer experience.
Implement authentication and role-based access control.
Add unit tests using Jest for API validation.
Include pagination and caching for large data sets.

📹 Loom Video

🎥 A short Loom video demoing all CRUD operations and explaining the structure.

Watch Demo Video: https://www.loom.com/share/0581db189c2e435f8f9423b3723fad7b

🌐 Live / Hosted Links

GitHub Repo: https://github.com/suraj371k/menu-management

Live API: https://menu-management-81kz.onrender.com

🧑‍💻 Author

Suraj — MERN Stack Developer
💼 LinkedIn: https://www.linkedin.com/in/suraj-kushwaha-a696a8258/
🐙 GitHub: https://github.com/suraj371k




