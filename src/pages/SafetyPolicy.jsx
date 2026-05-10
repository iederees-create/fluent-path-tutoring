import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileSignature, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export default function SafetyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
            <ShieldCheck size={16} />
            <span>Platform Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4">
            Child Safety & Safeguarding
          </h1>
          <p className="text-xl text-gray-500">
            This is what makes the FluentPath platform kids-safe certified. Our commitment to learner protection is our highest priority.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-blue-600 p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <FileSignature size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">Mandatory Child Safety Declaration</CardTitle>
                    <CardDescription className="text-blue-100 mt-1">Every tutor must confirm and agree to these standards.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-900 font-bold mb-6 text-lg">By applying to tutor on FluentPath, you legally confirm:</p>
                <ul className="space-y-4">
                  {[
                    "No history of child abuse",
                    "No violent criminal record",
                    "No sexual offences",
                    "No safeguarding violations",
                    "No misconduct involving minors",
                    "No prior removal from child-facing platforms for safety reasons"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-xl flex gap-3">
                  <AlertOctagon className="text-orange-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-orange-800 font-medium leading-relaxed">
                    This declaration is integrated into the tutor credential submission process and carries legal weight. Falsifying this information will result in immediate permanent bans and potential reporting to local authorities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-gray-200 shadow-sm rounded-3xl bg-white">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <ShieldCheck className="text-blue-600" size={28} />
                  Background Checks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-gray-500 mb-6">
                  In addition to the declaration, all experts working with minors must provide valid documentation. We require:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">Police Clearance</h4>
                    <p className="text-sm text-gray-500">A standard criminal background check or police clearance certificate from your country of residence.</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2">Enhanced Child-Safe Clearance</h4>
                    <p className="text-sm text-blue-700">Where available (e.g., Working with Children Check, DBS Check), this must be provided to unlock younger age demographics.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
