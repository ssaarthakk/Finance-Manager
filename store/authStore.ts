import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthUser, User } from '../types/user';
import { generateId } from '../utils/id';

interface AuthState {
    users: User[];
    currentUser: AuthUser | null;

    signUp: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (name: string, email: string) => void;
    getCurrentUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            users: [],
            currentUser: null,

            signUp: async (name, email, password) => {
                const { users } = get();

                // Prevent duplicate emails
                if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
                    throw new Error('User with this email already exists.');
                }

                const newUser: User = {
                    id: generateId(),
                    name,
                    email,
                    password,
                };

                const { password: _pw, ...authUser } = newUser;

                set((state) => ({
                    users: [...state.users, newUser],
                    currentUser: authUser,
                }));
            },

            login: async (email, password) => {
                const { users } = get();

                const user = users.find(
                    (u) =>
                        u.email.toLowerCase() === email.toLowerCase() &&
                        u.password === password
                );

                if (!user) {
                    throw new Error('Invalid email or password.');
                }

                const { password: _pw, ...authUser } = user;

                set({ currentUser: authUser });
            },

            logout: () => {
                set({ currentUser: null });
            },

            updateProfile: (name: string, email: string) => {
                const { currentUser, users } = get();
                if (!currentUser) return;
                
                const updatedUsers = users.map((u) => {
                    if (u.id === currentUser.id) {
                        return { ...u, name, email };
                    }
                    return u;
                });

                set({
                    users: updatedUsers,
                    currentUser: { ...currentUser, name, email },
                });
            },

            getCurrentUser: () => {
                return get().currentUser;
            },
        }),
        {
            name: 'finance_app_auth', // unique name for AsyncStorage
            storage: createJSONStorage(() => AsyncStorage),
            // We don't want to persist currentUser's active session state necessarily if security matters, 
            // but requirements state: "On app start, auto-login if user exists" and "Persist user session".
            // By keeping currentUser in persist array, it will automatically hydrate on app launch.
        }
    )
);
