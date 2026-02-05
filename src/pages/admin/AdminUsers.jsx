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
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, config);
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
        <div className="pb-10">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-purevit-dark">Users</h2>
                <div className="bg-white border border-purevit-primary/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-sm text-gray-500 shadow-sm">
                    Total: <span className="text-purevit-dark font-bold">{users.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="text-purevit-dark">Loading users...</div>
            ) : (
                <div className="bg-white rounded-xl md:rounded-2xl border border-purevit-primary/10 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left min-w-[600px] md:min-w-full">
                            <thead className="bg-purevit-cream text-purevit-dark uppercase text-[10px] md:text-xs font-black tracking-widest">
                                <tr>
                                    <th className="px-4 py-3 md:px-6 md:py-4">User</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Contact</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Role</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-purevit-primary/10">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-purevit-cream/50 transition-colors text-xs md:text-sm">
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purevit-primary/10 flex items-center justify-center text-purevit-primary flex-shrink-0">
                                                    <User size={16} className="md:w-5 md:h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-purevit-dark truncate">{user.name}</p>
                                                    <p className="text-[10px] text-gray-400 truncate max-w-[100px] md:max-w-none">#{user._id.substring(user._id.length - 6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] md:text-xs">
                                                    <Mail size={12} className="text-purevit-primary" /> <span className="truncate max-w-[120px] md:max-w-none">{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] md:text-xs">
                                                        <Phone size={12} className="text-purevit-primary" /> {user.phone}
                                                    </div>
                                                )}
                                                {user.address?.city && (
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] md:text-xs">
                                                        <MapPin size={12} className="text-purevit-primary" /> {user.address.city}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-green-50 text-green-600 text-[9px] md:text-xs font-black uppercase border border-green-100">
                                                    <UserCheck size={10} className="md:w-3 md:h-3" /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-gray-50 text-gray-400 text-[9px] md:text-xs font-black uppercase border border-gray-100">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-gray-400 text-[10px] md:text-xs whitespace-nowrap">
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
