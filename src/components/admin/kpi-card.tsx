import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type KpiCardProps = {
  title: string
  value: string
  icon?: React.ReactNode
  className?: string
}

export function KpiCard({ title, value, icon, className }: KpiCardProps) {
  return (
    <Card size="sm" className={cn("gap-2", className)}>
      <CardContent className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-heading text-2xl font-bold text-primary">
            {value}
          </p>
        </div>
        {icon && <div className="text-primary/70">{icon}</div>}
      </CardContent>
    </Card>
  )
}

export function KpiCardSkeleton() {
  return (
    <Card size="sm" className="gap-2">
      <CardContent className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}
