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
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import SessionCard from "../components/SessionCard";
import { supabase } from "../lib/supabase";
import { curriculumData } from "../lib/curriculum";

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

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "roadmap"
  const [expandedWeek, setExpandedWeek] = useState(5); // Default to week 5 (Current class)
  
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
        <div className="flex gap-4 border-b border-gray-200/60 pb-4 mb-8">
          <Button 
            onClick={() => setActiveTab("dashboard")}
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold ${activeTab === "dashboard" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <BarChart3 size={18} className="mr-2" /> Performance Dashboard
          </Button>
          <Button 
            onClick={() => setActiveTab("roadmap")}
            variant={activeTab === "roadmap" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold ${activeTab === "roadmap" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Map size={18} className="mr-2" /> Curriculum Roadmap
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
            {activeTab === "dashboard" ? (
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
            ) : (
              <div className="space-y-6">
                <Card className="border-none shadow-sm rounded-[2rem] bg-white p-8">
                  <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-2xl font-bold">24-Week Tutor Action Syllabus</CardTitle>
                    <CardDescription className="text-gray-400">View complete structural guidelines, icebreaker prompts, vocabulary cards, and configure student meeting links.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {curriculumData.map((week) => {
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
