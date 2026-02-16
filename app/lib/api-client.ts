import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, firstName?: string, lastName?: string) {
    return this.client.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', {
      email,
      password,
    });
  }

  async logout() {
    return this.client.post('/auth/logout');
  }

  async verifyEmail(token: string) {
    return this.client.post(`/auth/verify-email?token=${token}`);
  }

  async resendVerification(email: string) {
    return this.client.post('/auth/resend-verification', { email });
  }

  // Bot endpoints
  async getBots() {
    return this.client.get('/bots');
  }

  async createBot(data: any) {
    return this.client.post('/bots', data);
  }

  async getBot(id: string) {
    return this.client.get(`/bots/${id}`);
  }

  async updateBot(id: string, data: any) {
    return this.client.patch(`/bots/${id}`, data);
  }

  async deleteBot(id: string) {
    return this.client.delete(`/bots/${id}`);
  }

  async getEmbedCode(botId: string) {
    return this.client.get(`/bots/${botId}/embed-code`);
  }

  // Conversation endpoints
  async sendMessage(botId: string, message: string) {
    return this.client.post(`/bots/${botId}/messages`, {
      content: message,
    });
  }

  async getConversations(botId: string) {
    return this.client.get(`/bots/${botId}/conversations`);
  }

  // Analytics endpoints
  async getAnalytics(botId: string) {
    return this.client.get(`/analytics/bots/${botId}`);
  }

  // Billing endpoints
  async getSubscriptionStatus() {
    return this.client.get('/billing/status');
  }

  async createCheckoutSession(plan: string) {
    return this.client.post('/billing/checkout', { plan });
  }
}

export const apiClient = new ApiClient();
