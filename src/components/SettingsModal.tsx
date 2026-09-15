import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, Sliders, Save, DollarSign, Calendar, BookOpen, Bell } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useLibrary();

  const [form, setForm] = useState({
    libraryName: settings.libraryName,
    finePerDay: settings.finePerDay,
    maxBorrowDays: settings.maxBorrowDays,
    maxBooksPerMember: settings.maxBooksPerMember,
    emailAlertsEnabled: settings.emailAlertsEnabled,
    academicYear: settings.academicYear,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      libraryName: form.libraryName,
      finePerDay: Number(form.finePerDay),
      maxBorrowDays: Number(form.maxBorrowDays),
      maxBooksPerMember: Number(form.maxBooksPerMember),
      emailAlertsEnabled: form.emailAlertsEnabled,
      academicYear: form.academicYear,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">System Configuration</h3>
              <p className="text-xs text-slate-500">Fine calculations, borrowing limits & library policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Library Name</label>
            <input
              type="text"
              value={form.libraryName}
              onChange={e => setForm({ ...form, libraryName: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                Fine Per Day ($ USD)
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={form.finePerDay}
                onChange={e => setForm({ ...form, finePerDay: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">Calculated automatically upon overdue dates</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Loan Period (Days)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={form.maxBorrowDays}
                onChange={e => setForm({ ...form, maxBorrowDays: parseInt(e.target.value) || 14 })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">Default due date duration</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Max Books per Member
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.maxBooksPerMember}
                onChange={e => setForm({ ...form, maxBooksPerMember: parseInt(e.target.value) || 4 })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Session</label>
              <input
                type="text"
                value={form.academicYear}
                onChange={e => setForm({ ...form, academicYear: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emailToggle"
                checked={form.emailAlertsEnabled}
                onChange={e => setForm({ ...form, emailAlertsEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="emailToggle" className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-slate-500" />
                Enable Automated Due Date Email Alerts
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-settings-btn"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
