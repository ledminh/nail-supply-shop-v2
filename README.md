# Nail Supply Shop - Second Iteration

## Overview

In this second iteration, I have transformed the project into a fully functional app, complete with a database and authentication for the admin panel. This decision was made based on the insights gained from the [first attempt](https://github.com/ledminh/nail-supply-shop).

To ensure a seamless design process, I have leveraged Storybook for creating and managing the design system.

## Tech Stack

- **Framework:** Next.js
- **Database:** Prisma, PostgreSQL, lowdb (for mockup)
- **Authentication:** Clerk
- **Styles:** SCSS, CSS Modules
- **Design System:** Storybook

## Screenshot
![Second Iteration Screenshot](2nd-iteration-screenshot.jpg)

## Live Demo

You can experience the live demo of this second iteration at [this link](https://nail-supply-shop-v2.vercel.app).

For administrative access, please use the following credentials:

- **Admin URL:** [https://nail-supply-shop-v2.vercel.app/admin](https://nail-supply-shop-v2.vercel.app/admin)
- **Username:** store_admin
- **Password:** admin_54321

## Deployment Instructions

To deploy this project on your local machine, follow these steps:

1. Clone this project to your computer:

   ```sh
   git clone https://github.com/ledminh/nail-supply-shop-v2
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Add the necessary environment variables to your project:

   In the `.env` file:

   ```
   DATABASE_URL
   DIRECT_URL
   ```

   In the `.env.local` file:

   ```
   SUPABASE_STORAGE_URL
   SUPABASE_API_KEY
   SUPABASE_IMAGE_URL
   STRIPE_SECRET_KEY
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   ADMIN_ID
   ```

4. Since this project uses Next.js, you can run the development server with the following command:

   ```sh
   npm run dev
   ```

5. If you wish to deploy it to your own server, follow these steps:

   - Build the project:

     ```sh
     npm run build
     ```

   - Start the server:

     ```sh
     npm run start
     ```

## Continuing Development

Here's a list of tasks for the ongoing development of this project:

- Implement a customer login feature.
- Set up email confirmation for customers after checkout.
- Enhance the user interface.
- Incorporate additional animations to improve the user experience.
