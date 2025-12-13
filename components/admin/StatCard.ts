export default function StatCard({ label, value }) {
  return (
    <div className="p-6 bg-white shadow rounded">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
