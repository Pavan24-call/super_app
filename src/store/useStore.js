import { create } from "zustand";

// Load persisted state from localStorage
const loadPersistedState = () => {
  try {
    const saved = localStorage.getItem("super_app_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        user: parsed.user || { name: "", username: "", email: "", mobile: "" },
        categories: parsed.categories || [],
        isRegistered: parsed.isRegistered || false,
        categoriesSelected: parsed.categoriesSelected || false,
      };
    }
  } catch (e) {
    console.error("Failed to load persisted state:", e);
  }
  return null;
};

const persisted = loadPersistedState();

export const useStore = create((set, get) => ({
  user: persisted?.user || { name: "", username: "", email: "", mobile: "" },
  categories: persisted?.categories || [],
  notes: localStorage.getItem("super_app_notes") || "",
  isRegistered: persisted?.isRegistered || false,
  categoriesSelected: persisted?.categoriesSelected || false,

  // Persist core state to localStorage
  _persist: () => {
    const state = get();
    localStorage.setItem(
      "super_app_state",
      JSON.stringify({
        user: state.user,
        categories: state.categories,
        isRegistered: state.isRegistered,
        categoriesSelected: state.categoriesSelected,
      })
    );
  },

  setUser: (userData) => {
    set({ user: userData, isRegistered: true });
    // Persist after state update
    setTimeout(() => get()._persist(), 0);
  },

  setCategories: (categoryArray) => {
    set({ categories: categoryArray, categoriesSelected: true });
    setTimeout(() => get()._persist(), 0);
  },

  setNotes: (noteText) => {
    localStorage.setItem("super_app_notes", noteText);
    set({ notes: noteText });
  },

  // Login: check if user exists in localStorage
  login: (username, email) => {
    try {
      const saved = localStorage.getItem("super_app_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.user &&
          parsed.isRegistered &&
          parsed.user.username === username &&
          parsed.user.email === email
        ) {
          set({
            user: parsed.user,
            categories: parsed.categories || [],
            isRegistered: true,
            categoriesSelected: parsed.categoriesSelected || false,
          });
          return { success: true, categoriesSelected: parsed.categoriesSelected };
        }
      }
      return { success: false, error: "No account found with these credentials." };
    } catch (e) {
      return { success: false, error: "Login failed. Please try again." };
    }
  },

  logout: () => {
    localStorage.removeItem("super_app_state");
    localStorage.removeItem("super_app_notes");
    set({
      user: { name: "", username: "", email: "", mobile: "" },
      categories: [],
      notes: "",
      isRegistered: false,
      categoriesSelected: false,
    });
  },

  resetStore: () => {
    localStorage.removeItem("super_app_state");
    localStorage.removeItem("super_app_notes");
    set({
      user: { name: "", username: "", email: "", mobile: "" },
      categories: [],
      notes: "",
      isRegistered: false,
      categoriesSelected: false,
    });
  },
}));
