"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import AdminSidebar from "../components/admin-sidebar";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  address?: string;
  workType?: string;
  createdAt: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      window.location.href = "/admin-login";
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/admin/users`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/admin/delete/${userId}`,
        {
          method: "DELETE", 
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar onToggle={(expanded) => setSidebarExpanded(expanded)} />
      
      <div className={`w-full transition-all duration-300 ${sidebarExpanded ? "md:ml-64" : "md:ml-14"} p-4 md:p-8`}>
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-sm md:text-base text-gray-600">
                View and manage all registered users
              </p>
            </div>
          </div>
        </div>

        {error && <Alert className="mb-6 text-red-600">{error}</Alert>}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">All Users ({users.filter((user) => user.role === "user").length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-4 overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter((user) => user.role === "user")
                      .map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            {user.name || "N/A"}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "provider" ? "default" : "secondary"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.isVerified ? "default" : "destructive"
                              }
                            >
                              {user.isVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[100px] md:max-w-xs truncate">{user.address || "N/A"}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}