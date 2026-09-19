<?php
declare(strict_types=1);

/**
 * Enquiry endpoint for the order form.
 *
 * Same-origin on purpose: the page posts here with fetch, so the visitor never
 * leaves the site, and the CSP in index.html can stay at `connect-src 'self'`.
 * Vite copies public/ verbatim, so this lands next to index.html in the build.
 *
 * Delivery goes through authenticated SMTP on the site's own mailbox. Hostinger
 * allows PHP mail() but caps it at 100/day and 10/min and sends it
 * unauthenticated, so it misses SPF, DKIM and DMARC and Gmail is entitled to
 * treat it as spam. Signing in as the mailbox that owns the domain fixes that.
 * mail() is kept only as a fallback for when the credentials file is absent.
 *
 * Credentials are NOT in this file and NOT in the repository. Create
 *   ../jupiter-mail-config.php
 * one level above public_html — see contact-config.sample.php in the repo root.
 * A deploy that rsyncs into public_html cannot touch it there.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const CONFIG_FILE = __DIR__ . '/../jupiter-mail-config.php';
const LOG_FILE    = __DIR__ . '/../jupiter-enquiries.log';
const MAX_PER_IP  = 5;      // submissions
const WINDOW_SECS = 600;    // per ten minutes

/** Used when no config file exists yet, so the form still works on day one. */
const FALLBACK_TO = 'admin@jupiterengg.co.in';

function respond(int $code, array $payload): void
{
    http_response_code($code);
    echo json_encode($payload);
    exit;
}

function cut(string $value, int $max): string
{
    return function_exists('mb_substr') ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}

/** Anything that ends up in a mail header must not be able to start a new one. */
function headerSafe(string $value, int $max = 200): string
{
    $value = str_replace(["\r", "\n", "\0"], ' ', $value);
    $collapsed = preg_replace('/\s+/', ' ', $value);
    return cut(trim($collapsed === null ? $value : $collapsed), $max);
}

function clean(string $value, int $max): string
{
    return cut(trim(str_replace("\0", '', $value)), $max);
}

/**
 * Minimal SMTP client. Enough for one small plain-text message per request, and
 * short enough to read in full — which is why there is no library here.
 * Returns '' on success, or a short reason on failure.
 */
function smtpSend(array $cfg, array $recipients, string $rawMessage): string
{
    $host    = (string)$cfg['host'];
    $port    = (int)$cfg['port'];
    $scheme  = $port === 465 ? 'ssl' : 'tcp';
    $timeout = 20;

    $ctx = stream_context_create(['ssl' => ['SNI_enabled' => true]]);
    $fp = @stream_socket_client("$scheme://$host:$port", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        return 'connect failed: ' . $errstr;
    }
    stream_set_timeout($fp, $timeout);

    // Server replies can span lines: "250-FOO" continues, "250 FOO" ends.
    $read = function () use ($fp): string {
        $out = '';
        while (($line = fgets($fp, 1024)) !== false) {
            $out .= $line;
            if (strlen($line) < 4 || $line[3] !== '-') {
                break;
            }
        }
        return $out;
    };
    $cmd = function (string $line) use ($fp, $read): string {
        fwrite($fp, $line . "\r\n");
        return $read();
    };
    $ok = static function (string $reply, string $expect): bool {
        return strncmp($reply, $expect, strlen($expect)) === 0;
    };
    $fail = function (string $why) use ($fp): string {
        @fclose($fp);
        return $why;
    };

    if (!$ok($read(), '220')) {
        return $fail('no greeting');
    }

    $helo = (string)($cfg['helo'] ?? 'localhost');
    if (!$ok($cmd('EHLO ' . $helo), '250')) {
        return $fail('EHLO refused');
    }

    if ($port !== 465) {
        if (!$ok($cmd('STARTTLS'), '220')) {
            return $fail('STARTTLS refused');
        }
        if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            return $fail('TLS handshake failed');
        }
        if (!$ok($cmd('EHLO ' . $helo), '250')) {
            return $fail('EHLO refused after TLS');
        }
    }

    if (!$ok($cmd('AUTH LOGIN'), '334')) {
        return $fail('AUTH LOGIN refused');
    }
    if (!$ok($cmd(base64_encode((string)$cfg['user'])), '334')) {
        return $fail('username rejected');
    }
    if (!$ok($cmd(base64_encode((string)$cfg['pass'])), '235')) {
        return $fail('login rejected - check the mailbox password');
    }

    if (!$ok($cmd('MAIL FROM:<' . $cfg['from'] . '>'), '250')) {
        return $fail('sender rejected');
    }
    foreach ($recipients as $rcpt) {
        if (!$ok($cmd('RCPT TO:<' . $rcpt . '>'), '25')) {
            return $fail('recipient rejected: ' . $rcpt);
        }
    }
    if (!$ok($cmd('DATA'), '354')) {
        return $fail('DATA refused');
    }

    // A line that is just "." ends the message, so any real one gets an extra dot.
    foreach (explode("\n", str_replace("\r\n", "\n", $rawMessage)) as $line) {
        $line = rtrim($line, "\r");
        if (isset($line[0]) && $line[0] === '.') {
            $line = '.' . $line;
        }
        fwrite($fp, $line . "\r\n");
    }
    if (!$ok($cmd('.'), '250')) {
        return $fail('message rejected');
    }

    $cmd('QUIT');
    @fclose($fp);
    return '';
}

