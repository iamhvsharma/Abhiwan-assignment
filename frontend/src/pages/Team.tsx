import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMinus, Mail, UserPlus, Shield, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, getAuthHeader } from "@/lib/api";
import { useSocket } from "@/hooks/use-socket";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "MANAGER" | "TEAM";
}

interface Workspace {
  id: string;
  name: string;
  workspaceNumber: number;
  manager: { name: string };
  members: Member[];
}

export default function TeamPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const { toast } = useToast();
  const { socket } = useSocket();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isManager = user?.role === "MANAGER";

  // Fetch the current user's workspace
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/workspaces/user`, {
          headers: getAuthHeader(),
        });
        const data = await res.json();
        setWorkspace(data.workspace || null);
      } catch (err) {
        console.error("Failed to fetch workspace", err);
      }
    };
    fetchWorkspace();
  }, []);

  // Socket integration for real-time updates
  useEffect(() => {
    if (!socket || !workspace?.workspaceNumber) return;

    // Join workspace room
    socket.emit("joinWorkspace", String(workspace.workspaceNumber));

    // Listen for workspace member updates
    socket.on("workspace:memberJoined", (member: Member) => {
      setWorkspace((prev) =>
        prev
          ? {
              ...prev,
              members: [...prev.members, member],
            }
          : prev
      );
      toast({
        title: "New Member",
        description: `${member.name} joined the workspace`,
      });
    });

    socket.on(
      "workspace:memberRemoved",
      ({ userId, userName }: { userId: string; userName: string }) => {
        setWorkspace((prev) =>
          prev
            ? {
                ...prev,
                members: prev.members.filter((m) => m.id !== userId),
              }
            : prev
        );
        toast({
          title: "Member Removed",
          description: `${userName} was removed from the workspace`,
        });
      }
    );

    socket.on("workspace:updated", (updatedWorkspace: Workspace) => {
      setWorkspace(updatedWorkspace);
    });

    return () => {
      socket.off("workspace:memberJoined");
      socket.off("workspace:memberRemoved");
      socket.off("workspace:updated");
    };
  }, [socket, workspace?.workspaceNumber, toast]);

  // Invite Member
  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/invite`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Invite Sent",
          description: `Invitation sent to ${inviteEmail}`,
        });
        setInviteDialogOpen(false);
        setInviteEmail("");
      } else {
        toast({ title: "Error", description: data.msg || "Invite failed" });
      }
    } catch (err) {
      console.error("Invite error", err);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  // Remove Member
  const handleRemoveUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/remove-user`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          workspaceId: workspace?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: "Removed", description: "Member removed" });
        // Real-time update will be handled by socket
      } else {
        toast({
          title: "Error",
          description: data.msg,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Remove member error", err);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (!workspace) {
    return (
      <Layout userRole={user.role} userName={user.name}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={user.role} userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Team Management
            </h1>
            <p className="text-muted-foreground">
              Manage your workspace: {workspace.name} (#
              {workspace.workspaceNumber})
            </p>
          </div>

          {isManager && (
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>Enter email to invite</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="jane@example.com"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setInviteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleInvite}
                      disabled={!inviteEmail.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Workspace Members ({workspace.members.length})
            </CardTitle>
            <CardDescription>List of all joined members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workspace.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      member.role === "MANAGER" ? "default" : "secondary"
                    }
                    className="gap-1"
                  >
                    {member.role === "MANAGER" ? (
                      <Crown className="h-3 w-3" />
                    ) : (
                      <Shield className="h-3 w-3" />
                    )}
                    {member.role}
                  </Badge>

                  {isManager && member.id !== user.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <UserMinus className="h-3 w-3" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {member.name}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveUser(member.id)}
                            className="bg-destructive"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}

            {workspace.members.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No members in this workspace yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
