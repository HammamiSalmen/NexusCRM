# NexusCRM

A modern, full-stack Customer Relationship Management (CRM) platform designed to streamline client workflows, employee supervision, and task tracking.

## Overview

**NexusCRM** centralizes business interactions, client pipelines, and internal team tasks into one unified dashboard. Built with security and scalability in mind, it simplifies customer lifecycle tracking while providing fine-grained access control across team roles.

## Key Features

* **Client & Lead Management:** Organize contacts, track client lifecycles, and maintain detailed interaction histories.
* **Multi-Factor Authentication & Security:** Secure access powered by JWT tokens, OTP-based 2FA via Brevo API, and strict Role-Based Access Control (RBAC).
* **Task & Activity Tracking:** Assign tasks, set deadlines, and monitor team progress across active projects.
* **Event-Driven Notifications:** Real-time updates and activity tracking powered by Django Signals.

## Tech Stack

* **Backend:** Django REST Framework (Python)
* **Frontend:** React 19 (Vite)
* **Database:** MySQL
* **Security:** JWT Authentication, Brevo OTP API
* **DevOps & Cloud:** Docker (Nginx, Gunicorn), Railway

## Getting Started

### Prerequisites
* Python 3.10+
* Node.js & npm
* MySQL Server / Docker

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/HammamiSalmen/NexusCRM.git
cd NexusCRM

# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend Setup (in a new terminal)
cd ../frontend
npm install
npm run dev
