<p align="center">
  <a href="https://example.com/">
    <img src="https://via.placeholder.com/72" alt="Logo" width=72 height=72>
  </a>

  <h3 align="center">Shrt</h3>

  <p align="center">
    Shrt is a URL-Shortner and Personal Landing Page (PLP) that allows marketers, influencers, and regular people to connect faster and more efficiently.
    <br>
    <a href="https://reponame/issues/new?template=bug.md">Report bug</a>
    ·
    <a href="https://reponame/issues/new?template=feature.md&labels=feature">Request feature</a>
  </p>
</p>

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->

![GitHub repo size](https://img.shields.io/github/repo-size/tkjohnson121/shrt)
![GitHub contributors](https://img.shields.io/github/contributors/tkjohnson121/shrt)
![GitHub stars](https://img.shields.io/github/stars/tkjohnson121/shrt?style=social)
![GitHub forks](https://img.shields.io/github/forks/tkjohnson121/shrt?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/tkjohnson121?style=social)

## Table of contents

- [Quick start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Contact](#contact)
- [License](#license)

## Quick start

Shrt uses ReactJS, on the fronted along with NextJS, Emotion, and Framer Motion.

Shrt uses GCP as a serverless backend.

- Install dependencies with `yarn`
- Start dev server with `yarn start`
- Clone [Acto](https://gitlab.com/gvempire/acto) to control the firebase app `gv-collection`.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of `node` and `yarn`

## Installation

To install SHRT, follow these steps:

yarn:

```
yarn install
```

## Usage

To use SHRT, use the following scripts:

- `start`: start development server
- `build`: build site for productions
- `build:docs`: build documentation site
- `build:docs-json`: build documentation site in JSON format
- `export`: export built next.js project to utilize SSG
- `serve`: serve production environemnt
- `serve:docs`: serve documentation site
- `type-check`: check typescript types
- `format`: format project
- `lint`: lint project
- `test`: run test suite
- `test:watch`: watch test suite
- `test:coverage`: testing coverage
- `predeploy`: format, build, test and anything else to be handled before deployment
- `use:development`: use the firebase development environment
- `use:staging`: use the firebase staging environment
- `use:production`: use the firebase production environment
- `changelog`: used to build/commit new docs and changelog, update the package version and push to git
- `deploy`: deploy all firebase environments
- `deploy:functions`: deploy firebase cloud functions for the current env
- `deploy:firestore`: deploy firebase firestore rules and indexes for the current env
- `deploy:storage`: deploy firebase storage rules for the current env
- `preview`: deploy preview to Vercel

## Contributing

<!--- If your README is long or you have some specific process or steps you want contributors to follow, consider creating a separate CONTRIBUTING.md file--->

To contribute to SHRT, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin shrt/<location>`
5. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Contributors

Thanks to the following people who have contributed to this project:

- [@tkjohnson121](https://github.com/tkjohnson121) 🚀

## Contact

If you want to contact me you can reach me at <kj@gvempire.dev>.

## License

This project uses the following license: [MIT](https://github.com/tkjohnson121/shrt/blob/main/LICENSE.md).
