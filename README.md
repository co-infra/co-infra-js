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

CI runs `typecheck`, `test`, and `build` on every PR to `main`.

## Releasing

Each package versions on its own track. To publish, bump the package version, merge to
`main`, then push a package-scoped tag. The tag triggers a GitHub Actions workflow that
verifies the tag matches the package version, runs the checks, builds, and publishes to npm
with provenance.

```bash
# after the version bump is merged to main
git tag image-v0.1.0
git push origin image-v0.1.0
```

The workflow needs an `NPM_TOKEN` repository secret with publish rights to the `@co-infra`
scope.

## License

Packages here are embeddable in other people's apps, so they are permissive
([MIT](LICENSE)). The co-op's running services (workers, hosts) are `AGPL-3.0-or-later` in
their own repos.

## Status

`@co-infra/image` is complete and tested, with CI and a publish workflow in place. It is
ready for its first npm release (v0.1.0).
