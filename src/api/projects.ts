import { Project } from "@/types/projects";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: project.name,
            description: project.description,
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to create project');
    }
    
    const data = await res.json();
    return data;
}

export const getAllProjects = async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to get projects');
    }

    const data = await res.json();
    return data;
}