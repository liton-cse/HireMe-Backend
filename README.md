# HireMe Backend

A job platform backend where companies can post jobs and job seekers can apply after a payment of 100 Taka. This backend implements role-based access control for Admins, Employees (recruiters), and Job Seekers.

## 🔧 Tech Stack

- **Language**: JavaScript 
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Uploads**: Multer
- **Payment**: Stripe / Mock Service
- **Validation**: Joi
- **Env Config**: dotenv

---

## 👥 Roles & Permissions

| Role        | Permissions |
|-------------|-------------|
| **Admin**   | Manage all users, jobs, applications; View company analytics |
| **Employee**| Post/edit/delete jobs for their company; View and manage applicants |
| **Job Seeker** | View jobs, Apply with CV + pay 100 Taka |

---

## 🚀 Features

### ✅ Role-Based Authentication

- JWT-based auth with middleware for role checking.
- Only Admins can manage users.
- Employees can manage only their jobs and applications.
- Job Seekers can only apply after payment.

### 📄 File Upload

- Job Seekers upload CVs (PDF or DOCX).
- File validation: max size 5MB, allowed formats.
- Multer used with disk storage.

### 💳 Payment System

- Integration with Stripe (or mock version).
- Job application requires 100 Taka.
- On success:
  - Application is saved with payment status.
  - Invoice (ID, user, amount, timestamp) is stored.

### 🛠 Admin Panel (Backend APIs)

- **Admin**:
  - View all users, jobs, applications.
- **Employee**:
  - View applications to jobs.
  - Accept/Reject applications.
- **Job Seeker**:
  - View job listings.
  - Apply to jobs (not previously applied).
  - View application history.

---

## Steps

### 1. Clone the repository:
```bash
    git clone https://github.com/liton-cse/HireMe-Backend.git
    cd hireme-backend
```


### 2. Install dependencies:
```bash
    npm install
```

### 3. Set up environment variables in a `.env` file:
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://HireMe:Hireme@cluster0.az99qzj.mongodb.net/HireMe
JWT_SECRET= my father is super hero
JWT_EXPIRE=30d
```

### 4. Start the server:
```bash
    npm start
```

### **This server will be running on `http://localhost:5000`.
### **This server will be running on after deploy
 `https://hireme-backend-60an.onrender.com`.


## API Endpoints

### Authentication

- **POST** `/api/auth/register` – Register a new user.
- **POST** `/api/auth/login` – Log in and get a JWT token.
- **GET** `/api/auth/profile` – Log out the current user.

### Users (Admin only)

- **GET** `/api/admin/users` – List all users.
- **GET** `/api/admin/users/:id` – List specific users.
- **PUT** `/api/admin/users/:id` – Update user information.
- **DELETE** `/api/admin/users/:id` – Delete a user.
- **GET** `/api/admin/jobs` – List all jobs.
- **GET** `/api/admin/applicants` – List all applicants.

### Jobs

- **GET** `/api/jobs` – List all available jobs.(public)
- **POST** `/api/jobs/:id` – List specific available jobs.(public)
- **POST** `/api/jobs` – Post a new job (Admin and Employee ).
- **PUT** `/api/jobs/:id` – Edit a job (Admin and Employee).
- **DELETE** `/api/jobs/:id` – Delete a job (Admin and Employee).
- **GET** `/api/jobs/:id/applications` – Get All job application (Admin and Employee).


### Applications

- **POST** `/api/jobs/:id/apply` – Apply for a specific job application (Job Seeker Only).
- **PUT** `/api/jobs//applications/:id` – Accept or reject an application (Employee only).

### Payments

- **POST** `/api/payments/process` – Initiate Stripe payment for job application.
- **GET** `/api/payments/invoice/:id` – View an invoice after successful payment.



