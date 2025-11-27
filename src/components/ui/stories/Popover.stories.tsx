import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  CalendarIcon,
  FilterIcon,
  HelpCircleIcon,
  InfoIcon,
  SettingsIcon,
} from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium">Basic Popover</h4>
          <p className="text-muted-foreground text-sm">
            This is a basic popover with some content inside.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <SettingsIcon className="mr-2 h-4 w-4" />
          Quick Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Display Settings</h4>
            <p className="text-muted-foreground text-sm">
              Quickly adjust display preferences
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Auto-refresh</Label>
              <input defaultChecked type="checkbox" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Compact view</Label>
              <input type="checkbox" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show timestamps</Label>
              <input defaultChecked type="checkbox" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const QuickFilters: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          Quick Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Filter Logs</h4>
            <p className="text-muted-foreground text-sm">
              Apply common filters quickly
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Time Range</Label>
              <select className="w-full rounded border px-2 py-1 text-sm">
                <option>Last 1 hour</option>
                <option>Last 6 hours</option>
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Log Level</Label>
              <select className="w-full rounded border px-2 py-1 text-sm">
                <option>All levels</option>
                <option>Error & Critical</option>
                <option>Warning & above</option>
                <option>Info & above</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Source</Label>
              <Input
                className="h-8 text-sm"
                placeholder="Filter by source..."
              />
            </div>
            <Button className="w-full" size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const LogEntryInfo: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Log Entry Details</h4>
            <p className="text-muted-foreground text-xs">ID: log_abc123def</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Timestamp:</span>
              <span className="font-mono">14:32:18.245</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Source:</span>
              <span className="font-mono">api-gateway</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Thread:</span>
              <span className="font-mono">exec-2</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">User:</span>
              <span>john.doe</span>
            </div>
          </div>
          <div className="border-t pt-2">
            <Button className="h-7 w-full" size="sm" variant="outline">
              View Full Details
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const DatePicker: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Select Date
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Select Date Range</h4>
            <p className="text-muted-foreground text-sm">
              Choose a date range for log filtering
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Start Date</Label>
              <Input className="h-8" type="date" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">End Date</Label>
              <Input className="h-8" type="date" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Quick Select</Label>
              <div className="grid grid-cols-2 gap-1">
                <Button className="h-7 text-xs" size="sm" variant="outline">
                  Today
                </Button>
                <Button className="h-7 text-xs" size="sm" variant="outline">
                  Yesterday
                </Button>
                <Button className="h-7 text-xs" size="sm" variant="outline">
                  Last 7d
                </Button>
                <Button className="h-7 text-xs" size="sm" variant="outline">
                  Last 30d
                </Button>
              </div>
            </div>
            <Button className="w-full" size="sm">
              Apply Date Range
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Help: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          <HelpCircleIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Log Severity Levels</h4>
            <p className="text-muted-foreground text-xs">
              Understanding log severity classifications
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <div>
                <p className="font-medium text-xs">DEBUG</p>
                <p className="text-muted-foreground text-xs">
                  Detailed diagnostic info
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium text-xs">INFO</p>
                <p className="text-muted-foreground text-xs">
                  General information
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div>
                <p className="font-medium text-xs">WARNING</p>
                <p className="text-muted-foreground text-xs">
                  Potentially harmful situations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div>
                <p className="font-medium text-xs">ERROR</p>
                <p className="text-muted-foreground text-xs">
                  Error events but app continues
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-700"></div>
              <div>
                <p className="font-medium text-xs">CRITICAL</p>
                <p className="text-muted-foreground text-xs">
                  Very severe error events
                </p>
              </div>
            </div>
          </div>
          <div className="border-t pt-2">
            <Button className="h-7 w-full" size="sm" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Positioning: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <p className="text-sm">Popover positioned on top</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <p className="text-sm">Popover positioned on right</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <p className="text-sm">Popover positioned on bottom</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <p className="text-sm">Popover positioned on left</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const UserActions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 w-8 p-0" variant="ghost">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-medium text-white text-xs">
            JD
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">John Doe</h4>
            <p className="text-muted-foreground text-xs">
              john.doe@company.com
            </p>
          </div>
          <div className="space-y-1">
            <Button
              className="h-8 w-full justify-start"
              size="sm"
              variant="ghost"
            >
              View Profile
            </Button>
            <Button
              className="h-8 w-full justify-start"
              size="sm"
              variant="ghost"
            >
              Account Settings
            </Button>
            <Button
              className="h-8 w-full justify-start"
              size="sm"
              variant="ghost"
            >
              Activity Log
            </Button>
          </div>
          <div className="border-t pt-2">
            <Button
              className="h-8 w-full justify-start"
              size="sm"
              variant="ghost"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
