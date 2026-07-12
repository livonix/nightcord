export interface SettingsEntry {
    key: string;
    title: string;
    Component: any;
    Icon: any;
}

export interface SettingsSection {
    section: string;
    label: string;
    element: any;
    className?: string;
}

declare const SettingsPlugin: {
    store: Record<string, any>;
    utils: Record<string, any>;
    customEntries: SettingsEntry[];
    customSections: Array<() => SettingsSection>;
};

export default SettingsPlugin;
