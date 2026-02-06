import { FilterSchema } from '@/lib/validations';
import { KpiCard } from '@/components/reports/KpiCard';
import { getStudentsAtRisk } from '@/lib/queries';
import { Search } from '@/components/ui/search';
import { Pagination } from '@/components/ui/pagination';

// Definimos el tipo para las props de la página
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function StudentsAtRiskPage(props: Props) {
    // Esperamos la promesa antes de usarla
    const searchParams = await props.searchParams;

    //Validar y limpiar parámetros
    const params = FilterSchema.parse(searchParams);

    // Obtener datos reales desde PostgreSQL
    //Ponemos un try/catch aquí para que la página no explote si la BD falla
    let students = [];
    try {
        students = await getStudentsAtRisk(params.search, params.page, params.limit);
    } catch (e) {
        console.error("Error cargando alumnos:", e);
        // Si explota la BD, students se queda vacío []
    }

    // Calcular KPIs
    const riskCount = students.length;
    const avgRiskGrade = riskCount > 0
        ? (students.reduce((acc: any, curr: any) => acc + Number(curr.avg_grade || 0), 0) / riskCount).toFixed(1)
        : "0";

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-red-800">Alumnos en Riesgo</h1>
                <p className="text-blue-700">Identificación de estudiantes con promedio inferior a 7.0 o asistencia crítica.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard title="Alumnos Listados" value={riskCount} description={`Encontrados en página ${params.page}`} />
                <KpiCard title="Promedio del Grupo" value={avgRiskGrade} description="Promedio general de estos alumnos" />
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
                                {riskCount === 0 ? "No hay alumnos o error de conexión." : "Cargando..."}
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
                    hasNextPage={students.length === params.limit}
                    isFirstPage={params.page === 1}
                />
            </div>
        </div>
    );
}