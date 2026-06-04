// app/kiosk/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function KioskPage() {
    const router = useRouter();

    const services = [
        { kh: "បើកគណនី", en: "Open Account", desc: "សូមបំពេញព័ត៌មានផ្ទាល់ខ្លួនដើម្បីចុះឈ្មោះកក់លេខ", path: "/register" },
        { kh: "ដោះស្រាយបញ្ហាគណនី", en: "Account Issue", desc: "ពិនិត្យគណនីចាក់សោ ភ្លេចលេខកូដ ឬទិន្នន័យផ្ទាល់ខ្លួន", path: "/account-issue" },
        { kh: "ដកប្រាក់", en: "Withdrawal", desc: "ដកប្រាក់រហ័សតាមបញ្ជរ (សម្រាប់ចំនួនទឹកប្រាក់ធំៗ)", path: "/withdrawal" },
        { kh: "ដាក់ប្រាក់", en: "Deposit", desc: "ដាក់ប្រាក់ចូលគណនី ឬវេរប្រាក់តាមសេវាបញ្ជរ", path: "/deposit" },
        { kh: "អាជីវកម្ម", en: "Business Services", desc: "ពិគ្រោះយោបល់សេវាកម្មឥណទាន និងកម្ចីសហគ្រាស", path: "/business" },
        { kh: "ផ្សេងៗ", en: "Others", desc: "សេវាកម្មទូទៅ និងការសាកសួរព័ត៌មានផ្សេងៗ", path: "/others" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-khmer">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-800">Category</h1>
                    <p className="text-gray-400 text-sm mt-1">Choose one service below to proceed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <button
                            key={service.kh}
                            onClick={() => router.push(service.path)}
                            className="relative overflow-hidden rounded-3xl p-8 text-left shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white group active:scale-[0.98]"
                        >
                            <h2 className="text-2xl font-bold mb-1">{service.kh}</h2>
                            <p className="text-white/80 text-xs font-light mb-8 h-8">{service.desc}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs text-white/50 font-mono uppercase">Go to Service →</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}