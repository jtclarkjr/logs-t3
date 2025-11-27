import type { Meta, StoryObj } from "@storybook/nextjs";
import { Separator } from "../separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    decorative: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>Content above separator</div>
      <Separator />
      <div>Content below separator</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center space-x-4">
      <div>Left content</div>
      <Separator orientation="vertical" />
      <div>Right content</div>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="w-64 rounded-lg border bg-card p-1">
      <div className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-accent">
        New file
      </div>
      <div className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-accent">
        Open
      </div>
      <Separator className="my-1" />
      <div className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-accent">
        Save
      </div>
      <div className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-accent">
        Save as...
      </div>
      <Separator className="my-1" />
      <div className="cursor-pointer rounded px-2 py-1.5 text-destructive text-sm hover:bg-accent">
        Delete
      </div>
    </div>
  ),
};

export const LogsAppExamples: Story = {
  render: () => (
    <div className="w-96 space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Log Entry Details</h3>
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Timestamp:</strong> 2024-12-12 14:30:25
          </div>
          <div className="text-sm">
            <strong>Severity:</strong> ERROR
          </div>
          <div className="text-sm">
            <strong>Source:</strong> api-server
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium">Message</h4>
          <p className="text-muted-foreground text-sm">
            Database connection failed: Connection refused on localhost:5432
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium">Stack Trace</h4>
          <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
            at DatabaseConnection.connect (db.js:45) at LogService.write
            (log-service.js:23)
          </pre>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-3 font-medium">Dashboard Stats</h3>
        <div className="flex items-center justify-between text-sm">
          <span>Total Logs</span>
          <span>12,345</span>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between text-sm">
          <span>Error Rate</span>
          <span className="text-red-600">2.1%</span>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between text-sm">
          <span>Active Sources</span>
          <span>8</span>
        </div>
      </div>
    </div>
  ),
};

export const BreadcrumbSeparator: Story = {
  render: () => (
    <div className="flex items-center space-x-2 text-sm">
      <span>Dashboard</span>
      <Separator className="h-4" orientation="vertical" />
      <span>Logs</span>
      <Separator className="h-4" orientation="vertical" />
      <span className="text-muted-foreground">Details</span>
    </div>
  ),
};

export const ToolbarSeparator: Story = {
  render: () => (
    <div className="flex items-center space-x-2 rounded-lg border p-2">
      <button
        className="rounded px-2 py-1 text-sm hover:bg-accent"
        type="button"
      >
        New
      </button>
      <button
        className="rounded px-2 py-1 text-sm hover:bg-accent"
        type="button"
      >
        Edit
      </button>
      <Separator className="h-6" orientation="vertical" />
      <button
        className="rounded px-2 py-1 text-sm hover:bg-accent"
        type="button"
      >
        Export
      </button>
      <button
        className="rounded px-2 py-1 text-sm hover:bg-accent"
        type="button"
      >
        Import
      </button>
      <Separator className="h-6" orientation="vertical" />
      <button
        className="rounded px-2 py-1 text-destructive text-sm hover:bg-accent"
        type="button"
      >
        Delete
      </button>
    </div>
  ),
};

export const CardSections: Story = {
  render: () => (
    <div className="w-80 rounded-lg border">
      <div className="p-4">
        <h3 className="font-semibold">Log Analysis</h3>
        <p className="text-muted-foreground text-sm">
          Analyze your application logs for insights
        </p>
      </div>

      <Separator />

      <div className="space-y-3 p-4">
        <div className="flex justify-between text-sm">
          <span>Total entries</span>
          <span>1,234</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Errors</span>
          <span className="text-red-600">23</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Warnings</span>
          <span className="text-yellow-600">156</span>
        </div>
      </div>

      <Separator />

      <div className="p-4">
        <button
          className="w-full rounded bg-primary px-4 py-2 text-primary-foreground text-sm"
          type="button"
        >
          View Details
        </button>
      </div>
    </div>
  ),
};
