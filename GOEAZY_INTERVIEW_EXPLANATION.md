# GoEazy – Detailed Project Explanation for Interviews

## 1. Project Overview

GoEazy is a modern real-estate and housing discovery platform built for students, professionals, landlords, and service providers in Uttarakhand. The platform solves a real-world problem: finding reliable, verified, and transparent accommodation options in student-heavy regions where listings are often fragmented, broker-driven, and hard to trust.

The project combines:
- a premium-looking housing marketplace,
- role-based dashboards for different users,
- secure authentication and authorization,
- payment-gated property unlocking,
- and a scalable backend built on Supabase.

In simple terms, GoEazy is a full-stack property discovery and rental ecosystem with a strong focus on trust, user experience, and secure data access.

---

## 2. What Problem It Solves

Before GoEazy, users often faced problems such as:
- hidden brokers and unverified listings,
- lack of transparency in rental details,
- difficulty accessing contact information safely,
- poor user experience while searching for housing,
- fragmented workflows for landlords and service providers.

GoEazy addresses this by offering:
- a direct platform for landlords and tenants,
- verified listings and structured property information,
- role-based access to tools,
- secure gated access to sensitive property information,
- and a polished experience that feels premium and modern.

---

## 3. Core Product Idea

GoEazy is not just a listing website. It is an end-to-end housing ecosystem with multiple user journeys:
- Tenants browse properties, filter by city/price/type, save favorites, and view listings.
- Landlords list properties, manage availability, and edit property information.
- Service providers can create business profiles and offer services to users.
- Admins can review and approve service providers.

This makes the app more than a simple CRUD-based app; it is a multi-role product with business logic, authorization rules, and payment integration.

---

## 4. Main Features

### A. Property Discovery Experience
- Search and browse properties by type, location, budget, and amenities.
- Filter properties dynamically with a clean and responsive interface.
- View featured properties and personalized recommendations.
- Save properties to favorites and track recently viewed listings.
- Toggle between grid and list views.

### B. Onboarding and Personalization
- New tenants can complete a guided onboarding quiz.
- The quiz captures preferences such as persona, property type, city, and budget.
- These preferences are stored in the user profile and used to create recommendations.

### C. Authentication and Role Selection
- Users can sign up, sign in, or use Google OAuth.
- Role selection allows users to register as tenant, landlord, or service provider.
- Protected routes ensure only authorized users can access certain pages.

### D. Landlord Dashboard
- Landlords can create new property listings.
- They can edit or delete their properties.
- Property images are uploaded to storage.
- Landlords can manage their portfolio from a dedicated dashboard.

### E. Service Provider Workflow
- Service providers can create service listings with descriptions, images, pricing, and documents.
- Admin approval controls public visibility.
- Verified providers can be surfaced in nearby services and provider pages.

### F. Admin Panel
- Admins can view platform statistics.
- They can review pending service providers.
- They can approve, reject, or update verification status.

### G. Secure Payments
- Razorpay integration allows secure payment-based unlock flows.
- Sensitive property details are gated behind server-side verification logic.
- Edge Functions handle payment creation and verification securely.

---

## 5. Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- i18next for multilingual support

### Backend / Database
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions
- Row Level Security (RLS)

### Payment / External Services
- Razorpay
- Google OAuth via Supabase Auth

### Development Tools
- ESLint
- PostCSS
- Vite plugin React
- Lucide icons

---

## 6. Project Architecture

The app follows a modern frontend + backend-as-a-service structure.

### Frontend Architecture
The client-side application is organized around:
- Pages for main user experiences
- Reusable UI components
- Custom hooks for business logic
- Redux slices for global state
- Supabase client for backend communication

### Backend Architecture
The backend is mostly handled through Supabase:
- PostgreSQL database stores listings, profiles, services, favorites, reviews, and payment-related data.
- Auth is handled by Supabase Auth.
- Storage is used for property and document images.
- Edge Functions handle secure payment workflows.

### Flow Summary
1. User lands on the homepage.
2. User searches or browses properties.
3. The frontend fetches data from Supabase.
4. Auth state is managed globally in Redux.
5. Sensitive data and role-based actions are gated by protected routes and RLS.
6. Payments and listing unlocks are validated through Edge Functions.

---

## 7. Main Application Entry Points

### App Shell
The application entry is centered around [src/App.jsx](src/App.jsx). This file defines the main route structure and lazy-loads heavy pages to improve performance.

### Main Bootstrap
The app bootstraps in [src/main.jsx](src/main.jsx) and connects Redux and the app root.

### Global Layout
The overall layout is controlled in [src/components/layout/Layout.jsx](src/components/layout/Layout.jsx), which includes the navbar, footer, auth modals, and animated page transitions.

---

## 8. State Management

The app uses Redux Toolkit instead of a complex custom state solution.