// ---------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

$raw  = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

// Honeypot. A real person never sees this field, so anything in it is a bot.
// Answer as though it worked rather than telling the bot it was caught.
if (clean((string)($data['company'] ?? ''), 100) !== '') {
    respond(200, ['ok' => true]);
}

$name     = clean((string)($data['name'] ?? ''), 120);
$email    = clean((string)($data['email'] ?? ''), 180);
$message  = clean((string)($data['message'] ?? ''), 5000);
$material = clean((string)($data['material'] ?? ''), 60);
$type     = clean((string)($data['type'] ?? ''), 60);

if ($name === '' || $email === '' || $message === '') {
    respond(422, ['ok' => false, 'error' => 'Please fill in your name, email and message.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'That email address does not look right.']);
}

// Light per-IP throttle. Not a defence against a determined attacker, just
// enough that one open form cannot be used to fire thousands of mails.
$ip     = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$bucket = sys_get_temp_dir() . '/jupiter-enquiry-' . sha1($ip) . '.txt';
$hits   = [];
if (is_readable($bucket)) {
    $cutoff = time() - WINDOW_SECS;
    foreach (explode(',', (string)file_get_contents($bucket)) as $stamp) {
        $stamp = (int)$stamp;
        if ($stamp > $cutoff) {
            $hits[] = $stamp;
        }
    }
}
if (count($hits) >= MAX_PER_IP) {
    respond(429, ['ok' => false, 'error' => 'Too many enquiries from this connection. Please try again shortly.']);
}
$hits[] = time();
@file_put_contents($bucket, implode(',', $hits), LOCK_EX);

$host = headerSafe((string)($_SERVER['HTTP_HOST'] ?? ''), 100);
$host = (string)preg_replace('/^www\./', '', $host);
// Only ever a bare hostname: it goes into a Message-ID and the HELO.
if ($host === '' || !preg_match('/^[A-Za-z0-9.-]+$/', $host)) {
    $host = 'jupiterengg.co.in';
}

$config = is_readable(CONFIG_FILE) ? require CONFIG_FILE : null;
if (!is_array($config)) {
    $config = [];
}

$recipients = $config['to'] ?? [FALLBACK_TO];
if (!is_array($recipients)) {
    $recipients = [(string)$recipients];
}
$recipients = array_values(array_filter(array_map(
    static function ($r): string {
        $r = headerSafe((string)$r, 180);
        return filter_var($r, FILTER_VALIDATE_EMAIL) ? $r : '';
    },
    $recipients
)));
if (!$recipients) {
    $recipients = [FALLBACK_TO];
}

$subject = headerSafe('Website enquiry - ' . $name, 150);

$body = implode("\r\n", [
    'New enquiry from the website form.',
    '',
    'Name:            ' . $name,
    'Email:           ' . $email,
    'Material:        ' . ($material !== '' ? $material : '-'),
    'Exchanger type:  ' . ($type !== '' ? $type : '-'),
    '',
    'Message:',
    $message,
    '',
    '--',
    'Sent ' . gmdate('Y-m-d H:i:s') . ' UTC from ' . $host,
    'IP: ' . $ip,
]);

// Written above the web root, so a lead survives even if delivery fails or the
// message is filtered on the way to the inbox.
@file_put_contents(
    LOG_FILE,
    gmdate('c') . "\t" . str_replace(["\r\n", "\n"], ' | ', $body) . "\n",
    FILE_APPEND | LOCK_EX
);

// From must be the authenticated mailbox. Reply-To carries the enquirer, so
// replying in the inbox answers them directly.
$from     = headerSafe((string)($config['from'] ?? FALLBACK_TO), 180);
$fromName = headerSafe((string)($config['from_name'] ?? 'Jupiter Website'), 60);

$headerLines = [
    'From: ' . $fromName . ' <' . $from . '>',
    'To: ' . implode(', ', $recipients),
    'Reply-To: ' . headerSafe($name, 80) . ' <' . headerSafe($email, 180) . '>',
    'Subject: ' . $subject,
    'Date: ' . gmdate('r'),
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $host . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: jupiter-site',
];

if (isset($config['host'], $config['user'], $config['pass'])) {
    $config['port'] = (int)($config['port'] ?? 465);
    $config['from'] = $from;
    $config['helo'] = $host;
    $why = smtpSend($config, $recipients, implode("\r\n", $headerLines) . "\r\n\r\n" . $body);
    if ($why !== '') {
        // The reason is logged, never returned: it can name the mailbox.
        @file_put_contents(LOG_FILE, gmdate('c') . "\tSMTP FAILED: " . $why . "\n", FILE_APPEND | LOCK_EX);
        respond(502, ['ok' => false, 'error' => 'The message could not be sent from the server.']);
    }
    respond(200, ['ok' => true]);
}

// No credentials configured yet. mail() is unauthenticated and rate limited on
// this host, so it may be filtered, but it beats refusing the enquiry outright.
$mailHeaders = [];
foreach ($headerLines as $h) {
    if (strncasecmp($h, 'To:', 3) !== 0 && strncasecmp($h, 'Subject:', 8) !== 0) {
        $mailHeaders[] = $h;
    }
}
$sent = @mail(implode(', ', $recipients), $subject, $body, implode("\r\n", $mailHeaders));
if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'The message could not be sent from the server.']);
}
respond(200, ['ok' => true]);
