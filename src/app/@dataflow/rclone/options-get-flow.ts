import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer } from '../extra';
import { NoopAuthFlowSupNode } from './noop-auth-flow';
import { PostFlow } from './post-flow';

export interface IRcloneOptionsDlna {
	ListenAddr: ':7979' | string;
	FriendlyName: '' | string;
	LogTrace: false | boolean;
}
export interface IRcloneOptionsFilter {
	DeleteExcluded: false | boolean;
	FilterRule: null;
	FilterFrom: null;
	ExcludeRule: null;
	ExcludeFrom: null;
	ExcludeFile: '' | string;
	IncludeRule: null;
	IncludeFrom: null;
	FilesFrom: null;
	FilesFromRaw: null;
	MinAge: 9223372036854775807n | number;
	MaxAge: 9223372036854775807n | number;
	MinSize: -1 | number;
	MaxSize: -1 | number;
	IgnoreCase: false | boolean;
}
export interface IRcloneOptionsFtp {
	ListenAddr: 'localhost:2121' | string;
	PublicIP: '' | string;
	PassivePorts: '30000-32000' | string;
	BasicUser: 'anonymous' | string;
	BasicPass: '' | string;
}
export interface IRcloneOptionsHttp {
	ListenAddr: 'localhost:8080' | string;
	BaseURL: '' | string;
	ServerReadTimeout: 3600000000000 | number;
	ServerWriteTimeout: 3600000000000 | number;
	MaxHeaderBytes: 4096 | number;
	SslCert: '' | string;
	SslKey: '' | string;
	ClientCA: '' | string;
	HtPasswd: '' | string;
	Realm: 'rclone' | string;
	BasicUser: '' | string;
	BasicPass: '' | string;
	Template: '' | string;
}
export interface IRcloneOptionsLog {
	File: '' | string;
	Format: 'date,time' | string;
	UseSyslog: false | boolean;
	SyslogFacility: 'DAEMON' | string;
}
export interface IRcloneOptionsMain {
	LogLevel: 7 | number;
	StatsLogLevel: 6 | number;
	UseJSONLog: false | boolean;
	DryRun: false | boolean;
	CheckSum: false | boolean;
	SizeOnly: false | boolean;
	IgnoreTimes: false | boolean;
	IgnoreExisting: false | boolean;
	IgnoreErrors: false | boolean;
	ModifyWindow: 1 | number;
	Checkers: 8 | number;
	Transfers: 4 | number;
	ConnectTimeout: 60000000000 | number;
	Timeout: 300000000000 | number;
	ExpectContinueTimeout: 1000000000 | number;
	Dump: 0 | number;
	InsecureSkipVerify: false | boolean;
	DeleteMode: 3 | number;
	MaxDelete: -1 | number;
	TrackRenames: false | boolean;
	TrackRenamesStrategy: 'hash' | string;
	LowLevelRetries: 10 | number;
	UpdateOlder: false | boolean;
	NoGzip: false | boolean;
	MaxDepth: -1 | number;
	IgnoreSize: false | boolean;
	IgnoreChecksum: false | boolean;
	IgnoreCaseSync: false | boolean;
	NoTraverse: false | boolean;
	NoCheckDest: false | boolean;
	NoUpdateModTime: false | boolean;
	DataRateUnit: 'bytes' | string;
	CompareDest: '' | string;
	CopyDest: '' | string;
	BackupDir: '' | string;
	Suffix: '' | string;
	SuffixKeepExtension: false | boolean;
	UseListR: false | boolean;
	BufferSize: 16777216 | number;
	BwLimit: null;
	TPSLimit: 0 | number;
	TPSLimitBurst: 1 | number;
	BindAddr: '' | string;
	DisableFeatures: null;
	UserAgent: 'rclone/v1.51.0-DEV' | string;
	Immutable: false | boolean;
	AutoConfirm: false | boolean;
	StreamingUploadCutoff: 102400 | number;
	StatsFileNameLength: 45 | number;
	AskPassword: true | boolean;
	PasswordCommand: null;
	UseServerModTime: false | boolean;
	MaxTransfer: -1 | number;
	MaxDuration: 0 | number;
	CutoffMode: 0 | number;
	MaxBacklog: 10000 | number;
	MaxStatsGroups: 1000 | number;
	StatsOneLine: false | boolean;
	StatsOneLineDate: false | boolean;
	StatsOneLineDateFormat: '' | string;
	ErrorOnNoTransfer: false | boolean;
	Progress: false | boolean;
	Cookie: false | boolean;
	UseMmap: false | boolean;
	CaCert: '' | string;
	ClientCert: '' | string;
	ClientKey: '' | string;
	MultiThreadCutoff: 262144000 | number;
	MultiThreadStreams: 4 | number;
	MultiThreadSet: false | boolean;
	OrderBy: '' | string;
	UploadHeaders: null;
	DownloadHeaders: null;
	Headers: null;
}
export interface IRcloneOptionsRcHttpoptions {
	ListenAddr: '0.0.0.0:5572' | string;
	BaseURL: '' | string;
	ServerReadTimeout: 3600000000000 | number;
	ServerWriteTimeout: 3600000000000 | number;
	MaxHeaderBytes: 4096 | number;
	SslCert: '' | string;
	SslKey: '' | string;
	ClientCA: '' | string;
	HtPasswd: '' | string;
	Realm: 'rclone' | string;
	BasicUser: 'admin' | string;
	BasicPass: 'admin' | string;
	Template: '' | string;
}
export interface IRcloneOptionsRc {
	HTTPOptions: IRcloneOptionsRcHttpoptions;
	Enabled: true | boolean;
	Serve: true | boolean;
	Files: '' | string;
	NoAuth: false | boolean;
	WebUI: false | boolean;
	WebGUIUpdate: false | boolean;
	WebGUIForceUpdate: false | boolean;
	WebGUINoOpenBrowser: false | boolean;
	WebGUIFetchURL: 'https://api.github.com/repos/rclone/rclone-webui-react/releases/latest' | string;
	AccessControlAllowOrigin: '*' | string;
	EnableMetrics: false | boolean;
	JobExpireDuration: 60000000000 | number;
	JobExpireInterval: 10000000000 | number;
}
export interface IRcloneOptionsRchttp {
	ListenAddr: '0.0.0.0:5572' | string;
	BaseURL: '' | string;
	ServerReadTimeout: 3600000000000 | number;
	ServerWriteTimeout: 3600000000000 | number;
	MaxHeaderBytes: 4096 | number;
	SslCert: '' | string;
	SslKey: '' | string;
	ClientCA: '' | string;
	HtPasswd: '' | string;
	Realm: 'rclone' | string;
	BasicUser: 'admin' | string;
	BasicPass: 'admin' | string;
	Template: '' | string;
}
export interface IRcloneOptionsSftp {
	ListenAddr: 'localhost:2022' | string;
	HostKeys: null;
	AuthorizedKeys: '~/.ssh/authorized_keys' | string;
	User: '' | string;
	Pass: '' | string;
	NoAuth: false | boolean;
}
export interface IRcloneOptionsVfs {
	NoSeek: false | boolean;
	NoChecksum: false | boolean;
	ReadOnly: false | boolean;
	NoModTime: false | boolean;
	DirCacheTime: 300000000000 | number;
	PollInterval: 60000000000 | number;
	Umask: 18 | number;
	UID: 1000 | number;
	GID: 1000 | number;
	DirPerms: 511 | number;
	FilePerms: 438 | number;
	ChunkSize: 134217728 | number;
	ChunkSizeLimit: -1 | number;
	CacheMode: 0 | number;
	CacheMaxAge: 3600000000000 | number;
	CacheMaxSize: -1 | number;
	CachePollInterval: 60000000000 | number;
	CaseInsensitive: false | boolean;
	WriteWait: 1000000000 | number;
	ReadWait: 5000000 | number;
}
export interface IRcloneOptions {
	dlna: IRcloneOptionsDlna;
	filter: IRcloneOptionsFilter;
	ftp: IRcloneOptionsFtp;
	http: IRcloneOptionsHttp;
	log: IRcloneOptionsLog;
	main: IRcloneOptionsMain;
	rc: IRcloneOptionsRc;
	'rc-http': IRcloneOptionsRchttp;
	sftp: IRcloneOptionsSftp;
	vfs: IRcloneOptionsVfs;
}

export interface OptionsGetFlowOutNode extends FlowOutNode {
	options: IRcloneOptions;
}

export interface OptionsGetFlowSupNode extends OptionsGetFlowOutNode, NoopAuthFlowSupNode {}

export abstract class OptionsGetFlow extends PostFlow<IRcloneServer, OptionsGetFlowOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'options/get';
	protected cacheSupport = false;
	protected params = {};
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<OptionsGetFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ options: rsp }, []];
	}
}

export function NestedGet(obj: object, ...path: (string | number)[]) {
	return path.reduce(
		(pre, cur) => (pre && typeof pre[cur] !== 'undefined' ? pre[cur] : undefined),
		obj
	);
}
