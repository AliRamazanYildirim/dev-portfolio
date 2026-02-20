/**
 * Generic Repository Types – Tip-güvenli Repository kontratları (ISP/DIP).
 *
 * v2: Domain-spesifik repository interface'leri eklendi (ISP).
 * Generic IRepository yanı sıra amaç-odaklı dar interface'ler sunulur.
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

/* ================================================================
 * Domain-Specific Repository Interfaces (ISP)
 *
 * Her domain sadece ihtiyaç duyduğu operasyonları kullanır.
 * Generic IRepository yerine bu dar interface'ler tercih edilmelidir.
 * ================================================================ */

/* ---------- Project Read Repository ---------- */

export interface IProjectReadRepository<T> {
    findMany(opts: FindManyOptions): Promise<T[]>;
    findUnique(opts: FindUniqueOptions<{ id?: string; slug?: string }>): Promise<T | null>;
}

/* ---------- Project Write Repository ---------- */

export interface IProjectWriteRepository<T> {
    create(opts: CreateOptions): Promise<T>;
    update(opts: MutateOptions): Promise<T | null>;
    bulkUpdate(operations: Array<{ id: string; data: Record<string, unknown> }>): Promise<unknown>;
}

/* ---------- Project Image Repository ---------- */

export interface IProjectImageRepository<T> {
    findMany(opts: FindManyOptions): Promise<T[]>;
    createMany(params: { data: Array<Partial<T> & Record<string, unknown>> }): Promise<T[]>;
    deleteMany(opts: { where: Record<string, unknown> }): Promise<unknown>;
}

/* ---------- Customer Repository (Narrowed) ---------- */

export interface ICustomerReadRepository<T> {
    findByIdExec(id: string): Promise<T | null>;
    findUnique(opts: FindUniqueOptions): Promise<T | null>;
    findOneExec(filter: Record<string, unknown>): Promise<T | null>;
}

export interface ICustomerWriteRepository<T> {
    create(opts: CreateOptions): Promise<T>;
    update(opts: MutateOptions): Promise<T | null>;
}

/* ---------- Referral Transaction Repository ---------- */

export interface IReferralReadRepository<T> {
    findById(id: string): Promise<T | null>;
    findMany(opts: FindManyOptions): Promise<T[]>;
}

export interface IReferralWriteRepository<T> {
    create(opts: CreateOptions): Promise<T>;
    update(opts: MutateOptions): Promise<T | null>;
}
