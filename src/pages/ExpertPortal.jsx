import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  Award, 
  BarChart3,
  Users,
  Settings,
  Bell,
  Play,
  GraduationCap,
  ArrowUpRight,
  ChevronDown,
  Map,
  Video,
  ExternalLink,
  MessageSquare,
  Link2,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import SessionCard from "../components/SessionCard";
import { supabase } from "../lib/supabase";
import { curriculumData, getLocalizedCurriculum } from "../lib/curriculum";
import { evaluateHomeworkWithAI } from "../lib/aiEvaluationService";

export default function ExpertPortal() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Stats, 2: Verification
  const [isVerified, setIsVerified] = useState(false);
  const [safetyAgreed, setSafetyAgreed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [activeLearnersCount, setActiveLearnersCount] = useState(12);
  const [totalSessionsCount, setTotalSessionsCount] = useState(142);
  const [earningsAmount, setEarningsAmount] = useState(850);

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "roadmap", or "admin-users"
  
  // Admin User Manager States
  const [allUsers, setAllUsers] = useState([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editPlan, setEditPlan] = useState("");
  const [editLevel, setEditLevel] = useState("");

  const fetchAllUsers = async () => {
    setIsAdminLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setAllUsers(data);
      }
    } catch (err) {
      console.error("Error fetching registered users:", err);
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleUpdateUserProfile = async (userId) => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_plan: editPlan,
          current_level: editLevel
        })
        .eq("id", userId);
      
      if (!error) {
        alert("Success! User plan and level updated. They can now access their online campus instantly.");
        setSelectedUser(null);
        fetchAllUsers(); // Reload list
      } else {
        alert("Failed to update profile: " + error.message);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    }
  };
  const [expandedWeek, setExpandedWeek] = useState(5); // Default to week 5 (Current class)
  const [targetLanguage, setTargetLanguage] = useState("English");
  const activeCurriculum = getLocalizedCurriculum(targetLanguage);
  
  // AI Grading States
  const [submissionTexts, setSubmissionTexts] = useState({});
  const [gradingResults, setGradingResults] = useState({});
  const [isGradingMap, setIsGradingMap] = useState({});

  const handleGradeSubmission = async (weekId, weekTitle) => {
    const text = submissionTexts[weekId] || "";
    if (!text.trim()) {
      alert("Please paste or type the student's submission text to evaluate!");
      return;
    }

    setIsGradingMap(prev => ({ ...prev, [weekId]: true }));
    try {
      const res = await evaluateHomeworkWithAI(text, weekTitle, weekId);
      setGradingResults(prev => ({ ...prev, [weekId]: res }));
    } catch (err) {
      console.error(err);
      alert("AI Evaluation failed to execute: " + err.message);
    } finally {
      setIsGradingMap(prev => ({ ...prev, [weekId]: false }));
    }
  };

  const handleFillSampleText = (weekId, type) => {
    let sample = "";
    if (type === "good") {
      sample = "Throughout my corporate career, navigating professional boundaries during presentations has always been a key focus. To make my presentations masterfully logical, I structure a strong hook at the start, followed by data-driven evidence supporting my core arguments. Consequently, this keeps stakeholders highly engaged and mitigates confusion. In my next session, I plan to outline direct executive communication lines clearly.";
    } else {
      sample = "i want to learn presentation. it was good. i did slides. thank you.";
    }
    setSubmissionTexts(prev => ({ ...prev, [weekId]: sample }));
  };
  
  // Custom links saved in localStorage to represent real-time updates to meeting options
  const [tutorLinks, setTutorLinks] = useState(() => {
    const saved = localStorage.getItem("fluentpath_tutor_links");
    return saved ? JSON.parse(saved) : {};
  });

  const saveTutorLink = (weekId, platform, link) => {
    const updated = {
      ...tutorLinks,
      [weekId]: {
        ...(tutorLinks[weekId] || {}),
        [platform]: link
      }
    };
    setTutorLinks(updated);
    localStorage.setItem("fluentpath_tutor_links", JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchExpertData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        // Query bookings
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*, tutors(*)")
          .eq("status", "upcoming")
          .order("id", { ascending: true });

        if (bookingsData && bookingsData.length > 0) {
          const formatted = bookingsData.map((b, idx) => ({
            name: `Learner #${idx + 1}`,
            topic: b.topic,
            time: b.scheduled_time,
            imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Learner${idx}`
          }));
          setUpcomingSessions(formatted);

          const uniqueLearners = new Set(bookingsData.map(b => b.learner_id));
          setActiveLearnersCount(uniqueLearners.size);
          setTotalSessionsCount(142 + bookingsData.length);
          setEarningsAmount(850 + (bookingsData.length * 35));
        } else {
          // Fallback to beautiful static sessions
          setUpcomingSessions([
            { name: "Alex Johnson", topic: "IELTS Prep", time: "Today @ 4:00 PM", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
            { name: "Maria Garcia", topic: "Conversational", time: "Tomorrow @ 9:00 AM", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
            { name: "Kevin Lee", topic: "Business English", time: "Tomorrow @ 11:30 AM", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin" },
          ]);
        }
      } catch (err) {
        console.error("Error fetching expert data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpertData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "admin-users") {
      fetchAllUsers();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium font-display uppercase tracking-widest text-xs">Loading Expert Center...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Active Learners", value: activeLearnersCount.toString(), icon: Users, color: "text-blue-500" },
    { label: "Completion Rate", value: "98%", icon: CheckCircle, color: "text-emerald-500" },
    { label: "Total Sessions", value: totalSessionsCount.toString(), icon: Clock, color: "text-orange-500" },
    { label: "Reputation Score", value: "4.9/5", icon: Award, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-display font-extrabold tracking-tight">Expert Command Center</h1>
            <p className="text-gray-500 mt-2">Manage your qualifications, learners, and platform performance.</p>
          </div>
          <div className="flex gap-3 hidden sm:flex">
            <Link to="/guide">
              <Button variant="outline" className="rounded-xl border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold">
                <Play size={18} className="mr-2" /> ClassIn Guide
              </Button>
            </Link>
            <Button variant="outline" className="rounded-xl border-gray-200">
              <Bell size={18} className="mr-2" /> Notifications
            </Button>
            <Button variant="outline" className="rounded-xl border-gray-200">
              <Settings size={18} className="mr-2" /> Settings
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200/60 pb-4 mb-8 overflow-x-auto">
          <Button 
            onClick={() => setActiveTab("dashboard")}
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold shrink-0 ${activeTab === "dashboard" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <BarChart3 size={18} className="mr-2" /> Performance Dashboard
          </Button>
          <Button 
            onClick={() => setActiveTab("roadmap")}
            variant={activeTab === "roadmap" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold shrink-0 ${activeTab === "roadmap" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Map size={18} className="mr-2" /> Curriculum Roadmap
          </Button>
          <Button 
            onClick={() => setActiveTab("admin-users")}
            variant={activeTab === "admin-users" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold shrink-0 ${activeTab === "admin-users" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Users size={18} className="mr-2" /> 👥 Admin User Manager
          </Button>
        </div>

        {!isVerified && step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-600 rounded-3xl p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-200"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Verification Required</h3>
                <p className="text-blue-100 mt-1 max-w-md">Your credentials are pending manual review. Complete the submission to unlock all features.</p>
              </div>
            </div>
            <Button 
              onClick={() => setStep(2)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-2xl font-bold h-14"
            >
              Submit Credentials
            </Button>
          </motion.div>
        )}

        {step === 1 ? (
          <>
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                            <stat.icon size={24} />
                          </div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live</span>
                        </div>
                        <h4 className="text-3xl font-extrabold tracking-tight">{stat.value}</h4>
                        <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                      <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-bold">Upcoming Sessions</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 pt-0">
                        <div className="space-y-4">
                          {upcomingSessions.map((session, i) => (
                            <SessionCard key={i} {...session} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Earnings / Payouts */}
                    <Card className="border-none shadow-sm rounded-3xl bg-white p-2">
                      <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-xl font-bold flex items-center justify-between">
                          Earnings 
                          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Stripe Connect</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        <div className="flex items-end gap-2 mb-6">
                          <h3 className="text-4xl font-extrabold tracking-tight">${earningsAmount.toFixed(2)}</h3>
                          <span className="text-gray-400 font-bold mb-1">/ May</span>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Available to Payout</span>
                            <span className="text-gray-900">${(earningsAmount * 0.4).toFixed(2)}</span>
                          </div>
                          <Button 
                            onClick={() => alert("Future: Routes to Stripe Express Dashboard for instant payouts")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold group"
                          >
                            Withdraw to Bank <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-3xl bg-black text-white p-2">
                      <CardHeader className="p-6">
                        <CardTitle className="text-xl">Platform Signal</CardTitle>
                        <CardDescription className="text-gray-400">Real-time learner demand in your niche.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-300">IELTS Intensive</span>
                            <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded">HIGH DEMAND</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-300">Interview Coaching</span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">STABLE</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 rounded-xl h-12 font-bold">Launch Outreach</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {activeTab === "roadmap" && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm rounded-[2rem] bg-white p-8">
                  <CardHeader className="p-0 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold">24-Week Tutor Action Syllabus</CardTitle>
                      <CardDescription className="text-gray-400">View complete structural guidelines, icebreaker prompts, vocabulary cards, and configure student meeting links.</CardDescription>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">Active Track:</span>
                      <select 
                        value={targetLanguage} 
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="English">🇬🇧 English Track</option>
                        <option value="Spanish">🇪🇸 Spanish Track</option>
                        <option value="French">🇫🇷 French Track</option>
                        <option value="Japanese">🇯🇵 Japanese Track</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {activeCurriculum.map((week) => {
                        const isCurrent = week.id === 5;
                        const isExpanded = expandedWeek === week.id;
                        const currentLinks = tutorLinks[week.id] || {};

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
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-sm">
                                  {week.id}
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{week.module}</span>
                                  <h4 className="text-lg font-bold text-gray-900 mt-0.5">{week.title}</h4>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                  {isCurrent ? "Active Niche" : "Syllabus Plan"}
                                </span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </div>

                            {isExpanded && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-6 pt-6 border-t border-gray-100 space-y-6"
                              >
                                {/* Icebreakers */}
                                <div>
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Class Icebreakers (Warm-up)</h5>
                                  <div className="space-y-2">
                                    {week.tutorGuide.icebreakers.map((question, i) => (
                                      <p key={i} className="text-sm font-semibold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        💡 "{question}"
                                      </p>
                                    ))}
                                  </div>
                                </div>

                                {/* Key Vocabulary */}
                                <div>
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Key Vocabulary & Phrasing</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {week.tutorGuide.vocabulary.map((vocab, i) => (
                                      <span key={i} className="text-xs font-extrabold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                                        {vocab}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Minute-by-Minute Breakdown */}
                                <div>
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Minute-by-Minute Activity Blueprint</h5>
                                  <div className="space-y-2.5">
                                    {week.tutorGuide.activities.map((act, i) => (
                                      <div key={i} className="flex gap-4 items-start text-sm">
                                        <span className="font-extrabold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded text-xs shrink-0">{act.time}</span>
                                        <p className="text-gray-600 font-medium">{act.desc}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Evaluation Criteria */}
                                <div className="bg-gray-50/60 p-4 rounded-xl">
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Grading & Evaluation Guide</h5>
                                  <p className="text-sm text-gray-700 font-semibold">{week.tutorGuide.evaluation}</p>
                                </div>

                                {/* AI Homework Grading Assistant */}
                                <div className="border-t border-gray-100 pt-6 space-y-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                      <Award size={18} />
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-bold text-gray-900">🤖 AI Homework Grading Assistant</h5>
                                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">CEFR-aligned Automated Assessment Engine</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                    {/* Input Console */}
                                    <div className="md:col-span-2 space-y-3">
                                      <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Homework Submission</label>
                                        <div className="flex gap-2">
                                          <button 
                                            onClick={() => handleFillSampleText(week.id, "good")}
                                            className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-bold hover:bg-emerald-100 transition-colors"
                                          >
                                            ⚡ Inject Good Sample
                                          </button>
                                          <button 
                                            onClick={() => handleFillSampleText(week.id, "bad")}
                                            className="text-[10px] bg-rose-50 text-rose-700 px-2 py-1 rounded-md font-bold hover:bg-rose-100 transition-colors"
                                          >
                                            ⚡ Inject Weak Sample
                                          </button>
                                        </div>
                                      </div>
                                      <textarea 
                                        rows={4}
                                        placeholder="Paste student submission text here or click 'Inject Sample' to try it instantly..."
                                        value={submissionTexts[week.id] || ""}
                                        onChange={(e) => setSubmissionTexts(prev => ({ ...prev, [week.id]: e.target.value }))}
                                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-indigo-500 font-medium text-gray-700 resize-none"
                                      />
                                      <Button 
                                        onClick={() => handleGradeSubmission(week.id, week.title)}
                                        disabled={isGradingMap[week.id]}
                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10"
                                      >
                                        {isGradingMap[week.id] ? (
                                          <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin animate-spin" />
                                            Analyzing Grammar & Vocab...
                                          </>
                                        ) : (
                                          <>
                                            🤖 Auto-Grade with AI
                                          </>
                                        )}
                                      </Button>
                                    </div>

                                    {/* Output Console */}
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 min-h-[16rem] flex flex-col justify-between">
                                      {gradingResults[week.id] ? (
                                        <div className="space-y-4">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CEFR Rank</p>
                                              <span className="inline-block mt-1 text-xs font-extrabold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md">
                                                {gradingResults[week.id].vocabularyBadge}
                                              </span>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overall Score</p>
                                              <p className="text-3xl font-black text-emerald-600">{gradingResults[week.id].score}%</p>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                              <span>Grammar Precision</span>
                                              <span>{gradingResults[week.id].feedback.rubricScores.grammar}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${gradingResults[week.id].feedback.rubricScores.grammar}%` }} />
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-gray-500 mt-1">
                                              <span>Vocabulary Range</span>
                                              <span>{gradingResults[week.id].feedback.rubricScores.vocabulary}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${gradingResults[week.id].feedback.rubricScores.vocabulary}%` }} />
                                            </div>
                                          </div>

                                          <div className="pt-2 border-t border-gray-200/60">
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-1">Key Strength</p>
                                            <p className="text-[11px] font-semibold text-gray-600 leading-tight">
                                              ✅ {gradingResults[week.id].feedback.strengths[0]}
                                            </p>
                                          </div>
                                          <div className="pt-2 border-t border-gray-200/60">
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500 mb-1">Top Recommendation</p>
                                            <p className="text-[11px] font-semibold text-gray-600 leading-tight">
                                              ⚠️ {gradingResults[week.id].feedback.suggestions[0]}
                                            </p>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                                          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 mb-3 animate-pulse">
                                            🤖
                                          </div>
                                          <p className="text-xs font-bold text-gray-700">Awaiting submission...</p>
                                          <p className="text-[10px] text-gray-400 mt-1 max-w-[12rem] mx-auto leading-relaxed">
                                            Paste homework or inject a sample on the left to activate AI grading.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Live Class Link Configurator */}
                                <div className="border-t border-gray-100 pt-6">
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Set/Update Session Platform Links</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <Video size={10} className="text-blue-500" /> Google Meet Link
                                      </label>
                                      <input 
                                        type="text" 
                                        placeholder="https://meet.google.com/..." 
                                        value={currentLinks.googleMeet || ""}
                                        onChange={(e) => saveTutorLink(week.id, "googleMeet", e.target.value)}
                                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-700"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <ExternalLink size={10} className="text-indigo-500" /> Zoom Link
                                      </label>
                                      <input 
                                        type="text" 
                                        placeholder="https://zoom.us/j/..." 
                                        value={currentLinks.zoom || ""}
                                        onChange={(e) => saveTutorLink(week.id, "zoom", e.target.value)}
                                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-700"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <MessageSquare size={10} className="text-emerald-500" /> WhatsApp Contact
                                      </label>
                                      <input 
                                        type="text" 
                                        placeholder="+27..." 
                                        value={currentLinks.whatsApp || ""}
                                        onChange={(e) => saveTutorLink(week.id, "whatsApp", e.target.value)}
                                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black font-semibold text-gray-700"
                                      />
                                    </div>
                                  </div>
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

            {activeTab === "admin-users" && (
              <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    👥 Admin Student Activation Center
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-semibold mt-1">
                    Manage registered student profiles, verify their payments, set target curriculum levels, and manually activate their interactive learning campus.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="flex justify-end mb-4">
                    <Button 
                      onClick={fetchAllUsers}
                      disabled={isAdminLoading}
                      className="bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold h-10 px-4"
                    >
                      {isAdminLoading ? "Reloading..." : "🔄 Refresh Student Accounts"}
                    </Button>
                  </div>

                  {isAdminLoading ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-gray-400 font-bold mt-3">Fetching accounts from Supabase...</p>
                    </div>
                  ) : allUsers.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase tracking-widest text-[9px]">
                            <th className="p-4">Email</th>
                            <th className="p-4">Active Plan</th>
                            <th className="p-4">Current Level</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                          {allUsers.map((u) => {
                            const hasPlan = u.subscription_plan && u.subscription_plan !== "inactive" && u.subscription_plan !== "free";
                            return (
                              <tr key={u.id} className="hover:bg-gray-50/50">
                                <td className="p-4 font-bold text-gray-900">{u.email}</td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${hasPlan ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                    {u.subscription_plan || "inactive"}
                                  </span>
                                </td>
                                <td className="p-4 font-extrabold text-blue-600">{u.current_level || "Not Assigned"}</td>
                                <td className="p-4 text-right">
                                  <Button 
                                    onClick={() => {
                                      setSelectedUser(u);
                                      setEditPlan(u.subscription_plan || "inactive");
                                      setEditLevel(u.current_level || "B2");
                                    }}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-extrabold h-8 px-3"
                                  >
                                    ✏️ Edit & Activate
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 p-6">
                      <p className="text-gray-400 font-medium">No registered students found in database.</p>
                    </div>
                  )}

                  {/* Edit Activation Modal */}
                  {selectedUser && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full border border-gray-100 space-y-6"
                      >
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Activate Student Account</h4>
                          <p className="text-xs text-gray-400 font-semibold mt-1">Updates profile in real-time. Student can access campus on refresh.</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 text-xs font-semibold text-gray-600 space-y-1">
                          <p>👤 <span className="text-gray-400">Account:</span> <span className="text-gray-900 font-bold">{selectedUser.email}</span></p>
                          <p>🆔 <span className="text-gray-400">User ID:</span> {selectedUser.id}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Program Plan</label>
                            <select 
                              value={editPlan}
                              onChange={(e) => setEditPlan(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
                            >
                              <option value="inactive">🚫 Campus Inactive (None)</option>
                              <option value="Launchpad">🚀 Launchpad Plan ($45 / session)</option>
                              <option value="Professional">💼 Professional Plan ($160 / month)</option>
                              <option value="Accelerator">⚡ Accelerator Plan ($290 / month)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assign Curriculum Level</label>
                            <input 
                              type="text" 
                              value={editLevel}
                              onChange={(e) => setEditLevel(e.target.value)}
                              placeholder="e.g. B2, B2+, C1, A2"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={() => setSelectedUser(null)}
                            variant="outline"
                            className="flex-1 rounded-xl h-11 text-xs font-bold border-gray-100"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => handleUpdateUserProfile(selectedUser.id)}
                            className="flex-1 rounded-xl h-11 text-xs font-bold bg-black text-white hover:bg-gray-800"
                          >
                            Save & Activate Campus
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[2.5rem]">
              <CardHeader className="p-10 pb-0">
                <div className="flex justify-between items-center mb-6">
                   <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-400">← Back to Dashboard</Button>
                   <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Manual Review</span>
                </div>
                <CardTitle className="text-3xl font-display font-extrabold mb-2">Credential Submission</CardTitle>
                <CardDescription className="text-lg">Upload your professional qualifications for manual review by our team.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Type of Qualification</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center gap-3 p-4 rounded-2xl border-2 border-blue-600 bg-blue-50 text-blue-700 font-bold text-left">
                      <FileText size={20} /> IELTS / TOEFL
                    </button>
                    <button className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-200 bg-white text-gray-500 font-bold text-left transition-all">
                      <GraduationCap size={20} /> TEFL / TESOL
                    </button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                    <Upload size={32} />
                  </div>
                  <h4 className="font-bold text-xl mb-1">Upload PDF or Image</h4>
                  <p className="text-gray-400">Drag and drop your certificate here, or click to browse files.</p>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl flex items-start gap-4 border border-blue-100">
                  <input 
                    type="checkbox" 
                    id="safety-check" 
                    className="mt-1.5 w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    checked={safetyAgreed}
                    onChange={(e) => setSafetyAgreed(e.target.checked)}
                  />
                  <div>
                    <label htmlFor="safety-check" className="font-bold text-gray-900 cursor-pointer select-none">
                      I confirm the Mandatory Child Safety Declaration
                    </label>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                      By checking this, I legally confirm I have no history of child abuse, violent records, or safeguarding violations. <Link to="/safety" className="text-blue-600 hover:underline">Read the full policy</Link>.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl flex items-start gap-4">
                  <ShieldCheck className="text-gray-400 shrink-0 mt-1" size={20} />
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Our team will manually review your documents and safety declaration within 24-48 hours. You will receive an email once your profile is verified.
                  </p>
                </div>

                <Button 
                  onClick={() => { setIsVerified(true); setStep(1); }}
                  disabled={!safetyAgreed}
                  className="w-full h-16 rounded-2xl text-lg font-bold bg-black disabled:opacity-50"
                >
                  Submit for Review
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
}
