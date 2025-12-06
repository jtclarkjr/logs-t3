"use client";

import { BarChart3Icon, FileTextIcon, LogOut, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthModal } from "@/components/auth/auth-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/ui/user-avatar";
import { signOut } from "@/lib/auth/client";
import { useAuth } from "@/lib/auth/context";
import { authEnabled } from "@/lib/config/auth";
import { useIsMobile } from "@/lib/hooks/utils/use-mobile";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3Icon },
  { name: "Logs", href: "/logs", icon: FileTextIcon },
];

export function MinimalSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const handleAvatarClick = () => {
    if (!user) {
      setShowAuthModal(true);
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Bottom Navigation */}
        <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 md:hidden">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-md px-4 py-2 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}

          {/* Mobile Menu Sheet */}
          <Sheet onOpenChange={setIsOpen} open={isOpen}>
            <SheetTrigger asChild>
              <button
                className="flex flex-col items-center justify-center gap-1 rounded-md px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
                type="button"
              >
                <MenuIcon className="h-5 w-5" />
                <span className="text-xs">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Theme</span>
                  <ThemeToggle />
                </div>

                {authEnabled && (
                  <>
                    <div className="my-2 border-t" />
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                          <UserAvatar
                            alt={
                              user.user_metadata?.name || user.email || "User"
                            }
                            size="md"
                            src={user.user_metadata?.avatar_url}
                          />
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate font-medium text-sm">
                              {user.user_metadata?.name || "User"}
                            </p>
                            <p className="truncate text-muted-foreground text-xs">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={handleSignOut}
                          variant="outline"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <button
                        className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3 transition-colors hover:bg-muted"
                        onClick={handleAvatarClick}
                        type="button"
                      >
                        <UserAvatar alt="Sign In" size="md" src={null} />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">Sign In</p>
                          <p className="text-muted-foreground text-xs">
                            Click to sign in
                          </p>
                        </div>
                      </button>
                    )}
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>

        {/* Auth Modal */}
        <AuthModal
          onOpenChange={setShowAuthModal}
          open={showAuthModal}
          redirectPath={pathname}
        />

        {/* Mobile padding for bottom nav */}
        <div className="h-16 md:hidden" />
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className="fixed top-0 left-0 z-50 hidden h-screen w-16 flex-col border-r bg-background md:flex">
      <TooltipProvider delayDuration={0}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b">
          <Link href="/">
            <BarChart3Icon className="h-6 w-6 text-primary" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    href={item.href}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t">
          {/* User Avatar with Dropdown or Sign In Button */}
          {authEnabled && (
            <div className="border-b p-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-12 w-12 rounded-md p-0"
                      variant="ghost"
                    >
                      <UserAvatar
                        alt={user.user_metadata?.name || user.email || "User"}
                        size="md"
                        src={user.user_metadata?.avatar_url}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="right">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium text-sm">
                          {user.user_metadata?.name || "User"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-12 w-12 rounded-md p-0"
                      onClick={handleAvatarClick}
                      variant="ghost"
                    >
                      <UserAvatar alt="Sign In" size="md" src={null} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Sign In</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <div className="p-2">
            <div className="flex h-12 w-12 items-center justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* Auth Modal */}
      <AuthModal
        onOpenChange={setShowAuthModal}
        open={showAuthModal}
        redirectPath={pathname}
      />
    </aside>
  );
}
