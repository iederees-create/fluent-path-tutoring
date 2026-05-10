import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import SessionCard from "../components/SessionCard";

export default function ExpertPortal() {
  const [step, setStep] = useState(1); // 1: Stats, 2: Verification
  const [isVerified, setIsVerified] = useState(false);
  const [safetyAgreed, setSafetyAgreed] = useState(false);

  const stats = [
    { label: "Active Learners", value: "12", icon: Users, color: "text-blue-500" },
    { label: "Completion Rate", value: "98%", icon: CheckCircle, color: "text-emerald-500" },
    { label: "Total Sessions", value: "142", icon: Clock, color: "text-orange-500" },
    { label: "Reputation Score", value: "4.9/5", icon: Award, color: "text-purple-500" },
  ];

  const upcomingSessions = [
    { name: "Alex Johnson", topic: "IELTS Prep", time: "Today @ 4:00 PM", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { name: "Maria Garcia", topic: "Conversational", time: "Tomorrow @ 9:00 AM", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
    { name: "Kevin Lee", topic: "Business English", time: "Tomorrow @ 11:30 AM", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
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
                      <h3 className="text-4xl font-extrabold tracking-tight">$850.00</h3>
                      <span className="text-gray-400 font-bold mb-1">/ May</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-500">Available to Payout</span>
                        <span className="text-gray-900">$320.00</span>
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
