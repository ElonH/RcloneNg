# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
