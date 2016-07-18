Our QuickStart goal is to build and run a super-simple application with Pip.WebUI Framework, and establish a development environment for the remaining documentation 
samples that also can be the foundation for real world applications.

###Try it!

Try the [live example]() which loads the sample app in plunker and displays:

##Build this app!

 - [Prerequisite](#prerequisite) Install Node.js


### <a name="prerequisite">Prerequisite: Node.js</a>

Install Node.js® and npm if they are not already on your machine.

<p style="padding: 10px 30px 10px; border-left: 4px solid #8BC34A"> Verify that you are running at least node v4.x.x and npm 3.x.x 
or older by running node -v and npm -v in a terminal/console window. </p> 

###<span style="text-transform: uppercase;">Download the source</span>

Instead of following each step of these instructions, we can [download] the QuickStart source from github and follow its brief instructions.

**Step 1:** Create and configure the project

In this step we:

- [(a) Create the project folder](#step1-a)
- [(b) Add package definition and configuration files](#step1-a)
- [(c) Install packages](#step1-c)

**<a name="step1-a">(a) Create the project folder</a>**
```bash
mkdir pipwebui-quickstart
cd    pipwebui-quickstart
```

Create **package.json**
```
    {
      "name": "pipwebui-quickstart",
      "version": "1.0.0",
      "scripts": {
        "build": "gulp build",
        "lint": "gulp lint",
        "samples": "gulp launch",
        "test": "karma start"
      },
      "dependencies": {
      },
      "devDependencies": {
        "pip-webui-lib": "git+https://github.com/pip-webui/pip-webui-lib.git",
        "pip-webui-css": "git+https://github.com/pip-webui/pip-webui-css.git",
        "pip-webui-core": "git+https://github.com/pip-webui/pip-webui-core.git",
        "pip-webui-rest": "git+https://github.com/pip-webui/pip-webui-rest.git",
        "pip-webui-layouts": "git+https://github.com/pip-webui/pip-webui-layouts.git",
        "pip-webui-controls": "git+https://github.com/pip-webui/pip-webui-controls.git",
        "pip-webui-nav": "git+https://github.com/pip-webui/pip-webui-nav.git",
        "pip-webui-locations": "git+https://github.com/pip-webui/pip-webui-locations.git",
        "pip-webui-documents": "git+https://github.com/pip-webui/pip-webui-documents.git",
        "pip-webui-pictures": "git+https://github.com/pip-webui/pip-webui-pictures.git",
        "pip-webui-composite": "git+https://github.com/pip-webui/pip-webui-composite.git",
        "pip-webui-entry": "git+https://github.com/pip-webui/pip-webui-entry.git",
        "pip-webui-errors": "git+https://github.com/pip-webui/pip-webui-errors.git",
        "pip-webui-settings": "git+https://github.com/pip-webui/pip-webui-settings.git",
        "pip-webui-guidance": "git+https://github.com/pip-webui/pip-webui-guidance.git",
        "pip-webui-help": "git+https://github.com/pip-webui/pip-webui-help.git",
        "pip-webui-support": "git+https://github.com/pip-webui/pip-webui-support.git"
      }
    }
```

**<a name="step1-b">(b) Add package definition and configuration files</a>**

**<a name="step1-c">(c) Install packages</a>**
Before install packages install global _gulp_
```bash
npm install gulp -g && npm install gulp --save-dev
```
and then install dependencies
```bash
npm install
```
After installation you must _node_modules_ folder in project folder.

Create **gulpfile.js** and write:
```text
var gulp = require('gulp');
 
require('pip-webui-tasks').all();
    
gulp.task('build', ['build-dev', 'build-prod']);
gulp.task('rebuild', ['build-dev']);
gulp.task('clean', ['build-clean']);
gulp.task('watch', ['build-watch']);
gulp.task('jshint', ['test-jshint']);
gulp.task('launch', ['samples-launch']);
gulp.task('publish', ['samples-publish']);

gulp.task('default', ['build']);
```

On line 3 
```javascript
require('pip-webui-tasks').all();
```

import all gulp tasks from tasks repository. _build-dev_, _build-clean_,_build-watch_ and etc from **pip-webui-tasks**.
More information about tasks you can find [here](https://github.com/pip-webui/pip-webui-tasks).
Create **build.conf.js** and write:
```
module.exports = {
    module: {
        name: 'pipPictures',
        index: 'pictures'
    },
    build: {
        js: true,
        ts: false,
        html: true,
        css: true,
        lib: true,
        images: true
    },
    samples: {
        port: 8099,
        publish: {
            bucket: 'my_backet',
            accessKeyId: 'XXXXXXXXXXXXXXXXXX',
            secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
            region: 'us-west-1'
        },
    }
};
```

After _build-dev_
```bash
gulp build
```
in your project folder will be **lib** folder with sources of Pip.WebUI components.

Let's create anything. For example simple dialog window.
First of all create **index.html**
```html


```html