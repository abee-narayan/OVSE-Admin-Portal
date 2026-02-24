"use client";
// L4 User Management — full authority page (approval of L3 requests + direct add)
import { L4UserManagement } from "@/components/admin/l4-user-management";

export default function L4UsersPage() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    Approve or reject L3 user change requests. As L4 Super Admin you can also add users directly with immediate effect.
                </p>
            </div>
            <L4UserManagement />
        </div>
    );
}
