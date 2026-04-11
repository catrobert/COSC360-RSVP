# **Implementation Overview**

**Team Members:** Cat Robert, Lexi Loudiadis, Trey Huculak, Fraser Muller

## **Project Overview**

The COSC 360 RSVP Platform is a full-stack web application for browsing, creating, and RSVP'ing to events. It supports guest browsing, user authentication, profile management, event reviews, saved events, and an admin control panel with analytics and user/event management. The application is containerized with Docker and launches with a single command.

## **Tech Stack**

* **Frontend:** React 19, Vite, React Router DOM  
* **Backend:** Node.js, Express 5  
* **Database:** MongoDB with Mongoose ODM  
* **Auth:** bcryptjs | **Visualization:** Recharts | **Testing:** Jest, React Testing Library | **Deployment:** Docker 

## **Architecture**

The backend follows a Controller-Service-Repository pattern. Routes (server/src/modules/routes/) map endpoints to controllers, which handle request/response formatting and validation. Services (server/src/modules/services/) contain business logic. Repositories (server/src/modules/repository/) handle all database interactions via Mongoose. This layering keeps concerns isolated and enables independent testing.

The React frontend uses feature-based organization. Pages (client/src/pages/) are top-level views (home, event, profile, my events, saved events, analytics). Features (client/src/features/) are self-contained modules (login, register, event creation, reviews, admin management). Shared components (client/src/components/) include sidebars, top nav, protected route wrapper, and login overlay. Auth state is managed via React Context and persisted in localStorage.

**Key directories:** client/src/pages/ (6 pages), client/src/features/ (login, register, adminManagement, event), client/src/components/ (Sidebar, AdminSidebar, TopNav, ProtectedRoute, LoginOverlay), server/src/modules/ (controllers, services, repository, model, routes), client/src/tests/ (8 suites), server/src/tests/ (9 suites). 

## 

## **Security**

**Server-side:** Passwords hashed with bcryptjs (salt factor 10); login uses bcrypt.compare. Environment variables (MONGO\_URI) defined in docker-compose.yaml. Multer file filter restricts uploads to JPEG/PNG with a 5 MB limit. Auth middleware validates user existence and activation status; deactivated accounts receive 403\. Email format validated via regex on registration; username and email uniqueness enforced.

**Client-side:** All password fields use type="password". Registration enforces regex for username, email, and password complexity (letter \+ number, 8-16 chars). Password reset applies the same rules. Profile image required at registration.

## **Database**

Three Mongoose models: **User** (name, username, email, hashed password, role, isActivated, profilePhoto, description array with birthday/gender/location; unique index on username). **Event** (name, date, location, times, price, description, image, attendance, createdBy ref, embedded reviews array serving as comment threads; each review has userId ref, rating, comment; virtual averageRating). **RSVP** (eventId ref, userId ref, status yes/no/saved; compound unique index on eventId+userId). The database auto-seeds on first startup via seedIfEmpty().

## **Features Implemented**

* **Registration and login** \- requires username, email, password, and profile image. Session maintained via localStorage and AuthContext.  
* **Guest browsing** \- unauthenticated users browse events; protected actions trigger a login overlay.  
* **Event browsing and filtering** \- asynchronous loading with real-time text search and date filtering (all/past/future/specific date).  
* **Event CRUD** \- create events with name, location, date, time, price, description, image. Creators can edit/delete their own events.  
* **RSVP system** \- RSVP yes, save/bookmark, or decline with attendance tracking. Users can cancel RSVPs.  
* **Saved events** \- dedicated page with async search within bookmarked events.  
* **My Events** \- four-group organization: upcoming hosting, upcoming attending, previously hosted, previously attended.  
* **Reviews** \- gated to users who RSVP'd "yes" to past events. One review per user per event enforced server-side.  
* **Profile management** \- view/edit personal info and profile photo with file type and size validation.  
* **Password reset** \- dedicated page with validation rules.  
* **Admin management** \- search users by name/username/email; promote/demote roles; deactivate/reactivate accounts; delete users. Search events by title/location/description; edit/delete any event.  
* **Admin analytics** \- platform stats with bar charts (revenue/quarter, events/quarter, rating distribution, gender distribution) and date-range filtering.

## **Testing**

17 test suites, 161 total tests. **Backend (9 suites, 131 tests):** auth, events, RSVP, reviews, admin management, activation, analytics, event services unit, user profile. Tests use an in-memory MongoDB via mongodb-memory-server. **Frontend (8 suites, 30 tests):** EventCard, EventContainer, EventPage, MyEvents, SavedEvents, ResetPassword, HomeFiltering, AdminManagement. Run with npm test. All 161 tests pass.

## **Deployment**

Docker Compose runs three services: **mongo** (MongoDB 7, persistent volume, health check), **backend** (Express server, MONGO\_URI env var, depends on healthy mongo), **frontend** (Vite dev server proxying /api and /uploads to backend). Accessible at http://localhost:4000. Deploy with docker compose up \--build.

## **Known Limitations**

* **Password reset** only requires username; no email/2FA verification.  
* **RSVP status conflict**: saving an event after RSVP'ing "yes" overwrites the status, effectively removing the RSVP.  
* **Auth model** uses header-based user ID rather than cryptographic tokens (sufficient for project scope).  
* **Event creation** relies on Mongoose schema validation rather than explicit controller-level field checks.

