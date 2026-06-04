// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [accountType, setAccountType] = useState("Savings");

    // State សម្រាប់គ្រប់គ្រងការបង្ហាញផ្ទាំងសំបុត្រជោគជ័យ
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [printedTicket, setPrintedTicket] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", category: `បើកគណនី (${fullName} - ${accountType})` }),
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

            {/* ផ្ទាំង Form ចុះឈ្មោះដើម */}
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
                <h2 className="text-2xl font-bold text-center text-slate-800 border-b pb-3">ទម្រង់ចុះឈ្មោះ បើកគណនីថ្មី</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 font-bold mb-1">ឈ្មោះពេញ (Full Name)</label>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:outline-blue-500" placeholder="ឧទាហរណ៍: សុខ ភា" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 font-bold mb-1">លេខទូរស័ព្ទ (Phone Number)</label>
                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:outline-blue-500" placeholder="ឧទាហរណ៍: 012345678" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 font-bold mb-1">ប្រភេទគណនី</label>
                        <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:outline-blue-500 bg-white">
                            <option value="Savings">គណនីសន្សំ (Savings)</option>
                            <option value="Current">គណនីចរន្ត (Current)</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button type="button" onClick={() => router.push("/kiosk")} className="w-1/2 bg-gray-200 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-gray-300 transition">ត្រឡប់ក្រោយ</button>
                        <button type="submit" disabled={loading} className="w-1/2 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">{loading ? "កំពុងរក្សាទុក..." : "ព្រីនសំបុត្រ"}</button>
                    </div>
                </form>
            </div>

            {/* 💡 ផ្ទាំងបង្ហាញសំបុត្រជោគជ័យ (Custom Alert Modal) */}
            {showSuccessModal && printedTicket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-xs w-full text-center space-y-4 relative transform scale-100 transition-transform">

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