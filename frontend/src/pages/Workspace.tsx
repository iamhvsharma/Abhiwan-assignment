import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Building2, Users, CheckSquare, Calendar, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const workspaceData = {
  id: "ws_123456",
  name: "Product Team Workspace",
  workspaceNumber: "1234",
  createdDate: "2024-01-01",
  manager: "John Doe",
  memberCount: 5,
  taskCount: 24,
  description: "Main workspace for product development and design collaboration"
}

export default function Workspace() {
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false)
  const [joinWorkspaceOpen, setJoinWorkspaceOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [joinWorkspaceNumber, setJoinWorkspaceNumber] = useState("")
  const { toast } = useToast()

  const currentUserRole = "MANAGER" // In real app, get from auth context
  const isManager = currentUserRole === "MANAGER"

  const copyWorkspaceNumber = () => {
    navigator.clipboard.writeText(workspaceData.workspaceNumber)
    toast({
      title: "Copied!",
      description: "Workspace number copied to clipboard"
    })
  }

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return

    // Handle workspace creation logic here
    console.log("Create workspace:", newWorkspaceName)
    
    toast({
      title: "Workspace created",
      description: `"${newWorkspaceName}" workspace has been created successfully`
    })

    setNewWorkspaceName("")
    setCreateWorkspaceOpen(false)
  }

  const handleJoinWorkspace = () => {
    if (!joinWorkspaceNumber.trim()) return

    // Handle join workspace logic here
    console.log("Join workspace:", joinWorkspaceNumber)
    
    toast({
      title: "Joined workspace",
      description: `Successfully joined workspace #${joinWorkspaceNumber}`
    })

    setJoinWorkspaceNumber("")
    setJoinWorkspaceOpen(false)
  }

  return (
    <Layout userRole={currentUserRole} userName="John Doe">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
            <p className="text-muted-foreground">
              Manage your workspace settings and information
            </p>
          </div>
          
          <div className="flex gap-2">
            {isManager ? (
              <Dialog open={createWorkspaceOpen} onOpenChange={setCreateWorkspaceOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Workspace
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Workspace</DialogTitle>
                    <DialogDescription>
                      Create a new workspace for your team
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="workspaceName">Workspace Name</Label>
                      <Input
                        id="workspaceName"
                        placeholder="Enter workspace name..."
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                      />
                    </div>
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
                        Create Workspace
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={joinWorkspaceOpen} onOpenChange={setJoinWorkspaceOpen}>
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
                      Enter the workspace number to join an existing workspace
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="workspaceNumber">Workspace Number</Label>
                      <Input
                        id="workspaceNumber"
                        placeholder="Enter workspace number..."
                        value={joinWorkspaceNumber}
                        onChange={(e) => setJoinWorkspaceNumber(e.target.value)}
                      />
                    </div>
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
                        Join Workspace
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Current Workspace Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Current Workspace
            </CardTitle>
            <CardDescription>
              Information about your active workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Workspace Name</label>
                  <p className="text-lg font-medium">{workspaceData.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Workspace Number</label>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-mono font-medium">#{workspaceData.workspaceNumber}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyWorkspaceNumber}
                      className="gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Manager</label>
                  <p className="text-lg font-medium">{workspaceData.manager}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-lg font-medium">{workspaceData.createdDate}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{workspaceData.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workspace Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workspaceData.memberCount}</div>
              <p className="text-xs text-muted-foreground">
                Active collaborators
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workspaceData.taskCount}</div>
              <p className="text-xs text-muted-foreground">
                All workspace tasks
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Active</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">26</div>
              <p className="text-xs text-muted-foreground">
                Since creation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workspace Actions */}
        {isManager && (
          <Card>
            <CardHeader>
              <CardTitle>Workspace Actions</CardTitle>
              <CardDescription>
                Manage your workspace settings and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Invite Team Members</h4>
                  <p className="text-sm text-muted-foreground">
                    Share the workspace number #{workspaceData.workspaceNumber} with team members to invite them
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={copyWorkspaceNumber}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Number
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Export Workspace Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download all tasks and team data as CSV
                  </p>
                </div>
                <Button variant="outline">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}