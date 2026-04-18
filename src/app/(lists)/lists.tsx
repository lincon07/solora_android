"use client"

import React, { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  User,
  Tag,
  ListTodo,
  ShoppingCart,
  ClipboardList,
  Package,
  GripVertical,
} from "lucide-react"


import {
  fetchTaskLists,
  fetchTasks,
  createTaskList,
  updateTaskList,
  deleteTaskList,
  reorderTaskLists,
  createTask,
  updateTask,
  deleteTask as apiDeleteTask,
  moveTask,
} from "@/api/task-lists"
import { useHub } from "@/providers/hub"

/* -------------------------------- Types -------------------------------- */

type Priority = "low" | "medium" | "high"

interface HubMember {
  id: string
  // your hook might call these displayName / avatarUrl etc — we handle both safely
  name?: string
  displayName?: string
  color?: string
  avatarUrl?: string | null
}

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  tags: string[]
  assignedTo: string | null
  deadline: string | null
  createdBy: string
  createdAt: Date
}

interface TaskList {
  id: string
  name: string
  icon: string
  ownerId: string
  tasks: Task[]
  createdAt: Date
}

/* ------------------------------ Constants ------------------------------- */

const LIST_ICONS = [
  { id: "list", icon: ListTodo, label: "General" },
  { id: "cart", icon: ShoppingCart, label: "Shopping" },
  { id: "clipboard", icon: ClipboardList, label: "Tasks" },
  { id: "package", icon: Package, label: "Inventory" },
] as const

const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-muted-foreground/20 text-muted-foreground",
  medium: "bg-foreground/20 text-foreground",
  high: "bg-destructive/20 text-destructive",
}

/* ============================== COMPONENT =============================== */

