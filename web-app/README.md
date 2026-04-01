# Patel Samaj - Blood Group Collection (Web App)

This directory contains the primary frontend application for managing the Patel Samaj blood donor registry. It is built using **React (v18+)** and bundled with **Vite** for rapid iterative development.

## Requirements
* Node.js
* npm

## 🚀 Quick Start

From the `web-app` directory:

1.  **Install the dependencies:**
    ```bash
    npm install
    ```

2.  **Start the local development server:**
    ```bash
    npm run dev
    ```

3.  **Run the unit test suite (Vitest):**
    ```bash
    npm run test
    ```

4.  **Lint your code:**
    ```bash
    npm run lint
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```
    *(Note: Output will be available in the `dist` folder, which is excluded from version control for security.)*

## 📁 Key Directories

*   `/src`: Main React application source code.
*   `/src/pages`: Individual application screens (Dashboard, Directory, Forms).
*   `/src/components`: UI components used across the app (reused blocks).
*   `/src/hooks`: Global custom React hooks managing shared state/storage (`useBloodDonorData.ts`).
*   `/src/test`: Setup configuration for automated testing.

## 🔐 Security Information for GitHub

**DO NOT COMMIT API KEYS OR SECRETS.**
If you require environment variables, add them to `.env.local`. The `.gitignore` in this project is strictly configured to ensure files starting with `.env` are completely ignored by Git.

Additionally, output directories (`node_modules/`, `dist/`) and log files (`npm-debug.log`, `*.log`) are ignored to keep the repository clean.
