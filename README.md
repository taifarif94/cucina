Cucina
Cucina is an experimental restaurant application that demonstrates how to build a customizable meal ordering interface with user authentication. The goal of the project is to provide personalized dish recommendations using collaborative and context-based filtering techniques.

Overview
The repository contains the following parts:

frontend – React application for building a custom plate and managing user login via username/password or Google OAuth.
backend – Node.js/Express server with MySQL integration to record logins and handle future recommendation queries.
server – Simple Express server that exposes example menu data for development.
steak-app – Early prototype of the UI based on Create React App.
While the core recommendation engine is not implemented yet, the structure sets up the necessary components for future expansion. Users can log in, select various meal components (protein, starch, grain), and visualize them on a plate.

Technical Details
React 18 with React Router for routing and component-based UI.
Node.js / Express for API endpoints and middleware such as cors and body-parser.
MySQL for persisting user login data in the backend.
Google OAuth via @react-oauth/google for social login.
Axios for client–server communication.
