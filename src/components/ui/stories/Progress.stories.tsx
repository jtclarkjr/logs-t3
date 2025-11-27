import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { Label } from "../label";
import { Progress } from "../progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    className: "w-80",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <div className="flex justify-between">
        <Label>Progress</Label>
        <span className="text-muted-foreground text-sm">65%</span>
      </div>
      <Progress value={65} />
    </div>
  ),
};

export const DifferentValues: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Low Progress</Label>
          <span className="text-muted-foreground text-sm">15%</span>
        </div>
        <Progress value={15} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Medium Progress</Label>
          <span className="text-muted-foreground text-sm">45%</span>
        </div>
        <Progress value={45} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>High Progress</Label>
          <span className="text-muted-foreground text-sm">80%</span>
        </div>
        <Progress value={80} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Complete</Label>
          <span className="text-muted-foreground text-sm">100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

export const LogsAppExamples: Story = {
  render: () => (
    <div className="w-96 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Storage Usage</Label>
          <span className="text-muted-foreground text-sm">8.5 GB / 10 GB</span>
        </div>
        <Progress className="h-3" value={85} />
        <p className="text-muted-foreground text-xs">
          Log storage at 85% capacity
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Critical Logs</Label>
          <span className="text-muted-foreground text-sm">2%</span>
        </div>
        <Progress className="h-2 bg-red-100" value={2} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Warning Logs</Label>
          <span className="text-muted-foreground text-sm">15%</span>
        </div>
        <Progress className="h-2 bg-yellow-100" value={15} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Info Logs</Label>
          <span className="text-muted-foreground text-sm">75%</span>
        </div>
        <Progress className="h-2 bg-blue-100" value={75} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Debug Logs</Label>
          <span className="text-muted-foreground text-sm">8%</span>
        </div>
        <Progress className="h-2 bg-gray-100" value={8} />
      </div>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <Label>Small (h-1)</Label>
        <Progress className="h-1" value={60} />
      </div>

      <div className="space-y-2">
        <Label>Default (h-2)</Label>
        <Progress value={60} />
      </div>

      <div className="space-y-2">
        <Label>Medium (h-3)</Label>
        <Progress className="h-3" value={60} />
      </div>

      <div className="space-y-2">
        <Label>Large (h-4)</Label>
        <Progress className="h-4" value={60} />
      </div>
    </div>
  ),
};

export const AnimatedProgress: Story = {
  render: function AnimatedProgressComponent() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="w-80 space-y-2">
        <div className="flex justify-between">
          <Label>Loading Progress</Label>
          <span className="text-muted-foreground text-sm">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
};
