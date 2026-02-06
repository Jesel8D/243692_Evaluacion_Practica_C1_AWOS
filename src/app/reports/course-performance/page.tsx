import { getCoursePerformance } from '@/lib/queries';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CoursePerformancePage(props: Props) {
    const searchParams = await props.searchParams;
    const term = (searchParams.term as string) || '';

    const courses = await getCoursePerformance(term);

    return (
        <div className="p-6 space-y-6">
            <header className="border-b pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Rendimiento por Asignatura</h1>
                    <p className="text-gray-500 mt-1">Análisis de aprobados vs. reprobados.</p>
                </div>

                {/* Filtro */}
                <form className="flex gap-2 items-center">
                    <input
                        name="term"
                        defaultValue={term}
                        placeholder="Periodo (Ej: 2024-1)"
                        className="block border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                    <button type="submit" className="bg-gray-900 text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800 transition-colors">
                        Filtrar
                    </button>
                </form>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course: any, idx: number) => (
                    <div key={idx} className={`p-5 rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md ${
                        course.failed_count > 0 ? 'border-t-4 border-t-red-600 border-x-gray-200 border-b-gray-200' : 'border border-gray-200'
                    }`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-900 truncate pr-2" title={course.course_name}>
                                {course.course_name}
                            </h3>
                            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                                {course.term}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Inscritos</p>
                                <p className="font-semibold text-xl text-gray-800">{course.enrolled_count}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Promedio</p>
                                <p className={`font-semibold text-xl ${Number(course.average_grade) < 7 ? 'text-red-700' : 'text-gray-800'}`}>
                                    {Number(course.average_grade).toFixed(1)}
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                            <span className="text-gray-500">Reprobados:</span>
                            <span className={`font-bold ${Number(course.failed_count) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                {course.failed_count}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}