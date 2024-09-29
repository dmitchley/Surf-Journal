# Surf Journal App

A web application for tracking and journaling daily surf reports, built with a PostgreSQL database, Express.js backend, and a Next.js frontend.

 

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL, Sequelize ORM, TypeScript
- **Frontend**: Next.js, React.js, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Caching**: Redis  
- **Database**: PostgreSQL
- **Cron Jobs**: `node-cron` for daily surf report fetching and data cleanup

## Features

- **User Authentication**: Secure user creation and login via JWT.
- **Journal Entries**: Users can create, update, delete, and view their surf reports.
- **Daily Reports**: Automatically fetches daily wave data and stores it.
- **Auto Cleanup**: Deletes journal entries older than 5 days.
- **Frontend**: Simple Next.js frontend for user interaction.

 
