import React from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Globe, 
  MessageCircle, 
  Calendar,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function BookingPage() {
  const navigate = useNavigate();
  const [tutors, setTutors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [bookingTutor, setBookingTutor] = React.useState(null);

  React.useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("tutors")
          .select("*");

        if (data && data.length > 0) {
          setTutors(data);
        } else {
          // Fallback to static data
          setTutors([
            {
              id: 1,
              name: "Sarah Williams",
              role: "IELTS & Conversational Expert",
              rating: "5.0",
              reviews: "124",
              bio: "Certified TEFL instructor with 8+ years of experience helping students achieve band 7.5+ in IELTS. Native speaker from London.",
              specialties: ["IELTS", "TOEFL", "Business English"],
              price: "$35",
              imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
            },
            {
              id: 2,
              name: "David Chen",
              role: "Professional Communication Coach",
              rating: "4.9",
              reviews: "86",
              bio: "Helping corporate professionals master English for international business and high-stakes interviews.",
              specialties: ["Interview Prep", "Networking", "Presentations"],
              price: "$45",
              imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading tutors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const handleBookSession = async (tutor, time) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please sign in to book a session!");
      navigate("/auth");
      return;
    }

    try {
      // 1. Insert into bookings table
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert({
          learner_id: user.id,
          tutor_id: tutor.id,
          topic: tutor.specialties?.[0] || "General Conversational",
          scheduled_time: `Today @ ${time}`,
          status: "upcoming"
        });

      if (bookingError) throw bookingError;

      // 2. Insert into learning_activity table
      await supabase
        .from("learning_activity")
        .insert({
          learner_id: user.id,
          description: `Booked session with ${tutor.name}`,
          metadata: tutor.specialties?.[0] || "General Conversational"
        });

      alert(`Session booked successfully with ${tutor.name} at ${time}!`);
      setBookingTutor(null);
      navigate("/dashboard"); // Redirect directly to show their new session!
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book session. Please try again.");
    }
  };

  const BookingModal = ({ tutor, onClose }) => {
    if (!tutor) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]"
        >
          {/* Left Side: Info */}
          <div className="md:w-1/3 bg-gray-50 p-8 border-r border-gray-100 flex flex-col">
            <button onClick={onClose} className="absolute top-4 left-4 md:hidden text-gray-500">Close</button>
            <div className="flex-1">
              <img src={tutor.imageUrl} alt={tutor.name} className="w-16 h-16 rounded-2xl mb-4 shadow-sm" />
              <h2 className="text-xl font-bold mb-1">{tutor.name}</h2>
              <p className="text-sm font-medium text-blue-600 mb-6">{tutor.role}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <Clock size={16} /> 60 Minute Session
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <Globe size={16} /> WebRTC Video
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <Star size={16} className="text-orange-400" /> {tutor.price} / session
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side: Time Slots */}
          <div className="md:w-2/3 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-full max-w-sm">
              <Calendar size={48} className="mx-auto text-blue-100 mb-6" />
              <h3 className="text-2xl font-bold mb-2">Select a Time</h3>
              <p className="text-gray-500 mb-8 text-sm">
                Choose an available slot to confirm your booking and sync calendar data.
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {['09:00', '10:00', '11:00', '13:00', '14:00', '16:00'].map(time => (
                  <button key={time} onClick={() => handleBookSession(tutor, time)} className="py-3 border border-gray-200 rounded-xl font-bold text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
                    {time}
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Timezone: Africa/Johannesburg (GMT+2)</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl font-display font-extrabold tracking-tight">Find Your Expert</h1>
          <p className="text-gray-500 mt-2">Connect with world-class tutors specialized in your goals.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-bold">Filters</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Specialty</label>
                  <div className="flex flex-wrap gap-2">
                    {["IELTS", "Business", "Conversation", "Grammar"].map((s) => (
                      <button key={s} className="px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold hover:border-black transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Availability</label>
                  <div className="space-y-3">
                    {["Today", "This Weekend", "Next Week"].map((a) => (
                      <label key={a} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border-2 border-gray-100 group-hover:border-blue-500 transition-all" />
                        <span className="text-sm font-medium text-gray-600">{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutor List */}
          <div className="lg:col-span-2 space-y-6">
            {tutors.map((tutor, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
              >
                <Card className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-64 bg-gray-50 flex items-center justify-center p-8 border-r border-gray-100">
                        <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform">
                          <img src={tutor.imageUrl} alt={tutor.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-2xl font-bold">{tutor.name}</h3>
                              <ShieldCheck className="text-blue-500" size={20} />
                            </div>
                            <p className="text-blue-600 font-bold text-sm">{tutor.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{tutor.price}<span className="text-sm text-gray-400 font-medium">/hr</span></p>
                            <div className="flex items-center gap-1 mt-1 justify-end">
                              <Star className="text-orange-400 fill-orange-400" size={14} />
                              <span className="text-sm font-bold">{tutor.rating}</span>
                              <span className="text-sm text-gray-400 font-medium">({tutor.reviews})</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2">
                          {tutor.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {tutor.specialties.map((s) => (
                            <span key={s} className="px-3 py-1 rounded-lg bg-gray-50 text-xs font-bold text-gray-600 uppercase tracking-wider">
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            onClick={() => setBookingTutor(tutor)}
                            className="flex-1 rounded-2xl h-14 bg-black hover:bg-gray-800 font-bold group"
                          >
                            Book a Session
                            <Calendar className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                          </Button>
                          <Button variant="outline" className="rounded-2xl h-14 font-bold border-gray-200">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
      
      {/* Booking Modal */}
      <BookingModal tutor={bookingTutor} onClose={() => setBookingTutor(null)} />
    </div>
  );
}
