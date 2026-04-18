import { api } from "./client";

/* =========================================================
 * Types
 * ========================================================= */

export type MealType = "breakfast" | "lunch" | "dinner" | "dessert";

export interface MealDTO {
  id: string;

  title: string;
  description: string | null;
  ingredients: string[];

  prepTime: number;
  cookTime: number;

  chefId: string;
  createdBy: string;

  // YYYY-MM-DD
  date: string;
  mealType: MealType;

  createdAt: string;
  updatedAt: string;
}

export interface MealsRangeResponse {
  meals: MealDTO[];
}

export interface CreateMealBody {
  title: string;
  description?: string | null;
  ingredients?: string[];

  prepTime?: number;
  cookTime?: number;

  chefId: string;
  date: string;
  mealType: MealType;
}

export interface UpdateMealBody {
  title?: string;
  description?: string | null;
  ingredients?: string[];

  prepTime?: number;
  cookTime?: number;

  chefId?: string;
  date?: string;
  mealType?: MealType;
}

/* =========================================================
 * Client
 * ========================================================= */

export function createHubMealsClient() {
  return {
    /* -------------------------------
     * LIST MEALS (DATE RANGE)
     * ------------------------------- */
    async listRange(params: {
      hubId: string;
      start: string;
      end: string;
    }): Promise<MealsRangeResponse> {
      const q = new URLSearchParams({
        start: params.start,
        end: params.end,
      }).toString();

      const res = await api<MealsRangeResponse>(
        `/hub/${params.hubId}/meals?${q}`,
        {
          method: "GET",
          auth: "hub",
          silent: true, // prevents toast spam on offline kiosks
        }
      );

      return {
        meals: res?.meals ?? [],
      };
    },

    /* -------------------------------
     * CREATE MEAL
     * ------------------------------- */
    async create(params: {
      hubId: string;
      body: CreateMealBody;
    }): Promise<{ meal: MealDTO }> {
      return api<{ meal: MealDTO }>(
        `/hub/${params.hubId}/meals`,
        {
          method: "POST",
          auth: "hub",
          body: JSON.stringify(params.body),
        }
      );
    },

    /* -------------------------------
     * UPDATE MEAL
     * ------------------------------- */
    async update(params: {
      hubId: string;
      mealId: string;
      body: UpdateMealBody;
    }): Promise<{ meal: MealDTO }> {
      return api<{ meal: MealDTO }>(
        `/hub/${params.hubId}/meals/${params.mealId}`,
        {
          method: "PATCH",
          auth: "hub",
          body: JSON.stringify(params.body),
        }
      );
    },

    /* -------------------------------
     * DELETE MEAL
     * ------------------------------- */
    async remove(params: {
      hubId: string;
      mealId: string;
    }): Promise<void> {
      return api<void>(
        `/hub/${params.hubId}/meals/${params.mealId}`,
        {
          method: "DELETE",
          auth: "hub",
        }
      );
    },
  };
}
