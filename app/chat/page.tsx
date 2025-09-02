"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../utils/api";
import Chatbot from "../../components/Chatbot";

export default function ChatPage() {
  const router = useRouter();

  // ✅ Redirect if no token
  useEffect(() => {
    const token = api.auth.getToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  function handleLogout() {
    api.auth.logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Chatbot</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
      <Chatbot />
    </div>
  );
}
