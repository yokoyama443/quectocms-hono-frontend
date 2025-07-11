import { User } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

interface UpdateUserRequest {
  username?: string;
  detail?: string;
  icon?: string;
  role?: 'admin' | 'editor';
}

interface UpdateHostPasswordRequest {
  hostPassword: string;
}

interface Config {
  hostPassword: string;
  contentServerAddress: string;
}

export const userAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/user`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  },

  getUser: async (userId: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return response.json();
  },

  updateUser: async (userId: number, data: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return response.json();
  },

  deleteUser: async (userId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },

  getConfig: async (): Promise<Config> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/config`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    
    return response.json();
  },

  updateHostPassword: async (data: UpdateHostPasswordRequest): Promise<{ message: string; hostPassword: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/config/host-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update host password');
    }
    
    return response.json();
  },
};