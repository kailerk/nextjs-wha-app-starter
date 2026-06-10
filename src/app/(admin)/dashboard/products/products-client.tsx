"use client"

import { useCallback, useEffect, useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { fetchApi } from "@/lib/fetch-api"
import type { AdminProduct, CategoryOption } from "@/types/admin"
import { ProductFormModal } from "./product-form-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

const PAGE_SIZE = 10

const currency = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

export default function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null) // null = create
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const loadProducts = useCallback(() => {
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set("search", search)
    fetchApi<{ products: AdminProduct[]; total: number }>(
      `/api/admin/products?${params.toString()}`
    )
      .then((data) => {
        setProducts(data.products)
        setTotal(data.total)
        setError(null)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ")
      })
      .finally(() => setLoading(false))
  }, [page, search])

  // โหลดหมวดหมู่ครั้งเดียวตอน mount (ใช้ใน dropdown ของฟอร์ม)
  useEffect(() => {
    fetchApi<CategoryOption[]>("/api/admin/categories")
      .then(setCategories)
      .catch(() => toast.error("โหลดหมวดหมู่ไม่สำเร็จ"))
  }, [])

  // refetch เมื่อ search หรือ page เปลี่ยน
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // debounce: inputVal → search (รีเซ็ตกลับหน้า 1)
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
      setLoading(true)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  const goToPage = (next: number) => {
    setLoading(true)
    setPage(next)
  }

  const openCreate = () => {
    setEditProduct(null)
    setFormOpen(true)
  }

  const openEdit = (product: AdminProduct) => {
    setEditProduct(product)
    setFormOpen(true)
  }

  const handleSaved = () => {
    setFormOpen(false)
    setLoading(true)
    loadProducts()
  }

  const handleDeleted = () => {
    setDeleteTarget(null)
    setLoading(true)
    // ถ้าลบรายการสุดท้ายของหน้า ให้ถอยกลับหน้าก่อนหน้า
    if (products.length === 1 && page > 1) {
      setPage(page - 1)
    } else {
      loadProducts()
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>จัดการสินค้า</CardTitle>
          <CardAction>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              เพิ่มสินค้า
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า…"
            className="max-w-sm"
          />

          {error ? (
            <div className="flex flex-col items-center gap-3 rounded border border-destructive/40 bg-destructive/10 px-4 py-8">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setLoading(true)
                  loadProducts()
                }}
              >
                ลองใหม่
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead className="text-right">ราคา</TableHead>
                    <TableHead className="w-24 text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center">
                        <Spinner className="mx-auto size-6 text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-muted-foreground"
                      >
                        ไม่พบสินค้า
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.categoryName || "-"}</TableCell>
                        <TableCell className="text-right">
                          {currency.format(product.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              aria-label="แก้ไข"
                              onClick={() => openEdit(product)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              aria-label="ลบ"
                              onClick={() => setDeleteTarget(product)}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  ทั้งหมด {total} รายการ
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page <= 1 || loading}
                    onClick={() => goToPage(page - 1)}
                  >
                    ก่อนหน้า
                  </Button>
                  <span className="text-sm">
                    {page} / {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page >= totalPages || loading}
                    onClick={() => goToPage(page + 1)}
                  >
                    ถัดไป
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        onSaved={handleSaved}
      />

      <DeleteConfirmDialog
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </main>
  )
}
