**Windows Explorer Web App**

A web application that mimics Windows Explorer, built with Vue 3 (Composition API) and Bun + Elysia + TypeScript.  
Browse folders on the left panel and view direct subfolders and files on the right panel. Supports unlimited folder nesting.  

---

**Features** 
- Folder tree on the left panel.  
- Direct subfolders & files on the right panel.  
- Expand/collapse folders.  
- Dynamic data from backend API.  
- Clean code, SOLID principles, and TypeScript.  

---

**Tech Stack**  
- Backend: Bun, Elysia, TypeScript  
- Frontend: Vue 3, Composition API  
- Database: MySQL  

---

**Quick Start**

**Backend** 
- cd backend
- bun install
- bun dev

**Frontend**
- cd frontend
- bun install
- bun dev

---

**API Endpoints:**
- GET /api/v1/folders – all folders
- GET /api/v1/folders/:id/children – direct subfolders
- GET /api/v1/folders/:id/files – files in folder

**Author**

Sri Hartono – https://github.com/hartonoosh
