# 🛒 ShopSphere — Full Stack E-Commerce Application

ShopSphere is a full-stack e-commerce web application built using **React.js** for the frontend and **Spring Boot** for the backend.

The application provides a complete shopping experience including product browsing, search, shopping cart, checkout, order management, user authentication, and admin product management.

---

## 🚀 Features

### 👤 User Features

* User registration
* User login
* JWT-based authentication
* Secure user authentication and authorization
* Browse products
* Search products
* Filter products by category
* View product details
* Add products to cart
* Increase/decrease product quantity
* Remove products from cart
* Checkout
* Place orders
* View order history
* View order details
* Logout functionality

### 👨‍💼 Admin Features

* Admin authentication
* Admin-only product management
* Add new products
* Manage product information
* Protected admin APIs using Spring Security
* Role-based authorization

### 📦 Product Features

* Product name
* Product description
* Product price
* Product category
* Product image
* Product listing
* Product details
* Backend API integration

### 🛍️ Order Features

* Create orders
* Store customer information
* Store order items
* Calculate subtotal
* Calculate delivery charges
* Calculate total amount
* Generate order ID
* Store order date
* View orders
* View order items

---

# 🏗️ Project Architecture

```text
ShopSphere
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── README.md
│
└── backend/
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/
    │       │       └── shopsphere/
    │       │           ├── controller/
    │       │           ├── model/
    │       │           ├── repository/
    │       │           ├── service/
    │       │           ├── security/
    │       │           └── ShopSphereApplication.java
    │       │
    │       └── resources/
    │           └── application.properties
    │
    ├── pom.xml
    └── README.md
```

---

# 💻 Technology Stack

## Frontend

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React.js     | User interface              |
| JavaScript   | Application logic           |
| React Router | Page navigation             |
| CSS3         | Styling                     |
| Context API  | Cart state management       |
| Fetch API    | Backend communication       |
| Vite         | Frontend development server |

## Backend

| Technology      | Purpose                        |
| --------------- | ------------------------------ |
| Java            | Backend programming            |
| Spring Boot     | Backend framework              |
| Spring Security | Authentication & authorization |
| JWT             | Secure authentication          |
| Spring Data JPA | Database operations            |
| Maven           | Dependency management          |
| REST API        | Frontend/backend communication |

## Database

| Technology    | Purpose              |
| ------------- | -------------------- |
| MySQL         | Application database |
| Hibernate/JPA | ORM                  |

---

# 🎨 Frontend

The frontend is developed using **React.js**.

## Main Pages

```text
/
├── Home
├── Products
├── Product Details
├── Cart
├── Checkout
├── Order Success
├── Orders
├── Register
├── Login
└── Admin Products
```

## Frontend Routes

```text
/
/products
/products/:id
/cart
/checkout
/order-success
/orders
/register
/login
/admin/products
```

---

# 🛒 Cart Management

ShopSphere uses React Context API for managing cart information.

The cart supports:

* Add to cart
* Increase quantity
* Decrease quantity
* Remove item
* Clear cart
* Calculate subtotal
* Calculate total items

Example:

```text
Product
   ↓
Add to Cart
   ↓
CartContext
   ↓
Cart
   ↓
Checkout
   ↓
Create Order
```

---

# 🔐 Authentication

ShopSphere uses **JWT authentication** with Spring Security.

Authentication flow:

```text
User
 │
 ▼
Login
 │
 ▼
Backend
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT Token
 │
 ▼
Frontend
 │
 ▼
Store Token
 │
 ▼
Send Token with Protected Requests
 │
 ▼
JWT Authentication Filter
 │
 ▼
Spring Security
 │
 ▼
Allow / Reject Request
```

---

# 🛡️ Authorization

The application supports role-based authorization.

Example roles:

```text
USER
ADMIN
```

Regular users can:

* Browse products
* Add products to cart
* Place orders
* View their orders

Admins can access protected product-management functionality.

Example:

```text
USER
 ├── Products
 ├── Cart
 ├── Checkout
 └── Orders

ADMIN
 ├── Products
 ├── Add Product
 └── Product Management
```

---

# ⚙️ Backend Architecture

The backend follows a layered architecture.

```text
Controller
     ↓
Service
     ↓
Repository
     ↓
Database
```

Security flow:

