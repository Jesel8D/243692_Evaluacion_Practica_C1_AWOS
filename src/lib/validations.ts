import {z} from "zod";

//Hacemos la lista blanca para los programas academicos

const PROGRAMS = ['Sistemas', 'Mecatrónica', 'Administración'] as const;

export const FilterSchema = z.object({
    //Filtro obligatorio para vw_course_perfomance

    term: z.string().min(1, "El periodo es obligatorio"),

    //Lista blanca para vw_rank_students
    program: z.enum(PROGRAMS).optional(),

    //Busqueda para vw_students_at_risk
    search: z.string().optional(),

    //Paginacion para server-side
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
})

