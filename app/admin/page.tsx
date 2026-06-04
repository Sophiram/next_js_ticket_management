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
import {
    CheckCircle2,
    Clock,
    Volume2,
    LogOut,
    Menu,
    X,
    Layers,
    BarChart3,
    Users,
    RefreshCw,
    XCircle // បានបន្ថែម Icon សម្រាប់ប៊ូតុង Cancel
} from "lucide-react";
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
        { name: "Categories", icon: <Layers className="w-5 h-5" />, href: "#" },
        { name: "Tickets", icon: <TicketIcon />, href: "#" },
        { name: "Report", icon: <BarChart3 className="w-5 h-5" />, href: "#" },
        { name: "Users", icon: <Users className="w-5 h-5" />, href: "#" },
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

    // កែសម្រួលអនុគមន៍ឱ្យទទួលយកស្ថានភាព "Canceled" បាន
    const adjustStatus = async (id: string, nextStatus: "Approved" | "Completed" | "Canceled") => {
        await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update", id, status: nextStatus }),
        });

        if (nextStatus === "Approved") {
            const ticketNumber = id.replace("TICKET-", "");
            const speechText = `លេខ ${ticketNumber.split("").join(" ")}`;
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
        const matchCategory = selectedCategory === "All Categories" ||
            t.category.startsWith(selectedCategory) ||
            (selectedCategory === "បើកគណនី" && t.category.includes("បើកគណនី"));

        const matchStatus = selectedStatus === "All Status" || t.status === selectedStatus;

        return matchCategory && matchStatus;
    });

    const totalTickets = tickets.length;
    const pendingCount = tickets.filter(t => t.status === "Pending").length;
    const approvedCount = tickets.filter(t => t.status === "Approved").length;
    const completedCount = tickets.filter(t => t.status === "Completed").length;

    const uniqueCategories = ["បើកគណនី", "ដោះស្រាយបញ្ហាគណនី", "ដកប្រាក់", "ដាក់ប្រាក់", "អាជីវកម្ម", "ផ្សេងៗ"];

    return (
        <div className="flex h-screen w-screen bg-slate-100 font-khmer overflow-hidden text-slate-600 antialiased">

            {/* ១. Overlay លើ Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ២. SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 h-screen bg-[#062863] text-white flex flex-col p-5 shadow-2xl z-50 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:sticky lg:top-0 lg:translate-x-0 shrink-0 overflow-y-auto`}
            >
                <div className="flex justify-between items-center mb-8 px-2 mt-2">
                    <div>
                        <h2 className="text-xl font-black tracking-wider leading-none text-white">RAMMIEZ</h2>
                        <span className="text-[10px] text-blue-300 font-bold tracking-widest uppercase font-mono">Backoffice System</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-white/70 hover:text-white lg:hidden focus:outline-none p-1.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <nav className="space-y-1.5 flex-1 font-medium">
                    <p className="text-[10px] font-bold text-blue-300/50 uppercase tracking-wider px-3 mb-2 font-mono">Main Operations</p>
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
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm cursor-pointer ${isActive
                                    ? "bg-blue-600 font-bold text-white shadow-md border-l-4 border-white"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <span className={isActive ? "text-white" : "text-white/50"}>{menu.icon}</span>
                                <span>{menu.name}</span>
                            </a>
                        );
                    })}

                    <div className="pt-6">
                        <p className="text-[10px] font-bold text-blue-300/50 uppercase tracking-wider px-3 mb-2 font-mono">Live Screen Views</p>
                        {externalLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                className="flex items-center gap-3 text-white/70 hover:text-white text-sm px-3 py-2.5 rounded-xl transition bg-white/5 mb-2 hover:bg-white/10 border border-white/5 cursor-pointer"
                            >
                                <span className="text-white/40">{link.icon}</span>
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </aside>

            {/* ៣. WORKSPACE ខាងស្តាំ */}
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

                {/* TOP NAVBAR */}
                <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-200 sticky top-0 z-30 shadow-sm shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none shrink-0 border border-slate-200 cursor-pointer"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h1 className="text-base md:text-lg font-black text-slate-800 truncate">
                                {activeMenu} Dashboard Overview
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 border border-rose-200 text-rose-600 font-bold px-4 py-2 rounded-xl text-xs bg-rose-50/50 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition shadow-sm cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                    </button>
                </header>

                {/* CONTROLLER BODY CONTAINER */}
                <div className="p-4 md:p-8 flex-1 overflow-y-auto bg-slate-100">

                    {/* ----------------- ផ្នែកទី ១: TICKETS (តារាងចម្បង) ----------------- */}
                    {activeMenu === "Tickets" && (
                        <div className="space-y-4">
                            {/* Quick Filter Section */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-700 font-bold outline-none cursor-pointer focus:border-blue-500 transition shadow-inner"
                                    >
                                        <option value="All Categories" className="cursor-pointer">📂 All Categories</option>
                                        {uniqueCategories.map(cat => <option key={cat} value={cat} className="cursor-pointer">{cat}</option>)}
                                    </select>

                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-700 font-bold outline-none cursor-pointer focus:border-blue-500 transition shadow-inner"
                                    >
                                        <option value="All Status" className="cursor-pointer">📊 All Status</option>
                                        <option value="Pending" className="cursor-pointer">Pending</option>
                                        <option value="Approved" className="cursor-pointer">Approved</option>
                                        <option value="Completed" className="cursor-pointer">Completed</option>
                                        <option value="Canceled" className="cursor-pointer">Canceled</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => { setSelectedCategory("All Categories"); setSelectedStatus("All Status"); }}
                                    className="bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs md:text-sm hover:bg-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Reset Filters
                                </button>
                            </div>

                            {/* Data Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[850px]">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-xs font-black text-slate-400 tracking-wider bg-slate-50">
                                                <th className="py-4 px-6 text-slate-500 font-mono">TICKET ID</th>
                                                <th className="py-4 px-6 text-slate-500">SERVICE CATEGORY</th>
                                                <th className="py-4 px-6 text-slate-500">STATUS STATUS</th>
                                                <th className="py-4 px-6 text-slate-500">DATE ISSUED</th>
                                                <th className="py-4 px-6 text-slate-500">TIME</th>
                                                <th className="py-4 px-6 text-center text-slate-500">ACTION ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs md:text-sm font-semibold text-slate-700">
                                            {filteredTickets.length > 0 ? (
                                                filteredTickets.map((t) => (
                                                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                                                        <td className="py-4 px-6 font-bold text-blue-600 font-mono tracking-wide">{t.id}</td>
                                                        <td className="py-4 px-6 text-slate-800">{t.category}</td>
                                                        <td className="py-4 px-6">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide ${t.status === "Approved" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                                                t.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                                                    t.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                                        "bg-rose-50 text-rose-700 border border-rose-200" // ស្ទីលសម្រាប់ Canceled
                                                                }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${t.status === "Approved" ? "bg-blue-600" :
                                                                    t.status === "Pending" ? "bg-amber-500" :
                                                                        t.status === "Completed" ? "bg-emerald-500" :
                                                                            "bg-rose-500"
                                                                    }`} />
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6 text-slate-400 font-normal font-mono">{t.date}</td>
                                                        <td className="py-4 px-6 text-slate-400 font-normal font-mono">{t.time}</td>
                                                        <td className="py-2 px-6 text-center whitespace-nowrap">
                                                            {t.status === "Pending" ? (
                                                                <div className="flex items-center justify-center gap-2">
                                                                    {/* ប៊ូតុង Call / Approve */}
                                                                    <button
                                                                        onClick={() => adjustStatus(t.id, "Approved")}
                                                                        className="bg-[#0a409c] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-800 transition shadow-sm flex items-center gap-1 cursor-pointer"
                                                                    >
                                                                        <Volume2 className="w-3.5 h-3.5" />
                                                                        <span>Call / Approve</span>
                                                                    </button>
                                                                    {/* ប៊ូតុង Cancel Ticket ថ្មី */}
                                                                    <button
                                                                        onClick={() => adjustStatus(t.id, "Canceled")}
                                                                        className="bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition shadow-sm flex items-center gap-1 cursor-pointer"
                                                                    >
                                                                        <XCircle className="w-3.5 h-3.5" />
                                                                        <span>Cancel</span>
                                                                    </button>
                                                                </div>
                                                            ) : t.status === "Approved" ? (
                                                                <div className="flex items-center justify-center gap-2">
                                                                    {/* ប៊ូតុង Complete */}
                                                                    <button
                                                                        onClick={() => adjustStatus(t.id, "Completed")}
                                                                        className="text-white bg-emerald-600 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm flex items-center gap-1 cursor-pointer"
                                                                    >
                                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                                        <span>Complete Done</span>
                                                                    </button>
                                                                    {/* ប៊ូតុង Cancel (ករណីហៅហើយតែអតិថិជនមិននៅ ឬខុសលក្ខខណ្ឌ) */}
                                                                    <button
                                                                        onClick={() => adjustStatus(t.id, "Canceled")}
                                                                        className="bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition shadow-sm flex items-center gap-1 cursor-pointer"
                                                                    >
                                                                        <XCircle className="w-3.5 h-3.5" />
                                                                        <span>Cancel</span>
                                                                    </button>
                                                                </div>
                                                            ) : t.status === "Completed" ? (
                                                                <span className="text-emerald-500 font-normal text-xs italic">Served Successfully</span>
                                                            ) : (
                                                                <span className="text-rose-400 font-normal text-xs italic">Ticket Canceled</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium bg-white">
                                                        ⚠️ គ្មានទិន្នន័យសំបុត្រស្របតាមការចម្រាញ់របស់អ្នកឡើយ
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ----------------- ផ្នែកទី ២: CATEGORIES ----------------- */}
                    {activeMenu === "Categories" && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
                            <h2 className="text-lg font-black text-slate-800 mb-4">សេវាកម្មសរុបទាំង ៦ ក្នុងប្រព័ន្ធធនាគារ</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {uniqueCategories.map((cat, idx) => {
                                    const count = tickets.filter(t => t.category.includes(cat)).length;
                                    return (
                                        <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex justify-between items-center hover:border-blue-300 transition cursor-pointer">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm md:text-base">{cat}</h4>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">SERVICE ID: #0{idx + 1}</p>
                                            </div>
                                            <span className="bg-blue-50 text-[#0a409c] border border-blue-200 px-3 py-1 rounded-xl text-xs font-black font-mono">
                                                {count} Tickets
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ----------------- ផ្នែកទី ៣: REPORT ----------------- */}
                    {activeMenu === "Report" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">សំបុត្រសរុប</p>
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 mt-1 font-mono">{totalTickets}</h3>
                                    </div>
                                    <div className="p-3 bg-slate-100 text-slate-500 rounded-xl"><Layers className="w-5 h-5" /></div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-black text-amber-600 uppercase tracking-wider">កំពុងរង់ចាំ</p>
                                        <h3 className="text-2xl md:text-3xl font-black text-amber-500 mt-1 font-mono">{pendingCount}</h3>
                                    </div>
                                    <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><Clock className="w-5 h-5" /></div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider">កំពុងហៅ (Serving)</p>
                                        <h3 className="text-2xl md:text-3xl font-black text-blue-600 mt-1 font-mono">{approvedCount}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Volume2 className="w-5 h-5" /></div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">បានបញ្ចប់</p>
                                        <h3 className="text-2xl md:text-3xl font-black text-emerald-600 mt-1 font-mono">{completedCount}</h3>
                                    </div>
                                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
                                </div>
                            </div>

                            {/* Progress Analysis */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                                <h3 className="font-black text-slate-800 text-base mb-4">អត្រាដោះស្រាយសំបុត្ររបស់បុគ្គលិក (Success Rate Analysis)</h3>
                                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex shadow-inner border border-slate-200/40">
                                    <div
                                        style={{ width: `${totalTickets ? (completedCount / totalTickets) * 100 : 0}%` }}
                                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full transition-all duration-500"
                                    />
                                    <div
                                        style={{ width: `${totalTickets ? (approvedCount / totalTickets) * 100 : 0}%` }}
                                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-500"
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-3 font-bold">
                                    <span className="text-emerald-600">អត្រាជោគជ័យសរុប: {totalTickets ? Math.round((completedCount / totalTickets) * 100) : 0}%</span>
                                    <span className="text-slate-500">សំបុត្រមិនទាន់ដោះស្រាយ: {pendingCount + approvedCount} សន្លឹក</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ----------------- ផ្នែកទី ៤: USERS ----------------- */}
                    {activeMenu === "Users" && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
                            <h2 className="text-base md:text-lg font-black text-slate-800 mb-4">អតិថិជនបំពេញទម្រង់បើកគណនី (Registered Customers Profile)</h2>
                            <div className="divide-y divide-slate-100">
                                {tickets.filter(t => t.category.includes("បើកគណនី")).length > 0 ? (
                                    tickets.filter(t => t.category.includes("បើកគណនី")).map((client, index) => (
                                        <div key={client.id} className="py-3.5 flex justify-between items-center text-sm hover:bg-slate-50/50 px-2 rounded-xl transition cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <span className="w-7 h-7 bg-blue-50 text-[#0a409c] border border-blue-100 rounded-full flex items-center justify-center text-xs font-black">{index + 1}</span>
                                                <span className="font-bold text-slate-800">{client.category}</span>
                                            </div>
                                            <span className="text-xs text-slate-400 font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/40">ID: {client.id}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-8 text-slate-400 font-medium">❌ មិនទាន់មានអតិថិជនចុះឈ្មោះបំពេញ Form បើកគណនីនៅឡើយទេ</p>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}