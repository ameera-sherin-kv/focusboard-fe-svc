import { Task, TaskPriority, TaskStatus } from "@/types/task";

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
  };
}
