// Type definitions for OSWS Queues v0.0.0
// Project: https://github.com/OSWS/OSWS-Queues
// Definitions by: Ivan S Glazunov <https://github.com/ivansglazunov>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module 'osws-queues' {
    export interface INode {
        buffer: number;
    }
    export interface IAsyncCallback {
        (callback: (node: string) => void): void;
    }
    export interface ISyncCallback {
        (): string;
    }
    export interface IAsyncRender {
        (error?: Error, result?: string): void;
    }
    export interface ISyncNode extends INode {
        action(): string;
    }
    export interface IAsyncNode extends INode {
        action: IAsyncCallback;
    }
    export interface IConfig {
        timeout: number;
        sync: boolean;
        async: boolean;
    }
    export class Queue {
        config: IConfig;
        buffer: string[];
        sync: ISyncNode[];
        async: IAsyncNode[];
        addString(node: string): number;
        addSync(node: ISyncCallback): ISyncNode;
        addAsync(node: IAsyncCallback): IAsyncNode;
        add(node: any): number | IAsyncNode | ISyncNode;
        private _renderSync(result);
        private _renderAsyncNext(result, callback);
        renderAsync(callback: (error?: Error, result?: string) => void): void;
        renderSync(force?: boolean): string;
        render(argument?: any): any;
    }
}