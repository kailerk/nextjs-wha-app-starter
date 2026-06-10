import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";
import ProductsClient from "./products-client";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <AdminGate />
    </Suspense>
  );
}

async function AdminGate() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/login?callbackURL=/dashboard/products");
  }

  return <ProductsClient />;
}
