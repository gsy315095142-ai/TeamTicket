import React, { useState } from 'react';
import { UserCheck, Users } from 'lucide-react';
import MobileFrame from './components/MobileFrame';
import StaffView from './components/StaffView';
import MemberView from './components/MemberView';
import { GroupTicket, ViewMode, MemberStep } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('staff');
  const [tickets, setTickets] = useState<GroupTicket[]>([]);
  // We use the most recently active ticket for the member view simulation
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  
  // Specific state to trigger the member view flow correctly
  const [memberViewStep, setMemberViewStep] = useState<MemberStep>('chat');

  const activeTicket = tickets.find(t => t.id === activeTicketId) || tickets[0] || null;

  const handleSendTicket = (ticket: GroupTicket) => {
    setActiveTicketId(ticket.id);
    setCurrentView('member');
    setMemberViewStep('chat');
  };

  const handleUpdateTicket = (updatedTicket: GroupTicket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const switchToStaff = () => {
      setCurrentView('staff');
  };

  const switchToMember = () => {
      // If no active ticket, try to pick the first one
      if (!activeTicketId && tickets.length > 0) {
          setActiveTicketId(tickets[0].id);
      }
      setCurrentView('member');
      setMemberViewStep('chat');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 font-sans text-gray-800">
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 h-[85vh]">
        
        {/* Left Side: Navigation / Flowchart */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-12 relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-indigo-500 to-green-500 opacity-20 hidden lg:block rounded-full"></div>

            {/* Staff Button */}
            <div className="relative pl-0 lg:pl-16">
                 {/* Node Circle */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-indigo-500 rounded-full border-4 border-gray-900 hidden lg:block shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                
                <button
                    onClick={switchToStaff}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group ${
                        currentView === 'staff' 
                        ? 'bg-gray-800 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.15)]' 
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-indigo-500/50'
                    }`}
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className={`p-3 rounded-lg ${currentView === 'staff' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'}`}>
                            <UserCheck size={28} />
                        </div>
                        <h2 className={`text-xl font-bold ${currentView === 'staff' ? 'text-white' : 'text-gray-300'}`}>工作人员：团票的生成与修改</h2>
                    </div>
                    <p className="text-gray-400 text-sm pl-[60px]">设定团票信息，生成分享链接</p>
                </button>
            </div>

            {/* Member Button */}
            <div className="relative pl-0 lg:pl-16">
                 {/* Node Circle */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full border-4 border-gray-900 hidden lg:block shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>

                <button
                    onClick={switchToMember}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group ${
                        currentView === 'member' 
                        ? 'bg-gray-800 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]' 
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-green-500/50'
                    }`}
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className={`p-3 rounded-lg ${currentView === 'member' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400 group-hover:bg-green-500/20 group-hover:text-green-400'}`}>
                            <Users size={28} />
                        </div>
                        <h2 className={`text-xl font-bold ${currentView === 'member' ? 'text-white' : 'text-gray-300'}`}>团队人员：预约与占位</h2>
                    </div>
                    <p className="text-gray-400 text-sm pl-[60px]">点击分享链接，选择场次并占位</p>
                </button>
            </div>
        </div>

        {/* Right Side: Mobile Simulator */}
        <div className="lg:col-span-7 flex items-center justify-center">
            <MobileFrame 
                headerTitle={currentView === 'staff' ? '票券' : '微信'}
                backgroundColor={currentView === 'staff' ? 'bg-[#f6f7f9]' : 'bg-[#ededed]'}
            >
                {currentView === 'staff' ? (
                    <StaffView 
                        tickets={tickets} 
                        setTickets={setTickets} 
                        onSendTicket={handleSendTicket} 
                    />
                ) : (
                    <MemberView 
                        ticket={activeTicket} 
                        onUpdateTicket={handleUpdateTicket}
                        initialStep={memberViewStep}
                    />
                )}
            </MobileFrame>
        </div>

      </div>
    </div>
  );
};

export default App;