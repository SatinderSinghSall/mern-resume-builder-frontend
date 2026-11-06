# Resume Builder --- Frontend

### A modern React interface for creating, customizing, and managing professional resumes.

Built with React and Vite, this frontend provides the user experience
for the Resume Builder application, including authentication, a resume
dashboard, editable resume sections, template selection, and resume
previews.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Redux
Toolkit](https://img.shields.io/badge/Redux_Toolkit-State_Management-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind
CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
:::

---

## Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Run the Development Server](#-run-the-development-server)
- [Available Scripts](#-available-scripts)
- [Main Application Areas](#-main-application-areas)
- [Backend Connection](#-backend-connection)
- [Build for Production](#-build-for-production)
- [Development Notes](#-development-notes)

---

## 🌟 Overview

The `client` directory contains the frontend application for Resume
Builder. It is a single-page application built with React and Vite.

The interface allows users to access their account, manage resumes from
a dashboard, enter professional information, select a resume design, and
preview their completed resume. Shared components and form components
keep the application organized and reusable.

---

# 👨‍💻 About Me

Hi, I'm **Satinder Singh Sall**, a Full-Stack Developer, AI Enthusiast, and MCA student passionate about building scalable digital products, intelligent software systems, and meaningful user experiences.

My journey spans across **Web Development, Mobile Applications, Artificial Intelligence, Cloud Technologies, and Creative Writing**. I enjoy transforming ideas into production-ready solutions using modern technologies while continuously exploring emerging fields like Machine Learning, Computer Vision, and Automation.

Currently, I'm pursuing my **Master of Computer Applications (MCA)** while actively developing full-stack applications, AI-powered solutions, and open-source learning resources. My work focuses on creating software that is not only functional but also scalable, maintainable, and impactful.

## 🚀 What I'm Building

- 🤖 AI-Powered Attendance System using Face Recognition & Voice Biometrics
- 🌐 Modern Full-Stack Web Applications
- 📱 Cross-Platform Mobile Applications
- 🎮 Exploring Game Development & Interactive Experiences
- 📚 Open-Source Learning Roadmaps and Technical Resources
- ✍️ Satinder Poetry — A platform for original poetry, essays, and creative writing

## 🛠️ Core Technologies

**Frontend:** React, Next.js, TypeScript, Tailwind CSS
**Backend:** Node.js, Express.js, REST APIs
**Databases:** MongoDB, PostgreSQL, MySQL, Firebase, Supabase
**DevOps & Cloud:** Docker, GitHub Actions, Vercel, Render
**Programming:** Python, Java, JavaScript, C++, C#, Kotlin
**AI / ML:** Python, Computer Vision, Face Recognition, Automation
**Mobile Apps:** High-Performance Android, iOS, Cross-Platform & Native Development

## 🌍 Connect With Me

🌐 Portfolio: https://satinder-portfolio.vercel.app

💻 GitHub: https://github.com/SatinderSinghSall

💼 LinkedIn: https://www.linkedin.com/in/satinder-singh-sall-b62049204/

🎥 YouTube: https://www.youtube.com/@satindersinghsall.3841

✍️ Satinder Poetry: https://satinderpoetry.com

🤖 AI Attendance Project: https://ai-attendance-app-satinder.vercel.app/

---

> _"I believe great software is built at the intersection of engineering excellence, continuous learning, creativity, and real-world problem solving."_

⭐ Always learning. Always building. Always improving.

---

## ✨ Features

### Account and navigation

- Login interface and authentication state management.
- Redux Toolkit store and authentication slice.
- Application routing with React Router.
- Shared navigation and layout components.

### Resume dashboard

- Dashboard for accessing and managing resumes.
- Resume creation and editing workflows.
- PDF resume upload interface.
- Resume title and management interactions.

### Resume editor

- Personal information form.
- Professional summary form with AI-assisted enhancement.
- Work experience form.
- Education form.
- Projects form.
- Skills form.
- Accent color picker and template selector.

### Resume templates and preview

The frontend includes four resume template designs: - Modern - Classic -
Minimal - Minimal Image

The templates are available in both the assets and component template
directories. A resume preview component renders the selected design, and
a dedicated preview page provides a separate viewing experience.

### User experience

- Reusable loading component.
- Scroll-to-top behavior and scroll-to-top button.
- Home page sections for the product introduction and features.
- Responsive interface styling.

---

## 🧰 Tech Stack

Technology Purpose

---

React Component-based user interface
Vite Development server and frontend build tooling
Redux Toolkit Application and authentication state
React Router DOM Client-side navigation
Tailwind CSS Utility-first styling
Axios HTTP requests to the backend
Lucide React Interface icons
React Hot Toast Toast notifications
react-pdftotext Extracting text from PDF files

Refer to `package.json` for the exact installed package versions and
dependencies.

---

## 🗂 Folder Structure

```text
client/
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   └── authSlice.js
│   │   └── store.js
│   │
│   ├── assets/
│   │   ├── templates/
│   │   │   ├── ClassicTemplate.jsx
│   │   │   ├── MinimalImageTemplate.jsx
│   │   │   ├── MinimalTemplate.jsx
│   │   │   └── ModernTemplate.jsx
│   │   ├── assets.js
│   │   ├── dummy_profile.png
│   │   ├── favicon.ico
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── home/
│   │   │   ├── Banner.jsx
│   │   │   ├── CallToAction.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Testimonial.jsx
│   │   │   └── Title.jsx
│   │   ├── templates/
│   │   │   ├── ClassicTemplate.jsx
│   │   │   ├── MinimalImageTemplate.jsx
│   │   │   ├── MinimalTemplate.jsx
│   │   │   └── ModernTemplate.jsx
│   │   ├── ColorPicker.jsx
│   │   ├── EducationForm.jsx
│   │   ├── ExperienceForm.jsx
│   │   ├── HomeNavbar.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── PersonalInfoForm.jsx
│   │   ├── ProfessionalSummaryForm.jsx
│   │   ├── ProjectForm.jsx
│   │   ├── ResumePreview.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── ScrollToTopButton.jsx
│   │   ├── SkillsForm.jsx
│   │   └── TemplateSelector.jsx
│   │
│   ├── configs/
│   │   └── api.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── Preview.jsx
│   │   └── ResumeBuilder.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vercel.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm
- The Resume Builder backend running locally or deployed
- Backend service credentials configured on the server

### Install dependencies

From the project root:

```bash
cd client
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `client` directory:

**`client/.env`**

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

Update the values to match your backend and ImageKit configuration.

**Important security guidance:** - Vite exposes variables prefixed with
`VITE_` to browser-side code. - Only put values intended to be public in
the client environment file. - Never put database credentials, JWT
signing secrets, AI API keys, or ImageKit private keys in
`client/.env`. - Keep private credentials in the backend environment.

After editing `.env`, restart the Vite development server.

---

## ▶️ Run the Development Server

Run this command from the `client` directory:

```bash
npm run dev
```

Vite normally serves the application at:

```text
http://localhost:5173
```

The exact address is printed in the terminal when the development server
starts.

---

## 📜 Available Scripts

The following are common Vite scripts. The authoritative list for this
project is the `scripts` section of `package.json`.

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint, if configured
```

---

## 🧭 Main Application Areas

File or directory Responsibility

---

`src/App.jsx` Main application component and route setup
`src/main.jsx` Frontend entry point
`src/app/store.js` Redux store configuration
`src/app/features/authSlice.js` Authentication state
`src/pages/Home.jsx` Landing page
`src/pages/Login.jsx` Login page
`src/pages/Dashboard.jsx` Resume dashboard
`src/pages/ResumeBuilder.jsx` Resume editing experience
`src/pages/Preview.jsx` Resume preview page
`src/components/` Reusable interface and form components
`src/components/templates/` Resume template components
`src/assets/templates/` Template-related assets
`src/configs/api.js` API client/configuration
`src/index.css` Global styles

---

## 🔌 Backend Connection

The frontend communicates with the Resume Builder backend through the
API configuration in:

```text
src/configs/api.js
```

The backend base URL is configured using:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Make sure that:

1.  The backend server is running.
2.  The client API base URL points to the correct backend address.
3.  The backend allows requests from the frontend origin through its
    CORS configuration.
4.  Required authentication tokens are handled by the application's
    existing authentication flow.

If the API URL changes, update the environment variable and restart the
frontend development server.

---

## 📦 Build for Production

Create an optimized production build:

```bash
npm run build
```

Vite generates the production output in:

```text
client/dist/
```

To preview that build locally:

```bash
npm run preview
```

Deploy the generated frontend build using your preferred static hosting
provider. Configure the production `VITE_API_BASE_URL` before building
so the deployed frontend connects to the deployed backend.

---

## 🛠 Development Notes

- Keep reusable UI elements in `src/components/`.
- Keep route-level page components in `src/pages/`.
- Keep resume form sections focused on their own data and
  interactions.
- Keep shared application state in the Redux store where appropriate.
- Keep API configuration centralized in `src/configs/api.js`.
- Keep private API credentials on the backend.
- When adding a new resume template, update the template components
  and the relevant template selection/preview logic.
- Test the editor and preview at desktop and mobile viewport sizes.

---

### Part of the Resume Builder project

**Create. Customize. Present your best work.**

[⬆ Back to top](#resume-builder--frontend)
