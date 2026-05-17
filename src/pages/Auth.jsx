import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { User, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(new URLSearchParams(location.search).get("signup") === "true");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(new URLSearchParams(location.search).get("role") || "learner"); // "learner" or "practitioner"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("role")) setRole(params.get("role"));
    if (params.get("signup")) setIsSignUp(true);
  }, [location]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Dynamically construct the redirect URL for GitHub Pages + HashRouter
    const redirectUrl = window.location.origin + window.location.pathname + "#/auth/callback";

    if (isForgotPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${redirectUrl}?type=recovery`,
      });
      if (error) setMessage(error.message);
      else setMessage("Password reset link sent to your email!");
    } else if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) setMessage(error.message);
      else setMessage("Check your email for the confirmation link!");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else {
        const finalRole = email === "iedereesf@gmail.com" ? "practitioner" : role;
        navigate(finalRole === "practitioner" ? "/expert" : "/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-4 text-center">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <User size={32} />
            </div>
            <CardTitle className="text-3xl font-display font-extrabold tracking-tight">
              {isForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              {isForgotPassword ? "Enter your email to receive a reset link." : isSignUp ? "Join the FluentPath ecosystem today." : "Sign in to manage your sessions."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-4">
            <form onSubmit={handleAuth} className="space-y-6">
              
              {isSignUp && !isForgotPassword && (
                <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 border border-gray-200 mb-6">
                  <button
                    type="button"
                    onClick={() => setRole("learner")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === "learner" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                  >
                    <User size={16} />
                    Looking for Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("practitioner")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === "practitioner" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                  >
                    <ShieldCheck size={16} />
                    Tutor / Expert
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                  />
                </div>
                {!isForgotPassword && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                    />
                  </div>
                )}
              </div>

              {!isSignUp && !isForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs font-bold text-gray-400 hover:text-black transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button 
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-black hover:bg-gray-800 text-lg font-bold group"
              >
                {loading ? <Loader2 className="animate-spin" /> : (isForgotPassword ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign In")}
                {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
              </Button>

              {message && (
                <p className={`text-center text-sm font-medium ${message.includes("sent") || message.includes("confirmation") ? "text-emerald-600" : "text-rose-600"}`}>
                  {message}
                </p>
              )}

              <div className="text-center pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isForgotPassword) {
                      setIsForgotPassword(false);
                    } else {
                      setIsSignUp(!isSignUp);
                    }
                  }}
                  className="text-sm font-bold text-gray-500 hover:text-black transition-colors block w-full"
                >
                  {isForgotPassword ? "Back to Sign In" : isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
