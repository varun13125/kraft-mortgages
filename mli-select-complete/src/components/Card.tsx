export default function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="card-body">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
