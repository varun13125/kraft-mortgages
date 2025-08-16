export default function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6">
      {title && <h3 className="text-lg font-semibold text-gray-100 mb-4">{title}</h3>}
      {children}
    </div>
  );
}