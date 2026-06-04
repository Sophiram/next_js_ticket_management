"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [accountType, setAccountType] = useState("Savings");

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [printedTicket, setPrintedTicket] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // លុបបន្ទាត់ loading = true; ចេញពីទីនេះ
        setLoading(true); // ប្រើមុខងារនេះដើម្បីផ្លាស់ប្តូរតម្លៃ State

        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create",
                    category: `បើកគណនី (${fullName} - ${accountType === "Savings" ? "គណនីសន្សំ" : "គណនីចរន្ត"})`
                }),
            });
            const result = await res.json();

            if (result.success) {
                setPrintedTicket(result.data);
                setShowSuccessModal(true);

                // បញ្ជាទៅម៉ាស៊ីនព្រីនរបស់ Browser ដោយស្វ័យប្រវត្ត (Thermal Printer Support)
                setTimeout(() => {
                    window.print();
                }, 500);

                // ទុកពេល 6 វិនាទីដើម្បីឱ្យដំណើរការព្រីនចប់ រួចទើបបង្វែរទៅកាន់ទំព័រ Kiosk វិញ
                setTimeout(() => {
                    setShowSuccessModal(false);
                    router.push("/kiosk");
                }, 6000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 font-khmer relative overflow-hidden print:bg-white print:p-0">

            {/* Background Decorative Blobs - លាក់ពេលព្រីន */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none print:hidden" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none print:hidden" />

            {/* ផ្ទាំង Form ចុះឈ្មោះ - លាក់ពេលព្រីន */}
            <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full space-y-6 transform transition duration-300 hover:scale-[1.01] print:hidden">

                <div className="text-center space-y-2">
                    <p className="text-xs font-black tracking-widest text-indigo-600 uppercase font-mono">RAMMIEZ BANKING</p>
                    <h2 className="text-2xl font-black text-slate-800 tracking-wide">បើកគណនីថ្មី</h2>
                    <p className="text-slate-500 text-xs">សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីទទួលបានសំបុត្រគំរូ</p>
                    <div className="h-0.5 w-12 bg-indigo-600 mx-auto rounded-full mt-2" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    <div className="space-y-1.5">
                        <label className="block text-xs text-slate-600 font-bold tracking-wide">ឈ្មោះពេញ (Full Name)</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition text-sm font-medium text-slate-800 placeholder:text-slate-400"
                                placeholder="ឧទាហរណ៍: សុខ ភា"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs text-slate-600 font-bold tracking-wide">លេខទូរស័ព្ទ (Phone Number)</label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition text-sm font-medium text-slate-800 placeholder:text-slate-400 font-mono"
                            placeholder="012345678"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs text-slate-600 font-bold tracking-wide">ប្រភេទគណនី (Account Type)</label>
                        <div className="relative">
                            <select
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                            >
                                <option value="Savings">គណនីសន្សំ (Savings Account)</option>
                                <option value="Current">គណនីចរន្ត (Current Account)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.push("/kiosk")}
                            disabled={loading}
                            className="w-1/2 bg-slate-50 hover:bg-slate-100 text-slate-500 py-3.5 rounded-2xl text-sm font-bold border border-slate-200 transition active:bg-slate-200 disabled:opacity-50"
                        >
                            ត្រឡប់ក្រោយ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition active:scale-[0.99] disabled:from-slate-400 disabled:to-slate-400 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>កំពុងព្រីន...</span>
                                </>
                            ) : (
                                "ព្រីនសំបុត្រ"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* 💡 ផ្ទាំងបង្ហាញសំបុត្រជោគជ័យ (Professional Modal & Thermal Layout) */}
            {showSuccessModal && printedTicket && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 print:relative print:inset-auto print:bg-white print:p-0 print:backdrop-blur-none">

                    {/* ឃ្លាំងសំបុត្រកម្ដៅ (Thermal Ticket Concept Box) - បានបន្ថែម id រួចរាល់ */}
                    <div id="thermal-ticket-print" className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 border border-slate-100 relative print:shadow-none print:border-none print:p-0 print:w-[76mm] print:max-w-none">

                        {/* ផ្ទាំងរង្វង់ជោគជ័យ - លាក់ពេលព្រីន */}
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-sm print:hidden">
                            ✓
                        </div>

                        {/* ក្បាលសំបុត្រ (Ticket Header) */}
                        <div className="space-y-1">
                            <h3 className="text-xl font-black tracking-wider text-slate-800">RAMMIEZ BANK</h3>
                            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Queue Management System</p>
                        </div>

                        <div className="border-b border-dashed border-slate-300 my-2" />

                        {/* លេខកូដសំបុត្រ (Queue Number) */}
                        <div className="space-y-1 py-2">
                            <p className="text-xs text-slate-400 font-bold tracking-wide">លេខសំបុត្ររបស់អ្នក / YOUR NUMBER</p>
                            <h1 className="text-6xl font-black text-indigo-600 font-mono tracking-tight print:text-black">
                                {printedTicket.id.replace("TICKET-", "")}
                            </h1>
                        </div>

                        {/* ប្រភេទសេវាកម្ម (Category Box) */}
                        <div className="bg-slate-50 border border-slate-100 py-3 px-4 rounded-2xl print:bg-transparent print:border-none print:p-0">
                            <p className="font-black text-sm text-slate-800 leading-relaxed">
                                {printedTicket.category}
                            </p>
                        </div>

                        <div className="border-b border-dashed border-slate-300 my-2" />

                        {/* ព័ត៌មានកាលបរិច្ឆេទ និងម៉ោង */}
                        <div className="text-xs text-slate-600 space-y-1.5 text-left px-4 font-mono">
                            <div className="flex justify-between">
                                <span>📅 កាលបរិច្ឆេទ (Date):</span>
                                <span className="font-bold text-slate-800">{printedTicket.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>⏰ ម៉ោង (Time):</span>
                                <span className="font-bold text-slate-800">{printedTicket.time}</span>
                            </div>
                        </div>

                        <div className="border-b border-dashed border-slate-300 my-2" />

                        {/* ជើងសំបុត្រ */}
                        <div className="space-y-1">
                            <p className="text-[11px] text-slate-500 font-medium">សូមអរគុណ! សូមរង់ចាំការបន្លឺសំឡេងហៅលេខសំបុត្រ</p>
                            <p className="text-[9px] text-slate-400 font-mono">Please wait for your number to be called.</p>
                        </div>

                        {/* របារបង្ហាញព័ត៌មានបន្ថែមក្នុង UI - លាក់ពេលព្រីន */}
                        <div className="pt-4 print:hidden">
                            <div className="text-xs text-emerald-600 font-bold bg-emerald-50/80 border border-emerald-100 py-2.5 rounded-xl animate-pulse flex items-center justify-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                កំពុងព្រីនសំបុត្រ... ទំព័រនឹងត្រឡប់ក្រោយក្នុងពេលបន្តិចទៀត
                            </div>
                        </div>

                    </div>
                </div>
            )}

           
        </div>
    );
}