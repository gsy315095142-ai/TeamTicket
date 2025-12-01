import React, { useState } from 'react';
import { ArrowLeft, Share2, MoreHorizontal, User, Plus, MapPin, Clock, Compass } from 'lucide-react';
import { GroupTicket, MemberStep, Seat, UserInfo } from '../types';
import { HALL_CONFIG } from '../constants';
import BookingModal from './BookingModal';

interface MemberViewProps {
  ticket: GroupTicket | null;
  onUpdateTicket: (updatedTicket: GroupTicket) => void;
  initialStep?: MemberStep;
}

const getWeekday = (dateStr: string) => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const date = new Date(dateStr);
  return days[date.getDay()];
};

const MemberView: React.FC<MemberViewProps> = ({ ticket, onUpdateTicket, initialStep = 'chat' }) => {
  const [step, setStep] = useState<MemberStep>(initialStep);
  const [selectedSeat, setSelectedSeat] = useState<{ slotIndex: number, seatIndex: number, seat: Seat } | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // If initialStep prop changes from parent (e.g. clicking Send button), update local step
  React.useEffect(() => {
      setStep(initialStep);
  }, [initialStep]);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 flex-col gap-2">
        <Share2 size={48} />
        <p>等待管理员发送团票...</p>
      </div>
    );
  }

  // Handle seat occupation/modification
  const handleSeatAction = (info: UserInfo) => {
    if (!selectedSeat) return;
    
    const newSlots = [...ticket.slots];
    const targetSlot = newSlots[selectedSeat.slotIndex];
    const targetSeat = targetSlot.seats[selectedSeat.seatIndex];

    targetSeat.user = info;

    onUpdateTicket({ ...ticket, slots: newSlots });
  };

  const handleSeatRelease = () => {
    if (!selectedSeat) return;
    
    const newSlots = [...ticket.slots];
    const targetSlot = newSlots[selectedSeat.slotIndex];
    const targetSeat = targetSlot.seats[selectedSeat.seatIndex];

    targetSeat.user = null;

    onUpdateTicket({ ...ticket, slots: newSlots });
  };

  const openSeatModal = (slotIndex: number, seatIndex: number, seat: Seat) => {
    setSelectedSeat({ slotIndex, seatIndex, seat });
    setIsBookingModalOpen(true);
  };

  if (step === 'chat') {
    return (
      <div className="flex flex-col h-full bg-[#ededed]">
        {/* WeChat Header */}
        <div className="h-12 bg-[#ededed] border-b border-gray-300 flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center gap-1">
            <ArrowLeft size={20} className="text-black" />
            <span className="font-medium text-base">Lumi魔法空间 (8)</span>
          </div>
          <MoreHorizontal size={20} className="text-black" />
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Timestamp */}
          <div className="flex justify-center">
            <span className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded">10:30</span>
          </div>

          {/* Incoming Message */}
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
               {/* Placeholder Avatar */}
               <div className="w-full h-full bg-[#8c7a72]"></div>
            </div>
            
            <div className="flex flex-col gap-1 items-start max-w-[85%]">
               <span className="text-xs text-gray-500">Lumi魔法空间</span>
               
               {/* Mini Program Card */}
               <div 
                 onClick={() => setStep('booking')}
                 className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer active:opacity-90 transition-opacity w-64 border border-gray-100"
               >
                 {/* Top Invitation Text */}
                 <div className="px-3 pt-3 pb-2 text-[15px] text-gray-800 font-medium">
                    邀请您成为团队负责人~
                 </div>

                 {/* Rich Media Content */}
                 <div className="relative h-44 mx-3 rounded-lg overflow-hidden">
                    <img 
                      src={ticket.remarkImage || "https://images.unsplash.com/photo-1549520932-a8ed49548486?auto=format&fit=crop&q=80&w=600"} 
                      alt="Event" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

                    {/* Top Location Text */}
                    <div className="absolute top-2 left-0 w-full px-2 text-center text-white/90 text-[10px] drop-shadow-md truncate">
                        北京·ClubMedJoyview延庆度假村
                    </div>

                    {/* Center Title Logo Text */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-full text-center">
                        <h2 className="text-xl font-black text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide stroke-black" style={{textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>
                            {ticket.packageName || 'Lumi 魔法学院'}
                        </h2>
                        <div className="text-amber-200 text-xs font-bold tracking-widest mt-0.5" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>
                            魔法学院
                        </div>
                    </div>

                    {/* Bottom Beige Info Box */}
                    <div className="absolute bottom-0 left-0 w-full h-[38%] bg-[#fcf6e5] rounded-t-[1.5rem] flex flex-col items-center justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.2)] border-t border-[#eaddc5]">
                        <div className="text-[#8b5e3c] font-bold text-sm mb-0.5">
                            团队人数：{ticket.headcount}人
                        </div>
                        <div className="text-[#8b5e3c] text-[11px] font-medium">
                            预约日期 {ticket.selectedDate} {getWeekday(ticket.selectedDate)}
                        </div>
                    </div>
                 </div>

                 {/* Footer */}
                 <div className="px-3 py-2 flex items-center gap-1.5">
                   <div className="w-3.5 h-3.5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                     <Compass size={10} strokeWidth={3} />
                   </div>
                   <span className="text-[10px] text-gray-400">小程序</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Chat Input Placeholder */}
        <div className="h-12 bg-[#f7f7f7] border-t flex items-center px-3 gap-3">
          <div className="p-1.5 rounded-full"><Plus size={24} className="text-gray-700" strokeWidth={1.5} /></div>
          <div className="flex-1 bg-white h-9 rounded px-2" />
          <div className="p-1.5 rounded-full"><Share2 size={24} className="text-gray-700" strokeWidth={1.5} /></div>
        </div>
      </div>
    );
  }

  // Booking Page
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      {/* Booking Header */}
      <div className="relative h-48 bg-gray-800 shrink-0">
        <img 
          src={ticket.remarkImage || "https://images.unsplash.com/photo-1549520932-a8ed49548486?auto=format&fit=crop&q=80&w=600"} 
          alt="Event" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
        
        <button 
          onClick={() => setStep('chat')} 
          className="absolute top-10 left-4 p-2 bg-white/20 text-white rounded-full backdrop-blur-md z-10 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div className="absolute bottom-0 left-0 w-full p-5 text-white">
          <div className="inline-block px-2 py-0.5 bg-amber-400 text-black text-[10px] font-bold rounded mb-2">
            团队预约
          </div>
          <h1 className="font-bold text-2xl mb-2 text-white shadow-black drop-shadow-sm">{ticket.packageName}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-100 font-medium">
            <span className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                <Clock size={12}/> {ticket.selectedDate}
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                <User size={12}/> {ticket.headcount} 人
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Info & Sessions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 bg-gray-50">
        
        {/* Remarks */}
        {ticket.remarks && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                公告/备注
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{ticket.remarks}</p>
          </div>
        )}

        {/* Sessions Loop */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-800 text-lg">可选场次</h3>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-100">
               预约进行中
            </span>
          </div>

          {ticket.slots.map((slot, sIndex) => (
            <div key={slot.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
              <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xl font-bold text-gray-800 tracking-tight">{slot.time}</div>
                  <div className={`text-xs px-2 py-0.5 rounded border ${
                      slot.hallType === 'A' 
                      ? 'bg-blue-50 text-blue-600 border-blue-100' 
                      : 'bg-purple-50 text-purple-600 border-purple-100'
                  }`}>
                     {slot.hallType === 'A' ? 'A厅 · 大厅' : 'B厅 · 小厅'}
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-400">
                  <span className="text-gray-800 font-bold">{slot.seats.filter(s => s.user).length}</span>
                  <span className="mx-0.5">/</span>
                  {slot.capacity} 已占
                </div>
              </div>

              {/* Seats Grid */}
              <div className="p-4 grid grid-cols-4 gap-3">
                {slot.seats.map((seat, seatIndex) => {
                  const isOccupied = !!seat.user;
                  return (
                    <button
                      key={seat.id}
                      onClick={() => openSeatModal(sIndex, seatIndex, seat)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all relative group ${
                        isOccupied 
                          ? 'bg-indigo-50 border border-indigo-100 shadow-sm' 
                          : 'bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-emerald-100'
                      }`}
                    >
                      {isOccupied ? (
                        <>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-1 shadow-sm ${
                            seat.user!.gender === 'Male' ? 'bg-blue-400' : 'bg-pink-400'
                          }`}>
                            {seat.user!.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[10px] font-medium text-gray-600 truncate w-full text-center px-1">
                            {seat.user!.name}
                          </span>
                        </>
                      ) : (
                        <div className="text-gray-300 flex flex-col items-center group-hover:text-emerald-500 transition-colors">
                          <Plus size={20} strokeWidth={2} />
                          <span className="text-[10px] mt-1 font-medium">占位</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleSeatAction}
        onDelete={selectedSeat?.seat.user ? handleSeatRelease : undefined}
        initialInfo={selectedSeat?.seat.user || null}
      />
    </div>
  );
};

export default MemberView;