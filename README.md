# AWG App

![GitHub package.json version](https://img.shields.io/github/package-json/v/webern-unibas-ch/awg-app.svg)
[![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/webern-unibas-ch/awg-app/@angular/core?color=blue&label=angular&logo=angular)](https://github.com/angular/angular)
![Node.js version](https://img.shields.io/badge/node.js-%3E=v18.19.1-blue)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/webern-unibas-ch/awg-app)
![CI Workflow](https://github.com/webern-unibas-ch/awg-app/actions/workflows/ci_workflow.yml/badge.svg)
[![codecov](https://codecov.io/gh/webern-unibas-ch/awg-app/graph/badge.svg?token=IO5EgI81R6)](https://codecov.io/gh/webern-unibas-ch/awg-app)
[![compodoc](https://edition.anton-webern.ch/compodoc/images/coverage-badge-documentation.svg)](https://edition.anton-webern.ch/compodoc/index.html)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/webern-unibas-ch/awg-app/badge)](https://scorecard.dev/viewer/?uri=github.com/webern-unibas-ch/awg-app)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/8862/badge)](https://www.bestpractices.dev/projects/8862)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.1%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.4717678.svg)](https://doi.org/10.5281/zenodo.4717678)

A web application for the online edition of the [Anton Webern Gesamtausgabe](https://www.anton-webern.ch) (AWG), located at the Department of Musicology of the University of Basel. It is written in [Angular](https://angular.io/) and runs on [edition.anton-webern.ch](https://edition.anton-webern.ch).

**Project Status**: This project is actively maintained.

<img width="947" alt="Screenshot 2024-10-26 124804" src="https://github.com/user-attachments/assets/e5403d43-c555-4097-a250-79b5184a4e47">

## Table of Contents

-   [Description](#description)
-   [Prerequisites](#prerequisites)
-   [Getting Started](#getting-started)
-   [Usage](#usage)
-   [Building](#building)
-   [Releases](#releases)
-   [Testing](#testing)
-   [Contributing](#contributing)
-   [Contributors ✨](#contributors-✨)
-   [License](#license)
-   [Contact and Issue Reporting](#contact-and-issue-reporting)

## Description

This repository houses the source code for the web application that powers the online edition of the Anton Webern Gesamtausgabe (AWG). Our goal is to provide a comprehensive, accessible, and interactive platform for exploring the works of Anton Webern.

## Prerequisites

To run the code base yourself, there are only a few prerequisites to take care of. We use (modern) [Yarn](https://yarnpkg.com/) for dependency managing, so, before you begin, ensure you have met the following requirements:

-   You have installed the latest version of Node.js. You can check this by running `node -v` in your terminal. If Node.js is not installed, you can download it from [here](https://nodejs.org/) or use a Node version manager like `nvm` ([Posix](https://github.com/nvm-sh/nvm)/[Windows](https://github.com/coreybutler/nvm-windows)).
-   To activate Yarn, follow the instructions [here](https://yarnpkg.com/getting-started/install):
    -   Run `corepack enable` in the terminal (may need admin privileges to access node folder).
    -   Check that Yarn was installed by running `yarn -v` in your terminal.

> [!NOTE]
> While it's likely that the project can be run with [classic Yarn](https://classic.yarnpkg.com/en/), please be aware that this is no longer actively tested.

## Getting Started

To get started with this project, follow these steps:

1. Make sure you meet the prerequisites.
2. Clone the repository: `git clone [repository_url]`
3. Navigate into the project directory: `cd [project_directory]`
4. Install the dependencies: `yarn install`

## Usage

In the project directory, you can run the following command to serve the app in development mode:

-   `yarn start` or `ng s`: Serves the app in the development mode. Open [http://localhost:4200](http://localhost:4200) to view it in the browser.

During the development process, you'll also find the following commands useful for maintaining code quality and understanding the codebase:

-   `yarn lint`: Scans for linting errors using ESLint.

-   `yarn lint:fix`: Lints the project and automatically fixes any fixable issues.

-   `yarn doc:serve`: Generates documentation for the project using Compodoc and serves it at a local server. Open the URL provided in the terminal to view it in your web browser.

## Building

To build the app, use the following commands:

-   `yarn build:prod`: Builds the app for production to the `dist` folder.

-   `yarn build:gh`: Same as `yarn build:prod`, but additionally prepares the build for deployment on GitHub Pages (includes base-href setting).

## Releases

Releases for this project are automatically managed via Continuous Integration (CI). The following commands are involved in the release process:

-   `yarn pre-release`: Updates the app version and creates a changelog from the commit history.

-   `yarn deploy:ci`: Runs `angular-cli-ghpages` to deploy the app on GitHub Pages. To be used only from CI.

## Testing

This project uses a dynamic testing approach with Jasmine and Karma for unit tests in Angular. Code coverage is measured with CodeCov.

We encourage contributors to uphold these standards. As such, new contributions are expected to include tests whenever applicable.

To assist with this, the following commands are provided:

-   `yarn test`: Launches the test runner.

-   `yarn test:cov`: Runs the tests and generates a coverage report.

-   `yarn test:cov:serve`: Runs the tests, generates a coverage report, and serves the coverage report at [http://localhost:9875](http://localhost:9875).

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) for more details how you may contribute to this project.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://dhlab.unibas.ch/#/team/muennich"><img src="https://avatars.githubusercontent.com/u/21059419?v=4?s=100" width="100px;" alt="Stefan Münnich"/><br /><sub><b>Stefan Münnich</b></sub></a><br /><a href="https://github.com/webern-unibas-ch/awg-app/commits?author=musicEnfanthen" title="Code">💻</a> <a href="https://github.com/webern-unibas-ch/awg-app/commits?author=musicEnfanthen" title="Tests">⚠️</a> <a href="#ideas-musicEnfanthen" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/webern-unibas-ch/awg-app/commits?author=musicEnfanthen" title="Documentation">📖</a> <a href="#projectManagement-musicEnfanthen" title="Project Management">📆</a> <a href="#maintenance-musicEnfanthen" title="Maintenance">🚧</a> <a href="#infra-musicEnfanthen" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#design-musicEnfanthen" title="Design">🎨</a> <a href="#content-musicEnfanthen" title="Content">🖋</a> <a href="https://github.com/webern-unibas-ch/awg-app/issues?q=author%3AmusicEnfanthen" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/masthom"><img src="https://avatars.githubusercontent.com/u/53256309?v=4?s=100" width="100px;" alt="Thomas"/><br /><sub><b>Thomas</b></sub></a><br /><a href="#projectManagement-masthom" title="Project Management">📆</a> <a href="#ideas-masthom" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/webern-unibas-ch/awg-app/commits?author=masthom" title="Documentation">📖</a> <a href="#content-masthom" title="Content">🖋</a> <a href="#data-masthom" title="Data">🔣</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/chael-mi"><img src="https://avatars.githubusercontent.com/u/108875866?v=4?s=100" width="100px;" alt="chael-mi"/><br /><sub><b>chael-mi</b></sub></a><br /><a href="#ideas-chael-mi" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/webern-unibas-ch/awg-app/commits?author=chael-mi" title="Documentation">📖</a> <a href="#content-chael-mi" title="Content">🖋</a> <a href="#data-chael-mi" title="Data">🔣</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/vanBithoven"><img src="https://avatars.githubusercontent.com/u/86300228?v=4?s=100" width="100px;" alt="vanBithoven"/><br /><sub><b>vanBithoven</b></sub></a><br /><a href="https://github.com/webern-unibas-ch/awg-app/commits?author=vanBithoven" title="Code">💻</a> <a href="https://github.com/webern-unibas-ch/awg-app/commits?author=vanBithoven" title="Tests">⚠️</a> <a href="https://github.com/webern-unibas-ch/awg-app/commits?author=vanBithoven" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AMWilke"><img src="https://avatars.githubusercontent.com/u/101800133?v=4?s=100" width="100px;" alt="AMWilke"/><br /><sub><b>AMWilke</b></sub></a><br /><a href="#data-AMWilke" title="Data">🔣</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

The software code of this project is released under [MIT](https://opensource.org/licenses/MIT) license, see [LICENSE.md](https://github.com/webern-unibas-ch/awg-app/blob/main/LICENSE.md).

The contents of the webpage are released under [Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/), see [Disclaimer](http://edition.anton-webern.ch/contact#awg-disclaimer).

## Contact and Issue Reporting

If you encounter a bug or any issue with the application, please report it by creating a new issue in the GitHub repository. When creating an issue, try to provide as much information as possible to help us understand and reproduce the problem.

For security concerns, please do not create a public issue. Instead, send an email directly to <info-awg[at]unibas.ch>, following our [Security Policy](SECURITY.md). We take all security issues seriously and will respond as quickly as possible to resolve the matter.

For any other queries or if you wish to reach out directly, please contact us at <info-awg[at]unibas.ch>.
