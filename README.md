# <img src="https://github.com/pip-webui/pip-webui/blob/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> Combined deployment package

This module provides a convenient package that combines Pip.WebUI modules into few deployment artifacts 
to minimize number of dependencies and simplify development and deployment tasks. 

* **pip-webui-lib**: 3rd party production libraries from **pip-webui-lib** module
* **pip-webui-lib-test**: 3rd party test libraries from **pip-webui-lib** module
* **pip-webui**: All modules included into Pip.WebUI framework exception **pip-webui-test** that comes separate
* **pip-webui-test**: Optional testing primitives from **pip-webui-test** module

Each artifact is represented by Javascript, CSS and Map files in regular and minified versions.

## Usage

Add dependency to **pip-webui** module your **bower.json** or **package.json** file depending what you use.
```javascript
...
"dependencies": {
  ...
  "pip-webui": "*"
  ...
}
...
```

Alternatively you can install the module manually using bower:
```bash
bower install pip-webui
```

or install it using npm:
```bash
npm install pip-webui
```

Add references to module artifacts into your web application.
```html
...
<link rel="stylesheet" href=".../pip-webui-lib.min.css"/>
<link rel="stylesheet" href=".../pip-webui.min.css"/>
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui.min.js"></script>
...
```

For testing you can reference optional test artifacts:
```html
...
<script src=".../pip-webui-lib-test.min.js"></script>
<script src=".../pip-webui-test.min.js"></script>
...
```

To use less mixins from Pip.WebUI library include the following reference into your .less file(s)
```css
...
@import ".../pip-webui-css.less";
...
```

## Quick links

- [Developer's guide](doc/DevelopersGuide.md)
- [Changelog](CHANGELOG.md)
- [Pip.WebUI project website](http://www.pipwebui.org)

## <a name="dependencies"></a>Module dependencies

* <a href="https://github.com/pip-webui/pip-webui-lib">pip-webui-lib</a> - included as **pip-webui-lib** and **pip-webui-lib-test*
* <a href="https://github.com/pip-webui/pip-webui-css">pip-webui-test</a> - included as **pip-webui-test**
* <a href="https://github.com/pip-webui/pip-webui-css">pip-webui-css</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-core">pip-webui-core</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-rest">pip-webui-rest</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-nav">pip-webui-nav</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-layouts">pip-webui-layouts</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-controls">pip-webui-controls</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-locations">pip-webui-locations</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-pictures">pip-webui-pictures</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-documents">pip-webui-documents</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-composite">pip-webui-composite</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-errors">pip-webui-errors</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-entry">pip-webui-entry</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-settings">pip-webui-settings</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-guidance">pip-webui-guidance</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-help">pip-webui-help</a> - included into **pip-webui**
* <a href="https://github.com/pip-webui/pip-webui-support">pip-webui-support</a> - included into **pip-webui**

## <a name="license"></a>License

This module is released under [MIT license](License) and totally free for commercial and non-commercial use.
