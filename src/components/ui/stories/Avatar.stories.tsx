import type { Meta, StoryObj } from "@storybook/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        alt="@john"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage alt="@jane" src="/broken-image.jpg" />
      <AvatarFallback>JS</AvatarFallback>
    </Avatar>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-6">
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar className="size-8">
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithInitials: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const LogsAppExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-sm">User Activity Log</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="font-medium">John Doe</span> created a new log
              entry
              <span className="ml-2 text-muted-foreground">2 min ago</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="font-medium">System Monitor</span> detected high
              memory usage
              <span className="ml-2 text-muted-foreground">5 min ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm">Recent Contributors</h3>
        <div className="-space-x-2 flex">
          <Avatar className="size-8 border-2 border-background">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar className="size-8 border-2 border-background">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="size-8 border-2 border-background">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar className="size-8 border-2 border-background">
            <AvatarFallback className="text-xs">+3</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="-bottom-0 -right-0 absolute size-3 rounded-full border-2 border-background bg-green-500"></div>
      </div>
      <div className="relative">
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div className="-bottom-0 -right-0 absolute size-3 rounded-full border-2 border-background bg-yellow-500"></div>
      </div>
      <div className="relative">
        <Avatar>
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <div className="-bottom-0 -right-0 absolute size-3 rounded-full border-2 border-background bg-gray-400"></div>
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback className="bg-blue-100 text-blue-600">
          AD
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-green-100 text-green-600">
          DB
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-purple-100 text-purple-600">
          AP
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-orange-100 text-orange-600">
          SY
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};
