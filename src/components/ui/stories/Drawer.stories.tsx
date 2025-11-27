import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  BellIcon,
  FileTextIcon,
  FilterIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../drawer";
import { Input } from "../input";
import { Label } from "../label";
import { Textarea } from "../textarea";

const meta: Meta<typeof Drawer> = {
  title: "UI/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: function BasicDrawerExample() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer onOpenChange={setOpen} open={open}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Basic Drawer</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  This is a basic drawer component. It slides in from the right
                  side of the screen.
                </p>
                <div className="space-y-2">
                  <Label>Sample Input</Label>
                  <Input placeholder="Enter some text..." />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Add a description..." rows={3} />
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button onClick={() => setOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Save</Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const UserProfileDrawer: Story = {
  render: function UserProfileDrawerExample() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>
          <UserIcon className="mr-2 h-4 w-4" />
          View Profile
        </Button>
        <Drawer onOpenChange={setOpen} open={open}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>User Profile</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-semibold text-white text-xl">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-muted-foreground text-sm">
                      john.doe@company.com
                    </p>
                    <Badge className="mt-1" variant="secondary">
                      Administrator
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium text-muted-foreground text-xs">
                      PERSONAL INFORMATION
                    </Label>
                    <div className="mt-2 space-y-3">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-muted-foreground text-sm">
                          Name:
                        </span>
                        <span className="col-span-2 text-sm">John Doe</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-muted-foreground text-sm">
                          Email:
                        </span>
                        <span className="col-span-2 text-sm">
                          john.doe@company.com
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-muted-foreground text-sm">
                          Department:
                        </span>
                        <span className="col-span-2 text-sm">Engineering</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-muted-foreground text-sm">
                          Joined:
                        </span>
                        <span className="col-span-2 text-sm">
                          March 15, 2023
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium text-muted-foreground text-xs">
                      ACTIVITY SUMMARY
                    </Label>
                    <div className="mt-2 space-y-3">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-muted-foreground text-sm">
                          Last Login:
                        </span>
                        <span className="col-span-2 text-sm">2 hours ago</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-muted-foreground text-sm">
                          Sessions:
                        </span>
                        <span className="col-span-2 text-sm">247 total</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-muted-foreground text-sm">
                          Logs Created:
                        </span>
                        <span className="col-span-2 text-sm">
                          1,234 entries
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Edit Profile
                </Button>
                <Button size="sm" variant="outline">
                  View Activity
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const LogFiltersDrawer: Story = {
  render: function LogFiltersDrawerExample() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)} variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
        <Drawer onOpenChange={setOpen} open={open}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Log Filters</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">From</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label className="text-xs">To</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Severity Level</Label>
                  <div className="space-y-2">
                    {["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"].map(
                      (level) => (
                        <label className="flex items-center gap-2" key={level}>
                          <input
                            className="rounded"
                            defaultChecked={level !== "DEBUG"}
                            type="checkbox"
                          />
                          <span className="text-sm">{level}</span>
                          <Badge
                            className="ml-auto text-xs"
                            variant={
                              level === "ERROR" || level === "CRITICAL"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {level === "INFO"
                              ? "1.2k"
                              : level === "ERROR"
                                ? "234"
                                : level === "WARNING"
                                  ? "45"
                                  : "12"}
                          </Badge>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Source</Label>
                  <Input placeholder="Filter by source (e.g., api-server)" />
                </div>

                <div className="space-y-3">
                  <Label>Message Contains</Label>
                  <Input placeholder="Search in log messages..." />
                </div>

                <div className="space-y-3">
                  <Label>Thread ID</Label>
                  <Input placeholder="Filter by thread ID" />
                </div>

                <div className="space-y-3">
                  <Label>Custom Query</Label>
                  <Textarea
                    className="font-mono text-sm"
                    placeholder="Enter custom search query..."
                    rows={3}
                  />
                  <p className="text-muted-foreground text-xs">
                    Use SQL-like syntax for advanced filtering
                  </p>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reset Filters
                </Button>
                <Button onClick={() => setOpen(false)} size="sm">
                  Apply Filters
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const LogDetailsDrawer: Story = {
  render: function LogDetailsDrawerExample() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)} size="sm" variant="ghost">
          <FileTextIcon className="mr-2 h-4 w-4" />
          View Log Details
        </Button>
        <Drawer onOpenChange={setOpen} open={open}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Log Entry #12345</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium text-muted-foreground text-xs">
                      TIMESTAMP
                    </Label>
                    <p className="mt-1 font-mono text-sm">
                      2024-01-15 14:32:18.245
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium text-muted-foreground text-xs">
                      SEVERITY
                    </Label>
                    <div className="mt-1">
                      <Badge variant="destructive">ERROR</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium text-muted-foreground text-xs">
                      SOURCE
                    </Label>
                    <p className="mt-1 font-mono text-sm">api-gateway</p>
                  </div>
                  <div>
                    <Label className="font-medium text-muted-foreground text-xs">
                      THREAD
                    </Label>
                    <p className="mt-1 font-mono text-sm">
                      http-nio-8080-exec-2
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-muted-foreground text-xs">
                    MESSAGE
                  </Label>
                  <div className="mt-2 rounded-lg bg-muted p-3">
                    <p className="font-mono text-sm">
                      Failed to connect to database: Connection timeout after
                      30000ms
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-muted-foreground text-xs">
                    REQUEST DETAILS
                  </Label>
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="col-span-2 font-mono">POST</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">Endpoint:</span>
                      <span className="col-span-2 font-mono">
                        /api/v1/users
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="col-span-2 font-mono">usr_abc123</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">IP Address:</span>
                      <span className="col-span-2 font-mono">
                        192.168.1.100
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-muted-foreground text-xs">
                    STACK TRACE
                  </Label>
                  <div className="mt-2 max-h-48 overflow-y-auto rounded-lg bg-muted p-3">
                    <pre className="whitespace-pre-wrap font-mono text-muted-foreground text-xs">
                      {`java.sql.SQLException: Connection timeout
    at com.example.db.ConnectionPool.getConnection(ConnectionPool.java:245)
    at com.example.service.UserService.findById(UserService.java:82)
    at com.example.controller.UserController.getUser(UserController.java:45)
    at java.base/java.lang.reflect.Method.invoke(Method.java:568)
    at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)
    at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:150)
    at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)`}
                    </pre>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-muted-foreground text-xs">
                    RELATED LOGS
                  </Label>
                  <div className="mt-2 space-y-2">
                    {[
                      {
                        id: "12344",
                        message: "Database connection pool exhausted",
                        time: "14:32:15",
                      },
                      {
                        id: "12346",
                        message: "Retry attempt failed",
                        time: "14:32:20",
                      },
                      {
                        id: "12347",
                        message: "Fallback service activated",
                        time: "14:32:22",
                      },
                    ].map((log) => (
                      <div className="rounded border p-2 text-sm" key={log.id}>
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-muted-foreground text-xs">
                            #{log.id}
                          </span>
                          <span className="font-mono text-muted-foreground text-xs">
                            {log.time}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  Mark as Resolved
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const SettingsDrawer: Story = {
  render: function SettingsDrawerExample() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)} variant="outline">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Drawer onOpenChange={setOpen} open={open}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Application Settings</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-6">
                <div>
                  <Label className="font-medium text-sm">
                    General Settings
                  </Label>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Auto-refresh logs</p>
                        <p className="text-muted-foreground text-xs">
                          Automatically refresh log data every 30 seconds
                        </p>
                      </div>
                      <input
                        className="rounded"
                        defaultChecked
                        type="checkbox"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Show timestamps</p>
                        <p className="text-muted-foreground text-xs">
                          Display full timestamp in log entries
                        </p>
                      </div>
                      <input
                        className="rounded"
                        defaultChecked
                        type="checkbox"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Compact view</p>
                        <p className="text-muted-foreground text-xs">
                          Use condensed layout for more logs per page
                        </p>
                      </div>
                      <input className="rounded" type="checkbox" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-sm">Notifications</Label>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Critical alerts</p>
                        <p className="text-muted-foreground text-xs">
                          Get notified of critical errors
                        </p>
                      </div>
                      <input
                        className="rounded"
                        defaultChecked
                        type="checkbox"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Email notifications</p>
                        <p className="text-muted-foreground text-xs">
                          Send alerts via email
                        </p>
                      </div>
                      <input className="rounded" type="checkbox" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-sm">Performance</Label>
                  <div className="mt-3 space-y-4">
                    <div>
                      <Label className="text-xs">Logs per page</Label>
                      <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                        <option>200</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs">Auto-refresh interval</Label>
                      <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
                        <option>15 seconds</option>
                        <option>30 seconds</option>
                        <option>1 minute</option>
                        <option>5 minutes</option>
                        <option>Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button onClick={() => setOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Save Changes</Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const NotificationDrawer: Story = {
  render: function NotificationDrawerExample() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)} size="sm" variant="outline">
          <BellIcon className="mr-2 h-4 w-4" />
          Notifications
          <Badge
            className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            variant="destructive"
          >
            3
          </Badge>
        </Button>
        <Drawer onOpenChange={setOpen} open={open}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notifications</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    type: "error",
                    title: "Database Connection Failed",
                    message:
                      "Multiple connection timeouts detected in production",
                    time: "2 minutes ago",
                    unread: true,
                  },
                  {
                    id: 2,
                    type: "warning",
                    title: "High Memory Usage",
                    message: "API server memory usage above 85% threshold",
                    time: "15 minutes ago",
                    unread: true,
                  },
                  {
                    id: 3,
                    type: "info",
                    title: "Deployment Complete",
                    message:
                      "Version 2.1.4 successfully deployed to production",
                    time: "1 hour ago",
                    unread: false,
                  },
                  {
                    id: 4,
                    type: "error",
                    title: "Authentication Service Down",
                    message: "Auth service not responding to health checks",
                    time: "2 hours ago",
                    unread: true,
                  },
                ].map((notification) => (
                  <div
                    className={`rounded-lg border p-4 ${notification.unread ? "bg-accent/50" : ""}`}
                    key={notification.id}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-2 h-2 w-2 rounded-full ${
                          notification.type === "error"
                            ? "bg-red-500"
                            : notification.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-medium text-sm ${notification.unread ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </h4>
                          {notification.unread && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-muted-foreground text-xs">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DrawerBody>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Mark All Read
                </Button>
                <Button size="sm">View All</Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};
