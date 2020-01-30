![](https://github.com/chabb/material-react/workflows/jest_tests/badge.svg)
![publish-npm](https://github.com/materialsproject/mp-react-components/workflows/publish-npm/badge.svg)


This repo contains a set of components.

## Exported components

The exported components are located here:`src/periodic-table/index.ts`

## Deploy to npm

### Manually

Use `npm build-publish` to build the project.
Use `npm publish` to push to npm

#### Pre-releases

Every push triggers a build. If the build is succesfull, a snapshot is pushed
to npm, as a tagged package. To use the latest snapshot, type the following command
    
`npm install mat-periodic-table@next`

### Automatically(TODO)

Run `npm version minor -m "Upgrade to %s"` to add a tag. Once the tag is pushed, an action will 
build the components and push the package to build to npm

## Deploy storybook to github pages

This will **build** and **deploy** the storybook.
Stories are defined in `./src/stories`

```
npm deploy-storybook
```

## Clean 
