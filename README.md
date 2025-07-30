# My Chronos Tasks

A modern, responsive task management application built with React and Firebase, designed to help users organize their daily activities. It features secure user authentication, real-time task management (add, edit, delete, mark complete), and data persistence in Firestore.

A comprehensive and intuitive task management application built with React, offering a seamless experience for organizing your daily activities. This application features secure user authentication via Firebase, real-time task synchronization, and persistent storage of your tasks using Firestore. Whether you need to add, edit, delete, or mark tasks as complete, "My Daily Tasks" keeps you on track.

## Features

* **User Authentication**: Secure user login and registration powered by Firebase Authentication.
* **Real-time Task Management**: Add new tasks, edit existing ones, mark tasks as completed, and delete tasks with real-time updates across devices.
* **Firestore Integration**: All task data is persistently stored in Google Firestore, ensuring your tasks are saved and accessible.
* **Today's View**: A dedicated section to easily view tasks due on the current day, helping you prioritize.
* **Category-Based Organization**: (If your categories are dynamic or a prominent feature, mention this)
* **Customizable Theme**: Toggle between light and dark modes to suit your preference, with styles managed via CSS variables.
* **Responsive Design**: A user-friendly interface that adapts gracefully to various screen sizes, from mobile devices to desktops.
* **Custom Fonts**: Utilizes "Comic Neue" font for a distinctive look.

## Technologies Used

* **React**: A JavaScript library for building dynamic user interfaces.
* **React Router DOM**: For declarative routing within the application.
* **Firebase**:
    * **Firebase Authentication**: For user sign-up, login, and session management.
    * **Firestore**: A NoSQL cloud database for storing and syncing task data in real-time.
* **Custom Hooks**: Leverages a `useLocalStorage` hook for managing application themes locally.
* **CSS/SCSS Modules**: For scoped and maintainable styling, including a robust theming system using CSS variables.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd YOUR_REPOSITORY_NAME
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Firebase Configuration

This project uses Firebase for authentication and data storage. You'll need to set up your own Firebase project:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Enable **Firebase Authentication** (Email/Password provider).
4.  Enable **Cloud Firestore** and start in production mode (you can configure security rules later).
5.  Add a new web app to your Firebase project and copy your Firebase configuration object.
6.  Create a file named `.env` in the root of your project and add your Firebase configuration variables like this (replace with your actual values):

    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_Messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```
    *(Note: The provided code snippet shows `auth` and `db` imports from `./firebase`. Ensure you have a `firebase.ts` or `firebase.js` file that initializes Firebase with these environment variables.)*

### Running the Application

After configuring Firebase, you can start the development server:

```bash
npm start
# or
yarn start
