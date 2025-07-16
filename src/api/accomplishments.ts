import { Accomplishment } from "@/types/task";
import { mapAccomplishmentFromApi } from "@/utils/mapObjectFromApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createAccomplishment = async (accomplishment: Omit<Accomplishment, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log(`Creating accomplishment: \ntitle: ${accomplishment.title}\ndescription: ${accomplishment.description}\ntimeTaken: ${accomplishment.timeTaken}\nchallenges: ${accomplishment.challenges}\ncomments: ${accomplishment.comments}\ntaskId: ${accomplishment.taskId}`);
    console.log('Proofs: ', accomplishment.attachments.map(a => a));    
    const res = await fetch(`${API_BASE_URL}/accomplishments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: accomplishment.title,
        description: accomplishment.description,
        time_taken: accomplishment.timeTaken,
        challenges: accomplishment.challenges,
        comments: accomplishment.comments,
        proofs: accomplishment.attachments,
        task_id: accomplishment.taskId,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to create accomplishment');
    }

    const data = await res.json();
    return mapAccomplishmentFromApi(data);
  }

  export const getAccomplishmentsByTaskId = async (taskId: string): Promise<Accomplishment[]> => {
    const res = await fetch(`${API_BASE_URL}/accomplishments/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to get accomplishments');
    }

    const data = await res.json();
    return data.map(mapAccomplishmentFromApi);
  }

  export const updateAccomplishmentById = async (id: string, accomplishment: Accomplishment) => {
    const res = await fetch(`${API_BASE_URL}/accomplishments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: accomplishment.title,
        description: accomplishment.description,
        time_taken: accomplishment.timeTaken,
        challenges: accomplishment.challenges,
        comments: accomplishment.comments,
        attachments: accomplishment.attachments,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to update accomplishment');
    }

    const data = await res.json();
    return mapAccomplishmentFromApi(data);
  }

  export const deleteAccomplishmentById = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/accomplishments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete accomplishment');
    }

    return res.json();
  }