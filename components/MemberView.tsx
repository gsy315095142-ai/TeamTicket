import React, { useState, useMemo } from 'react';
import { ArrowLeft, Share2, MoreHorizontal, User, Plus, Compass, ChevronLeft, Share } from 'lucide-react';
import { GroupTicket, MemberStep, Seat, UserInfo } from '../types';
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

  // Sync local step with prop if it changes
  React.useEffect(() => {
      setStep(initialStep);
  }, [initialStep]);

  // Calculate stats
  const bookedCount = useMemo(() => {
    if (!ticket) return 0;
    return ticket.slots.reduce((total, slot) => {
      return total + slot.seats.filter(s => s.user !== null).length;
    }, 0);
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 flex-col gap-2">
        <Share2 size={48} />
        <p>等待管理员发送团票...</p>
      </div>
    );
  }

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
            <ChevronLeft size={24} className="text-black -ml-2" />
            <span className="font-medium text-base">Lumi魔法空间 (8)</span>
          </div>
          <MoreHorizontal size={20} className="text-black" />
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="flex justify-center">
            <span className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded">10:30</span>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
               <div className="w-full h-full bg-[#8c7a72]"></div>
            </div>
            
            <div className="flex flex-col gap-1 items-start max-w-[85%]">
               <span className="text-xs text-gray-500">Lumi魔法空间</span>
               
               <div 
                 onClick={() => setStep('booking')}
                 className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer active:opacity-90 transition-opacity w-64 border border-gray-100"
               >
                 <div className="px-3 pt-3 pb-2 text-[15px] text-gray-800 font-medium">
                    邀请您成为团队负责人~
                 </div>

                 <div className="relative h-44 mx-3 rounded-lg overflow-hidden">
                    <img 
                      src={ticket.remarkImage || "https://images.unsplash.com/photo-1549520932-a8ed49548486?auto=format&fit=crop&q=80&w=600"} 
                      alt="Event" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                    <div className="absolute top-2 left-0 w-full px-2 text-center text-white/90 text-[10px] drop-shadow-md truncate">
                        北京·ClubMedJoyview延庆度假村
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-full text-center">
                        <h2 className="text-xl font-black text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide stroke-black" style={{textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>
                            {ticket.packageName || 'Lumi 魔法学院'}
                        </h2>
                        <div className="text-amber-200 text-xs font-bold tracking-widest mt-0.5" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>
                            魔法学院
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[38%] bg-[#fcf6e5] rounded-t-[1.5rem] flex flex-col items-center justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.2)] border-t border-[#eaddc5]">
                        <div className="text-[#8b5e3c] font-bold text-sm mb-0.5">
                            团队人数：{ticket.headcount}人
                        </div>
                        <div className="text-[#8b5e3c] text-[11px] font-medium">
                            预约日期 {ticket.selectedDate} {getWeekday(ticket.selectedDate)}
                        </div>
                    </div>
                 </div>

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

        <div className="h-12 bg-[#f7f7f7] border-t flex items-center px-3 gap-3">
          <div className="p-1.5 rounded-full"><Plus size={24} className="text-gray-700" strokeWidth={1.5} /></div>
          <div className="flex-1 bg-white h-9 rounded px-2" />
          <div className="p-1.5 rounded-full"><Share2 size={24} className="text-gray-700" strokeWidth={1.5} /></div>
        </div>
      </div>
    );
  }

  // Booking Page (New Design)
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* 1. Top Navigation & Banner */}
      <div className="relative h-48 shrink-0">
        <img 
          src={ticket.remarkImage || "https://images.unsplash.com/photo-1549520932-a8ed49548486?auto=format&fit=crop&q=80&w=600"} 
          alt="Event" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        {/* Custom Header Bar */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 text-white">
            <div 
                className="flex items-center gap-1 cursor-pointer drop-shadow-md"
                onClick={() => setStep('chat')}
            >
                <ChevronLeft size={24} />
                <span className="text-lg font-medium">返回首页</span>
            </div>
            <div className="p-1 rounded-md bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-colors">
                <Share size={20} />
            </div>
        </div>

        {/* Banner Text */}
        <div className="absolute top-10 left-0 w-full text-center text-white/90 text-xs drop-shadow-md">
            北京·ClubMedJoyview延庆度假村
        </div>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full text-center z-10">
             <h2 className="text-3xl font-black text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide stroke-black" style={{textShadow: '0 2px 4px rgba(0,0,0,0.9)'}}>
                {ticket.packageName || 'Lumi 魔法学院'}
            </h2>
        </div>
      </div>

      {/* 2. Info Dashboard */}
      <div className="bg-gradient-to-b from-[#6fbcfc] to-[#99d5ff] px-4 py-3 rounded-t-[1.5rem] -mt-4 relative z-10 shadow-lg text-white">
          <div className="text-center font-bold text-lg mb-1 drop-shadow-sm">
             预约日期 &nbsp;&nbsp; {ticket.selectedDate} &nbsp; {getWeekday(ticket.selectedDate)}
          </div>
          <div className="flex justify-center items-center gap-8 text-sm opacity-90 font-medium">
             <span>团队已预约: {bookedCount} 人</span>
             <span>团票上限: {ticket.headcount}</span>
          </div>
      </div>

      {/* 3. Grid Header */}
      <div className="px-2 pt-2">
         <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-1 text-center text-white text-xs font-bold leading-tight">
            <div className="bg-[#5daafc] rounded-md py-2 flex items-center justify-center shadow-sm">场次时间</div>
            <div className="bg-[#5daafc] rounded-md py-2 flex items-center justify-center shadow-sm">角色1</div>
            <div className="bg-[#5daafc] rounded-md py-2 flex items-center justify-center shadow-sm">角色2</div>
            <div className="bg-[#5daafc] rounded-md py-2 flex items-center justify-center shadow-sm">角色3</div>
            <div className="bg-[#5daafc] rounded-md py-2 flex items-center justify-center shadow-sm">角色4</div>
         </div>
      </div>

      {/* 4. Scrollable Grid Content */}
      <div className="flex-1 overflow-y-auto px-2 pb-8 pt-1 space-y-1">
        {ticket.slots.map((slot, sIndex) => {
            // Determine grid columns based on capacity
            // We always render 5 columns. Hall B will have empty spaces.
            return (
                <div key={slot.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-1 min-h-[70px]">
                    {/* Time Column */}
                    <div className="bg-[#f2f4f8] rounded-md flex flex-col justify-center items-center text-gray-500 text-[10px] font-medium p-1 border border-gray-100">
                        <div className="mb-0.5">
                            ({slot.hallType === 'A' ? 'A厅-大' : 'B厅-小'})
                        </div>
                        <div className="text-xs text-gray-800 font-bold mb-0.5">
                            {slot.time}
                        </div>
                        <div className="text-gray-400 scale-90">已开启</div>
                    </div>

                    {/* Seats */}
                    {[0, 1, 2, 3].map((colIndex) => {
                        // Hall B only has 2 seats (index 0 and 1). Index 2 and 3 should be empty spacers.
                        if (slot.hallType === 'B' && colIndex > 1) {
                            return <div key={`empty-${colIndex}`} className="rounded-md"></div>;
                        }

                        const seat = slot.seats[colIndex];
                        const isOccupied = seat && !!seat.user;

                        // Fallback if data is missing for some reason
                        if (!seat) return <div key={`missing-${colIndex}`} className="rounded-md"></div>;

                        return (
                            <button
                                key={seat.id}
                                onClick={() => openSeatModal(sIndex, colIndex, seat)}
                                className={`rounded-md border flex flex-col items-center justify-center p-1 transition-all active:scale-95 relative overflow-hidden ${
                                    isOccupied
                                        ? seat.user?.gender === 'Male'
                                            ? 'bg-[#eef6ff] border-[#daeaff]' // Male occupied
                                            : 'bg-[#fef2f2] border-[#ffe4e6]' // Female occupied (or generic)
                                        : 'bg-[#eef6ff] border-[#8abaf5] hover:bg-[#deeeff]' // Empty
                                }`}
                            >
                                {isOccupied ? (
                                    <>
                                        <div className={`text-[10px] font-bold mb-1 line-clamp-2 leading-tight px-1 break-all ${
                                            seat.user?.gender === 'Male' ? 'text-blue-600' : 'text-pink-500'
                                        }`}>
                                            {seat.user?.name}
                                        </div>
                                        <div className={`text-xs font-bold ${
                                            seat.user?.gender === 'Male' ? 'text-blue-400' : 'text-pink-400'
                                        }`}>
                                            {seat.user?.gender === 'Male' ? '♂' : '♀'}
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-[#6aaaf5] font-bold text-sm">
                                        占位
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            );
        })}
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
