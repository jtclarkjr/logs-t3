import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { FormFieldWrapper } from "../form-field";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Textarea } from "../textarea";

const meta: Meta<typeof Form> = {
  title: "UI/Form",
  component: Form,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Schema definitions for react-hook-form examples
const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  bio: z
    .string()
    .max(500, { message: "Bio must be 500 characters or less." })
    .optional(),
  role: z.string().min(1, { message: "Please select a role." }),
});

// React Hook Form Examples
export const ReactHookFormLogin: Story = {
  render: function ReactHookFormLoginExample() {
    const form = useForm<z.infer<typeof loginFormSchema>>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    function onSubmit(values: z.infer<typeof loginFormSchema>) {
      console.log("Login form submitted:", values);
    }

    return (
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 text-center">
          <h2 className="font-semibold text-2xl">Sign In</h2>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    );
  },
};

export const ReactHookFormProfile: Story = {
  render: function ReactHookFormProfileExample() {
    const form = useForm<z.infer<typeof profileFormSchema>>({
      resolver: zodResolver(profileFormSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        bio: "",
        role: "",
      },
    });

    function onSubmit(values: z.infer<typeof profileFormSchema>) {
      console.log("Profile form submitted:", values);
    }

    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h2 className="font-semibold text-2xl">Profile Settings</h2>
          <p className="text-muted-foreground">
            Update your profile information
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your role in the organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px] resize-none"
                      placeholder="Tell us about yourself..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description about yourself. Maximum 500 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    );
  },
};

// FormFieldWrapper Examples (existing pattern)
export const FormFieldWrapperExample: Story = {
  render: () => (
    <div className="w-96 space-y-6">
      <FormFieldWrapper
        description="We'll never share your email with anyone else."
        label="Email Address"
        required
      >
        <Input placeholder="Enter your email" type="email" />
      </FormFieldWrapper>

      <FormFieldWrapper
        errors={["Password must be at least 8 characters"]}
        label="Password"
        required
      >
        <Input
          className="border-destructive"
          placeholder="Enter password"
          type="password"
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        description="Tell us a little about yourself."
        label="Bio"
      >
        <Textarea placeholder="Write your bio..." rows={3} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Country" required>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldWrapper>
    </div>
  ),
};

export const LogCreationForm: Story = {
  render: () => (
    <form className="w-[500px] space-y-6">
      <h2 className="font-bold text-2xl">Create New Log Entry</h2>

      <FormFieldWrapper
        description="Select the appropriate severity level for this log entry"
        label="Severity Level"
        required
      >
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="debug">DEBUG</SelectItem>
            <SelectItem value="info">INFO</SelectItem>
            <SelectItem value="warning">WARNING</SelectItem>
            <SelectItem value="error">ERROR</SelectItem>
            <SelectItem value="critical">CRITICAL</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldWrapper>

      <FormFieldWrapper
        description="The system or component that generated this log"
        label="Log Source"
        required
      >
        <Input placeholder="e.g., api-server, database, auth-service" />
      </FormFieldWrapper>

      <FormFieldWrapper
        description="Detailed description of what happened"
        label="Log Message"
        required
      >
        <Textarea placeholder="Enter the detailed log message..." rows={4} />
      </FormFieldWrapper>

      <FormFieldWrapper
        description="Leave empty to use current time"
        label="Timestamp"
      >
        <Input type="datetime-local" />
      </FormFieldWrapper>

      <div className="flex gap-2 pt-4">
        <Button type="submit">Create Log Entry</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  ),
};