### Key Slices
- authSlice: manages authentication state, user session, profile, roles, and loading states.
- propertySlice: stores property listings, filters, favorites, recently viewed items, reviews, and current property details.
- serviceSlice: stores service provider data and filters.
- uiSlice: manages UI state for the app.

### Why Redux Was Used
Redux is useful because the app has many shared states across multiple pages, such as:
- current user session,
- authentication modal visibility,
- property filters,
- favorites,
- and dashboard data.

---

## 9. Authentication and Authorization Model

### Authentication
Authentication is powered by Supabase Auth. Users can sign in with:
- email/password,
- or Google OAuth.

### Profile Handling
After authentication, the app creates or fetches a user profile from the profiles table. This profile includes the user’s role.

### Authorization
Authorization is handled through multiple layers:
- ProtectedRoute components in the frontend restrict access to certain pages.
- Supabase Row Level Security policies protect the database.
- Sensitive property details are only unlocked under proper conditions.

This is a strong point for interviews because it shows that the project was designed with secure access in mind rather than just basic login.

---

## 10. Security Considerations

Security is one of the strongest parts of this project.

### Implemented Security Ideas
- Role-based access to pages and dashboards.
- Row Level Security on the database.
- Protected data fetching for sensitive property fields.
- Payment verification in Edge Functions.
- Authentication checks before handling premium actions.
- Server-side verification for the payment flow.

### Why This Matters
It demonstrates that the project is not just a prototype; it was built with a “real product” mindset, focusing on data safety and restricted access.

---

## 11. Payment and Unlock Flow

One of the more impressive parts of the platform is the paid unlock feature.

### How It Works
1. A user wants to access gated property details.
2. The frontend requests a payment order from a Supabase Edge Function.
3. The Edge Function validates the user and creates a Razorpay order.
4. The payment is processed.
5. The server verifies the payment and unlocks access to the requested property details.

### Why It Is Important
This shows a good understanding of:
- backend security,
- API integration,
- protected content access,
- and real transaction handling.

---

## 12. Database Model and Core Tables

The database design is centered around Supabase PostgreSQL and was built in a layered way so the app could scale from simple listings to role-based workflows, reviews, visits, and payments.

### Database Architecture
- Hub table: `profiles` is the base identity table linked to `auth.users`. It stores the user’s role, contact details, and onboarding preferences.
- Property domain: `properties` stores landlord listings, while `favorites`, `recently_viewed`, `property_reviews`, `site_visits`, and `unlocked_properties` connect users back to properties.
- Service domain: `service_providers` is the parent table for service businesses. `service_listings`, `service_plans`, and `service_reviews` hang off it as child tables.
- Workflow tables: `payment_attempts` is used for rate limiting payment order creation, `notifications` stores system messages, and `site_visits` handles visit requests between tenants and landlords.
- Supporting assets: images and documents are stored in Supabase Storage, not directly inside tables, so the database stays lightweight.

### How The Schema Was Designed
I started with the core entities the product needed most: users, properties, and roles. Then I normalized the data so each table had one clear responsibility instead of mixing everything into a single large table.

After that, I added relationship tables for common user actions like saving a property, viewing it recently, reviewing it, or requesting a site visit. For premium and sensitive actions, I introduced separate tables such as `unlocked_properties` and `payment_attempts` so access could be controlled by Edge Functions and Row Level Security.

### Why This Structure Works
- It keeps the schema normalized and easy to query.
- It supports multiple user roles without duplicating data.
- It separates public browseable data from private or payment-gated data.
- It makes security easier because each table has a clear ownership rule.
- It is easy to extend with new modules like service listings, reviews, or onboarding without redesigning the whole database.

### Interview Version
If I had to explain it in an interview, I would say: I designed the schema around `profiles` as the central identity table, then linked properties, services, favorites, reviews, visits, and payment data through relational tables. I kept browseable data public, ownership-based actions protected with RLS, and sensitive payment flows routed through Edge Functions. That gave me a clean, scalable, and secure database architecture.

---

## 13. Folder Structure Summary

### src/
- components/: reusable UI and feature components
- hooks/: custom hooks for data fetching and auth logic
- lib/: Supabase client setup
- pages/: route-level pages and dashboards
- store/: Redux slices and store config
- utils/: constants and helper functions

### supabase/
- functions/: Edge Functions for payments and secure server logic
- migrations/: database schema evolution and new features
- schema.sql: base database schema

This structure is clean and modular, which is great for interviews because it shows scalability and maintainability.

---

## 14. User Roles and Experiences

### Tenant / Student / Professional
Primary goals:
- find housing quickly,
- view relevant options,
- save favorites,
- and get personalized recommendations.

### Landlord
Primary goals:
- publish properties,
- update listings,
- and monitor their portfolio.

### Service Provider
Primary goals:
- create service listings,
- upload documents,
- and get approved by admins.

### Admin
Primary goals:
- monitor users and listings,
- approve service providers,
- and maintain trust and quality of the platform.

