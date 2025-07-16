import { mapWeeklyStatFromApi } from "@/utils/mapObjectFromApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface WeeklyStat {
    day: string;      
    planned: number;   
    completed: number; 
  }

export const getWeeklyStats = async (date: string): Promise<WeeklyStat[]> => {
    const res = await fetch(`${API_BASE_URL}/stats/weekly-stats?date=${date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to get weekly stats');
    }

    const data = await res.json();
    return data.map(mapWeeklyStatFromApi);
}   