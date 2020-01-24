![](https://github.com/chabb/material-react/workflows/jest_tests/badge.svg)


This repo contains a set of components.

## Exported components

The exported components are located here:`src/periodic-table/index.ts`

## Deploy to npm

### Manually

Use `npm build-publish` to build the project.
Use `npm publish` to push to npm

#### Pre-releases

Tag your package. We use the `next` tag
`npm publish --tag next`  
This will prevent npm for considering it as the latest release

People who want to install a pre-release will need to specify the tag
`npm install d3@next`


### Automatically(TODO)

We plan to publish from github-actions, when a tag is pushed
You add a tag with `npm version minor -m "Upgrade to %s"`. This push automatically
to github. An action will push the build to npm

## Deploy storybook to github pages

This will **build** and **deploy** the storybook.
Stories are defined in `./src/stories`

```
npm deploy-storybook
```

## Clean 
