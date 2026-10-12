import { InternshipRecord } from '../types/internship';
import { getAuthToken } from './authService';

/**
 * Service for communicating with the C Backend SQLite REST API for Internship Records.
 * All requests enforce user isolation via Bearer session tokens.
 */

export const internshipApiService = {
  /**
   * Fetches all persistent internship records belonging to the authenticated student.
   */
  async fetchInternships(): Promise<InternshipRecord[]> {
    const token = getAuthToken();
    if (!token) return [];

    try {
      const res = await fetch('/api/internships', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.records)) {
          return json.records;
        }
      }
    } catch (err) {
      console.warn('[C Backend API] Error fetching user internships:', err);
    }
    return [];
  },

  /**
   * Persists a new internship record to the C Backend SQLite database.
   */
  async addInternship(record: InternshipRecord): Promise<InternshipRecord | null> {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(record),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.record) {
          return json.record;
        }
      }
    } catch (err) {
      console.warn('[C Backend API] Error saving internship record:', err);
    }
    return null;
  },

  /**
   * Updates an existing internship record in the C Backend SQLite database.
   */
  async updateInternship(id: string, updates: Partial<InternshipRecord>): Promise<InternshipRecord | null> {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch(`/api/internships/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.record) {
          return json.record;
        }
      }
    } catch (err) {
      console.warn('[C Backend API] Error updating internship record:', err);
    }
    return null;
  },

  /**
   * Deletes an internship record from the C Backend SQLite database.
   */
  async deleteInternship(id: string): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const res = await fetch(`/api/internships/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        return !!json.success;
      }
    } catch (err) {
      console.warn('[C Backend API] Error deleting internship record:', err);
    }
    return false;
  },
};
