import React, { useState } from 'react';
import { UserInfo } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (info: UserInfo) => void;
  onDelete?: () => void;
  initialInfo: UserInfo | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onDelete,
  initialInfo 
}) => {
  const [name, setName] = useState(initialInfo?.name || '');
  const [gender, setGender] = useState<'Male' | 'Female'>(initialInfo?.gender || 'Male');
  const [phone, setPhone] = useState(initialInfo?.phone || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return; // Simple validation
    onConfirm({ name, gender, phone });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {initialInfo ? 'Edit Details' : 'Reserve Spot'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name / Nickname</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  checked={gender === 'Male'} 
                  onChange={() => setGender('Male')}
                  className="text-green-600 focus:ring-green-500"
                /> 
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  checked={gender === 'Female'} 
                  onChange={() => setGender('Female')}
                  className="text-green-600 focus:ring-green-500"
                /> 
                <span>Female</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="13800138000"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            {initialInfo && onDelete && (
              <button 
                type="button"
                onClick={() => { onDelete(); onClose(); }}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
              >
                Release
              </button>
            )}
            <button 
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 shadow-md"
            >
              {initialInfo ? 'Update' : 'Confirm'}
            </button>
          </div>
        </form>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
