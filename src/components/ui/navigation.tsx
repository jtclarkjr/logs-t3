"use client";

import { BarChart3Icon, FileTextIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3Icon },
  { name: "Logs", href: "/logs", icon: FileTextIcon },
];
function NavigationItems({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex gap-1", mobile ? "flex-col" : "flex-row")}>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-6">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link className="flex items-center space-x-2" href="/">
            <BarChart3Icon className="h-6 w-6" />
            <span className="font-bold text-xl">Logs Dashboard</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-between md:flex">
          <NavigationItems />

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Badge className="text-xs" variant="secondary">
              v1.0.0
            </Badge>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-between md:hidden">
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
          <Sheet onOpenChange={setMobileMenuOpen} open={mobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="ghost">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80" side="right">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">Navigation</h2>
                </div>
                <NavigationItems mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
