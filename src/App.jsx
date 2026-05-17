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

// --- Landing Page Component ---
function LandingPage() {
  const { t } = useTranslation();
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
    </main>
  );
}

// --- Navigation Wrapper ---
function Navbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.user_metadata?.role;
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
