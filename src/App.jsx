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
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import ExpertPortal from "./pages/ExpertPortal";
import LearnerPortal from "./pages/LearnerPortal";
import BookingPage from "./pages/BookingPage";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import SafetyPolicy from "./pages/SafetyPolicy";
import ClassInGuide from "./pages/ClassInGuide";
import { supabase } from "./lib/supabase";

// --- Landing Page Component ---
function LandingPage() {
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
          <span>Master Conversational English</span>
        </motion.div>
        
        <h1 className="text-6xl md:text-7xl font-display font-extrabold mb-8 tracking-tight leading-[1.1] text-gradient">
          Conversational English for <br />
          <span className="text-black">Real Life Confidence</span>
        </h1>
        <p className="text-xs text-gray-300 mb-4 opacity-50">v1.0.3-deployed</p>
        
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          The first credentialed ecosystem connecting expert tutors with ambitious global learners. Master conversation, exams, and professional English.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking">
            <Button size="lg" className="text-lg rounded-2xl bg-black hover:bg-gray-800 px-10 h-14 group">
              Find Your Expert
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/auth?role=practitioner">
            <Button size="lg" variant="outline" className="text-lg rounded-2xl px-10 h-14 border-gray-200">
              Become a Tutor
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
              <CardTitle className="text-2xl mb-4">Conversational English</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 leading-relaxed">
                Speak naturally and confidently in everyday situations. Practical, real-life conversations from day one.
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
              <CardTitle className="text-2xl mb-4">Exam Preparation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 leading-relaxed">
                IELTS, TOEFL, and TEFL support with structured lessons and mock assessments to hit your target score.
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
              <CardTitle className="text-2xl mb-4">Professional Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 leading-relaxed">
                Master Business English, interview preparation, and workplace communication to advance your global career.
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
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/booking" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Find Tutors</Link>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          {user ? (
            <div className="flex items-center gap-6">
              <Link 
                to={isExpert ? "/expert" : "/dashboard"} 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-900 font-bold text-sm border border-gray-200 hover:border-black transition-all"
              >
                <LayoutDashboard size={16} />
                {isExpert ? "Expert Portal" : "My Learning"}
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
              <Link to="/auth" className="text-sm font-bold text-gray-500 hover:text-black">Sign In</Link>
              <Link to="/auth?signup=true">
                <Button className="rounded-xl h-10 px-6 bg-black font-bold">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

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
    <Router basename={import.meta.env.BASE_URL}>
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
            <Route path="/safety" element={<SafetyPolicy />} />
            <Route path="/guide" element={<ClassInGuide />} />
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
                Empowering global learners to speak with confidence through real-world conversation and expert guidance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-400">Platform</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-600">
                  <li><Link to="/booking" className="hover:text-black">Find Tutors</Link></li>
                  <li><Link to="/auth?role=practitioner" className="hover:text-black">For Experts</Link></li>
                  <li><Link to="/dashboard" className="hover:text-black">Learning Portal</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-400">Legal & Safety</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-600">
                  <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-black">Terms of Service</a></li>
                  <li><Link to="/safety" className="hover:text-black">Child Safety</Link></li>
                  <li><Link to="/guide" className="hover:text-black">Tutor Guide</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
            <p>© 2026 FluentPath Ecosystem. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
