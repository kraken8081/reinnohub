# ReInnoHub

<div align="center">

**A beautifully crafted, editorial-style showcase platform that curates cutting-edge AI applications and digital transformation projects in the reinsurance industry.**

[English](#features) · [中文](#中文说明)

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat-square&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwindcss)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)

</div>

---

## Features

- **Magazine-Style Design** — Refined editorial aesthetics with elegant typography (Playfair Display + Inter), smooth animations, and attention to every visual detail
- **Uniform Card Grid** — Clean, consistent card layouts with fixed dimensions for a polished browsing experience
- **Full-Stack Architecture** — React frontend with Express.js backend and SQLite database
- **Admin Dashboard** — Complete content management system for adding, editing, and managing projects
- **Auto Screenshot** — Automatically captures website screenshots via Puppeteer when adding new projects
- **Responsive Layout** — Seamlessly adapts from 3-column desktop to single-column mobile views
- **Smooth Animations** — Subtle hover effects, staggered reveals, and micro-interactions throughout

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Express.js 5, SQLite, Puppeteer (screenshot capture) |
| **Build** | Vite 7, PostCSS, Autoprefixer |
| **State** | Zustand, React Router DOM |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/reinnohub.git
cd reinnohub

# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run client` | Start Vite dev server only |
| `npm run server` | Start Express backend only |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |

## Project Structure

```
├── src/
│   ├── components/        # React UI components
│   │   ├── ProjectCard.tsx    # Main card component with hover effects
│   │   └── Header.tsx         # Navigation header
│   ├── pages/             # Page components
│   │   ├── Home.tsx           # Main showcase page
│   │   ├── AdminDashboard.tsx # Project management
│   │   └── AdminProjectForm.tsx
│   ├── services/          # API client
│   ├── data/              # Mock data (development)
│   ├── App.tsx            # Router configuration
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles & Tailwind
├── server/
│   └── index.ts           # Express server & API routes
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects/:id` | Get single project |
| `POST` | `/api/projects` | Create new project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `POST` | `/api/screenshot` | Capture website screenshot |

## Screenshots

<div align="center">
<i>Coming soon...</i>
</div>

---

## 中文说明

**ReInnoHub | 再保险创新前沿** — 精选再保险行业数字化转型与 AI 应用的前沿项目，为团队提供创新灵感与技术参考。

### 主要特性

- **杂志风格设计** — 精致的编辑美学，优雅的字体搭配，流畅的动画效果
- **统一卡片网格** — 整洁一致的卡片布局，固定尺寸呈现
- **全栈架构** — React 前端 + Express 后端 + SQLite 数据库
- **管理后台** — 完整的内容管理系统，支持项目的增删改查
- **自动截图** — 添加项目时自动抓取网站截图
- **响应式布局** — 桌面端三栏到移动端单栏的无缝适配

### 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看应用

---

<div align="center">

**Built with care for the reinsurance innovation community**

MIT License · 2025

</div>
