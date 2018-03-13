# Tribe Mobilisation Infrastructure


## System Requirements

- Node 9.8
- NPM 5.6.0
- Angular CLI 1.7.2


## Setup

- [Install Node & NPM](https://nodejs.org/en/) 
- [Install Angular CLI](https://github.com/angular/angular-cli/blob/master/README.md#installation)
- [Clone or Download TMI source](https://github.com/scheepers/tmi.git)


### TMI Core

- Install dependencies
```
cd tmi/core
npm install
```
- [Configure core](./core/README.md)
- Run core
```
cd tmi
node core
```


### TMI Apps

- Install dependencies:
```
cd tmi/apps/[app-name]
npm install
```
- Run App:
```
cd tmi/apps/[app-name]
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


### Editor: [Sublime Text 3](https://sublimetext.com)

With packages installed:
- DocBlockr (For JavaDoc)
- Typescript (For syntax highlighting)


### Common Development Issues
- [Angular does not reload the page when I make changes](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers)
```
echo 65536 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
```
