# 💼 Job Portal App

A full-stack job portal with two roles — **Candidate** and **Recruiter** — built with Node.js, Express, MongoDB, and EJS.

---

## 🔑 Roles

| Role | Can Do |
|------|--------|
| **Candidate** | Register, browse jobs, apply, track application status |
| **Recruiter** | Register, post jobs, view applicants, update application status |

---

## 🚀 Features

- ✅ Role-based registration (Candidate / Recruiter) with role selector UI
- 🔐 Authentication (Register / Login / Logout)
- 📋 Recruiter: Post, Edit, Delete jobs; Open/Close positions
- 🔍 Candidate: Browse jobs with search & filters (category, job type)
- 📨 Candidate: Apply with cover letter; Withdraw pending applications
- 📊 Application status tracking: Pending → Reviewed → Accepted / Rejected
- 💬 Recruiter can add notes when updating application status
- 📈 Role-specific dashboards with live stats

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Templating | EJS |
| Auth | bcryptjs, express-session |
| Styling | Custom CSS |

---

## 📁 Project Structure

```
job-portal-app/
├── app.js
├── seed.js
├── config/
│   ├── db.js
│   └── session.js
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── jobController.js
│   └── applicationController.js
├── middleware/
│   └── auth.js          # isAuthenticated, isCandidate, isRecruiter, isGuest
├── models/
│   ├── User.js          # role: candidate | recruiter
│   ├── Job.js
│   └── Application.js   # status: Pending | Reviewed | Accepted | Rejected
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   ├── jobs.js
│   └── applications.js
├── views/
│   ├── auth/            # login, register (with role selector)
│   ├── dashboard/       # candidate.ejs, recruiter.ejs
│   ├── jobs/            # index, show, create, edit, manage
│   ├── applications/    # my.ejs (candidate), job.ejs (recruiter)
│   └── partials/
└── public/
    ├── css/main.css
    └── js/main.js
```

---

## 🗄️ MongoDB Schema

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | |
| email | String | Unique |
| password | String | Hashed |
| role | String | `candidate` or `recruiter` |
| skills | [String] | Candidate only |
| experience | String | Candidate only |
| company | String | Recruiter only |
| companyWebsite | String | Recruiter only |

### Job
| Field | Type | Notes |
|-------|------|-------|
| title | String | |
| company | String | |
| location | String | |
| jobType | String | Full-time, Internship, etc. |
| category | String | Technology, Finance, etc. |
| description | String | |
| requirements | String | |
| salary | String | |
| skills | [String] | |
| isOpen | Boolean | Open/Closed |
| deadline | Date | |
| postedBy | ObjectId | Ref: User (recruiter) |

### Application
| Field | Type | Notes |
|-------|------|-------|
| job | ObjectId | Ref: Job |
| candidate | ObjectId | Ref: User |
| coverLetter | String | |
| status | String | Pending, Reviewed, Accepted, Rejected |
| recruiterNote | String | Set by recruiter |

---

## ⚙️ Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure .env
cp .env.example .env
# Edit MONGODB_URI and SESSION_SECRET

# 3. (Optional) Load sample data
node seed.js

# 4. Start the app
npm run dev
```

Visit: **http://localhost:3000**

---

## 🧪 Sample Logins (after seed.js)

| Role | Email | Password |
|------|-------|----------|
| Recruiter | priya@techcorp.com | priya123 |
| Recruiter | rahul@startupxyz.com | rahul123 |
| Candidate | arun@gmail.com | arun123 |
| Candidate | sneha@gmail.com | sneha123 |

---

## 📄 License
MIT
