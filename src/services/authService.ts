import { User, RegisteredUser, LoginCredentials, SignupData, AuthResponse } from '../types/auth';

/**
 * Storage keys used for temporary client-side authentication.
 * In a future phase, these can be replaced by HTTP requests to a REST/GraphQL backend.
 */
const STORAGE_KEYS = {
  USERS: 'smart_tracker_users',
  CURRENT_USER: 'smart_tracker_current_user',
  REMEMBERED_EMAIL: 'smart_tracker_remembered_email',
} as const;

/**
 * Initial demo user account for testing and evaluation during vivas.
 */
const DEFAULT_DEMO_USER: RegisteredUser = {
  id: 'usr_demo_101',
  name: 'Alex Morgan',
  email: 'student@college.edu',
  password: 'password123',
  createdAt: new Date().toISOString(),
};

/**
 * Safely retrieves all registered users from localStorage.
 */
export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      // Seed default user for immediate evaluation convenience
      const initialUsers: RegisteredUser[] = [DEFAULT_DEMO_USER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw) as RegisteredUser[];
  } catch (error) {
    console.error('Error reading registered users from localStorage:', error);
    return [DEFAULT_DEMO_USER];
  }
}

/**
 * Safely persists users array to localStorage.
 */
function saveRegisteredUsers(users: RegisteredUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}

/**
 * Retrieves the currently active user session from localStorage.
 */
export function getCurrentSessionUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch (error) {
    console.error('Error reading current user session:', error);
    return null;
  }
}

/**
 * Sets the active session user in localStorage.
 */
export function setCurrentSessionUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Error updating current user session:', error);
  }
}

/**
 * Retrieves remembered email for login convenience.
 */
export function getRememberedEmail(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) || '';
  } catch {
    return '';
  }
}

/**
 * Saves or removes remembered email in localStorage.
 */
export function setRememberedEmail(email: string, remember: boolean): void {
  try {
    if (remember && email.trim()) {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }
  } catch (error) {
    console.error('Error updating remembered email:', error);
  }
}

/**
 * Authentication service object.
 * Designed with asynchronous Promise returns to simulate network requests,
 * allowing seamless replacement with Axios / Fetch API calls in later phases.
 */
export const authService = {
  /**
   * Registers a new student account.
   * Performs uniqueness checks and saves to localStorage.
   * Does NOT log the user in automatically.
   */
  async register(data: SignupData): Promise<AuthResponse> {
    // Artificial minor latency to simulate real network feedback
    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = getRegisteredUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    // Check if account already exists
    const existingUser = users.find(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      };
    }

    // Create new user object
    const newUser: RegisteredUser = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    return {
      success: true,
      message: 'Account created successfully! Please sign in with your credentials.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    };
  },

  /**
   * Logs in a student by validating email and password.
   * Creates an active session in localStorage upon success.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Artificial minor latency to simulate real network feedback
    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = getRegisteredUsers();
    const normalizedEmail = credentials.email.trim().toLowerCase();

    const matchingUser = users.find(
      (u) =>
        u.email.trim().toLowerCase() === normalizedEmail &&
        u.password === credentials.password
    );

    if (!matchingUser) {
      return {
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      };
    }

    const sessionUser: User = {
      id: matchingUser.id,
      name: matchingUser.name,
      email: matchingUser.email,
      createdAt: matchingUser.createdAt,
    };

    // Persist active session
    setCurrentSessionUser(sessionUser);

    // Handle "Remember Me"
    setRememberedEmail(normalizedEmail, !!credentials.rememberMe);

    return {
      success: true,
      message: 'Logged in successfully.',
      user: sessionUser,
    };
  },

  /**
   * Logs out the current student by removing the session from localStorage.
   */
  async logout(): Promise<void> {
    setCurrentSessionUser(null);
  },

  /**
   * Gets current logged-in user.
   */
  getCurrentUser(): User | null {
    return getCurrentSessionUser();
  },

  /**
   * Checks if a session exists.
   */
  isAuthenticated(): boolean {
    return getCurrentSessionUser() !== null;
  },
};
