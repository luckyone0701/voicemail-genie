"use client";

import { useState, useEffect } from "react";
import { apiAdmin } from "@/lib/admin-api";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    apiAdmin("settings").then(setSettings);
  }, []);

  if (!settings) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">App Settings</h1>

      <pre className="p-4 bg-gray-100 rounded">
        {JSON.stringify(settings, null, 2)}
      </pre>
    </div>
  );
}
