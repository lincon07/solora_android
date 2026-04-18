"use client"

import React, { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  Tag,
  User,
  GripVertical,
  ListTodo,
  ShoppingCart,
  ClipboardList,
  Package,
} from "lucide-react"

import type { HubMember } from "@/api/members"

import {
  fetchTaskLists,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask as apiDeleteTask,
} from "@/api/task-lists"

/* -------------------------------- Types -------------------------------- */

type Priority = "low" | "medium" | "high"

type TaskDTO = {
  id: string
  title: string
  description?: string | null
  completed: boolean
  priority: Priority
  tags?: string[] | null
  assignedToMemberId?: string | null
  deadline?: string | null // "YYYY-MM-DD" or ISO depending on your API
  createdByMemberId?: string | null
  createdAt: string
}

type TaskListDTO = {
  id: string
  name: string
  icon: string
  ownerMemberId?: string | null
  createdAt: string
}

type BoardTask = {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  tags: string[]
  assignedTo: string | null
  deadline: string | null
  listId: string
  listName: string
  listIcon: string
  createdAt: Date
}

interface TaskBoardProps {
  hubId: string | null
  members: HubMember[]
}

/* ------------------------------ Constants ------------------------------- */

const LIST_ICONS = [
  { id: "list", icon: ListTodo, label: "General" },
  { id: "cart", icon: ShoppingCart, label: "Shopping" },
  { id: "clipboard", icon: ClipboardList, label: "Tasks" },
  { id: "package", icon: Package, label: "Inventory" },
] as const

const PRIORITY_BADGE: Record<Priority, string> = {
  low: "bg-muted-foreground/20 text-muted-foreground",
  medium: "bg-foreground/20 text-foreground",
  high: "bg-destructive/20 text-destructive",
}

function safeDateValue(deadline: string | null) {
  if (!deadline) return Number.POSITIVE_INFINITY
  const d = new Date(deadline)
  const t = d.getTime()
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t
}

