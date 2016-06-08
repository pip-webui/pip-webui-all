# What is PIP.WebUI?

PIP.WebUI is the open source HTML5 UI Framework for building wonderful, cross-platform and
responsive websites with HTML, JavaScript and CSS. This library is the reference implementation of
Google's Material Design Specification.

PIP.WebUI allows developers to focus on building high quality application using common and public
open web technologies. This library imposes some architecture solution which makes a good showing
as reliable, accessible and speed up development of new projects.

The library provides assets of completed, well-tested and reusable UI components implemented Google
Material Design. Also, it has some all-sufficient UI components for quick development of unified and
handy applications.

![Libarary components](https://i.imgsafe.org/7e4aacec49.jpeg)


Altogether, the library has the following functionality:

* 3rd party libraries: Lodash, Angular, Angular-Material and others
* CSS framework, reusable LESS variables and mixins, CSS components
* Generic non-visual services
* Pip.Services REST API and related non-visual services
* Generic controls
* Connected controls that work with Pip.Services platform
* Reusable application pages and dialogs


Thus, we build PIP.WebUI library to be the easiest way for next reproducing cross-platform
applications in a short time and without excessive efforts.


## Quick links

* [Demos](#demos)
* [Installation](#installation)
* [Submodules](#dependcies)
* [Documentation](#documentation)
* [Contributing](#contributing)
* [Building](#building)
* [Installing](#installing)

## <a name="documentation"></a> Online Documentation

* Visit [documentation](doc/index.md) page
* [Quick start](/docs/quick-start.md)


## <a name="demos"></a>Demos

Library online [examples](http://webui.pipdevs.com/)

## <a name="installation"><a/>Installation

To begin using this library you have two ways: copy the build source JS and CSS files
(source files can be downloaded through [here](http://link.com))
or install those ones through npm (*recommended*):

```bash
npm install https://github.com/pip-webui/pip-webui.git
```

If you don't use a mobule bundler, it's also fine. The library npm package includes precompiled
production build in the `dist` folder. And you should manually add in a `index.html` file next lines:
```html
<!-- CSS styles -->
<link rel="stylesheet" href="<path_to_styles>/pip-webui-lib.css">
<link rel="stylesheet" href="<path_to_styles>/pip-webui.css">

<!-- javascript -->
<script src="<path_to_library>/pip-webui-lib.js"></script>
<script src="<path_to_library>/pip-webui.js"></script>
```

We have also built a `PIP.WebUI` seed project [link](http://link.com) which might be useful if this is
your first time using `PIP.WebUI`. To get this one, you should
execute next commands in your bash terminal:

```bash
git clone URL_to_seed_project
npm run init (install, build, etc)
```


## <a name="dependcies"></a>Submodules

* [pip-webui-lib](https://github.com/pip-webui/pip-webui-lib)
* [pip-webui-css](https://github.com/pip-webui/pip-webui-css)
* [pip-webui-core](https://github.com/pip-webui/pip-webui-core)
* [pip-webui-rest](https://github.com/pip-webui/pip-webui-rest)
* [pip-webui-layouts](https://github.com/pip-webui/pip-webui-layouts)
* [pip-webui-controls](https://github.com/pip-webui/pip-webui-controls)
* [pip-webui-nav](https://github.com/pip-webui/pip-webui-nav)
* [pip-webui-locations](https://github.com/pip-webui/pip-webui-locations)
* [pip-webui-documents](https://github.com/pip-webui/pip-webui-documents)
* [pip-webui-pictures](https://github.com/pip-webui/pip-webui-pictures)
* [pip-webui-composite](https://github.com/pip-webui/pip-webui-composite)
* [pip-webui-entry](https://github.com/pip-webui/pip-webui-entry)
* [pip-webui-errors](https://github.com/pip-webui/pip-webui-errors)
* [pip-webui-settings](https://github.com/pip-webui/pip-webui-settings)
* [pip-webui-guidance](https://github.com/pip-webui/pip-webui-guidance)
* [pip-webui-help](https://github.com/pip-webui/pip-webui-help)
* [pip-webui-support](https://github.com/pip-webui/pip-webui-support)


## <a name="contributing"></a>Contributing

Developers interested in contributing should read the following guidelines:

* [Issue Guidelines](http://somelink.com)
* [Contributing Guidelines](http://somelink.com)
* [Coding guidelines](http://somelink.com)

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


## License

PIP.WebUI is under [MIT licensed](LICENSE).

