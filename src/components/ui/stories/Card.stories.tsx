import type { Meta, StoryObj } from "@storybook/nextjs";
import { MoreHorizontalIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is the main body of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>
          This card has an action button in the header
        </CardDescription>
        <CardAction>
          <Button size="icon" variant="ghost">
            <MoreHorizontalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>The action button appears in the top-right corner of the card.</p>
      </CardContent>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <p>A simple card with just content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="h-4 w-4" />
          Total Logs
        </CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">12,345</div>
        <p className="text-muted-foreground text-xs">+20% from last week</p>
      </CardContent>
    </Card>
  ),
};

export const LogsFilterCard: Story = {
  render: () => (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Search and filter logs by various criteria
            </CardDescription>
          </div>
          <Button size="sm" variant="outline">
            Reset Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <input
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="Search logs..."
          />
          <select className="rounded-md border px-3 py-2">
            <option>All Severities</option>
            <option>ERROR</option>
            <option>WARNING</option>
          </select>
        </div>
      </CardContent>
    </Card>
  ),
};

export const LogEntry: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">ERROR</Badge>
            <Badge variant="outline">api-server</Badge>
          </div>
          <span className="font-mono text-muted-foreground text-sm">
            Dec 12, 2024 14:30:25
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-sm">
          Database connection failed: Connection refused on localhost:5432
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" variant="outline">
          View Details
        </Button>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">12,345</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-red-600">2.1%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">8</div>
        </CardContent>
      </Card>
    </div>
  ),
};
