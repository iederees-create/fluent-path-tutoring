import React from "react";
import { motion } from "framer-motion";
import { Play, FolderOpen, MousePointerClick, Volume2, MonitorPlay, Layers, Layout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export default function ClassInGuide() {
  const steps = [
    {
      icon: MousePointerClick,
      title: "Selecting a Class",
      desc: "Navigate to your class list, select your specific class (e.g., 'Lex'), and enter the class section.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: Layout,
      title: "Accessing the Teaching Plan",
      desc: "Within the lesson list, scroll to the bottom and click 'Prepare' for the specific session.",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      icon: FolderOpen,
      title: "Using the Cloud Drive",
      desc: "Open the 'Drive' icon from the sidebar. You can upload files directly from your computer or select pre-saved materials (e.g., 'PET - Succeed in B1 Preliminary').",
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      icon: Layers,
      title: "Organizing the Workspace",
      desc: "Once the PDF is loaded, resize it for the student. Navigate to the specific section (e.g., 'Listening' Paper 3) to have it ready before the student enters.",
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      icon: Volume2,
      title: "Integrating Audio via Browser",
      desc: "Use the 'Browser' tool from the ClassIn toolbox. Paste a YouTube link containing the relevant audio track for the listening exercise.",
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      icon: MonitorPlay,
      title: "Final Setup & Best Practices",
      desc: "Play the audio to test the volume. Crucially, hide the browser window behind the PDF so the student can hear the audio while looking at the test material without being distracted by the video.",
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
            <Play size={16} />
            <span>Tutor Tutorial</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4">
            ClassIn Lesson Preparation
          </h1>
          <p className="text-xl text-gray-500">
            A step-by-step guide to preparing your interactive classroom, managing materials, and organizing the digital workspace before your student arrives.
          </p>
        </motion.div>

        <div className="grid gap-6 mb-12">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
                  <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${step.bg} ${step.color}`}>
                    <step.icon size={28} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Step 0{i + 1}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-black text-white border-none shadow-xl rounded-3xl p-2">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-bold">Key Tools Mentioned</CardTitle>
              <CardDescription className="text-gray-400">Master these ClassIn features for a smooth lesson.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid sm:grid-cols-3 gap-6 mt-4">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h4 className="font-bold text-white mb-2">Sidebar Tools</h4>
                  <p className="text-sm text-gray-400">Essential drawing and interaction tools including the Arrow, Pen, and Text Bar.</p>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h4 className="font-bold text-white mb-2">The Toolbox</h4>
                  <p className="text-sm text-gray-400">Contains advanced features like the 'Browser' function used to play external audio/video seamlessly.</p>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h4 className="font-bold text-white mb-2">Cloud Drive</h4>
                  <p className="text-sm text-gray-400">The central hub where all teaching resources, PDFs, and media are stored and accessed during class.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
