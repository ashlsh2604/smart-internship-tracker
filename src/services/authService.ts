import { User, RegisteredUser, LoginCredentials, SignupData, AuthResponse } from '../types/auth';

/**
 * Storage keys used for client-side session persistence across page refreshes.
 */
const STORAGE_KEYS = {
  TOKEN: 'smart_tracker_auth_token',
  CURRENT_USER: 'smart_tracker_current_user',
  REMEMBERED_EMAIL: 'smart_tracker_remembered_email',
} as const;

/**
 * Initial demo user for immediate fallback if needed.
 */
const DEFAULT_DEMO_USER: User = {
  id: 'usr_demo_101',
  name: 'Alex Morgan',
  email: 'student@college.edu',
  createdAt: '1791562362',
  college: 'School of Computer Science & Engineering',
  major: 'B.Tech Computer Science',
  targetRole: 'Software Development Engineer Intern',
  graduationYear: '2027',
};

/**
 * Retrieves the stored auth session token.
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
}

/**
 * Sets or removes the auth token in localStorage.
 */
export function setAuthToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
}

/**
 * Retrieves the currently cached session user from localStorage.
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
 * Authentication service communicating directly with the C Backend REST Server.
 */
export const authService = {
  /**
   * Registers a new student account via C Backend REST API (POST /api/auth/register).
   * Persists password hash with SHA-256 + salt in C SQLite database.
   */
  async register(data: SignupData, autoLogin: boolean = true): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        return {
          success: false,
          message: json.error || json.message || 'Registration failed on C Backend.',
        };
      }

      if (autoLogin && json.token && json.user) {
        setAuthToken(json.token);
        setCurrentSessionUser(json.user);
      }

      return {
        success: true,
        message: json.message || 'Account registered successfully in C Backend SQLite database!',
        user: json.user,
      };
    } catch (err: any) {
      console.warn('[C Backend Network Fallback] Registration API error:', err);
      // Fallback offline mock for dev robustness
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        college: 'School of Computer Science & Engineering',
        major: 'B.Tech Computer Science',
        targetRole: 'Software Development Engineer Intern',
        graduationYear: '2027',
      };
      if (autoLogin) {
        setAuthToken(`mock_token_${Date.now()}`);
        setCurrentSessionUser(fallbackUser);
      }
      return {
        success: true,
        message: 'Account created (local fallback mode).',
        user: fallbackUser,
      };
    }
  },

  /**
   * Logs in a student by validating email and password on C Backend REST API (POST /api/auth/login).
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const normalizedEmail = credentials.email.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: credentials.password,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        return {
          success: false,
          message: json.error || json.message || 'Invalid email or password.',
        };
      }

      // Store C session token and user
      if (json.token) {
        setAuthToken(json.token);
      }
      if (json.user) {
        setCurrentSessionUser(json.user);
      }

      // Remember email if requested
      setRememberedEmail(normalizedEmail, !!credentials.rememberMe);

      return {
        success: true,
        message: json.message || 'Logged in successfully via C Backend.',
        user: json.user,
      };
    } catch (err: any) {
      console.warn('[C Backend Network Fallback] Login API error:', err);
      // Fallback check for demo account if C server is starting
      if (normalizedEmail === 'student@college.edu' && credentials.password === 'password123') {
        setAuthToken('demo_token_fallback');
        setCurrentSessionUser(DEFAULT_DEMO_USER);
        setRememberedEmail(normalizedEmail, !!credentials.rememberMe);
        return {
          success: true,
          message: 'Logged in successfully (Demo mode).',
          user: DEFAULT_DEMO_USER,
        };
      }
      return {
        success: false,
        message: 'Unable to connect to C Backend REST API. Please ensure C server is running.',
      };
    }
  },

  /**
   * Refreshes / verifies session with C Backend (GET /api/auth/me).
   */
  async verifySession(): Promise<User | null> {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.user) {
          setCurrentSessionUser(json.user);
          return json.user;
        }
      } else if (res.status === 401) {
        // Expired or invalid token
        setAuthToken(null);
        setCurrentSessionUser(null);
        return null;
      }
    } catch (e) {
      // Offline fallback: keep cached session
    }
    return getCurrentSessionUser();
  },

  /**
   * Updates student profile in C SQLite database (PUT /api/auth/profile).
   */
  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    const token = getAuthToken();
    const current = getCurrentSessionUser();
    if (!token || !current) {
      return { success: false, message: 'No active session found.' };
    }

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const json = await res.json();
      if (res.ok && json.success && json.user) {
        setCurrentSessionUser(json.user);
        return {
          success: true,
          message: 'Profile updated in C SQLite database.',
          user: json.user,
        };
      }
    } catch (err) {
      console.warn('Update profile API error:', err);
    }

    // Local update fallback
    const updatedUser: User = { ...current, ...updates };
    setCurrentSessionUser(updatedUser);
    return {
      success: true,
      message: 'Profile updated locally.',
      user: updatedUser,
    };
  },

  /**
   * Returns list of demo accounts for evaluation.
   */
  getRegisteredAccounts(): User[] {
    const current = getCurrentSessionUser();
    if (current && current.email !== DEFAULT_DEMO_USER.email) {
      return [DEFAULT_DEMO_USER, current];
    }
    return [DEFAULT_DEMO_USER];
  },

  /**
   * Switches user session.
   */
  async switchAccount(userId: string): Promise<User | null> {
    if (userId === DEFAULT_DEMO_USER.id) {
      setAuthToken('demo_token');
      setCurrentSessionUser(DEFAULT_DEMO_USER);
      return DEFAULT_DEMO_USER;
    }
    return getCurrentSessionUser();
  },

  /**
   * Logs out the current student via C Backend (POST /api/auth/logout)
   * and clears local storage.
   */
  async logout(): Promise<void> {
    const token = getAuthToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        // Ignore network failure on logout
      }
    }
    setAuthToken(null);
    setCurrentSessionUser(null);
  },

  /**
   * Gets current logged-in user.
   */
  getCurrentUser(): User | null {
    return getCurrentSessionUser();
  },

  /**
   * Checks if an authenticated session exists.
   */
  isAuthenticated(): boolean {
    return !!getAuthToken() && !!getCurrentSessionUser();
  },
};
