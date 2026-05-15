import { create } from 'zustand';
import { MockUser } from '../types';

type AuthState = {
  currentUser: MockUser | null;
  isLoggedIn: boolean;
  loginUser: (user: MockUser) => void;
  logoutUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  loginUser: (user) => set({ currentUser: user, isLoggedIn: true }),
  logoutUser: () => set({ currentUser: null, isLoggedIn: false }),
}));
