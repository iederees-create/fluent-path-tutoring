import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";
import { 
  Languages, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MessageCircle,
  Users
} from "lucide-react";

export default function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="font-display font-bold text-xl tracking-tight">FluentPath</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-black transition-colors">Courses</a>
            <a href="#" className="hover:text-black transition-colors">Pricing</a>
            <a href="#" className="hover:text-black transition-colors">About</a>
            <Button variant="default" className="rounded-full px-6">Login</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
          
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Subscription-based tutoring focused on conversational English first, with expert support for exams and professional communication.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg rounded-2xl bg-black hover:bg-gray-800 px-10 h-14 group">
              Start Your Free Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg rounded-2xl px-10 h-14 border-gray-200">
              View Curriculum
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50 overflow-hidden">
            <span className="font-bold text-xl tracking-widest">IELTS</span>
            <span className="font-bold text-xl tracking-widest">TOEFL</span>
            <span className="font-bold text-xl tracking-widest">TEFL</span>
            <span className="font-bold text-xl tracking-widest">CAMBRIDGE</span>
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
                  Speak naturally and confidently in everyday situations, work meetings, interviews, and travel. Practical, real-life conversations from day one.
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
                  Comprehensive IELTS, TOEFL, and TEFL support with structured lessons, mock assessments, and personalized feedback to hit your target score.
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
                  Master Business English, high-stakes interview preparation, and workplace communication to advance your global career.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Pricing Section */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-extrabold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500">Choose the plan that fits your learning pace.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="rounded-3xl border-gray-100">
                <CardContent className="p-10 text-center">
                  <h3 className="text-lg font-semibold text-gray-500 mb-4">Basic</h3>
                  <div className="flex items-end justify-center gap-1 mb-8">
                    <span className="text-5xl font-extrabold">$19</span>
                    <span className="text-gray-400 mb-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10 text-left">
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-500" />
                      2 live sessions / month
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-500" />
                      Self-study materials
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-500" />
                      Email support
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full rounded-2xl py-6 h-14 border-gray-200 hover:border-black">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Standard Plan */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-10">
                Most Popular
              </div>
              <Card className="rounded-3xl border-2 border-blue-600 shadow-2xl shadow-blue-200/50">
                <CardContent className="p-10 text-center">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Standard</h3>
                  <div className="flex items-end justify-center gap-1 mb-8">
                    <span className="text-5xl font-extrabold">$39</span>
                    <span className="text-gray-400 mb-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10 text-left">
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-600" />
                      Weekly live sessions
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-600" />
                      Practice assignments
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-600" />
                      Chat support
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-600" />
                      Progress tracking
                    </li>
                  </ul>
                  <Button className="w-full rounded-2xl py-6 h-14 bg-blue-600 hover:bg-blue-700">
                    Choose Standard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="rounded-3xl border-gray-100">
                <CardContent className="p-10 text-center">
                  <h3 className="text-lg font-semibold text-gray-500 mb-4">Premium</h3>
                  <div className="flex items-end justify-center gap-1 mb-8">
                    <span className="text-5xl font-extrabold">$69</span>
                    <span className="text-gray-400 mb-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10 text-left">
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-500" />
                      Unlimited sessions
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-500" />
                      1-on-1 coaching
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={18} className="text-blue-500" />
                      Personal study plan
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full rounded-2xl py-6 h-14 border-gray-200 hover:border-black">
                    Go Premium
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-4xl mx-auto text-center py-20 px-6 bg-white rounded-[3rem] shadow-sm mb-20 border border-gray-50">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-display font-extrabold mb-6 tracking-tight">Why Choose Us?</h2>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            Flexible learning, expert tutors, and a supportive environment designed to help you succeed in the global English-speaking world.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-extrabold mb-1 tracking-tight">10k+</div>
              <div className="text-sm text-gray-400 uppercase font-bold tracking-widest">Students</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold mb-1 tracking-tight">98%</div>
              <div className="text-sm text-gray-400 uppercase font-bold tracking-widest">Success</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold mb-1 tracking-tight">50+</div>
              <div className="text-sm text-gray-400 uppercase font-bold tracking-widest">Tutors</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold mb-1 tracking-tight">24/7</div>
              <div className="text-sm text-gray-400 uppercase font-bold tracking-widest">Support</div>
            </div>
          </div>
        </section>
      </main>

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
                <li><a href="#" className="hover:text-black">Pricing</a></li>
                <li><a href="#" className="hover:text-black">Curriculum</a></li>
                <li><a href="#" className="hover:text-black">Tutors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-400">Legal</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-600">
                <li><a href="#" className="hover:text-black">Privacy</a></li>
                <li><a href="#" className="hover:text-black">Terms</a></li>
                <li><a href="#" className="hover:text-black">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
          <p>© 2026 FluentPath Tutoring. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>Twitter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
