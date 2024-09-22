import cron from "node-cron";
import { supabase } from "@/utils/supabase";
import admin from './firebaseAdmin'; // Assuming you have set up Firebase Admin SDK

// Schedule a task to run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    // Fetch inactive users who haven't logged an activity in the last 7 days
    const { data: inactiveUsers, error } = await supabase
      .from("users")
      .select("*")
      .lt("last_logged_workout", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days

    if (error) {
      console.error("Error fetching inactive users:", error);
      return;
    }

    // Send reminders to each inactive user
    inactiveUsers.forEach(async (user) => {
      // Example: Send push notification
      const message = {
        notification: {
          title: 'We Miss You!',
          body: 'It looks like you haven’t logged an activity in a while. Come back and stay active!',
        },
        token: user.fcm_token, // Assuming you store the user's FCM token in the user record
      };

      try {
        await admin.messaging().send(message);
        console.log(`Reminder sent to user ${user.id}`);
      } catch (sendError) {
        console.error(`Error sending notification to user ${user.id}:`, sendError);
      }
    });
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
