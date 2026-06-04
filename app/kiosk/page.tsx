"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    UserPlus,
    UserCheck,
    ArrowUpRight,
    ArrowDownLeft,
    Briefcase,
    HelpCircle,
    Clock
} from "lucide-react";

export default function KioskPage() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState("");

    // បង្កើតម៉ោងរត់ជាក់ស្តែងនៅលើអេក្រង់ Kiosk
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "numeric",    // 🟢 ប្រើ 'numeric' ឬ '2-digit' ជំនួសវិញ
                    minute: "2-digit",
                    hour12: true
                })
            );
        };
        updateDateTime();
        const timer = setInterval(updateDateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const services = [
        {
            kh: "បើកគណនីថ្មី",
            en: "Open New Account",
            desc: "ចុះឈ្មោះសុំបើកគណនីសន្សំ ឬគណនីចរន្ត",
            path: "/register",
            icon: UserPlus,
            color: "bg-blue-50 text-blue-600 border-blue-100"
        },
        {
            kh: "សេវាគណនី និងប័ណ្ណ",
            en: "Account & Card Issues",
            desc: "ដោះស្រាយបញ្ហាគណនី ភ្លេចលេខកូដ ឬធ្វើប័ណ្ណថ្មី",
            path: "/account-issue",
            icon: UserCheck,
            color: "bg-amber-50 text-amber-600 border-amber-100"
        },
        {
            kh: "សេវាដកប្រាក់",
            en: "Cash Withdrawal",
            desc: "ដកប្រាក់រហ័សតាមបញ្ជរ (ចំនួនទឹកប្រាក់ធំ)",
            path: "/withdrawal",
            icon: ArrowUpRight,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        },
        {
            kh: "សេវាដាក់ប្រាក់/វេរប្រាក់",
            en: "Cash Deposit / Transfer",
            desc: "ដាក់ប្រាក់ចូលគណនី ឬវេរប្រាក់ទៅក្រៅប្រទេស",
            path: "/deposit",
            icon: ArrowDownLeft,
            color: "bg-indigo-50 text-indigo-600 border-indigo-100"
        },
        {
            kh: "សេវាកម្មអាជីវកម្ម",
            en: "Business & Loans",
            desc: "ពិគ្រោះយោបល់សេវាកម្មឥណទាន និងកម្ចីសហគ្រាស",
            path: "/business",
            icon: Briefcase,
            color: "bg-purple-50 text-purple-600 border-purple-100"
        },
        {
            kh: "សេវាកម្មផ្សេងៗ",
            en: "General Queries / Others",
            desc: "សាកសួរព័ត៌មានទូទៅ និងសេវាកម្មផ្សេងៗទៀត",
            path: "/others",
            icon: HelpCircle,
            color: "bg-rose-50 text-rose-600 border-rose-100"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col justify-between p-6 md:p-12 selection:bg-blue-500 selection:text-white">

            {/* --- TOP BAR / HEADER --- */}
            <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center border-b border-slate-200 pb-6 mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0a409c] tracking-wider text-center sm:text-left">
                        RAMMIEZ TICKET
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium text-center sm:text-left">
                        សូមជ្រើសរើសសេវាកម្មដែលលោកអ្នកត្រូវការ | Please select a service
                    </p>
                </div>

                {/* ម៉ោងបង្ហាញផ្ទាល់នៅលើស្មាតហ្វូន/Kiosk Screen */}
                <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200/60">
                    <Clock className="w-5 h-5 text-gray-400 animate-pulse" />
                    <span className="text-base font-bold text-slate-700 font-mono tracking-wide">{currentTime || "00:00 AM"}</span>
                </div>
            </header>

            {/* --- MAIN SERVICES GRID --- */}
            <main className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-auto">
                {services.map((service) => {
                    const IconComponent = service.icon;
                    return (
                        <button
                            key={service.en}
                            onClick={() => router.push(service.path)}
                            className="group relative bg-white border border-slate-200/80 rounded-[2rem] p-8 text-left shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden active:scale-[0.98]"
                        >
                            {/* Effect Background Line នៅពេល Hover */}
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50 rounded-full transition-transform duration-500 group-hover:scale-[2.5] opacity-30 pointer-events-none z-0" />

                            <div className="relative z-10 w-full">
                                {/* Container Icon */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 transition-transform duration-300 group-hover:scale-110 ${service.color}`}>
                                    <IconComponent className="w-7 h-7 stroke-[2.2]" />
                                </div>

                                {/* ឈ្មោះសេវាកម្ម ភាសាខ្មែរ និង អង់គ្លេស */}
                                <h2 className="text-xl font-black text-slate-800 group-hover:text-[#0a409c] transition-colors duration-200 leading-tight">
                                    {service.kh}
                                </h2>
                                <h3 className="text-sm font-bold text-slate-400 mt-0.5 tracking-wide uppercase font-mono group-hover:text-slate-600 transition-colors duration-200">
                                    {service.en}
                                </h3>

                                {/* ការពិពណ៌នា */}
                                <p className="text-gray-400 text-xs mt-3 leading-relaxed font-normal group-hover:text-slate-500 transition-colors duration-200 min-h-[2rem]">
                                    {service.desc}
                                </p>
                            </div>

                            {/* ប៊ូតុងសញ្ញាព្រួញបាញ់ទៅមុខនៅខាងក្រោម */}
                            <div className="relative z-10 flex justify-end items-center mt-6 pt-4 border-t border-slate-100 w-full">
                                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0a409c] group-hover:text-white transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </main>

            {/* --- FOOTER --- */}
            <footer className="max-w-6xl w-full mx-auto text-center mt-12 pt-6 border-t border-slate-200 text-xs font-medium text-gray-400">
                © {new Date().getFullYear()} RAMMIEZ BANKING SYSTEM. All Rights Reserved.
            </footer>

        </div>
    );
}