import { DashboardStats } from "@/types/task";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDashboardStats = async (date: string): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats?date=${date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to get dashboard stats');
    }

    const data = await res.json();
    return {    
        plannedTasks: data.plannedTasks,
        inProgressTasks: data.inProgressTasks,
        completedTasks: data.completedTasks,
        discardedTasks: data.discardedTasks,
        totalEstimatedMinutes: data.totalEstimatedMinutes,
        totalActualMinutes: data.totalActualMinutes,
        completionRate: data.completionRate,
    };
}