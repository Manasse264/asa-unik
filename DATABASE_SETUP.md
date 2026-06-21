# Database Connection Instructions

1.  **Create a `.env` file** in the root of your project (`C:\Users\user\OneDrive\Desktop\asa_unik\.env`).
2.  **Add your database connection string** to this file, ensuring the port is correct (e.g., `5432` for standard PostgreSQL):

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name"
    ```
    *Replace `user`, `password`, `localhost`, `5432`, and `your_database_name` with your actual database details.*

3.  **Restart the Development Server**
    After creating the `.env` file, you **must** stop and restart your development server for the changes to take effect:

    ```bash
    # Press Ctrl+C in your terminal to stop the process
    npm run dev
    ```
