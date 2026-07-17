# co-infra-js

JavaScript packages for [co/infra](https://infra.coop), the community-owned cooperative that
runs free public infrastructure for the AT Protocol. Everything here publishes under the
`@co-infra` npm scope.

This is a monorepo. Each package lives in `packages/` and versions on its own track.

## Packages

| Package | What it is |
|---|---|
| [`@co-infra/image`](packages/image) | Build `img.infra.coop` URLs and srcsets. Zero dependencies. Works standalone or as an [unpic](https://unpic.pics) transformer. |

## Development

Uses [Bun](https://bun.sh) workspaces.

```bash
bun install
bun test        # run every package's tests
bun run build   # build every package
```

To add a package, drop a folder in `packages/` with its own `package.json` named
`@co-infra/<name>`. That is the whole setup.

## License

Packages here are embeddable in other people's apps, so they are permissive
([MIT](LICENSE)). The co-op's running services (workers, hosts) are `AGPL-3.0-or-later` in
their own repos.

## Status

Early. `@co-infra/image` is the first package and is not yet published.
