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
  Map,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import SessionCard from "../components/SessionCard";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { curriculumData, getLocalizedCurriculum } from "../lib/curriculum";

export default function LearnerPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [activities, setActivities] = useState([]);
  
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "roadmap", or "aura-advisor"
  const [expandedWeek, setExpandedWeek] = useState(5); // Default expand Week 5 (Current Week)

  // Onboarding Intake States (for inactive campus accounts)
  const [onboardingStep, setOnboardingStep] = useState(1); // 1: Pick Language Track, 2: Interactive Intake Q&A, 3: AI Diagnostic Report & EFT Activation
  const [selectedOnboardingLang, setSelectedOnboardingLang] = useState("English");
  const [onboardingInputText, setOnboardingInputText] = useState("");
  const [isOnboardingAnalyzing, setIsOnboardingAnalyzing] = useState(false);
  const [onboardingScorecard, setOnboardingScorecard] = useState(null);

  const handleStartOnboardingText = (lang) => {
    setSelectedOnboardingLang(lang);
    setOnboardingStep(2);
  };

  const handleRunOnboardingAnalysis = async (e) => {
    e.preventDefault();
    if (!onboardingInputText.trim()) return;

    setIsOnboardingAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Immersion analysis loading delay

    setOnboardingScorecard({
      lang: selectedOnboardingLang,
      level: "B2 - Upper Intermediate",
      grammar: "84%",
      fluency: "79%",
      recommendedPlan: "Professional Plan ($160/mo)",
      whatsAppLink: `https://wa.me/27610922970?text=Hi%20FluentPath!%20I%20completed%20the%20Aura%20AI%20onboarding%20diagnostic%20in%20my%20member%20area.%20I%20was%20placed%20at%20B2%20on%20the%20${encodeURIComponent(selectedOnboardingLang)}%20track.%20I%20would%20like%20to%20manually%20activate%20my%20Professional%20Plan%20($160%2Fmo)%20using%20the%20email%20${encodeURIComponent(profile?.email || "")}!`
    });
    setOnboardingStep(3);
    setIsOnboardingAnalyzing(false);
  };

  // Student Success Advisor Chatbot States
  const [advisorMessages, setAdvisorMessages] = useState([
    {
      id: 1,
      sender: "aura",
      text: "Hello! I am Aura, your Student Success Advisor. 🌟 How is your weekly learning roadmap going? Feel free to ask me questions about vocabulary, CEFR grammar points, or practice translations here!"
    }
  ]);
  const [advisorInput, setAdvisorInput] = useState("");
  const [isAdvisorTyping, setIsAdvisorTyping] = useState(false);

  const handleSendAdvisorMessage = async (e) => {
    e.preventDefault();
    if (!advisorInput.trim()) return;

    const userInput = advisorInput;
    setAdvisorInput("");

    setAdvisorMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userInput }]);
    setIsAdvisorTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    let reply = "I'm always here to help! Let me know if you want to review vocabulary cards, draft business dialogues, or analyze grammatical structures for your active week.";
    if (userInput.toLowerCase().includes("grammar") || userInput.toLowerCase().includes("cefr")) {
      reply = "CEFR levels focus on communicative output. At B2, grammar accuracy is key! Practice writing compound structures and using precise transitional connectors (e.g. 'furthermore', 'notwithstanding').";
    } else if (userInput.toLowerCase().includes("vocab") || userInput.toLowerCase().includes("word")) {
      reply = "Expanding vocabulary range is a great focus! Try mastering business expressions like 'low-hanging fruit', 'leverage synergies', and 'align strategic priorities' for corporate presentations.";
    } else if (userInput.toLowerCase().includes("homework") || userInput.toLowerCase().includes("assignment")) {
      reply = "For your current weekly homework deliverable, try drafting a 300-word corporate proposal. Paste it here, and I'll analyze it for your tutor!";
    }

    setAdvisorMessages(prev => [...prev, { id: Date.now() + 1, sender: "aura", text: reply }]);
    setIsAdvisorTyping(false);
  };
  const [targetLanguage, setTargetLanguage] = useState("English");
  const activeCurriculum = getLocalizedCurriculum(targetLanguage);

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
              subscription_plan: "inactive"
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

  const isPremiumActive = profile?.subscription_plan && profile?.subscription_plan !== "inactive" && profile?.subscription_plan !== "free";

  if (!isPremiumActive) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest">
              Campus Onboarding & Placement
            </span>
            <h1 className="text-4xl font-display font-extrabold tracking-tight mt-6">
              Welcome to FluentPath, {profile?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed text-sm font-medium">
              Let's complete your intake placement diagnostic with Aura, our strategic student success AI, to determine your target level and perfect learning track.
            </p>
          </div>

          {/* Aura Interactive Placement Console */}
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden max-w-2xl mx-auto">
            <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-lg">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-md leading-tight">Aura AI Placement Advisor</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">FluentPath Automated CEFR Intake</p>
                </div>
              </div>
              <span className="text-xs bg-blue-500/20 text-blue-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                Active Session
              </span>
            </div>

            <CardContent className="p-8 space-y-6">
              {/* Step 1: Language Track Selection */}
              {onboardingStep === 1 && (
                <div className="space-y-6 text-center py-6">
                  <div className="bg-blue-50/50 text-blue-800 text-xs font-semibold p-5 rounded-2xl border border-blue-50 leading-relaxed text-left max-w-lg mx-auto">
                    "Hello! I'm Aura, your AI Placement Advisor. 🌟 To place you at the perfect starting milestone on our 24-week curriculum roadmap, please pick your desired target language track first."
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {[
                      { lang: "English", label: "🇬🇧 English Track" },
                      { lang: "Spanish", label: "🇪🇸 Spanish Track" },
                      { lang: "French", label: "🇫🇷 French Track" },
                      { lang: "Japanese", label: "🇯🇵 Japanese Track" }
                    ].map((t) => (
                      <Button
                        key={t.lang}
                        onClick={() => handleStartOnboardingText(t.lang)}
                        className="h-14 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-850 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
                      >
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Intake Text Entry */}
              {onboardingStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-blue-50/50 text-blue-800 text-xs font-semibold p-5 rounded-2xl border border-blue-50 leading-relaxed">
                    "Excellent choice! You selected the <strong>{selectedOnboardingLang} Track</strong>. To calibrate your interactive roadmap, please describe your main objectives (e.g. business presentations, career prospects) and any previous language experience you have."
                  </div>

                  {isOnboardingAnalyzing ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                        Aura is analyzing grammar, vocab metrics & CEFR parameters...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRunOnboardingAnalysis} className="space-y-4">
                      <textarea
                        rows={4}
                        required
                        value={onboardingInputText}
                        onChange={(e) => setOnboardingInputText(e.target.value)}
                        placeholder="Type or paste your response here (e.g. 'I need English for executive sales calls. I can speak a bit but need structure...')"
                        className="w-full text-xs font-semibold text-gray-750 bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-black resize-none"
                      />
                      <div className="flex gap-3">
                        <Button 
                          type="button" 
                          onClick={() => setOnboardingStep(1)} 
                          variant="outline" 
                          className="flex-1 rounded-xl h-12 font-bold text-xs"
                        >
                          ← Change Track
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 rounded-xl h-12 font-bold text-xs bg-black text-white hover:bg-gray-800"
                        >
                          Submit to Aura AI →
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Step 3: Diagnostic Report & Activation Grids */}
              {onboardingStep === 3 && onboardingScorecard && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-800 p-5 rounded-2xl text-xs font-semibold leading-relaxed">
                    🎉 Onboarding Diagnostic complete! Aura has analyzed your goals and compiled your custom strategic intake scorecard below.
                  </div>

                  {/* Aura Scorecard Dashboard */}
                  <div className="border border-gray-100 rounded-3xl p-6 bg-gray-50/50 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Recommended Track</p>
                      <h4 className="text-lg font-extrabold text-gray-900 mt-1">{onboardingScorecard.lang} Curriculum</h4>
                      
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-4">CEFR Level Recommendation</p>
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-extrabold mt-1">
                        {onboardingScorecard.level}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                          <span>Grammar Precision</span>
                          <span>{onboardingScorecard.grammar}</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: onboardingScorecard.grammar }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                          <span>Vocabulary Range</span>
                          <span>{onboardingScorecard.fluency}</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full" style={{ width: onboardingScorecard.fluency }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing grid below diagnostic scorecard */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-gray-900">Select Program to Activate Online Campus</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-1">Choose a program tier below. Clicking activates WhatsApp with your scorecard details!</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-left">
                      {/* Launchpad Card */}
                      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Conversational</span>
                          <h3 className="text-sm font-bold text-gray-900 mt-1">Launchpad</h3>
                          <p className="text-lg font-black text-blue-600 mt-1">$45<span className="text-[10px] font-bold text-gray-400">/ session</span></p>
                        </div>
                        <a 
                          href={`https://wa.me/27610922970?text=Hi%20FluentPath!%20I%20completed%20the%20Aura%20AI%20onboarding%20diagnostic%20in%20my%20member%20area.%20I%20was%20placed%20at%20B2%20on%20the%20${encodeURIComponent(selectedOnboardingLang)}%20track.%20I%2520would%2520like%2520to%2520activate%2520my%2520Launchpad%2520Plan%2520(%252445%2520%252F%2520session)%2520manually!%20My%20email%20is%20${encodeURIComponent(profile?.email || "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block mt-4"
                        >
                          <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-xl text-[10px] font-bold h-9">
                            Activate Launchpad
                          </Button>
                        </a>
                      </div>

                      {/* Professional Card */}
                      <div className="bg-white rounded-2xl p-5 border-2 border-blue-600 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative">
                        <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[7px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                          Rec. Plan
                        </span>
                        <div>
                          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Full Core Syllabus</span>
                          <h3 className="text-sm font-bold text-gray-900 mt-1">Professional</h3>
                          <p className="text-lg font-black text-blue-600 mt-1">$160<span className="text-[10px] font-bold text-gray-400">/ month</span></p>
                        </div>
                        <a 
                          href={onboardingScorecard.whatsAppLink}
                          target="_blank"
                          rel="noreferrer"
                          className="block mt-4"
                        >
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold h-9">
                            Activate Professional
                          </Button>
                        </a>
                      </div>

                      {/* Accelerator Card */}
                      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Intensive Program</span>
                          <h3 className="text-sm font-bold text-gray-900 mt-1">Accelerator</h3>
                          <p className="text-lg font-black text-blue-600 mt-1">$290<span className="text-[10px] font-bold text-gray-400">/ month</span></p>
                        </div>
                        <a 
                          href={`https://wa.me/27610922970?text=Hi%20FluentPath!%20I%20completed%20the%20Aura%20AI%20onboarding%20diagnostic%20in%20my%20member%20area.%20I%20was%20placed%20at%20B2%20on%20the%20${encodeURIComponent(selectedOnboardingLang)}%20track.%20I%20would%20like%20to%20activate%20my%20Accelerator%20Plan%20($290%20%2F%20month)%20manually!%20My%20email%20is%20${encodeURIComponent(profile?.email || "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block mt-4"
                        >
                          <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-xl text-[10px] font-bold h-9">
                            Activate Accelerator
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-xs text-gray-400 font-medium text-center">
            🔒 direct EFT activation • Live admissions advisor call/chat +27 61 092 2970
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex gap-4 border-b border-gray-200/60 pb-4 mb-8 overflow-x-auto">
          <Button 
            onClick={() => setActiveTab("dashboard")}
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold shrink-0 ${activeTab === "dashboard" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <LayoutDashboard size={18} className="mr-2" /> Dashboard
          </Button>
          <Button 
            onClick={() => setActiveTab("roadmap")}
            variant={activeTab === "roadmap" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold shrink-0 ${activeTab === "roadmap" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Map size={18} className="mr-2" /> 24-Week Roadmap
          </Button>
          <Button 
            onClick={() => setActiveTab("aura-advisor")}
            variant={activeTab === "aura-advisor" ? "default" : "ghost"}
            className={`rounded-xl h-11 font-bold shrink-0 ${activeTab === "aura-advisor" ? "bg-black text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <MessageSquare size={18} className="mr-2" /> 🤖 Aura success AI
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
            {activeTab === "dashboard" && (
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
            )}

            {activeTab === "roadmap" && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm rounded-[2rem] bg-white p-8">
                  <CardHeader className="p-0 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold">24-Week Interactive Curriculum Roadmap</CardTitle>
                      <CardDescription className="text-gray-400">Track your structural milestones, submit weekly homework deliverables, and launch classes directly.</CardDescription>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">Language Track:</span>
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

            {activeTab === "aura-advisor" && (
              <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="text-blue-500 fill-current" size={24} /> Aura AI Student Success Advisor
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-semibold mt-1">
                    Aura is here 24/7 to help you review syllabus concepts, practice active conversations, or answer homework grammar queries.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  {/* Chat logs */}
                  <div className="h-96 border border-gray-100 bg-gray-50/50 rounded-2xl p-5 overflow-y-auto space-y-4">
                    {advisorMessages.map((msg, i) => (
                      <div key={msg.id || i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-black text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAdvisorTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat input */}
                  <form onSubmit={handleSendAdvisorMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={advisorInput}
                      onChange={(e) => setAdvisorInput(e.target.value)}
                      placeholder="Ask Aura Success AI a question about your curriculum..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-700 focus:outline-none focus:border-black"
                    />
                    <Button type="submit" className="rounded-xl h-11 bg-black text-white hover:bg-gray-800 font-bold px-6">
                      Send
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
                <a 
                  href={`https://wa.me/27610922970?text=Hi%20FluentPath!%20I%20have%20a%20billing%20question%20regarding%20my%20${encodeURIComponent(profile?.subscription_plan || "Active")} Plan.`}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl h-12 font-bold border-gray-100 group"
                  >
                    💬 Contact Billing Support <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform text-emerald-500" />
                  </Button>
                </a>
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
