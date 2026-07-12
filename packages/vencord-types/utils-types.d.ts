import type { ComponentType } from "react";

export class Logger {
    constructor(name: string);
    public log(...args: any[]): void;
    public warn(...args: any[]): void;
    public error(...args: any[]): void;
    public info(...args: any[]): void;
    public debug(...args: any[]): void;
    public trace(...args: any[]): void;
}

export function useAwaiter<T>(promise: Promise<T>, defaultValue?: T): [T | undefined, any, boolean];
export function openModal(modal: any, props?: any): () => void;
export function closeModal(key: string): void;
export function useForceUpdater(): () => void;
export function wordsFromCamel(str: string): string;
export function wordsToTitle(str: string): string;

export const Margins: Record<string, string>;
export const ModalRoot: ComponentType<any>;
export const ModalHeader: ComponentType<any>;
export const ModalContent: ComponentType<any>;
export const ModalFooter: ComponentType<any>;
export const ModalCloseButton: ComponentType<any>;
export const ModalSize: Record<string, string>;
export const Modals: any;
