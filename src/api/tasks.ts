import { Task } from "@/types/task";
import { mapTaskFromApi } from "@/utils/mapObjectFromApi";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getAllTasks = async (): Promise<Task[]> => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!res.ok) {
      throw new Error('Failed to get tasks');
    }
  
    const data = await res.json();
    return data.map(mapTaskFromApi); 
  };

  export const getTasksByDate = async (date: string): Promise<Task[]> => {
    const res = await fetch(`${API_BASE_URL}/tasks/date/${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Failed to get tasks');
    }

    const data = await res.json();
    return data.map(mapTaskFromApi);
  }

  export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        estimated_time: task.estimatedMinutes,
        notes: task.notes,
        date: task.date,
        project_id: task.projectId,
      })
    });
  
    if (!res.ok) {
      throw new Error('Failed to create task');
    }
  
    console.log('createTask', res);
    return await res.json();
  };

  export const updateTaskById = async (id: string, task: Partial<Task>) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        estimated_time: task.estimatedMinutes,
        notes: task.notes,
        date: new Date().toISOString()
      })
    });
  }

  export const getTaskById = async (id: string): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Failed to get task');
    }

    const data = await res.json();
    return mapTaskFromApi(data);
  }

  export const deleteTaskById = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }