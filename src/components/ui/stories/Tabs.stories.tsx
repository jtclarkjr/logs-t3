import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  ActivityIcon,
  BarChart3Icon,
  LineChartIcon,
  PieChartIcon,
} from "lucide-react";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs className="w-96" defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab One</TabsTrigger>
        <TabsTrigger value="tab2">Tab Two</TabsTrigger>
        <TabsTrigger value="tab3">Tab Three</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p>Content for tab one</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p>Content for tab two</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p>Content for tab three</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs className="w-96" defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">
          <ActivityIcon />
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <BarChart3Icon />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="reports">
          <LineChartIcon />
          Reports
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg">System Overview</h3>
            <p className="text-muted-foreground">
              General system information and status.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Detailed analytics and metrics.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg">Reports</h3>
            <p className="text-muted-foreground">
              Generated reports and exports.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const WithCards: Story = {
  render: () => (
    <Tabs className="w-[500px]" defaultValue="account">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&apos;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="name">
                Name
              </label>
              <input
                className="w-full rounded-md border px-3 py-2"
                id="name"
                placeholder="Pedro Duarte"
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="username">
                Username
              </label>
              <input
                className="w-full rounded-md border px-3 py-2"
                id="username"
                placeholder="@peduarte"
              />
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you&apos;ll be logged
              out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="current">
                Current password
              </label>
              <input
                className="w-full rounded-md border px-3 py-2"
                id="current"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="new">
                New password
              </label>
              <input
                className="w-full rounded-md border px-3 py-2"
                id="new"
                type="password"
              />
            </div>
            <Button>Save password</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const LogsAppExamples: Story = {
  render: () => (
    <Tabs className="w-full max-w-4xl" defaultValue="timeline">
      <TabsList>
        <TabsTrigger value="timeline">
          <LineChartIcon />
          Timeline Chart
        </TabsTrigger>
        <TabsTrigger value="distribution">
          <PieChartIcon />
          Severity Distribution
        </TabsTrigger>
        <TabsTrigger value="sources">
          <BarChart3Icon />
          Top Sources
        </TabsTrigger>
      </TabsList>
      <TabsContent value="timeline">
        <Card>
          <CardHeader>
            <CardTitle>Log Count Over Time</CardTitle>
            <CardDescription>
              Trend of log counts grouped by time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded bg-muted">
              <LineChartIcon className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Timeline Chart Placeholder
              </span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="distribution">
        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>
              Breakdown of logs by severity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded bg-muted">
              <PieChartIcon className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Pie Chart Placeholder
              </span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sources">
        <Card>
          <CardHeader>
            <CardTitle>Top Log Sources</CardTitle>
            <CardDescription>
              Most active log sources in the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded bg-muted">
              <BarChart3Icon className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Bar Chart Placeholder
              </span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Tabs className="w-96" defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">
          All <Badge className="ml-2">12</Badge>
        </TabsTrigger>
        <TabsTrigger value="errors">
          Errors{" "}
          <Badge className="ml-2" variant="destructive">
            3
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="warnings">
          Warnings{" "}
          <Badge className="ml-2" variant="secondary">
            5
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="rounded-lg border p-4">
          <p>Showing all 12 log entries</p>
        </div>
      </TabsContent>
      <TabsContent value="errors">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p>Showing 3 error entries</p>
        </div>
      </TabsContent>
      <TabsContent value="warnings">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p>Showing 5 warning entries</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs className="flex h-64 w-96" defaultValue="tab1" orientation="vertical">
      <TabsList className="h-full w-24 flex-col">
        <TabsTrigger className="w-full" value="tab1">
          Tab 1
        </TabsTrigger>
        <TabsTrigger className="w-full" value="tab2">
          Tab 2
        </TabsTrigger>
        <TabsTrigger className="w-full" value="tab3">
          Tab 3
        </TabsTrigger>
      </TabsList>
      <div className="ml-4 flex-1">
        <TabsContent className="h-full" value="tab1">
          <div className="h-full rounded-lg border p-4">
            <h3 className="font-semibold">Tab 1 Content</h3>
            <p className="text-muted-foreground">
              This is the content for tab 1
            </p>
          </div>
        </TabsContent>
        <TabsContent className="h-full" value="tab2">
          <div className="h-full rounded-lg border p-4">
            <h3 className="font-semibold">Tab 2 Content</h3>
            <p className="text-muted-foreground">
              This is the content for tab 2
            </p>
          </div>
        </TabsContent>
        <TabsContent className="h-full" value="tab3">
          <div className="h-full rounded-lg border p-4">
            <h3 className="font-semibold">Tab 3 Content</h3>
            <p className="text-muted-foreground">
              This is the content for tab 3
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs className="w-96" defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Active</TabsTrigger>
        <TabsTrigger disabled value="tab2">
          Disabled
        </TabsTrigger>
        <TabsTrigger value="tab3">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p>Content for active tab</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p>This content won&apos;t be shown</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p>Content for another tab</p>
      </TabsContent>
    </Tabs>
  ),
};
