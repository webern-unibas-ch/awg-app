# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Table of Contents

-   [Contribution process](#contribution-process)
    -   [Code Formatting](#code-formatting)
    -   [Testing](#testing)
    -   [Branching / Git flow](#branching--git-flow)
    -   [Commit Message Schema](#commit-message-schema)
    -   [Pull Requests](#pull-requests)
    -   [Release Versioning Convention](#release-versioning-convention)
    -   [Issue Reporting](#issue-reporting)
-   [Angular quick start guide](#quick-start-guide)
    -   [Prerequisites](#prerequisites)
    -   [Development server](#development-server)
    -   [Code scaffolding](#code-scaffolding)
    -   [Build](#build)
    -   [Running unit tests](#running-unit-tests)
    -   [Running end-to-end tests](#running-end-to-end-tests)
    -   [Further help](#further-help)
-   [Code of Conduct](#code-of-conduct)

## Contribution process

### Code Formatting

This project is set up to use Prettier for code formatting. This should be automatically enabled upon installation.

Prettier helps enforce a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

In addition to the automatic formatting, you can manually check and fix formatting issues using the following commands:

-   `yarn format-files:check`: This command checks the code for formatting issues.

-   `yarn format-files:fix`: This command fixes any formatting issues that it can.

### Testing

This project uses a dynamic testing approach with Jasmine and Karma for unit tests in Angular. Code coverage is measured with CodeCov.

We encourage contributors to uphold these standards. As such, new contributions are expected to include tests whenever applicable.

To assist with this, the following commands are provided:

-   `yarn test`: Launches the test runner.

-   `yarn test:cov`: Runs the tests and generates a coverage report.

-   `yarn test:cov:serve`: Runs the tests, generates a coverage report, and serves the coverage report at [http://localhost:9875](http://localhost:9875).

### Branching / Git flow

This project uses the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) which defines a strict branching model designed around the project releases. Therefore the following branch structure is used

-   `main` (stores the official release history; all commits are tagged with a version number)
-   `develop` (serves as an integration branch for features; gets released into `release/xxx`)
-   `feature/XXX` (main branch for developing new features; gets branched from and merged into `develop`, never interacts with `main`)
-   `release/xxx` (used to prepare a release with latest features from `develop`; gets merged into `main`)
-   `hotfix/xxx` (used to quickly patch production releases; forked from and merged directly into `main`)

To initialize the GitFlow workflow execute `git flow init` inside your local copy of the repository.

### Commit Message Schema

This project follows the [Conventional Commits Specification](https://conventionalcommits.org) using [commitlint](https://conventional-changelog.github.io/commitlint/#/) based on the [Angular configuration](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular) (further explanation can be found in the [Angular commit-message-guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)).

Using these conventions leads to more readable messages that are easy to follow when looking through the project history. But also, we use the git commit messages to autogenerate the [CHANGELOG](https://github.com/webern-unibas-ch/awg-app/blob/main/LICENSE.md) and automate versions by means of [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) (see "Release Versioning Convention" section below).

When writing commit messages, we stick to this schema:

```
[mandatory:] type(scope): subject
[optional:] <BLANK LINE>
[optional:] body...
[optional:] <BLANK LINE>
[optional:] footer...
```

The **header** (first line) is mandatory, with a **subject** message summarizing the changes of the commit. The **type** and **scope** of the header must be one of the following:

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

-   related to app structure

    -   `app`
    -   `assets`
    -   `contact`
    -   `core`
    -   `edition`
    -   `home`
    -   `page-not-found`
    -   `search`
    -   `shared`
    -   `side-info`
    -   `structure`
    -   `views`

-   related to build process and tests

    -   `deps`
    -   `deps-dev`
    -   `gh-actions`
    -   `testing`

-   related to documentation
    -   `CHANGELOG`
    -   `CONTRIBUTING`
    -   `LICENSE`
    -   `README`

#### Examples:

```
feat(edition): add route for resource creation

- add path for multipart request
- adapt handling of resources responder
```

```
docs(README): add new contributors for data
```

### Pull Requests

To provide a new feature or changes to the code, create a new feature branch from develop and make a pull request when ready. Keep care of the [Commit Message Schema](#commit-message-schema) described below.

For more information about pull requests go check out the GitHub Help [About pull requests](https://help.github.com/en/articles/about-pull-requests).

### Release Versioning Convention

We use the git commit messages to autogenerate the [CHANGELOG](https://github.com/webern-unibas-ch/awg-app/blob/main/CHANGELOG.md) and automate versions by means of [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version). See also [README#releases](README.md#releases).

### Issue Reporting

If you encounter a bug or any issue with the application, please report it by creating a new issue in the GitHub repository. When creating an issue, try to provide as much information as possible to help us understand and reproduce the problem.

For security concerns, please do not create a public issue. Instead, send an email directly to <info-awg[at]unibas.ch>, following our [Security Policy](SECURITY.md). We take all security issues seriously and will respond as quickly as possible to resolve the matter.

## Angular quick start guide

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3. Check there for necessary prerequisites (which comprise `Node` and `npm`or `yarn`).

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

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
