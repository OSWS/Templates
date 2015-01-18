// Type definitions for OSWS Templates v0.0.4
// Project: https://github.com/OSWS/OSWS-Templates
// Definitions by: Ivan S Glazunov <https://github.com/ivansglazunov>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="./queues.d.ts" />

declare module "osws-templates" {
	import Queues = require('osws-queues');
	
	// Core

	export interface IInjector {
		(parent: Prototype): void;
	}

	export var RegExpSearchSelectorRegExp: RegExp;
	export function RegExpSearch(data: string, reg: RegExp): string[][];
	export function RegExpSearchSelector(data: string): string[][];
	export function QueueContent(queue: Queues.Queue, args: any[]): any;

	// Prototype

	export class Prototype {
		parent: Prototype;
		extend(injector: IInjector): Prototype;
		returner(instance: Prototype): any;
		queue: Queues.Queue;
		render(callback: Queues.IAsyncRender): void;
	}

	// Content

	export type IContent = Array<string|Prototype|Queues.Queue|Queues.ISyncCallback|Queues.IAsyncCallback>;

	export class Flow extends Prototype {
		generator: Function;
		before(...arguments: any[]): Flow;
		content(...arguments: any[]): Flow;
		after(...arguments: any[]): Flow;
		inherit(...arguments: any[]): Flow;
		each(handler: (node: string|Queues.ISyncCallback|Queues.IAsyncCallback, indexes: number[]) => void): Flow;
	}

	export function content(...arguments: IContent): Prototype;

	// Tags

	export interface IAttributes {
		[name: string]: string;
	}

	export interface ISelectors {
		[index: number]: string|IAttributes;
	}

	export class Tag extends Flow {
		parseAttributes(...arguments: IAttributes[]): void;
		attr(...arguments: string[]): Tag;
		_singleOpen(): string;
		_doubleOpen(): string;
		_singleClose(): string;
		_doubleClose(): string;
		_attr(): string;
		attr(...arguments: Array<string|IAttributes>): Tag;
		attributes: any; // IAttributes in TypeScript not work with any keys...
		name: string;
	}

	// Elements

	export class Single extends Tag {}

	export interface ITagSingle {
		(...arguments: ISelectors[]): Double;
	}

	export class Double extends Tag {}

	export interface ITagDouble {
		(...arguments: ISelectors[]): (...arguments: IContent) => Double;
	}

	export interface ITagsSingle {
		br: ITagSingle; hr: ITagSingle; img: ITagSingle; input: ITagSingle; base: ITagSingle; frame: ITagSingle; link: ITagSingle; meta: ITagSingle;
	}

	export var single: ITagsSingle;

	export interface ITagsDouble {
		html: ITagDouble; body: ITagDouble; h1: ITagDouble; h2: ITagDouble; h3: ITagDouble; h4: ITagDouble; h5: ITagDouble; h6: ITagDouble; hgroup: ITagDouble; div: ITagDouble; p: ITagDouble; address: ITagDouble; blockquote: ITagDouble; pre: ITagDouble; ul: ITagDouble; ol: ITagDouble; li: ITagDouble; dl: ITagDouble; dt: ITagDouble; dd: ITagDouble; fieldset: ITagDouble; legend: ITagDouble; form: ITagDouble; noscript: ITagDouble; object: ITagDouble; table: ITagDouble; thead: ITagDouble; tbody: ITagDouble; tfoot: ITagDouble; tr: ITagDouble; td: ITagDouble; th: ITagDouble; col: ITagDouble; colgroup: ITagDouble; caption: ITagDouble; span: ITagDouble; b: ITagDouble; big: ITagDouble; strong: ITagDouble; i: ITagDouble; var: ITagDouble; cite: ITagDouble; em: ITagDouble; q: ITagDouble; del: ITagDouble; s: ITagDouble; strike: ITagDouble; tt: ITagDouble; code: ITagDouble; kbd: ITagDouble; samp: ITagDouble; small: ITagDouble; sub: ITagDouble; sup: ITagDouble; dfn: ITagDouble; bdo: ITagDouble; abbr: ITagDouble; acronym: ITagDouble; a: ITagDouble; button: ITagDouble; textarea: ITagDouble; select: ITagDouble; option: ITagDouble; article: ITagDouble; aside: ITagDouble; figcaption: ITagDouble; figure: ITagDouble; footer: ITagDouble; header: ITagDouble; section: ITagDouble; main: ITagDouble; nav: ITagDouble; menu: ITagDouble; audio: ITagDouble; video: ITagDouble; embed: ITagDouble; canvas: ITagDouble; output: ITagDouble; details: ITagDouble; summary: ITagDouble; mark: ITagDouble; meter: ITagDouble; progress: ITagDouble; template: ITagDouble; comment: ITagDouble;
	}

	export var double: ITagsDouble;

	export interface ITags extends ITagsSingle, ITagsDouble {}
	
	export var tags: ITags;

	export interface ITagsDoctype {
		html: ITagSingle; xml: ITagSingle; transitional: ITagSingle; strict: ITagSingle; frameset: ITagSingle; basic: ITagSingle; mobile: ITagSingle;
	}

	export var doctypes: ITagsDoctype;
}