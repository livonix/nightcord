export type Patch = {
    find: string;
    replacement: {
        match: RegExp;
        replace: string;
    };
    plugin?: string;
    all?: boolean;
    noPatch?: boolean;
    predicate?(): boolean;
};
