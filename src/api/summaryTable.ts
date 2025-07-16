const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSummaryTable = async (startDate: string, endDate: string) => {
    const res = await fetch(`${API_BASE_URL}/highlights?startDate=${startDate}&endDate=${endDate}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to get summary table');
    }

    const data = await res.json();
    return data;
}