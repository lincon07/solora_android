"use client";

import  { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Clock,
  ChefHat,
  UtensilsCrossed,
} from "lucide-react";

import { createHubMealsClient, MealDTO, MealType } from "@/api/meals";
import { useHub } from "@/providers/hub";

/* ======================================================
 * Constants
 * ====================================================== */

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "dessert", label: "Dessert" },
];

/* ======================================================
 * Date helpers
 * ====================================================== */

const pad2 = (n: number) => String(n).padStart(2, "0");

const toYmd = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// const fromYmd = (ymd: string) => {
//   const [y, m, d] = ymd.split("-").map(Number);
//   return new Date(y, (m ?? 1) - 1, d ?? 1);
// };

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Sunday-start
  return d;
};

const endOfWeek = (date: Date) => {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  return e;
};

/* ======================================================
 * Component
 * ====================================================== */

export function MealPlanner() {
  const mealsApi = useMemo(() => createHubMealsClient(), []); // ✅ FIX: create client once

  const { hubId, members, loading: hubLoading, error: hubError } = useHub();

  /* ---------------- State ---------------- */

  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 2));
  const [meals, setMeals] = useState<MealDTO[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealDTO | null>(null);
  const [viewMeal, setViewMeal] = useState<MealDTO | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    dateYmd: string;
    mealType: MealType;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ---------------- Form ---------------- */

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIngredients, setFormIngredients] = useState("");
  const [formPrepTime, setFormPrepTime] = useState("");
  const [formCookTime, setFormCookTime] = useState("");
  const [formChefId, setFormChefId] = useState("");

  /* ---------------- Auto-select chef ---------------- */

  useEffect(() => {
    if (!formChefId && members.length > 0) {
      setFormChefId(members[0].id);
    }
  }, [members, formChefId]);

  /* ---------------- Derived ---------------- */

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const weekRange = useMemo(() => {
    const s = startOfWeek(currentDate);
    const e = endOfWeek(currentDate);
    return { start: toYmd(s), end: toYmd(e) };
  }, [currentDate]);

  /* ---------------- Load meals ---------------- */

  useEffect(() => {
    if (!hubId) return;

    let alive = true;

    (async () => {
      try {
        setErrorMsg(null);
        const res = await mealsApi.listRange({
          hubId,
          start: weekRange.start,
          end: weekRange.end,
        });
        if (alive) setMeals(res.meals ?? []);
      } catch (e: any) {
        if (alive) setErrorMsg(e?.message ?? "Failed to load meals");
      }
    })();

    return () => {
      alive = false;
    };
  }, [hubId, weekRange.start, weekRange.end, mealsApi]); // ✅ FIX: include mealsApi

  /* ---------------- Helpers ---------------- */

  const getMealForSlot = (date: Date, mealType: MealType) =>
    meals.find((m) => m.date === toYmd(date) && m.mealType === mealType) ?? null;

  const getMemberById = (id: string) => members.find((m) => m.id === id);

  const formatTime = (minutes: number) =>
    minutes < 60
      ? `${minutes}m`
      : `${Math.floor(minutes / 60)}h ${minutes % 60 || ""}`.trim();

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormIngredients("");
    setFormPrepTime("");
    setFormCookTime("");
    setFormChefId(members[0]?.id ?? "");
  };

  /* ---------------- Dialog handlers ---------------- */

  const openCreateDialog = (date: Date, mealType: MealType) => {
    if (!hubId || members.length === 0) return;

    setSelectedSlot({ dateYmd: toYmd(date), mealType });
    setEditingMeal(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (meal: MealDTO) => {
    setEditingMeal(meal);
    setSelectedSlot({ dateYmd: meal.date, mealType: meal.mealType });

    setFormTitle(meal.title);
    setFormDescription(meal.description ?? "");
    setFormIngredients(meal.ingredients.join(", "));
    setFormPrepTime(String(meal.prepTime ?? 0));
    setFormCookTime(String(meal.cookTime ?? 0));
    setFormChefId(meal.chefId);

    setViewMeal(null);
    setDialogOpen(true);
  };

  /* ---------------- Save / Delete ---------------- */

  const handleSave = async () => {
    if (!hubId || !selectedSlot || !formTitle.trim() || !formChefId) {
      setErrorMsg("Missing required fields");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const body = {
      title: formTitle.trim(),
      description: formDescription.trim() ? formDescription.trim() : null,
      ingredients: formIngredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      prepTime: Number(formPrepTime) || 0,
      cookTime: Number(formCookTime) || 0,
      chefId: formChefId,
      date: selectedSlot.dateYmd,
      mealType: selectedSlot.mealType,
    };

    try {
      const res = editingMeal
        ? await mealsApi.update({
            hubId,
            mealId: editingMeal.id,
            body,
          })
        : await mealsApi.create({ hubId, body });

      // ✅ FIX: if server returned updated meal, merge correctly
      setMeals((prev) => {
        const next = res.meal;
        if (!next) return prev;

        const exists = prev.some((m) => m.id === next.id);
        if (exists) return prev.map((m) => (m.id === next.id ? next : m));
        return [...prev, next];
      });

      setDialogOpen(false);
      setEditingMeal(null);
      setSelectedSlot(null);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Failed to save meal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (mealId: string) => {
    if (!hubId) return;

    const before = meals;
    setMeals((m) => m.filter((x) => x.id !== mealId));
    setViewMeal(null);

    try {
      await mealsApi.remove({ hubId, mealId });
    } catch (e: any) {
      setMeals(before);
      setErrorMsg(e?.message ?? "Failed to delete meal");
    }
  };

  /* ======================================================
   * Render
   * ====================================================== */

  if (hubLoading) {
    return <div className="p-4 text-muted-foreground">Loading hub…</div>;
  }

  if (hubError) {
    return <div className="p-4 text-destructive">{hubError}</div>;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="border-b px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Meal Planner</h1>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentDate(new Date())} // ✅ FIX: real today
          >
            Today
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentDate(new Date(currentDate.getTime() - 604800000))
            }
          >
            <ChevronLeft />
          </Button>

          <span className="text-sm font-medium">
            {weekDays[0].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            –{" "}
            {weekDays[6].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentDate(new Date(currentDate.getTime() + 604800000))
            }
          >
            <ChevronRight />
          </Button>
        </div>

        {errorMsg && <div className="mt-2 text-sm text-destructive">{errorMsg}</div>}
      </header>

      {/* GRID */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[600px]">
          {/* DAY HEADERS */}
          <div className="sticky top-0 z-10 bg-background border-b grid grid-cols-[72px_repeat(7,1fr)]">
            <div />
            {weekDays.map((day) => (
              <div key={toYmd(day)} className="p-2 text-center border-r">
                <p className="text-[10px] uppercase text-muted-foreground">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="font-semibold">{day.getDate()}</p>
              </div>
            ))}
          </div>

          {/* MEAL ROWS */}
          {MEAL_TYPES.map((type) => (
            <div
              key={type.id}
              className="grid grid-cols-[72px_repeat(7,1fr)] border-b"
            >
              <div className="flex items-center justify-center border-r bg-card">
                <span
                  className="text-xs rotate-180"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {type.label}
                </span>
              </div>

              {weekDays.map((day) => {
                const meal = getMealForSlot(day, type.id);

                return (
                  <div
                    key={`${type.id}-${toYmd(day)}`}
                    className="relative min-h-[120px] p-2 border-r hover:bg-secondary/20 cursor-pointer"
                    onClick={() => {
                      if (!meal) openCreateDialog(day, type.id); // ✅ safer click
                    }}
                  >
                    {meal ? (
                      <div
                        className="rounded-lg p-2 border-l-2 bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewMeal(meal);
                        }}
                      >
                        <p className="text-xs font-medium line-clamp-2">{meal.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            {formatTime((meal.prepTime ?? 0) + (meal.cookTime ?? 0))}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* VIEW DIALOG */}
      <Dialog open={!!viewMeal} onOpenChange={() => setViewMeal(null)}>
        <DialogContent>
          {viewMeal && (
            <>
              <DialogHeader>
                <DialogTitle>{viewMeal.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  <span>{getMemberById(viewMeal.chefId)?.displayName ?? "Unknown"}</span>
                </div>

                {!!viewMeal.description && (
                  <p className="text-sm whitespace-pre-wrap">{viewMeal.description}</p>
                )}

                {viewMeal.ingredients?.length > 0 && (
                  <div className="text-sm">
                    <div className="font-medium mb-1">Ingredients</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {viewMeal.ingredients.map((x, i) => (
                        <li key={`${viewMeal.id}-ing-${i}`}>{x}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openEditDialog(viewMeal)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(viewMeal.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CREATE / EDIT DIALOG */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingMeal(null);
            setSelectedSlot(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMeal ? "Edit Meal" : "Add Meal"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label>Title</Label>
            <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />

            <Label>Chef</Label>
            <Select value={formChefId} onValueChange={setFormChefId}>
              <SelectTrigger>
                <SelectValue placeholder="Select chef" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Description</Label>
            <Textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />

            <Label>Ingredients (comma separated)</Label>
            <Textarea
              value={formIngredients}
              onChange={(e) => setFormIngredients(e.target.value)}
            />

            <Label>Prep Time (min)</Label>
            <Input
              type="number"
              value={formPrepTime}
              onChange={(e) => setFormPrepTime(e.target.value)}
            />

            <Label>Cook Time (min)</Label>
            <Input
              type="number"
              value={formCookTime}
              onChange={(e) => setFormCookTime(e.target.value)}
            />

            <Button onClick={handleSave} disabled={saving || !formTitle.trim() || !formChefId}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
