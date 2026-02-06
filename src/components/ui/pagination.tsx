'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PaginationProps {
    page: number;
    hasNextPage: boolean;
    isFirstPage: boolean;
}

export function Pagination({ page, hasNextPage, isFirstPage }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex items-center gap-4 select-none">
            {/* Botón anterir */}
            {isFirstPage ? (
                // Si es la primera pagina entonces mostramos un boton gris inactivo
                <span className="px-4 py-2 text-sm text-gray-400 bg-gray-100 border border-gray-200 rounded cursor-not-allowed">
                    Anterior
                </span>
            ) : (
                // Si no es la primera entonces si mostramos el link como activo
                <Link
                    href={createPageURL(page - 1)}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                    Anterior
                </Link>
            )}

            <span className="text-sm font-medium text-gray-600">
                Página {page}
            </span>

            {/* Botón siguientee */}
            {!hasNextPage ? (
                // Si no hay mas datos, entonces en link se mostrara como inactivo
                <span className="px-4 py-2 text-sm text-gray-400 bg-gray-100 border border-gray-200 rounded cursor-not-allowed">
                    Siguiente
                </span>
            ) : (
                // Si hay mas datos, entonces se mostrara el link como activo
                <Link
                    href={createPageURL(page + 1)}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                    Siguiente
                </Link>
            )}
        </div>
    );
}