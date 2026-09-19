<?php
/**
 * Template for the enquiry form's mail credentials.
 *
 * This file is only a sample. Copy it to the server as
 *
 *     jupiter-mail-config.php
 *
 * placed ONE LEVEL ABOVE public_html — on Hostinger that is
 * /home/<user>/domains/jupiterengg.co.in/, the folder that contains public_html.
 *
 * Two reasons it lives there rather than in the site folder:
 *   1. Nothing above public_html is reachable over the web, so the password
 *      cannot be fetched by URL even if PHP ever stops running.
 *   2. A deploy that rsyncs into public_html with --delete cannot remove it.
 *
 * Never commit the filled-in version. .gitignore already excludes it.
 *
 * Settings come from Hostinger: hPanel -> Emails -> the mailbox -> Configuration
 * settings. Outgoing is smtp.hostinger.com on port 465 with SSL, and the
 * username is the full address.
 */

return [
    // --- who gets the enquiry ------------------------------------------------
    // Add or remove addresses freely; every one listed receives each enquiry.
    'to' => [
        'admin@jupiterengg.co.in',
        'jupiterengg18@gmail.com',
    ],

    // --- who it is sent as ---------------------------------------------------
    // Must be the mailbox being authenticated with below, or the server will
    // refuse it. The enquirer's own address goes in Reply-To automatically, so
    // replying from the inbox answers them, not this address.
    'from'      => 'admin@jupiterengg.co.in',
    'from_name' => 'Jupiter Website',

    // --- how it is sent ------------------------------------------------------
    'host' => 'smtp.hostinger.com',
    'port' => 465,                          // 465 = SSL. Use 587 for STARTTLS.
    'user' => 'admin@jupiterengg.co.in',    // the full address, not just "admin"
    'pass' => 'PUT-THE-MAILBOX-PASSWORD-HERE',
];
