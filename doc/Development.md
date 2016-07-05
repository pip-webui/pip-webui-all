# Development and Testing Guide <br/> Pip.Services Template

This document provides high-level instructions on how to build and test the library.

* [Environment Setup](#setup)
* [Installing](#install)
* [Building](#build)
* [Testing](#test)
* [Contributing](#contrib) 

## <a name="setup"></a> Environment Setup

TBD...

## <a name="install"></a> Installing

TBD...

## <a name="build"></a> Building

Developers can easily build the project using NPM and gulp.

First install or update your local project's **npm** tools:

```bash
# First install all the NPM tools:
npm install

# Or update
npm update
```

Then run the **gulp** tasks:

```bash
# To clean '/build' and '/dist' directories
gulp clean

# To build distribution files in the `/dist` directory
gulp build
```

## <a name="test"></a> Testing

TBD...

## <a name="contrib"></a> Contributing

Developers interested in contributing should read the following guidelines:

* [Issue Guidelines]()
* [Contributing Guidelines]()
* [Coding guidelines]()

> Please do **not** ask general questions in an issue. Issues are only to report bugs, request
  enhancements, or request new features. For general questions and discussions, use the
  [Pip Devs Forum](https://groups.google.com/forum/#!forum/pipdevs).

It is important to note that for each release, the [ChangeLog](../CHANGELOG.md) is a resource that will
itemize all:

- Bug Fixes
- New Features
- Breaking Changes