import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserProfileProps {
  variant?: 'banner' | 'modal' | 'header-menu';
  isOpen?: boolean;
  onClose?: () => void;
  stats?: {
    totalApplications: number;
    queueCount: number;
    historyCount: number;
  };
}

export const UserProfile: React.FC<UserProfileProps> = ({
  variant = 'banner',
  isOpen = false,
  onClose,
  stats,
}) => {
  const { user, logout, updateProfile, getRegisteredAccounts, switchAccount } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editCollege, setEditCollege] = useState(user?.college || 'School of Computer Science & Engineering');
  const [editMajor, setEditMajor] = useState(user?.major || 'B.Tech Computer Science');
  const [editTargetRole, setEditTargetRole] = useState(user?.targetRole || 'Software Development Engineer Intern');
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditMessage({ type: 'error', text: 'Full Name cannot be empty.' });
      return;
    }

    setIsSaving(true);
    setEditMessage(null);

    const res = await updateProfile({
      name: editName.trim(),
      college: editCollege.trim(),
      major: editMajor.trim(),
      targetRole: editTargetRole.trim(),
    });

    setIsSaving(false);

    if (res.success) {
      setEditMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        setIsEditing(false);
        setEditMessage(null);
      }, 1000);
    } else {
      setEditMessage({ type: 'error', text: res.message || 'Failed to update profile.' });
    }
  };

  const handleSwitchAccount = async (targetId: string) => {
    const success = await switchAccount(targetId);
    if (success) {
      setShowAccountSwitcher(false);
      setIsDropdownOpen(false);
      if (onClose) onClose();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // -------------------------------------------------------------
  // VARIANT 1: HEADER TRIGGER (Simple navbar profile item)
  // -------------------------------------------------------------
  if (variant === 'header-menu') {
    return (
      <div className="relative">
        <button
          type="button"
          id="user-profile-header-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-left text-xs cursor-pointer text-gray-800"
        >
          <div className="w-6 h-6 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 truncate max-w-[120px]">{user.name}</span>
          <span className="text-gray-500 text-[10px]">▼</span>
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-300 rounded shadow-md z-50 p-3 text-xs text-gray-700">
              <div className="pb-2 mb-2 border-b border-gray-200">
                <p className="font-bold text-gray-900">{user.name}</p>
                <p className="text-gray-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-green-100 text-green-800 border border-green-200">
                  Active Session
                </span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsEditing(true);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded text-blue-600 font-medium"
                >
                  Edit Profile Details
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-1.5 hover:bg-red-50 text-red-600 rounded font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}

        {isEditing && (
          <SimpleEditModal
            name={editName}
            setName={setEditName}
            college={editCollege}
            setCollege={setEditCollege}
            major={editMajor}
            setMajor={setEditMajor}
            targetRole={editTargetRole}
            setTargetRole={setEditTargetRole}
            email={user.email}
            message={editMessage}
            isSaving={isSaving}
            onSave={handleSaveProfile}
            onClose={() => setIsEditing(false)}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 2: MODAL DIALOG
  // -------------------------------------------------------------
  if (variant === 'modal') {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white border border-gray-300 rounded-lg max-w-md w-full p-6 text-gray-800">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900">Student Profile</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500 text-xs block">Full Name</span>
              <p className="font-semibold text-gray-900">{user.name}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Email Address</span>
              <p className="text-gray-800 font-mono text-xs">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">College</span>
              <p className="text-gray-800">{user.college || 'School of Computer Science & Engineering'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Major / Degree</span>
              <p className="text-gray-800">{user.major || 'B.Tech Computer Science'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Target Role</span>
              <p className="text-gray-800">{user.targetRole || 'Software Engineering Intern'}</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-red-300 text-red-600 hover:bg-red-50 text-xs font-medium py-1.5 px-3 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {isEditing && (
          <SimpleEditModal
            name={editName}
            setName={setEditName}
            college={editCollege}
            setCollege={setEditCollege}
            major={editMajor}
            setMajor={setEditMajor}
            targetRole={editTargetRole}
            setTargetRole={setEditTargetRole}
            email={user.email}
            message={editMessage}
            isSaving={isSaving}
            onSave={handleSaveProfile}
            onClose={() => setIsEditing(false)}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 3: DASHBOARD BANNER (Simple college project style)
  // -------------------------------------------------------------
  return (
    <div
      id="dashboard-user-profile-banner"
      className="mb-6 bg-white border border-gray-300 rounded-lg p-5 text-gray-800"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-200">
        {/* User Identity Info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded bg-blue-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">
                Welcome, {user.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-800 border border-green-300">
                Session Active
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
              <p>
                Email: <strong className="text-gray-900">{user.email}</strong>
              </p>
              <span>•</span>
              <p>
                College: <span className="text-gray-800">{user.college || 'School of Computer Science & Engineering'}</span>
              </p>
              <span>•</span>
              <p>
                Major: <span className="text-gray-800">{user.major || 'B.Tech Computer Science'}</span>
              </p>
              <span>•</span>
              <p>
                Target Role: <span className="text-gray-800">{user.targetRole || 'SDE Intern'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Simple blue & grey buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="user-profile-banner-edit-btn"
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-medium py-1.5 px-3 rounded cursor-pointer"
          >
            Switch Account ({getRegisteredAccounts().length})
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="border border-gray-300 hover:bg-red-50 text-red-600 text-xs font-medium py-1.5 px-3 rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Account Switcher Section if toggled */}
      {showAccountSwitcher && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Switch Registered Student:</span>
            <div className="space-x-3">
              <Link to="/signup" className="text-blue-600 hover:underline">
                + Sign Up New Account
              </Link>
              <Link to="/login" className="text-blue-600 hover:underline">
                Login with other email
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {getRegisteredAccounts().map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSwitchAccount(acc.id)}
                className={`p-2 text-left rounded border transition-colors ${
                  acc.id === user.id
                    ? 'bg-blue-50 border-blue-400 font-semibold text-blue-900'
                    : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex justify-between">
                  <span>{acc.name}</span>
                  {acc.id === user.id && <span className="text-blue-600 text-[10px]">Current</span>}
                </div>
                <div className="text-gray-500 text-[11px] font-mono">{acc.email}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats row: Basic light gray boxes */}
      {stats && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-gray-50 border border-gray-200 rounded p-2.5">
            <span className="text-gray-500 block text-[11px]">Applications Tracked</span>
            <span className="text-base font-bold text-gray-900">{stats.totalApplications}</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded p-2.5">
            <span className="text-gray-500 block text-[11px]">Review Queue (FIFO)</span>
            <span className="text-base font-bold text-gray-900">{stats.queueCount}</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded p-2.5">
            <span className="text-gray-500 block text-[11px]">Undo Action Stack (LIFO)</span>
            <span className="text-base font-bold text-gray-900">{stats.historyCount}</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded p-2.5">
            <span className="text-gray-500 block text-[11px]">Backend Database</span>
            <span className="text-xs font-bold text-blue-700 block mt-1">
              C SQLite3 (Isolated)
            </span>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <SimpleEditModal
          name={editName}
          setName={setEditName}
          college={editCollege}
          setCollege={setEditCollege}
          major={editMajor}
          setMajor={setEditMajor}
          targetRole={editTargetRole}
          setTargetRole={setEditTargetRole}
          email={user.email}
          message={editMessage}
          isSaving={isSaving}
          onSave={handleSaveProfile}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

// Simple Edit Modal
interface SimpleEditModalProps {
  name: string;
  setName: (v: string) => void;
  college: string;
  setCollege: (v: string) => void;
  major: string;
  setMajor: (v: string) => void;
  targetRole: string;
  setTargetRole: (v: string) => void;
  email: string;
  message: { type: 'success' | 'error'; text: string } | null;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

const SimpleEditModal: React.FC<SimpleEditModalProps> = ({
  name,
  setName,
  college,
  setCollege,
  major,
  setMajor,
  targetRole,
  setTargetRole,
  email,
  message,
  isSaving,
  onSave,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white border border-gray-300 rounded-lg max-w-md w-full p-5 text-gray-800">
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-200">
          <h3 className="font-bold text-sm text-gray-900">Edit Student Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {message && (
          <div
            className={`mb-3 p-2 rounded text-xs border ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-300'
                : 'bg-red-50 text-red-800 border-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email (Account ID)</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs text-gray-500 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">College / University</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Degree / Major</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
