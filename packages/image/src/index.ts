/**
 * co/infra image core.
 *
 * Zero-dependency helpers for building img.infra.coop URLs. The same URL
 * builder doubles as an unpic transformer, so you can use it on its own or
 * drop it into any unpic framework component.
 */

export type Format = 'auto' | 'webp' | 'avif' | 'jpeg' | 'png' | 'gif';
export type Fit = 'cover' | 'contain' | 'pad' | 'scale-down';

export interface Operations {
	/** Width in pixels, 1 to 4096. */
	width?: number;
	/** Height in pixels, 1 to 4096. */
	height?: number;
	/** Device pixel ratio, 1 to 2. Scales width and height. */
	dpr?: number;
	/** Compression quality, 1 to 100. */
	quality?: number;
	/** Output format. `auto` lets the CDN pick per request. */
	format?: Format;
	/** How to fit the target box. */
	fit?: Fit;
	/** Crop focus, e.g. `auto`, `top`, or a point like `0.5x0.3`. */
	gravity?: string;
	/** Blur strength, 1 to 250. */
	blur?: number;
	/** Sharpen strength, 0 to 10. */
	sharpen?: number;
	/** Rotation in degrees. */
	rotate?: 90 | 180 | 270;
	/** Background color as hex, with or without a leading `#`. */
	background?: string;
}

export interface Options {
	/** CDN base URL. Defaults to the public instance. */
	baseURL?: string;
}

/** The public co/infra image CDN. */
export const DEFAULT_BASE = 'https://img.infra.coop';

const clampInt = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));
const clampFloat = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * Maps friendly operation names to the CDN's short params, clamping each to
 * its valid range so the URL stays clean. The CDN clamps too, defensively.
 */
export function formatOps(ops: Operations): string {
	const parts: string[] = [];
	if (ops.width != null) parts.push(`w=${clampInt(ops.width, 1, 4096)}`);
	if (ops.height != null) parts.push(`h=${clampInt(ops.height, 1, 4096)}`);
	if (ops.dpr != null) parts.push(`dpr=${clampFloat(ops.dpr, 1, 2)}`);
	if (ops.quality != null) parts.push(`q=${clampInt(ops.quality, 1, 100)}`);
	if (ops.format != null) parts.push(`f=${ops.format}`);
	if (ops.fit != null) parts.push(`fit=${ops.fit}`);
	if (ops.gravity != null) parts.push(`g=${ops.gravity}`);
	if (ops.blur != null) parts.push(`blur=${clampInt(ops.blur, 1, 250)}`);
	if (ops.sharpen != null) parts.push(`sharpen=${clampFloat(ops.sharpen, 0, 10)}`);
	if (ops.rotate != null) parts.push(`rotate=${ops.rotate}`);
	if (ops.background != null) {
		const bg = ops.background.startsWith('#') ? ops.background.slice(1) : ops.background;
		parts.push(`bg=${bg}`);
	}
	return parts.join(',');
}

/**
 * unpic-shaped transformer. The src is the blob identity written as "did/cid".
 * The signature matches unpic's TransformerFunction, so this drops into any
 * unpic base component with no adapter.
 */
export function coInfraTransform(
	src: string | URL,
	operations: Operations,
	options?: Options
): string {
	const base = options?.baseURL ?? DEFAULT_BASE;
	const params = formatOps(operations);
	return `${base}/blob/${src}/${params}`;
}

/** Builds a single image URL from a DID and a blob CID. */
export function imageUrl(
	did: string,
	cid: string,
	ops: Operations = {},
	options?: Options
): string {
	return coInfraTransform(`${did}/${cid}`, ops, options);
}

/** Builds a responsive srcset string across the given widths. */
export function imageSrcSet(
	did: string,
	cid: string,
	config: { widths: number[] } & Omit<Operations, 'width'>,
	options?: Options
): string {
	const { widths, ...ops } = config;
	return widths
		.map((w) => `${imageUrl(did, cid, { ...ops, width: w }, options)} ${w}w`)
		.join(', ');
}

/**
 * Builds a tiny blur-up placeholder URL. Uses the CDN's own blur, so the
 * placeholder is just a URL, not a fetched-and-encoded pixel blob.
 */
export function placeholder(did: string, cid: string, options?: Options): string {
	return imageUrl(did, cid, { width: 20, blur: 10, quality: 30, format: 'webp' }, options);
}
