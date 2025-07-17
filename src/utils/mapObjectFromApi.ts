import { WeeklyStat } from "@/api/weeklyStats";
import { Accomplishment, AccomplishmentWithProofsAndProject, Task, TaskPriority, TaskStatus } from "@/types/task";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapTaskFromApi(data: any): Task {
  return {
    id: data.id,
    title: data.title,
    description: data.description ?? "",
    status: data.status as TaskStatus,
    priority: data.priority as TaskPriority,
    estimatedMinutes: data.estimated_time,
    actualMinutes: data.actual_minutes ?? undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    notes: data.notes ?? "",
    date: data.date,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapAccomplishmentFromApi(data: any): Accomplishment {
  return {
    id: data.id,
    title: data.title,
    description: data.description ?? "",
    timeTaken: data.time_taken ?? undefined,
    challenges: data.challenges ?? undefined,
    comments: data.comments ?? undefined,
    attachments: data.attachments ?? undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapWeeklyStatFromApi(data: any): WeeklyStat {
  return {
    day: data.day,
    planned: data.planned,
    completed: data.completed,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapAccomplishmentWithProofsAndProjectFromApi(data: any): AccomplishmentWithProofsAndProject {
  const a = data.accomplishment;

  return {
    id: a.id,
    title: a.title,
    description: a.description ?? "",
    timeTaken: a.time_taken ?? undefined,
    challenges: a.challenges ?? undefined,
    comments: a.comments ?? undefined,
    attachments: a.attachments ?? undefined,
    createdAt: new Date(a.created_at),
    updatedAt: new Date(a.updated_at),
    project: {
      id: a.project_id,
      name: a.project_name,
      description: a.project_description,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    proofs: (data.proofs ?? []).map((p: any) => ({
      id: p.id,
      accomplishmentId: p.accomplishment_id,
      type: p.type,
      title: p.title,
      url: p.url,
      createdAt: new Date(p.created_at),
      updatedAt: new Date(p.updated_at),
    })),
  };
}
