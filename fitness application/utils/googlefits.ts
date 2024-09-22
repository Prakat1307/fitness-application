export const fetchStepCount = async (accessToken: string, startTime: number, endTime: number) => {
    try {
      const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
          startTimeMillis: startTime,
          endTimeMillis: endTime,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch step count data');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching step count data:', error);
      throw error;
    }
  };
  