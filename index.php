<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'security.php';
easysched_start_session();
easysched_send_security_headers();

/**
 * Inline icon set. The content security policy allows no external assets, so
 * icons ship as inline SVG paths reused through this helper.
 */
function easysched_icon(string $name, string $size = '20'): string
{
    static $paths = [
        'menu' => '<path d="M4 7h16M4 12h16M4 17h16"/>',
        'search' => '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
        'sun' => '<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7"/>',
        'moon' => '<path d="M20.5 14.6A8.6 8.6 0 019.4 3.5a8.6 8.6 0 1011.1 11.1z"/>',
        'logout' => '<path d="M9.5 4H6.5A2.5 2.5 0 004 6.5v11A2.5 2.5 0 006.5 20h3"/><path d="M15.5 8.5l3.5 3.5-3.5 3.5"/><path d="M19 12H9"/>',
        'close' => '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
        'refresh' => '<path d="M20 12a8 8 0 11-2.4-5.7"/><path d="M20 3.5V8h-4.5"/>',
        'shield' => '<path d="M12 3l7.5 3v5.6c0 4.4-3 8-7.5 9.4-4.5-1.4-7.5-5-7.5-9.4V6z"/><path d="M9 12.2l2.1 2.1L15.2 10"/>',
        'lock' => '<rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2"/><path d="M8 10.5V7.8a4 4 0 018 0v2.7"/>',
        'info' => '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.4M12 7.9h.01"/>',
        'inbox' => '<path d="M3.5 13.5h4l1.5 2.5h6l1.5-2.5h4"/><path d="M3.5 13.5L6 5.2h12l2.5 8.3v4.3a1.7 1.7 0 01-1.7 1.7H5.2a1.7 1.7 0 01-1.7-1.7z"/>',
        'printer' => '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="1.8"/><path d="M7 16h10v4H7z"/>',
        'download' => '<path d="M12 3.5v10.5"/><path d="M8 10.5l4 4 4-4"/><path d="M4.5 18.5h15"/>',
        'sparkle' => '<path d="M12 3.5l1.9 4.9 4.9 1.9-4.9 1.9L12 17.1l-1.9-4.9L5.2 10.3l4.9-1.9z"/><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    ];

    $body = $paths[$name] ?? '';

    return '<svg viewBox="0 0 24 24" width="' . $size . '" height="' . $size . '" fill="none" stroke="currentColor"'
        . ' stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
        . $body . '</svg>';
}

const EASYSCHED_ASSET_VERSION = '20260914-export-formats';
const EASYSCHED_SCHOOL = 'New Sinai School and Colleges Sta. Rosa, Inc.';
?><!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <meta name="theme-color" content="#faf9f6" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#1a1917" media="(prefers-color-scheme: dark)">
    <meta name="description" content="<?= EASYSCHED_SCHOOL ?> automated class scheduling system">
    <title>EasySched | <?= EASYSCHED_SCHOOL ?></title>
    <link rel="icon" href="assets/school-logo.png">
    <link rel="apple-touch-icon" href="assets/school-logo.png">
    <link rel="stylesheet" href="styles.css?v=<?= EASYSCHED_ASSET_VERSION ?>">
</head>
<body>
    <a class="skip-link" href="#mainContent">Skip to content</a>

    <noscript>
        <p class="noscript-banner">EasySched needs JavaScript enabled to load schedules. Please enable it and reload this page.</p>
    </noscript>

    <section class="login-shell" id="loginView" aria-labelledby="loginTitle">
        <div class="login-panel">
            <div class="brand-lockup">
                <img class="brand-logo" src="assets/school-logo.png" alt="<?= EASYSCHED_SCHOOL ?> seal">
                <div><strong>EasySched</strong><span><?= EASYSCHED_SCHOOL ?></span></div>
            </div>
            <p class="eyebrow">Academic scheduling workspace</p>
            <h1 id="loginTitle">Sign in to manage schedules</h1>
            <p class="muted">Secure server sessions, conflict-aware generation, and a published timetable your faculty can trust.</p>
            <form id="loginForm" novalidate>
                <div class="field">
                    <label for="loginUsername">Username</label>
                    <input id="loginUsername" name="username" autocomplete="username" required maxlength="80" spellcheck="false">
                </div>
                <div class="field">
                    <label for="loginPassword">Password</label>
                    <input id="loginPassword" name="password" type="password" autocomplete="current-password" required maxlength="200">
                </div>
                <div class="field" id="loginCaptchaWrap" hidden>
                    <label for="loginCaptcha">Security check &mdash; solve the question</label>
                    <div class="captcha-image-row">
                        <img id="loginCaptchaImage" width="300" height="92" alt="Arithmetic security question">
                        <button class="captcha-refresh" id="refreshLoginCaptcha" type="button" aria-label="Get another security question" title="Get another question"><?= easysched_icon('refresh') ?></button>
                    </div>
                    <input id="loginCaptcha" name="captcha" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="3" placeholder="Enter the answer">
                </div>
                <p class="form-error" id="loginError" role="alert"></p>
                <button class="button button-primary button-wide" type="submit"><?= easysched_icon('lock', '16') ?>Sign in</button>
            </form>
            <p class="login-divider">or</p>
            <button class="button button-ghost button-wide" id="showRegistrationButton" type="button">New student? Request an account</button>
            <button class="button button-ghost button-wide" id="forgotPasswordButton" type="button">Forgot your password?</button>
            <p class="login-note"><?= easysched_icon('info', '16') ?><span>Student requests are reviewed by an administrator before the account can sign in.</span></p>
        </div>

        <div class="login-panel registration-panel" id="registrationView" hidden>
            <div class="brand-lockup">
                <img class="brand-logo" src="assets/school-logo.png" alt="">
                <div><strong>Student registration</strong><span>Request access to EasySched</span></div>
            </div>
            <p class="eyebrow">Enrollment access request</p>
            <h1>Request a student account</h1>
            <p class="muted">Fill in the details from your enrollment record. An administrator approves the request before your first sign-in.</p>
            <form id="registrationForm" novalidate>
                <div class="form-grid">
                    <div class="field"><label for="registrationFirstName">First name</label><input id="registrationFirstName" required maxlength="80" autocomplete="given-name"></div>
                    <div class="field"><label for="registrationMiddleName">Middle name <span class="muted">(optional)</span></label><input id="registrationMiddleName" maxlength="80" autocomplete="additional-name"></div>
                    <div class="field full"><label for="registrationLastName">Last name</label><input id="registrationLastName" required maxlength="80" autocomplete="family-name"></div>
                    <div class="field"><label for="registrationUsername">Preferred username</label><input id="registrationUsername" required maxlength="80" spellcheck="false" autocomplete="username"></div>
                    <div class="field"><label for="registrationRef">Enrollment reference</label><input id="registrationRef" required maxlength="60" spellcheck="false"></div>
                    <div class="field full">
                        <label for="registrationEmail">Email</label>
                        <div class="field-with-action">
                            <input id="registrationEmail" type="email" maxlength="180" autocomplete="email">
                            <button class="button button-secondary" id="sendRegistrationOtpButton" type="button">Send code</button>
                        </div>
                    </div>
                    <div class="field full"><label for="registrationOtp">Email verification code</label><input id="registrationOtp" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="Send the code first, then enter it here"></div>
                    <div class="field full"><label for="registrationProgram">Program</label><select id="registrationProgram" required><option value="">Loading programs&hellip;</option></select></div>
                    <div class="field"><label for="registrationYear">Year level</label><select id="registrationYear" required><option value="">Select year level</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option><option value="5">5th Year</option><option value="6">6th Year</option></select></div>
                    <div class="field"><label for="registrationSection">Section <span class="muted">(optional)</span></label><select id="registrationSection"><option value="">No section assigned yet</option></select></div>
                    <div class="field full"><label for="registrationPassword">Password</label><input id="registrationPassword" type="password" minlength="10" required autocomplete="new-password"><span class="field-hint">At least 10 characters.</span></div>
                </div>
                <p class="form-error" id="registrationError" role="alert"></p>
                <button class="button button-primary button-wide" type="submit">Submit registration</button>
                <button class="button button-ghost button-wide" id="backToLoginButton" type="button">Back to sign in</button>
            </form>
        </div>

        <div class="login-panel registration-panel" id="forgotPasswordView" hidden>
            <div class="brand-lockup">
                <img class="brand-logo" src="assets/school-logo.png" alt="">
                <div><strong>Password recovery</strong><span>Verify your email to reset access</span></div>
            </div>
            <p class="eyebrow">Account recovery</p>
            <h1>Reset your password</h1>
            <p class="muted">We send a one-time code to the email address on file for the account.</p>
            <form id="forgotPasswordForm" novalidate>
                <div class="field">
                    <label for="resetAccount">Username or email</label>
                    <div class="field-with-action">
                        <input id="resetAccount" required maxlength="180" spellcheck="false">
                        <button class="button button-secondary" id="sendResetOtpButton" type="button">Send code</button>
                    </div>
                </div>
                <div class="field"><label for="resetOtp">Verification code</label><input id="resetOtp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>
                <div class="field"><label for="resetPassword">New password</label><input id="resetPassword" type="password" minlength="10" required autocomplete="new-password"></div>
                <div class="field"><label for="resetPasswordConfirm">Confirm new password</label><input id="resetPasswordConfirm" type="password" minlength="10" required autocomplete="new-password"></div>
                <p class="form-error" id="resetError" role="alert"></p>
                <button class="button button-primary button-wide" type="submit">Reset password</button>
                <button class="button button-ghost button-wide" id="backFromResetButton" type="button">Back to sign in</button>
            </form>
        </div>

        <div class="login-aside" id="loginParallax" aria-label="New Sinai campus">
            <div class="campus-frame" aria-hidden="true"><div class="campus-photo"></div></div>
            <div class="login-aside-content">
                <p class="aside-kicker"><?= EASYSCHED_SCHOOL ?></p>
                <h2>Smarter schedules for a stronger academic community.</h2>
                <p>Conflict-aware scheduling built for the people, classrooms, and learning spaces of New Sinai.</p>
                <div class="aside-points">
                    <div><strong>Conflict-free by design</strong><span>Rooms, faculty, sections, and time slots are validated on the server before anything is published.</span></div>
                    <div><strong>Ready on campus</strong><span>Runs on the campus machine and saves schedules locally.</span></div>
                </div>
            </div>
        </div>
    </section>

    <div class="app-shell" id="appView" hidden>
        <div class="sidebar-backdrop" id="sidebarBackdrop"></div>
        <aside class="sidebar" id="sidebar" aria-label="Primary navigation">
            <div class="brand-lockup">
                <img class="brand-logo" src="assets/school-logo.png" alt="<?= EASYSCHED_SCHOOL ?> seal">
                <div><strong>EasySched</strong><span><?= EASYSCHED_SCHOOL ?></span></div>
            </div>
            <div class="user-card">
                <div class="avatar" id="userAvatar" aria-hidden="true">A</div>
                <div><strong id="userName">User</strong><span id="userRole">Role</span></div>
            </div>
            <p class="nav-label">Workspace</p>
            <ul class="nav-list" id="navList"></ul>
            <div class="sidebar-footer"><span class="status-dot"></span><span>Local SQLite</span></div>
        </aside>

        <main class="main-shell" id="mainContent">
            <header class="topbar">
                <div class="topbar-left">
                    <button class="icon-button menu-button" id="menuButton" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="sidebar"><?= easysched_icon('menu') ?></button>
                    <div><p class="eyebrow" id="pageEyebrow">Overview</p><h1 id="pageTitle">Dashboard</h1></div>
                </div>
                <div class="topbar-actions">
                    <label class="search-field" for="globalSearch">
                        <?= easysched_icon('search', '16') ?>
                        <span class="sr-only">Search this view</span>
                        <input id="globalSearch" type="search" placeholder="Search this view" autocomplete="off">
                        <kbd aria-hidden="true">/</kbd>
                    </label>
                    <button class="icon-button outlined" id="themeToggle" type="button" aria-label="Switch to dark theme" title="Switch theme"><?= easysched_icon('moon', '18') ?></button>
                    <span class="topbar-divider" aria-hidden="true"></span>
                    <button class="button button-ghost" id="logoutButton" type="button"><?= easysched_icon('logout', '15') ?><span class="collapsing-label">Sign out</span></button>
                </div>
            </header>

            <div class="page-container">
                <section class="page" id="page-dashboard" data-page="dashboard" aria-labelledby="dashboardHeading">
                    <div class="page-heading">
                        <div><p class="eyebrow">Command center</p><h2 id="dashboardHeading">Scheduling overview</h2><p class="muted">A live view of the active academic term.</p><span class="active-term-label" id="activeTermLabel"></span></div>
                        <div class="page-heading-actions"><button class="button button-primary manage-only" id="dashboardGenerateButton" type="button"><?= easysched_icon('sparkle', '15') ?>Generate schedule</button></div>
                    </div>
                    <div class="metric-grid" id="metricGrid"></div>
                    <div class="dashboard-grid">
                        <article class="panel panel-large">
                            <div class="panel-heading"><div><p class="eyebrow">Latest publication</p><h3>Schedule health</h3></div><span class="badge" id="scheduleHealthBadge">No schedule</span></div>
                            <div id="dashboardHealth" class="health-list"></div>
                        </article>
                        <article class="panel">
                            <div class="panel-heading"><div><p class="eyebrow">At a glance</p><h3>Generation record</h3></div></div>
                            <div id="runSummary" class="summary-list"></div>
                        </article>
                    </div>
                    <article class="panel">
                        <div class="panel-heading"><div><p class="eyebrow">Next on the calendar</p><h3>Upcoming classes</h3></div><button class="button button-ghost" data-navigate="schedules" type="button">Open schedule</button></div>
                        <div class="table-wrap">
                            <table class="data-table compact">
                                <thead><tr><th>Time</th><th>Subject</th><th>Section</th><th>Room</th><th>Instructor</th></tr></thead>
                                <tbody id="upcomingBody"></tbody>
                            </table>
                        </div>
                    </article>
                </section>

                <section class="page" id="page-schedules" data-page="schedules" aria-labelledby="schedulesHeading" hidden>
                    <div class="print-header" aria-hidden="true">
                        <img src="assets/school-logo.png" alt="">
                        <div><strong><?= EASYSCHED_SCHOOL ?></strong><span id="printMeta">Weekly class schedule</span></div>
                    </div>
                    <div class="page-heading">
                        <div><p class="eyebrow">Published timetable</p><h2 id="schedulesHeading">Weekly schedule</h2><p class="muted">Filter by the audience you need to answer for.</p><span class="active-term-label" id="scheduleTermLabel"></span></div>
                        <div class="page-heading-actions">
                            <button class="button button-ghost" id="printButton" type="button"><?= easysched_icon('printer', '15') ?>Print</button>
                            <button class="button button-secondary" id="exportButton" type="button"><?= easysched_icon('download', '15') ?>Export CSV</button>
                            <button class="button button-primary manage-only" id="generateButton" type="button"><?= easysched_icon('sparkle', '15') ?>Generate schedule</button>
                        </div>
                    </div>
                    <div class="filter-bar">
                        <label class="field-inline">View<select id="scheduleViewFilter"><option value="all">All classes</option><option value="section">By section</option><option value="instructor">By instructor</option><option value="room">By room</option></select></label>
                        <label class="field-inline" id="scheduleFilterValueWrap">Filter<select id="scheduleFilterValue"><option value="all">All</option></select></label>
                        <span class="filter-spacer"></span>
                        <span class="legend"><span class="legend-dot lecture"></span>Lecture <span class="legend-dot lab"></span>Laboratory</span>
                    </div>
                    <div class="calendar-panel"><div class="calendar-grid" id="calendarGrid"></div></div>
                    <div class="print-signatures" aria-hidden="true">
                        <div><span class="signature-line"></span>Prepared by</div>
                        <div><span class="signature-line"></span>Checked by</div>
                        <div><span class="signature-line"></span>Approved by</div>
                    </div>
                    <article class="panel schedule-table-panel">
                        <div class="panel-heading"><div><p class="eyebrow">Detailed list</p><h3 id="scheduleCountLabel">0 classes</h3></div><span class="badge badge-neutral" id="conflictBadge">Validated</span></div>
                        <div class="table-wrap">
                            <table class="data-table">
                                <thead><tr><th>Day</th><th>Time</th><th>Subject</th><th>Section</th><th>Instructor</th><th>Room</th><th class="manage-column">Action</th></tr></thead>
                                <tbody id="scheduleTableBody"></tbody>
                            </table>
                        </div>
                    </article>
                </section>

                <section class="page" id="page-data" data-page="data" aria-labelledby="dataHeading" hidden>
                    <div class="page-heading"><div><p class="eyebrow">Master data</p><h2 id="dataHeading">Academic setup</h2><p class="muted">Maintain the resources the scheduler solves against.</p></div></div>
                    <div class="data-tabs" role="tablist" aria-label="Master data types">
                        <button class="tab-button active" role="tab" aria-selected="true" data-data-tab="rooms" type="button">Rooms</button>
                        <button class="tab-button" role="tab" aria-selected="false" data-data-tab="instructors" type="button">Faculty</button>
                        <button class="tab-button" role="tab" aria-selected="false" data-data-tab="subjects" type="button">Subjects</button>
                        <button class="tab-button" role="tab" aria-selected="false" data-data-tab="programs" type="button">Programs</button>
                        <button class="tab-button" role="tab" aria-selected="false" data-data-tab="sections" type="button">Sections</button>
                        <button class="tab-button" role="tab" aria-selected="false" data-data-tab="offerings" type="button">Offerings</button>
                        <button class="tab-button admin-only" role="tab" aria-selected="false" data-data-tab="users" type="button">Users</button>
                    </div>
                    <article class="panel">
                        <div class="panel-heading"><div><p class="eyebrow">Current term records</p><h3 id="dataTabTitle">Rooms</h3></div><button class="button button-primary manage-only" id="addRecordButton" type="button">Add record</button></div>
                        <div class="table-wrap"><table class="data-table"><thead id="dataTableHead"></thead><tbody id="dataTableBody"></tbody></table></div>
                    </article>
                    <article class="panel admin-only" id="registrationReviewPanel" hidden>
                        <div class="panel-heading"><div><p class="eyebrow">Enrollment review</p><h3>Pending student registrations</h3></div><span class="badge badge-warning" id="pendingRegistrationCount">0 pending</span></div>
                        <div class="table-wrap">
                            <table class="data-table">
                                <thead><tr><th>Name</th><th>Username</th><th>Enrollment ref.</th><th>Program</th><th>Year</th><th>Section</th><th>Action</th></tr></thead>
                                <tbody id="pendingRegistrationBody"></tbody>
                            </table>
                        </div>
                    </article>
                </section>

                <section class="page" id="page-reports" data-page="reports" aria-labelledby="reportsHeading" hidden>
                    <div class="page-heading">
                        <div><p class="eyebrow">Evidence and review</p><h2 id="reportsHeading">Reports</h2><p class="muted">Summaries to present during review and defense.</p></div>
                        <div class="page-heading-actions export-actions">
                            <label class="sr-only" for="reportExportFormat">Export format</label>
                            <select id="reportExportFormat" aria-label="Export format"><option value="csv">CSV spreadsheet</option><option value="pdf">PDF report</option></select>
                            <button class="button button-secondary" id="reportExportButton" type="button"><?= easysched_icon('download', '15') ?>Export</button>
                        </div>
                    </div>
                    <div class="metric-grid" id="reportMetricGrid"></div>
                    <div class="report-grid">
                        <article class="panel"><div class="panel-heading"><div><p class="eyebrow">Constraint validation</p><h3>Hard constraints</h3></div></div><div id="constraintReport" class="constraint-list"></div></article>
                        <article class="panel"><div class="panel-heading"><div><p class="eyebrow">Capacity planning</p><h3>Room utilization</h3></div></div><div id="roomReport" class="bar-list"></div></article>
                    </div>
                </section>

                <section class="page" id="page-settings" data-page="settings" aria-labelledby="settingsHeading" hidden>
                    <div class="page-heading"><div><p class="eyebrow">System controls</p><h2 id="settingsHeading">Settings</h2><p class="muted">Term configuration and account security.</p></div></div>
                    <div class="settings-grid">
                        <article class="panel manage-only">
                            <div class="panel-heading"><div><p class="eyebrow">Academic period</p><h3>Active term</h3></div></div>
                            <form id="settingsForm">
                                <div class="field"><label for="academicYear">Academic year</label><input id="academicYear" pattern="20[0-9]{2}-20[0-9]{2}" required placeholder="2026-2027"><span class="field-hint">Format: 2026-2027.</span></div>
                                <div class="field"><label for="semester">Semester</label><select id="semester"><option>First Semester</option><option>Second Semester</option></select></div>
                                <button class="button button-primary" type="submit">Save term</button>
                            </form>
                        </article>
                        <article class="panel">
                            <div class="panel-heading"><div><p class="eyebrow">Account</p><h3>Change password</h3></div></div>
                            <form id="passwordForm">
                                <div class="field"><label for="currentPassword">Current password</label><input id="currentPassword" type="password" required autocomplete="current-password"></div>
                                <div class="field"><label for="newPassword">New password</label><input id="newPassword" type="password" minlength="10" required autocomplete="new-password"><span class="field-hint">At least 10 characters.</span></div>
                                <div class="field"><label for="confirmPassword">Confirm new password</label><input id="confirmPassword" type="password" minlength="10" required autocomplete="new-password"></div>
                                <button class="button button-primary" type="submit">Change password</button>
                            </form>
                        </article>
                    </div>
                    <article class="panel security-note">
                        <div class="security-icon"><?= easysched_icon('shield', '22') ?></div>
                        <div>
                            <p class="eyebrow">Deployment boundary</p>
                            <h3>Defense build security posture</h3>
                            <p>This build uses server-side sessions, password hashes, CSRF tokens, prepared SQLite queries, role checks, audit logs, and a restrictive content security policy. Use HTTPS and a production database before handling real student records.</p>
                        </div>
                    </article>
                </section>

                <section class="page help-page" id="page-help" data-page="help" aria-labelledby="helpHeading" hidden>
                    <div class="page-heading"><div><p class="eyebrow">Quick orientation</p><h2 id="helpHeading">Help center</h2><p class="muted">A short walkthrough for managing EasySched from setup to a published timetable.</p></div></div>
                    <article class="panel help-hero">
                        <div class="help-slide-count" id="helpSlideCount">1 / 8</div>
                        <div id="helpSlideContent"></div>
                    </article>
                    <div class="help-controls"><button class="button button-ghost" id="helpBackButton" type="button">Back</button><div class="help-dots" id="helpDots" aria-label="Help steps"></div><button class="button button-primary" id="helpNextButton" type="button">Next</button></div>
                </section>
            </div>
        </main>
    </div>

    <div class="modal-backdrop" id="modalBackdrop" hidden>
        <section class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-header">
                <div><p class="eyebrow" id="modalEyebrow">Record</p><h2 id="modalTitle">Edit record</h2></div>
                <button class="icon-button" id="modalCloseButton" type="button" aria-label="Close dialog"><?= easysched_icon('close', '18') ?></button>
            </div>
            <form id="modalForm">
                <div class="modal-body" id="modalBody"></div>
                <div class="modal-footer">
                    <button class="button button-ghost" id="modalCancelButton" type="button">Cancel</button>
                    <button class="button button-primary" type="submit">Save</button>
                </div>
            </form>
        </section>
    </div>

    <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="false"></div>
    <div class="sr-only" id="liveRegion" aria-live="polite"></div>
    <script src="script.js?v=<?= EASYSCHED_ASSET_VERSION ?>" defer></script>
</body>
</html>
