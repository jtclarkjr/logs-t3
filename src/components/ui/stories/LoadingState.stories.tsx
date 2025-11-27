import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoadingState } from "../loading-state";

const meta: Meta<typeof LoadingState> = {
  title: "UI/LoadingState",
  component: LoadingState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["table", "cards", "chart", "simple"],
    },
    count: {
      control: { type: "number", min: 1, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    variant: "simple",
    count: 3,
  },
};

export const Table: Story = {
  args: {
    variant: "table",
    count: 5,
  },
};

export const Cards: Story = {
  args: {
    variant: "cards",
    count: 4,
  },
};

export const Chart: Story = {
  args: {
    variant: "chart",
  },
};

export const LogsAppExamples: Story = {
  render: () => (
    <div className="w-full max-w-6xl space-y-8">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Loading Logs Table</h3>
        <LoadingState count={6} variant="table" />
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Loading Dashboard Stats</h3>
        <LoadingState count={4} variant="cards" />
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Loading Chart</h3>
        <LoadingState variant="chart" />
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Loading Simple Content</h3>
        <LoadingState count={5} variant="simple" />
      </div>
    </div>
  ),
};

export const DifferentCounts: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Table - 3 rows</h3>
        <LoadingState count={3} variant="table" />
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Cards - 6 cards</h3>
        <LoadingState count={6} variant="cards" />
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Simple - 8 lines</h3>
        <LoadingState count={8} variant="simple" />
      </div>
    </div>
  ),
};
