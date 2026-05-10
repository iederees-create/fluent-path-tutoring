import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageSquare, 
  PhoneOff, 
  Settings,
  Users
} from "lucide-react";

export default function VideoRoom() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const endSession = () => {
    // In future, this will disconnect Daily.co and route to a review/rating page.
    navigate("/expert-portal");
  };

  return (
    <div className="h-screen bg-[#0A0A0A] flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#111]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-sm tracking-widest uppercase">Live Session</span>
          <span className="text-white/40 text-sm">| 00:14:32</span>
        </div>
        <div className="text-sm font-medium text-white/60">
          Sarah Williams (Expert) & John Doe (Learner)
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 relative">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30">
            <div className="text-center">
              <Video size={64} className="mx-auto mb-4 text-white/20" />
              <p className="text-xl font-bold tracking-tight">Daily.co Integration Pending</p>
              <p className="text-sm text-white/60 mt-2 max-w-md mx-auto">This container will render the high-definition WebRTC video stream using @daily-co/daily-react once API keys are added.</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Remote Video (Tutor) */}
            <div className="relative rounded-3xl overflow-hidden bg-[#1A1A1A] border border-white/5 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Tutor" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                Sarah Williams <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 uppercase tracking-wider">Expert</span>
              </div>
            </div>

            {/* Local Video (Learner) */}
            <div className="relative rounded-3xl overflow-hidden bg-[#1A1A1A] border border-white/5 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold">
                JD
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold">
                You
              </div>
              {isVideoOff && (
                <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 p-2 rounded-lg backdrop-blur-md">
                  <VideoOff size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Controls Dock */}
          <div className="h-20 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center gap-4 px-6 relative z-20">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            
            <div className="w-px h-8 bg-white/10 mx-2" />
            
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isChatOpen ? 'bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <MessageSquare size={20} />
            </button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-white/10 hover:bg-white/20">
              <Users size={20} />
            </button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-white/10 hover:bg-white/20">
              <Settings size={20} />
            </button>

            <div className="w-px h-8 bg-white/10 mx-2" />

            <button onClick={endSession} className="h-12 px-6 rounded-xl bg-red-500 hover:bg-red-600 font-bold text-sm flex items-center gap-2 transition-colors">
              <PhoneOff size={18} /> End
            </button>
          </div>
        </div>

        {/* Sidebar Chat */}
        {isChatOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            className="border-l border-white/10 bg-[#111] flex flex-col"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold">Session Chat</h3>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="bg-white/5 p-3 rounded-lg rounded-tl-none">
                <p className="text-xs text-white/40 mb-1">Sarah (Expert)</p>
                <p className="text-sm">Hi John! We will use this chat for sharing links and notes during our lesson.</p>
              </div>
            </div>
            <div className="p-4 border-t border-white/10">
              <input type="text" placeholder="Type a message..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
