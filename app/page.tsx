"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ការផ្ទៀងផ្ទាត់គណនីគំរូ (អាចកែប្រែបានតាមតម្រូវការ)
    if (username === "admin" && password === "admin123") {
      router.push("/admin");
    } else {
      setError("ឈ្មោះអ្នកប្រើប្រាស់ ឬលេខសម្ងាត់មិនត្រឹមត្រូវឡើយ!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#0a409c] tracking-wider">NAVASEAL TICKET</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">សូមបញ្ចូលគណនីដើម្បីគ្រប់គ្រងប្រព័ន្ធ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ឈ្មោះអ្នកប្រើប្រាស់ (Username)</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition text-sm"
              placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">លេខសម្ងាត់ (Password)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition text-sm"
              placeholder="បញ្ចូលលេខសម្ងាត់"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#0a409c] text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition active:scale-[0.99]"
          >
            ចូលប្រើប្រាស់ប្រព័ន្ធ (Login)
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <button
            onClick={() => router.push("/kiosk")}
            className="text-sm font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            ទៅកាន់ទំព័រចុចសំបុត្រអតិថិជន (Kiosk Side) →
          </button>
        </div>
      </div>
    </div>
  );
}