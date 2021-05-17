![](https://github.com/chabb/material-react/workflows/jest_tests/badge.svg)
![publish-npm](https://github.com/materialsproject/mp-react-components/workflows/publish-npm/badge.svg)
[![codecov](https://codecov.io/gh/materialsproject/mp-react-components/branch/main/graph/badge.svg)](https://codecov.io/gh/materialsproject/mp-react-components)
![](https://img.shields.io/npm/v/mat-periodic-table?style=plastic)
![Test New React components](https://github.com/materialsproject/dash-mp-components/workflows/Test%20New%20React%20components/badge.svg)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://materialsproject.github.io/mp-react-components/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This repo contains a set of components for displaying and interacting with material science data. These components provide the building blocks for the interactive components of the Materials Project website.

## Local development

### Getting started

First, clone the mp-react-components repo: `git clone git@github.com:materialsproject/mp-react-components.git`

From inside the top directory, install the dependencies using: `npm install`

Deploy the app using: `npm start`

### Developing components

All the components are located in `src/components`

Create a new folder for each new component and name the folder after the component.

The file structure for each component should look like the following:

- `MyComponent/`
  - `MyComponent.tsx`
  - `index.tsx`
  - `MyComponent.css`
  - `MyComponent.test.tsx`

### Exporting components

To add a component to the list of components exported by this library, import and add the component to `src/index.ts`

### Developing with dash-mp-components

If you have a local version of `dash-mp-components` and `mp-react-components`, you'll probably
want to use the local version of `mp-react-components` for a better development workflow.
Running those commands will tell `NPM` to use your local version of `mp-react-components`

```
 cd <DASH_MP_HOME>
 npm link <REACT_MP_HOME>
```

## Deploy to npm

### Manually

Use `npm build-publish` to build the project.
Use `npm publish` to push to npm

#### Pre-releases

Every push triggers a build. If the build is succesfull, a snapshot is pushed
to npm, as a tagged package. To use the latest snapshot, type the following command

`npm install @materialsproject/mp-react-components@next`

### Automatically(TODO)

Run `npm version minor -m "Upgrade to %s"` to add a tag. Once the tag is pushed, an action will
build the components and push the package to build to npm

## Deploy storybook to github pages

This will **build** and **deploy** the storybook.
Stories are defined in `./src/stories`

```
npm deploy-storybook
```
