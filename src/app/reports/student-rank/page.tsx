import { getStudentRank, getPrograms } from '@/lib/queries';
import Link from 'next/link';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RankingPage(props: Props) {
    const searchParams = await props.searchParams;
    const selectedProgram = (searchParams.program as string) || '';

    // Data fetching
    const [students, programs] = await Promise.all([
        getStudentRank(selectedProgram),
        getPrograms()
    ]);

    return (
        <div className="p-6 space-y-6">
            <header className="border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Ranking Académico</h1>
                <p className="text-gray-500 mt-1">Mejores promedios por programa educativo.</p>
            </header>

            {/* Filtro Whitelist */}
            <div className="flex gap-2 flex-wrap pb-2">
                <Link
                    href="/reports/student-rank"
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors border ${
                        !selectedProgram
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Todos
                </Link>
                {programs.map((p: any) => (
                    <Link
                        key={p.program}
                        href={`/reports/student-rank?program=${encodeURIComponent(p.program)}`}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition-colors border ${
                            selectedProgram === p.program
                                ? 'bg-red-700 text-white border-red-700'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {p.program}
                    </Link>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                        <th className="p-4 text-center w-24">Posición</th>
                        <th className="p-4">Estudiante</th>
                        <th className="p-4">Programa</th>
                        <th className="p-4 text-right">Promedio</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {students.length === 0 ? (
                        <tr><td colSpan={4} className="p-6 text-center text-gray-500">Seleccione un programa o no hay datos.</td></tr>
                    ) : (
                        students.map((s: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs border ${
                                        s.rank_in_program === '1' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            s.rank_in_program === '2' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                                                s.rank_in_program === '3' ? 'bg-orange-50 text-orange-800 border-orange-200' :
                                                    'bg-white text-gray-400 border-transparent'
                                    }`}>
                                        {s.rank_in_program}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-900">{s.name}</td>
                                <td className="p-4 text-gray-500">{s.program}</td>
                                <td className="p-4 text-right font-bold text-gray-900">{s.average}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}