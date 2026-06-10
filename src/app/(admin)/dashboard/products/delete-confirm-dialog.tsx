"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { fetchApi } from "@/lib/fetch-api"
import type { AdminProduct } from "@/types/admin"

type DeleteConfirmDialogProps = {
  product: AdminProduct | null // เปิด dialog เมื่อมีค่า
  onClose: () => void
  onDeleted: () => void
}

export function DeleteConfirmDialog({
  product,
  onClose,
  onDeleted,
}: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!product) return
    setDeleting(true)
    try {
      await fetchApi<{ id: string }>(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })
      toast.success("ลบสินค้าสำเร็จ")
      onDeleted()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog
      open={!!product}
      onOpenChange={(open) => {
        if (!open && !deleting) onClose()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบสินค้า</AlertDialogTitle>
          <AlertDialogDescription>
            ต้องการลบ &ldquo;{product?.name}&rdquo; ใช่หรือไม่?
            การลบไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            ยกเลิก
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting && <Spinner />}
            ลบ
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
