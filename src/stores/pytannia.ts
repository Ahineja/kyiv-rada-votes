import { defineStore } from "pinia";
import type { PytanniaModel } from "@/models/Pytannia.model";
import { getApiUrl } from "@/config";

interface PytanniaState {
  items: PytanniaModel[];
  loading: boolean;
  error: string | null;
  expandedItems: Record<string, boolean>;
}

export const usePytanniaStore = defineStore("pytannia", {
  state: (): PytanniaState => ({
    items: [],
    loading: false,
    error: null,
    expandedItems: {},
  }),

  getters: {
    getPytanniaById: (state) => (id: string) => {
      return state.items.find((item) => item.innerId === id);
    },
    isExpanded: (state) => (id: string) => {
      return !!state.expandedItems[id];
    },
  },

  actions: {
    async fetchPytannia() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(getApiUrl("pytannia"));
        const data = await response.json();
        this.items = Array.isArray(data) ? data : [];
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Помилка завантаження даних";
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchPytanniaById(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(getApiUrl(`pytannia/${id}`));
        const data = await response.json();
        
        // Update or add the item in the items array
        const index = this.items.findIndex(item => item.innerId === id);
        if (index !== -1) {
          this.items[index] = data;
        } else {
          this.items.push(data);
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Помилка завантаження даних";
      } finally {
        this.loading = false;
      }
    },

    toggleExpanded(id: string) {
      if (!id) return;
      this.expandedItems[id] = !this.expandedItems[id];
    },
  },
}); 