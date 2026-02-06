'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function Pagination({ page, hasNextPage, isFirstPage }: { page: number, hasNextPage: boolean, isFirstPage: boolean }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex items-center gap-4">
            <button disabled={isFirstPage} onClick={() => replace(createPageURL(page - 1))} className="px-4 py-2 text-sm bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Anterior</button>
            <span className="text-sm text-gray-600">Página {page}</span>
            <button disabled={!hasNextPage} onClick={() => replace(createPageURL(page + 1))} className="px-4 py-2 text-sm bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Siguiente</button>
        </div>
    );
}