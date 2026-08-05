import React, { useEffect, useState } from 'react';
import { Card, Input, Table, Badge, Button, Modal, Avatar } from '@edukalyan/ui';
import { Search, UserX, UserCheck, Edit3, Filter } from 'lucide-react';
import { api } from '@/services/api';
import { UserProfile } from '@edukalyan/types';
import { formatDate } from '@edukalyan/utils';
import { useNotificationStore } from '@/stores/notificationStore';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const { addToast } = useNotificationStore();

  const loadUsers = async () => {
    setLoading(true);
    const data = await api.getUsers(search, statusFilter);
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [search, statusFilter]);

  const handleToggleStatus = async (user: UserProfile) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    await api.updateUserStatus(user.id, nextStatus);
    addToast({
      type: nextStatus === 'active' ? 'success' : 'warning',
      title: 'Status Updated',
      message: `User ${user.email} status set to ${nextStatus}.`,
    });
    loadUsers();
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRoleId) return;
    await api.updateUserRole(selectedUser.id, selectedRoleId);
    addToast({ type: 'success', title: 'Role Updated', message: `User role successfully assigned.` });
    setIsRoleModalOpen(false);
    loadUsers();
  };

  const columns = [
    {
      key: 'user',
      header: 'User Profile',
      render: (u: UserProfile) => (
        <div className="flex items-center gap-3">
          <Avatar src={u.avatar_url} fallback={(u.first_name?.[0] || u.email[0]).toUpperCase()} size="sm" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {u.first_name} {u.last_name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u: UserProfile) => (
        <Badge variant={u.role?.name === 'admin' ? 'danger' : 'info'} size="sm">
          {u.role?.name.toUpperCase() || 'USER'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u: UserProfile) => (
        <Badge
          variant={
            u.status === 'active' ? 'success' : u.status === 'suspended' ? 'warning' : 'neutral'
          }
          size="sm"
        >
          {u.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined Date',
      render: (u: UserProfile) => <span className="text-xs text-slate-500">{formatDate(u.created_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u: UserProfile) => (
        <div className="flex items-center gap-2">
          <Button
            variant={u.status === 'active' ? 'outline' : 'primary'}
            size="sm"
            onClick={() => handleToggleStatus(u)}
          >
            {u.status === 'active' ? (
              <>
                <UserX className="h-3.5 w-3.5 text-rose-500" /> Suspend
              </>
            ) : (
              <>
                <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Activate
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedUser(u);
              setSelectedRoleId(u.role_id);
              setIsRoleModalOpen(true);
            }}
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500" /> Edit Role
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">View, search, suspend, and assign security roles to users</p>
        </div>
      </div>

      <Card glass className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-2.5 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </Card>

      <Table
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        isLoading={loading}
        emptyMessage="No matching users found."
      />

      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Assign Security Role"
        description={`Update security privilege level for ${selectedUser?.email}`}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Select Role
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-2.5"
            >
              <option value="11111111-1111-1111-1111-111111111111">Admin (Full System Privilege)</option>
              <option value="22222222-2222-2222-2222-222222222222">User (Standard Access)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAssignRole}>
              Save Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
