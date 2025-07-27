import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Mail, UserPlus, UserMinus, Crown, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "MANAGER",
    avatar: "",
    joinedDate: "2024-01-01",
    tasksCompleted: 12,
    isCurrentUser: true
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "TEAM",
    avatar: "",
    joinedDate: "2024-01-05",
    tasksCompleted: 8,
    isCurrentUser: false
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "TEAM",
    avatar: "",
    joinedDate: "2024-01-08",
    tasksCompleted: 6,
    isCurrentUser: false
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "TEAM",
    avatar: "",
    joinedDate: "2024-01-10",
    tasksCompleted: 9,
    isCurrentUser: false
  },
  {
    id: 5,
    name: "Alex Chen",
    email: "alex@example.com",
    role: "TEAM",
    avatar: "",
    joinedDate: "2024-01-12",
    tasksCompleted: 4,
    isCurrentUser: false
  }
]

export default function Team() {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const { toast } = useToast()

  const currentUserRole = "MANAGER" // In real app, get from auth context
  const isManager = currentUserRole === "MANAGER"

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
  }

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return

    // Handle invite logic here
    console.log("Invite member:", inviteEmail)
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`
    })

    setInviteEmail("")
    setInviteDialogOpen(false)
  }

  const handleRemoveMember = (memberId: number, memberName: string) => {
    // Handle remove member logic here
    console.log("Remove member:", memberId)
    
    toast({
      title: "Member removed",
      description: `${memberName} has been removed from the workspace`
    })
  }

  const handleLeaveWorkspace = () => {
    // Handle leave workspace logic here
    console.log("Leave workspace")
    
    toast({
      title: "Left workspace",
      description: "You have left the workspace"
    })
  }

  return (
    <Layout userRole={currentUserRole} userName="John Doe">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground">
              Manage workspace members and permissions
            </p>
          </div>
          
          <div className="flex gap-2">
            {isManager ? (
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
                    <DialogDescription>
                      Send an invitation to join your workspace
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address..."
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setInviteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleInviteMember}
                        disabled={!inviteEmail.trim()}
                      >
                        Send Invitation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <UserMinus className="h-4 w-4" />
                    Leave Workspace
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Leave Workspace</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to leave this workspace? You will lose access to all tasks and data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleLeaveWorkspace}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Leave Workspace
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.role === "MANAGER").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.role === "TEAM").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              All members in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        {member.isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{member.email}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.tasksCompleted} tasks completed • Joined {member.joinedDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={member.role === "MANAGER" ? "default" : "secondary"}
                      className="gap-1"
                    >
                      {member.role === "MANAGER" ? (
                        <Crown className="h-3 w-3" />
                      ) : (
                        <Shield className="h-3 w-3" />
                      )}
                      {member.role}
                    </Badge>
                    
                    {isManager && !member.isCurrentUser && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <UserMinus className="h-3 w-3" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {member.name} from the workspace?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveMember(member.id, member.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove Member
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}