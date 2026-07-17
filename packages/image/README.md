# @co-infra/image

Build [`img.infra.coop`](https://infra.coop) image URLs and srcsets. Zero dependencies. Use
it on its own, or as an [unpic](https://unpic.pics) transformer to get a full image component
in any framework.

AT Protocol apps store images as blobs, each addressed by a DID (the account id) and a CID
(a hash of the file). This builds the CDN URL that resizes and reformats that blob.

## Install

```bash
npm install @co-infra/image
```

## Standalone

```ts
import { imageUrl, imageSrcSet, placeholder } from '@co-infra/image';

const did = 'did:plc:abc123';
const cid = 'bafkrei...';

imageUrl(did, cid, { width: 800, format: 'auto' });
// https://img.infra.coop/blob/did:plc:abc123/bafkrei.../w=800,f=auto

imageSrcSet(did, cid, { widths: [400, 800, 1200], format: 'webp' });
// three candidates, each with a `400w` style descriptor

placeholder(did, cid);
// a tiny blurred URL for a blur-up placeholder, no pixel fetch
```

Drop the results straight into an `<img>`:

```html
<img
	src="https://img.infra.coop/blob/{did}/{cid}/w=800,f=auto"
	srcset="..."
	sizes="(max-width: 800px) 100vw, 800px"
	loading="lazy"
	decoding="async"
/>
```

## With unpic

`coInfraTransform` matches unpic's transformer signature, so it works with any
`@unpic/*/base` component and you inherit responsive srcset, lazy loading, and layout
handling for free. The `src` is the blob identity, written `did/cid`.

```tsx
import { Image } from '@unpic/react/base';
import { coInfraTransform } from '@co-infra/image';

<Image
	src={`${did}/${cid}`}
	transformer={coInfraTransform}
	width={800}
	height={600}
	operations={{ format: 'auto' }}
/>;
```

## Options

Every builder takes an `Operations` object: `width`, `height`, `dpr`, `quality`, `format`,
`fit`, `gravity`, `blur`, `sharpen`, `rotate`, `background`. Values outside their range are
clamped. Pass `{ baseURL }` as the last argument to point at a private CDN instance.

## License

[MIT](../../LICENSE).
