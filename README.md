# fitness-application
This is the Fitness application that can sync real time data with your fitness device
This application is deployed as well on netlify


This is a MERN stack fitness tracking web application that allows users to set fitness goals, track workouts, and monitor their progress. The app integrates with Supabase for backend storage and supports real-time tracking, reminders, and notifications. Additionally, it can pull data from wearable devices such as Google Fit or Apple Health.

Features
1. Exercise Logging
      Users can log their daily workouts.
      Information recorded includes:
      Exercise Name: The type of exercise (e.g., running, cycling, etc.)
      Duration: Time spent on the exercise (in minutes).
      Calories Burned: Number of calories burned during the exercise.
      All logs are stored in the Supabase workouts table and linked to the user account.
2. Fitness Goal Tracking
      Users can set specific fitness goals, such as "Run 5 miles" or "Lose 10 pounds".
      Real-time progress tracking is available, which shows users how close they are to reaching their goals.
      Goals are managed in a user-friendly dashboard and visualized via progress charts.
3. Notifications and Reminders
      Reminders for tracking workouts and goals can be set.
      sers will receive notifications if they haven’t logged activity for a certain period.
      Push Notifications are integrated using Firebase for web apps.
      Backend job scheduling can be managed via Node-Cron.
4. Wearable Device Integration (Bonus Feature)
      This app supports integration with Google Fit and Apple Health.
      Automatically syncs workout data such as step counts, heart rate, and calories burned.
      OAuth authentication is used to access data from wearables, ensuring user privacy and consent.
Technologies Used
      Frontend: React, Next.js, Tailwind CSS
      Backend: Node.js, Express.js, Supabase (PostgreSQL), Firebase (for push notifications)
      Database: Supabase (PostgreSQL)
      Authentication: NextAuth.js
      Wearable API Integration: Google Fit, Apple Health API
