import Link from "next/link"
import { cn } from "@/lib/utils"

export function BrandLogo({
  className,
  href = "/",
  inverse = false,
}: {
  className?: string
  href?: string
  inverse?: boolean
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-bold", inverse && "text-white", className)}>
      <span className="brand-badge flex h-9 w-9 items-center justify-center">
        <i className="fa-solid fa-chart-line text-base" aria-hidden="true" />
      </span>
      <span className="font-heading text-xl tracking-tight">
        Invest<span className={inverse ? "text-[#dcbc4a]" : "text-primary"}>Pro</span>
      </span>
    </Link>
  )
}
