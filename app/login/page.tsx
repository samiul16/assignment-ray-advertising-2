"use client";

import { users } from "@/lib/dummyUsers";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const handleLogin = async (userId: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);

    router.push("/board");
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-xl font-bold">Select User</h1>

      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => handleLogin(user.id)}
          className="block p-3 bg-blue-500 text-white rounded"
        >
          {user.name} ({user.role})
        </button>
      ))}
    </div>
  );
}
