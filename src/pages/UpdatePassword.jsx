import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully!");
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-4 text-center">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <Lock size={32} />
            </div>
            <CardTitle className="text-3xl font-display font-extrabold tracking-tight">
              Update Password
            </CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              Enter your new password below.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-4">
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                />
              </div>

              <Button 
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-black hover:bg-gray-800 text-lg font-bold group"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
                {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
              </Button>

              {message && (
                <p className={`text-center text-sm font-medium ${message.includes("successfully") ? "text-emerald-600" : "text-rose-600"}`}>
                  {message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
