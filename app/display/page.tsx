"use client";

import { useEffect, useState, useRef } from "react";
import { Ticket } from "@/lib/store";

export default function TicketDisplay() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [time, setTime] = useState("");

    // បង្កើត Ref មួយសម្រាប់ចំណាំលេខសំបុត្រដែលបានហៅចុងក្រោយ កុំឱ្យវាហៅដដែលៗពេល Polling លោត
    const lastCalledIdRef = useRef<string | null>(null);

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

    // ចម្រាញ់យកសំបុត្រដែលកំពុងហៅ (Approved) ចុងក្រោយគេបំផុត
    const approvedTickets = tickets.filter(t => t.status === "Approved");
    const nowCalling = approvedTickets[0] || null;
    const recentTickets = approvedTickets.slice(1, 6);
    const pendingCount = tickets.filter(t => t.status === "Pending").length;

    // --- តក្កវិជ្ជាសម្រាប់បន្លឺសំឡេង (Voice Text-to-Speech) ---
    // --- តក្កវិជ្ជាសម្រាប់បន្លឺសំឡេង (Voice Text-to-Speech) និយាយ ៥ ដង ---
    useEffect(() => {
        if (nowCalling && nowCalling.id !== lastCalledIdRef.current) {
            // កំណត់សម្គាល់ ID ថ្មីដើម្បីកុំឱ្យហៅដដែលៗពេល Polling លោត
            lastCalledIdRef.current = nowCalling.id;

            const ticketNumber = nowCalling.id.replace("TICKET-", "");
            const speechText = `សូមអញ្ជើញ លេខ ${ticketNumber.split("").join(" ")}`;

            let loopCount = 0; // បង្កើត Variable សម្រាប់រាប់ជុំ

            // បង្កើត Function សម្រាប់និយាយ
            const speak = () => {
                if (loopCount >= 5) return; // បើនិយាយគ្រប់ ៥ ដងហើយ ត្រូវបញ្ឈប់

                const utterance = new SpeechSynthesisUtterance(speechText);

                // កំណត់ភាសាខ្មែរ
                const voices = window.speechSynthesis.getVoices();
                const khmerVoice = voices.find(voice => voice.lang.startsWith("km") || voice.lang.startsWith("kh"));

                if (khmerVoice) {
                    utterance.voice = khmerVoice;
                } else {
                    utterance.lang = "km-KH";
                    utterance.rate = 0.85; // បន្ថយល្បឿនបន្តិចឱ្យស្តាប់ស្រួល
                }

                // នៅពេលដែលនិយាយចប់ ១ ជុំ ឱ្យវាហៅខ្លួនឯង (Speak) ម្តងទៀត
                utterance.onend = () => {
                    loopCount++;
                    speak();
                };

                window.speechSynthesis.speak(utterance);
            };

            // បិទសំឡេងចាស់ដែលកំពុងនិយាយ (បើមាន) រួចចាប់ផ្តើមហៅ
            window.speechSynthesis.cancel();
            speak();
        }
    }, [nowCalling]);

    return (
        <div className="min-h-screen bg-slate-100 font-khmer p-6 flex flex-col gap-6">
            {/* Top Header Bar */}
            <header className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-black text-[#0a409c]">NAVASEAL TICKET</h1>
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
        </div>
    );
}