# Project Tracker (Frontend Task)

## Overview

This project is a **multi-view project management UI** built using **React + TypeScript + Tailwind CSS**.

It supports:

* Kanban Board
* List View with Virtual Scrolling
* Timeline (Gantt-style) View

All views use the **same dataset** and switch instantly without re-fetching.

---

## Tech Stack

* React (with TypeScript)
* Tailwind CSS
* Zustand (State Management)
* Vite (Build Tool)

---

## Features

### 1. Three Views

* **Kanban Board**

  * Drag and drop tasks between columns
  * Priority badges, assignee avatars, due dates
* **List View**

  * Virtual scrolling (handles 500+ tasks efficiently)
  * Sorting (title, priority, due date)
  * Inline status update buttons
* **Timeline View**

  * Tasks displayed across monthly timeline
  * Priority-based color bars
  * Today indicator line

---

### 2. Custom Drag & Drop

* Built using native drag events (no libraries)
* Tasks can be moved across columns
* Active drop zone highlighting

---

### 3.  Virtual Scrolling

* Only visible rows rendered
* Smooth scrolling for large datasets (500+ tasks)
* Buffer rows added for performance
---

### 4. State Management

Used **Zustand** because:

* Simple and lightweight
* No boilerplate (compared to Redux)
* Fast updates across views

---

## Data

* Includes a **data generator**
* Generates 500+ tasks with:

  * Random title
  * Status
  * Priority
  * Assignee
  * Dates

---

## Known Limitations

* Filters with URL sync were planned but not completed due to time constraints
* Drag & drop can be further improved with smoother animations and touch support

---

## Setup Instructions

```bash
npm install
npm run dev
```

---

##  Performance

* Optimized rendering using virtual scrolling
* Minimal re-renders using Zustand
* Designed for Lighthouse score 85+

---

##  Explanation (Task Reflection)

The most challenging part was implementing **virtual scrolling without external libraries**.
I handled this by calculating visible rows based on scroll position and rendering only those items with buffer rows, ensuring smooth performance even with 500+ tasks.

Another challenge was **custom drag-and-drop behavior**. I used native drag events and managed state manually to update task positions and highlight drop zones.

Given more time, I would improve:

* Drag smoothness and animations
* Add full filter system with URL sync
* Enhance UI polish for production-level quality
