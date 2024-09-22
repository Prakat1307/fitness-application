"use client";

import { useState, useEffect } from "react";
import { useGoalStore } from "@/hooks/useGoalStore";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";

interface ProgressChartProps {
  goalId: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ goalId }) => {
  const [progressData, setProgressData] = useState<{
    completedWorkouts: number;
    totalWorkouts: number;
  }[]>([]);

  const [workouts, setWorkouts] = useState([]);
  const [fitnessGoal, setFitnessGoal] = useState<string | null>(null);
  const [fitnessGoalValue, setFitnessGoalValue] = useState<number | null>(null);
  const [fitnessGoalUnit, setFitnessGoalUnit] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const goals = useGoalStore((state) => state.goals);
  const goal = goals.find((g) => g.id === goalId);

  useEffect(() => {
    if (session?.user?.id && goalId) {
      const fetchProgressData = async () => {
        try {
          // Fetch workout data
          const { data: workoutData, error: workoutError } = await supabase
            .from("workouts")
            .select("id, completed, exercise, duration, calories")
            .eq("goal_id", goalId)
            .eq("user_id", session.user.id);

          if (workoutError) {
            console.error("Error fetching workout data:", workoutError);
            return;
          }

          if (workoutData) {
            const completedWorkouts = workoutData.filter(
              (workout) => workout.completed
            ).length;
            const totalWorkouts = workoutData.length;

            setProgressData([{ completedWorkouts, totalWorkouts }]);
            setWorkouts(workoutData); // Store workout history data
          }

          // Fetch fitness goal data
          const { data: fitnessGoalData, error: fitnessGoalError } = await supabase
            .from("goals")
            .select("fitness_goal, fitness_goal_value, fitness_goal_unit")
            .eq("id", goalId)
            .single();

          if (fitnessGoalError) {
            console.error("Error fetching fitness goal data:", fitnessGoalError);
            return;
          }

          if (fitnessGoalData) {
            setFitnessGoal(fitnessGoalData.fitness_goal);
            setFitnessGoalValue(fitnessGoalData.fitness_goal_value);
            setFitnessGoalUnit(fitnessGoalData.fitness_goal_unit);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchProgressData();
    }
  }, [session, goalId]);

  // Calculate progress towards the fitness goal
  const currentFitnessValue = workouts.reduce((total, workout) => {
    // Assuming each workout contributes to the fitness goal value
    return total + (workout.completed ? workout.duration : 0); // Adjust this logic based on your specific goals
  }, 0);

  const progressPercentage =
    progressData.length > 0 && goal
      ? Math.round(
          (progressData[0].completedWorkouts /
            progressData[0].totalWorkouts) *
            100
        )
      : 0;

  const fitnessProgressPercentage =
    fitnessGoalValue && currentFitnessValue
      ? Math.round((currentFitnessValue / fitnessGoalValue) * 100)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2">
        Progress: {goal?.name}
      </h2>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xl font-bold">{progressPercentage}%</span>
          <span className="text-sm">Workout Completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-primary rounded-full h-4"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      <p className="text-gray-600 text-sm">
        {progressData[0]?.completedWorkouts || 0} of{" "}
        {progressData[0]?.totalWorkouts || 0} workouts completed.
      </p>

      {/* Fitness Goal Progress Section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold">Fitness Goal Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold">{fitnessProgressPercentage}%</span>
            <span className="text-sm">Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-primary rounded-full h-4"
              style={{ width: `${fitnessProgressPercentage}%` }}
            />
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          {currentFitnessValue || 0} of {fitnessGoalValue || 0} {fitnessGoalUnit}
        </p>
      </div>

      {/* Workout History Section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold">Workout History</h3>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div key={workout.id} className="border-b py-2">
              <p>
                <strong>Exercise:</strong> {workout.exercise}
              </p>
              <p>
                <strong>Duration:</strong> {workout.duration} min
              </p>
              <p>
                <strong>Calories Burned:</strong> {workout.calories} cal
              </p>
            </div>
          ))
        ) : (
          <p>No workouts logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;