import { describe, it, expect } from 'vitest';
import {
	imageUrl,
	imageSrcSet,
	placeholder,
	coInfraTransform,
	formatOps,
	DEFAULT_BASE,
} from '../src/index';

const DID = 'did:plc:bcgltzqazw5tb6k2g3ttenbj';
const CID = 'bafkreieaezg7ybnl2ax54owmaqi357gvwdo3rn3ui7b3wtu6i4yp6t3lbe';

describe('imageUrl', () => {
	it('builds a blob URL with mapped, comma-joined params', () => {
		expect(imageUrl(DID, CID, { width: 800, quality: 80, format: 'auto' })).toBe(
			`${DEFAULT_BASE}/blob/${DID}/${CID}/w=800,q=80,f=auto`
		);
	});

	it('omits params when none are given', () => {
		expect(imageUrl(DID, CID)).toBe(`${DEFAULT_BASE}/blob/${DID}/${CID}/`);
	});

	it('keeps raw DID colons, which the CDN accepts', () => {
		expect(imageUrl(DID, CID, { width: 100 })).toContain('/blob/did:plc:');
	});

	it('honors a custom baseURL', () => {
		expect(imageUrl(DID, CID, { width: 100 }, { baseURL: 'https://example.test' })).toBe(
			`https://example.test/blob/${DID}/${CID}/w=100`
		);
	});
});

describe('formatOps', () => {
	it('clamps width and height to 1..4096', () => {
		expect(formatOps({ width: 99999 })).toBe('w=4096');
		expect(formatOps({ height: 0 })).toBe('h=1');
	});

	it('clamps quality to 1..100 and dpr to 1..2', () => {
		expect(formatOps({ quality: 500 })).toBe('q=100');
		expect(formatOps({ dpr: 3 })).toBe('dpr=2');
	});

	it('strips a leading # from background', () => {
		expect(formatOps({ background: '#ffffff' })).toBe('bg=ffffff');
		expect(formatOps({ background: 'fff' })).toBe('bg=fff');
	});

	it('maps every operation to its short key in order', () => {
		expect(
			formatOps({
				width: 1,
				height: 2,
				fit: 'cover',
				gravity: 'auto',
				blur: 5,
				sharpen: 3,
				rotate: 90,
			})
		).toBe('w=1,h=2,fit=cover,g=auto,blur=5,sharpen=3,rotate=90');
	});
});

describe('imageSrcSet', () => {
	it('emits one candidate per width with descriptors', () => {
		expect(imageSrcSet(DID, CID, { widths: [200, 400], format: 'webp' })).toBe(
			`${DEFAULT_BASE}/blob/${DID}/${CID}/w=200,f=webp 200w, ` +
				`${DEFAULT_BASE}/blob/${DID}/${CID}/w=400,f=webp 400w`
		);
	});
});

describe('placeholder', () => {
	it('is a tiny blurred webp URL', () => {
		expect(placeholder(DID, CID)).toBe(
			`${DEFAULT_BASE}/blob/${DID}/${CID}/w=20,q=30,f=webp,blur=10`
		);
	});
});

describe('unpic transformer face', () => {
	it('produces output identical to imageUrl', () => {
		const ops = { width: 640, quality: 80, format: 'auto' as const };
		expect(coInfraTransform(`${DID}/${CID}`, ops)).toBe(imageUrl(DID, CID, ops));
	});
});
