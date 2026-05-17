import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  History, 
  BookOpen, 
  ArrowUpRight,
  Plus,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Video,
  ChevronDown,
  Map
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import SessionCard from "../components/SessionCard";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { curriculumData } from "../lib/curriculum";

export default function LearnerPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [activities, setActivities] = useState([]);
  
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "roadmap"
  const [expandedWeek, setExpandedWeek] = useState(5); // Default expand Week 5 (Current Week)
  const [checkedWeeks, setCheckedWeeks] = useState(() => {
    const saved = localStorage.getItem("fluentpath_checked_weeks");
    return saved ? JSON.parse(saved) : { 1: true, 2: true, 3: true, 4: true }; // Pre-check foundation weeks
  });

  const toggleWeekCheck = (weekId) => {
    const updated = { ...checkedWeeks, [weekId]: !checkedWeeks[weekId] };
    setCheckedWeeks(updated);
    localStorage.setItem("fluentpath_checked_weeks", JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchPortalData = async () => {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        // 1. Fetch Profile
        let { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        // Graceful profile initialization if missing
        if (!profileData && !profileError) {
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              role: "learner",
              learning_hours: 24,
              lessons_done: 18,
              current_level: "B2+",
              subscription_plan: "Pay As You Go"
            })
            .select()
            .single();
          profileData = newProfile;
        }
        setProfile(profileData);

        // 2. Fetch Bookings (joining Tutors table)
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*, tutors(*)")
          .eq("learner_id", user.id)
          .eq("status", "upcoming")
          .order("id", { ascending: true });

        if (bookingsData) {
          const formattedSessions = bookingsData.map(b => ({
            name: b.tutors?.name || "Tutor",
            topic: b.topic,
            time: b.scheduled_time,
            imageUrl: b.tutors?.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.tutors?.name || 'Sarah'}`
          }));
          setUpcomingSessions(formattedSessions);
        }

        // 3. Fetch Learning Activity
        const { data: activityData } = await supabase
          .from("learning_activity")
          .select("*")
          .eq("learner_id", user.id)
          .order("id", { ascending: false })
          .limit(3);

        if (activityData && activityData.length > 0) {
          setActivities(activityData);
        } else {
          // Fallback static activities if table is clean
          setActivities([
            { id: 1, description: "Completed Lesson 14", metadata: "Grammar Focus", created_at: new Date(Date.now() - 86400000).toISOString() },
            { id: 2, description: "Completed Lesson 13", metadata: "Speaking Practice", created_at: new Date(Date.now() - 172800000).toISOString() },
            { id: 3, description: "Completed Lesson 12", metadata: "Vocabulary Builder", created_at: new Date(Date.now() - 259200000).toISOString() }
          ]);
        }
      } catch (err) {
        console.error("Error loading portal data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium font-display uppercase tracking-widest text-xs">Loading Portal...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Learning Hours", value: profile?.learning_hours || "0", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Lessons Done", value: profile?.lessons_done || "0", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Current Level", value: profile?.current_level || "A1", icon: Award, color: "text-orange-500", bg: "bg-orange-50" },
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

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200/60 pb-4 mb-8">
          <Button 
            onClick={() => setActiveTab("dashboard")}
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold ${activeTab === "dashboard" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <LayoutDashboard size={18} className="mr-2" /> Dashboard
          </Button>
          <Button 
            onClick={() => setActiveTab("roadmap")}
            variant={activeTab === "roadmap" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold ${activeTab === "roadmap" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Map size={18} className="mr-2" /> 24-Week Roadmap
          </Button>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "dashboard" ? (
              <>
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-bold">Upcoming Sessions</CardTitle>
                      <Button variant="ghost" className="text-sm font-bold text-blue-600 hover:bg-blue-50">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="space-y-4">
                      {upcomingSessions.length > 0 ? (
                        upcomingSessions.map((session, i) => (
                          <SessionCard key={i} {...session} />
                        ))
                      ) : (
                        <div className="text-center py-12 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-6">
                          <p className="text-gray-400 font-medium mb-4">No sessions scheduled yet.</p>
                          <Link to="/booking">
                            <Button className="rounded-xl h-11 bg-black text-white hover:bg-gray-800 font-bold">
                              Book Your First Session
                            </Button>
                          </Link>
                        </div>
                      )}
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
              </>
            ) : (
              <div className="space-y-6">
                <Card className="border-none shadow-sm rounded-[2rem] bg-white p-8">
                  <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-2xl font-bold">24-Week Interactive Curriculum Roadmap</CardTitle>
                    <CardDescription className="text-gray-400">Track your structural milestones, submit weekly homework deliverables, and launch classes directly.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {curriculumData.map((week) => {
                        const isCurrent = week.id === 5;
                        const isCompleted = checkedWeeks[week.id] || week.id < 5;
                        const isExpanded = expandedWeek === week.id;

                        return (
                          <div 
                            key={week.id} 
                            className={`border rounded-2xl p-5 transition-all duration-300 ${isCurrent ? 'border-blue-500 bg-blue-50/10' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div 
                              onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                              className="flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWeekCheck(week.id);
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-black'}`}
                                >
                                  {isCompleted && <CheckCircle2 size={16} className="fill-current text-white" />}
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{week.module}</span>
                                  <h4 className="text-lg font-bold text-gray-900 mt-0.5">Week {week.id}: {week.title}</h4>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${isCurrent ? 'bg-blue-100 text-blue-700' : isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                                  {isCurrent ? "Current" : isCompleted ? "Completed" : "Upcoming"}
                                </span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </div>

                            {isExpanded && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-6 pt-6 border-t border-gray-100 space-y-4"
                              >
                                <div>
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Learning Objectives</h5>
                                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1.5">
                                    {week.objectives.map((obj, i) => (
                                      <li key={i}>{obj}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-gray-50/60 p-4 rounded-xl">
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Homework Deliverable</h5>
                                  <p className="text-sm text-gray-700 font-medium">{week.deliverable}</p>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">
                                  <a 
                                    href="https://meet.google.com" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-xs font-bold bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl transition-all"
                                  >
                                    <Video size={14} className="text-blue-500" /> Google Meet
                                  </a>
                                  <a 
                                    href="https://zoom.us" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-xs font-bold bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl transition-all"
                                  >
                                    <ExternalLink size={14} className="text-indigo-500" /> Zoom Meeting
                                  </a>
                                  <a 
                                    href="https://wa.me" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-xs font-bold bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl transition-all"
                                  >
                                    <MessageSquare size={14} className="text-emerald-500" /> WhatsApp Call
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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
                  <p className="font-bold text-gray-900 text-lg">{profile?.subscription_plan || "Pay As You Go"}</p>
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
                  {activities.map((activity, idx) => {
                    const timeLabel = new Date(activity.created_at).toLocaleDateString() === new Date().toLocaleDateString()
                      ? "Today"
                      : "Recently";
                    return (
                      <div key={activity.id || idx} className="flex gap-4">
                        <div className="w-1.5 h-12 bg-blue-50 rounded-full relative overflow-hidden shrink-0">
                          <div className={`absolute top-0 w-full bg-blue-500 rounded-full ${idx === 0 ? 'h-full' : 'h-1/2'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{timeLabel} • {activity.metadata || "General English"}</p>
                        </div>
                      </div>
                    );
                  })}
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