export function ListsPage() {
  const hub = useHub()

  const hubId = hub.hubId
  const members = (hub.members ?? []) as HubMember[]


  const [lists, setLists] = useState<TaskList[]>([])

  const [listDialogOpen, setListDialogOpen] = useState(false)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)

  const [editingList, setEditingList] = useState<TaskList | null>(null)
  const [editingTask, setEditingTask] =
    useState<{ task: Task; listId: string } | null>(null)

  const [activeListIdForTask, setActiveListIdForTask] = useState<string | null>(
    null
  )

  // Task drag state
  const [draggedTask, setDraggedTask] =
    useState<{ task: Task; fromListId: string } | null>(null)
  const [dragOverListId, setDragOverListId] = useState<string | null>(null)

  // List drag state
  const [draggedListId, setDraggedListId] = useState<string | null>(null)
  const [dragOverListIndex, setDragOverListIndex] = useState<number | null>(
    null
  )

  // List form
  const [listName, setListName] = useState("")
  const [listIcon, setListIcon] = useState<(typeof LIST_ICONS)[number]["id"]>(
    "list"
  )
  const [listOwner, setListOwner] = useState("")

  // Task form
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskPriority, setTaskPriority] = useState<Priority>("medium")
  const [taskTags, setTaskTags] = useState("")
  const [taskAssignee, setTaskAssignee] = useState("") // member id | "none" | ""
  const [taskDeadline, setTaskDeadline] = useState("") // yyyy-mm-dd

  const membersSafe = useMemo(
    () =>
      members.map((m) => ({
        ...m,
        resolvedName: m.displayName ?? m.name ?? "Member",
        resolvedColor: m.color ?? "#404040",
      })),
    [members]
  )

  const getMember = (id: string) =>
    membersSafe.find((m) => m.id === id) ?? null

  const getListIcon = (iconId: string) =>
    LIST_ICONS.find((i) => i.id === iconId)?.icon || ListTodo

  /* ------------------------------ Data load ------------------------------ */

  useEffect(() => {
    if (!hubId) return

    async function load() {
      // Add null check here
      if (!hubId) return
      
      const listDtos = await fetchTaskLists(hubId)

      const loaded: TaskList[] = []
      for (const list of listDtos) {
        const tasks = await fetchTasks(hubId, list.id)

        loaded.push({
          id: list.id,
          name: list.name,
          icon: list.icon,
          ownerId: list.ownerMemberId ?? "",
          createdAt: new Date(list.createdAt),
          tasks: tasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description ?? "",
            completed: t.completed,
            priority: t.priority,
            tags: t.tags ?? [],
            assignedTo: t.assignedToMemberId ?? null,
            deadline: t.deadline ?? null,
            createdBy: t.createdByMemberId ?? "",
            createdAt: new Date(t.createdAt),
          })),
        })
      }

      setLists(loaded)
    }

    load().catch(console.error)
  }, [hubId])
  /* --------------------------- List CRUD UI --------------------------- */

  const openCreateList = () => {
    setEditingList(null)
    setListName("")
    setListIcon("list")
    setListOwner(membersSafe[0]?.id ?? "")
    setListDialogOpen(true)
  }

  const openEditList = (list: TaskList) => {
    setEditingList(list)
    setListName(list.name)
    setListIcon((list.icon as any) ?? "list")
    setListOwner(list.ownerId)
    setListDialogOpen(true)
  }

  const saveList = async () => {
    if (!hubId || !listName.trim()) return

    // owner can be blank if you want; keep consistent with your API expectations
    const ownerMemberId = listOwner || null

    if (editingList) {
      const updated = await updateTaskList(hubId, editingList.id, {
        name: listName.trim(),
        icon: listIcon,
        ownerMemberId,
      })

      setLists((prev) =>
        prev.map((l) =>
          l.id === editingList.id
            ? {
                ...l,
                name: updated.name,
                icon: updated.icon,
                ownerId: updated.ownerMemberId ?? "",
              }
            : l
        )
      )
    } else {
      const created = await createTaskList(hubId, {
        name: listName.trim(),
        icon: listIcon,
        ownerMemberId,
      })

      setLists((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.name,
          icon: created.icon,
          ownerId: created.ownerMemberId ?? "",
          createdAt: new Date(created.createdAt),
          tasks: [],
        },
      ])
    }

    setListDialogOpen(false)
  }

  const deleteList = async (listId: string) => {
    if (!hubId) return
    await deleteTaskList(hubId, listId)
    setLists((prev) => prev.filter((l) => l.id !== listId))
  }

  /* --------------------------- Task CRUD UI --------------------------- */

  const openCreateTask = (listId: string) => {
    setEditingTask(null)
    setActiveListIdForTask(listId)
    setTaskTitle("")
    setTaskDescription("")
    setTaskPriority("medium")
    setTaskTags("")
    setTaskAssignee("none")
    setTaskDeadline("")
    setTaskDialogOpen(true)
  }

  const openEditTask = (task: Task, listId: string) => {
    setEditingTask({ task, listId })
    setActiveListIdForTask(listId)
    setTaskTitle(task.title)
    setTaskDescription(task.description)
    setTaskPriority(task.priority)
    setTaskTags(task.tags.join(", "))
    setTaskAssignee(task.assignedTo ?? "none")
    setTaskDeadline(task.deadline ?? "")
    setTaskDialogOpen(true)
  }

  const saveTask = async () => {
    if (!hubId || !activeListIdForTask || !taskTitle.trim()) return

    const tags = taskTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const assigned =
      taskAssignee && taskAssignee !== "none" ? taskAssignee : null

    if (editingTask) {
      const updated = await updateTask(hubId, editingTask.task.id, {
        title: taskTitle.trim(),
        description: taskDescription,
        priority: taskPriority,
        tags,
        assignedToMemberId: assigned,
        deadline: taskDeadline || null,
      })

      setLists((prev) =>
        prev.map((l) =>
          l.id === editingTask.listId
            ? {
                ...l,
                tasks: l.tasks.map((t) =>
                  t.id === updated.id
                    ? {
                        ...t,
                        title: updated.title,
                        description: updated.description ?? "",
                        completed: updated.completed,
                        priority: updated.priority,
                        tags: updated.tags ?? [],
                        assignedTo: updated.assignedToMemberId ?? null,
                        deadline: updated.deadline ?? null,
                      }
                    : t
                ),
              }
            : l
        )
      )
    } else {
      const created = await createTask(hubId, activeListIdForTask, {
        title: taskTitle.trim(),
        description: taskDescription,
        priority: taskPriority,
        tags,
        assignedToMemberId: assigned,
        deadline: taskDeadline || null,
      })

      setLists((prev) =>
        prev.map((l) =>
          l.id === activeListIdForTask
            ? {
                ...l,
                tasks: [
                  ...l.tasks,
                  {
                    id: created.id,
                    title: created.title,
                    description: created.description ?? "",
                    completed: created.completed,
                    priority: created.priority,
                    tags: created.tags ?? [],
                    assignedTo: created.assignedToMemberId ?? null,
                    deadline: created.deadline ?? null,
                    createdBy: created.createdByMemberId ?? "",
                    createdAt: new Date(created.createdAt),
                  },
                ],
              }
            : l
        )
      )
    }

    setTaskDialogOpen(false)
  }

  const toggleTaskComplete = async (taskId: string, listId: string) => {
    if (!hubId) return

    const list = lists.find((l) => l.id === listId)
    const task = list?.tasks.find((t) => t.id === taskId)
    if (!task) return

    // optimistic
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? {
              ...l,
              tasks: l.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : l
      )
    )

    try {
      await updateTask(hubId, taskId, { completed: !task.completed })
    } catch (err) {
      console.error(err)
      // rollback on failure
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? {
                ...l,
                tasks: l.tasks.map((t) =>
                  t.id === taskId ? { ...t, completed: task.completed } : t
                ),
              }
            : l
        )
      )
    }
  }

  const deleteTask = async (taskId: string, listId: string) => {
    if (!hubId) return
    await apiDeleteTask(hubId, taskId)

    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? { ...l, tasks: l.tasks.filter((t) => t.id !== taskId) }
          : l
      )
    )
  }

  /* --------------------------- Task Drag & Drop --------------------------- */

  const handleTaskDragStart = (
    e: React.DragEvent,
    task: Task,
    fromListId: string
  ) => {
    e.dataTransfer.effectAllowed = "move"
    setDraggedTask({ task, fromListId })
  }

  const handleTaskDragOver = (e: React.DragEvent, toListId: string) => {
    if (!draggedTask) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverListId(toListId)
  }

  const handleTaskDragLeave = () => {
    setDragOverListId(null)
  }

  const handleTaskDrop = async (toListId: string) => {
    if (!hubId || !draggedTask) return
    if (draggedTask.fromListId === toListId) {
      setDraggedTask(null)
      setDragOverListId(null)
      return
    }

    const moved = draggedTask.task
    const from = draggedTask.fromListId

    // optimistic state update
    setLists((prev) =>
      prev.map((l) => {
        if (l.id === from) {
          return { ...l, tasks: l.tasks.filter((t) => t.id !== moved.id) }
        }
        if (l.id === toListId) {
          return { ...l, tasks: [...l.tasks, moved] }
        }
        return l
      })
    )

    try {
      await moveTask(hubId, moved.id, toListId)
    } catch (err) {
      console.error(err)
      // rollback best-effort by reloading lists (simple + reliable)
      try {
        if (!hubId) return
        const listDtos = await fetchTaskLists(hubId)
        const loaded: TaskList[] = []
        for (const list of listDtos) {
          const tasks = await fetchTasks(hubId, list.id)
          loaded.push({
            id: list.id,
            name: list.name,
            icon: list.icon,
            ownerId: list.ownerMemberId ?? "",
            createdAt: new Date(list.createdAt),
            tasks: tasks.map((t) => ({
              id: t.id,
              title: t.title,
              description: t.description ?? "",
              completed: t.completed,
              priority: t.priority,
              tags: t.tags ?? [],
              assignedTo: t.assignedToMemberId ?? null,
              deadline: t.deadline ?? null,
              createdBy: t.createdByMemberId ?? "",
              createdAt: new Date(t.createdAt),
            })),
          })
        }
        setLists(loaded)
      } catch (e2) {
        console.error(e2)
      }
    } finally {
      setDraggedTask(null)
      setDragOverListId(null)
    }
  }

  /* --------------------------- List Drag & Drop --------------------------- */

  const handleListDragStart = (e: React.DragEvent, listId: string) => {
    e.dataTransfer.effectAllowed = "move"
    setDraggedListId(listId)
  }

  const handleListDragOver = (e: React.DragEvent, overIndex: number) => {
    if (!draggedListId) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverListIndex(overIndex)
  }

  const handleListDrop = async (dropIndex: number) => {
    if (!hubId || !draggedListId) return

    const fromIndex = lists.findIndex((l) => l.id === draggedListId)
    if (fromIndex === -1 || fromIndex === dropIndex) {
      setDraggedListId(null)
      setDragOverListIndex(null)
      return
    }

    const next = [...lists]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(dropIndex, 0, moved)

    // optimistic reorder
    setLists(next)

    try {
      await reorderTaskLists(hubId, next.map((l) => l.id))
    } catch (err) {
      console.error(err)
      // rollback
      setLists(lists)
    } finally {
      setDraggedListId(null)
      setDragOverListIndex(null)
    }
  }

  const handleListDragEnd = () => {
    setDraggedListId(null)
    setDragOverListIndex(null)
  }

  /* ------------------------------ Guards ------------------------------ */

    if (hub.loading) {
    return <div className="h-screen flex items-center justify-center">Loading…</div>
  }

  if (!hubId) {
    return <div className="h-screen flex items-center justify-center">Not paired</div>
  }

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Lists</h1>
            <p className="text-sm text-muted-foreground">
              {lists.length} lists
            </p>
          </div>
          <Button onClick={openCreateList} className="h-11 px-4">
            <Plus className="w-4 h-4 mr-2" />
            New List
          </Button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-5 h-full min-w-max">
          {lists.map((list, index) => {
            const IconComponent = getListIcon(list.icon)
            const owner = list.ownerId ? getMember(list.ownerId) : null
            const completedCount = list.tasks.filter((t) => t.completed).length

            const ownerColor = owner?.resolvedColor ?? "#404040"
            const ownerName = owner?.resolvedName ?? "Unassigned"

            return (
              <div
                key={list.id}
                className={`w-72 flex-shrink-0 bg-card border rounded-2xl flex flex-col transition-all ${
                  dragOverListIndex === index
                    ? "border-foreground"
                    : dragOverListId === list.id
                    ? "border-foreground/50 bg-secondary/30"
                    : "border-border"
                }`}
                onDragOver={(e) => {
                  // allow task drop highlight
                  handleTaskDragOver(e, list.id)
                  // allow list reordering hover
                  if (draggedListId) handleListDragOver(e, index)
                }}
                onDragLeave={() => {
                  handleTaskDragLeave()
                  setDragOverListIndex(null)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggedTask) void handleTaskDrop(list.id)
                  if (draggedListId) void handleListDrop(index)
                }}
              >
                {/* List Header */}
                <div
                  className="p-4 border-b border-border cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleListDragStart(e, list.id)}
                  onDragEnd={handleListDragEnd}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${ownerColor}15` }}
                    >
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: ownerColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {list.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {ownerName} · {completedCount}/{list.tasks.length}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-popover border-border"
                      >
                        <DropdownMenuItem onClick={() => openEditList(list)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => void deleteList(list.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all"
                      style={{
                        width: `${
                          list.tasks.length
                            ? (completedCount / list.tasks.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {list.tasks.map((task) => {
                    const assignee = task.assignedTo
                      ? getMember(task.assignedTo)
                      : null

                    const assigneeColor = assignee?.resolvedColor ?? "#404040"
                    const assigneeName = assignee?.resolvedName ?? "Unassigned"

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) =>
                          handleTaskDragStart(e, task, list.id)
                        }
                        className={`bg-background border rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all hover:border-muted-foreground/50 ${
                          task.completed ? "opacity-50" : ""
                        }`}
                        style={{
                          borderLeftWidth: "3px",
                          borderLeftColor: assigneeColor,
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() =>
                              void toggleTaskComplete(task.id, list.id)
                            }
                            className="mt-0.5 h-4 w-4"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <span
                                className={`text-sm font-medium ${
                                  task.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {task.title}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mt-0.5 -mr-1"
                                  >
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-popover border-border"
                                >
                                  <DropdownMenuItem
                                    onClick={() => openEditTask(task, list.id)}
                                  >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      void deleteTask(task.id, list.id)
                                    }
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-1 mt-2">
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[task.priority]}`}
                              >
                                {task.priority}
                              </span>

                              {task.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-0.5"
                                >
                                  <Tag className="w-2.5 h-2.5" />
                                  {tag}
                                </span>
                              ))}

                              {assignee && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-0.5">
                                  <User className="w-2.5 h-2.5" />
                                  {assigneeName}
                                </span>
                              )}

                              {task.deadline && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-0.5">
                                  <Calendar className="w-2.5 h-2.5" />
                                  {new Date(task.deadline).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {list.tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No tasks yet
                    </div>
                  )}
                </div>

                {/* Add Task Button */}
                <div className="p-3 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full h-10 text-muted-foreground hover:text-foreground"
                    onClick={() => openCreateTask(list.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            )
          })}

          {/* Add List Column */}
          <div
            onClick={openCreateList}
            className="w-72 flex-shrink-0 border-2 border-dashed border-border rounded-2xl flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:bg-secondary/20 transition-all"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <span className="text-muted-foreground">Add List</span>
            </div>
          </div>
        </div>
      </main>

      {/* List Dialog */}
      <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>{editingList ? "Edit List" : "New List"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="List name"
                className="h-12 bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {LIST_ICONS.map((item) => {
                  const IconComp = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setListIcon(item.id)}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                        listIcon === item.id
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                      <span className="text-[10px] text-muted-foreground">
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Owner</Label>
              <Select value={listOwner} onValueChange={setListOwner}>
                <SelectTrigger className="h-12 bg-input border-border">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {membersSafe.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.id}
                      className="h-11"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: member.resolvedColor }}
                        />
                        {member.resolvedName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-12 bg-transparent"
                onClick={() => setListDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 h-12" onClick={() => void saveList()}>
                {editingList ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              <Label>Priority</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-sm capitalize transition-all ${
                      taskPriority === p
                        ? "border-foreground bg-secondary"
                        : "border-border hover:border-muted-foreground"
                    }`}
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
                    Unassigned
                  </SelectItem>
                  {membersSafe.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.id}
                      className="h-11"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: member.resolvedColor }}
                        />
                        {member.resolvedName}
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
