import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Languages, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MessageCircle,
  Users,
  LayoutDashboard,
  UserCircle,
  LogOut,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { LanguageProvider, useTranslation } from "./context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import ExpertPortal from "./pages/ExpertPortal";
import LearnerPortal from "./pages/LearnerPortal";
import BookingPage from "./pages/BookingPage";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import SafetyPolicy from "./pages/SafetyPolicy";
import ClassInGuide from "./pages/ClassInGuide";
import VideoRoom from "./pages/VideoRoom";
import UpdatePassword from "./pages/UpdatePassword";
import { supabase } from "./lib/supabase";
import { processWebhookEvent } from "./lib/stripeWebhook";

// --- Landing Page Component ---
function LandingPage() {
  const { t } = useTranslation();

  // Automated Subscription States
  const [user, setUser] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCVC, setCardCVC] = useState("123");
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeStatusText, setStripeStatusText] = useState("");

  // Aura AI Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "aura",
      text: "Hello! I am Aura, your AI Placement Advisor. 🌟 I help align our professional 24-week syllabus to your individual career targets. To begin, which language track would you like to master?",
      options: ["🇬🇧 English", "🇪🇸 Spanish", "🇫🇷 French", "🇯🇵 Japanese"]
    }
  ]);
  const [chatStep, setChatStep] = useState(1); // 1: Language selection, 2: Input details, 3: Scorecard & Offer
  const [userChatInput, setUserChatInput] = useState("");
  const [selectedChatLang, setSelectedChatLang] = useState("");
  const [isChatAnalyzing, setIsChatAnalyzing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleChatOptionSelect = (langOption) => {
    setSelectedChatLang(langOption);
    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "user", text: `I want to study the ${langOption} track.` },
      { id: Date.now() + 1, sender: "aura", text: `Superb! To help me tailor your 24-week syllabus topics, please briefly tell me what you need this language for (e.g. business presentations, job interviews, or general travel confidence) and your current experience level.` }
    ]);
    setChatStep(2);
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const userInput = userChatInput;
    setUserChatInput("");

    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "user", text: userInput }
    ]);

    setIsChatAnalyzing(true);
    setChatStep(3);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setChatMessages(prev => [
      ...prev,
      { 
        id: Date.now() + 1, 
        sender: "aura", 
        text: `Analysis complete! 📊 Based on your communication target details, here are your placement results:`,
        scorecard: {
          lang: selectedChatLang,
          level: "B2 - Upper Intermediate",
          grammar: "84%",
          fluency: "79%",
          recommendedPlan: "Professional Plan ($160/mo)",
          whatsAppLink: `https://wa.me/27610922970?text=Hi%20FluentPath!%20I%20completed%20the%20Aura%20AI%20diagnostic%20chat.%20I%20was%20placed%20at%20B2%20on%20the%20${encodeURIComponent(selectedChatLang)}%20track.%20I%20would%20like%20to%20activate%20my%20Professional%20Plan%20($160%2Fmo)%20manually!`
        }
      }
    ]);
    setIsChatAnalyzing(false);
  };

  const handleSelectTier = (tierName, price) => {
    if (!user) {
      alert("Please create an account or sign in first to register your profile. After authentication, you will be able to select and manually activate your premium learning campus!");
      window.location.href = "#/auth";
      return;
    }
    setSelectedTier({ name: tierName, price });
    setCheckoutSuccess(false);
    setIsCheckingOut(true);
  };

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate high-ticket real-time Stripe gateway loading sequences
    const steps = [
      "Establishing secure Stripe gateway link...",
      "Encrypting high-grade credit token...",
      "Validating merchant ledger details...",
      "Processing card authorization...",
      "Triggering database subscription activation webhook...",
      "Payment processed successfully!"
    ];

    for (let i = 0; i < steps.length; i++) {
      setStripeStatusText(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    const mockEmail = user?.email || "student@fluentpath.com";
    const mockEvent = {
      type: "customer.subscription.created",
      data: {
        object: {
          id: `sub_sim_${Math.random().toString(36).substr(2, 9)}`,
          customer_email: mockEmail,
          metadata: {
            customer_email: mockEmail,
            tier: selectedTier.name.toLowerCase()
          }
        }
      }
    };

    const res = await processWebhookEvent(mockEvent);

    setIsProcessing(false);
    if (res.success) {
      setCheckoutSuccess(true);
    } else {
      alert("Simulated transaction failed: " + res.error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="pt-32 pb-20 px-6">
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto text-center mb-24"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-8 border border-blue-100"
        >
          <Sparkles size={16} />
          <span>{t("hero.badge")}</span>
        </motion.div>
        
        <h1 className="text-6xl md:text-7xl font-display font-extrabold mb-8 tracking-tight leading-[1.1] text-gradient">
          {t("hero.title1")} <br />
          <span className="text-black">{t("hero.title2")}</span>
        </h1>
        <p className="text-xs text-gray-300 mb-4 opacity-50">v1.0.3-deployed</p>
        
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("hero.subtitle")}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking">
            <Button size="lg" className="text-lg rounded-2xl bg-black hover:bg-gray-800 px-10 h-14 group">
              {t("hero.findExpert")}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/auth?role=practitioner">
            <Button size="lg" variant="outline" className="text-lg rounded-2xl px-10 h-14 border-gray-200">
              {t("hero.becomeTutor")}
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-32"
      >
        <motion.div variants={itemVariants}>
          <Card className="h-full border-none bg-white p-4 group">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </div>
              <CardTitle className="text-2xl mb-4">{t("features.conversationalTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 leading-relaxed">
                {t("features.conversationalDesc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border-none bg-white p-4 group">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap size={28} />
              </div>
              <CardTitle className="text-2xl mb-4">{t("features.examTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 leading-relaxed">
                {t("features.examDesc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border-none bg-white p-4 group">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                <Briefcase size={28} />
              </div>
              <CardTitle className="text-2xl mb-4">{t("features.skillsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 leading-relaxed">
                {t("features.skillsDesc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Pricing & Programs Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto mb-32"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-extrabold mb-4 tracking-tight">Choose Your Learning Tier</h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            All programs follow our credential-grade 24-week syllabus. Secure placement and direct Stripe invoicing are managed instantly via WhatsApp.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1 */}
          <Card className="border-none bg-white p-8 flex flex-col justify-between rounded-3xl shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversational Focus</span>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900">Launchpad Tier</h3>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-gray-900">$45</span>
                <span className="text-gray-400 font-bold text-sm">/ session</span>
              </div>
              <ul className="space-y-4 text-sm font-medium text-gray-600 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Pay-as-you-go flexibility
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> WebRTC native video classroom
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Direct access to syllabus
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => handleSelectTier("Launchpad", 45)}
              className="w-full rounded-2xl h-14 bg-black hover:bg-gray-800 text-white font-bold group mt-auto"
            >
              Select Launchpad
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
          </Card>

          {/* Tier 2 */}
          <Card className="border-2 border-blue-600 bg-white p-8 flex flex-col justify-between rounded-3xl shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
              Most Popular
            </div>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Complete Syllabus</span>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900">Professional Tier</h3>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-gray-900">$160</span>
                <span className="text-gray-400 font-bold text-sm">/ month</span>
              </div>
              <ul className="space-y-4 text-sm font-medium text-gray-600 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> **1 session / week** (4 per month)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Full credential-grade roadmap
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Weekly homework assessment
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Dedicated professional coach
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => handleSelectTier("Professional", 160)}
              className="w-full rounded-2xl h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold group mt-auto"
            >
              Select Professional
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
          </Card>

          {/* Tier 3 */}
          <Card className="border-none bg-white p-8 flex flex-col justify-between rounded-3xl shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Intensive Milestones</span>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900">Accelerator Tier</h3>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-gray-900">$290</span>
                <span className="text-gray-400 font-bold text-sm">/ month</span>
              </div>
              <ul className="space-y-4 text-sm font-medium text-gray-600 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> **2 sessions / week** (8 per month)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Fast-tracked IELTS/TOEFL goals
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> VIP priority booking slots
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Unlimited chat/vocab support
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => handleSelectTier("Accelerator", 290)}
              className="w-full rounded-2xl h-14 bg-black hover:bg-gray-800 text-white font-bold group mt-auto"
            >
              Select Accelerator
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
          </Card>
        </div>
      </motion.section>

      {/* Stripe Simulated Checkout Modal */}
      <AnimatePresence>
        {isCheckingOut && selectedTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-gray-100"
            >
              {/* Header */}
              <div className="bg-gray-900 text-white p-6 relative">
                <button 
                  onClick={() => setIsCheckingOut(false)} 
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Direct WhatsApp Placement & Payment</h3>
                    <p className="text-xs text-gray-400 font-medium">FluentPath Manual Enrollment Hotlines</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8">
                {checkoutSuccess ? (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                      <CheckCircle2 size={48} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-extrabold text-gray-900">Syllabus Sandbox Unlocked!</h4>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        Success! Your sandbox profile has been instantly mapped to **{selectedTier.name}** for evaluation purposes.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 font-medium text-left border border-gray-100">
                      <p>🎉 24-Week interactive curriculum fully unlocked</p>
                      <p className="mt-1">📬 Placement director notified to verify tutor pairing</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsCheckingOut(false)} className="block">
                      <Button className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold text-md shadow-lg shadow-black/10">
                        Go to My Learning Portal
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary Info */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subscribing to</p>
                        <p className="text-lg font-extrabold text-gray-900">{selectedTier.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-blue-600">${selectedTier.price}</p>
                        <p className="text-xs font-bold text-gray-400">/ month</p>
                      </div>
                    </div>

                    {isProcessing ? (
                      <div className="text-center py-10 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm font-bold text-gray-900 animate-pulse">{stripeStatusText}</p>
                        <p className="text-xs text-gray-400">Updating Supabase subscription state triggers...</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-3">
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">How manual activation works:</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Click the button below to message our lead advisor at <strong>+27 61 092 2970</strong>. We will share your manual payment details (EFT/Bank Transfer) and instantly activate your portal account!
                          </p>
                        </div>

                        <div className="space-y-3">
                          <a 
                            href={`https://wa.me/27610922970?text=Hi%20FluentPath!%20I%20want%20to%20manually%20activate%20my%2024-week%20curriculum%20under%20the%20${encodeURIComponent(selectedTier.name)}%20Plan%20($$${selectedTier.price}%2Fmo)%20using%20the%20email%20${encodeURIComponent(user?.email || "student@fluentpath.com")}.%20Please%20send%20me%20the%20payment%20instructions!`}
                            target="_blank"
                            rel="noreferrer"
                            className="block"
                          >
                            <Button 
                              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-md shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                            >
                              💬 Pay & Activate via WhatsApp
                            </Button>
                          </a>
                        </div>

                        <p className="text-[10px] text-center text-gray-400 font-medium leading-relaxed">
                          🔒 Direct EFT / Manual Billing. For immediate support, call or text +27 61 092 2970 anytime.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Raversus-style Aura AI Chat Advisor Widget */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[2rem] shadow-2xl w-[22rem] md:w-[24rem] h-[32rem] overflow-hidden flex flex-col mb-4 relative z-50"
            >
              {/* Header */}
              <div className="bg-gray-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white relative">
                    <Sparkles size={16} />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                      Aura AI Placement Advisor
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">FluentPath Live Diagnostic</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider"
                >
                  Hide
                </button>
              </div>

              {/* Messages Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={msg.id || i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-black text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}>
                      {msg.text}
                      
                      {/* Option Pills */}
                      {msg.options && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {msg.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleChatOptionSelect(opt)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-extrabold px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Scorecard block */}
                      {msg.scorecard && (
                        <div className="mt-4 bg-gray-900 text-white rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Syllabus Track</p>
                              <p className="text-xs font-bold text-emerald-400">{msg.scorecard.lang}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Grade</p>
                              <p className="text-xs font-bold text-blue-400">{msg.scorecard.level}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-[10px]">
                            <div>
                              <p className="text-gray-400 font-bold">Grammar Accuracy</p>
                              <p className="text-sm font-extrabold text-white mt-0.5">{msg.scorecard.grammar}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-bold">Speech Fluency</p>
                              <p className="text-sm font-extrabold text-white mt-0.5">{msg.scorecard.fluency}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-800 space-y-2">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Recommended Program</p>
                            <p className="text-xs font-extrabold text-emerald-400">{msg.scorecard.recommendedPlan}</p>
                            
                            <a 
                              href={msg.scorecard.whatsAppLink}
                              target="_blank"
                              rel="noreferrer"
                              className="block"
                            >
                              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                                💬 Enroll & Pay via WhatsApp
                              </button>
                            </a>
                            <button
                              onClick={() => {
                                handleSelectTier("Professional", 160);
                                setIsChatOpen(false);
                              }}
                              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-[9px] font-bold py-1.5 rounded-lg transition-colors"
                            >
                              ⚡ Demo Sandbox Mode: Unlock Portal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isChatAnalyzing && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[10px] text-gray-400 font-bold animate-pulse uppercase ml-1">Analyzing Placement...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Input */}
              {chatStep === 2 && (
                <form 
                  onSubmit={handleSendChatMessage}
                  className="p-4 border-t border-gray-100 bg-white flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    placeholder="Describe your learning objectives..."
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <Button type="submit" className="rounded-xl h-9 bg-black text-white hover:bg-gray-800 px-4 font-bold text-xs">
                    Send
                  </Button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Trigger */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-black text-white shadow-2xl hover:scale-110 transition-all duration-300 relative group animate-bounce"
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-black opacity-25 animate-ping" />
          <MessageCircle size={28} className="fill-current text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center text-[8px] font-extrabold">
            !
          </div>
          
          <div className="absolute right-20 bg-white border border-gray-100 text-gray-800 text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl w-48 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 text-center">
            🤖 Talk to Aura AI Advisor
          </div>
        </button>
      </div>
    </main>
  );
}

// --- Navigation Wrapper ---
function Navbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.email?.toLowerCase() === 'iedereesf@gmail.com' ? 'practitioner' : user?.user_metadata?.role;
  const isExpert = role === 'practitioner';

  const { language, changeLanguage, t } = useTranslation();
  const [showGoogleTranslate, setShowGoogleTranslate] = useState(false);

  useEffect(() => {
    if (showGoogleTranslate) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      };

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
      }
    }
  }, [showGoogleTranslate]);

  const languagesList = [
    { code: "en", name: "🇺🇸 English" },
    { code: "es", name: "🇪🇸 Español" },
    { code: "pt", name: "🇧🇷 Português" },
    { code: "ja", name: "🇯🇵 日本語" },
    { code: "zh", name: "🇨🇳 中文" },
    { code: "tr", name: "🇹🇷 Türkçe" },
    { code: "fr", name: "🇫🇷 Français" },
    { code: "de", name: "🇩🇪 Deutsch" },
    { code: "more", name: "🌐 More Languages..." }
  ];

  const handleLanguageChange = (val) => {
    if (val === "more") {
      setShowGoogleTranslate(true);
    } else {
      setShowGoogleTranslate(false);
      changeLanguage(val);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="font-display font-bold text-xl tracking-tight">FluentPath</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/booking" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
            {t("nav.findTutors")}
          </Link>
          
          {/* Geolocation/Manual Dropdown Override */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <select
                value={showGoogleTranslate ? "more" : language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-gray-50/50 border border-gray-200/50 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-gray-600 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {languagesList.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 flex items-center text-gray-400">
                <ChevronDown size={12} />
              </div>
            </div>

            {showGoogleTranslate && (
              <div 
                id="google_translate_element" 
                className="google-translate-dropdown bg-white border border-gray-200 rounded-xl p-1 shadow-sm transition-all"
              />
            )}
          </div>

          <div className="w-px h-6 bg-gray-200" />
          
          {user ? (
            <div className="flex items-center gap-6">
              <Link 
                to={isExpert ? "/expert" : "/dashboard"} 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-900 font-bold text-sm border border-gray-200 hover:border-black transition-all"
              >
                <LayoutDashboard size={16} />
                {isExpert ? t("nav.expertPortal") : t("nav.myLearning")}
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{role}</p>
                  <p className="text-sm font-bold text-gray-900 leading-none mt-0.5">{user.email.split('@')[0]}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                   <UserCircle size={24} />
                </div>
                <Button variant="ghost" onClick={handleLogout} className="rounded-xl p-2 text-gray-400 hover:text-rose-500">
                  <LogOut size={20} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-sm font-bold text-gray-500 hover:text-black">
                {t("nav.signIn")}
              </Link>
              <Link to="/auth?signup=true">
                <Button className="rounded-xl h-10 px-6 bg-black font-bold">
                  {t("nav.getStarted")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-blue-100">
        <Navbar user={user} />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<LearnerPortal />} />
            <Route path="/expert" element={<ExpertPortal />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/safety" element={<SafetyPolicy />} />
            <Route path="/guide" element={<ClassInGuide />} />
            <Route path="/session/:id" element={<VideoRoom />} />
          </Routes>
        </AnimatePresence>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  E
                </div>
                <span className="font-display font-bold text-lg tracking-tight">FluentPath</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t("footer.desc")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-400">{t("footer.platform")}</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-600">
                  <li><Link to="/booking" className="hover:text-black">{t("nav.findTutors")}</Link></li>
                  <li><Link to="/auth?role=practitioner" className="hover:text-black">{t("footer.experts")}</Link></li>
                  <li><Link to="/dashboard" className="hover:text-black">{t("footer.learningPortal")}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-400">{t("footer.legal")}</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-600">
                  <li><a href="#" className="hover:text-black">{t("footer.privacy")}</a></li>
                  <li><a href="#" className="hover:text-black">{t("footer.terms")}</a></li>
                  <li><Link to="/safety" className="hover:text-black">{t("footer.childSafety")}</Link></li>
                  <li><Link to="/guide" className="hover:text-black">{t("footer.tutorGuide")}</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
            <p>{t("footer.rights")}</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
