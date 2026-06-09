import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import CountCartItem from "@/app/(front)/components/CountCartItem";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogoutButton from "./logout-button";
import { ThemeToggle } from "./theme-toggle";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <nav className="h-16 border-b border-[#5C3D2E] bg-background shadow-[0_2px_8px_rgba(202,138,4,0.12)]">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <Link
          href="/cart"
          className="flex items-center gap-1.5 rounded border border-[#5C3D2E] bg-card px-3 py-1.5 text-sm text-[#BFA98A] transition-colors hover:border-primary hover:text-primary"
        >
          <ShoppingBasket className="size-4" />
          <CountCartItem /> ชิ้น
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!session && (
            <>
              <Button asChild className="hidden sm:inline-flex" variant="secondary">
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/signup">สมัครสมาชิก</Link>
              </Button>
            </>
          )}

          {session && (
            <>
              <div className="hidden sm:flex items-center gap-2 mr-1 text-sm text-[#BFA98A]">
                <span className="size-7 rounded border border-primary/40 bg-card flex items-center justify-center text-primary font-heading font-bold text-xs">
                  {session.user.name?.[0]?.toUpperCase()}
                </span>
                {session.user.name}
              </div>
              <LogoutButton />
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
