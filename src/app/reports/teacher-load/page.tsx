import { getTeacherLoad } from '@/lib/queries';
import { Pagination } from '@/components/ui/pagination';
import { Search } from '@/components/ui/search';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TeacherLoadPage(props: Props) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const limit = 5;
    const search = (searchParams.search as string) || '';

    const teachers = await getTeacherLoad(search, page, limit);

    return (
        <div className="p-6 space-y-6">
            <header className="border-b pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Carga Académica Docente</h1>
                    <p className="text-gray-500 mt-1">Desempeño y volumen de alumnos por profesor.</p>
                </div>
                <div className="w-full md:w-64">
                    <Search placeholder="Buscar profesor..." />
                </div>
            </header>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <tr>
                        <th className="p-4 border-b border-gray-200">Profesor</th>
                        <th className="p-4 border-b border-gray-200 text-center">Grupos</th>
                        <th className="p-4 border-b border-gray-200 text-center">Alumnos</th>
                        <th className="p-4 border-b border-gray-200 text-center">Promedio Otorgado</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {teachers.map((t: any) => (
                        <tr key={t.teacher_id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">
                                {t.teacher_name}
                                <div className="text-xs text-gray-400 mt-0.5">{t.teacher_email}</div>
                            </td>
                            <td className="p-4 text-center text-gray-600">{t.total_groups}</td>
                            <td className="p-4 text-center font-semibold text-gray-800">{t.total_students}</td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                    Number(t.average_group_grade) > 8.5
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-orange-50 text-orange-700 border-orange-200'
                                }`}>
                                    {t.average_group_grade}
                                </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end pt-2">
                <Pagination
                    page={page}
                    hasNextPage={teachers.length === limit}
                    isFirstPage={page === 1}
                />
            </div>
        </div>
    );
}