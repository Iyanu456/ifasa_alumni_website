export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-center px-2 py-3 ">
      <p className="text-xl sm:text-2xl font-semibold">{value}</p>
      <p className="text-[0.7rem] sm:text-sm text-gray-600">{label}</p>
    </div>
  );
}
