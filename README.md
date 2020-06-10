# RcloneNg

![GitHub release (latest by date)](https://img.shields.io/github/v/release/elonh/rcloneng)
![GitHub All Releases](https://img.shields.io/github/downloads/elonh/rcloneng/total)

An angular web application for rclone

## Features

- Support multiple rclone server

- Explore remote file system

- Create **asynchronous** jobs of coping/moving objects between remotes

- Download file from remote

- Observe the progress of running jobs (by groups)

- Allow editing of rclone server configuration (power by [monaco editor](https://github.com/microsoft/monaco-editor), supporting lint)

## Screenshots

![Screenshot 1](./assets/screenshot-1.png)

![Screenshot 5](./assets/screenshot-5.png)

![Screenshot 2](./assets/screenshot-2.png)

![Screenshot 6](./assets/screenshot-6.png)

![Screenshot 3](./assets/screenshot-3.png)

![Screenshot 4](./assets/screenshot-4.png)

## Get Started

1. running rclone as server

```bash
rclone rcd --rc-user=<user> --rc-pass=<password> --rc-allow-origin="*"
```

2. getting RcloneNg

```bash
git clone https://github.com/ElonH/RcloneNg.git
cd RcloneNg
npm install
npm run start
```

> NB: if rclone is running in localhost, <https://elonh.github.io/RcloneNg> can be used directly.

3. editing server connection in RcloneNg.

![Get started](./assets/get-started.png)

## License

This project and its dependencies ( except Rxjs, Apache-2.0 ) follows MIT license.
