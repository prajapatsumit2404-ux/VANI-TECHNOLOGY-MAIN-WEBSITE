/**
 * Vani Technologies - Administrative Dashboard Controller
 * Handles RBAC authentication verification, tab navigation,
 * product CRUD, user role management, contact tracking, and analytics.
 */

document.addEventListener('DOMContentLoaded', async () => {
  let currentUser = null;
  let activeTab = 'dashboard';
  let deleteActionTarget = null; // { type: 'product'|'user'|'enquiry', id, name }

  // 1. VERIFY AUTHENTICATION & ADMIN AUTHORIZATION
  const unauthScreen = document.getElementById('unauth-screen');
  const unauthMsg = document.getElementById('unauth-message');

  if (!window.Auth || !window.Auth.isAuthenticated()) {
    showAccessDenied('You must be signed in with an administrative account.');
    return;
  }

  try {
    const meRes = await window.Auth.getMe();
    if (!meRes.ok || !meRes.success || !meRes.user) {
      window.Auth.clearSession();
      showAccessDenied('Session expired. Please sign in again.');
      return;
    }

    currentUser = meRes.user;

    // Strict Role Check: Must be 'admin'
    if (currentUser.role !== 'admin') {
      showAccessDenied(`Your account (${currentUser.email}) has role '${currentUser.role}' and is not authorized to access this administrative portal.`);
      return;
    }

    // Populate Top Header Admin Info
    document.getElementById('admin-name').textContent = currentUser.fullName;
    const initial = currentUser.fullName.charAt(0).toUpperCase();
    document.getElementById('admin-avatar-small').textContent = initial;

  } catch (err) {
    console.error('Auth verification error:', err);
    showAccessDenied('Could not verify credentials. Please try logging in again.');
    return;
  }

  function showAccessDenied(msg) {
    if (unauthMsg) unauthMsg.textContent = msg;
    if (unauthScreen) unauthScreen.classList.remove('hidden');
  }

  // 2. SIDEBAR & MOBILE CONTROLS
  const sidebar = document.getElementById('admin-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const openSidebarBtn = document.getElementById('sidebar-open-btn');
  const closeSidebarBtn = document.getElementById('sidebar-close-btn');

  function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
  }

  if (openSidebarBtn) openSidebarBtn.addEventListener('click', openSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Logout handler
  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    window.Auth.logout();
  });

  // 3. TAB NAVIGATION
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const sections = document.querySelectorAll('.tab-section');
  const tabTitle = document.getElementById('tab-title');

  const titles = {
    dashboard: 'Dashboard Overview',
    users: 'User Management',
    products: 'Products & SaaS Catalog',
    enquiries: 'Contact Enquiries',
    analytics: 'Platform Analytics',
    settings: 'System Configuration',
  };

  function switchTab(tabId) {
    activeTab = tabId;
    tabTitle.textContent = titles[tabId] || 'Admin Dashboard';

    navTabs.forEach((btn) => {
      const match = btn.getAttribute('data-tab') === tabId;
      if (match) {
        btn.className = 'nav-tab-btn active w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all bg-[#e85827] text-white shadow-lg shadow-[#e85827]/25';
      } else {
        btn.className = 'nav-tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-slate-400 hover:bg-[#252e40] hover:text-white';
      }
    });

    sections.forEach((sec) => {
      sec.classList.add('hidden');
    });

    const targetSec = document.getElementById(`section-${tabId}`);
    if (targetSec) targetSec.classList.remove('hidden');

    closeSidebar();

    // Trigger tab-specific loader
    if (tabId === 'dashboard') loadDashboard();
    else if (tabId === 'users') loadUsers();
    else if (tabId === 'products') loadProducts();
    else if (tabId === 'enquiries') loadEnquiries();
    else if (tabId === 'analytics') loadAnalytics();
    else if (tabId === 'settings') loadSettings();
  }

  navTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  // Shortcut triggers
  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dest = btn.getAttribute('data-goto');
      if (dest) switchTab(dest);
    });
  });

  // Global Toast / Alert Banner
  function showGlobalToast(message, type = 'success') {
    const alertBox = document.getElementById('admin-global-alert');
    if (!alertBox) return;

    const bg = type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border-red-500/30 text-red-300';
    const icon = type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-triangle-exclamation text-red-400';

    alertBox.innerHTML = `
      <div class="p-3.5 rounded-xl border ${bg} flex items-center justify-between text-xs shadow-lg animate-fade-in">
        <div class="flex items-center gap-2.5">
          <i class="fa-solid ${icon} text-sm"></i>
          <span>${message}</span>
        </div>
        <button onclick="document.getElementById('admin-global-alert').classList.add('hidden')" class="text-slate-400 hover:text-white p-1">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
    alertBox.classList.remove('hidden');

    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 4500);
  }

  // ========================================================
  // TAB 1: DASHBOARD
  // ========================================================
  async function loadDashboard() {
    try {
      const res = await window.Auth.getAdminDashboardSummary();
      if (!res.ok || !res.success) return;

      const sum = res.summary;
      document.getElementById('dash-users-count').textContent = sum.totalUsers;
      document.getElementById('dash-products-count').textContent = sum.totalProducts;
      document.getElementById('dash-featured-products').textContent = `${sum.featuredProducts} featured products`;
      document.getElementById('dash-contacts-count').textContent = sum.totalContacts;
      document.getElementById('dash-new-contacts').textContent = `${sum.newContacts} new`;

      // Badge in sidebar
      const navBadge = document.getElementById('badge-nav-enquiries');
      if (navBadge && sum.newContacts > 0) {
        navBadge.textContent = sum.newContacts;
        navBadge.classList.remove('hidden');
      }

      // Recent Contacts
      const contactsContainer = document.getElementById('dash-recent-contacts');
      if (res.recentContacts && res.recentContacts.length > 0) {
        contactsContainer.innerHTML = res.recentContacts.map(c => `
          <div class="p-3 rounded-xl bg-[#161c28]/70 border border-[#60697d]/20 flex items-center justify-between text-xs">
            <div>
              <strong class="text-white block">${c.name}</strong>
              <span class="text-slate-400 text-[11px]">${c.service}</span>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              c.status === 'new' ? 'bg-[#e85827]/20 text-[#e85827]' : 'bg-emerald-500/20 text-emerald-400'
            }">${c.status}</span>
          </div>
        `).join('');
      } else {
        contactsContainer.innerHTML = '<p class="text-xs text-slate-400">No contact inquiries yet.</p>';
      }

      // Recent Users
      const usersContainer = document.getElementById('dash-recent-users');
      if (res.recentUsers && res.recentUsers.length > 0) {
        usersContainer.innerHTML = res.recentUsers.map(u => `
          <div class="p-3 rounded-xl bg-[#161c28]/70 border border-[#60697d]/20 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-[#3b82f6]/20 text-[#60a5fa] font-bold text-xs flex items-center justify-center">
                ${u.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong class="text-white block">${u.fullName}</strong>
                <span class="text-slate-400 text-[11px]">${u.email}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700 text-slate-300'
            }">${u.role}</span>
          </div>
        `).join('');
      } else {
        usersContainer.innerHTML = '<p class="text-xs text-slate-400">No registered users yet.</p>';
      }

    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  }

  // Quick Action on Dashboard
  document.getElementById('dash-quick-add-product').addEventListener('click', () => {
    switchTab('products');
    openProductModal();
  });

  // ========================================================
  // TAB 2: USERS
  // ========================================================
  const usersSearchInput = document.getElementById('users-search-input');
  const usersRoleFilter = document.getElementById('users-role-filter');

  async function loadUsers() {
    const search = usersSearchInput ? usersSearchInput.value.trim() : '';
    const role = usersRoleFilter ? usersRoleFilter.value : 'all';

    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-slate-400"><i class="fa-solid fa-spinner animate-spin mr-2"></i>Loading user directory...</td></tr>';

    try {
      const res = await window.Auth.getAdminUsers({ search, role, limit: 50 });
      if (!res.ok || !res.success) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400">${res.message || 'Failed to load users.'}</td></tr>`;
        return;
      }

      if (!res.users || res.users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-slate-400">No users match criteria.</td></tr>';
        return;
      }

      tbody.innerHTML = res.users.map(u => {
        const isSelf = currentUser._id === u._id;
        const joined = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return `
          <tr class="hover:bg-[#161c28]/40 transition-colors">
            <td class="py-3 px-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#e85827] to-[#da251d] text-white font-bold flex items-center justify-center shrink-0">
                  ${u.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong class="text-white block">${u.fullName}</strong>
                  ${isSelf ? '<span class="text-[10px] text-amber-400 font-bold">(You)</span>' : ''}
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-slate-300">
              <div>${u.email}</div>
              <div class="text-[11px] text-slate-500">${u.phone}</div>
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1.5">
                <span title="${u.emailVerified ? 'Email Verified' : 'Email Unverified'}" class="px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  u.emailVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }">
                  <i class="fa-solid fa-envelope mr-1"></i>${u.emailVerified ? 'Yes' : 'No'}
                </span>
                <span title="${u.phoneVerified ? 'Phone Verified' : 'Phone Unverified'}" class="px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  u.phoneVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }">
                  <i class="fa-solid fa-phone mr-1"></i>${u.phoneVerified ? 'Yes' : 'No'}
                </span>
              </div>
            </td>
            <td class="py-3 px-4">
              ${isSelf ? `
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">ADMIN</span>
              ` : `
                <select class="user-role-select px-2 py-1 rounded bg-[#161c28] border border-[#60697d]/30 text-white text-[11px]" data-user-id="${u._id}">
                  <option value="user" ${u.role === 'user' ? 'selected' : ''}>USER</option>
                  <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>ADMIN</option>
                </select>
              `}
            </td>
            <td class="py-3 px-4 text-slate-400">${joined}</td>
            <td class="py-3 px-4 text-right">
              ${!isSelf ? `
                <button class="btn-delete-user text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" data-user-id="${u._id}" data-user-name="${u.fullName}" title="Delete User">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              ` : '<span class="text-[11px] text-slate-500 italic">Self</span>'}
            </td>
          </tr>
        `;
      }).join('');

      // Attach role change listeners
      tbody.querySelectorAll('.user-role-select').forEach(sel => {
        sel.addEventListener('change', async () => {
          const uId = sel.getAttribute('data-user-id');
          const newRole = sel.value;
          const patchRes = await window.Auth.updateAdminUserRole(uId, newRole);
          if (patchRes.ok && patchRes.success) {
            showGlobalToast(patchRes.message || 'User role updated.');
          } else {
            showGlobalToast(patchRes.message || 'Failed to update role.', 'error');
            loadUsers();
          }
        });
      });

      // Attach delete user listener
      tbody.querySelectorAll('.btn-delete-user').forEach(btn => {
        btn.addEventListener('click', () => {
          const uId = btn.getAttribute('data-user-id');
          const uName = btn.getAttribute('data-user-name');
          openDeleteConfirmation({
            type: 'user',
            id: uId,
            name: uName,
            title: `Delete User '${uName}'?`,
            desc: `This will permanently delete ${uName}'s account, verification tokens, and credentials.`,
          });
        });
      });

    } catch (err) {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-red-400">Failed to load users.</td></tr>';
    }
  }

  if (usersSearchInput) usersSearchInput.addEventListener('input', debounce(loadUsers, 300));
  if (usersRoleFilter) usersRoleFilter.addEventListener('change', loadUsers);

  // ========================================================
  // TAB 3: PRODUCTS (CRUD)
  // ========================================================
  const productsSearchInput = document.getElementById('products-search-input');
  const productsCategoryFilter = document.getElementById('products-category-filter');
  const productsStatusFilter = document.getElementById('products-status-filter');

  async function loadProducts() {
    const search = productsSearchInput ? productsSearchInput.value.trim() : '';
    const category = productsCategoryFilter ? productsCategoryFilter.value : 'all';
    const status = productsStatusFilter ? productsStatusFilter.value : 'all';

    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-slate-400"><i class="fa-solid fa-spinner animate-spin mr-2"></i>Loading products...</td></tr>';

    try {
      const res = await window.Auth.getAdminProducts({ search, category, status, limit: 50 });
      if (!res.ok || !res.success) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400">${res.message || 'Failed to load products.'}</td></tr>`;
        return;
      }

      if (!res.products || res.products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-slate-400">No products found. Click "Add New Product" to create one.</td></tr>';
        return;
      }

      tbody.innerHTML = res.products.map(p => {
        return `
          <tr class="hover:bg-[#161c28]/40 transition-colors">
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <img src="${p.image || 'assets/images/logo.png'}" onerror="this.src='assets/images/logo.png'" alt="${p.name}" class="w-10 h-10 object-contain rounded-lg bg-[#161c28] border border-[#60697d]/30 shrink-0 p-1">
                <div>
                  <strong class="text-white block font-bold">${p.name}</strong>
                  <span class="text-[11px] text-slate-400 line-clamp-1">${p.description}</span>
                </div>
              </div>
            </td>
            <td class="py-3 px-4">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-white">
                ${p.category}
              </span>
            </td>
            <td class="py-3 px-4 text-slate-300 text-xs">${p.pricing}</td>
            <td class="py-3 px-4">
              <button class="btn-toggle-featured p-1.5 rounded-lg transition-colors ${
                p.featured ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-slate-300'
              }" data-product-id="${p._id}" data-current-featured="${p.featured}" title="${p.featured ? 'Remove from Featured' : 'Mark as Featured'}">
                <i class="${p.featured ? 'fa-solid' : 'fa-regular'} fa-star text-base"></i>
              </button>
            </td>
            <td class="py-3 px-4">
              <select class="product-status-select px-2 py-1 rounded bg-[#161c28] border border-[#60697d]/30 text-white text-[11px]" data-product-id="${p._id}">
                <option value="active" ${p.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="draft" ${p.status === 'draft' ? 'selected' : ''}>Draft</option>
                <option value="archived" ${p.status === 'archived' ? 'selected' : ''}>Archived</option>
              </select>
            </td>
            <td class="py-3 px-4 text-right space-x-1">
              <button class="btn-edit-product text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors" data-product-id="${p._id}" title="Edit Product">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-delete-product text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" data-product-id="${p._id}" data-product-name="${p.name}" title="Delete Product">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');

      // Attach Toggle Featured listeners
      tbody.querySelectorAll('.btn-toggle-featured').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pId = btn.getAttribute('data-product-id');
          const curr = btn.getAttribute('data-current-featured') === 'true';
          const patchRes = await window.Auth.markAdminProductFeatured(pId, !curr);
          if (patchRes.ok && patchRes.success) {
            showGlobalToast(patchRes.message || 'Featured status updated.');
            loadProducts();
          } else {
            showGlobalToast(patchRes.message || 'Failed to update featured flag.', 'error');
          }
        });
      });

      // Attach Status Change listeners
      tbody.querySelectorAll('.product-status-select').forEach(sel => {
        sel.addEventListener('change', async () => {
          const pId = sel.getAttribute('data-product-id');
          const newStatus = sel.value;
          const patchRes = await window.Auth.updateAdminProductStatus(pId, newStatus);
          if (patchRes.ok && patchRes.success) {
            showGlobalToast(patchRes.message || 'Product status changed.');
          } else {
            showGlobalToast(patchRes.message || 'Failed to change status.', 'error');
            loadProducts();
          }
        });
      });

      // Attach Edit Product listeners
      tbody.querySelectorAll('.btn-edit-product').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pId = btn.getAttribute('data-product-id');
          openProductModal(pId);
        });
      });

      // Attach Delete Product listeners
      tbody.querySelectorAll('.btn-delete-product').forEach(btn => {
        btn.addEventListener('click', () => {
          const pId = btn.getAttribute('data-product-id');
          const pName = btn.getAttribute('data-product-name');
          openDeleteConfirmation({
            type: 'product',
            id: pId,
            name: pName,
            title: `Delete Product '${pName}'?`,
            desc: `This will permanently remove '${pName}' from the database and homepage catalog.`,
          });
        });
      });

    } catch (err) {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-red-400">Failed to load products.</td></tr>';
    }
  }

  if (productsSearchInput) productsSearchInput.addEventListener('input', debounce(loadProducts, 300));
  if (productsCategoryFilter) productsCategoryFilter.addEventListener('change', loadProducts);
  if (productsStatusFilter) productsStatusFilter.addEventListener('change', loadProducts);

  // PRODUCT MODAL LOGIC (Create / Edit)
  const productModal = document.getElementById('modal-product');
  const productForm = document.getElementById('product-form');
  const modalProductTitle = document.getElementById('modal-product-title');
  const modalProductAlert = document.getElementById('modal-product-alert');

  document.getElementById('btn-open-create-product-modal').addEventListener('click', () => {
    openProductModal();
  });
  document.getElementById('modal-product-close-btn').addEventListener('click', closeProductModal);
  document.getElementById('pform-cancel-btn').addEventListener('click', closeProductModal);

  function closeProductModal() {
    productModal.classList.add('hidden');
    productForm.reset();
    document.getElementById('product-form-id').value = '';
    modalProductAlert.classList.add('hidden');
  }

  async function openProductModal(productId = null) {
    productForm.reset();
    modalProductAlert.classList.add('hidden');

    if (productId) {
      modalProductTitle.textContent = 'Edit Product';
      document.getElementById('product-form-id').value = productId;

      try {
        const res = await window.Auth.getAdminProductById(productId);
        if (res.ok && res.success && res.product) {
          const p = res.product;
          document.getElementById('pform-name').value = p.name || '';
          document.getElementById('pform-category').value = p.category || 'Services';
          document.getElementById('pform-status').value = p.status || 'active';
          document.getElementById('pform-description').value = p.description || '';
          document.getElementById('pform-features').value = (p.features || []).join(', ');
          document.getElementById('pform-pricing').value = p.pricing || '';
          document.getElementById('pform-liveUrl').value = p.liveUrl || '';
          document.getElementById('pform-image').value = p.image || '';
          document.getElementById('pform-featured').checked = !!p.featured;
        }
      } catch (e) {
        console.error('Failed to load product:', e);
      }
    } else {
      modalProductTitle.textContent = 'Create New Product';
      document.getElementById('product-form-id').value = '';
    }

    productModal.classList.remove('hidden');
  }

  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    modalProductAlert.classList.add('hidden');

    const id = document.getElementById('product-form-id').value;
    const name = document.getElementById('pform-name').value.trim();
    const category = document.getElementById('pform-category').value;
    const status = document.getElementById('pform-status').value;
    const description = document.getElementById('pform-description').value.trim();
    const features = document.getElementById('pform-features').value.trim();
    const pricing = document.getElementById('pform-pricing').value.trim();
    const liveUrl = document.getElementById('pform-liveUrl').value.trim();
    const image = document.getElementById('pform-image').value.trim();
    const featured = document.getElementById('pform-featured').checked;

    if (!name || !description) {
      modalProductAlert.textContent = 'Name and description are required.';
      modalProductAlert.className = 'p-3 rounded-xl bg-red-500/20 text-red-300 text-xs';
      modalProductAlert.classList.remove('hidden');
      return;
    }

    const payload = {
      name,
      category,
      status,
      description,
      features,
      pricing,
      liveUrl,
      image,
      featured,
    };

    const submitBtn = document.getElementById('pform-submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Saving...';

    try {
      let res;
      if (id) {
        res = await window.Auth.updateAdminProduct(id, payload);
      } else {
        res = await window.Auth.createAdminProduct(payload);
      }

      if (res.ok && res.success) {
        closeProductModal();
        showGlobalToast(res.message || 'Product saved successfully!');
        loadProducts();
      } else {
        modalProductAlert.textContent = res.message || 'Failed to save product.';
        modalProductAlert.className = 'p-3 rounded-xl bg-red-500/20 text-red-300 text-xs';
        modalProductAlert.classList.remove('hidden');
      }
    } catch (err) {
      console.error(err);
      modalProductAlert.textContent = 'Network error saving product.';
      modalProductAlert.className = 'p-3 rounded-xl bg-red-500/20 text-red-300 text-xs';
      modalProductAlert.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Save Product</span>';
    }
  });

  // ========================================================
  // TAB 4: ENQUIRIES
  // ========================================================
  const enquiriesSearchInput = document.getElementById('enquiries-search-input');
  const enquiriesStatusFilter = document.getElementById('enquiries-status-filter');

  async function loadEnquiries() {
    const search = enquiriesSearchInput ? enquiriesSearchInput.value.trim() : '';
    const status = enquiriesStatusFilter ? enquiriesStatusFilter.value : 'all';

    const tbody = document.getElementById('enquiries-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-slate-400"><i class="fa-solid fa-spinner animate-spin mr-2"></i>Loading inquiries...</td></tr>';

    try {
      const res = await window.Auth.getContacts({ search, status, limit: 50 });
      if (!res.ok || !res.success) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400">${res.message || 'Failed to load inquiries.'}</td></tr>`;
        return;
      }

      if (!res.contacts || res.contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-slate-400">No contact inquiries found.</td></tr>';
        return;
      }

      tbody.innerHTML = res.contacts.map(c => {
        const received = new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        return `
          <tr class="hover:bg-[#161c28]/40 transition-colors">
            <td class="py-3 px-4">
              <strong class="text-white block">${c.name}</strong>
              <div class="text-[11px] text-slate-400">${c.email}</div>
              <div class="text-[11px] text-[#e85827]">${c.phone}</div>
              ${c.company ? `<div class="text-[10px] text-slate-500">Org: ${c.company}</div>` : ''}
            </td>
            <td class="py-3 px-4">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-white">
                ${c.service}
              </span>
            </td>
            <td class="py-3 px-4 max-w-xs">
              <p class="text-xs text-slate-300 line-clamp-2">${c.message}</p>
              <button class="btn-inspect-enquiry text-[11px] text-[#60a5fa] hover:underline mt-1 block" data-enquiry='${JSON.stringify(c).replace(/'/g, "&#39;")}'>
                Read Full Message
              </button>
            </td>
            <td class="py-3 px-4">
              <select class="enquiry-status-select px-2 py-1 rounded bg-[#161c28] border border-[#60697d]/30 text-white text-[11px]" data-enquiry-id="${c._id}">
                <option value="new" ${c.status === 'new' ? 'selected' : ''}>New</option>
                <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                <option value="in-discussion" ${c.status === 'in-discussion' ? 'selected' : ''}>In Discussion</option>
                <option value="resolved" ${c.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                <option value="archived" ${c.status === 'archived' ? 'selected' : ''}>Archived</option>
              </select>
            </td>
            <td class="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">${received}</td>
            <td class="py-3 px-4 text-right">
              <button class="btn-delete-enquiry text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" data-enquiry-id="${c._id}" data-enquiry-name="${c.name}" title="Delete Inquiry">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');

      // Status change listener
      tbody.querySelectorAll('.enquiry-status-select').forEach(sel => {
        sel.addEventListener('change', async () => {
          const eId = sel.getAttribute('data-enquiry-id');
          const newStatus = sel.value;
          const patchRes = await window.Auth.updateContactStatus(eId, newStatus);
          if (patchRes.ok && patchRes.success) {
            showGlobalToast(patchRes.message || 'Inquiry status updated.');
          } else {
            showGlobalToast(patchRes.message || 'Failed to update status.', 'error');
            loadEnquiries();
          }
        });
      });

      // View full details modal listener
      tbody.querySelectorAll('.btn-inspect-enquiry').forEach(btn => {
        btn.addEventListener('click', () => {
          const raw = btn.getAttribute('data-enquiry');
          if (raw) {
            const data = JSON.parse(raw);
            openEnquiryModal(data);
          }
        });
      });

      // Delete listener
      tbody.querySelectorAll('.btn-delete-enquiry').forEach(btn => {
        btn.addEventListener('click', () => {
          const eId = btn.getAttribute('data-enquiry-id');
          const eName = btn.getAttribute('data-enquiry-name');
          openDeleteConfirmation({
            type: 'enquiry',
            id: eId,
            name: eName,
            title: `Delete Enquiry from '${eName}'?`,
            desc: `This will permanently remove this inquiry record from the database.`,
          });
        });
      });

    } catch (err) {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-red-400">Failed to load inquiries.</td></tr>';
    }
  }

  if (enquiriesSearchInput) enquiriesSearchInput.addEventListener('input', debounce(loadEnquiries, 300));
  if (enquiriesStatusFilter) enquiriesStatusFilter.addEventListener('change', loadEnquiries);

  // Enquiry Full View Modal
  const modalEnquiry = document.getElementById('modal-view-enquiry');
  document.getElementById('modal-enquiry-close').addEventListener('click', () => modalEnquiry.classList.add('hidden'));
  document.getElementById('enquiry-modal-done').addEventListener('click', () => modalEnquiry.classList.add('hidden'));

  function openEnquiryModal(data) {
    document.getElementById('enquiry-modal-name').textContent = `${data.name} ${data.company ? `(${data.company})` : ''}`;
    const emailLink = document.getElementById('enquiry-modal-email');
    emailLink.textContent = data.email;
    emailLink.href = `mailto:${data.email}`;
    const phoneLink = document.getElementById('enquiry-modal-phone');
    phoneLink.textContent = data.phone;
    phoneLink.href = `tel:${data.phone}`;
    document.getElementById('enquiry-modal-service').textContent = data.service;
    document.getElementById('enquiry-modal-message').textContent = data.message;
    
    const statusSelect = document.getElementById('enquiry-modal-status-select');
    statusSelect.value = data.status || 'new';
    statusSelect.onchange = async () => {
      await window.Auth.updateContactStatus(data._id, statusSelect.value);
      loadEnquiries();
    };

    modalEnquiry.classList.remove('hidden');
  }

  // ========================================================
  // TAB 5: ANALYTICS
  // ========================================================
  async function loadAnalytics() {
    try {
      const res = await window.Auth.getAdminAnalytics();
      if (!res.ok || !res.success) return;

      const a = res.analytics;

      // Services distribution
      const servList = document.getElementById('analytics-services-list');
      if (a.leadsByService && a.leadsByService.length > 0) {
        const total = a.leadsByService.reduce((sum, item) => sum + item.count, 0) || 1;
        servList.innerHTML = a.leadsByService.map(item => {
          const pct = Math.round((item.count / total) * 100);
          return `
            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-slate-300">${item._id || 'Unspecified'}</span>
                <span class="font-bold text-white">${item.count} (${pct}%)</span>
              </div>
              <div class="w-full bg-[#161c28] h-2 rounded-full overflow-hidden">
                <div class="bg-[#e85827] h-full rounded-full" style="width: ${pct}%"></div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        servList.innerHTML = '<p class="text-xs text-slate-400">No leads logged yet.</p>';
      }

      // Categories distribution
      const catList = document.getElementById('analytics-categories-list');
      if (a.productsByCategory && a.productsByCategory.length > 0) {
        const totalP = a.productsByCategory.reduce((sum, item) => sum + item.count, 0) || 1;
        catList.innerHTML = a.productsByCategory.map(item => {
          const pct = Math.round((item.count / totalP) * 100);
          return `
            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-slate-300">${item._id}</span>
                <span class="font-bold text-white">${item.count} (${pct}%)</span>
              </div>
              <div class="w-full bg-[#161c28] h-2 rounded-full overflow-hidden">
                <div class="bg-purple-500 h-full rounded-full" style="width: ${pct}%"></div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        catList.innerHTML = '<p class="text-xs text-slate-400">No products configured.</p>';
      }

      // Verification rates
      if (a.verificationMetrics) {
        const vm = a.verificationMetrics;
        document.getElementById('rate-email-verified').textContent = `${vm.emailVerificationRate}% (${vm.verifiedEmails}/${vm.totalUsers})`;
        document.getElementById('bar-email-verified').style.width = `${vm.emailVerificationRate}%`;

        document.getElementById('rate-phone-verified').textContent = `${vm.phoneVerificationRate}% (${vm.verifiedPhones}/${vm.totalUsers})`;
        document.getElementById('bar-phone-verified').style.width = `${vm.phoneVerificationRate}%`;
      }

      // Server diagnostics
      if (a.diagnostics) {
        const d = a.diagnostics;
        document.getElementById('diag-node').textContent = d.nodeVersion;
        document.getElementById('diag-mem').textContent = `${d.memoryUsageMB} MB`;
        const mins = Math.floor(d.uptimeSeconds / 60);
        document.getElementById('diag-uptime').textContent = `${mins}m ${d.uptimeSeconds % 60}s`;
        document.getElementById('diag-platform').textContent = `${d.platform} (${d.arch})`;
      }

    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  }

  // ========================================================
  // TAB 6: SETTINGS
  // ========================================================
  async function loadSettings() {
    try {
      const res = await window.Auth.getAdminSettings();
      if (!res.ok || !res.success) return;
      const s = res.settings;
      document.getElementById('setting-site-name').textContent = s.siteName;
      document.getElementById('setting-website').textContent = s.officialWebsite;
      document.getElementById('setting-phone').textContent = s.supportPhone;
      document.getElementById('setting-email').textContent = s.supportEmail;
    } catch (err) {
      console.error(err);
    }
  }

  // ========================================================
  // DELETE CONFIRMATION MODAL LOGIC (User, Product, Enquiry)
  // ========================================================
  const deleteModal = document.getElementById('modal-delete');
  const deleteTitle = document.getElementById('delete-modal-title');
  const deleteDesc = document.getElementById('delete-modal-desc');
  const deleteCancelBtn = document.getElementById('delete-modal-cancel');
  const deleteConfirmBtn = document.getElementById('delete-modal-confirm');

  function openDeleteConfirmation(target) {
    deleteActionTarget = target;
    deleteTitle.textContent = target.title || 'Confirm Permanent Deletion';
    deleteDesc.textContent = target.desc || 'Are you sure you want to permanently delete this record?';
    deleteModal.classList.remove('hidden');
  }

  function closeDeleteConfirmation() {
    deleteActionTarget = null;
    deleteModal.classList.add('hidden');
    deleteConfirmBtn.disabled = false;
    deleteConfirmBtn.innerHTML = '<i class="fa-solid fa-trash-can text-xs"></i><span>Delete Record</span>';
  }

  deleteCancelBtn.addEventListener('click', closeDeleteConfirmation);

  deleteConfirmBtn.addEventListener('click', async () => {
    if (!deleteActionTarget) return;

    deleteConfirmBtn.disabled = true;
    deleteConfirmBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Deleting...';

    try {
      const { type, id } = deleteActionTarget;
      let res;

      if (type === 'product') {
        res = await window.Auth.deleteAdminProduct(id);
      } else if (type === 'user') {
        res = await window.Auth.deleteAdminUser(id);
      } else if (type === 'enquiry') {
        const token = window.Auth.getToken();
        const r = await fetch(`/api/contact/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        res = await r.json();
      }

      if (res.ok !== false && (res.success || res.status === 200)) {
        closeDeleteConfirmation();
        showGlobalToast(res.message || 'Record deleted successfully.');
        if (type === 'product') loadProducts();
        else if (type === 'user') loadUsers();
        else if (type === 'enquiry') loadEnquiries();
      } else {
        alert(res.message || 'Failed to delete record.');
        closeDeleteConfirmation();
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting record.');
      closeDeleteConfirmation();
    }
  });

  // Utility Debounce Helper
  function debounce(fn, wait = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Initial load
  loadDashboard();
});
