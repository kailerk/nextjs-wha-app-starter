import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded border border-transparent bg-clip-padding text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/25 active:not-aria-[haspopup]:brightness-90 disabled:pointer-events-none disabled:opacity-35 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-[#DAA520] bg-primary text-primary-foreground shadow-[0_1px_3px_rgba(202,138,4,0.15)] hover:bg-[#B8780A] hover:shadow-[0_2px_8px_rgba(202,138,4,0.25)]",
        secondary:
          "border-primary/60 bg-transparent text-primary hover:bg-primary/15 hover:border-primary aria-expanded:bg-primary/15",
        ghost:
          "text-[#BFA98A] hover:bg-[#3D2517] hover:text-[#F5E6D3] aria-expanded:bg-[#3D2517]",
        destructive:
          "border-[#B91C1C] bg-destructive text-[#F5E6D3] shadow-[0_1px_3px_rgba(153,27,27,0.35)] hover:bg-[#7F1D1D] hover:shadow-[0_2px_8px_rgba(153,27,27,0.45)]",
        outline:
          "border-border bg-transparent text-foreground hover:border-primary hover:text-primary aria-expanded:border-primary",
        accent:
          "border-[#6D28D9] bg-accent text-accent-foreground shadow-[0_1px_3px_rgba(88,28,135,0.30)] hover:bg-[#4C1D95] hover:shadow-[0_2px_8px_rgba(88,28,135,0.40)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-5 text-sm",
        xs:      "h-7  gap-1   px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm:      "h-8  gap-1   px-3.5 text-[13px]",
        lg:      "h-12 gap-2   px-7 text-base",
        icon:    "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