---

## 15. Why This Project Is Impressive

This project stands out because it combines several modern development concepts in one app:
- React frontend with component-based UI
- Redux for state sharing
- Supabase for backend database and auth
- Edge Functions for secure logic
- role-based access control
- payment integration
- polished UX and animation
- real-world product thinking

That makes it a strong example of a full-stack product built by a single developer or small team.

---

## 16. Possible Interview Questions

### 1. What is GoEazy?
GoEazy is a full-stack housing and services platform for students, professionals, landlords, and service providers. It helps users discover properties, manage listings, and access secure premium workflows.

### 2. What problem does this project solve?
It solves the problem of fragmented, untrusted, and broker-heavy housing discovery by giving users a direct and structured platform for property search and related services.

### 3. What was the main idea behind the architecture?
The architecture was designed around clear roles, clean relationships, and secure access. I used `profiles` as the identity hub and connected properties, services, favorites, reviews, visits, and payments through relational tables.

### 4. Which tech stack did you use?
I used React, Vite, Redux Toolkit, Tailwind CSS, Supabase PostgreSQL, Supabase Auth, Supabase Storage, Supabase Edge Functions, and Razorpay.

### 5. Why did you choose Supabase?
Supabase gave me a complete backend with Postgres, authentication, storage, RLS, and edge functions in one place, which made it ideal for a secure multi-role application.

### 6. Why did you use Redux Toolkit?
Redux Toolkit helped manage shared state like auth, filters, favorites, dashboard data, and property details across multiple pages without making the app messy.

### 7. What is the role of the profiles table?
`profiles` stores user identity, role, contact details, and onboarding data. It is the central table that connects a user to the rest of the system.

### 8. How is the properties table designed?
`properties` stores listing data such as title, description, price, city, area, type, amenities, images, and availability. It is linked to the landlord who created it.

### 9. Why did you create separate tables like favorites and recently_viewed?
Those tables store user actions in a normalized way. This keeps the schema cleaner and makes it easy to track saved and recently viewed properties efficiently.

### 10. How did you handle service providers?
I created a separate `service_providers` table with child tables for `service_listings`, `service_plans`, and `service_reviews` so the services module could grow independently from properties.

### 11. How did you design the reviews system?
I created separate review tables for properties and services, and I enforced one review per user per target using unique constraints.

### 12. What is the purpose of the site_visits table?
It handles visit requests between tenants and landlords. It stores property, user, landlord, visit date, and visit status in a structured workflow.

### 13. How did you handle onboarding?
I added `onboarding_data` in profiles to store quiz preferences like user type, property preference, city, and budget so the app can personalize recommendations.

### 14. How is the payment flow secured?
Payment creation and verification are handled through Supabase Edge Functions and not directly from the client, so the sensitive logic stays server-side.

### 15. What are payment_attempts and unlocked_properties used for?
`payment_attempts` helps rate-limit payment order creation, and `unlocked_properties` stores which users have successfully unlocked which properties.

### 16. How did you implement Row Level Security?
I enabled RLS on all important tables and wrote policies so users can only read or modify the data they own, while public browseable data remains accessible.

### 17. How did you manage authentication and roles?
I used Supabase Auth for login and stored the user role in the profiles table. The frontend then uses protected routes and the backend uses RLS to enforce access.

### 18. What kind of security measures did you add?
I used role-based access, RLS policies, secure payment verification, protected storage access, and server-side unlock logic for sensitive workflows.

### 19. What was the most challenging part?
The hardest part was designing a schema that could support multiple roles and workflows while still staying simple, secure, and easy to query.

### 20. Why is this project strong for interviews?
Because it shows product thinking, backend design, security awareness, state management, and real-world workflow implementation in one project.

---

## 17. Interview Talking Points

If you are explaining this project in an interview, you can say:

- “I built a full-stack housing platform for students and professionals using React and Supabase.”
- “The app includes multiple user roles, secure authentication, protected data access, and payment-gated content.”
- “I used Redux Toolkit for centralized state management and built a modular component-based architecture.”
- “I implemented a real-world workflow for landlords, tenants, service providers, and admins.”
- “I also integrated Razorpay and Supabase Edge Functions to handle secure payment and unlock logic.”

---

## 18. What I Learned While Building It

This project strengthened several skills:
- building a multi-role application,
- integrating authentication and authorization securely,
- working with backend-as-a-service platforms,
- designing scalable frontend architecture,
- and creating a polished and production-minded UI.

---

## 19. Short Summary for Interviews

GoEazy is a modern housing marketplace built with React, Vite, Redux Toolkit, and Supabase. It helps users discover properties, supports landlords and service providers, includes secure authentication and role-based access, and uses Razorpay and edge functions for payment-gated workflows. The project reflects both frontend design skills and backend architecture thinking, making it a strong portfolio project for demonstrating end-to-end product development.
