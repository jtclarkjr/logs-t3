import type { Meta, StoryObj } from "@storybook/nextjs";
import { EyeIcon, EyeOffIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../input";
import { Label } from "../label";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "search", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="input-with-label">Email</Label>
      <Input
        id="input-with-label"
        placeholder="Enter your email"
        type="email"
      />
    </div>
  ),
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
};

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative">
      <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
      <Input className="pl-9" placeholder="Search logs..." />
    </div>
  ),
};
export const PasswordToggle: Story = {
  render: function PasswordToggleComponent() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          className="pr-9"
          placeholder="Enter password..."
          type={showPassword ? "text" : "password"}
        />
        <button
          className="absolute top-3 right-3 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
          type="button"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    );
  },
};

export const DifferentTypes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <Label>Text</Label>
        <Input placeholder="Text input" type="text" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="email@example.com" type="email" />
      </div>
      <div className="space-y-2">
        <Label>Number</Label>
        <Input placeholder="123" type="number" />
      </div>
      <div className="space-y-2">
        <Label>Password</Label>
        <Input placeholder="••••••••" type="password" />
      </div>
      <div className="space-y-2">
        <Label>Search</Label>
        <Input placeholder="Search..." type="search" />
      </div>
    </div>
  ),
};

export const LogsAppExamples: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div className="space-y-2">
        <Label>Log Source</Label>
        <Input placeholder="e.g., api-server, database, auth-service" />
      </div>
      <div className="space-y-2">
        <Label>Search Logs</Label>
        <div className="relative">
          <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search logs..." />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Filter by Timestamp</Label>
        <Input type="datetime-local" />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Input placeholder="Normal state" />
      <Input
        className="focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        placeholder="Focused state"
      />
      <Input className="border-destructive" placeholder="Error state" />
      <Input disabled placeholder="Disabled state" />
    </div>
  ),
};
