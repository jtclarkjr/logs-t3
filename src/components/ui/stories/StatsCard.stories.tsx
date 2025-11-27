import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  ActivityIcon,
  AlertTriangleIcon,
  DatabaseIcon,
  InfoIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { StatsCard } from "../stats-card";

const meta: Meta<typeof StatsCard> = {
  title: "UI/StatsCard",
  component: StatsCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Total Users",
    value: "12,345",
    description: "Active users this month",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Total Logs",
    value: "24,789",
    description: "Logs processed today",
    icon: <ActivityIcon />,
  },
};

export const WithPositiveTrend: Story = {
  args: {
    title: "API Requests",
    value: "45,231",
    description: "from last week",
    icon: <TrendingUpIcon />,
    trend: {
      value: 12.5,
      isPositive: true,
    },
  },
};

export const WithNegativeTrend: Story = {
  args: {
    title: "Error Rate",
    value: "2.1%",
    description: "from last hour",
    icon: <AlertTriangleIcon />,
    trend: {
      value: 5.2,
      isPositive: false,
    },
  },
};

export const LogsAppExamples: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        description="Last 7 days"
        icon={<ActivityIcon />}
        title="Total Logs"
        trend={{ value: 20, isPositive: true }}
        value="12,345"
      />

      <StatsCard
        description="of total logs"
        icon={<AlertTriangleIcon />}
        title="Error Rate"
        trend={{ value: 12, isPositive: false }}
        value="2.1%"
      />

      <StatsCard
        description="services reporting"
        icon={<DatabaseIcon />}
        title="Sources Active"
        value="8"
      />

      <StatsCard
        description="require attention"
        icon={<AlertTriangleIcon />}
        title="Critical Logs"
        trend={{ value: 45, isPositive: false }}
        value="23"
      />
    </div>
  ),
};

export const DifferentFormats: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        description="This month"
        icon={<TrendingUpIcon />}
        title="Revenue"
        trend={{ value: 15.2, isPositive: true }}
        value="$12,345"
      />

      <StatsCard
        description="from visitors"
        title="Conversion Rate"
        trend={{ value: 2.1, isPositive: true }}
        value="3.24%"
      />

      <StatsCard
        description="average response"
        title="Processing Time"
        trend={{ value: 8.5, isPositive: false }}
        value="1.2s"
      />
    </div>
  ),
};

export const SystemMetrics: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        description="across all nodes"
        icon={<ActivityIcon />}
        title="CPU Usage"
        trend={{ value: 5, isPositive: true }}
        value="45%"
      />

      <StatsCard
        description="of 16 GB available"
        icon={<DatabaseIcon />}
        title="Memory Usage"
        value="8.2 GB"
      />

      <StatsCard
        description="database connections"
        icon={<UsersIcon />}
        title="Active Connections"
        trend={{ value: 12, isPositive: true }}
        value="1,247"
      />

      <StatsCard
        description="of allocated space"
        icon={<DatabaseIcon />}
        title="Storage Used"
        trend={{ value: 3, isPositive: true }}
        value="85%"
      />

      <StatsCard
        description="current throughput"
        icon={<ActivityIcon />}
        title="Network I/O"
        value="2.4 MB/s"
      />

      <StatsCard
        description="last 30 days"
        icon={<TrendingUpIcon />}
        title="Uptime"
        value="99.9%"
      />
    </div>
  ),
};

export const LargeNumbers: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <StatsCard
        description="this month"
        icon={<ActivityIcon />}
        title="Total Requests"
        trend={{ value: 25, isPositive: true }}
        value="2.4M"
      />

      <StatsCard
        description="today"
        icon={<DatabaseIcon />}
        title="Data Processed"
        trend={{ value: 8, isPositive: true }}
        value="1.2TB"
      />
    </div>
  ),
};

export const WithoutTrend: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        description="all systems operational"
        icon={<ActivityIcon />}
        title="Server Status"
        value="Online"
      />

      <StatsCard
        description="automated backup"
        icon={<DatabaseIcon />}
        title="Last Backup"
        value="2h ago"
      />

      <StatsCard
        description="expires in 6 months"
        icon={<InfoIcon />}
        title="License Status"
        value="Valid"
      />
    </div>
  ),
};

export const SingleCard: Story = {
  args: {
    title: "Daily Active Users",
    value: "8,427",
    description: "unique users today",
    icon: <UsersIcon />,
    trend: {
      value: 12.3,
      isPositive: true,
    },
    className: "w-64",
  },
};
