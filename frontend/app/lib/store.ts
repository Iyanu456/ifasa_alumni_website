import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { User } from "../types/types";
import { TokenService } from "@/app/apiServices/token-service";

interface EventChimpStore {
  loading: boolean;
  setLoading: (value: boolean) => void;

  message: string | null;
  messageType: "success" | "error" | null;
  setMessage: (message: string | null, type?: "success" | "error" | null) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  sessionExpired: boolean;
  setSessionExpired: (value: boolean) => void;

  // 👇 New flags for logout tracking
  isLoggingOut: boolean;
  setIsLoggingOut: (value: boolean) => void;

  logout: () => void;
}

export const useStore = create<EventChimpStore>()(
  devtools(
    persist(
      (set, get) => ({
        loading: false,
        setLoading: (value) => set({ loading: value }),

        message: "",
        messageType: null,
        setMessage: (message, type = "success") =>
          set({ message, messageType: type }),

        user: null,
        setUser: (user) => set({ user }),

        sessionExpired: false,
        setSessionExpired: (value) => set({ sessionExpired: value }),

        // 👇 New logout tracking state
        isLoggingOut: false,
        setIsLoggingOut: (value) => set({ isLoggingOut: value }),

        logout: () => {
          const { setIsLoggingOut } = get();

          // Mark as intentional logout
          setIsLoggingOut(true);

          // Remove cookie and reset user
          TokenService.removeCookie();
          set({ user: null, sessionExpired: false });

          // Clear persisted user data
          useStore.persist.clearStorage();

          // Reset logout flag after a short delay
          setTimeout(() => setIsLoggingOut(false), 2000);
        },
      }),
      {
        name: "ifearc",
        partialize: (state) => ({
          user: state.user,
        }),
      }
    )
  )
);