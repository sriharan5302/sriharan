import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  Clock,
  AlertTriangle,
  BookmarkCheck,
  BookPlus,
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    setCurrentPage,
  } = useLibrary();

  const [filterType, setFilterType] = useState<'all' | 'due_reminder' | 'overdue' | 'reservation' | 'new_book'>('all');

  // Filter notifications for this user or broadcast
  const userNotifications = notifications.filter(
    n => n.memberId === 'all' || (currentUser && n.memberId === currentUser.memberId)
  );

  const filtered = userNotifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'due_reminder':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'reservation':
        return <BookmarkCheck className="w-5 h-5 text-emerald-600" />;
      case 'new_book':
        return <BookPlus className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case 'overdue':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Overdue Alert</span>;
      case 'due_reminder':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Due Reminder</span>;
      case 'reservation':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Reservation</span>;
      case 'new_book':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">New Arrival</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">System</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            Notification Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Library Alerts &amp; Updates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay informed on approaching return deadlines, overdue fines, arrival of requested books, and library notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            id="mark-all-read-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors shadow-xs shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filterType === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Notices ({userNotifications.length})
        </button>
        <button
          onClick={() => setFilterType('due_reminder')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filterType === 'due_reminder'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Due Reminders
        </button>
        <button
          onClick={() => setFilterType('overdue')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filterType === 'overdue'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Overdue Alerts
        </button>
        <button
          onClick={() => setFilterType('reservation')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filterType === 'reservation'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Hold Reservations
        </button>
        <button
          onClick={() => setFilterType('new_book')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filterType === 'new_book'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          New Books
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => markNotificationAsRead(item.id)}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer ${
              !item.read
                ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  {getBadge(item.type)}
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  {item.message}
                </p>

                <div className="text-[11px] text-slate-400 pt-1">
                  Received on {item.date}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {item.actionUrl && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setCurrentPage(item.actionUrl as any);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100/60 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={e => {
                  e.stopPropagation();
                  deleteNotification(item.id);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Dismiss notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Inbox is Clear</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any notifications matching this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
