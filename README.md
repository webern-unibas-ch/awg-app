# AWG App

![GitHub package.json version](https://img.shields.io/github/package-json/v/webern-unibas-ch/awg-app.svg)
[![Build Status](https://travis-ci.org/webern-unibas-ch/awg-app.svg?branch=master)](https://travis-ci.org/webern-unibas-ch/awg-app)
[![codecov](https://codecov.io/gh/webern-unibas-ch/awg-app/branch/master/graph/badge.svg)](https://codecov.io/gh/webern-unibas-ch/awg-app)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A prototype web application for the online edition of the [Anton Webern Gesamtausgabe](https://www.anton-webern.ch), located at the Musicological Seminar of the University of Basel. It is written in [Angular](https://angular.io/) and runs on [edition.anton-webern.ch](https://edition.anton-webern.ch).

## Table of Contents

-   [Contributing](#contributing)
    -   [Quick start guide](#quick-start-guide)
        -   [Prerequisites](#prerequisites)
        -   [Development server](#development-server)
        -   [Code scaffolding](#code-scaffolding)
        -   [Build](#build)
        -   [Running unit tests](#running-unit-tests)
        -   [Running end-to-end tests](#running-end-to-end-tests)
        -   [Further help](#further-help)
    -   [Branching / Git flow](#branching--git-flow)
    -   [Commit Message Schema](#commit-message-schema)
    -   [Release Versioning Convention](#release-versioning-convention)
-   [License](#license)

## Contributing

## Quick start guide

### Prerequisites

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6 (for installation instructions see the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/packages/angular/cli/README.md)).

Both the Angular CLI and generated project have dependencies that require Node 8.9 or higher, together
with NPM 5.5.1 or higher.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Branching / Git flow

This project uses the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) which defines a strict branching model designed around the project release. Therefore the following branch structure is used

-   `master` (stores the official release history; all commits are tagged with a version number)
-   `develop` (serves as an integration branch for features; gets released into `release/xxx`)
-   `feature/XXX` (main branch for developing new features; gets merged into `develop`, never interacts with `master`)
-   `release/xxx` (used to prepare a release with latest features from `develop`; gets merged into `master`)
-   `hotfix/xxx` (used to quickly patch production releases; forked from and merged directly into `master`)

To initialize the GitFlow workflow execute `git flow init` inside your local copy of the repository.

## Commit Message Schema

This project follows the [Conventional Commits Specification](https://conventionalcommits.org) using [commitlint](https://conventional-changelog.github.io/commitlint/#/) based on the [Angular configuration](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular) (further explanation can be found in the [Angular commit-message-guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)).

Using these conventions leads to more readable messages that are easy to follow when looking through the project history. But also, we use the git commit messages to autogenerate the [CHANGELOG](https://github.com/webern-unibas-ch/awg-app/blob/master/LICENSE.md) and automate versions by means of [standard-version](https://github.com/conventional-changelog/standard-version) (see "Release Versioning Convention" section below).

When writing commit messages, we stick to this schema:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory, and **type** and **scope** of the header must be one of the following:

Types:

-   `build` (changes that affect the build system or external dependencies; no production code changes),
-   `ci` (changes to Continuous Integration, no production code changes)
-   `docs` (changes to the documentation, no production code changes),
-   `feat` (new feature for the user),
-   `fix` (bug fix for the user),
-   `perf` (code change that improves performance),
-   `refactor` (refactoring production code, eg. renaming a variable),
-   `revert` (reverting a former commit),
-   `style` (formatting, etc; no production code changes),
-   `test` (adding missing tests, refactoring tests; no production code changes)

Scopes (specific to this project, not part of the Angular convention):

-   `app`
-   `home`
-   `edition`
-   `search`
-   `structure`
-   `contact`

Example:

```
feat(edition): add route for resource creation

- add path for multipart request
- adapt handling of resources responder
```

## Release Versioning Convention

We use the git commit messages to autogenerate the [CHANGELOG](https://github.com/webern-unibas-ch/awg-app/blob/master/CHANGELOG.md) and automate versions by means of [standard-version](https://github.com/conventional-changelog/standard-version).

## License

The software code of this project is released under [MIT](https://opensource.org/licenses/MIT) license, see [LICENSE.md](https://github.com/webern-unibas-ch/awg-app/blob/master/LICENSE.md).

The contents of the webpage are released under [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/), see [Disclaimer](http://edition.anton-webern.ch/contact#awg-disclaimer).
