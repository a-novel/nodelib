# Node lib

![GitHub repo file or directory count](https://img.shields.io/github/directory-file-count/a-novel/nodelib)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/a-novel/nodelib)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/a-novel/nodelib/main.yaml)

## Installation

> ⚠️ **Warning**: Even though the package is public, GitHub registry requires you to have a Personal Access Token
> with `repo` and `read:packages` scopes to pull it in your project. See
> [this issue](https://github.com/orgs/community/discussions/23386#discussioncomment-3240193) for more information.

Create a `.npmrc` file in the root of your project if it doesn't exist, and make sure it contains the following:

```ini
@a-novel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${YOUR_PERSONAL_ACCESS_TOKEN}
```

Then, install the package using pnpm:

```bash
# pnpm config set auto-install-peers true
#  Or
# pnpm config set auto-install-peers true --location project
pnpm add -D @a-novel/nodelib-test
pnpm add @a-novel/nodelib-browser
```
