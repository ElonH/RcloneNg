# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.5.0](https://github.com/ElonH/RcloneNg/compare/v0.4.0...v0.5.0) (2020-07-28)


### ⚠ BREAKING CHANGES

* eslint as default linter

### Features

* **browser-setting:** add item `rng.speedChart.windowSize` ([339a55f](https://github.com/ElonH/RcloneNg/commit/339a55faaddfdc62b7ddea6695557ae194b0193d))
* **browser-setting:** set some value associated with browser or RcloneNg rather server ([cded9c5](https://github.com/ElonH/RcloneNg/commit/cded9c50deba0758d0927057a80aa9d980439461))
* **layout.service:** provide some information to archive responsive view ([9359bc9](https://github.com/ElonH/RcloneNg/commit/9359bc9d6680cbbb178e5048e1003c7f01d6dc77))
* **mount-manager:** enable to create a new mount point ([9a6ec51](https://github.com/ElonH/RcloneNg/commit/9a6ec51bd1d4bda6f11a0d75ba3ce0bcf9bb7441))
* **mounts-manager:** add animation on refresh button ([0f298f0](https://github.com/ElonH/RcloneNg/commit/0f298f0cc7e5cf84f3b1ad825a8e48986e639c6c))
* **mounts-manager:** add button to unmount all mounts ([d736533](https://github.com/ElonH/RcloneNg/commit/d7365331684d0f8f5bcd4841079ed9177ab8966f))
* **mounts-manager:** show current mount points ([0a0c2e7](https://github.com/ElonH/RcloneNg/commit/0a0c2e76ca264fba17d35a37cdbec99be59f603a))
* **mounts-manager:** unmount selected active mount ([f57d8b7](https://github.com/ElonH/RcloneNg/commit/f57d8b713bb9468287f1062484a5ec7fb8724604))
* add subtitle in preloader ([b457e3f](https://github.com/ElonH/RcloneNg/commit/b457e3fea847474aefd600a8d92b0ba0cba9a65e))


### Bug Fixes

* **browser-setting-flow:** existed data is build on default settings ([e102370](https://github.com/ElonH/RcloneNg/commit/e10237090ab63003099e3b3076d41147f9d9cbb9))
* **css.gg:** fix svg path ([3cd617e](https://github.com/ElonH/RcloneNg/commit/3cd617e1ec19b111baec87abf59b20ec18adacc6))
* **mounts-manager:** fix `isLoading` undefined ([922ebab](https://github.com/ElonH/RcloneNg/commit/922ebab139f3284132f88da981b7dfdc8ad6add6))
* **mounts-manager:** refresh not work around ([1ac7cd2](https://github.com/ElonH/RcloneNg/commit/1ac7cd2778d8d1c7c00562f7ca8bedc506a92922))
* **mounts-manager:** unscribe on destory ([3676b5a](https://github.com/ElonH/RcloneNg/commit/3676b5ad4ed19c483f185490c1d95b5169948a68))


* migrating from tslint to eslint ([a66ec4f](https://github.com/ElonH/RcloneNg/commit/a66ec4fb2a1794ab414a9c8e848bcf92b71f21f7))

## [0.4.0](https://github.com/ElonH/RcloneNg/compare/v0.3.2...v0.4.0) (2020-07-03)


### ⚠ BREAKING CHANGES

* **tasks:** remove tasks viewer
* **list-view:** In Mobile View, double click to open directory, lomg press it to popup detail log.
* **home-mode:** In Mobile View, double click remote item to enter file system,and long press it to popup
detail dialog.

### Features

* **dashboard:** add version card ([a36fcbe](https://github.com/ElonH/RcloneNg/commit/a36fcbe91912a1f35c9c84693b4c96647d72d268))
* **home-mode:** support remote detail on mobile view ([2015e2f](https://github.com/ElonH/RcloneNg/commit/2015e2fea6db9fa7eb2adc3b3b5f755c33a52031))
* **jobs-manager:** clean finished groups ([188fcdf](https://github.com/ElonH/RcloneNg/commit/188fcdf56cc00ab0f9be5520714ea09677c15259))
* **jobs-manager:** enable reset stats ([ec025bd](https://github.com/ElonH/RcloneNg/commit/ec025bd8d4a0322f7bcf3b1bfd7cf1f4303f9e1a))
* **list-view:** support file detail on mobile view ([ce36cf2](https://github.com/ElonH/RcloneNg/commit/ce36cf25cff32627041d2899af7a4dcce303191d))
* **pages:** show response time ([9a02b22](https://github.com/ElonH/RcloneNg/commit/9a02b22ea56d46ce3be11407c5f32b73221c5534))


### Bug Fixes

* **file-manager:** footer over main sidebar in mobile view ([48b855a](https://github.com/ElonH/RcloneNg/commit/48b855a7f434573a45d671dfcc2f5609a151e10a)), closes [#2](https://github.com/ElonH/RcloneNg/issues/2)
* **jobs-manager:** no animation on refresh button in mobile view ([b0d21d7](https://github.com/ElonH/RcloneNg/commit/b0d21d74161a45847b461fe763b23dd701a0e746))
* **list-view:** prevent showing detail when checking item ([a2a4fa2](https://github.com/ElonH/RcloneNg/commit/a2a4fa2c5dbe532cf224bdc030bf579bf3a591bd))
* avoid duration format error on other page ([a1c4f75](https://github.com/ElonH/RcloneNg/commit/a1c4f7521a69c80b30abffe424785a2e1f681215))
* cancel underline in <a> ([6c179fa](https://github.com/ElonH/RcloneNg/commit/6c179fa3e7a7d26042dfbbf28d97e9f4462629e9))
* **tasks:** paste again not work around ([c339dfa](https://github.com/ElonH/RcloneNg/commit/c339dfa07fb7f99a6ccf62ac64f6b5398e9e2185))

### [0.3.2](https://github.com/ElonH/RcloneNg/compare/v0.3.1...v0.3.2) (2020-06-14)


### Features

* **jobs-manager:** add animation on refresh button ([b7cc817](https://github.com/ElonH/RcloneNg/commit/b7cc817b2302b63415deb74617027078f862d05e))


### Bug Fixes

* **list-view:** table index except first page ([b9d7fcf](https://github.com/ElonH/RcloneNg/commit/b9d7fcfb1ce884c5d7625e13c9a89835f68ffab8))

### [0.3.1](https://github.com/ElonH/RcloneNg/compare/v0.3.0...v0.3.1) (2020-06-13)


### Features

* **about:** show changelog ([9d7bea5](https://github.com/ElonH/RcloneNg/commit/9d7bea5f62a04560601ef37c371bcef8f1834182))
* **breadcurmb:** edit mode, double click to edit path. double again, back to normal ([60c57b4](https://github.com/ElonH/RcloneNg/commit/60c57b4368bea4b9cd9be39524e59a32a90014ff))
* **file.detail:** enable download file ([1f578f7](https://github.com/ElonH/RcloneNg/commit/1f578f7d54ca772eec85a5eab744d7e7de91a1ce))
* **file.detail:** show spaces usage in file detail if selected is directory ([ff27df9](https://github.com/ElonH/RcloneNg/commit/ff27df91615c515b56f44fde5a7aa9de0462dd04))
* **list-view:** expend click area of checkbox to improving user experience ([988a219](https://github.com/ElonH/RcloneNg/commit/988a219dbb874e722b7f65bc6b1f8a17be3b58a1))
* **manager:** push a message to toastr before creating directory ([9e1091a](https://github.com/ElonH/RcloneNg/commit/9e1091a1f1a2e84d97416d2213b80b83dd8b43d1))
* **pages:** add star button ([5c23b9b](https://github.com/ElonH/RcloneNg/commit/5c23b9bfe3bfb0e4891f0674450ad8af39281797))
* **server-setting:** adding more description in schema ([4eee2f5](https://github.com/ElonH/RcloneNg/commit/4eee2f55d9ca2ff246114027a4041533d26b4993))
* **server-setting:** provide a powerful schema for server setting ([67223bf](https://github.com/ElonH/RcloneNg/commit/67223bf7e4a26b80893f6a16dc7afcb7216ed5bf))


### Bug Fixes

* check if "rc.Serve" is enabled in server options before downloading file ([6a484ca](https://github.com/ElonH/RcloneNg/commit/6a484ca3a7d2e727a17db5cb20f5ea90cee10576))
* remove debug code ([b5cb23c](https://github.com/ElonH/RcloneNg/commit/b5cb23c9db1dabbcd61217e1cda575f703c6b471))
* **breadcurmb:** set cursor as poniter in breadcurmb item ([f014edc](https://github.com/ElonH/RcloneNg/commit/f014edc11e9b7c31c81f6d23c59f76b3a0f10d16))
* **changelog.md:** copy RcloneNg CHANGELOG.md only ([ef76e1e](https://github.com/ElonH/RcloneNg/commit/ef76e1e5892cd805128101b9cc389d62d454007e))
* **list-view:** disable double click in manipulations column ([0e0d825](https://github.com/ElonH/RcloneNg/commit/0e0d825f57ecd90307d2da02b2441d541bb56042))
* **list-view:** disable double click surrounding area of checkbox ([bf03dd1](https://github.com/ElonH/RcloneNg/commit/bf03dd173ffd1ba00c4b07cd2966956e3f769bac))
* **list-view:** disable select types icon ([2ea540e](https://github.com/ElonH/RcloneNg/commit/2ea540ec15901d103a47a92c1f1742da92e03dd8))
* **manager:** show detail button when right sidebar is expended ([d69179e](https://github.com/ElonH/RcloneNg/commit/d69179e36e2d76fac6e6462a685636b1acf1f377))

## [0.3.0](https://github.com/ElonH/RcloneNg/compare/v0.2.4...v0.3.0) (2020-06-09)


### ⚠ BREAKING CHANGES

* **manager:** Detail sidebar is not support in mobile

### Features

* **breadcurmb:** adapt to mobile view ([8546f49](https://github.com/ElonH/RcloneNg/commit/8546f49695886dfb8d128dcf0a52091695611b8e))
* **manager:** bind remote, path with url params ([0a7b48c](https://github.com/ElonH/RcloneNg/commit/0a7b48cb2ac57ce4021e419b0388f24153ec0456))
* **manager:** enable detail sidebar support ([74501dd](https://github.com/ElonH/RcloneNg/commit/74501dd2390de98e388dd17fa20357ed2504ae14))
* **manager:** show snipper when loading ([078675a](https://github.com/ElonH/RcloneNg/commit/078675a26a43a4aa96c26bf4c88545f6b818d10e))
* **manager:** show task button in bottom bar as default ([aa3fc66](https://github.com/ElonH/RcloneNg/commit/aa3fc660925e419ecaf87f4de5df038323a8eb85))
* **operations-list-extends-flow:** share some common data ([380b46e](https://github.com/ElonH/RcloneNg/commit/380b46e43899566e472355b40b1254272021f065))
* **remote.detail:** show available hashes ([154f1aa](https://github.com/ElonH/RcloneNg/commit/154f1aa7a35416b75e099a9f42fc1ad71f07800e))
* **remote.detail:** show remote features in fs info ([6850ccc](https://github.com/ElonH/RcloneNg/commit/6850ccc9e6585192f74394fd4961d8dcfba34a69))
* **remote.detail:** show remote usages ([091461b](https://github.com/ElonH/RcloneNg/commit/091461b3238e6a5dbc279e7f693259f84b72bed7))
* **server-setting:** allow to edit rclone server configuration ([0898769](https://github.com/ElonH/RcloneNg/commit/0898769f1ac03f92785218bb61809a07b0156f71))


### Bug Fixes

* **breadcurmb:** disable click home in homeMode and root in root of fileMode ([62275dd](https://github.com/ElonH/RcloneNg/commit/62275dd918dc4bc74544d26dffc7f7fdbd6cde26))
* **breadcurmb:** disable wrap text if direatory or file name too long ([2262391](https://github.com/ElonH/RcloneNg/commit/2262391f55dd66bf69ae4c15754a43d86bef2866))
* **breadcurmb:** style change ([349baf2](https://github.com/ElonH/RcloneNg/commit/349baf29f33bd9942309ea49d146191bef2c3cc2))
* **format-duration:** remove 'week' unit ([e7fa3ef](https://github.com/ElonH/RcloneNg/commit/e7fa3ef15a8a4caf66e2cc88eeac5b776150dcde))
* **home-mode:** turn click to double click ([61a8872](https://github.com/ElonH/RcloneNg/commit/61a8872b86f27717babe9c772e80f74b5826649d))
* **operations-fsinfo-flow:** append new hash types ([7a9960c](https://github.com/ElonH/RcloneNg/commit/7a9960cc15dc1e230469033f5640c098f127a847))
* **remote.detail:** public member ([52bb80e](https://github.com/ElonH/RcloneNg/commit/52bb80ee2781d6b78e7555b0ebbbbfb78b91f5ab))
* **server-setting:** fill available region ([618d0e0](https://github.com/ElonH/RcloneNg/commit/618d0e08b6e50c64d82ae6111a05c7f88fc826c4))
* **server-setting:** lint fix ([e8d6adf](https://github.com/ElonH/RcloneNg/commit/e8d6adf6901bdde8589a3e891ffe2abf9b03722d))
* **sidebar:** make all sidebar collapsed at initialization ([ac3681b](https://github.com/ElonH/RcloneNg/commit/ac3681bdcf14761f402367499846d64050585fc1))
* disable select text when double click ([be3d365](https://github.com/ElonH/RcloneNg/commit/be3d3659b5935aa6d84779a3f456a20fc1257e00))
* replace nebular dialog service ([9d91a99](https://github.com/ElonH/RcloneNg/commit/9d91a993c7bdefa6bb7f6c6558fb74a127f1e394))

### [0.2.4](https://github.com/ElonH/RcloneNg/compare/v0.2.3...v0.2.4) (2020-06-04)


### Bug Fixes

* **index.html:** set base href as releative path ([7854fa1](https://github.com/ElonH/RcloneNg/commit/7854fa1469397268a6aa6762b242cc39c00602ab))

### [0.2.3](https://github.com/ElonH/RcloneNg/compare/v0.2.2...v0.2.3) (2020-06-04)


### Features

* add title ([7d9eb98](https://github.com/ElonH/RcloneNg/commit/7d9eb9881ed32a8e043d6085a7eb7bdef5f83965))
* fetch all module in pre-load stage ([8ea21ee](https://github.com/ElonH/RcloneNg/commit/8ea21eed335b19ce7d5d97bbe23237e495df90fe))
* **core-bwlimit-flow:** enable limit speed ([8fedf35](https://github.com/ElonH/RcloneNg/commit/8fedf35f9ef09cdc2bcbfbb6d8501e3d0d52f8e8))
* **core-memstats-flow:** implememt memory card ([fa96913](https://github.com/ElonH/RcloneNg/commit/fa969135d2e2ddf8e6015f451c7084cf95b92081))
* **dashboard:** show velocity of memory ([42d5f4c](https://github.com/ElonH/RcloneNg/commit/42d5f4c5782d5327097b1f4be8cad9f0cac7c715))
* **file-mode:** enable refresh list ([736add0](https://github.com/ElonH/RcloneNg/commit/736add0bc4f2c1a7bc79f7eab69c3d84a0492889))
* **options:** enable fetch/set options of rclone server ([3bd7c45](https://github.com/ElonH/RcloneNg/commit/3bd7c45b50447316f3ad6a760e2d933a79e52e7b))
* **rng-diff:** enable custom suffic string ([b2e6df3](https://github.com/ElonH/RcloneNg/commit/b2e6df39efcc33fc711930f439d233c25d34e920))
* **rng-diff:** new state '-' ([077a7d2](https://github.com/ElonH/RcloneNg/commit/077a7d26559ecc4cbceacea2bfac5ecbf1d81050))


### Bug Fixes

* **cache-flow:** dynamically override cached data ([2a927ee](https://github.com/ElonH/RcloneNg/commit/2a927ee15672813a6a6b322ee66d8aa7fa4b136a))
* **clipboard:** adapt to mobile view ([1d878c9](https://github.com/ElonH/RcloneNg/commit/1d878c9b32f6e173abd98661f3d30f2224061d2a))
* **core-stats-flow:** some properties is option ([a81284b](https://github.com/ElonH/RcloneNg/commit/a81284b7b55370dd2c61f3ee303b1ec2de667113))
* **dashboard:** adapt to mobie view ([760cf32](https://github.com/ElonH/RcloneNg/commit/760cf32af8e3673056ea4c11382f3662328553fc))
* **dashboard:** continuously update memory stats ([f22ea05](https://github.com/ElonH/RcloneNg/commit/f22ea057cf1940bf94439d29248d190b74e56db8))
* **dashboard:** seed chart responsive ([5728689](https://github.com/ElonH/RcloneNg/commit/5728689fa6772eea9ad005a5704c116b1bf06632))
* **format-bytes:** condiction order error ([8af6baf](https://github.com/ElonH/RcloneNg/commit/8af6baf6e039099b8bc90ce2d997b5d618acd6b0))
* **home-mode:** adapt to mobile view ([2377d2e](https://github.com/ElonH/RcloneNg/commit/2377d2ebe06dafaf468580e7925496e9d17dca10))
* **home-mode:** color consistence ([704ab96](https://github.com/ElonH/RcloneNg/commit/704ab96c323952490b36db8fc4a3afe1d2facc6f))
* **jobs:** adapt to mobile view ([b554476](https://github.com/ElonH/RcloneNg/commit/b5544765699ecc66bf6f78d332f0da6ad2453241))
* adapt to mobie view ([74b71f6](https://github.com/ElonH/RcloneNg/commit/74b71f61c967bb697ade5a614dc1b46a5c497bce))
* **jobs:** color consistence ([8383cf6](https://github.com/ElonH/RcloneNg/commit/8383cf6efe609f4fa6075c066d737ece360e668e))
* **key-value-table:** expression has changed after it was checked in transferring ([1583a5a](https://github.com/ElonH/RcloneNg/commit/1583a5a6a24474c8064aa81cd961a76bbf0cceb1))
* **manager:** adapt to mobile view ([dad3bb4](https://github.com/ElonH/RcloneNg/commit/dad3bb417b1d84035c78c68dd14dde7917f10c9c))
* **manager:** connect delete event ([0cc5d72](https://github.com/ElonH/RcloneNg/commit/0cc5d727133a36d19fba0dfd02f5efc32b80b8c0))
* **rng-diff:** strip decimal ([9a67874](https://github.com/ElonH/RcloneNg/commit/9a678740757cafae6ee98929cb9b588751670010))
* **speed-char:** show tooltip by index ([a53c049](https://github.com/ElonH/RcloneNg/commit/a53c049b5a7881c4727e40eb7c64b83559514842))
* **speed-chart:** more accurate in acceleration ([6308688](https://github.com/ElonH/RcloneNg/commit/6308688caf026bf106a93459d890c8bbce738455))
* **users-config:** fix dataflow logical error ([3ca1458](https://github.com/ElonH/RcloneNg/commit/3ca1458d8097c62b28a7d2f7130ae5e6d8a35385))

### [0.2.2](https://github.com/ElonH/RcloneNg/compare/v0.2.1...v0.2.2) (2020-06-01)


### Features

* **clipboard:** a task storage center ([7a3713f](https://github.com/ElonH/RcloneNg/commit/7a3713f4588f97869d69d62d382d9b1acf0ed358))
* **delete-file-flow:** enable delete file now ([9cefd41](https://github.com/ElonH/RcloneNg/commit/9cefd41c3e565a0714a9a77b7bbe3f68c17aa402))
* **move-file-flow:** enable move file now ([2b2a94d](https://github.com/ElonH/RcloneNg/commit/2b2a94d6b6ed86c3e5a1fdcc67e7a3d2860f570d))
* **operation-purge-flow:** enable delete directory now ([e7e49e5](https://github.com/ElonH/RcloneNg/commit/e7e49e584558ffc901c83da6cb886a1161973260))
* **sync-copy-flow:** enable copy directory now ([2512fc5](https://github.com/ElonH/RcloneNg/commit/2512fc5b5781be44b7584ca1898796992009a417))
* **sync-move-flow:** enable move directory now ([7e7dd78](https://github.com/ElonH/RcloneNg/commit/7e7dd7858c57cfa3e32eb6f114cf1faf40fba52c))
* **task-component:** a task manager ([749d31b](https://github.com/ElonH/RcloneNg/commit/749d31b170bf7427bf7b26ad18ce6bab1e57e076))
* **tasks-pool:** a daemon service for posting tasks to rclone server ([c534ff1](https://github.com/ElonH/RcloneNg/commit/c534ff1b0a6ee3ed37069e9b85176a60704f5e79))


### Bug Fixes

* **format-bytes:** fix format error when 0 < input < 1 ([b408816](https://github.com/ElonH/RcloneNg/commit/b40881681d8a25f1cad6e7fd60db07ba6d782589))
* **format-bytes:** handle bytes variable undefined ([1b227a9](https://github.com/ElonH/RcloneNg/commit/1b227a9d71085e849e56a2c8be2662f93147c712))
* **list-view:** check index not synchronize with table index after sort ([0cb442d](https://github.com/ElonH/RcloneNg/commit/0cb442db8f249d89a1a0875298176125e9d451f0))
* **list-view:** sort work around ([823c4a7](https://github.com/ElonH/RcloneNg/commit/823c4a773e641d9b02390e462c761327e56e0b9c))
* **main-sidebar:** main header over main sidebar ([a4f1495](https://github.com/ElonH/RcloneNg/commit/a4f1495fabd29bd7d15585cf4a179e738e80bd33))
* **manager:** paste only trigger copy and move, not include delete ([180ff3a](https://github.com/ElonH/RcloneNg/commit/180ff3a9b49e3c4c6787a99f896184ee7dec65e4))
* **speed-chart:** format to human readable data ([5c3b532](https://github.com/ElonH/RcloneNg/commit/5c3b5321d9aae57c83b06e919957558d53a09d61))
* **speed-diff:** make value human-readable ([fdecc54](https://github.com/ElonH/RcloneNg/commit/fdecc54e725d838d9cb0aaabcd4fb2c12af46eb1))
* **summary:** make Duration human-readable ([93c1786](https://github.com/ElonH/RcloneNg/commit/93c17863c268725f4c239a66e631c9b065e267c5))
* **summary:** make speed and bytes human-readable ([721dd71](https://github.com/ElonH/RcloneNg/commit/721dd718899343ffb6705504a6f2fa3b0b252f43))
* **summary:** more accurate in speed statistics ([c72d90a](https://github.com/ElonH/RcloneNg/commit/c72d90a15983f455f7929996507b994dde75f6a2))
* cancel distinctUntilChanged before getoutput or getSuperset ([dd64a31](https://github.com/ElonH/RcloneNg/commit/dd64a3182394c86012652836a77345da99a8d94e))
* **tooltip:** scale icon size ([90b0eaa](https://github.com/ElonH/RcloneNg/commit/90b0eaaea34987cad7d08be6f922d50afd7a632e))
* **transferring:** format eta ([e1dc691](https://github.com/ElonH/RcloneNg/commit/e1dc6915ec9bafb80284c18dc94466ca1d6b9562))
* **transferring:** make speed and size human-readable ([43bcaba](https://github.com/ElonH/RcloneNg/commit/43bcaba4b33f958879ace84a740d32f3a5af06a6))
* **transferring:** sort incorrect ([bab48c7](https://github.com/ElonH/RcloneNg/commit/bab48c721d8c774c20e1194eb5910c2d466e2850))

### [0.2.1](https://github.com/ElonH/RcloneNg/compare/v0.2.0...v0.2.1) (2020-05-29)


### Features

* **manager:** create directory ([22b59c9](https://github.com/ElonH/RcloneNg/commit/22b59c9fce541f9e5c76f384647b3a5d405e74c9))


### Bug Fixes

* **superset-flow:** timer workaround in superset flow ([ee1283c](https://github.com/ElonH/RcloneNg/commit/ee1283cd9564c3b70f7c7630214793b0d588c42a))

## [0.2.0](https://github.com/ElonH/RcloneNg/compare/v0.1.0...v0.2.0) (2020-05-29)


### ⚠ BREAKING CHANGES

* most of flow instance is created in service

### Features

* **connection-flow:** privade a pure superset node output port ([3744893](https://github.com/ElonH/RcloneNg/commit/3744893ae83e3b4a52ebaa5be0d3126d88e032ef))
* **connection-service:** add list cmd flow ([83d32bf](https://github.com/ElonH/RcloneNg/commit/83d32bf95c8ac083d89b9f61e0f1fcf1e6db4442))
* **connection-service:** host connection check ([1617e5d](https://github.com/ElonH/RcloneNg/commit/1617e5dc146d7dfef53bee669f9c56f1405dbf86))
* **core-stats-flow:** support group specification ([9a98a11](https://github.com/ElonH/RcloneNg/commit/9a98a1147029100e7d895f6456dcdd814f139e48))
* **job-speed-chart:** basic framework ([5c0dd1f](https://github.com/ElonH/RcloneNg/commit/5c0dd1fb720c0193135131dfe12267b8b8b4c22e))
* **jobs:** basic framework ([6b02399](https://github.com/ElonH/RcloneNg/commit/6b0239914257c31e469f1ca4c72613e79353d88b))
* **jobs:** fetch group infomation and list it ([b6f4cb9](https://github.com/ElonH/RcloneNg/commit/b6f4cb9db697dec3d7e30c49aa8874a8944d6f29))
* **jobs-speed-chart:** connect to stats flow ([e1d4b60](https://github.com/ElonH/RcloneNg/commit/e1d4b6004d78c3bf0f53df0f5742ca9a1104e792))
* **jobs-speed-chart:** show legend ([d21db88](https://github.com/ElonH/RcloneNg/commit/d21db8860fb225d138d5847110bd52e5d0c4817b))
* **list-cmd-flow:** check if server support some command ([8245b32](https://github.com/ElonH/RcloneNg/commit/8245b32e0388445d20471642f152b26552c7891f))
* **list-view:** add checkbox to allow multi-select ([f5ac788](https://github.com/ElonH/RcloneNg/commit/f5ac788e31a743270dd842bb5f3b3edf452a6687))
* **list-view:** add file formats icons and directory icon ([95cc25c](https://github.com/ElonH/RcloneNg/commit/95cc25cad53c42f33c005c24b1bdb8a056f641a3))
* **list-view:** add manipulation idenity ([39c2c87](https://github.com/ElonH/RcloneNg/commit/39c2c875d2e16a9feb3e6b993cfb384b7b7b6ac9))
* **list-view:** make size human-readable ([31c0919](https://github.com/ElonH/RcloneNg/commit/31c09190169fdada409945f7ebac2c70151dec77))
* **list-view:** multi-select items ([c6efb4e](https://github.com/ElonH/RcloneNg/commit/c6efb4ecde328802dc6c6f9199974729932fe6c8))
* **list-view:** recursively open directory ([38f8326](https://github.com/ElonH/RcloneNg/commit/38f83265b722b389b6e2269d674b0f8a95dffdb9))
* **pages:** add logo ([62c7a0e](https://github.com/ElonH/RcloneNg/commit/62c7a0e52c2d2638fa00ef981cbdbc0426e05947))
* **preloader:** a simple loading screen ([a2b9525](https://github.com/ElonH/RcloneNg/commit/a2b95258010e1df7cf05db6d1fdb4289a21a2720))
* **speed-diff:** show acceleration ([e4c04e6](https://github.com/ElonH/RcloneNg/commit/e4c04e652d144b3aa3a5726dc90287771da20642))
* **summary:** connect to stats flow ([23fecaf](https://github.com/ElonH/RcloneNg/commit/23fecaf30e6e38d5977c2c28368190b23e2e5d0c))
* **transferring:** connect to stats flow ([5209203](https://github.com/ElonH/RcloneNg/commit/520920364eb9cb13f37947560dca5c32194fab7f))


### Bug Fixes

* **dashboard-module:** turn lazy-loading back to normal ([aefbb8a](https://github.com/ElonH/RcloneNg/commit/aefbb8a59dc890facbd5d4412299b07ce51c7981))
* **file-mode:** disable forward data without remote ([08ee080](https://github.com/ElonH/RcloneNg/commit/08ee08024f95b5716179e6b0762e890b6570f054))
* **format-bytes:** handle size less than 0 (directory) ([f3280b4](https://github.com/ElonH/RcloneNg/commit/f3280b4dd58a97e7073e999230abd65e04e2fba3))
* **jobs:** disable toggle group sidebar ([f86b0fe](https://github.com/ElonH/RcloneNg/commit/f86b0feba5039e1a9ae7cead86e45deb5fa1e451))
* **list-view:** assign more space for name ([f4d4ad2](https://github.com/ElonH/RcloneNg/commit/f4d4ad28932c73f8517d06244e93f9f360bab338))
* **list-view:** let table back to first page after jump ([5f3e51b](https://github.com/ElonH/RcloneNg/commit/5f3e51b80fe02fdffb16eda0bc87a67275751e0a))
* **list-view:** turn modified time to time ago ([6d2d78e](https://github.com/ElonH/RcloneNg/commit/6d2d78ec216ddbf4664f3fe5831f96489af450ff))
* **speed:** more accurate in speed statistics ([324134d](https://github.com/ElonH/RcloneNg/commit/324134d40b635f046d91b8ba61f94035fcdd4702))
* **superset-flow:** prerequest of superset is alway previous result ([40b0a90](https://github.com/ElonH/RcloneNg/commit/40b0a90cd86b5527f98a3ebc2d9b4607b79f03b4))
* **users-flow:** extract preName from user in default ([38f7482](https://github.com/ElonH/RcloneNg/commit/38f7482e45fd9d6ae4362b356bf86a7f461ffe26))


* move most of flow instance to service ([1bc2a36](https://github.com/ElonH/RcloneNg/commit/1bc2a3621e66f4d5e0a21240e81205581e89a0a5))

## 0.1.0 (2020-05-24)


### ⚠ BREAKING CHANGES

* replace DataFlowNode as CombErr<{}>
* **@dataflow:** replace 'BareFlowInNode' as 'FlowInNode', replace 'BareFlowOutNode' as 'FlowOutNode'
* specify Tout. simplest way is that set it as `BareFlowOutNode`.
* replace BareFlowPreNode as BareFlowInNode
* some of DataFlow need specify 'Tpre'. simplest way is that set it as
`BareFlowPreNode`.
* **generic:** using RcloneAuth instand of Generic

### Features

* **ajax-flow:** fetch data by ajax ([14904e8](https://github.com/ElonH/RcloneNg/commit/14904e83e4c502bd8dedbb4e3ff72d30aba3eca1))
* **bare-flow:** allow to dynamically link dataflow ([7b8680b](https://github.com/ElonH/RcloneNg/commit/7b8680b4e96a12e35592f306fc2fab616eedd90e))
* **bare-flow:** runtime check that deploy function has been called once ([45c4f20](https://github.com/ElonH/RcloneNg/commit/45c4f20d0b83f44ec1e97e5728b8fb9b11d711a6))
* **breadcrumb:** basic framework ([0f7fc22](https://github.com/ElonH/RcloneNg/commit/0f7fc22efe6b67d77bc1b9a472f92601d1a04c9a))
* **core-stats:** basic framework ([7cad448](https://github.com/ElonH/RcloneNg/commit/7cad44815cd122c620205a6df8134f72265dea53))
* **curentusersflow:** provide current user configuration ([57ff2be](https://github.com/ElonH/RcloneNg/commit/57ff2bee37f48cc5d90164f332f13c91a6b6ab2d))
* **dashboard:** a page for watching rclone states ([8874908](https://github.com/ElonH/RcloneNg/commit/88749085965210d5e0e435d656e061e3e6ea3205))
* **dashboard:** implement basic framework ([f370c57](https://github.com/ElonH/RcloneNg/commit/f370c577af7026d36bbc2b835079817a53299dfa))
* **generic:** an abstract and generic dataflow ([16fef91](https://github.com/ElonH/RcloneNg/commit/16fef915102110d8384ef6edc049df4b6e316ebe))
* **generic:** implement of rclone basical auth ([cf914c9](https://github.com/ElonH/RcloneNg/commit/cf914c90165146fce74df79d640633eb8414cb58))
* **homeview:** show remores on manager ([13fd771](https://github.com/ElonH/RcloneNg/commit/13fd77122da9e3f8a215bc4022906e23e220ac4a))
* **init:** sign up RcloneNg project ([5c7502b](https://github.com/ElonH/RcloneNg/commit/5c7502bc0fc69153856fb1002439c78e05383e9a))
* **jobs:** manipulate groups and jobs of rclone server ([737904a](https://github.com/ElonH/RcloneNg/commit/737904aa4e6d0880818980f3ccd7d902d1f932db))
* **listview:** remote file exporer with list view ([733370d](https://github.com/ElonH/RcloneNg/commit/733370d68651841ba46bb47addef5a93fcc27c8c))
* **manager:** explore and manipulate remote storages ([02bd3ed](https://github.com/ElonH/RcloneNg/commit/02bd3edcb4987fe078fc2aa7467c63e8e5687736))
* **nav service:** parse remote and path from url ([1f4bda1](https://github.com/ElonH/RcloneNg/commit/1f4bda1e9016a257b1da2125cb4d2ee3044cc098))
* **navigation-flow:** just provide a formater ([29aef47](https://github.com/ElonH/RcloneNg/commit/29aef47a5400b102a61b12ccd0634253f469cf89))
* **noop-auth:** implement command: rc/noopauth ([77fb72b](https://github.com/ElonH/RcloneNg/commit/77fb72b902c0d71499f03077c5a3aeac902b0f29))
* **nothing-flow:** do nothing ([d5f6426](https://github.com/ElonH/RcloneNg/commit/d5f64267fb00b793247146898d318ce9e650e7da))
* **operations-list-flow:** list the given remote and path ([6bf2bcf](https://github.com/ElonH/RcloneNg/commit/6bf2bcf404222e28fd54fc06eecee9bcc7db5dba))
* **pages:** add inbox ([4eb0aa1](https://github.com/ElonH/RcloneNg/commit/4eb0aa126c8875c1840ea0233c31171daa94343c))
* **pages:** adding menu 'Server Setting' and 'Apperence Setting' ([4652c74](https://github.com/ElonH/RcloneNg/commit/4652c748685854c5424a5c19ead80b494ce8d2cf))
* **pages:** basic framework of RcloneNg powered by nebular ([0e859f8](https://github.com/ElonH/RcloneNg/commit/0e859f8c70cba71870dc7bfb6b82715bed2cb254))
* **post-flow:** enable specify params type ([691a7cf](https://github.com/ElonH/RcloneNg/commit/691a7cf642ee8e04237c3f6faf65262530e5b8a4))
* **post-flow:** more robust in member 'params' ([0598d79](https://github.com/ElonH/RcloneNg/commit/0598d79e3d92d205988f2dfb9dccc9f974cee071))
* **speed-charts:** a simple speed chart ([7174123](https://github.com/ElonH/RcloneNg/commit/7174123d378a14a626085c1e19fa3cca5d75ad48))
* **user:** add previous button ([cb0eab6](https://github.com/ElonH/RcloneNg/commit/cb0eab624fae81560decbbd571cc352bea3956c4))
* **user:** back to step 0 after saved or confirm ([765d74d](https://github.com/ElonH/RcloneNg/commit/765d74da7a52899df56389e47e0d7954a281e82a))
* **user:** create a page for adding/editing/removing rclone server ([2dafa56](https://github.com/ElonH/RcloneNg/commit/2dafa568af92eae3feebad16540ac7e5fcc215be))
* **user:** delete user in local storage ([21c3834](https://github.com/ElonH/RcloneNg/commit/21c3834d27092232e495199a5c0f9850dfc776c0))
* **user:** edit exist user ([44b5cf6](https://github.com/ElonH/RcloneNg/commit/44b5cf611bc546c9859c5b52069b9e8d4b1571df))
* **user:** save edited user to local storage ([691513d](https://github.com/ElonH/RcloneNg/commit/691513daf128831854bf3c8fd0e7887205627a37))
* **user-config:** implement connect button ([6243f1e](https://github.com/ElonH/RcloneNg/commit/6243f1e481166af78c2ac1adb8eec26835a78870))
* **user-config:** validate url ([9e19149](https://github.com/ElonH/RcloneNg/commit/9e191491a609535ef4df98a7b6e2d4f250fcc76e))
* **user/config:** allow edit exist user ([04343f3](https://github.com/ElonH/RcloneNg/commit/04343f39e063cd397d13cfb6587b42e4dffae4d9))
* **user/config:** implement save button ([9a810b4](https://github.com/ElonH/RcloneNg/commit/9a810b4d0937a2f7ab3c1a86169a7ef4116a73b9))
* setup connect between homeMode and fileMode ([639725d](https://github.com/ElonH/RcloneNg/commit/639725d48acbf0bf74b73d3a0fb64d066083cc16))
* show users on menu, click to switch ([b4c74d4](https://github.com/ElonH/RcloneNg/commit/b4c74d463b6912ca8a447ce9a9762ce43f19d7ba))
* static type check about getOutput ([f0b8bc7](https://github.com/ElonH/RcloneNg/commit/f0b8bc72e93ae6a77ed3bc0e3f21c901567c2572))
* static type check about getSupersetOutput ([217700a](https://github.com/ElonH/RcloneNg/commit/217700a1c8b670b8e1afe5776508248372c293de))
* static type check about prerequest ([6c1cc80](https://github.com/ElonH/RcloneNg/commit/6c1cc80e61a9b0f482eda721a0a6fecbac920358))
* **user/config:** name validation ([fa777f3](https://github.com/ElonH/RcloneNg/commit/fa777f3060ede26c24911811b4d1af4d1b68f37d))
* **user/config:** user configuration view ([47efd7d](https://github.com/ElonH/RcloneNg/commit/47efd7d6731503c411d47ad2097de42a020f38ae))


### Bug Fixes

* **@dataflow/rclone:** add index.ts ([7d6d257](https://github.com/ElonH/RcloneNg/commit/7d6d25734eb8107cba788d56c1bed8549d0bd34e))
* **ajax-flow:** export ajax-flow from core ([0c7200b](https://github.com/ElonH/RcloneNg/commit/0c7200b547787fd9c4516de7014d463cde71d03b))
* **bare-flow:** dynamic link flow not work around in 'source' flow ([b412351](https://github.com/ElonH/RcloneNg/commit/b4123516a9ae9022dad7f8796a9637381050ea93))
* **breadcrumb:** show remote name correctly ([ae9b6ec](https://github.com/ElonH/RcloneNg/commit/ae9b6ec363c6b018d9b353d54e8736ea8d5eb586))
* **generic:** emit network error failure ([46fdc7e](https://github.com/ElonH/RcloneNg/commit/46fdc7e9fdbbdad43e137cc732fe28927a3c2867))
* **generic:** request params error ([681fcb4](https://github.com/ElonH/RcloneNg/commit/681fcb4c3a02e139b16d8558848c428f23e6d7c8))
* **generic:** set data as object rather any ([30e8122](https://github.com/ElonH/RcloneNg/commit/30e8122ce544668b3070b0af16e3697481c68ea1))
* **generic:** type fix about class member interalData$ ([355fcb3](https://github.com/ElonH/RcloneNg/commit/355fcb36097737431d9cf57afa7f23a6cae6fddd))
* **icon:** replace as Rclone logo ([e24bd18](https://github.com/ElonH/RcloneNg/commit/e24bd1897c955a1c31cab59c0762d33ca0cd0569))
* **list-view:** isLoading set false whatever error is arised ([1d178c7](https://github.com/ElonH/RcloneNg/commit/1d178c70bd2395a818bbc48b4294f518fd276e9e))
* **nebular:** import nebular style ([e41b9e5](https://github.com/ElonH/RcloneNg/commit/e41b9e5e435d343d01568d6ff94ddc4d330222ba))
* **operations-list-flow:** disable options ([606d8d7](https://github.com/ElonH/RcloneNg/commit/606d8d71f18884704287cd92b10caa011ed51fd4))
* **pages/menu:** merge user operations togather ([dcfbe0d](https://github.com/ElonH/RcloneNg/commit/dcfbe0dd1ba71a73226286872008d7fac317f581))
* **post-flow:** add user's url to cache path ([98a9fc2](https://github.com/ElonH/RcloneNg/commit/98a9fc20650f67da4762889d2144bdc85c88d755))
* **post-flow:** read params incorrectly in requestAjax ([e4e25ed](https://github.com/ElonH/RcloneNg/commit/e4e25ed56e31cdb1b1f1ba21f031b5ea135f6e64))
* **post-flow:** typo fix of Tparams ([10ded57](https://github.com/ElonH/RcloneNg/commit/10ded574a81274fcc2f255d8e41df38b493d8e4e))
* **root:** remove default contents ([28483b5](https://github.com/ElonH/RcloneNg/commit/28483b59c27b0d6357c7c00447c3b16542e959da))
* **superser-flow:** storage boostrapPrerequest ([fdce810](https://github.com/ElonH/RcloneNg/commit/fdce81039e27ef5bbf66b7f67b75942e49bb3658))
* **user:** disable click step navigation ([0884a2a](https://github.com/ElonH/RcloneNg/commit/0884a2a8537a5942a1017b5b2cdffe3d510688ea))
* **user:** link error ([cffd508](https://github.com/ElonH/RcloneNg/commit/cffd5081e05e5f8fcb8cc978ed94ee26f5eb6396))
* **user/config:** fix user$ type ([54b5c94](https://github.com/ElonH/RcloneNg/commit/54b5c947d7155865e7b49dee8826a90311233b66))
* **user/config:** style change for stepper ([4f520fe](https://github.com/ElonH/RcloneNg/commit/4f520fea6d08e53c12630265381a37d4162d9031))
* **user/select:** moving confirm button to right ([39e4716](https://github.com/ElonH/RcloneNg/commit/39e4716a2ed0a9603b1bc5f2c40e19d22276f4b5))
* **users-flow:** find previous logined user when edited logined user ([e77b5ff](https://github.com/ElonH/RcloneNg/commit/e77b5ffe54941eb5c1d1adb919979b83ef62c257))
* automate trigger refresh list ([93031d9](https://github.com/ElonH/RcloneNg/commit/93031d9a6e0d22e994aa5efe9a20bfd6335cdae8))
* using hash in routing ([dd2ef98](https://github.com/ElonH/RcloneNg/commit/dd2ef9812dc3af7e61570266a163c3d6a31db373))


* **@dataflow:** interface rename 'FlowInNode' 'FlowOutNode' ([b552309](https://github.com/ElonH/RcloneNg/commit/b552309964bc682b3d2b40f7b0cd91139a84190b))
* **generic:** rename class member and improve cohesion ([d8bec07](https://github.com/ElonH/RcloneNg/commit/d8bec07d6ca9de187b0ceed1f7e84cc1994df238))
* deprecated DataFlowNode type ([101786d](https://github.com/ElonH/RcloneNg/commit/101786de79b20efd9e85071354f6860b184b93ca))
* rename type name BareFlowPreNode to BareFlowInNode ([c8a3f39](https://github.com/ElonH/RcloneNg/commit/c8a3f39a4f2cb306446ef29f65ab548898d1f383))
