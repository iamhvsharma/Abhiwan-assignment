import { Layout } from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, Users, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Tasks",
    value: "24",
    description: "+3 from last week",
    icon: CheckSquare,
    color: "text-blue-600"
  },
  {
    title: "In Progress",
    value: "8",
    description: "Active tasks",
    icon: Clock,
    color: "text-yellow-600"
  },
  {
    title: "Team Members",
    value: "6",
    description: "Active collaborators",
    icon: Users,
    color: "text-green-600"
  },
  {
    title: "Completion Rate",
    value: "87%",
    description: "+5% from last month",
    icon: TrendingUp,
    color: "text-purple-600"
  }
]

const recentTasks = [
  {
    id: 1,
    title: "Update landing page design",
    status: "IN_PROGRESS",
    assignee: "Sarah Wilson",
    dueDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Fix authentication bug",
    status: "PENDING",
    assignee: "Mike Johnson",
    dueDate: "2024-01-18"
  },
  {
    id: 3,
    title: "Implement user dashboard",
    status: "COMPLETED",
    assignee: "Emily Davis",
    dueDate: "2024-01-12"
  },
  {
    id: 4,
    title: "Write API documentation",
    status: "IN_PROGRESS",
    assignee: "Alex Chen",
    dueDate: "2024-01-20"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>
    case "IN_PROGRESS":
      return <Badge variant="default" className="bg-warning text-warning-foreground">In Progress</Badge>
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function Dashboard() {
  return (
    <Layout userRole="MANAGER" userName="John Doe">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your workspace and team activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Latest task activity in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Assigned to {task.assignee}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Due {task.dueDate}
                    </span>
                    {getStatusBadge(task.status)}
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