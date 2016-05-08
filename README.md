# Pip.WebUI Library [(http://git.pipdevs.com/pip-core/pip-webui)](http://git.pipdevs.com/pip-core/pip-webui)

A composition of all libraries, services, controls and pages that prepresent Pip.WebUI framework

The module contains the following functionality:

* 3rd party libraries: Lodash, Async, Angular, Angular-Material and others
* CSS framework, reusable LESS variables and mixins, CSS components 
* Generic non-visual services
* Pip.Services REST API and related non-visual services
* Generic controls 
* Connected controls that work with Pip.Services platform
* Reusable application pages and dialogs  

Quick Links:

* [Documentation](#documentation)
* [Contributing](#contributing)
* [Building](#building)
* [Installing](#installing)

## <a name="documentation"></a> Online Documentation

- Visit [documentation](doc/index.md) page
- Or build the project, launch and open samples; see [Building](#building) for details
   
## <a name="contributing"></a> Contributing

Developers interested in contributing should read the following guidelines:

- [Issue Guidelines](docs/guides/CONTRIBUTING.md#submit)
- [Contributing Guidelines](docs/guides/CONTRIBUTING.md)
- [Coding Guidelines](docs/guides/CODING.md)
- [ChangeLog](CHANGELOG.md)

> Please do **not** ask general questions in an issue. Issues are only to report bugs, request
  enhancements, or request new features. For general questions and discussions, use the
  [Pip Devs Forum](https://groups.google.com/forum/#!forum/pipdevs).

It is important to note that for each release, the [ChangeLog](CHANGELOG.md) is a resource that will
itemize all:

- Bug Fixes
- New Features
- Breaking Changes
   
## <a name="building"></a> Building

Developers can easily build the project using NPM and gulp.

* [Builds - Under the Hood](docs/guides/BUILD.md)

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

For more details on how the build process works and additional commands (available for testing and
debugging) developers should read the [Build Instructions](docs/guides/BUILD.md).

## <a name="installing"></a> Installing Build (Distribution Files)

#### NPM

Change to your project's root directory.

```bash
# To install the entire pip-webui library
npm install git+ssh://git@git.pipdevs.com:pip-core/pip-webui.git
```
