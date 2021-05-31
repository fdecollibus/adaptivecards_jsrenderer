# POD PodAdaptiveCardsTestings

This is a Micro Frontend deployable on the AXA.ch WebHub.

## Scripts

To install the pod locally: `npm install @axa-ch/pod-adaptive-cards-testings`

### DEV commands
- `npm start` start local DEV environment
- `npm run build` to trigger a ESM build needed for Midgard
- `npm run test` to run local tests
- `npm run release` to execute a release to npm (VERY IMPORTANT: Read How To Release on this document).

## How to release
1) update package.json in the `"version": "x.x.x"` field. Please follow [semver](https://semver.org/) best practices

2) run `npm run release`

3) commit to develop, add git tag containg the same version as in step 1 and push

4) Execute jenkins jobs (build & deploy and if all good: promote) with the version added in point 1

## Worth a read

- [Midgard](https://github.com/axa-ch/midgard#midgard)
- [Checklist for POD devs](https://github.com/axa-ch/create-pod-app#checklist-for-pod-devs)
