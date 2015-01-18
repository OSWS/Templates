// Type definitions for OSWS Queues v0.0.3
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
    export interface ISyncBuffer {
        [name: string]: ISyncNode;
    }
    export interface IAsyncBuffer {
        [name: string]: IAsyncNode;
    }
    export interface IEachHandler {
        (content: string|ISyncCallback|IAsyncCallback, index: number): void;
    }
    export interface IConfig {
        timeout: number;
        sync: boolean;
        async: boolean;
    }
    export class Queue {
        config: IConfig;
        buffer: string[];
        sync: ISyncBuffer;
        async: IAsyncBuffer;
        get(index: number): any;
        addString(node: string): number;
        addSync(node: ISyncCallback): ISyncNode;
        addAsync(node: IAsyncCallback): IAsyncNode;
        add(node: any): number | IAsyncNode | ISyncNode;
        setString(index: number, node: string): void;
        setSync(index: number, node: ISyncCallback): void;
        setAsync(index: number, node: IAsyncCallback): void;
        set(index: number, node: any): void;
        each(handler: IEachHandler): void;
        private _renderSync(result);
        private _renderAsyncNext(result, callback);
        renderAsync(callback: (error?: Error, result?: string) => void): void;
        renderSync(force?: boolean): string;
        render(argument?: any): any;
    }
    export function isString(node: any): boolean;
    export function isSync(node: any): boolean;
    export function isAsync(node: any): boolean;
}