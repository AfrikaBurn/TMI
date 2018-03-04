# Tribe Mobilisation Infrastructure


## Development Environment Ubuntu


- Install NPM


```
sudo apt install npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

- Install Node

```
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- Install Angular CLI

```
npm install -g @angular/cli
```

- Make sure angular can watch all of the files

```
echo 65536 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
```

## References

[Installing npm](https://github.com/angular/angular-cli/blob/master/README.md)
[Fixing npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions)
[Install node using npm](https://nodejs.org/en/download/package-manager)
[Install Angular CLI](https://github.com/angular/angular-cli/blob/master/README.md#installation)
https://github.com/angular/angular-cli/issues/2389
