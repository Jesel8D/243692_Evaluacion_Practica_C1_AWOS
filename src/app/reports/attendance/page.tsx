import { getAttendanceByGroup } from '@/lib/queries';

export default async function AttendancePage() {
    const groups = await getAttendanceByGroup();

    // Lógica simple para el KPI
    const totalAvg = groups.length > 0
        ? (groups.reduce((acc: number, curr: any) => acc + Number(curr.group_attendance_pct), 0) / groups.length).toFixed(1)
        : 0;

    const lowAttendanceCount = groups.filter((g: any) => Number(g.group_attendance_pct) < 75).length;

    return (
        <div className="p-6 space-y-6">
            <header className="border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Asistencia por Grupo</h1>
                <p className="text-gray-500 mt-1">Monitoreo de asistencia por clase y profesor.</p>
            </header>

            {/* Seccion KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Promedio Global</p>
                    <p className={`text-3xl font-bold mt-2 ${Number(totalAvg) < 80 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {totalAvg}%
                    </p>
                </div>
                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Grupos en Riesgo (&lt;75%)</p>
                    <p className={`text-3xl font-bold mt-2 ${lowAttendanceCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                        {lowAttendanceCount}
                    </p>
                </div>
                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Grupos Activos</p>
                    <p className="text-3xl font-bold mt-2 text-gray-900">
                        {groups.length}
                    </p>
                </div>
            </div>

            {/* Tabla de Reporte */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                    <tr>
                        <th className="p-4 border-b border-gray-200">Materia</th>
                        <th className="p-4 border-b border-gray-200">Profesor</th>
                        <th className="p-4 border-b border-gray-200 text-center">Periodo</th>
                        <th className="p-4 border-b border-gray-200 text-center">Alumnos</th>
                        <th className="p-4 border-b border-gray-200 w-1/3">Asistencia Global</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {groups.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                No hay datos registrados.
                            </td>
                        </tr>
                    ) : (
                        groups.map((g: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">{g.course_name}</td>
                                <td className="p-4 text-gray-600">{g.teacher_name}</td>
                                <td className="p-4 text-center">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">
                                        {g.term}
                                    </span>
                                </td>
                                <td className="p-4 text-center text-gray-600">{g.total_students}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${
                                                    Number(g.group_attendance_pct) < 75 ? 'bg-red-600' :
                                                        Number(g.group_attendance_pct) < 90 ? 'bg-orange-400' :
                                                            'bg-emerald-600'
                                                }`}
                                                style={{ width: `${g.group_attendance_pct}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold w-10 text-right text-gray-700">
                                            {g.group_attendance_pct}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}