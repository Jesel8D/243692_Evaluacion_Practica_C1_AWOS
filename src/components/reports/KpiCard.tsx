export function KpiCard({ title, value, description }: { title: string, value: string | number, description: string }) {
    return (
        <div className="p-4 bg-white border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
            <p className="text-2xl font-bold text-blue-600">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
    );
}