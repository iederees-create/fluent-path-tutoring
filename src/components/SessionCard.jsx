import React from "react";
import { Button } from "./ui/button";
import { Clock, Video } from "lucide-react";

export default function SessionCard({ name, topic, time, role, imageUrl }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden ring-2 ring-gray-50 group-hover:ring-blue-50 transition-all">
          <img 
            src={imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h5 className="font-bold text-gray-900">{name}</h5>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {topic}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <Clock size={12} />
              {time}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-xl border-gray-100 h-10 px-4 font-bold text-xs hover:bg-black hover:text-white transition-all group-hover:border-black">
          <Video size={14} className="mr-2" />
          Enter Room
        </Button>
      </div>
    </div>
  );
}
