import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type BranchStatus = 'Active' | 'Maintenance' | 'Closed'
export type UserStatus = 'Active' | 'Invited' | 'Suspended'
export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Delivered' | 'Cancelled'

export interface Branch {
  id: number
  name: string
  code: string
  manager: string
  phone: string
  address: string
  status: BranchStatus
}

export interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
}

export interface AdminUser {
  id: number
  name: string
  email: string
  phone: string
  roleId: number
  branchId: number
  status: UserStatus
}

export interface AdminOrder {
  id: number
  code: string
  customer: string
  branchId: number
  channel: 'Pickup' | 'Delivery' | 'Wholesale'
  status: OrderStatus
  total: number
  payment: 'Cash' | 'ABA KHQR' | 'Bank transfer'
  createdAt: string
}

export interface ActivityLog {
  id: number
  action: string
  module: string
  detail: string
  createdAt: string
}

export interface AdminNotification {
  id: number
  title: string
  body: string
  type: 'info' | 'warning' | 'success'
  read: boolean
  createdAt: string
}

const permissions = [
  'products.read',
  'products.write',
  'categories.write',
  'branches.write',
  'users.write',
  'roles.write',
  'orders.write',
  'reports.read',
]

export const useAdminStore = defineStore('admin', () => {
  const branches = ref<Branch[]>([
    { id: 1, name: 'Samaki Market', code: 'KPT-01', manager: 'Sokha Dara', phone: '++855 85 773 007', address: 'Samaki Market, Kampot town', status: 'Active' },
    { id: 2, name: 'Kampot Delivery Hub', code: 'KPT-02', manager: 'Lina Chen', phone: '+855 77 221 109', address: 'National Road 3, Kampot', status: 'Active' },
    { id: 3, name: 'Wholesale Counter', code: 'KPT-WH', manager: 'Vanna Kim', phone: '+855 96 554 3210', address: 'Riverside supply point', status: 'Maintenance' },
  ])

  const roles = ref<Role[]>([
    { id: 1, name: 'Administrator', description: 'Full access to system management.', permissions: [...permissions] },
    { id: 2, name: 'Inventory Manager', description: 'Manage catalog, categories, and stock.', permissions: ['products.read', 'products.write', 'categories.write', 'reports.read'] },
    { id: 3, name: 'Order Staff', description: 'Process customer orders and fulfillment.', permissions: ['products.read', 'orders.write'] },
  ])

  const users = ref<AdminUser[]>([
    { id: 1, name: 'Sokha Dara', email: 'sokha@kampotseafood.com', phone: '+855 12 345 678', roleId: 1, branchId: 1, status: 'Active' },
    { id: 2, name: 'Lina Chen', email: 'lina@kampotseafood.com', phone: '+855 77 221 109', roleId: 2, branchId: 2, status: 'Active' },
    { id: 3, name: 'Vanna Kim', email: 'vanna@kampotseafood.com', phone: '+855 96 554 3210', roleId: 3, branchId: 3, status: 'Invited' },
  ])

  const orders = ref<AdminOrder[]>([
    { id: 1, code: 'KS-1048', customer: 'Sokha Dara', branchId: 1, channel: 'Pickup', status: 'Preparing', total: 184000, payment: 'ABA KHQR', createdAt: '2026-05-24 08:30' },
    { id: 2, code: 'KS-1047', customer: 'Lina Market', branchId: 2, channel: 'Delivery', status: 'Confirmed', total: 320000, payment: 'Bank transfer', createdAt: '2026-05-24 09:10' },
    { id: 3, code: 'KS-1046', customer: 'Kampot Kitchen', branchId: 3, channel: 'Wholesale', status: 'Delivered', total: 275000, payment: 'Cash', createdAt: '2026-05-24 10:45' },
  ])

  const activityLogs = ref<ActivityLog[]>([
    { id: 1, action: 'Signed in', module: 'Authentication', detail: 'Admin session started', createdAt: '2026-05-24 08:00' },
    { id: 2, action: 'Updated stock', module: 'Products', detail: 'Inventory values synchronized', createdAt: '2026-05-24 08:18' },
    { id: 3, action: 'Reviewed orders', module: 'Orders', detail: 'Fulfillment queue checked', createdAt: '2026-05-24 09:05' },
  ])

  const notifications = ref<AdminNotification[]>([
    { id: 1, title: 'Low stock alert', body: 'Some seafood items are at or below 10 units.', type: 'warning', read: false, createdAt: '2026-05-24 09:20' },
    { id: 2, title: 'Daily report ready', body: 'Sales and inventory reports are available.', type: 'info', read: false, createdAt: '2026-05-24 10:00' },
    { id: 3, title: 'Order process updated', body: 'Fulfillment status changes are being logged.', type: 'success', read: true, createdAt: '2026-05-24 10:35' },
  ])

  const todayRevenue = computed(() =>
    orders.value
      .filter((order) => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0),
  )

  function nextId<T extends { id: number }>(items: T[]) {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
  }

  function timestamp() {
    return new Date().toISOString().slice(0, 16).replace('T', ' ')
  }

  function logActivity(module: string, action: string, detail: string) {
    activityLogs.value = [
      { id: nextId(activityLogs.value), module, action, detail, createdAt: timestamp() },
      ...activityLogs.value,
    ].slice(0, 50)
  }

  function markNotificationsRead() {
    notifications.value = notifications.value.map((notification) => ({ ...notification, read: true }))
  }

  function addBranch(branch: Omit<Branch, 'id'>) {
    branches.value = [{ ...branch, id: nextId(branches.value) }, ...branches.value]
    logActivity('Branches', 'Created branch', branch.name)
  }

  function updateBranch(id: number, changes: Partial<Branch>) {
    branches.value = branches.value.map((branch) => (branch.id === id ? { ...branch, ...changes } : branch))
    logActivity('Branches', 'Updated branch', changes.name ?? `Branch #${id}`)
  }

  function removeBranch(id: number) {
    const branch = branches.value.find((entry) => entry.id === id)
    branches.value = branches.value.filter((branch) => branch.id !== id)
    logActivity('Branches', 'Deleted branch', branch?.name ?? `Branch #${id}`)
  }

  function addRole(role: Omit<Role, 'id'>) {
    roles.value = [{ ...role, id: nextId(roles.value) }, ...roles.value]
    logActivity('Roles', 'Created role', role.name)
  }

  function updateRole(id: number, changes: Partial<Role>) {
    roles.value = roles.value.map((role) => (role.id === id ? { ...role, ...changes } : role))
    logActivity('Roles', 'Updated role', changes.name ?? `Role #${id}`)
  }

  function removeRole(id: number) {
    const role = roles.value.find((entry) => entry.id === id)
    roles.value = roles.value.filter((role) => role.id !== id)
    logActivity('Roles', 'Deleted role', role?.name ?? `Role #${id}`)
  }

  function addUser(user: Omit<AdminUser, 'id'>) {
    users.value = [{ ...user, id: nextId(users.value) }, ...users.value]
    logActivity('Users', 'Created user', user.email)
  }

  function updateUser(id: number, changes: Partial<AdminUser>) {
    users.value = users.value.map((user) => (user.id === id ? { ...user, ...changes } : user))
    logActivity('Users', 'Updated user', changes.email ?? changes.name ?? `User #${id}`)
  }

  function removeUser(id: number) {
    const user = users.value.find((entry) => entry.id === id)
    users.value = users.value.filter((user) => user.id !== id)
    logActivity('Users', 'Deleted user', user?.email ?? `User #${id}`)
  }

  function addOrder(order: Omit<AdminOrder, 'id' | 'code'>) {
    const id = nextId(orders.value)
    const code = `KS-${1048 + id}`
    orders.value = [{ ...order, id, code }, ...orders.value]
    logActivity('Orders', 'Created order', code)
  }

  function updateOrder(id: number, changes: Partial<AdminOrder>) {
    orders.value = orders.value.map((order) => (order.id === id ? { ...order, ...changes } : order))
    logActivity('Orders', 'Updated order', changes.status ? `Order #${id} is ${changes.status}` : `Order #${id}`)
  }

  function removeOrder(id: number) {
    const order = orders.value.find((entry) => entry.id === id)
    orders.value = orders.value.filter((order) => order.id !== id)
    logActivity('Orders', 'Deleted order', order?.code ?? `Order #${id}`)
  }

  return {
    permissions,
    branches,
    roles,
    users,
    orders,
    activityLogs,
    notifications,
    todayRevenue,
    logActivity,
    markNotificationsRead,
    addBranch,
    updateBranch,
    removeBranch,
    addRole,
    updateRole,
    removeRole,
    addUser,
    updateUser,
    removeUser,
    addOrder,
    updateOrder,
    removeOrder,
  }
})
