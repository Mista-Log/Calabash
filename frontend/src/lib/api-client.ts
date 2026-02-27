/**
 * API Client Wrapper
 * Provides consistent API calls with error handling, retries, and mock support
 * 
 * USAGE:
 * 
 * // For data that should use mock during development:
 * const data = await apiClient.get('/api/courses/', { useMock: true });
 * 
 * // For data that should always use real API:
 * const data = await apiClient.get('/api/courses/', { useMock: false });
 * 
 * // When backend is ready, just set useMock: false globally
 */

import api from '@/lib/axios';
import { API_CONFIG, shouldUseRealAPI } from '@/lib/api-config';

// Mock delay for realistic UX
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock error rate (for testing error states)
const MOCK_ERROR_RATE = 0; // Set to 0.05 for 5% error rate in testing

interface APICallOptions {
  useMock?: boolean;
  mockData?: any;
  skipRetry?: boolean;
  timeout?: number;
}

interface APIResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  fromMock: boolean;
}

/**
 * Generic API client with mock support
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options: APICallOptions = {}
  ): Promise<APIResponse<T>> {
    const { useMock = false, mockData, skipRetry = false } = options;

    // Use mock data if enabled
    if (useMock && API_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[API Mock] GET', endpoint);
      await mockDelay();
      
      // Simulate occasional errors for testing
      if (Math.random() < MOCK_ERROR_RATE) {
        return {
          data: undefined as T,
          success: false,
          error: 'Simulated API error',
          fromMock: true,
        };
      }
      
      return {
        data: mockData as T,
        success: true,
        fromMock: true,
      };
    }

    // Real API call
    try {
      console.log('[API Real] GET', endpoint);
      const response = await api.get(endpoint, {
        timeout: options.timeout || API_CONFIG.REQUEST_TIMEOUT,
      });
      
      return {
        data: response.data,
        success: true,
        fromMock: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'API request failed';
      console.error('[API Error] GET', endpoint, errorMessage);
      
      return {
        data: undefined as T,
        success: false,
        error: errorMessage,
        fromMock: false,
      };
    }
  },

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options: APICallOptions = {}
  ): Promise<APIResponse<T>> {
    const { useMock = false, mockData } = options;

    if (useMock && API_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[API Mock] POST', endpoint);
      await mockDelay(1500); // Longer delay for mutations
      
      return {
        data: (mockData || { id: Date.now().toString(), ...data }) as T,
        success: true,
        fromMock: true,
      };
    }

    try {
      console.log('[API Real] POST', endpoint);
      const response = await api.post(endpoint, data, {
        timeout: options.timeout || API_CONFIG.REQUEST_TIMEOUT,
      });
      
      return {
        data: response.data,
        success: true,
        fromMock: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'API request failed';
      console.error('[API Error] POST', endpoint, errorMessage);
      
      return {
        data: undefined as T,
        success: false,
        error: errorMessage,
        fromMock: false,
      };
    }
  },

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options: APICallOptions = {}
  ): Promise<APIResponse<T>> {
    const { useMock = false, mockData } = options;

    if (useMock && API_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[API Mock] PUT', endpoint);
      await mockDelay(1000);
      
      return {
        data: (mockData || data) as T,
        success: true,
        fromMock: true,
      };
    }

    try {
      console.log('[API Real] PUT', endpoint);
      const response = await api.put(endpoint, data, {
        timeout: options.timeout || API_CONFIG.REQUEST_TIMEOUT,
      });
      
      return {
        data: response.data,
        success: true,
        fromMock: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'API request failed';
      console.error('[API Error] PUT', endpoint, errorMessage);
      
      return {
        data: undefined as T,
        success: false,
        error: errorMessage,
        fromMock: false,
      };
    }
  },

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options: APICallOptions = {}
  ): Promise<APIResponse<T>> {
    const { useMock = false } = options;

    if (useMock && API_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[API Mock] DELETE', endpoint);
      await mockDelay(800);
      
      return {
        data: { success: true } as T,
        success: true,
        fromMock: true,
      };
    }

    try {
      console.log('[API Real] DELETE', endpoint);
      const response = await api.delete(endpoint, {
        timeout: options.timeout || API_CONFIG.REQUEST_TIMEOUT,
      });
      
      return {
        data: response.data,
        success: true,
        fromMock: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'API request failed';
      console.error('[API Error] DELETE', endpoint, errorMessage);
      
      return {
        data: undefined as T,
        success: false,
        error: errorMessage,
        fromMock: false,
      };
    }
  },

  /**
   * File upload with progress tracking
   */
  async upload<T>(
    endpoint: string,
    file: File,
    data?: Record<string, any>,
    onProgress?: (percent: number) => void
  ): Promise<APIResponse<T>> {
    if (API_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[API Mock] UPLOAD', endpoint);
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        onProgress?.(i);
        await mockDelay(200);
      }
      
      return {
        data: {
          id: Date.now().toString(),
          url: URL.createObjectURL(file),
          ...data,
        } as T,
        success: true,
        fromMock: true,
      };
    }

    try {
      console.log('[API Real] UPLOAD', endpoint);
      const formData = new FormData();
      formData.append('file', file);
      
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress?.(percent);
          }
        },
        timeout: API_CONFIG.REQUEST_TIMEOUT * 2, // Longer timeout for uploads
      });
      
      return {
        data: response.data,
        success: true,
        fromMock: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      console.error('[API Error] UPLOAD', endpoint, errorMessage);
      
      return {
        data: undefined as T,
        success: false,
        error: errorMessage,
        fromMock: false,
      };
    }
  },
};

/**
 * Helper to create repository functions with consistent error handling
 */
export function createRepository<T>() {
  return {
    /**
     * Wrap a function to always return consistent response type
     */
    wrap: async (
      fn: () => Promise<T>,
      fallback: T
    ): Promise<APIResponse<T>> => {
      try {
        const data = await fn();
        return { data, success: true, fromMock: API_CONFIG.ENABLE_MOCK_DATA };
      } catch (error) {
        console.error('[Repository Error]', error);
        return {
          data: fallback,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          fromMock: API_CONFIG.ENABLE_MOCK_DATA,
        };
      }
    },
  };
}

export default apiClient;
