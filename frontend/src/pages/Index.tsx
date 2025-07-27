import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckSquare,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Smart Task Management",
    description:
      "Create, assign, and track tasks with intelligent automation and real-time collaboration",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Work together seamlessly with role-based permissions and instant communication",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Monitor project progress with detailed insights and performance metrics",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description:
      "Stay in sync with instant notifications, live updates, and seamless integration",
    color: "bg-orange-500/10 text-orange-600",
  },
];

const stats = [
  { number: "10K+", label: "Active Teams" },
  { number: "500K+", label: "Tasks Completed" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://static.wixstatic.com/media/80c3b4_149980527852400b8a6edbb44e46ac40~mv2.webp/v1/fill/w_124,h_87,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/PNG%20LOGO-5%20(1).webp"
                alt="Abhiwan Technology"
                className="h-8 w-8 object-contain filter invert"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Abhiwan</h1>
              <p className="text-xs text-muted-foreground -mt-1">Technology</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/register")} className="shadow-lg">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative container py-12 md:py-24 lg:py-36">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Star className="h-4 w-4" />
              Trusted by 10,000+ teams worldwide
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Collaborative Task
              <br />
              Management
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {" "}
                Simplified
              </span>
            </h1>

            <p className="mt-8 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
              Streamline your team's workflow with intelligent task management,
              real-time collaboration, and powerful analytics. Built for teams
              that value efficiency and results.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
                className="text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need to manage tasks effectively
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Powerful features designed for modern teams who want to achieve
              more together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="relative group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://static.wixstatic.com/media/80c3b4_149980527852400b8a6edbb44e46ac40~mv2.webp/v1/fill/w_124,h_87,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/PNG%20LOGO-5%20(1).webp"
                alt="Abhiwan Technology"
                className="h-6 w-6 object-contain filter invert"
              />
              <div>
                <p className="font-semibold text-foreground">
                  Abhiwan Technology
                </p>
                <p className="text-xs text-muted-foreground">
                  Building the future of work
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ by Harshvardhan Sharma, Github:{" "}
              <a href="https://github.com/iamhvsharma"> @iamhvsharma</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
