import type { ModuleExports } from "@vencord/discord-types/webpack";

export type FilterFn = (exports: ModuleExports, moduleId: string) => boolean;
export type LazyCallback<T = any> = (module: T) => void;

export declare function filters(...filters: FilterFn[]): FilterFn;
export declare function waitFor<T = any>(filter: FilterFn | string, callback: LazyCallback<T>): void;
export declare function findLazy<T = any>(...filters: FilterFn[]): T;
export declare function onceReady(callback: () => void): void;
export declare function waitForStore<T = any>(name: string, callback: (store: T) => void): void;
export declare function findByProps<T = any>(...props: string[]): T;
export declare function findAll<T = any>(filter: FilterFn | string): T[];
export declare function findByCode<T = any>(...code: string[]): T;
export declare function find<T = any>(filter: FilterFn | string): T;
export declare function findComponent<T = any>(...props: string[]): T;
export declare function findStore<T = any>(name: string): T;
export declare function findExportedComponent<T = any>(...props: string[]): T;
export declare function findAndPatch<T = any>(...filters: FilterFn[]): T;
export declare function proxyLazyWebpack<T = any>(factory: () => T): T;
export declare function LazyComponentWebpack<T = any>(factory: () => T): T;
export declare function extractAndLoadChunks(code: string[], matcher: (code: string) => boolean): Promise<boolean>;
export declare function mapMangledModule<T = any>(code: string, mapper: Record<string, string>, includeBlacklistedExports?: boolean): T;
