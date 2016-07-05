# <img src="https://github.com/pip-webui/pip-webui/blob/master/assets/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> UI Framework for Line-of-Business Applications 

Development of complex Line-of-Business (Enteprise) applications is a serious undertaking that requires effort of large groups 
of designers, developers and testers. Typical product line may consist of multiple applications, each with many pages 
and dialogs. Enterprise users pay high price for their systems and demand quality of free consumer apps they see on their devices.
But at that scale it takes a lot of time and money. Software companies are looking for efficient ways to build
their LOB applications, keep them up to date with modern technologies while saving money on development. 

One way to save money is to build portable responsive applications that can work on all devices, form-factors and 
operating systems. The most common way to achieve that is to use HTML5 technology that is supported on virtually
any platform. There are lots of good HTML5 frameworks and libraries. They offer basic mechanisms and simple controls.
However, designers and developers have to go a long way from those basic building blocks to create
large and complex LOB apps.

Pip.WebUI framework offers a set of higher-level controls and mechanisms to simplify development of complex LOB apps.
They were put together to implement consistent and rich [user experience](https://github.com/pip-webui/pip-webui-ux)
following [Google Material](https://material.google.com) design style.

<div style="border: 1px solid #ccc">
  <img src="https://github.com/pip-webui/pip-webui/blob/master/assets/Overview.png" alt="Pip.WebUI Overview" style="display:block;">
</div>

The framework is based on popular [Angular.JS 1](https://angularjs.org) framework 
and [Angular Material](https://material.angularjs.org/latest) library of web controls. On the topic of that
this framework provides a set of modules targeted to LOB application development:

* [pip-webui-lib](https://github.com/pip-webui/pip-webui-lib) - collection of 3rd party libraries other modules depend on
* [pip-webui-css](https://github.com/pip-webui/pip-webui-css) - CSS framework to extend Angular Material styles with animations, 
visual effects and web components 
* [pip-webui-core](https://github.com/pip-webui/pip-webui-core) - Core services, including localization, themes, error handling,
infinite scroll, draggable, selection behaviors, and more
* [pip-webui-rest](https://github.com/pip-webui/pip-webui-rest) - REST API for connected controls
* [pip-webui-layouts](https://github.com/pip-webui/pip-webui-layouts) - application layouts: simple, document, master-detail, 
tiles, split, dialog 
* [pip-webui-controls](https://github.com/pip-webui/pip-webui-controls) - basic controls: color picker, toggle buttons, 
popover, dialogs and more
* [pip-webui-nav](https://github.com/pip-webui/pip-webui-nav) - navigation mechanisms: appbar and sidenav
* [pip-webui-locations](https://github.com/pip-webui/pip-webui-locations) - location view and editing controls
* [pip-webui-documents](https://github.com/pip-webui/pip-webui-documents) - document browsing and upload controls
* [pip-webui-pictures](https://github.com/pip-webui/pip-webui-pictures) - picture view and editing controls, collage, avatars
* [pip-webui-composite](https://github.com/pip-webui/pip-webui-composite) - composite view and editing control for complex mixed content
* [pip-webui-entry](https://github.com/pip-webui/pip-webui-entry) - user signin, signup, password recovery and email verification forms
* [pip-webui-errors](https://github.com/pip-webui/pip-webui-errors) - error handling forms and controls
* [pip-webui-settings](https://github.com/pip-webui/pip-webui-settings) - application settings page
* [pip-webui-guidance](https://github.com/pip-webui/pip-webui-guidance) - user context guidance, inspirational quotes, intro dialogs
* [pip-webui-help](https://github.com/pip-webui/pip-webui-help) - integrated help page
* [pip-webui-support](https://github.com/pip-webui/pip-webui-support) - user support and feedback pages


## Learn more about Pip.WebUI

- [Getting started guide](doc/GettingStarted.md)
- [Official Pip.Services website](http://www.pipwebui.org)
- [UX Concept implemented by Pip.WebUI](https://github.com/pip-webui/pip-webui-ux)
- [Online samples](http://webui.pipdevs.com)
- [Users discussion forum]()
- [Pip.WebUI team blog]()

## License agreement

Pip.WebUI is released under [MIT license](License) and totally free for commercial and non-commercial use.

## Acknowledgements

This project would not be possible without effort contributed by particular individuals.

- **Sergey Seroukhov** - the project founder, architecture, implementation
- **Mark Zontak** - team management, implementation
- **Alex Masliev** - UX concept, interaction and graphical design
- **Anastas Fonotov** - web development
- **Alex Dvoykin** - web development
- **Kate Negrienko** - web development
- **Andrey Podgorniy** - code cleanup, documentation, tutorials 

We also would like to recognize help received from the following companies.

- **Digital Living Software Corp.**
- [**Modular Mining Systems Inc.**](http://www.mmsi.com)
- [**EPAM**](http://www.epam.com)