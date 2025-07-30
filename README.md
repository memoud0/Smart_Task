# AI‑Powered Smart Task Scheduler Calendar

![License](https://img.shields.io/badge/license-MIT-green) ![Next.js](https://img.shields.io/badge/built%20with-Next.js-black) ![OpenAI](https://img.shields.io/badge/AI-OpenAI-blue)

A modern calendar application that ingests your to‑do items (including PDF syllabi), estimates effort with OpenAI, and automatically schedules your tasks into available time windows. Built with Next.js, React, TypeScript, FullCalendar, and Material‑UI.

---

## 🚀 Features

- **AI‑Driven Planning**  
  - Upload PDFs or enter task details and let OpenAI estimate total effort and reading time  
  - Automatic weekly breakdown of tasks into free time slots, with conflict detection and real‑time rebalancing

- **Interactive Calendar UI**  
  - FullCalendar integration for month/week/day views  
  - Material‑UI dialogs to add, edit, or delete tasks  
  - Custom styling based on task type (e.g. “Reading,” “Coding,” “Review”)

- **Type‑Safe Data Layer**  
  - End‑to‑end TypeScript interfaces for all events and API responses  
  - Zod schema validation on the client and server sides  
  - Persistent storage in `localStorage` with automatic sync and rollback

- **Robust Form & State Management**  
  - React Hook Form + `zodResolver` for dynamic, validated forms  
  - Controlled loading and error states via React’s `useEffect` and local state

- **Date & Time Handling**  
  - Consistent 24‑hour formatting and ISO normalization using Moment.js  
  - User‑defined availability windows converted into schedule slots

---

## 🛠 Tech Stack

- **Framework:** Next.js  
- **UI:** React · Material‑UI · FullCalendar  
- **Language:** TypeScript  
- **Forms & Validation:** React Hook Form · Zod  
- **Date/Time:** Moment.js  
- **AI Integration:** OpenAI API  
- **Storage:** Browser `localStorage`  
- **Build & Tooling:** Vite (via Next.js) · ESLint · Prettier

