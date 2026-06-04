"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FolderIcon,
    TicketIcon,
    ReportIcon,
    UsersIcon,
    ScreenIcon
} from "@/components/icon";
import { Ticket } from "../../lib/store";

export default function ManagementDashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeMenu, setActiveMenu] = useState("Tickets");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // States សម្រាប់គ្រប់គ្រងការ Filter
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedStatus, setSelectedStatus] = useState("All Status");

    const router = useRouter();

    const sidebarMenus = [
        { name: "Categories", icon: <FolderIcon />, href: "#" },
        { name: "Tickets", icon: <TicketIcon />, href: "#" },
        { name: "Report", icon: <ReportIcon />, href: "#" },
        { name: "Users", icon: <UsersIcon />, href: "#" },
    ];

    const externalLinks = [
        { name: "Client Side (Kiosk)", icon: <ScreenIcon />, href: "/kiosk" },
        { name: "Ticket Display (TV)", icon: <ScreenIcon />, href: "/display" },
    ];

    const pullLatestState = async () => {
        try {
            const res = await fetch("/api/tickets");
            const data = await res.json();
            setTickets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        }
    };

    useEffect(() => {
        pullLatestState();
        const poller = setInterval(pullLatestState, 2500);
        return () => clearInterval(poller);
    }, []);

    const adjustStatus = async (id: string, nextStatus: "Approved" | "Completed") => {
        await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update", id, status: nextStatus }),
        });

        // បន្ថែមការបន្លឺសំឡេងនៅពេលចុច Approve ភ្លាមៗលើផ្ទាំង Admin
        if (nextStatus === "Approved") {
            const ticketNumber = id.replace("TICKET-", "");
            const speechText = `លេខ ${ticketNumber.split("").join(" ")}`; // អានមួយតួៗ ឧទាហរណ៍៖ ១ ០ ២
            const utterance = new SpeechSynthesisUtterance(speechText);
            utterance.lang = "km-KH";
            utterance.rate = 0.9;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }

        pullLatestState();
    };

    // --- តក្កវិជ្ជាសម្រាប់ចម្រាញ់ទិន្នន័យ (Filter logic) ---
    const filteredTickets = tickets.filter(t => {
        // ចម្រាញ់តាម Category
        const matchCategory = selectedCategory === "All Categories" ||
            t.category.startsWith(selectedCategory) ||
            (selectedCategory === "បើកគណនី" && t.category.includes("បើកគណនី"));

        // ចម្រាញ់តាម Status
        const matchStatus = selectedStatus === "All Status" || t.status === selectedStatus;

        return matchCategory && matchStatus;
    });

    // គណនាស្ថិតិរួមសម្រាប់បង្ហាញលើផ្ទាំង Report
    const totalTickets = tickets.length;
    const pendingCount = tickets.filter(t => t.status === "Pending").length;
    const approvedCount = tickets.filter(t => t.status === "Approved").length;
    const completedCount = tickets.filter(t => t.status === "Completed").length;

    // ប្រមូលបញ្ជីឈ្មោះសេវាកម្មចម្បងៗ
    const uniqueCategories = ["បើកគណនី", "ដោះស្រាយបញ្ហាគណនី", "ដកប្រាក់", "ដាក់ប្រាក់", "អាជីវកម្ម", "ផ្សេងៗ"];

    return (
        <div className="flex h-screen w-screen bg-slate-50 font-khmer overflow-hidden">

            {/* ១. Overlay លើ Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ២. SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 h-screen bg-[#0a409c] text-white flex flex-col p-6 shadow-xl z-50 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    lg:sticky lg:top-0 lg:translate-x-0 shrink-0 overflow-y-auto`}
            >
                <div className="flex justify-between items-center mb-10 mt-2">
                    <h2 className="text-xl font-black tracking-wider leading-tight">
                        NAVASEAL<br />TICKET
                    </h2>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-white/80 hover:text-white lg:hidden focus:outline-none p-1.5 rounded-lg bg-white/10"
                    >
                        ✕
                    </button>
                </div>

                <nav className="space-y-2 flex-1 font-medium">
                    {sidebarMenus.map((menu) => {
                        const isActive = activeMenu === menu.name;
                        return (
                            <a
                                key={menu.name}
                                href={menu.href}
                                onClick={() => {
                                    setActiveMenu(menu.name);
                                    setIsSidebarOpen(false);
                                }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${isActive
                                    ? "bg-white/10 font-bold text-white shadow-inner"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {menu.icon}
                                <span>{menu.name}</span>
                            </a>
                        );
                    })}

                    <hr className="border-white/10 my-4" />

                    {externalLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            className="flex items-center gap-3 text-white/60 hover:text-white px-3 py-2.5 rounded-xl transition bg-white/5 mb-2 hover:bg-white/10"
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* ៣. WORKSPACE ខាងស្តាំ */}
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
                <header className="bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-30 shadow-sm shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden focus:outline-none shrink-0"
                        >
                            ☰
                        </button>
                        <h1 className="text-base md:text-xl font-bold text-slate-800 truncate">Ticket Management System</h1>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="border border-red-100 text-red-600 font-bold px-3 py-1.5 md:px-4 md:py-1.5 rounded-lg text-xs bg-red-50/30 hover:bg-red-50 transition shrink-0"
                    >
                        Logout
                    </button>
                </header>

                {/* តួសេចក្តីផ្លាស់ប្តូរទៅតាម ម៉ឺនុយ ដែលបានចុច */}
                <div className="p-4 md:p-8 flex-1 overflow-y-auto bg-slate-50">

                    {/* ----------------- ផ្នែកទី ១: TICKETS (តារាងចម្បង) ----------------- */}
                    {activeMenu === "Tickets" && (
                        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Tickets Control List</h2>

                            {/* ផ្ទាំង Filter Controls */}
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 mb-6">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full sm:w-auto border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm bg-white text-gray-700 font-medium outline-none cursor-pointer"
                                >
                                    <option value="All Categories">All Categories</option>
                                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>

                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full sm:w-auto border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm bg-white text-gray-700 font-medium outline-none cursor-pointer"
                                >
                                    <option value="All Status">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Completed">Completed</option>
                                </select>

                                <button
                                    onClick={() => { setSelectedCategory("All Categories"); setSelectedStatus("All Status"); }}
                                    className="sm:flex-initial bg-gray-600 text-white font-semibold px-4 py-2 rounded-xl text-xs md:text-sm shadow-sm hover:bg-gray-700 transition"
                                >
                                    Reset Filters
                                </button>
                            </div>

                            {/* តារាងបង្ហាញទិន្នន័យ */}
                            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 tracking-wider bg-slate-50/50">
                                            <th className="py-3 px-4">NO</th>
                                            <th className="py-3 px-4">CATEGORY / CLIENT INFO</th>
                                            <th className="py-3 px-4">STATUS</th>
                                            <th className="py-3 px-4">DATE</th>
                                            <th className="py-3 px-4">TIME</th>
                                            <th className="py-3 px-4">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-xs md:text-sm font-medium text-slate-700">
                                        {filteredTickets.length > 0 ? (
                                            filteredTickets.map((t) => (
                                                <tr key={t.id} className="hover:bg-slate-50/40 transition">
                                                    <td className="py-4 px-4 font-bold text-slate-900">{t.id}</td>
                                                    <td className="py-4 px-4 text-slate-600 font-semibold">{t.category}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-block px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[11px] md:text-xs font-bold ${t.status === "Approved" ? "bg-green-100 text-green-700" :
                                                            t.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                                                            }`}>
                                                            {t.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-400 font-normal whitespace-nowrap">{t.date}</td>
                                                    <td className="py-4 px-4 text-gray-400 font-normal whitespace-nowrap">{t.time}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">
                                                        {t.status === "Pending" ? (
                                                            <button
                                                                onClick={() => adjustStatus(t.id, "Approved")}
                                                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition"
                                                            >
                                                                🔊 Approve
                                                            </button>
                                                        ) : t.status === "Approved" ? (
                                                            <button
                                                                onClick={() => adjustStatus(t.id, "Completed")}
                                                                className="text-white bg-emerald-600 px-3 py-1 rounded-lg font-bold hover:bg-emerald-700 transition"
                                                            >
                                                                ✓ Done
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-300 font-normal">Served</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-400 font-medium">គ្មានទិន្នន័យសំបុត្រស្របតាមការចម្រាញ់របស់អ្នកឡើយ</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ----------------- ផ្នែកទី ២: CATEGORIES (គ្រប់គ្រងប្រភេទសេវាកម្ម) ----------------- */}
                    {activeMenu === "Categories" && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">សេវាកម្មទាំង ៦ នៅក្នុងប្រព័ន្ធ</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {uniqueCategories.map((cat, idx) => {
                                    const count = tickets.filter(t => t.category.includes(cat)).length;
                                    return (
                                        <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-slate-50 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-base">{cat}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">ប្រភេទសេវាកម្មលំដាប់លេខ #{idx + 1}</p>
                                            </div>
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-xs font-bold">
                                                ទិន្នន័យសរុប: {count} ដង
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ----------------- ផ្នែកទី ៣: REPORT (របាយការណ៍ និង ស្ថិតិរួម) ----------------- */}
                    {activeMenu === "Report" && (
                        <div className="space-y-6">
                            {/* កាតស្ថិតិសង្ខេប */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-gray-400 uppercase">សំបុត្រសរុប</p>
                                    <h3 className="text-3xl font-black text-slate-800 mt-2">{totalTickets}</h3>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-amber-500 uppercase">កំពុងរង់ចាំ (Pending)</p>
                                    <h3 className="text-3xl font-black text-amber-500 mt-2">{pendingCount}</h3>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-blue-500 uppercase">កំពុងហៅ (Approved)</p>
                                    <h3 className="text-3xl font-black text-blue-500 mt-2">{approvedCount}</h3>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-emerald-500 uppercase">បានបញ្ចប់ (Completed)</p>
                                    <h3 className="text-3xl font-black text-emerald-500 mt-2">{completedCount}</h3>
                                </div>
                            </div>

                            {/* ក្រាហ្វិកភាគរយសម្រេចការងារជាគំរូ */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 text-lg mb-4">អត្រាដោះស្រាយសំបុត្ររបស់បុគ្គលិក (Success Rate)</h3>
                                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex">
                                    <div
                                        style={{ width: `${totalTickets ? (completedCount / totalTickets) * 100 : 0}%` }}
                                        className="bg-emerald-500 h-full transition-all duration-500"
                                    />
                                    <div
                                        style={{ width: `${totalTickets ? (approvedCount / totalTickets) * 100 : 0}%` }}
                                        className="bg-blue-50 h-full transition-all duration-500"
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                    <span>អត្រាជោគជ័យ: {totalTickets ? Math.round((completedCount / totalTickets) * 100) : 0}%</span>
                                    <span>សំបុត្រនៅសល់: {pendingCount + approvedCount} សន្លឹក</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ----------------- ផ្នែកទី ៤: USERS (គណនីបុគ្គលិក និង អ្នកចុះឈ្មោះ) ----------------- */}
                    {activeMenu === "Users" && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">អតិថិជនបំពេញទម្រង់បើកគណនី (Registered Clients)</h2>
                            <div className="divide-y divide-gray-100">
                                {tickets.filter(t => t.category.includes("បើកគណនី")).length > 0 ? (
                                    tickets.filter(t => t.category.includes("បើកគណនី")).map((client, index) => (
                                        <div key={client.id} className="py-3 flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                                <span className="font-semibold text-slate-700">{client.category}</span>
                                            </div>
                                            <span className="text-xs text-gray-400 font-mono">លេខកូដ: {client.id}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-6 text-gray-400 font-medium">មិនទាន់មានអតិថិជនចុះឈ្មោះបំពេញ Form បើកគណនីនៅឡើយទេ</p>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}