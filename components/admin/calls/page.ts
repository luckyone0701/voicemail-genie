import { apiAdmin } from "@/lib/admin-api";

export default async function CallsPage() {
  const calls = await apiAdmin("calls");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Call Logs</h1>

      {calls.map(call => (
        <div key={call.id} className="p-4 bg-white rounded shadow mb-3">
          <p><strong>User:</strong> {call.userEmail}</p>
          <p><strong>Date:</strong> {call.createdAt}</p>
          <p><strong>Length:</strong> {call.duration}s</p>
          <p><strong>Transcript:</strong> {call.transcript}</p>
        </div>
      ))}
    </div>
  );
}
