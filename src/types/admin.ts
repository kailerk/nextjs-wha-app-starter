export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type AdminStats = {
  todaySales: number
  todayOrders: number
  pendingOrders: number
  totalProducts: number
  totalUsers: number
}

export type RevenuePoint = {
  date: string // 'DD/MM'
  revenue: number
  orders: number
}

export type AdminOrderItem = {
  id: number
  date: string | null // ISO string
  customerName: string
  status: string | null
  totalAmount: number
}

export type Period = "7d" | "30d" | "90d"

export type AdminProduct = {
  id: string
  name: string
  description: string | null
  price: number
  categoryId: string
  categoryName: string
}

export type CategoryOption = {
  id: string
  name: string
}
