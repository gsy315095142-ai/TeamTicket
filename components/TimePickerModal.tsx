import React, { useState, useMemo, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { generateDailySlots, HALL_CONFIG, createEmptySeats, determinePriceTier } from '../constants';
import { TimeSlot, HallType } from '../types';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (slots: TimeSlot[], date: string, headcount: number) => void;
  initialDate?: string;
  initialSelected?: TimeSlot[];
  enableHeadcountEdit?: boolean;
  initialHeadcount?: number;
  onError?: (msg: string) => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
  initialSelected = [],
  enableHeadcountEdit = false,
  initialHeadcount = 0,
  onError,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [headcount, setHeadcount] = useState(initialHeadcount);
  
  // Update local state when props change (re-opening modal)
  useEffect(() => {
    if (isOpen) {
        setSelectedDate(initialDate || new Date().toISOString().split('T')[0]);
        setHeadcount(initialHeadcount);
        const map = new Map<string, TimeSlot>();
        initialSelected.forEach(s => map.set(`${s.time}|${s.hallType}`, s));
        setTempSelection(map);
    }
  }, [isOpen, initialDate, initialHeadcount, initialSelected]);

  // Local state to track selections before confirming
  // key: "time|hallType", value: TimeSlot
  const [tempSelection, setTempSelection] = useState<Map<string, TimeSlot>>(() => {
    const map = new Map<string, TimeSlot>();
    initialSelected.forEach(s => map.set(`${s.time}|${s.hallType}`, s));
    return map;
  });

  const dailySlots = useMemo(() => generateDailySlots(selectedDate), [selectedDate]);

  // Calculate total capacity
  const totalCapacity = useMemo(() => {
    return Array.from(tempSelection.values()).reduce((acc: number, slot: TimeSlot) => acc + slot.capacity, 0);
  }, [tempSelection]);

  if (!isOpen) return null;

  const toggleSlot = (time: string, hallType: HallType) => {
    const key = `${time}|${hallType}`;
    const newMap = new Map(tempSelection);

    if (newMap.has(key)) {
      newMap.delete(key);
    } else {
      newMap.set(key, {
        id: `${selectedDate}-${time}-${hallType}`,
        time,
        date: selectedDate,
        hallType,
        capacity: HALL_CONFIG[hallType].capacity,
        seats: createEmptySeats(HALL_CONFIG[hallType].capacity)
      });
    }
    setTempSelection(newMap);
  };

  const handleConfirm = () => {
    // Validation for Edit Mode
    if (enableHeadcountEdit) {
        if (totalCapacity < headcount) {
            if (onError) onError("当前选择的场次人数不足团票人数");
            return;
        }
    }
    
    onConfirm(Array.from(tempSelection.values()), selectedDate, headcount);
    onClose();
  };

  const priceTier = determinePriceTier(headcount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-lg max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">
            {enableHeadcountEdit ? '修改团票信息' : '选择预约场次'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Edit Headcount Section */}
          {enableHeadcountEdit && (
            <div className="mb-6 p-4 bg-[#eff4ff] rounded-xl space-y-4">
               <div className="flex items-center gap-4">
                  <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">团票数量</label>
                      <input 
                        type="number" 
                        value={headcount} 
                        onChange={(e) => setHeadcount(parseInt(e.target.value) || 0)}
                        className="w-full p-2 rounded-lg bg-white border border-blue-100 text-center font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
                      />
                  </div>
                  <div className="flex-[1.5]">
                      <label className="block text-xs font-medium text-gray-500 mb-1">团票档位</label>
                      <div className="w-full p-2 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-500 text-center">
                          {priceTier}
                      </div>
                  </div>
               </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">选择日期</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setTempSelection(new Map()); // Clear selection on date change
              }}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2 font-bold text-xs text-gray-400 text-center sticky top-0 bg-white py-2 border-b z-10">
            <div>时间</div>
            <div>A厅 (4人)</div>
            <div>B厅 (2人)</div>
          </div>

          <div className="space-y-2 pb-2">
            {dailySlots.map((slot) => {
              const keyA = `${slot.time}|A`;
              const keyB = `${slot.time}|B`;
              const isSelectedA = tempSelection.has(keyA);
              const isSelectedB = tempSelection.has(keyB);

              return (
                <div key={slot.id} className="grid grid-cols-3 gap-3 items-center">
                  <div className="text-center font-mono text-sm text-gray-600 bg-gray-50 py-1 rounded">{slot.time}</div>
                  
                  {/* Hall A Button */}
                  <button
                    onClick={() => toggleSlot(slot.time, 'A')}
                    className={`h-9 rounded-lg flex items-center justify-center transition-all border ${
                      isSelectedA 
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200' 
                        : 'bg-white text-gray-300 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {isSelectedA && <Check size={18} strokeWidth={3} />}
                  </button>

                  {/* Hall B Button */}
                  <button
                    onClick={() => toggleSlot(slot.time, 'B')}
                    className={`h-9 rounded-lg flex items-center justify-center transition-all border ${
                      isSelectedB
                        ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-200' 
                        : 'bg-white text-gray-300 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                     {isSelectedB && <Check size={18} strokeWidth={3} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="flex flex-col">
             <div className="text-sm font-medium text-gray-600">
                已选: <span className="text-blue-600 font-bold text-lg">{tempSelection.size}</span> 场
             </div>
             <div className={`text-xs ${enableHeadcountEdit && totalCapacity < headcount ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                可容纳: {totalCapacity} 人
             </div>
          </div>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimePickerModal;
