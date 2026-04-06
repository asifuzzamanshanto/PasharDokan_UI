"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { mockApi } from "@/lib/api-mock";

interface ShopMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  active: boolean;
}

export default function ShopUsersPage() {
  const [members, setMembers] = useState<ShopMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();
  const canManageUsers = hasPermission("/shop/users");

  useEffect(() => {
    mockApi.shop.getMembers().then((res) => {
      setMembers(res.members as ShopMember[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const ROLE_LABELS: Record<string, string> = {
    owner: "Owner",
    manager: "Manager",
    seller: "Seller",
  };

  const ROLE_COLORS: Record<string, string> = {
    owner: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    seller: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div>
      <PageHeader title="Staff Management" description="Manage shop users and their roles" actions={canManageUsers ? <Button>+ Invite User</Button> : null} />

      {loading ? (
        <div className="text-center py-8 text-sm text-text-tertiary">Loading users...</div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-raised">
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Name</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Phone</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Role</th>
                  <th className="text-left text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                  <th className="text-right text-[11px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-surface-raised/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">{u.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-text-primary">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{u.phone}</td>
                    <td className="px-4 py-3"><Badge className={ROLE_COLORS[u.role] || "bg-gray-100 text-gray-700"}>{ROLE_LABELS[u.role] || u.role}</Badge></td>
                    <td className="px-4 py-3">{u.active ? <Badge variant="success">Active</Badge> : <Badge variant="default">Inactive</Badge>}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="xs" variant="ghost">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}