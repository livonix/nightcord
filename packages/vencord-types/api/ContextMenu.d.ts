export function addContextMenuPatch(channelId: string, patch: (menu: any, props: any) => any): () => void;
export function removeContextMenuPatch(channelId: string, patch: (menu: any, props: any) => any): void;
