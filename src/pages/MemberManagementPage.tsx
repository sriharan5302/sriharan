import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { MemberModal } from '../components/MemberModal';
import { Member, UserRole } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock
} from 'lucide-react';

export const MemberManagementPage: React.FC = () => {
  const {
    members,
    deleteMember,
    toggleMemberStatus,
    currentUser,
  } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  // Filtered members
  const filteredMembers = members.filter(m => {
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.contactInfo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const suspendedMembers = members.filter(m => m.status === 'suspended').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Patron &amp; Staff Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Member Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Register new library patrons, adjust roles, enforce borrowing quotas, and toggle account access.
          </p>
        </div>

        <button
          onClick={() => {
            setMemberToEdit(null);
            setIsModalOpen(true);
          }}
          id="register-member-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Register New Member
        </button>
      </div>

      {/* Member Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Enrolled</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{totalMembers}</div>
          <div className="text-xs text-slate-500 mt-1">Active institutional library accounts</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Good Standing</span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{activeMembers}</div>
          <div className="text-xs text-slate-500 mt-1">Unrestricted book borrowing permissions</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Suspended / On Hold</span>
          <div className="text-3xl font-extrabold text-rose-600 mt-2">{suspendedMembers}</div>
          <div className="text-xs text-slate-500 mt-1">Pending overdue settlement or disciplinary review</div>
        </div>
      </div>

      {/* Member List & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              id="search-member-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, ID..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Role Filter:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['all', 'admin', 'librarian', 'member'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1 text-xs font-semibold capitalize rounded-lg transition-colors ${
                    roleFilter === role
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Name &amp; Contact</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Membership Date</th>
                <th className="py-3 px-4">Borrowed Books</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map(member => (
                <tr key={member.memberId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600">{member.memberId}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block text-sm">{member.name}</span>
                    <span className="text-[11px] text-slate-400">{member.contactInfo || 'No phone'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{member.email}</td>
                  <td className="py-3 px-4">
                    {member.role === 'admin' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1 w-max">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                    {member.role === 'librarian' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                        <UserCheck className="w-3 h-3" /> Librarian
                      </span>
                    )}
                    {member.role === 'member' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1 w-max">
                        <GraduationCap className="w-3 h-3" /> Member
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{member.membershipDate}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${member.borrowedCount > 0 ? 'text-blue-700' : 'text-slate-500'}`}>
                      {member.borrowedCount}
                    </span>
                    <span className="text-slate-400"> / {member.maxBooksAllowed} max</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleMemberStatus(member.memberId)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-opacity hover:opacity-80 inline-flex items-center gap-1 ${
                        member.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                      title="Click to toggle active/suspended status"
                    >
                      {member.status === 'active' ? (
                        <>
                          <Unlock className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" /> Suspended
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setMemberToEdit(member);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                      title="Edit member"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMember(member.memberId)}
                      disabled={member.borrowedCount > 0}
                      className={`p-1.5 rounded-lg transition-colors inline-block ${
                        member.borrowedCount > 0
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title={member.borrowedCount > 0 ? 'Cannot delete member with active book loans' : 'Delete member'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No registered members match the current search filters.
          </div>
        )}
      </div>

      {/* Register/Edit Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMemberToEdit(null);
        }}
        memberToEdit={memberToEdit}
      />
    </div>
  );
};
