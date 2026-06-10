"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { AdminOrderItem } from "@/types/admin"

const currency = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

const STATUS_LABEL: Record<string, string> = {
  processing: "กำลังดำเนินการ",
  received: "รับคำสั่งซื้อแล้ว",
  delivered: "จัดส่งแล้ว",
}

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  processing: "secondary",
  received: "outline",
  delivered: "default",
}

type RecentOrdersTableProps = {
  orders: AdminOrderItem[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        ยังไม่มีคำสั่งซื้อ
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>เลขที่</TableHead>
          <TableHead>วันที่</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead className="text-right">ยอดรวม</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>#{order.id}</TableCell>
            <TableCell>
              {order.date
                ? new Date(order.date).toLocaleDateString("th-TH")
                : "-"}
            </TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>
              {order.status ? (
                <Badge variant={STATUS_VARIANT[order.status] ?? "outline"}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </Badge>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell className="text-right">
              {currency.format(order.totalAmount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function RecentOrdersTableSkeleton() {
  return (
    <div className="space-y-2 py-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-full animate-pulse rounded bg-muted" />
      ))}
    </div>
  )
}
