import React, { useState } from 'react';
import { ArrowLeft, Share2, MoreHorizontal, User, Plus, MapPin, Clock } from 'lucide-react';
import { GroupTicket, MemberStep, Seat, UserInfo } from '../types';
import { HALL_CONFIG } from '../constants';
import BookingModal from './BookingModal';

interface MemberViewProps {
  ticket: GroupTicket | null;
  onUpdateTicket: (updatedTicket: GroupTicket) => void;
  initialStep?: MemberStep;
}

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
      <div className="flex flex-col h-full bg-[#f2f2f2]">
        {/* WeChat Header */}
        <div className="h-12 bg-[#f2f2f2] border-b border-gray-300 flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center gap-1">
            <ArrowLeft size={20} className="text-black" />
            <span className="font-medium text-base">公司团建群 (8)</span>
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
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
              管
            </div>
            <div className="flex flex-col gap-1 items-start">
               <span className="text-xs text-gray-500">管理员</span>
               {/* Link Card */}
               <div 
                 onClick={() => setStep('booking')}
                 className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm max-w-[240px] cursor-pointer hover:bg-gray-50 transition-colors"
               >
                 <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{ticket.packageName}</h4>
                 <div className="flex gap-2">
                   {ticket.remarkImage ? (
                     <img src={ticket.remarkImage} alt="Cover" className="w-12 h-12 object-cover rounded" />
                   ) : (
                    <div className="w-12 h-12 bg-indigo-100 rounded flex items-center justify-center text-indigo-500">
                      <Share2 size={20} />
                    </div>
                   )}
                   <div className="flex-1 text-xs text-gray-500">
                     <p>{ticket.selectedDate}</p>
                     <p>邀请 {ticket.headcount} 人参与</p>
                   </div>
                 </div>
                 <div className="border-t mt-2 pt-1 text-[10px] text-gray-400">团票预约小程序</div>
               </div>
            </div>
          </div>
        </div>

        {/* Chat Input Placeholder */}
        <div className="h-12 bg-gray-100 border-t flex items-center px-3 gap-3">
          <div className="p-1.5 rounded-full border border-gray-400"><Plus size={16} /></div>
          <div className="flex-1 bg-white h-8 rounded px-2" />
          <div className="p-1.5 rounded-full border border-gray-400"><Share2 size={16} /></div>
        </div>
      </div>
    );
  }

  // Booking Page
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      {/* Booking Header */}
      <div className="relative h-40 bg-gray-800 shrink-0">
        <img 
          src={ticket.remarkImage || "https://picsum.photos/400/200"} 
          alt="Event" 
          className="w-full h-full object-cover opacity-60"
        />
        <button 
          onClick={() => setStep('chat')} 
          className="absolute top-4 left-4 p-2 bg-black/30 text-white rounded-full backdrop-blur-sm z-10"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900/90 to-transparent text-white">
          <h1 className="font-bold text-xl">{ticket.packageName}</h1>
          <div className="flex items-center gap-4 text-xs mt-1 text-gray-300">
            <span className="flex items-center gap-1"><Clock size={12}/> {ticket.selectedDate}</span>
            <span className="flex items-center gap-1"><User size={12}/> {ticket.headcount} 人</span>
          </div>
        </div>
      </div>

      {/* Ticket Info & Sessions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        
        {/* Remarks */}
        {ticket.remarks && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">公告/备注</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{ticket.remarks}</p>
          </div>
        )}

        {/* Sessions Loop */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">可选场次</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
               预约中
            </span>
          </div>

          {ticket.slots.map((slot, sIndex) => (
            <div key={slot.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="font-mono text-lg font-bold text-gray-800">{slot.time}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {slot.hallType === 'A' ? 'A厅(大)' : 'B厅(小)'}
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-400">
                  {slot.seats.filter(s => s.user).length}/{slot.capacity} 已占
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
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all relative ${
                        isOccupied 
                          ? 'bg-indigo-50 border border-indigo-100' 
                          : 'bg-white border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50'
                      }`}
                    >
                      {isOccupied ? (
                        <>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-1 ${
                            seat.user!.gender === 'Male' ? 'bg-blue-400' : 'bg-pink-400'
                          }`}>
                            {seat.user!.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[10px] font-medium text-gray-600 truncate w-full text-center">
                            {seat.user!.name}
                          </span>
                        </>
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                          <Plus size={20} />
                          <span className="text-[10px] mt-1">占位</span>
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