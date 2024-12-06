"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const MainNav = ({className, ...props}: React.HtmlHTMLAttributes<HTMLElement>) => {
    const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/authors`,
      label: "Authors",
      active: pathname === `/${params.storeId}/authors`,
    },
    {
      href: `/${params.storeId}/genres`,
      label: "Genres",
      active: pathname === `/${params.storeId}/genres`,
    },
    {
      href: `/${params.storeId}/books`,
      label: "Books",
      active: pathname === `/${params.storeId}/books`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 pl-6")}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
