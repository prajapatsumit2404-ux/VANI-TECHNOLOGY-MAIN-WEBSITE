/**
 * Vani Technologies - Client-Side Authentication Library
 * Handles JWT token storage, API requests, validations & UI state
 */

const AUTH_API = '/api/auth';

const Auth = {
  // Token management
  getToken() {
    return localStorage.getItem('vani_auth_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('vani_auth_token', token);
    }
  },

  getUser() {
    const userStr = localStorage.getItem('vani_auth_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('vani_auth_user', JSON.stringify(user));
    }
  },

  clearSession() {
    localStorage.removeItem('vani_auth_token');
    localStorage.removeItem('vani_auth_user');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  // API Call helper
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${AUTH_API}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      return { status: response.status, ok: response.ok, ...data };
    } catch (error) {
      console.error('[Auth Request Error]:', error);
      return {
        ok: false,
        status: 500,
        success: false,
        message: 'Network error or server unreachable. Please try again.',
      };
    }
  },

  // Auth Methods
  async register(formData) {
    const res = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.ok && res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async login(formData) {
    const res = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.ok && res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async getMe() {
    return await this.request('/me', {
      method: 'GET',
    });
  },

  async logout() {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout endpoint call failed, clearing local session anyway');
    }
    this.clearSession();
    window.location.href = 'login.html?loggedOut=true';
  },

  async forgotPassword(data) {
    return await this.request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async resetPassword(data) {
    return await this.request('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAdminDashboard() {
    return await this.request('/admin-dashboard', {
      method: 'GET',
    });
  },

  // Phase 6: Account Verification Methods
  async sendOTP(phone) {
    return await this.request('/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOTP(phone, otp) {
    return await this.request('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  async verifyEmailToken(token) {
    return await this.request(`/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
  },

  async resendVerificationEmail(email) {
    return await this.request('/resend-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Alert UI helper
  showAlert(containerId, message, type = 'error') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bgClass =
      type === 'success'
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        : type === 'warning'
        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        : 'bg-red-500/10 border-red-500/30 text-red-400';

    const iconClass =
      type === 'success'
        ? 'fa-circle-check'
        : type === 'warning'
        ? 'fa-triangle-exclamation'
        : 'fa-circle-exclamation';

    container.innerHTML = `
      <div class="p-3.5 rounded-xl border ${bgClass} flex items-start gap-3 text-xs leading-relaxed animate-fade-in shadow-md">
        <i class="fa-solid ${iconClass} text-sm mt-0.5 shrink-0"></i>
        <div class="flex-grow">${message}</div>
      </div>
    `;
    container.classList.remove('hidden');
  },

  hideAlert(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      container.classList.add('hidden');
    }
  },

  // Password visibility toggle helper
  setupPasswordToggle(toggleBtnId, inputId) {
    const btn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fa-solid fa-eye-slash text-slate-400' : 'fa-solid fa-eye text-slate-400';
      }
    });
  },

  // Update navigation button based on login status
  updateNavbarAuth() {
    const authBtn = document.getElementById('navbar-auth-btn');
    if (!authBtn) return;

    if (this.isAuthenticated()) {
      const user = this.getUser();
      const displayName = user ? user.fullName.split(' ')[0] : 'Profile';
      authBtn.href = 'profile.html';
      authBtn.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
        <i class="fa-solid fa-user-circle mr-1.5 text-sm"></i>
        <span>${displayName}</span>
      `;
    } else {
      authBtn.href = 'login.html';
      authBtn.innerHTML = `
        <i class="fa-solid fa-arrow-right-to-bracket mr-1.5 text-xs"></i>
        <span>Login</span>
      `;
    }
  },
};

// Global helper access
window.Auth = Auth;
