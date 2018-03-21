# Tribe Mobilisation Infrastructure


## System Requirements

- Node 9.8
- NPM 5.6.0
- Angular CLI 1.7.2


## Setup

- [Install Node & NPM](https://nodejs.org/en/)
- [Install Angular CLI](https://github.com/angular/angular-cli/blob/master/README.md#installation)
- [Clone or Download TMI source](https://github.com/scheepers/tmi.git)


### TMI Backend

- Install dependencies
```
cd tmi/back
npm install
```
- [Configure core](./back/README.md)
- Run core
```
cd tmi
node back
```


### TMI Front end Apps

- Install dependencies:
```
cd tmi/front/[app-name]
npm install
```
- Run App:
```
cd tmi/front/[app-name]
ng serve
```


### Common Install Issues

- [NPM WARN checkPermissions Missing write access](https://docs.npmjs.com/getting-started/fixing-npm-permissions)
-- Linux/OSX
```
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```


## Development


### Suggested reading

- [NodeJS Guides](https://nodejs.org/en/docs/guides)
- [Angular IO getting started](https://angular.io/guide/quickstart)


### Suggested Software

- [Visual Studio Code](https://www.visualstudio.com/) - Editing / Debugging
- [Postman](https://www.getpostman.com/) for API end point testing. Use the core
[API endpoint test configuration](./core/testing/tmi_core.postman_collection.json)
to test against.


### Common Development Issues

- [Angular does not reload the page when I make changes](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers) - Linux/OSX
```
echo 65536 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
```
