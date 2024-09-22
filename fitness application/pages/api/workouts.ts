// pages/api/workouts.ts
import { supabase } from '@/utils/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { exercise, duration, calories, user_id } = req.body;

    // Validate input data
    if (!exercise || !duration || !calories || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Use Supabase client to insert data
      const { data, error } = await supabase
        .from('workouts')
        .insert([{ exercise, duration, calories, user_id }]);

      if (error) {
        throw error;
      }

      // Respond with inserted data
      return res.status(200).json({ data });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  } else {
    // Method not allowed for non-POST requests
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