```text
Request
   ↓
JWT Authentication Filter
   ↓
Spring Security
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

---

# 📦 Backend Packages

## Controller

Handles HTTP requests and REST APIs.

Example:

```text
ProductController
OrderController
UserController
```

## Service

Contains application/business logic.

Example:

```text
ProductService
OrderService
UserService
```

## Repository

Handles database operations using Spring Data JPA.

Example:

```text
ProductRepository
OrderRepository
OrderItemRepository
UserRepository
```

## Model

Contains database entities.

Example:

```text
Product
Order
OrderItem
User
```

## Security

Contains authentication and authorization components.

Example:

```text
JwtAuthenticationFilter
SecurityConfig
```

---

# 🔌 REST API

## Product APIs

### Get All Products

```http
GET /api/products
```

### Get Product by ID

```http
GET /api/products/{id}
```

### Create Product

```http
POST /api/products
```

---

## Order APIs

### Create Order

```http
POST /api/orders
```

### Get All Orders

```http
GET /api/orders
```

### Get Order by ID

```http
GET /api/orders/{id}
```

### Get Order Items

```http
GET /api/orders/{orderId}/items
```

---

## Authentication APIs

Example authentication endpoints:

```http
POST /api/auth/register
POST /api/auth/login
```

Authentication requests return a JWT token which can be used to access protected APIs.

---

# 🗄️ Database Structure

ShopSphere uses a relational database.

Main tables:

```text
users
products
orders
order_items
```

### Products

```text
products
-------------------------
id
name
description
price
category
image_url
```

### Orders

```text
orders
-------------------------
id
order_id
full_name
email
phone
address
city
state
pincode
subtotal
delivery_charge
total
order_date
```

### Order Items

```text
order_items
-------------------------
id
order_id
product_id
product_name
price
quantity
total
```

### Users

```text
users
-------------------------
id
name
email
password
role
```

---

# 💰 Order Calculation

The checkout system calculates:

```text
Subtotal
   +
Delivery Charge
   =
Total
```

Current delivery logic:

```text
Subtotal >= ₹1000
        ↓
Free Delivery

Subtotal < ₹1000
        ↓
₹50 Delivery Charge
```

---

# 🖥️ Running the Project Locally

## Prerequisites

Make sure you have installed:

* Java JDK
* Node.js
* npm
* Maven
* MySQL
* Git

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/shopsphere.git
```

Move into the project:

```bash
cd shopsphere
```

---

# 2️⃣ Setup Backend

Navigate to the backend folder:

```bash
cd backend
```

Configure the database in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shopsphere
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Then start the Spring Boot application.

Using Maven:

```bash
mvn spring-boot:run
```

Backend will normally run at:

```text
http://localhost:8080
```

---

# 3️⃣ Setup Frontend

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

---

# 🔗 Frontend ↔ Backend

The React frontend communicates with the Spring Boot backend through REST APIs.

Example:

```javascript
fetch("http://localhost:8080/api/products")
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080
```

---

# 📁 Example Project Structure

```text
ShopSphere/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   └── AdminProducts.jsx
│   │   │
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── README.md
│
├── backend/
│   │
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/shopsphere/
│   │       │       │
│   │       │       ├── controller/
│   │       │       ├── model/
│   │       │       ├── repository/
│   │       │       ├── service/
│   │       │       └── security/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── pom.xml
│   └── README.md
│
└── README.md
```

---

# 🔒 Security

Sensitive configuration should **not** be committed to GitHub.

Do not upload:

```text
database passwords
JWT secret keys
API keys
private credentials
```

Use environment variables or local configuration for sensitive information.

---

# 🌱 Future Improvements

Possible future enhancements include:

* Payment gateway integration
* Product image upload
* Product update/delete functionality
* Advanced admin dashboard
* User profile management
* Wishlist
* Product reviews and ratings
* Inventory management
* Pagination
* Advanced product filtering
* Email notifications
* Order status tracking
* Password reset
* Deployment to cloud
* Docker support
* Automated testing

---

# 📸 Application Flow

```text
             SHOPSPHERE
                 │
       ┌─────────┴─────────┐
       │                   │
    FRONTEND             BACKEND
       │                   │
    React.js            Spring Boot
       │                   │
    Router              REST API
       │                   │
  Cart Context        Spring Security
       │                   │
       └─────────┬─────────┘
                 │
              MySQL
```

---

# 👨‍💻 Developer

**Gowsik Balamurugan**

B.E. Computer Science and Engineering

---

# 📄 License

This project is developed for learning, portfolio, and demonstration purposes.

---

## ⭐ If you like this project

Feel free to ⭐ the repository and explore the project.
