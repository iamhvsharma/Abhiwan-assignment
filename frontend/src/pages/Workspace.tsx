import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Building2, Users, Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, getAuthHeader } from "@/lib/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

interface Workspace {
  id: string;
  name: string;
  workspaceNumber: number;
  manager: { name: string };
  members: { id: string; name: string }[];
  createdAt: string;
}

export default function WorkspacePage() {
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const [joinWorkspaceOpen, setJoinWorkspaceOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [joinWorkspaceNumber, setJoinWorkspaceNumber] = useState("");
  const [managerWorkspaces, setManagerWorkspaces] = useState<Workspace[]>([]);
  const [joinedWorkspace, setJoinedWorkspace] = useState<Workspace | null>(
    null
  );

  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isManager = user?.role === "MANAGER";
  const userWorkspaceNumber = user?.workspaceNumber;

  useEffect(() => {
    if (isManager) {
      fetchManagerWorkspaces();
    } else if (userWorkspaceNumber) {
      fetchWorkspaceByNumber(userWorkspaceNumber);
      socket.emit("joinWorkspace", userWorkspaceNumber);
    }

    socket.on("workspace:updated", () => {
      if (!isManager && userWorkspaceNumber) {
        fetchWorkspaceByNumber(userWorkspaceNumber);
      } else {
        fetchManagerWorkspaces();
      }
    });

    return () => {
      socket.off("workspace:updated");
    };
  }, []);

  const fetchManagerWorkspaces = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/manager`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setManagerWorkspaces(data.workspaces || []);
    } catch (err) {
      console.error("Failed to fetch manager's workspaces", err);
    }
  };

  const fetchWorkspaceByNumber = async (number: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/${number}`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setJoinedWorkspace(data.workspace || null);
    } catch (err) {
      console.error("Failed to fetch workspace", err);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/workspaces`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ name: newWorkspaceName }),
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Workspace created",
          description: `Workspace #${data.workspace.workspaceNumber} created`,
        });
        setNewWorkspaceName("");
        setCreateWorkspaceOpen(false);
        fetchManagerWorkspaces();
        socket.emit("workspace:updated", data.workspace.workspaceNumber);
      } else {
        toast({ title: "Error", description: data.msg });
      }
    } catch (err) {
      console.error("Create workspace error", err);
    }
  };

  const handleJoinWorkspace = async () => {
    if (!joinWorkspaceNumber.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/join`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          workspaceNumber: parseInt(joinWorkspaceNumber),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, workspaceNumber: data.workspaceNumber })
        );
        toast({
          title: "Joined Workspace",
          description: `Successfully joined #${data.workspaceNumber}`,
        });
        setJoinWorkspaceOpen(false);
        setJoinWorkspaceNumber("");
        fetchWorkspaceByNumber(data.workspaceNumber);
        socket.emit("joinWorkspace", data.workspaceNumber);
      } else {
        toast({ title: "Error", description: data.msg });
      }
    } catch (err) {
      console.error("Join workspace error", err);
    }
  };

  const copyWorkspaceNumber = (num: number) => {
    navigator.clipboard.writeText(num.toString());
    toast({
      title: "Copied!",
      description: "Workspace number copied to clipboard",
    });
  };

  const renderWorkspaceCard = (ws: Workspace) => {
    const daysActive = Math.floor(
      (Date.now() - new Date(ws.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <Card key={ws.id}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {ws.name}
          </CardTitle>
          <CardDescription>Workspace #{ws.workspaceNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Manager:</span>
            <span>{ws.manager.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Members:</span>
            <span>{ws.members.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Days Active:</span>
            <span>{daysActive} days</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyWorkspaceNumber(ws.workspaceNumber)}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy Number
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (!joinedWorkspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
          <p className="text-muted-foreground">
            {isManager
              ? "Manage your workspaces"
              : "View your joined workspace"}
          </p>
        </div>

        <div className="flex gap-2">
          {isManager && (
            <Dialog
              open={createWorkspaceOpen}
              onOpenChange={setCreateWorkspaceOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-secondary/70 text-foreground hover:bg-secondary/100">
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Workspace</DialogTitle>
                  <DialogDescription>Name your new workspace</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="workspaceName">Workspace Name</Label>
                  <Input
                    id="workspaceName"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Ex: Marketing Team"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCreateWorkspaceOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateWorkspace}
                      disabled={!newWorkspaceName.trim()}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {!isManager && !joinedWorkspace && (
            <Dialog
              open={joinWorkspaceOpen}
              onOpenChange={setJoinWorkspaceOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Join Workspace
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Workspace</DialogTitle>
                  <DialogDescription>
                    Enter workspace number provided by manager
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="workspaceNumber">Workspace Number</Label>
                  <Input
                    id="workspaceNumber"
                    value={joinWorkspaceNumber}
                    onChange={(e) => setJoinWorkspaceNumber(e.target.value)}
                    placeholder="1234"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setJoinWorkspaceOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleJoinWorkspace}
                      disabled={!joinWorkspaceNumber.trim()}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {isManager && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {managerWorkspaces.map((ws) => renderWorkspaceCard(ws))}
        </div>
      )}

      {!isManager && joinedWorkspace && (
        <div className="grid gap-4 md:grid-cols-1">
          {renderWorkspaceCard(joinedWorkspace)}
        </div>
      )}
    </div>
  );
}
