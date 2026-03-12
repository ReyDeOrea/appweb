"use client";

import { useState } from "react";
import RequestsSent from "@/modules/adoption/presentation/views/RequestSent";
import RequestsReceived from "@/modules/adoption/presentation/views/RequestsReceived";
import { useRouter } from "next/navigation";

export default function Requests() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pt-10 px-4 md:px-10">
         <button
          className="text-black mr-4"
          onClick={() => router.back()}
        >
          &#8592; Volver
        </button>
      <h1 className="text-2xl text-black font-bold text-center mb-6">Solicitudes de adopción</h1>

      <div className="flex justify-center mb-6 border-b border-gray-200">
        <button
          className={`px-6 py-2 font-medium ${
            activeTab === "sent"
              ? "border-b-2 border-yellow-500 text-yellow-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Enviadas
        </button>

        <button
          className={`px-6 py-2 font-medium ${
            activeTab === "received"
              ? "border-b-2 border-yellow-500 text-yellow-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Recibidas
        </button>
      </div>

      <div className="min-h-[60vh]">
        {activeTab === "sent" ? <RequestsSent /> : <RequestsReceived />}
      </div>
    </div>
  );
}