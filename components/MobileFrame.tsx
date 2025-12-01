import React, { ReactNode } from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';

interface MobileFrameProps {
  children: ReactNode;
  headerTitle?: string;
  backgroundColor?: string;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ 
  children, 
  headerTitle = 'TeamTicket',
  backgroundColor = 'bg-gray-50'
}) => {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[750px] w-[375px] shadow-xl flex flex-col overflow-hidden">
      {/* Dynamic Island / Notch area */}
      <div className="h-[32px] bg-gray-800 w-full absolute top-0 left-0 z-20 flex items-center justify-between px-6">
         {/* Hidden for simpler look, just using the border as the frame */}
      </div>

      {/* Status Bar */}
      <div className={`w-full h-8 ${backgroundColor} flex justify-between items-center px-5 pt-2 text-xs font-medium z-10 text-gray-800`}>
        <span>9:41</span>
        <div className="flex gap-1.5 items-center">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={14} />
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 flex flex-col relative overflow-hidden ${backgroundColor}`}>
        {children}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-20"></div>
    </div>
  );
};

export default MobileFrame;
