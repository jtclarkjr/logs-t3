import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  AlertCircleIcon,
  DatabaseIcon,
  FileTextIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";
import { EmptyState } from "../empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No items found",
    description: "There are no items to display at the moment.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <SearchIcon className="h-16 w-16" />,
    title: "No results found",
    description: "Try adjusting your search criteria or filters.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <FileTextIcon className="h-16 w-16" />,
    title: "No documents",
    description: "Get started by creating your first document.",
    action: {
      label: "Create Document",
      onClick: () => alert("Create clicked"),
    },
  },
};

export const LogsAppExamples: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <EmptyState
        action={{
          label: "Reset Filters",
          onClick: () => alert("Reset filters clicked"),
        }}
        description="Try adjusting your search criteria or filters to find matching logs."
        icon={<FileTextIcon className="h-16 w-16" />}
        title="No logs found"
      />

      <EmptyState
        action={{
          label: "Clear Search",
          onClick: () => alert("Clear search clicked"),
        }}
        description="We couldn't find any logs matching your search query. Try using different keywords."
        icon={<SearchIcon className="h-16 w-16" />}
        title="No search results"
      />

      <EmptyState
        action={{
          label: "Select Date Range",
          onClick: () => alert("Date range picker clicked"),
        }}
        description="There are no logs available for the selected time period. Try selecting a different date range."
        icon={<DatabaseIcon className="h-16 w-16" />}
        title="No data available"
      />

      <EmptyState
        action={{
          label: "Retry",
          onClick: () => alert("Retry clicked"),
        }}
        description="Unable to load logs from the server. Please check your connection and try again."
        icon={<AlertCircleIcon className="h-16 w-16" />}
        title="Connection error"
      />
    </div>
  ),
};

export const DifferentStates: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EmptyState
          description="You're all caught up! No new notifications."
          title="No notifications"
        />

        <EmptyState
          action={{
            label: "Clear Filters",
            onClick: () => alert("Clear filters"),
          }}
          description="No results match your current filters."
          icon={<FilterIcon className="h-12 w-12" />}
          title="Filters applied"
        />

        <EmptyState
          description="Enter a search term to find what you're looking for."
          icon={<SearchIcon className="h-12 w-12" />}
          title="Start searching"
        />

        <EmptyState
          action={{
            label: "Add Item",
            onClick: () => alert("Add item"),
          }}
          description="Get started by adding your first item to the collection."
          icon={<FileTextIcon className="h-12 w-12" />}
          title="Create your first item"
        />
      </div>
    </div>
  ),
};

export const MinimalStates: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-6">
      <EmptyState title="No results" />

      <EmptyState description="This folder is empty." title="Empty folder" />

      <EmptyState
        icon={<SearchIcon className="h-12 w-12" />}
        title="No matches found"
      />
    </div>
  ),
};

export const ErrorStates: Story = {
  render: () => (
    <div className="w-full max-w-3xl space-y-6">
      <EmptyState
        action={{
          label: "Try Again",
          onClick: () => alert("Retry"),
        }}
        description="Something went wrong while loading the data. Please try again later."
        icon={<AlertCircleIcon className="h-16 w-16 text-red-500" />}
        title="Failed to load data"
      />

      <EmptyState
        action={{
          label: "Refresh",
          onClick: () => alert("Refresh"),
        }}
        description="The logging service is temporarily unavailable. Please check back in a few minutes."
        icon={<DatabaseIcon className="h-16 w-16 text-orange-500" />}
        title="Service unavailable"
      />
    </div>
  ),
};

export const InTable: Story = {
  render: () => (
    <div className="w-full max-w-4xl rounded-lg border">
      <div className="border-b p-4">
        <h2 className="font-semibold">Log Entries</h2>
      </div>
      <EmptyState
        action={{
          label: "Reset Filters",
          onClick: () => alert("Reset filters"),
        }}
        className="border-0 shadow-none"
        description="There are no log entries to display for the selected filters."
        icon={<FileTextIcon className="h-12 w-12" />}
        title="No log entries"
      />
    </div>
  ),
};
