import type { Meta, StoryObj } from "@storybook/nextjs";
import { SeverityLevel } from "@/lib/enums/severity";
import { SeverityBadge } from "../severity-badge";

const meta: Meta<typeof SeverityBadge> = {
  title: "UI/SeverityBadge",
  component: SeverityBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "select",
      options: Object.values(SeverityLevel),
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Debug: Story = {
  args: {
    severity: SeverityLevel.DEBUG,
  },
};

export const Info: Story = {
  args: {
    severity: SeverityLevel.INFO,
  },
};

export const Warning: Story = {
  args: {
    severity: SeverityLevel.WARNING,
  },
};

export const ErrorStory: Story = {
  args: {
    severity: SeverityLevel.ERROR,
  },
};

export const Critical: Story = {
  args: {
    severity: SeverityLevel.CRITICAL,
  },
};

export const AllSeverities: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <SeverityBadge severity={SeverityLevel.DEBUG} />
      <SeverityBadge severity={SeverityLevel.INFO} />
      <SeverityBadge severity={SeverityLevel.WARNING} />
      <SeverityBadge severity={SeverityLevel.ERROR} />
      <SeverityBadge severity={SeverityLevel.CRITICAL} />
    </div>
  ),
};

export const InLogContext: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={SeverityLevel.INFO} />
          <span className="text-sm">User login successful</span>
        </div>
        <span className="text-muted-foreground text-xs">12:34:56</span>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={SeverityLevel.WARNING} />
          <span className="text-sm">High memory usage detected</span>
        </div>
        <span className="text-muted-foreground text-xs">12:35:12</span>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={SeverityLevel.ERROR} />
          <span className="text-sm">Database connection failed</span>
        </div>
        <span className="text-muted-foreground text-xs">12:35:45</span>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={SeverityLevel.CRITICAL} />
          <span className="text-sm">System crash detected</span>
        </div>
        <span className="text-muted-foreground text-xs">12:36:01</span>
      </div>
    </div>
  ),
};

export const WithCustomSizing: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SeverityBadge className="text-xs" severity={SeverityLevel.ERROR} />
      <SeverityBadge severity={SeverityLevel.ERROR} />
      <SeverityBadge
        className="px-3 py-1 text-sm"
        severity={SeverityLevel.ERROR}
      />
    </div>
  ),
};
