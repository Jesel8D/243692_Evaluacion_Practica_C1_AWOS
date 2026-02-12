import { FilterSchema } from '@/lib/validations';
import { KpiCard } from '@/components/reports/KpiCard';
import { getStudentsAtRisk } from '@/lib/queries';
import { Search } from '@/components/ui/search';
import { Pagination } from '@/components/ui/pagination';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function StudentsAtRiskPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = FilterSchema.parse(searchParams);

    const { students, meta } = await getStudentsAtRisk(params.search, params.page, params.limit);

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-red-800">Alumnos en Riesgo</h1>
                <p className="text-blue-700">Identificación de estudiantes con promedio inferior a 7.0 o asistencia crítica.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard title="Alumnos Listados" value={meta.total} description={`Encontrados con filtro: "${params.search || 'Todos'}"`} />
                <KpiCard title="Promedio del Grupo" value={meta.avgGrade} description="Promedio general de estos alumnos" />
            </div>

            <div className="flex gap-2">
                <Search placeholder="Buscar por nombre o email..." />
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                        <th className="p-3 border-b">Estudiante</th>
                        <th className="p-3 border-b">Programa</th>
                        <th className="p-3 border-b text-center">Promedio</th>
                        <th className="p-3 border-b text-center">Asistencia %</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm">
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">
                                No se encontraron alumnos.
                            </td>
                        </tr>
                    ) : (
                        students.map((student: any) => (
                            <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 border-b">
                                    <div className="font-medium text-gray-900">{student.student_name}</div>
                                    <div className="text-xs text-gray-500">{student.email}</div>
                                </td>
                                <td className="p-3 border-b text-gray-600">{student.program}</td>
                                <td className={`p-3 border-b text-center font-bold ${Number(student.avg_grade) < 7 ? 'text-red-600' : 'text-orange-500'}`}>
                                    {Number(student.avg_grade).toFixed(1)}
                                </td>
                                <td className="p-3 border-b text-center text-gray-600">
                                    {student.attendance_pct}%
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <Pagination
                    page={params.page}
                    hasNextPage={params.page * params.limit < meta.total}
                    isFirstPage={params.page === 1}
                />
            </div>
        </div>
    );
}