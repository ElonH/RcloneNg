# RcloneNg

![GitHub release (latest by date)](https://img.shields.io/github/v/release/elonh/rcloneng)
![GitHub All Releases](https://img.shields.io/github/downloads/elonh/rcloneng/total)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/ElonH/RcloneNg)
[![Dependencies Status](https://david-dm.org/elonh/RcloneNG/status.svg)](https://david-dm.org/elonh/RcloneNG)

An angular web application for rclone

## Features

- Support multiple rclone server

- Explore remote file system

- Create asynchronous jobs of coping/moving objects between remotes

- Download file from remote

- Observe the progress of running jobs (by groups)

- Allow editing of rclone server configuration (power by [monaco editor](https://github.com/microsoft/monaco-editor), supporting lint, document description)

- Manager Rclone mounts

## Screenshots

![Screenshot 1](./assets/screenshot-1.png)

![Screenshot 5](./assets/screenshot-5.png)

![Screenshot 2](./assets/screenshot-2.png)

![Screenshot 6](./assets/screenshot-6.png)

![Screenshot 3](./assets/screenshot-3.png)

![Screenshot 4](./assets/screenshot-4.png)

![Screenshot 7](./assets/screenshot-7.png)

## Get Started

1. running rclone as server

```bash
rclone rcd --rc-user=<user> --rc-pass=<password> --rc-allow-origin="http://localhost:4200"
```

2. getting RcloneNg

   - local way

     ```bash
     git clone https://github.com/ElonH/RcloneNg.git
     cd RcloneNg
     npm install # NodeJs version >= 10
     npm run start
     ```

   - online way

     [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ElonH/RcloneNg)

   - lazy way

     if set `--rc-allow-origin="https://elonh.github.io"`, <https://elonh.github.io/RcloneNg> can be used directly.ç
	 - Docker way
	   ```bash
	   docker run --name rcloneng -d -p 8080:80 elonh/rcloneng
		 ```

3. editing server connection in RcloneNg.

![Get started](./assets/get-started.png)

## License

This project and its dependencies ( except Rxjs, Apache-2.0 ) follows MIT license.
