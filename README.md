# Patel Samaj - Blood Group Collection

A comprehensive web application designed to manage blood donor registrations, schedules, and donation history for the Patel Samaj community.

## 🚀 Features

*   **Donor Onboarding**: Intuitive step-by-step onboarding for new users and admins.
*   **Donor Directory**: Centralized management of all registered blood donors, easily searchable and sortable.
*   **Donation Scheduling**: Plan and track scheduled donations to ensure a steady supply of blood when needed.
*   **Donation History**: Maintain detailed records of past donations, including vitals like hemoglobin, blood pressure, and volume.
*   **Responsive UI**: Built with a mobile-first approach using specialized, premium styling, ensuring it looks great on any device.
*   **Offline Support / Local Storage**: Uses modern state management backed by local storage for instant data availability and persistence.

## 🛠️ Technology Stack

*   **Frontend Library:** React (v18+)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS with custom premium UI components, Lucide React (Icons)
*   **Type Safety:** TypeScript
*   **Testing:** Vitest & React Testing Library
*   **Data Visualization:** Recharts

## 📁 Project Structure

The repository is structured to separate different concerns:

*   `/web-app`: The core React frontend application built with Vite.
*   `/hooks`: Contains shared standard hooks (e.g., toast notifications).
*   `/components`: Reusable UI components.

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/) (v16.x or newer strongly recommended)
*   npm (Node Package Manager)

## 💻 Getting Started (Local Development)

To run this project locally, follow these steps:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/tejaspatel2255/Blood-Group-Collection
    cd blood-group-collection
    ```

2.  **Navigate directly to the Web App**
    Most of the active development happens in the `web-app` directory.
    ```bash
    cd web-app
    ```

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    This will start Vite on `http://localhost:5173`. Open this URL in your browser to view the app.

## 🧪 Running Tests

Unit tests are written using Vitest. To run the test suite:

```bash
cd web-app
npm run test
```

## 🔐 Security & GitHub

*   **Environment Variables**: Ensure you create a `.env` or `.env.local` file based on `.env.example` if applicable. **Never commit `.env` files to this repository.** The `.gitignore` is configured to prevent this.
*   **Dependencies**: `node_modules` folders are strictly ignored.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
"# Blood-Group-Collection" 
