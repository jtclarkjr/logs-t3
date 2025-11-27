import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  FilterIcon,
  HelpCircleIcon,
  MenuIcon,
  SettingsIcon,
} from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet";
import { Textarea } from "../textarea";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FromRight: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet (Right)</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Sheet from Right</SheetTitle>
          <SheetDescription>
            This sheet slides in from the right side of the screen.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Enter description..." />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const FromLeft: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet (Left)</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            This sheet slides in from the left, perfect for navigation menus.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <nav className="space-y-2">
            <a
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
              href="/"
            >
              Dashboard
            </a>
            <a
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
              href="/logs"
            >
              Logs
            </a>
            <a
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
              href="/analytics"
            >
              Analytics
            </a>
            <a
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
              href="/settings"
            >
              Settings
            </a>
            <a
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
              href="/help"
            >
              Help
            </a>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const FromTop: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet (Top)</Button>
      </SheetTrigger>
      <SheetContent className="h-[400px]" side="top">
        <SheetHeader>
          <SheetTitle>Notification Center</SheetTitle>
          <SheetDescription>
            This sheet slides in from the top, great for notifications or
            announcements.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium">System Update</h4>
            <p className="text-muted-foreground text-sm">
              New features have been deployed.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium">Maintenance Window</h4>
            <p className="text-muted-foreground text-sm">
              Scheduled maintenance tonight at 2 AM EST.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const FromBottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet (Bottom)</Button>
      </SheetTrigger>
      <SheetContent className="h-[300px]" side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            This sheet slides in from the bottom, ideal for mobile-style action
            sheets.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <Button className="flex h-20 flex-col gap-2">
            <SettingsIcon className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </Button>
          <Button className="flex h-20 flex-col gap-2" variant="outline">
            <FilterIcon className="h-6 w-6" />
            <span className="text-xs">Filters</span>
          </Button>
          <Button className="flex h-20 flex-col gap-2" variant="outline">
            <HelpCircleIcon className="h-6 w-6" />
            <span className="text-xs">Help</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const LogFiltersSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <FilterIcon className="mr-2 h-4 w-4" />
          Filter Logs
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Log Filters</SheetTitle>
          <SheetDescription>
            Configure filters to refine your log search results.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="From" type="date" />
              <Input placeholder="To" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Log Level</Label>
            <select className="w-full rounded-md border px-3 py-2">
              <option value="">All Levels</option>
              <option value="debug">DEBUG</option>
              <option value="info">INFO</option>
              <option value="warning">WARNING</option>
              <option value="error">ERROR</option>
              <option value="critical">CRITICAL</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Source Application</Label>
            <Input placeholder="e.g., api-server, database" />
          </div>

          <div className="space-y-2">
            <Label>Message Contains</Label>
            <Input placeholder="Search in log messages..." />
          </div>

          <div className="space-y-2">
            <Label>User ID</Label>
            <Input placeholder="Filter by user ID" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Reset</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const MobileMenu: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px]" side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <nav className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Main
              </h3>
              <div className="mt-2 space-y-1">
                <a
                  className="flex items-center rounded-md px-2 py-2 text-sm hover:bg-accent"
                  href="/"
                >
                  Dashboard
                </a>
                <a
                  className="flex items-center rounded-md px-2 py-2 text-sm hover:bg-accent"
                  href="/logs"
                >
                  Logs
                </a>
                <a
                  className="flex items-center rounded-md px-2 py-2 text-sm hover:bg-accent"
                  href="/analytics"
                >
                  Analytics
                </a>
              </div>
            </div>

            <div className="px-3 py-2">
              <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Management
              </h3>
              <div className="mt-2 space-y-1">
                <a
                  className="flex items-center rounded-md px-2 py-2 text-sm hover:bg-accent"
                  href="/users"
                >
                  Users
                </a>
                <a
                  className="flex items-center rounded-md px-2 py-2 text-sm hover:bg-accent"
                  href="/sources"
                >
                  Sources
                </a>
                <a
                  className="flex items-center rounded-md px-2 py-2 text-sm hover:bg-accent"
                  href="/settings"
                >
                  Settings
                </a>
              </div>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const CreateLogSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create Log Entry</Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Create New Log Entry</SheetTitle>
          <SheetDescription>
            Add a new log entry to the system manually.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Severity Level *</Label>
            <select className="w-full rounded-md border px-3 py-2">
              <option value="">Select severity</option>
              <option value="debug">DEBUG</option>
              <option value="info">INFO</option>
              <option value="warning">WARNING</option>
              <option value="error">ERROR</option>
              <option value="critical">CRITICAL</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Source *</Label>
            <Input placeholder="e.g., api-server, database, auth-service" />
          </div>

          <div className="space-y-2">
            <Label>Thread/Process ID</Label>
            <Input placeholder="Optional thread or process identifier" />
          </div>

          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea
              className="min-h-[100px]"
              placeholder="Enter the detailed log message..."
            />
          </div>

          <div className="space-y-2">
            <Label>Stack Trace</Label>
            <Textarea
              className="min-h-[80px] font-mono text-sm"
              placeholder="Paste stack trace if available..."
            />
          </div>

          <div className="space-y-2">
            <Label>Timestamp</Label>
            <Input type="datetime-local" />
            <p className="text-muted-foreground text-xs">
              Leave empty to use current time
            </p>
          </div>

          <div className="space-y-2">
            <Label>Additional Context</Label>
            <Textarea
              placeholder="Any additional context or metadata..."
              rows={3}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Create Log Entry</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
