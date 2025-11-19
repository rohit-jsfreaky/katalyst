import type { User } from '../types/api.types';

const USER_STORAGE_KEY = 'katalyst_user';

export const authUtil = {
  // Save user to localStorage
  setUser: (user: User): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  // Get user from localStorage
  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  // Remove user from localStorage
  removeUser: (): void => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authUtil.getUser() !== null;
  },
};

