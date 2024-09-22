import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useSession } from "next-auth/react";

const WorkoutInput = () => {
  const { data: session } = useSession();
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    if (!session) {
      setError(new Error("You must be logged in to log a workout."));
      return;
    }

    // Validate input fields
    if (!exercise || duration <= 0 || calories <= 0) {
      setError(new Error("Please provide valid input for all fields."));
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("workouts")
        .insert([{ 
          exercise, 
          duration, 
          calories, 
          user_id: session.user.id 
        }]);
      if (error) throw error;

      // Reset the input fields
      setExercise("");
      setDuration(0);
      setCalories(0);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        placeholder="Exercise"
        required
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value))}
        placeholder="Duration (minutes)"
        min="1"
        required
      />
      <input
        type="number"
        value={calories}
        onChange={(e) => setCalories(parseInt(e.target.value))}
        placeholder="Calories Burned"
        min="1"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging..." : "Log Workout"}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
};

export default WorkoutInput;
