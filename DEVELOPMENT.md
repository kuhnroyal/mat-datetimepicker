# Developer Instructions

- [Getting started](#getting-started)
- [Development](#development)
  - [Local build](#performing-a-local-build)
  - [Runing the sample](#running-the-sample-app-locally)
  - [External testing](#using-the-local-build-in-another-project)
- [Before committing](#committing)

## Getting started

Run `npm install` in order to install all required dependencies and initialize the Git hooks.

## Development

### Performing a local build

```sh
npm run build
```

For a production build use the `build:prod` script. Either way the output will be available in `dist/{core,moment}`.

### Running the sample app locally

The sample application will automatically launch on [http://localhost:4200/](http://localhost:4200/).

```sh
npm run build
npm run start
```

### Using the local build in another project

Navigate into the project you want to link mat-datetimepicker to.

```sh
cd my-project
```

Add the dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@mat-datetimepicker/core": "8.0.0",
    "@mat-datetimepicker/moment": "8.0.0"
  }
}
```

Link the local built modules:

```sh
npm link "@mat-datetimepicker/core"
npm link "@mat-datetimepicker/moment"
```

## Committing

This project uses a mix of [`@commitlint`](https://www.npmjs.com/package/@commitlint/cli)
and [`standard-version`](https://www.npmjs.com/package/standard-version) for automated versioning and deployment.

Developers have to follow so-called conventional commit messages, or we will not accept changes!
In short: The commit message has to follow this pattern (the `?` marks an optional part):

```
type(scope?): subject

body?

footer?
```

All available types are documented
in [`.versionrc.json`](https://github.com/kuhnroyal/mat-datetimepicker/blob/canary/.versionrc.json). A brief summary of
conventional commits is available [at their website](https://www.conventionalcommits.org/en/v1.0.0/#summary).

### Git hooks

If you are not yet familiar with conventional commits: no worries! We have added a Git hooks which will validate your
commit message - and notify you about any mistakes made.
