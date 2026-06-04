// app/deposit/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DepositPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // State សម្រាប់គ្រប់គ្រងការបង្ហាញផ្ទាំងសំបុត្រជោគជ័យ
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [printedTicket, setPrintedTicket] = useState<any>(null);

    const handlePrint = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", category: "ដាក់ប្រាក់" }),
            });
            const result = await res.json();

            if (result.success) {
                setPrintedTicket(result.data);
                setShowSuccessModal(true); // បើកផ្ទាំង Alert/Modal ជោគជ័យ

                // ទុកពេល 4 វិនាទីឱ្យភ្ញៀវមើលសំបុត្រ រួចទើបបង្វែរទៅកាន់ទំព័រ Kiosk វិញ
                setTimeout(() => {
                    setShowSuccessModal(false);
                    router.push("/kiosk");
                }, 4000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-khmer relative">

            {/* កាតបង្ហាញសេវាកម្មចម្បង */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full space-y-4">
                <h2 className="text-xl font-bold text-slate-800">សេវាកម្មដាក់ប្រាក់</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                    ដាក់ប្រាក់ចូលគណនី ឬវេរប្រាក់តាមសេវាបញ្ជរ
                </p>
                <button
                    onClick={handlePrint}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition disabled:bg-blue-400"
                >
                    {loading ? "កំពុងព្រីន..." : "ចុចទីនេះដើម្បីព្រីនសំបុត្រ"}
                </button>
                <button
                    onClick={() => router.push("/kiosk")}
                    disabled={loading}
                    className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-xl text-sm font-bold text-gray-500 transition"
                >
                    ត្រឡប់ក្រោយ
                </button>
            </div>

            {/* 💡 ផ្ទាំងបង្ហាញសំបុត្រជោគជ័យ (Custom Alert Modal) */}
            {showSuccessModal && printedTicket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-xs w-full text-center space-y-4 transform scale-100 transition-transform">

                        {/* រង្វង់សញ្ញាគ្រីសជោគជ័យ */}
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                            ✓
                        </div>

                        <p className="text-xs text-gray-400 font-bold tracking-widest">NAVASAL TICKET</p>

                        {/* បង្ហាញលេខកូដសំបុត្រធំៗច្បាស់ */}
                        <h3 className="text-5xl font-black text-blue-600 font-mono">
                            {printedTicket.id.replace("TICKET-", "")}
                        </h3>

                        <p className="font-bold text-sm bg-slate-50 py-2 rounded-xl text-slate-700 px-3">
                            {printedTicket.category}
                        </p>

                        {/* ព័ត៌មានកាលបរិច្ឆេទ */}
                        <div className="border-t border-dashed border-gray-200 pt-3 text-xs text-gray-400 space-y-1 text-left px-2 font-mono">
                            <p>📅 កាលបរិច្ឆេទ: {printedTicket.date}</p>
                            <p>⏰ ម៉ោង: {printedTicket.time}</p>
                        </div>

                        <div className="pt-2">
                            <p className="text-[11px] text-green-600 font-medium bg-green-50 py-1.5 rounded-lg animate-pulse">
                                បង្កើតបានជោគជ័យ! សូមរង់ចាំការហៅលេខ...
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}