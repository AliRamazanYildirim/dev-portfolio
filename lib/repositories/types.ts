/**
 * Generic Repository Types – Tip-güvenli Repository kontratları (ISP/DIP).
 *
 * Repository'ler bu interface'leri kullanarak generic ve
 * amaç-odaklı API sunar. `any` kullanımını ortadan kaldırır.
 */

/* ---------- Ortak Sorgu Türleri ---------- */

export interface FindManyOptions<TWhere = Record<string, unknown>> {
    where?: TWhere;
    orderBy?: Record<string, "asc" | "desc" | 1 | -1>;
    select?: Record<string, boolean>;
}

export interface FindUniqueOptions<TWhere = Record<string, unknown>> {
    where: TWhere;
}

export interface MutateOptions<TData = Record<string, unknown>> {
    where: { id: string };
    data: TData;
}

export interface CreateOptions<TData = Record<string, unknown>> {
    data: TData;
}

export interface DeleteOptions {
    where: { id: string };
}

/* ---------- Read Repository ---------- */

export interface IReadRepository<T> {
    findMany(opts: FindManyOptions): Promise<T[]>;
    findUnique(opts: FindUniqueOptions): Promise<T | null>;
}

/* ---------- Write Repository ---------- */

export interface IWriteRepository<T> {
    create(opts: CreateOptions): Promise<T>;
    update(opts: MutateOptions): Promise<T | null>;
    delete(opts: DeleteOptions): Promise<T | null>;
}

/* ---------- Full Repository ---------- */

export interface IRepository<T> extends IReadRepository<T>, IWriteRepository<T> { }
