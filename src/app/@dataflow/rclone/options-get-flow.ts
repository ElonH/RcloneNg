import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';
import { NoopAuthFlowSupNode } from './noop-auth-flow';

// update schema: npm run build:schemas

export interface IRcloneOptionsDlna {
	/**
	 * specify which IP address and port the server should listen on.
	 * eg `1.2.3.4:8000` or `:8080` to listen to all IPs.
	 */
	ListenAddr?: ':7979' | string;
	/**
	 * choose the friendly server name,
	 * which is by default "rclone (hostname)
	 */
	FriendlyName?: '' | string;
	/** enable additional debug logging of all UPNP traffic. */
	LogTrace?: false | boolean;
}
export interface IRcloneOptionsFilter {
	/** Delete files on dest excluded from sync */
	DeleteExcluded?: false | boolean;
	/** Add a file-filtering rule */
	FilterRule?: null | string[];
	/** Read filtering patterns from a file (use - to read from stdin) */
	FilterFrom?: null | string[];
	/** Exclude files matching pattern */
	ExcludeRule?: null | string[];
	/** Read exclude patterns from file (use - to read from stdin) */
	ExcludeFrom?: null | string[];
	/** Exclude directories if filename is present */
	ExcludeFile?: '' | string;
	/** Include files matching pattern */
	IncludeRule?: null | string[];
	/** Read include patterns from file (use - to read from stdin) */
	IncludeFrom?: null | string[];
	/** Read list of source-file names from file (use - to read from stdin) */
	FilesFrom?: null | string[];
	/** Read list of source-file names from file without any processing of lines (use - to read from stdin) */
	FilesFromRaw?: null | string[];
	/**
	 * Only transfer files older than this in s or suffix ms|s|m|h|d|w|M|y
	 */
	MinAge?: number;
	/**
	 * Only transfer files younger than this in s or suffix ms|s|m|h|d|w|M|y
	 */
	MaxAge?: number;
	/** Only transfer files bigger than this in k or suffix b|k|M|G */
	MinSize?: -1 | number;
	/** Only transfer files smaller than this in k or suffix b|k|M|G */
	MaxSize?: -1 | number;
	/** Ignore case in filters (case insensitive) */
	IgnoreCase?: false | boolean;
}
export interface IRcloneOptionsFtp {
	/** IPaddress:Port or :Port to bind server to. */
	ListenAddr?: 'localhost:2121' | string;
	/** Public IP address to advertise for passive connections. */
	PublicIP?: '' | string;
	/** Passive port range to use. */
	PassivePorts?: '30000-32000' | string;
	/**
	 * User name for authentication.
	 * single username for basic auth if not using Htpasswd
	 */
	BasicUser?: 'anonymous' | string;
	/**
	 * Password for BasicUser authentication.
	 * (empty value allow every password)
	 */
	BasicPass?: '' | string;
}
export interface IRcloneOptionsHttp {
	/**
	 * Port to listen on
	 * Use --addr to specify which IP address and port
	 * the server should listen on,
	 * eg --addr 1.2.3.4:8000 or --addr :8080 to listen to all IPs.
	 * By default it only listens on localhost.
	 * You can use port :0 to let the OS choose an available port.
	 *
	 * If you set --addr to listen on a public or LAN accessible IP address
	 * then using Authentication is advised - see the next section for info.
	 */
	ListenAddr?: 'localhost:8080' | string;
	/**
	 * prefix to strip from URLs
	 * --baseurl controls the URL prefix that rclone serves from.
	 * By default rclone will serve from the root.
	 * If you used --baseurl "/rclone" then rclone would serve from a URL
	 * starting with "/rclone/".
	 * This is useful if you wish to proxy rclone serve.
	 * Rclone automatically inserts leading and trailing "/" on --baseurl,
	 * so --baseurl "rclone", --baseurl "/rclone" and --baseurl "/rclone/"
	 * are all treated identically.
	 */
	BaseURL?: '' | string;
	/**
	 * Timeout for server reading data
	 * Note that this is the total time for a transfer.
	 */
	ServerReadTimeout?: 3600000000000 | number;
	/**
	 * Timeout for server writing data
	 * Note that this is the total time for a transfer.
	 */
	ServerWriteTimeout?: 3600000000000 | number;
	/**
	 * Maximum size of request header
	 * --max-header-bytes controls the maximum number of bytes the server will
	 * accept in the HTTP header.
	 */
	MaxHeaderBytes?: 4096 | number;
	/** SSL PEM key (concatenation of certificate and CA certificate) */
	SslCert?: '' | string;
	/** SSL PEM Private key */
	SslKey?: '' | string;
	/** Client certificate authority to verify clients with */
	ClientCA?: '' | string;
	/**
	 * htpasswd file - if not provided no authentication is done
	 * This is in standard apache format and supports MD5, SHA1 and BCrypt for basic
	 * authentication.  Bcrypt is recommended.
	 * To create an htpasswd file:
	 *
	 *    touch htpasswd
	 *    htpasswd -B htpasswd user
	 *    htpasswd -B htpasswd anotherUser
	 *
	 * The password file can be updated while rclone is running.
	 */
	HtPasswd?: '' | string;
	/** realm for authentication */
	Realm?: 'rclone' | string;
	/** single username for basic auth if not using Htpasswd */
	BasicUser?: 'admin' | string;
	/** password for BasicUser */
	BasicPass?: 'admin' | string;
	/**
	 * User specified template
	 * --template allows a user to specify a custom markup template for http
	 * and webdav serve functions.  The server exports the following markup
	 * to be used within the template to server pages:
	 *
	 * | Parameter   | Description |
	 * | :---------- | :---------- |
	 * | .Name       | The full path of a file/directory. |
	 * | .Title      | Directory listing of .Name |
	 * | .Sort       | The current sort used.  This is changeable via ?sort= parameter |
	 * |             | Sort Options: namedirfist,name,size,time (default namedirfirst) |
	 * | .Order      | The current ordering used.  This is changeable via ?order= parameter |
	 * |             | Order Options: asc,desc (default asc) |
	 * | .Query      | Currently unused. |
	 * | .Breadcrumb | Allows for creating a relative navigation |
	 * |-- .Link     | The relative to the root link of the Text. |
	 * |-- .Text     | The Name of the directory. |
	 * | .Entries    | Information about a specific file/directory. |
	 * |-- .URL      | The 'url' of an entry.  |
	 * |-- .Leaf     | Currently same as 'URL' but intended to be 'just' the name. |
	 * |-- .IsDir    | Boolean for if an entry is a directory or not. |
	 * |-- .Size     | Size in Bytes of the entry. |
	 * |-- .ModTime  | The UTC timestamp of an entry. |
	 */
	Template?: '' | string;
}
export interface IRcloneOptionsLog {
	/** Log everything to this file */
	File?: '' | string;
	/** Comma separated list of log format options */
	Format?: 'date,time' | string;
	/** Use Syslog for logging */
	UseSyslog?: false | boolean;
	/** Facility for syslog, eg KERN,USER,... */
	SyslogFacility?: 'DAEMON' | string;
}
export interface IRcloneOptionsMain {
	/**
	 * Log level DEBUG|INFO|NOTICE|ERROR
	 *
	 *  Log levels.  These are the syslog levels of which we only use a
	 *  subset.
	 *
	 *  0   LOG_EMERG      system is unusable
	 *  1   LOG_ALERT      action must be taken immediately
	 *  2   LOG_CRIT       critical conditions
	 *  3   LOG_ERR        error conditions
	 *  4   LOG_WARNING    warning conditions
	 *  5   LOG_NOTICE     normal, but significant, condition
	 *  6   LOG_INFO       informational message
	 *  7   LOG_DEBUG      debug-level message
	 */
	LogLevel?: 7 | number;
	/**
	 * Log level to show --stats output DEBUG|INFO|NOTICE|ERROR
	 *
	 *  Log levels.  These are the syslog levels of which we only use a
	 *  subset.
	 *
	 *  0   LOG_EMERG      system is unusable
	 *  1   LOG_ALERT      action must be taken immediately
	 *  2   LOG_CRIT       critical conditions
	 *  3   LOG_ERR        error conditions
	 *  4   LOG_WARNING    warning conditions
	 *  5   LOG_NOTICE     normal, but significant, condition
	 *  6   LOG_INFO       informational message
	 *  7   LOG_DEBUG      debug-level message
	 */
	StatsLogLevel?: 6 | number;
	/** Use json log format. */
	UseJSONLog?: false | boolean;
	/** Do a trial run with no permanent changes */
	DryRun?: false | boolean;
	/** Skip based on checksum (if available) & size, not mod-time & size */
	CheckSum?: false | boolean;
	/** Skip based on size only, not mod-time or checksum */
	SizeOnly?: false | boolean;
	/** Don't skip files that match size and time - transfer all files */
	IgnoreTimes?: false | boolean;
	/** Skip all files that exist on destination */
	IgnoreExisting?: false | boolean;
	/** delete even if there are I/O errors */
	IgnoreErrors?: false | boolean;
	/** Max time diff to be considered the same */
	ModifyWindow?: 1 | number;
	/** Number of checkers to run in parallel. */
	Checkers?: 8 | number;
	/** Number of file transfers to run in parallel. */
	Transfers?: 4 | number;
	/** Connect timeout */
	ConnectTimeout?: 60000000000 | number;
	/** IO idle timeout */
	Timeout?: 300000000000 | number;
	/** Timeout when using expect / 100-continue in HTTP */
	ExpectContinueTimeout?: 1000000000 | number;
	/** List of items to dump from: headers,bodies,requests,responses,auth,filters,goroutines,openfiles */
	Dump?: 0 | number;
	/** Do not verify the server SSL certificate. Insecure. */
	InsecureSkipVerify?: false | boolean;
	/**
	 * the possible delete modes in the config
	 * DeleteModeOff DeleteMode = iota
	 * 0    DeleteModeBefore
	 * 1    DeleteModeDuring
	 * 2    DeleteModeAfter
	 * 3    DeleteModeOnly
	 */
	DeleteMode?: 3 | number;
	/** When synchronizing, limit the number of deletes */
	MaxDelete?: -1 | number;
	/** When synchronizing, track file renames and do a server side move if possible  */
	TrackRenames?: false | boolean;
	/** Strategies to use when synchronizing using track-renames hash|modtime */
	TrackRenamesStrategy?: 'hash' | 'modtime';
	/** Number of low level retries to do. */
	LowLevelRetries?: 10 | number;
	/** Skip files that are newer on the destination. */
	UpdateOlder?: false | boolean;
	/** Don't set Accept-Encoding: gzip. */
	NoGzip?: false | boolean;
	/** If set limits the recursion depth to this. */
	MaxDepth?: -1 | number;
	/** Ignore size when skipping use mod-time or checksum */
	IgnoreSize?: false | boolean;
	/** Skip post copy check of checksums. */
	IgnoreChecksum?: false | boolean;
	/** Ignore case when synchronizing */
	IgnoreCaseSync?: false | boolean;
	/** Don't traverse destination file system on copy. */
	NoTraverse?: false | boolean;
	/** Don't check the destination, copy regardless. */
	NoCheckDest?: false | boolean;
	/** Don't update destination mod-time if files identical. */
	NoUpdateModTime?: false | boolean;
	DataRateUnit?: 'bytes' | string;
	/** Include additional server-side path during comparison. */
	CompareDest?: '' | string;
	/** Implies --compare-dest but also copies files from path into destination. */
	CopyDest?: '' | string;
	/** Make backups into hierarchy based in DIR. */
	BackupDir?: '' | string;
	/** Suffix to add to changed files. */
	Suffix?: '' | string;
	/** Preserve the extension when using --suffix. */
	SuffixKeepExtension?: false | boolean;
	/** Use recursive list if available. Uses more memory but fewer transactions. */
	UseListR?: false | boolean;
	/** In memory buffer size when reading files for each --transfer. */
	BufferSize?: 16777216 | number;
	/**  */
	BwLimit?: null | boolean | string | number;
	/** Bandwidth limit in kBytes/s, or use suffix b|k|M|G or a full timetable. */
	TPSLimit?: 0 | number;
	/** Max burst of transactions for --tpslimit. */
	TPSLimitBurst?: 1 | number;
	/** Local address to bind to for outgoing connections, IPv4, IPv6 or name. */
	BindAddr?: '' | string;
	/** Disable a comma separated list of features.  Use help to see a list. */
	DisableFeatures?: null | boolean | string | number;
	/** Set the user-agent to a specified string. The default is rclone/ version */
	UserAgent?: 'rclone/v1.51.0-DEV' | string;
	/** Do not modify files. Fail if existing files have been modified. */
	Immutable?: false | boolean;
	/** If enabled, do not request console confirmation. */
	AutoConfirm?: false | boolean;
	/**
	 * Cutoff for switching to chunked upload if file size is unknown.
	 * Upload starts after reaching cutoff or when file ends.
	 */
	StreamingUploadCutoff?: 102400 | number;
	/** Max file name length in stats. 0 for no limit */
	StatsFileNameLength?: 45 | number;
	/** Allow prompt for password for encrypted configuration. */
	AskPassword?: true | boolean;
	/** Command for supplying password for encrypted configuration. */
	PasswordCommand?: null | boolean | string | number;
	/** Use server modified time instead of object metadata */
	UseServerModTime?: false | boolean;
	/** Maximum size of data to transfer. */
	MaxTransfer?: -1 | number;
	/** Maximum duration rclone will transfer data for. */
	MaxDuration?: 0 | number;
	/**
	 * Mode to stop transfers when reaching the max transfer limit HARD|SOFT|CAUTIOUS
	 * 0    Hard
	 * 1    Soft
	 * 2    Cautious
	 */
	CutoffMode?: 0 | number;
	/** Maximum number of objects in sync or check backlog. */
	MaxBacklog?: 10000 | number;
	/** Maximum number of stats groups to keep in memory. On max oldest is discarded. */
	MaxStatsGroups?: 1000 | number;
	/** Make the stats fit on one line. */
	StatsOneLine?: false | boolean;
	/**
	 * If we want a date prefix at all
	 * Enables --stats-one-line and add current date/time prefix.
	 */
	StatsOneLineDate?: false | boolean;
	/**
	 * If we want to customize the prefix
	 * Enables --stats-one-line-date and uses custom formatted date.
	 * Enclose date string in double quotes (\").
	 * See https://golang.org/pkg/time/#Time.Format
	 */
	StatsOneLineDateFormat?: '' | string;
	/**
	 * Set appropriate exit code if no files transferred
	 * Sets exit code 9 if no files are transferred, useful in scripts
	 */
	ErrorOnNoTransfer?: false | boolean;
	/** Show progress during transfer. */
	Progress?: false | boolean;
	/** Enable session cookiejar. */
	Cookie?: false | boolean;
	/** Use mmap allocator (see docs). */
	UseMmap?: false | boolean;
	/**
	 * Client Side CA
	 * CA certificate used to verify servers
	 */
	CaCert?: '' | string;
	/**
	 * Client Side Cert
	 * Client SSL certificate (PEM) for mutual TLS auth
	 */
	ClientCert?: '' | string;
	/**
	 * Client Side Key
	 * Client SSL private key (PEM) for mutual TLS auth
	 */
	ClientKey?: '' | string;
	/** Use multi-thread downloads for files above this size. */
	MultiThreadCutoff?: 262144000 | number;
	/** Max number of streams to use for multi-thread downloads. */
	MultiThreadStreams?: 4 | number;
	/**
	 * whether MultiThreadStreams was set (set in fs/config/configflags)
	 */
	MultiThreadSet?: false | boolean;
	/**
	 * Instructions on how to order the transfers, eg 'size,descending'
	 */
	OrderBy?: '' | string;
	/** Set HTTP header for upload transactions */
	UploadHeaders?: null | string[];
	/** Set HTTP header for download transactions */
	DownloadHeaders?: null | string[];
	/** Set HTTP header for all transactions */
	Headers?: null | string[];
}
export interface IRcloneOptionsRc {
	/** equal to rc-http */
	HTTPOptions?: IRcloneOptionsHttp;
	/** Enable the remote control server. */
	Enabled?: true | boolean;
	/** Enable the serving of remote objects. */
	Serve?: true | boolean;
	/** Path to local files to serve on the HTTP server. */
	Files?: '' | string;
	/** Don't require auth for certain methods. */
	NoAuth?: false | boolean;
	/** Launch WebGUI on localhost */
	WebUI?: false | boolean;
	/** Check and update to latest version of web gui */
	WebGUIUpdate?: false | boolean;
	/** Force update to latest version of web gui */
	WebGUIForceUpdate?: false | boolean;
	/** Don't open the browser automatically */
	WebGUINoOpenBrowser?: false | boolean;
	/** URL to fetch the releases for webgui. */
	WebGUIFetchURL?:
		| 'https://api.github.com/repos/rclone/rclone-webui-react/releases/latest'
		| string;
	/** Set the allowed origin for CORS. */
	AccessControlAllowOrigin?: '*' | string;
	/** Enable prometheus metrics on /metrics */
	EnableMetrics?: false | boolean;
	/** expire finished async jobs older than this value */
	JobExpireDuration?: 60000000000 | number;
	/** interval to check for expired async jobs */
	JobExpireInterval?: 10000000000 | number;
}
export interface IRcloneOptionsSftp {
	/**
	 * Port to listen on
	 * IPaddress:Port or :Port to bind server to.
	 */
	ListenAddr?: 'localhost:2022' | string;
	/**
	 * Paths to private host keys
	 * SSH private host key file (Can be multi-valued, leave blank to auto generate)
	 */
	HostKeys?: null | string[];
	/**
	 * Path to authorized keys file
	 */
	AuthorizedKeys?: '~/.ssh/authorized_keys' | string;
	/**
	 * single username
	 * User name for authentication.
	 */
	User?: '' | string;
	/**
	 * password for user
	 * Password for authentication.
	 */
	Pass?: '' | string;
	/** Allow connections with no authentication if set. */
	NoAuth?: false | boolean;
}
export interface IRcloneOptionsVfs {
	/**
	 * don't allow seeking if set
	 * Don't allow seeking in files.
	 */
	NoSeek?: false | boolean;
	/**
	 * don't check checksums if set
	 * Don't compare checksums on up/download.
	 */
	NoChecksum?: false | boolean;
	/**
	 * if set VFS is read only
	 * Mount read-only.
	 */
	ReadOnly?: false | boolean;
	/**
	 * Don't read/write the modification time (can speed things up).
	 */
	NoModTime?: false | boolean;
	/**
	 * how long to consider directory listing cache valid
	 * Time to cache directory entries for.
	 */
	DirCacheTime?: 300000000000 | number;
	/**
	 * Time to wait between polling for changes.
	 * Must be smaller than dir-cache-time.
	 * Only on supported remotes.
	 * Set to 0 to disable.
	 */
	PollInterval?: 60000000000 | number;
	/**  */
	Umask?: 18 | number;
	/**  */
	UID?: 1000 | number;
	/**  */
	GID?: 1000 | number;
	/**
	 * Directory permissions
	 */
	DirPerms?: 511 | number;
	/**
	 * File permissions
	 */
	FilePerms?: 438 | number;
	/**
	 * if > 0 read files in chunks
	 * Read the source objects in chunks.
	 */
	ChunkSize?: 134217728 | number;
	/**
	 * if > ChunkSize double the chunk size after each chunk until reached
	 * If greater than --vfs-read-chunk-size,
	 * double the chunk size after each chunk read,
	 * until the limit is reached.
	 * 'off' is unlimited.
	 */
	ChunkSizeLimit?: -1 | number;
	/**
	 * Cache mode off|minimal|writes|full
	 * 0       "off"  cache nothing - return errors for writes which can't be satisfied
	 * 1   "minimal"  cache only the minimum, eg read/write opens
	 * 2     "writes" cache all files opened with write intent
	 * 3       "full" cache all files opened in any mode
	 */
	CacheMode?: 0 | number;
	/**
	 * Max age of objects in the cache.
	 */
	CacheMaxAge?: 3600000000000 | number;
	/**
	 * Max total size of objects in the cache.
	 */
	CacheMaxSize?: -1 | number;
	/**
	 * Interval to poll the cache for stale objects.
	 */
	CachePollInterval?: 60000000000 | number;
	/**
	 * If a file name not found, find a case insensitive match.
	 */
	CaseInsensitive?: false | boolean;
	/**
	 * Time to wait for in-sequence write before giving error.
	 */
	WriteWait?: 1000000000 | number;
	/**
	 * Time to wait for in-sequence read before seeking.
	 */
	ReadWait?: 5000000 | number;
}
export interface IRcloneOptions {
	/** DLNA serving options. */
	dlna?: IRcloneOptionsDlna;
	/** configures the filter */
	filter?: IRcloneOptionsFilter;
	/**
	 * options for the ftp Server
	 */
	ftp?: IRcloneOptionsFtp;
	/**
	 * options for the http Server
	 */
	http?: IRcloneOptionsHttp;
	/**
	 * options for the logger
	 */
	log?: IRcloneOptionsLog;
	/** filesystem config options */
	main?: IRcloneOptionsMain;
	/**
	 * options for the remote control server
	 */
	rc?: IRcloneOptionsRc;
	/** same as rc.HTTPOptions */
	'rc-http'?: IRcloneOptionsHttp;
	/** options for the Sftp Server */
	sftp?: IRcloneOptionsSftp;
	/** options for creating the vfs */
	vfs?: IRcloneOptionsVfs;
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
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<OptionsGetFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ options: rsp }, []];
	}
}

/**
 * access deeply nested properties without assertion
 */
export function NestedGet(obj: unknown, ...path: (string | number)[]) {
	return path.reduce(
		(pre, cur) => (pre && typeof pre[cur] !== 'undefined' ? pre[cur] : undefined),
		obj
	);
}
