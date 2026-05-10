import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  History, 
  BookOpen, 
  ArrowUpRight,
  Plus,
  Clock,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import SessionCard from "../components/SessionCard";
import { Link } from "react-router-dom";

export default function LearnerPortal() {
  const upcomingSessions = [
    { name: "Sarah Williams", topic: "IELTS Speaking", time: "Tomorrow @ 10:00 AM", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { name: "James Miller", topic: "Business English", time: "Wed, May 5 @ 4:00 PM", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
  ];

  const stats = [
    { label: "Learning Hours", value: "24", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Lessons Done", value: "18", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Current Level", value: "B2+", icon: Award, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display font-extrabold tracking-tight">Your Learning Path</h1>
            <p className="text-gray-500 mt-2">Welcome back! Ready to master more English today?</p>
          </div>
          <Link to="/booking">
            <Button className="rounded-2xl bg-black hover:bg-gray-800 h-14 px-8 font-bold shadow-xl shadow-black/10">
              <Plus size={20} className="mr-2" /> Book New Session
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                    +12% <ArrowUpRight size={14} />
                  </div>
                </div>
                <h4 className="text-3xl font-extrabold tracking-tight">{stat.value}</h4>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Upcoming Sessions */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Upcoming Sessions</CardTitle>
                  <Button variant="ghost" className="text-sm font-bold text-blue-600 hover:bg-blue-50">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-4">
                  {upcomingSessions.map((session, i) => (
                    <SessionCard key={i} {...session} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations or Next Steps */}
            <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <h3 className="text-3xl font-display font-extrabold mb-4">Master IELTS Speaking</h3>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  Get targeted practice with our specialized exam experts to boost your score by 1.5+ bands.
                </p>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-2xl h-14 px-8 font-bold">
                  Start Specialization
                </Button>
              </div>
              <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
          
          {/* Sidebar: Activity/Progress */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl bg-white">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="text-gray-400" /> Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="bg-gray-50 p-4 rounded-2xl mb-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Current Plan</p>
                  <p className="font-bold text-gray-900 text-lg">Pay As You Go</p>
                </div>
                <Button 
                  onClick={() => alert("Future: Routes to Stripe Customer Portal")}
                  variant="outline" 
                  className="w-full rounded-xl h-12 font-bold border-gray-100 group"
                >
                  Manage Billing (Stripe) <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-white p-2">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold">Learning Activity</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-1.5 h-12 bg-blue-50 rounded-full relative overflow-hidden shrink-0">
                        <div className={`absolute top-0 w-full bg-blue-500 rounded-full ${i === 1 ? 'h-full' : 'h-1/2'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Completed Lesson {12+i}</p>
                        <p className="text-xs text-gray-400 mt-1">2 days ago • Grammar Focus</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-8 rounded-xl h-12 font-bold border-gray-100">
                  Full History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
