"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [printedTicket, setPrintedTicket] = useState<any>(null);

    const handlePrint = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", category: "អាជីវកម្ម" }),
            });
            const result = await res.json();

            if (result.success) {
                setPrintedTicket(result.data);
                setShowSuccessModal(true);

                // បញ្ជាទៅម៉ាស៊ីនព្រីនរបស់ Browser ដោយស្វ័យប្រវត្ត (Thermal Printer Support)
                setTimeout(() => {
                    window.print();
                }, 500);

                // ទុកពេល 6 វិនាទីដើម្បីឱ្យដំណើរការព្រីនចប់ និងឱ្យភ្ញៀវមើលសំបុត្រ រួចទើបបង្វែរទៅកាន់ទំព័រ Kiosk វិញ
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

            {/* តុបតែងផ្ទៃខាងក្រោយបែបធនាគារទំនើប (Background Decorative Blobs) - លាក់ពេលព្រីន */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none print:hidden" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none print:hidden" />

            {/* កាតបង្ហាញសេវាកម្មចម្បង - លាក់ពេលព្រីន */}
            <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-200 text-center max-w-lg w-full space-y-8 transform transition duration-300 hover:scale-[1.01] print:hidden">

                {/* Brand Header Inside Card */}
                <div className="space-y-2">
                    <p className="text-xs font-black tracking-widest text-emerald-600 uppercase font-mono">RAMMIEZ BANKING</p>
                    <div className="h-0.5 w-12 bg-emerald-600 mx-auto rounded-full" />
                </div>

                {/* សញ្ញា Icon តំណាងឱ្យសេវាកម្មអាជីវកម្ម (Briefcase / Business Icon) */}
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.242-1.008-2.25-2.25-2.25H6c-1.242 0-2.25 1.008-2.25 2.25m16.5 0a2.25 2.25 0 0 0-2.25-2.25h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a1.125 1.125 0 0 0-1.125-1.125h-3a1.125 1.125 0 0 0-1.125 1.125v1.5a1.125 1.125 0 0 1-1.125 1.125h-1.5a2.25 2.25 0 0 0-2.25 2.25m3.75 9.75c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125m-5.625 0M4.875 4.5h14.25c.621 0 1.125.504 1.125 1.125v3.5c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 9.125v-3.5c0-.621.504-1.125 1.125-1.125Z" />
                    </svg>
                </div>

                {/* ឈ្មោះសេវាកម្ម និងការពន្យល់ */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-black text-slate-800 tracking-wide">សេវាកម្មអាជីវកម្ម</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                        សូមចុចប៊ូតុងខាងក្រោមដើម្បីព្រីនសំបុត្ររង់ចាំ សម្រាប់ការពិគ្រោះយោបល់លើសេវាកម្មឥណទាន កម្ចីសហគ្រាស និងដំណោះស្រាយហិរញ្ញវត្ថុអាជីវកម្ម។
                    </p>
                </div>

                {/* ផ្នែកប៊ូតុងបញ្ជា */}
                <div className="space-y-3 pt-2">
                    <button
                        onClick={handlePrint}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all duration-200 active:scale-[0.99] disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>កំពុងព្រីនសំបុត្រ...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.617 0-1.11-.51-1.07-1.122L6.34 18m11.32 0h-11.32M9 10.5h.008v.008H9V10.5Zm2.25 0h.008v.008h-.008V10.5Zm2.25 0h.008v.008H13.5V10.5Zm-10.5-6A1.5 1.5 0 0 1 4.5 3h15a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 19.5 9h-15A1.5 1.5 0 0 1 3 7.5v-3Z" />
                                </svg>
                                <span>ចុចទីនេះដើម្បីព្រីនសំបុត្រ</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => router.push("/kiosk")}
                        disabled={loading}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 py-3 rounded-2xl text-sm font-bold border border-slate-200 transition duration-150 active:bg-slate-200"
                    >
                        ត្រឡប់ក្រោយ
                    </button>
                </div>
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

                        {/* បង្ហាញលេខកូដសំបុត្រធំៗច្បាស់ (Queue Number) */}
                        <div className="space-y-1 py-2">
                            <p className="text-xs text-slate-400 font-bold tracking-wide">លេខសំបុត្ររបស់អ្នក / YOUR NUMBER</p>
                            <h1 className="text-6xl font-black text-emerald-600 font-mono tracking-tight print:text-black">
                                {printedTicket.id.replace("TICKET-", "")}
                            </h1>
                        </div>

                        {/* ប្រភេទសេវាកម្ម (Category Box) */}
                        <div className="bg-slate-50 border border-slate-100 py-3 px-4 rounded-2xl print:bg-transparent print:border-none print:p-0">
                            <p className="font-black text-base text-slate-800">
                                សេវាកម្ម៖ {printedTicket.category}
                            </p>
                        </div>

                        <div className="border-b border-dashed border-slate-300 my-2" />

                        {/* ព័ត៌មានកាលបរិច្ឆេទ និងម៉ោង (Metadata) */}
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

                        {/* ជើងសំបុត្រ (Footer Message) */}
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