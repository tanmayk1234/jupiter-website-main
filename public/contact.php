<?php
declare(strict_types=1);

/**
 * Enquiry endpoint for the order form.
 *
 * Same-origin on purpose: the page posts here with fetch, so the visitor never
 * leaves the site, and the CSP in index.html can stay at `connect-src 'self'`.
 * Vite copies public/ verbatim, so this lands next to index.html in the build.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const TO_ADDRESS   = 'jupiterengg18@gmail.com';
const MAX_PER_IP   = 5;      // submissions
const WINDOW_SECS  = 600;    // per ten minutes

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
// Only ever a bare hostname: it goes into a From header.
if ($host === '' || !preg_match('/^[A-Za-z0-9.-]+$/', $host)) {
    $host = 'jupiterengg.co.in';
}

$subject = headerSafe('Website enquiry - ' . ($name !== '' ? $name : 'no name'), 150);

$body = implode("\n", [
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

// From has to be on this domain or Gmail treats it as forged and files it as
// spam. The enquirer's own address goes in Reply-To, so hitting reply in Gmail
// answers them directly.
$headers = [
    'From: Jupiter Website <website@' . $host . '>',
    'Reply-To: ' . headerSafe($name, 80) . ' <' . headerSafe($email, 180) . '>',
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    'X-Mailer: jupiter-site',
];

// Written above the web root, so a lead survives even if mail() is disabled or
// the message is filtered on the way to the inbox.
@file_put_contents(
    __DIR__ . '/../jupiter-enquiries.log',
    gmdate('c') . "\t" . str_replace("\n", ' | ', $body) . "\n",
    FILE_APPEND | LOCK_EX
);

$sent = @mail(TO_ADDRESS, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'The message could not be sent from the server.']);
}

respond(200, ['ok' => true]);