function formatDeadline(deadline: string) {
  const d = new Date(deadline)
  if (Number.isNaN(d.getTime())) return deadline
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function TaskBoard({ hubId, members }: TaskBoardProps) {
  /* ------------------------------ State ------------------------------ */

  const [loading, setLoading] = useState(false)
  const [lists, setLists] = useState<TaskListDTO[]>([])
  const [tasks, setTasks] = useState<BoardTask[]>([])

  // Drag state (task -> member column)
  const [draggedTask, setDraggedTask] = useState<BoardTask | null>(null)
  const [dragOverMemberId, setDragOverMemberId] = useState<string | null>(null)

  // Task dialog
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<BoardTask | null>(null)

  // Task form fields
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskPriority, setTaskPriority] = useState<Priority>("medium")
  const [taskTags, setTaskTags] = useState("")
  const [taskAssignee, setTaskAssignee] = useState<string>("none")
  const [taskDeadline, setTaskDeadline] = useState("") // yyyy-mm-dd
  const [taskListId, setTaskListId] = useState<string>("")

  /* ------------------------------ Derived ------------------------------ */

  const membersSafe = useMemo(() => {
    return (members ?? []).map((m) => ({
      ...m,
      resolvedName: (m as any).displayName ?? (m as any).name ?? "Member",
      resolvedColor: (m as any).color ?? "#404040",
    }))
  }, [members])

  const memberColumns = useMemo(() => {
    // columns = Unassigned + each member
    const cols: { id: string; name: string; color: string }[] = [
      { id: "__unassigned__", name: "Unassigned", color: "#6b7280" },
      ...membersSafe.map((m) => ({
        id: m.id,
        name: (m as any).resolvedName,
        color: (m as any).resolvedColor,
      })),
    ]
    return cols
  }, [membersSafe])

  const tasksByMember = useMemo(() => {
    const map: Record<string, BoardTask[]> = {}
    for (const col of memberColumns) map[col.id] = []

    for (const t of tasks) {
      const key = t.assignedTo ?? "__unassigned__"
      if (!map[key]) map[key] = []
      map[key].push(t)
    }

    // sort within each column: deadline asc, then createdAt asc
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => {
        const ad = safeDateValue(a.deadline)
        const bd = safeDateValue(b.deadline)
        if (ad !== bd) return ad - bd
        return a.createdAt.getTime() - b.createdAt.getTime()
      })
    }

    return map
  }, [tasks, memberColumns])

  const getListIcon = (iconId: string) =>
    LIST_ICONS.find((i) => i.id === iconId)?.icon || ListTodo

  /* ------------------------------ Load data ------------------------------ */

  async function loadAll() {
    if (!hubId) return
    setLoading(true)
    try {
      const listDtos: TaskListDTO[] = await fetchTaskLists(hubId)
      setLists(listDtos)

      const allTasks: BoardTask[] = []

      for (const list of listDtos) {
        const taskDtos: TaskDTO[] = await fetchTasks(hubId, list.id)

        for (const t of taskDtos) {
          allTasks.push({
            id: t.id,
            title: t.title,
            description: t.description ?? "",
            completed: t.completed,
            priority: t.priority,
            tags: t.tags ?? [],
            assignedTo: t.assignedToMemberId ?? null,
            deadline: t.deadline ?? null,
            listId: list.id,
            listName: list.name,
            listIcon: list.icon,
            createdAt: new Date(t.createdAt),
          })
        }
      }

      setTasks(allTasks)
      // default list selection for "New Task"
      setTaskListId((prev) => prev || listDtos[0]?.id || "")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAll().catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubId])

  /* ------------------------------ Guards ------------------------------ */

  if (!hubId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground border rounded-xl p-6">
        No hub connected
      </div>
    )
  }

  /* ------------------------------ CRUD ------------------------------ */

  function openCreateTask() {
    setEditingTask(null)
    setTaskTitle("")
    setTaskDescription("")
    setTaskPriority("medium")
    setTaskTags("")
    setTaskAssignee("none")
    setTaskDeadline("")
    setTaskListId(lists[0]?.id ?? "")
    setTaskDialogOpen(true)
  }

  function openEditTask(t: BoardTask) {
    setEditingTask(t)
    setTaskTitle(t.title)
    setTaskDescription(t.description)
    setTaskPriority(t.priority)
    setTaskTags(t.tags.join(", "))
    setTaskAssignee(t.assignedTo ?? "none")
    setTaskDeadline(t.deadline ?? "")
    setTaskListId(t.listId)
    setTaskDialogOpen(true)
  }

  async function saveTask() {
    if (!hubId) return
    if (!taskTitle.trim()) return
    if (!taskListId) return

    const tags = taskTags
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)

    const assignedToMemberId =
      taskAssignee && taskAssignee !== "none" ? taskAssignee : null

    const payload = {
      title: taskTitle.trim(),
      description: taskDescription,
      priority: taskPriority,
      tags,
      assignedToMemberId,
      deadline: taskDeadline || null,
    }

    if (editingTask) {
      const updated = await updateTask(hubId, editingTask.id, payload)

      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: updated.title,
                description: updated.description ?? "",
                completed: updated.completed,
                priority: updated.priority,
                tags: updated.tags ?? [],
                assignedTo: updated.assignedToMemberId ?? null,
                deadline: updated.deadline ?? null,
                // if list changed, also update list metadata
                listId: taskListId,
                listName: lists.find((l) => l.id === taskListId)?.name ?? t.listName,
                listIcon: lists.find((l) => l.id === taskListId)?.icon ?? t.listIcon,
              }
            : t
        )
      )
    } else {
      const created = await createTask(hubId, taskListId, payload)

      const list = lists.find((l) => l.id === taskListId)
      setTasks((prev) => [
        ...prev,
        {
          id: created.id,
          title: created.title,
          description: created.description ?? "",
          completed: created.completed,
          priority: created.priority,
          tags: created.tags ?? [],
          assignedTo: created.assignedToMemberId ?? null,
          deadline: created.deadline ?? null,
          listId: taskListId,
          listName: list?.name ?? "List",
          listIcon: list?.icon ?? "list",
          createdAt: new Date(created.createdAt),
        },
      ])
    }

    setTaskDialogOpen(false)
  }

  async function toggleComplete(task: BoardTask) {
    if (!hubId) return

    // optimistic
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    )

    try {
      await updateTask(hubId, task.id, { completed: !task.completed })
    } catch (e) {
      console.error(e)
      // rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
      )
    }
  }

  async function deleteTask(task: BoardTask) {
    if (!hubId) return
    await apiDeleteTask(hubId, task.id)
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  /* ------------------------------ Drag & Drop (member assignment) ------------------------------ */

  function onDragStart(e: React.DragEvent, task: BoardTask) {
    e.dataTransfer.effectAllowed = "move"
    setDraggedTask(task)
  }

  function onDragOverMember(e: React.DragEvent, memberId: string) {
    if (!draggedTask) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverMemberId(memberId)
  }

  function onDragLeaveMember() {
    setDragOverMemberId(null)
  }

  async function onDropToMember(memberId: string) {
    if (!hubId || !draggedTask) return

    const nextAssigned =
      memberId === "__unassigned__" ? null : memberId

    if (draggedTask.assignedTo === nextAssigned) {
      setDraggedTask(null)
      setDragOverMemberId(null)
      return
    }

    // optimistic assign
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggedTask.id ? { ...t, assignedTo: nextAssigned } : t
      )
    )

    try {
      await updateTask(hubId, draggedTask.id, { assignedToMemberId: nextAssigned })
    } catch (e) {
      console.error(e)
      // rollback by reload (simple + reliable)
      await loadAll().catch(console.error)
    } finally {
      setDraggedTask(null)
      setDragOverMemberId(null)
    }
  }

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="rounded-xl border bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <div className="text-lg font-semibold">Task Board</div>
          <div className="text-xs text-muted-foreground">
            Sorted by deadline · Drag tasks onto people
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => void loadAll()} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
          <Button onClick={openCreateTask}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-4 min-w-max h-full">
          {memberColumns.map((col) => {
            const colTasks = tasksByMember[col.id] ?? []
            const done = colTasks.filter((t) => t.completed).length

            return (
              <div
                key={col.id}
                className={clsx(
                  "w-80 flex-shrink-0 rounded-2xl border bg-card flex flex-col transition-all",
                  dragOverMemberId === col.id ? "border-foreground bg-secondary/20" : "border-border"
                )}
                onDragOver={(e) => onDragOverMember(e, col.id)}
                onDragLeave={onDragLeaveMember}
                onDrop={(e) => {
                  e.preventDefault()
                  void onDropToMember(col.id)
                }}
              >
                {/* Column Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{col.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {done}/{colTasks.length} done
                      </div>
                    </div>
                  </div>

                  {/* progress */}
                  <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all"
                      style={{
                        width: colTasks.length ? (done / colTasks.length) * 100 : 0,
                      }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      Drop tasks here
                    </div>
                  ) : (
                    colTasks.map((t) => {
                      const ListIcon = getListIcon(t.listIcon)

                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, t)}
                          className={clsx(
                            "bg-background border rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all hover:border-muted-foreground/50",
                            t.completed && "opacity-60"
                          )}
                          style={{
                            borderLeftWidth: "3px",
                            borderLeftColor: col.color,
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <Checkbox
                              checked={t.completed}
                              onCheckedChange={() => void toggleComplete(t)}
                              className="mt-0.5 h-4 w-4"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div
                                    className={clsx(
                                      "text-sm font-medium",
                                      t.completed
                                        ? "line-through text-muted-foreground"
                                        : "text-foreground"
                                    )}
                                  >
                                    {t.title}
                                  </div>

                                  {t.description ? (
                                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                      {t.description}
                                    </div>
                                  ) : null}
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 -mt-1 -mr-1"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-popover border-border">
                                    <DropdownMenuItem onClick={() => openEditTask(t)}>
                                      <Pencil className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => void deleteTask(t)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* meta */}
                              <div className="flex flex-wrap items-center gap-1 mt-2">
                                <span className={clsx("text-[10px] px-1.5 py-0.5 rounded", PRIORITY_BADGE[t.priority])}>
                                  {t.priority}
                                </span>

                                {t.deadline ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    {formatDeadline(t.deadline)}
                                  </span>
                                ) : null}

                                {t.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-1"
                                  >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                  </span>
                                ))}

                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-1">
                                  <GripVertical className="w-3 h-3" />
                                  <ListIcon className="w-3 h-3" />
                                  {t.listName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm mx-4 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title"
                className="h-12 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Optional description"
                className="bg-input border-border min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>List</Label>
              <Select value={taskListId} onValueChange={setTaskListId}>
                <SelectTrigger className="h-12 bg-input border-border">
                  <SelectValue placeholder="Select list" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {lists.map((l) => (
                    <SelectItem key={l.id} value={l.id} className="h-11">
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={clsx(
                      "py-2 px-3 rounded-xl border text-sm capitalize transition-all",
                      taskPriority === p
                        ? "border-foreground bg-secondary"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={taskTags}
                onChange={(e) => setTaskTags(e.target.value)}
                placeholder="e.g. urgent, home"
                className="h-12 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Select value={taskAssignee} onValueChange={setTaskAssignee}>
                <SelectTrigger className="h-12 bg-input border-border">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="none" className="h-11">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Unassigned
                    </div>
                  </SelectItem>

                  {membersSafe.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="h-11">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: (m as any).resolvedColor }}
                        />
                        {(m as any).resolvedName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="h-12 bg-input border-border"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-12 bg-transparent"
                onClick={() => setTaskDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 h-12" onClick={() => void saveTask()}>
                {editingTask ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
