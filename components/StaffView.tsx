import React, { useState, useRef } from 'react';
import { Plus, List, Calendar, Image as ImageIcon, Send, Edit, Trash2, X } from 'lucide-react';
import { GroupTicket, TimeSlot, StaffTab } from '../types';
import TimePickerModal from './TimePickerModal';

interface StaffViewProps {
  tickets: GroupTicket[];
  setTickets: React.Dispatch<React.SetStateAction<GroupTicket[]>>;
  onSendTicket: (ticket: GroupTicket) => void;
}

const StaffView: React.FC<StaffViewProps> = ({ tickets, setTickets, onSendTicket }) => {
  const [activeTab, setActiveTab] = useState<StaffTab>('create');
  
  // Form State
  const [headcount, setHeadcount] = useState<string>('18');
  const [priceTier, setPriceTier] = useState<string>('50元 (15-20人)');
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [remarkImage, setRemarkImage] = useState<string | undefined>(undefined);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRemarkImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const determinePriceTier = (count: number) => {
    if (count <= 20) return '50元 (15-20人)';
    if (count <= 30) return '80元 (21-30人)';
    return '120元 (31-50人)';
  };

  const handleHeadcountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeadcount(val);
    const count = parseInt(val, 10);
    if (!isNaN(count)) {
      setPriceTier(determinePriceTier(count));
    }
  };

  const handleCreateTicket = () => {
    if (selectedSlots.length === 0) {
      showToast("请至少选择一个场次。");
      return;
    }

    const numHeadcount = parseInt(headcount) || 0;
    const currentCapacity = selectedSlots.reduce((acc, slot) => acc + slot.capacity, 0);

    if (currentCapacity < numHeadcount) {
      showToast("当前选择的场次人数不足团票人数");
      return;
    }

    const newTicket: GroupTicket = {
      id: Date.now().toString(),
      packageName: '团票',
      headcount: numHeadcount,
      priceTier,
      selectedDate,
      slots: selectedSlots,
      remarks,
      remarkImage,
      createdAt: Date.now(),
    };

    setTickets(prev => [newTicket, ...prev]);
    setActiveTab('list');
    
    // Reset form
    setHeadcount('18');
    setPriceTier('50元 (15-20人)');
    setSelectedSlots([]);
    setRemarks('');
    setRemarkImage(undefined);
  };

  const totalCapacity = selectedSlots.reduce((acc, slot) => acc + slot.capacity, 0);

  return (
    <div className="flex flex-col h-full bg-[#f6f7f9] relative">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/75 text-white px-6 py-3 rounded-lg text-sm font-medium z-50 transition-opacity animate-in fade-in zoom-in duration-200 text-center shadow-lg backdrop-blur-sm max-w-[80%] pointer-events-none">
          {toast}
        </div>
      )}

      {/* Header Tabs */}
      <div className="flex bg-white shadow-sm z-10">
        <button
          className={`flex-1 py-4 text-[15px] font-bold relative transition-colors ${
            activeTab === 'create' ? 'text-blue-600' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('create')}
        >
          生成票券
          {activeTab === 'create' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-blue-600 rounded-full" />
          )}
        </button>
        <button
          className={`flex-1 py-4 text-[15px] font-bold relative transition-colors ${
            activeTab === 'list' ? 'text-blue-600' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('list')}
        >
          票券列表
          {activeTab === 'list' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {activeTab === 'create' ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
            
            {/* Package Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">请选择套餐类型：</label>
              <div className="relative">
                 <select className="w-full bg-[#eff4ff] text-gray-700 py-3 px-4 rounded-xl appearance-none outline-none font-medium cursor-pointer">
                    <option>团票</option>
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none text-xs">▼</div>
              </div>
            </div>

            {/* Headcount & Price */}
            <div className="flex gap-3">
               <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">团票数量：</label>
                <div className="bg-[#eff4ff] rounded-xl px-2">
                    <input
                    type="number"
                    value={headcount}
                    onChange={handleHeadcountChange}
                    className="w-full bg-transparent py-2.5 text-center font-medium text-gray-700 outline-none"
                    />
                </div>
              </div>
              <div className="flex-[1.5]">
                <label className="block text-sm font-medium text-gray-700 mb-2">团票档位：</label>
                <div className="bg-[#f0f0f0] rounded-xl px-2 relative">
                    <select
                    value={priceTier}
                    disabled
                    className="w-full bg-transparent py-2.5 px-2 text-sm text-gray-500 outline-none appearance-none cursor-not-allowed"
                    >
                        <option>50元 (15-20人)</option>
                        <option>80元 (21-30人)</option>
                        <option>120元 (31-50人)</option>
                    </select>
                </div>
              </div>
            </div>

            {/* Slot Selection Block */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">团票场次：</label>
              <div className="bg-[#eff4ff] rounded-xl p-4 mb-4">
                 <div className="flex items-center text-[13px] mb-2">
                    <span className="text-gray-400 w-20">预约日期</span>
                    <span className="text-gray-700 font-medium">{selectedDate}</span>
                 </div>
                 <div className="flex items-center text-[13px]">
                    <span className="text-gray-400 w-20">预约场次</span>
                    <span className="text-gray-700 font-medium">
                        {selectedSlots.length > 0 ? `${selectedSlots.length}场 (可容纳${totalCapacity}人)` : '未选择'}
                    </span>
                 </div>
              </div>
              
              <div className="flex justify-center">
                  <button
                    onClick={() => setIsTimePickerOpen(true)}
                    className="bg-[#4f83f1] hover:bg-blue-600 text-white py-2 px-10 rounded-lg text-sm font-medium shadow-lg shadow-blue-200 transition-all active:scale-95"
                  >
                    选择场次
                  </button>
              </div>
            </div>

            {/* Remarks & Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注信息：</label>
              <div className="bg-[#eff4ff] rounded-xl p-3 h-32 relative">
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="可输入关联订单信息"
                    className="w-full h-full bg-transparent resize-none text-sm text-gray-600 placeholder-gray-400 outline-none pr-20"
                />
                
                {/* Image Upload Area */}
                <div 
                    className="absolute bottom-3 right-3 w-20 h-20 bg-[#e0e7ff] border border-blue-200 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {remarkImage ? (
                    <>
                        <img src={remarkImage} alt="Remark" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                            <Edit className="text-white" size={16}/>
                        </div>
                    </>
                    ) : (
                    <div className="text-blue-300">
                        <Plus size={28} strokeWidth={2.5} />
                    </div>
                    )}
                    <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    />
                </div>
                {remarkImage && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setRemarkImage(undefined); }}
                        className="absolute bottom-[4.5rem] right-2 bg-gray-200 rounded-full p-0.5 text-gray-500 hover:bg-red-500 hover:text-white"
                    >
                        <X size={12} />
                    </button>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                <List size={48} className="text-gray-200 mb-4" />
                <div className="mb-2">暂无团票记录</div>
                <button onClick={() => setActiveTab('create')} className="text-blue-500 underline text-sm">去生成一张</button>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{ticket.packageName}</h4>
                      <p className="text-xs text-gray-400 mt-1">{new Date(ticket.createdAt).toLocaleString('zh-CN')}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md font-medium border border-green-100">生效中</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-blue-400"/> 
                       <span className="font-medium">日期：</span>{ticket.selectedDate}
                    </div>
                    <div className="flex items-center gap-2">
                       <List size={14} className="text-blue-400"/>
                       <span className="font-medium">场次：</span>{ticket.slots.length} 个场次 ({ticket.headcount}人)
                    </div>
                    {ticket.remarks && (
                        <div className="text-xs text-gray-400 mt-1 pl-6 line-clamp-1 border-t border-dashed border-gray-200 pt-1">
                            备注: {ticket.remarks}
                        </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors">
                      <Edit size={14} /> 修改
                    </button>
                    <button 
                      onClick={() => onSendTicket(ticket)}
                      className="flex-1 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-1 shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                    >
                      <Send size={14} /> 发送
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Fixed Bottom Button for Create Tab */}
      {activeTab === 'create' && (
        <div className="p-6 bg-[#f6f7f9]">
            <button
              onClick={handleCreateTicket}
              className="w-full bg-gradient-to-r from-[#4adce3] to-[#4f83f1] text-white py-3.5 rounded-full font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-blue-300 transform active:scale-[0.98] transition-all"
            >
              申请生成团票
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3">
                申请通过后，即可在票券列表查看团队预约链接
            </p>
        </div>
      )}
      
      <TimePickerModal 
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onConfirm={(slots, date) => {
          setSelectedSlots(slots);
          setSelectedDate(date);
        }}
        initialDate={selectedDate}
        initialSelected={selectedSlots}
      />
    </div>
  );
};

export default StaffView;