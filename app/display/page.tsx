"use client";

import { useEffect, useState, useRef } from "react";
import { Ticket } from "@/lib/store";

export default function TicketDisplay() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [time, setTime] = useState("");

    // រក្សាទុក ID សំបុត្រចុងក្រោយដើម្បីកុំឱ្យហៅដដែលៗពេល Polling លោត
    const lastCalledIdRef = useRef<string | null>(null);
    // បង្កើត Ref មួយសម្រាប់រក្សាទុក Utterance ការពារ Browser Garbage Collection លុបវាចោលកណ្ដាលទី
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const fetchState = async () => {
        try {
            const res = await fetch("/api/tickets");
            const data = await res.json();
            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        }
    };

    useEffect(() => {
        fetchState();
        const interval = setInterval(fetchState, 2500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const approvedTickets = tickets.filter(t => t.status === "Approved");
    const nowCalling = approvedTickets[0] || null;
    const recentTickets = approvedTickets.slice(1, 6);
    const pendingCount = tickets.filter(t => t.status === "Pending").length;

    // --- តក្កវិជ្ជាសម្រាប់បន្លឺសំឡេង (Voice Text-to-Speech) និយាយ ៥ ដង ---
    useEffect(() => {
        if (nowCalling && nowCalling.id !== lastCalledIdRef.current) {
            lastCalledIdRef.current = nowCalling.id;

            const ticketNumber = nowCalling.id.replace("TICKET-", "");
            const speechText = `សូមអញ្ជើញ លេខ ${ticketNumber.split("").join(" ")}`;

            // បង្កើត អនុគមន៍ហៅសំឡេងដោយបញ្ជូនចំនួនជុំ (Loop Counter)
            const speak = (currentLoop: number) => {
                if (currentLoop >= 5) return; // បញ្ឈប់នៅពេលហៅគ្រប់ ៥ ដង

                const utterance = new SpeechSynthesisUtterance(speechText);
                currentUtteranceRef.current = utterance; // រក្សាទុកក្នុង Ref

                // កំណត់សំឡេងភាសាខ្មែរ
                const voices = window.speechSynthesis.getVoices();
                const khmerVoice = voices.find(voice => voice.lang.startsWith("km") || voice.lang.startsWith("kh"));

                if (khmerVoice) {
                    utterance.voice = khmerVoice;
                } else {
                    utterance.lang = "km-KH";
                    utterance.rate = 0.85;
                }

                // នៅពេលនិយាយចប់ ១ ជុំ ហៅទៅជុំបន្ទាប់
                utterance.onend = () => {
                    speak(currentLoop + 1);
                };

                // ករណីមាន Error ផ្សេងៗ ក៏ត្រូវហៅទៅជុំបន្ទាប់ដែរ ដើម្បីកុំឱ្យគាំងដំណើរការ
                utterance.onerror = () => {
                    speak(currentLoop + 1);
                };

                window.speechSynthesis.speak(utterance);
            };

            // បិទសំឡេងចាស់ដែលកំពុងនិយាយទាំងអស់ រួចចាប់ផ្តើមហៅពីជុំទី ០ ទៅ
            window.speechSynthesis.cancel();
            speak(0);
        }

        // Cleanup function: នៅពេល Component ត្រូវ unmount ឬមានលេខថ្មីមកកាត់ ត្រូវបិទសំឡេងភ្លាម
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [nowCalling]);

    return (
        <div className="min-h-screen bg-slate-100 font-khmer p-6 flex flex-col gap-6">
            {/* Top Header Bar */}
            <header className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-black text-[#0a409c]">RAMMIEZ TICKET</h1>
                <div className="text-right">
                    <p className="text-xs text-gray-400">04-06-2026</p>
                    <p className="text-xl font-mono font-black text-blue-600">{time}</p>
                </div>
            </header>

            {/* Main Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

                {/* ផ្ទាំងធំខាងឆ្វេង: NOW CALLING */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm relative overflow-hidden text-center min-h-[400px]">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-blue-50 rounded-full -translate-x-10 -translate-y-10 z-0" />

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-xl font-black tracking-widest text-gray-400 uppercase">NOW CALLING</h2>
                        {nowCalling ? (
                            <>
                                <h3 className="text-8xl font-black text-blue-600 font-mono animate-pulse">
                                    {nowCalling.id.replace("TICKET-", "")}
                                </h3>
                                <p className="text-3xl font-bold text-slate-800">{nowCalling.category}</p>
                                <span className="inline-block bg-green-50 text-green-600 px-4 py-1 rounded-full text-sm font-bold">
                                    Approved / ដល់វេនសួរ
                                </span>
                            </>
                        ) : (
                            <p className="text-xl text-gray-400 py-10">មិនទាន់មានការហៅលេខថ្មីទេ...</p>
                        )}
                    </div>
                </div>

                {/* ផ្ទាំងខាងស្តាំ: Queue Info & Recent */}
                <div className="flex flex-col gap-6">
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex justify-between items-center shadow-inner">
                        <span className="text-sm font-bold text-orange-800">Pending Tickets</span>
                        <span className="text-3xl font-black text-orange-600 font-mono">{pendingCount}</span>
                    </div>

                    <div className="bg-white rounded-2xl p-6 flex-1 shadow-sm flex flex-col">
                        <h3 className="text-sm font-black text-slate-400 mb-4 tracking-wider uppercase">Recent Tickets</h3>
                        <div className="space-y-3 flex-1 overflow-y-auto">
                            {recentTickets.length > 0 ? (
                                recentTickets.map((t) => (
                                    <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-gray-100">
                                        <span className="text-lg font-black text-blue-600 font-mono">{t.id.replace("TICKET-", "")}</span>
                                        <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{t.category}</span>
                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Approved</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-6">គ្មានប្រវត្តិកាលហៅមុននេះទេ</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}