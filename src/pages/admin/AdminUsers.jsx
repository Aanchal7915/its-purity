import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, UserCheck, User } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5002/api/users', config);
                setUsers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif font-bold text-purevit-dark">Users</h2>
                <div className="bg-white border border-purevit-primary/10 px-4 py-2 rounded-xl text-gray-600 shadow-sm">
                    Total Users: <span className="text-purevit-dark font-bold">{users.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="text-purevit-dark">Loading users...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-purevit-primary/10 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-purevit-cream text-purevit-dark uppercase text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Contact</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-purevit-primary/10">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-purevit-cream/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purevit-primary/10 flex items-center justify-center text-purevit-primary">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-purevit-dark">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <Mail size={14} /> {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                        <Phone size={14} /> {user.phone}
                                                    </div>
                                                )}
                                                {user.address && user.address.city && (
                                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                        <MapPin size={14} /> {user.address.city}, {user.address.state}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purevit-primary/10 text-purevit-primary text-xs font-bold border border-purevit-primary/20">
                                                    <UserCheck size={12} /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
