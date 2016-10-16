# <img src="https://github.com/pip-webui/pip-webui/raw/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> Deployment bindle

![](https://img.shields.io/badge/license-MIT-blue.svg)

This module provides a convenient package that bundles Pip.WebUI modules into few deployment artifacts 
to minimize number of dependencies and simplify development and deployment tasks. 

* **pip-webui-lib (.js, .min.js, .css, min.css)**: 3rd party production libraries from **pip-webui-lib** module
* **pip-webui-lib-test (.js, .min.js)**: 3rd party test libraries from **pip-webui-lib** module
* **pip-webui (.js, .min.js, .css, min.css)**: All modules included into Pip.WebUI framework exception **pip-webui-test** that comes separate
* **pip-webui-test (.js, .min.js)**: Optional testing primitives from **pip-webui-test** module

Each artifact is represented by Javascript, CSS and Map files in regular and minified versions.

## Usage

Add dependency to **pip-webui-all** module in your **bower.json** or **package.json** file depending what you use.
```javascript
"dependencies": {
  ...
  "pip-webui-all": "*"
  ...
}
```

Alternatively you can install the module manually using bower:
```bash
bower install pip-webui-all
```

or install it using npm:
```bash
npm install pip-webui-all
```

Add references to module artifacts into your web application.
```html
<link rel="stylesheet" href=".../pip-webui-lib.min.css"/>
<link rel="stylesheet" href=".../pip-webui.min.css"/>
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui.min.js"></script>
```

For testing you can reference optional test artifacts:
```html
<script src=".../pip-webui-lib-test.min.js"></script>
<script src=".../pip-webui-test.min.js"></script>
```

To use less mixins from Pip.WebUI library include the following reference into your .less file(s)
```css
@import ".../pip-webui-css.less";
```

## Quick links

- [Developer's guide](https://github.com/pip-webui/pip-webui-all/blob/master/doc/DevelopersGuide.md)
- [Changelog](https://github.com/pip-webui/pip-webui-all/blob/master/CHANGELOG.md)
- [Pip.WebUI project website](http://www.pipwebui.org)
- [Pip.WebUI project wiki](https://github.com/pip-webui/pip-webui/wiki)
- [Pip.WebUI discussion forum](https://groups.google.com/forum/#!forum/pip-webui)
- [Pip.WebUI team blog](https://pip-webui.blogspot.com/)

## <a name="dependencies"></a>Module dependencies

* <a href="https://github.com/pip-webui/pip-webui-lib">pip-webui-lib</a> - represented by **pip-webui-lib** and **pip-webui-lib-test** artifacts
* <a href="https://github.com/pip-webui/pip-webui-css">pip-webui-css</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-csscomponents">pip-webui-csscomponents</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-services">pip-webui-services</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-themes">pip-webui-themes</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-nav">pip-webui-nav</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-layouts">pip-webui-layouts</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-split">pip-webui-split</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-controls">pip-webui-controls</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-dialogs">pip-webui-dialogs</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-dates">pip-webui-dates</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-charts">pip-webui-chart</a> - included into **pip-webui** artifact
* <a href="https://github.com/pip-webui/pip-webui-errors">pip-webui-errors</a> - included into **pip-webui** artifact

## <a name="license"></a>License

This module is released under [MIT license](License) and totally free for commercial and non-commercial use.
