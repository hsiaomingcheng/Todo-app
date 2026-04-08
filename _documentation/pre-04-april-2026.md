# Project Milestones: Pre-April 04, 2026

## 🎯 What I Did (Major Achievements)

### 1. Project Initialization & Foundation
- **Full-Stack Setup**: Successfully initialized both environments for the app—laying down the foundation for the Python backend and spinning up the React frontend.
- **Version Control Initiation**: Set up Git and created the initial foundational commits to start successfully tracking my code.

### 2. Frontend Structure & Core Pages
- **Built Essential UI Pages**: Scaffolded the primary navigational points of the application, including the `NotFoundPage`, `LoginPage` and `RegisterPage`.
- **Frontend API Integration**: Built out a dedicated calling layer in the frontend, enabling the React app to communicate across the network.
- **Implemented Login Requests**: Transitioned the `LoginPage` from a static UI element into a functional component that interfaces with password verification mechanics.

### 3. Backend API Standardization
- **Configured Global API Routing Prefixes**: Adjusted how the backend handles routes, implementing an organized prefix system (e.g., nesting routes logically to keep the API structure clean).
- **RESTful Error Handling**: Overhauled the backend's error management. I transitioned the API handling to conform to modern RESTful standards—ensuring that issues reflect appropriate status codes and cleanly structured responses directly to the frontend.

***

## 🧠 What I Learned & Demonstrated

### 1. Separation of Concerns (Frontend vs Backend)
- I successfully proved I can initialize and bridge two distinct stacks. I learned how to structure HTTP communications so that the browser client (React) seamlessly asks the server environment (Python) for validation.

### 2. Industry Standard API Design (RESTful Constraints)
- Learning to throw proper, standardized HTTP error responses (like `400 Bad Request` or `401 Unauthorized`) instead of just failing silently or returning `200 OK` on errors is a major hallmark of stepping into a professional backend development mindset. 

### 3. Foundational Route Security
- By creating the Login, Register, and NotFound components before main application data features, I practiced the philosophy of putting security, user onboarding, and core application flow first.

### 4. Password Verification Mechanics
- I touched on validating credentials natively inside the backend environment based on frontend input, laying the literal groundwork for the broader Authentication Context I'd build days later.
