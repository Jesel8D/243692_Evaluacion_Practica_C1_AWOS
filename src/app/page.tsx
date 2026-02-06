import Link from 'next/link';

export default function DashboardPage() {
    const reports = [
        {
            title: "Alumnos en Riesgo",
            desc: "Deteccion temprana de estudiantes con promedio bajo o inasistencias criticas.",
            href: "/reports/students-at-risk",
        },
        {
            title: "Carga Docente",
            desc: "Analisis del volumen de alumnos y desempeño academico por profesor.",
            href: "/reports/teacher-load",
        },
        {
            title: "Rendimiento Cursos",
            desc: "Tasas de aprobacion, reprobacion y promedios generales por materia.",
            href: "/reports/course-performance",
        },
        {
            title: "Asistencia Grupal",
            desc: "Monitoreo detallado de porcentajes de asistencia por grupo y periodo.",
            href: "/reports/attendance",
        },
        {
            title: "Ranking Académico",
            desc: "Listado de mejores promedios filtrado por programa educativo.",
            href: "/reports/student-rank",
        }
    ];

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 pb-6 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sistema de Gestion Academica</h1>
                    <p className="mt-2 text-gray-500">Panel de control y reportes ejecutivos</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <Link
                            key={report.href}
                            href={report.href}
                            className="group flex flex-col justify-between p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-600/40"
                        >
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                                    {report.title}
                                </h2>
                                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                    {report.desc}
                                </p>
                            </div>

                            <div className="mt-6 text-sm font-medium text-gray-400 group-hover:text-red-700 transition-colors">
                                Consultar
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}