import { hubAuthHeaders } from "@/utils/common/api-headers"
import { API_BASE } from "@/utils/common/api-url"

export type Priority = "low" | "medium" | "high"

export interface HubTaskListDTO {
  id: string
  hubId: string
  name: string
  color: string
  icon: string
  ownerMemberId: string | null
  isArchived: boolean
  createdAt: string
  sortOrder: number
}

export interface HubTaskDTO {
  id: string
  hubId: string
  listId: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  tags: string[]
  assignedToMemberId: string | null
  deadline: string | null
  createdByMemberId: string | null
  createdAt: string
  completedAt: string | null
  sortOrder: number
}

/* ---------- Task Lists ---------- */

export async function fetchTaskLists(hubId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists`, {
    headers: await hubAuthHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch task lists")
  const data = await res.json()
  return data.lists as HubTaskListDTO[]
}

export async function createTaskList(
  hubId: string,
  data: { name: string; color?: string; icon?: string; ownerMemberId?: string | null }
) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists`, {
    method: "POST",
    headers: { ...(await hubAuthHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create task list")
  const json = await res.json()
  return json.list as HubTaskListDTO
}

export async function updateTaskList(
  hubId: string,
  listId: string,
  data: { name?: string; icon?: string; ownerMemberId?: string | null; color?: string }
) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists/${listId}`, {
    method: "PATCH",
    headers: { ...(await hubAuthHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update task list")
  const json = await res.json()
  return json.list as HubTaskListDTO
}

export async function reorderTaskLists(hubId: string, orderedIds: string[]) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists/reorder`, {
    method: "PATCH",
    headers: { ...(await hubAuthHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds }),
  })
  if (!res.ok) throw new Error("Failed to reorder task lists")
  return res.json()
}

export async function archiveTaskList(hubId: string, listId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists/${listId}/archive`, {
    method: "PATCH",
    headers: await hubAuthHeaders(),
  })
  if (!res.ok) throw new Error("Failed to archive task list")
  return res.json()
}

export async function deleteTaskList(hubId: string, listId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists/${listId}`, {
    method: "DELETE",
    headers: await hubAuthHeaders(),
  })
  if (!res.ok) throw new Error("Failed to delete task list")
  return res.json()
}

/* ---------- Tasks ---------- */

export async function fetchTasks(hubId: string, listId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists/${listId}/tasks`, {
    headers: await hubAuthHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch tasks")
  const data = await res.json()
  return data.tasks as HubTaskDTO[]
}

export async function createTask(
  hubId: string,
  listId: string,
  data: {
    title: string
    description?: string
    priority?: Priority
    tags?: string[]
    assignedToMemberId?: string | null
    deadline?: string | null // YYYY-MM-DD
  }
) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists/${listId}/tasks`, {
    method: "POST",
    headers: { ...(await hubAuthHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create task")
  const json = await res.json()
  return json.task as HubTaskDTO
}

export async function updateTask(
  hubId: string,
  taskId: string,
  data: {
    title?: string
    description?: string
    priority?: Priority
    tags?: string[]
    assignedToMemberId?: string | null
    deadline?: string | null
    completed?: boolean
  }
) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { ...(await hubAuthHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update task")
  const json = await res.json()
  return json.task as HubTaskDTO
}

export async function moveTask(hubId: string, taskId: string, toListId: string, toIndex?: number) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/tasks/${taskId}/move`, {
    method: "PATCH",
    headers: { ...(await hubAuthHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify({ toListId, toIndex }),
  })
  if (!res.ok) throw new Error("Failed to move task")
  const json = await res.json()
  return json.task as HubTaskDTO
}

export async function deleteTask(hubId: string, taskId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: await hubAuthHeaders(),
  })
  if (!res.ok) throw new Error("Failed to delete task")
  return res.json()
}
