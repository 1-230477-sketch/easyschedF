(() => {
  'use strict';

  const NAV = {
    admin: [
      ['dashboard', 'Overview'], ['schedules', 'Schedule'], ['data', 'Academic setup'], ['reports', 'Reports'], ['settings', 'Settings'], ['help', 'Help']
    ],
    scheduler: [
      ['dashboard', 'Overview'], ['schedules', 'Schedule'], ['data', 'Academic setup'], ['reports', 'Reports'], ['settings', 'Settings'], ['help', 'Help']
    ],
    instructor: [
      ['dashboard', 'Overview'], ['schedules', 'My schedule'], ['settings', 'Settings'], ['help', 'Help']
    ],
    student: [
      ['dashboard', 'Overview'], ['schedules', 'My section'], ['settings', 'Settings'], ['help', 'Help']
    ]
  };
  const PAGE_META = {
    dashboard: ['Overview', 'Command center'],
    schedules: ['Published timetable', 'Timetable'],
    data: ['Master data', 'Academic records'],
    reports: ['Evidence and review', 'Validation reports'],
    settings: ['System controls', 'Account controls'],
    help: ['Quick orientation', 'Getting started']
  };
  // Inline SVG only: the content security policy forbids external assets, and
  // font glyphs render inconsistently across the machines used for review.
  const svgIcon = (body, size = 17) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
  const PATH = {
    dashboard: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="4.6" rx="1.6"/><rect x="13.5" y="11.1" width="7" height="9.4" rx="1.6"/><rect x="3.5" y="13.1" width="7" height="7.4" rx="1.6"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 10h17M8 3.2v3.4M16 3.2v3.4"/>',
    calendarCheck: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 10h17M8 3.2v3.4M16 3.2v3.4M9.4 15.1l1.9 1.9 3.7-4"/>',
    database: '<ellipse cx="12" cy="6" rx="7.4" ry="2.7"/><path d="M4.6 6v6c0 1.5 3.3 2.7 7.4 2.7s7.4-1.2 7.4-2.7V6"/><path d="M4.6 12v6c0 1.5 3.3 2.7 7.4 2.7s7.4-1.2 7.4-2.7v-6"/>',
    chart: '<path d="M3.5 20.5h17"/><rect x="5" y="11" width="3.6" height="6.6" rx="1.2"/><rect x="10.2" y="6.4" width="3.6" height="11.2" rx="1.2"/><rect x="15.4" y="9" width="3.6" height="8.6" rx="1.2"/>',
    sliders: '<path d="M6 3.5v6.2M6 14.3v6.2M18 3.5v8.2M18 16.3v4.2"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="14" r="2.3"/>',
    book: '<path d="M12 6.6C10.6 5.2 8.7 4.5 6.2 4.5H4.5v13h1.7c2.5 0 4.4.7 5.8 2.1"/><path d="M12 6.6c1.4-1.4 3.3-2.1 5.8-2.1h1.7v13h-1.7c-2.5 0-4.4.7-5.8 2.1"/><path d="M12 6.6v13"/>',
    users: '<circle cx="9.2" cy="8.4" r="3.2"/><path d="M3.6 19.8a5.6 5.6 0 0111.2 0"/><path d="M16.4 5.6a3.2 3.2 0 010 5.8M17.7 19.8a5.7 5.7 0 00-1.8-4.1"/>',
    building: '<path d="M4.6 20.5V5.2a1.7 1.7 0 011.7-1.7h7.5a1.7 1.7 0 011.7 1.7v15.3"/><path d="M15.5 9.6h2.7a1.7 1.7 0 011.7 1.7v9.2"/><path d="M2.8 20.5h18.4"/><path d="M8.1 7.6h3.6M8.1 11.1h3.6M8.1 14.6h3.6"/>',
    success: '<circle cx="12" cy="12" r="8.6"/><path d="M8.4 12.4l2.4 2.4 4.8-5.2"/>',
    error: '<circle cx="12" cy="12" r="8.6"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/>',
    warn: '<path d="M12 4.4l8.4 14.6H3.6z"/><path d="M12 9.9v4M12 16.5h.01"/>',
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    empty: '<path d="M3.5 13.6h4.2l1.6 2.6h5.4l1.6-2.6h4.2"/><path d="M3.5 13.6L6.1 5.4h11.8l2.6 8.2v4.3a1.8 1.8 0 01-1.8 1.8H5.3a1.8 1.8 0 01-1.8-1.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7"/>',
    moon: '<path d="M20.5 14.6A8.6 8.6 0 019.4 3.5a8.6 8.6 0 1011.1 11.1z"/>'
  };
  const ICONS = {
    dashboard: svgIcon(PATH.dashboard),
    schedules: svgIcon(PATH.calendar),
    data: svgIcon(PATH.database),
    reports: svgIcon(PATH.chart),
    settings: svgIcon(PATH.sliders),
    help: svgIcon(PATH.book)
  };
  const METRIC_ICONS = {
    'Active offerings': PATH.book,
    'Published classes': PATH.calendarCheck,
    Sections: PATH.users,
    Rooms: PATH.building,
    'Faculty used': PATH.users,
    'Rooms used': PATH.building,
    'Sections covered': PATH.dashboard
  };
  const emptyState = (title, detail) => `<div class="empty-state">${svgIcon(PATH.empty, 26)}<strong>${esc(title)}</strong>${esc(detail)}</div>`;
  const state = { snapshot: null, page: 'dashboard', dataTab: 'rooms', scheduleView: 'all', scheduleFilter: 'all', query: '' };
  const HELP_SLIDES = {
    admin: [
      ['Administrator orientation', 'You manage the complete EasySched workspace: users, academic data, schedule generation, reports, and security settings.', ['Start with Academic setup and review the active term before making changes.']],
      ['Maintain the academic setup', 'Create and verify programs, sections, subjects, instructors, rooms, and course offerings. These records are the inputs used by the scheduler.', ['Keep enrollment, room capacity, room type, and required features accurate.']],
      ['Generate and publish', 'Use Generate schedule after the master data is ready. The solver validates all hard constraints before publishing a run.', ['A failed generation preserves the last published schedule.']],
      ['Review evidence', 'Use Reports to inspect constraint results, room utilization, and the generation record before presenting the timetable.', ['Export or print the reviewed schedule for approval.']],
      ['Manage accounts and security', 'Use Settings to change your password and administer the deployment boundary. Rotate seed credentials and use HTTPS before production use.', ['Review audit records and restrict database access.']]
    ],
    scheduler: [
      ['Scheduler orientation', 'You prepare academic records, generate schedules, and maintain the published timetable without managing user accounts.', ['Begin by checking the active term and master data.']],
      ['Prepare scheduling inputs', 'Review offerings, instructors, rooms, sections, capacities, and required meeting counts before generating.', ['Incomplete or conflicting inputs can make generation impossible.']],
      ['Generate a schedule', 'Generate schedule tests room, instructor, section, availability, capacity, and daily-hour constraints before publication.', ['Never treat a partial or failed run as a published timetable.']],
      ['Review and edit safely', 'Use the weekly schedule filters to inspect by section, instructor, or room. Manual edits are checked against the same hard constraints.', ['Regenerate when the academic inputs have materially changed.']],
      ['Reports and handoff', 'Use Reports and CSV/print export to document room utilization, validation results, and the final timetable.', ['Keep the published run as the approved reference.']]
    ],
    instructor: [
      ['Instructor orientation', 'Your workspace is focused on the classes assigned to you and the published timetable for your teaching schedule.', ['Use My schedule to see your confirmed meetings.']],
      ['Read the weekly schedule', 'Filter the calendar by instructor to find subjects, sections, rooms, days, and time slots assigned to you.', ['Contact the scheduler if an assignment looks incorrect.']],
      ['Understand published status', 'Only validated and published schedule entries are shown as official. The system prevents overlapping instructor assignments.', ['Do not rely on an unsaved or proposed change.']],
      ['Account settings', 'Use Settings to change your password and keep your account secure.', ['Never share your password or use another person’s account.']]
    ],
    student: [
      ['Student orientation', 'Your workspace shows the published timetable for your assigned section.', ['Use My section to find your classes quickly.']],
      ['Read your timetable', 'The weekly schedule shows each subject, instructor, room, day, and time slot for your section.', ['Check the active academic term when reviewing a schedule.']],
      ['Trust the published schedule', 'Schedules are checked for room, instructor, section, capacity, and time conflicts before publication.', ['Ask your program office about corrections or changes.']],
      ['Account settings', 'Use Settings to change your password and keep your account secure.', ['Contact an administrator if your section or account details are wrong.']]
    ]
  };
  const helpSlides = [
    ['Welcome to EasySched', 'Use this workspace to prepare academic data, generate conflict-aware schedules, and publish a timetable your campus can trust.', ['Start with Academic setup, then generate and review the schedule.']],
    ['Know your role', 'Administrators and schedulers maintain data and generate schedules. Instructors view assigned classes. Students view their section schedule.', ['Your account controls which pages and records are available.']],
    ['Prepare the academic setup', 'Maintain the active term, programs, sections, subjects, faculty, rooms, and course offerings before generating.', ['Complete master data first so the solver has reliable inputs.']],
    ['Generate a schedule', 'Open Schedule and choose Generate schedule. EasySched checks room capacity, room type, features, time overlap, availability, and daily teaching limits.', ['A failed generation never replaces the last published schedule.']],
    ['Review the weekly timetable', 'Use the view and filter controls to inspect schedules by section, instructor, or room. Conflicts are rejected before publication.', ['Use the calendar as the single source of truth for published classes.']],
    ['Publish and manage changes', 'Manual edits are validated against the same conflict rules. Save only approved changes, then review the resulting timetable.', ['Keep the published run stable while testing alternatives.']],
    ['Reports and exports', 'Reports show constraint checks and room utilization. Export the visible schedule as CSV or print a clean timetable for review.', ['Apply filters before exporting when you need a focused report.']],
    ['Account security and support', 'Change your password in Settings. Use HTTPS in deployment, keep database secrets server-side, and contact an administrator when access or data needs review.', ['Return to this Help center any time from the sidebar.']]
  ];
  let helpIndex = 0;
  let modalMode = null;
  let modalRecord = null;
  let modalReturnFocus = null;
  let registrationOpen = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const text = (value) => String(value ?? '').trim();
  const role = () => state.snapshot?.user?.role || '';
  const canManage = () => ['admin', 'scheduler'].includes(role());
  const canSeeGeneration = () => canManage();
  const canAdmin = () => role() === 'admin';
  const days = () => Object.entries(state.snapshot?.days || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  const slots = () => state.snapshot?.time_slots || [];
  const schedules = () => state.snapshot?.schedules || [];
  const subjectById = (id) => (state.snapshot?.subjects || []).find((item) => Number(item.id) === Number(id));

  async function request(action, options = {}) {
    const method = options.method || 'GET';
    const headers = { Accept: 'application/json' };
    let url = `api.php?action=${encodeURIComponent(action)}`;
    const init = { method, headers, credentials: 'same-origin' };
    if (method !== 'GET') {
      headers['Content-Type'] = 'application/json';
      const payload = { ...(options.body || {}), csrf: state.snapshot?.csrf || '' };
      init.body = JSON.stringify(payload);
    }
    const response = await fetch(url, init);
    const contentType = response.headers.get('content-type') || '';
    if (action === 'export' && !contentType.includes('application/json')) return response;
    let payload;
    try { payload = await response.json(); } catch { throw new Error('The server returned an invalid response.'); }
    if (response.status === 401) {
      state.snapshot = null;
      if (!registrationOpen && action !== 'registration_options') showLogin();
    }
    if (!response.ok || payload.ok === false) {
      const error = new Error(payload.error || 'The request could not be completed.');
      error.details = payload.details || {};
      error.status = response.status;
      throw error;
    }
    return payload.data;
  }

  function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.innerHTML = svgIcon(PATH[type] || PATH.success, 18);

    const body = document.createElement('div');
    body.innerHTML = `<strong>${esc(title)}</strong><p>${esc(message)}</p>`;

    const close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss notification');
    close.innerHTML = svgIcon(PATH.close, 14);

    let removeTimer = 0;
    const dismiss = () => {
      window.clearTimeout(removeTimer);
      toast.classList.add('leaving');
      window.setTimeout(() => toast.remove(), 200);
    };
    close.addEventListener('click', dismiss);
    toast.addEventListener('pointerenter', () => window.clearTimeout(removeTimer));
    toast.addEventListener('pointerleave', () => { removeTimer = window.setTimeout(dismiss, 2500); });

    toast.append(icon, body, close);
    $('#toastStack').append(toast);
    removeTimer = window.setTimeout(dismiss, type === 'error' ? 8000 : 5000);
  }

  /* ---------------------------------------------------------------------- *
   * Theme. The stylesheet reads `data-theme` on <html>; the choice is
   * remembered per browser and falls back to the operating system setting.
   * ---------------------------------------------------------------------- */
  const THEME_KEY = 'easysched-theme';

  function readStoredTheme() {
    try { return window.localStorage.getItem(THEME_KEY); } catch { return null; }
  }

  function applyTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const toggle = $('#themeToggle');
    if (!toggle) return;
    toggle.innerHTML = svgIcon(dark ? PATH.sun : PATH.moon, 18);
    const next = dark ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${next} theme`);
    toggle.setAttribute('title', `Switch to ${next} theme`);
  }

  function initTheme() {
    const stored = readStoredTheme();
    if (stored === 'dark' || stored === 'light') return applyTheme(stored);
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(query.matches ? 'dark' : 'light');
    // Keep following the operating system until a theme is chosen explicitly.
    query.addEventListener('change', (event) => { if (!readStoredTheme()) applyTheme(event.matches ? 'dark' : 'light'); });
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { window.localStorage.setItem(THEME_KEY, next); } catch { /* private browsing */ }
    announce(`${next === 'dark' ? 'Dark' : 'Light'} theme enabled.`);
  }

  // Applied at parse end because this file is deferred. The content security
  // policy forbids an inline bootstrap script, so this is the earliest point the
  // stored theme can be restored without showing the wrong palette first.
  initTheme();

  function announce(message) {
    const region = $('#liveRegion');
    if (region) region.textContent = message;
  }

  function showLogin(message = '') {
    registrationOpen = false;
    $('#loginView').hidden = false; $('#appView').hidden = true;
    $('#loginView').classList.remove('registration-mode');
    $('#registrationView').hidden = true; $('#loginForm').closest('.login-panel').hidden = false;
    $('#forgotPasswordView').hidden = true;
    $('#loginError').textContent = message;
    $('#loginUsername').focus();
  }

  async function showRegistration() {
    registrationOpen = true;
    $('#loginView').classList.add('registration-mode'); $('#loginForm').closest('.login-panel').hidden = true; $('#registrationView').hidden = false; $('#registrationError').textContent = '';
    try {
      const options = await request('registration_options');
      $('#registrationProgram').innerHTML = '<option value="">Select program</option>' + options.programs.map((item) => `<option value="${esc(item.id)}">${esc(item.code)} - ${esc(item.name)}</option>`).join('');
      $('#registrationSection').innerHTML = '<option value="">No section assigned yet</option>' + options.sections.map((item) => `<option value="${esc(item.id)}" data-program="${esc(item.program_id)}" data-year="${esc(item.year_level)}">${esc(item.code)} - Year ${esc(item.year_level)}</option>`).join('');
    } catch (error) { $('#registrationError').textContent = error.message; }
    $('#registrationName').focus();
  }

  async function sendRegistrationOtp() { try { const result = await request('request_registration_otp', { method: 'POST', body: { email: $('#registrationEmail').value } }); showToast('Code sent', result.message); } catch (error) { $('#registrationError').textContent = error.message; } }
  function showForgotPassword() { registrationOpen = true; $('#loginView').classList.add('registration-mode'); $('#loginForm').closest('.login-panel').hidden = true; $('#registrationView').hidden = true; $('#forgotPasswordView').hidden = false; $('#resetError').textContent = ''; $('#resetAccount').focus(); }
  async function sendResetOtp() { try { const result = await request('request_password_reset', { method: 'POST', body: { account: $('#resetAccount').value } }); showToast('Check your email', result.message); } catch (error) { $('#resetError').textContent = error.message; } }
  async function resetPassword(event) { event.preventDefault(); try { const result = await request('reset_password', { method: 'POST', body: { otp: $('#resetOtp').value, password: $('#resetPassword').value, confirm_password: $('#resetPasswordConfirm').value } }); showLogin(); showToast('Password reset', result.message); } catch (error) { $('#resetError').textContent = error.message; } }

  async function registerStudent(event) { event.preventDefault(); $('#registrationError').textContent = ''; const first = text($('#registrationFirstName').value); const middle = text($('#registrationMiddleName').value); const last = text($('#registrationLastName').value); const body = { display_name: [first, middle, last].filter(Boolean).join(' '), username: $('#registrationUsername').value, enrollment_ref: $('#registrationRef').value, email: $('#registrationEmail').value, otp: $('#registrationOtp').value, program_id: $('#registrationProgram').value, year_level: $('#registrationYear').value, section_id: $('#registrationSection').value, password: $('#registrationPassword').value }; try { const result = await request('register', { method: 'POST', body }); showLogin(); showToast('Registration submitted', result.message, 'success'); } catch (error) { $('#registrationError').textContent = error.message; } }

  async function reviewRegistration(id, decision) { const label = decision === 'APPROVE' ? 'approve this student registration' : 'reject this student registration'; if (!window.confirm(`Are you sure you want to ${label}?`)) return; const button = $(`.review-registration[data-registration-id="${id}"][data-decision="${decision}"]`); if (button) { button.disabled = true; button.textContent = decision === 'APPROVE' ? 'Approving...' : 'Rejecting...'; } try { const result = await request('review_registration', { method: 'POST', body: { registration_id: id, decision } }); if (result.snapshot) result.snapshot.pending_registrations = (result.snapshot.pending_registrations || []).filter((row) => Number(row.id) !== Number(id)); applySnapshot(result.snapshot); showToast('Registration reviewed', result.message); } catch (error) { if (button) { button.disabled = false; button.textContent = decision === 'APPROVE' ? 'Approve' : 'Reject'; } showToast('Could not review registration', error.message, 'error'); } }

  function updateLoginChallenge(details = {}) {
    const required = Boolean(details.captcha_required);
    $('#loginCaptchaWrap').hidden = !required;
    $('#loginCaptcha').required = required;
    $('#loginCaptcha').value = '';
    if (required) $('#loginCaptchaImage').src = `captcha.php?v=${Date.now()}`;
    else $('#loginCaptchaImage').removeAttribute('src');
  }

  function refreshLoginCaptcha() {
    if ($('#loginCaptchaWrap').hidden) return;
    $('#loginCaptcha').value = '';
    $('#loginCaptchaImage').src = `captcha.php?refresh=1&v=${Date.now()}`;
    $('#loginCaptcha').focus();
  }

  function showApp() {
    $('#loginView').hidden = true; $('#appView').hidden = false;
    $('#userName').textContent = state.snapshot.user.display_name;
    $('#userRole').textContent = state.snapshot.user.role;
    $('#userAvatar').textContent = state.snapshot.user.display_name.slice(0, 2).toUpperCase();
    buildNavigation();
    renderAll();
  }

  function buildNavigation() {
    const nav = $('#navList');
    nav.replaceChildren();
    (NAV[role()] || []).forEach(([id, label]) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.navigate = id; button.className = id === state.page ? 'active' : '';
      button.setAttribute('aria-current', id === state.page ? 'page' : 'false');
      button.innerHTML = `<span class="nav-icon" aria-hidden="true">${ICONS[id]}</span><span>${esc(label)}</span>`;
      item.append(button); nav.append(item);
    });
  }

  function navigate(page) {
    if (!(NAV[role()] || []).some(([id]) => id === page)) return;
    if (state.page !== page) {
      state.query = '';
      $('#globalSearch').value = '';
    }
    state.page = page;
    $$('.page').forEach((section) => { section.hidden = section.dataset.page !== page; });
    const activePage = $(`#page-${page}`);
    activePage?.classList.remove('page-enter');
    if (activePage) requestAnimationFrame(() => activePage.classList.add('page-enter'));
    $$('#navList button').forEach((button) => { const active = button.dataset.navigate === page; button.classList.toggle('active', active); button.setAttribute('aria-current', active ? 'page' : 'false'); });
    const [eyebrow, title] = PAGE_META[page]; $('#pageEyebrow').textContent = eyebrow; $('#pageTitle').textContent = title;
    document.title = `${title} | EasySched`;
    announce(`${title} page loaded.`);
    const searchField = $('#globalSearch').closest('.search-field');
    const searchablePage = ['schedules', 'data'].includes(page);
    searchField.hidden = !searchablePage;
    searchField.setAttribute('aria-hidden', String(!searchablePage));
    $('#globalSearch').setAttribute('placeholder', page === 'data' ? 'Search records' : 'Search classes');
    closeSidebar();
    if (page === 'dashboard') renderDashboard();
    if (page === 'schedules') renderSchedules();
    if (page === 'data') renderData();
    if (page === 'reports') renderReports();
    if (page === 'settings') renderSettings();
    if (page === 'help') renderHelp();
  }

  function renderHelp() {
    const slides = HELP_SLIDES[role()] || helpSlides;
    if (helpIndex >= slides.length) helpIndex = 0;
    const slide = slides[helpIndex];
    $('#helpSlideCount').textContent = `${helpIndex + 1} / ${slides.length}`;
    $('#helpSlideContent').innerHTML = `<p class="eyebrow">EASYSCHED ORIENTATION</p><h3>${esc(slide[0])}</h3><p class="help-lead">${esc(slide[1])}</p><ul>${slide[2].map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
    $('#helpBackButton').disabled = helpIndex === 0;
    $('#helpNextButton').textContent = helpIndex === slides.length - 1 ? 'Finish' : 'Next';
    $('#helpDots').innerHTML = slides.map((_, i) => `<button type="button" class="help-dot${i === helpIndex ? ' active' : ''}" data-help-index="${i}" aria-label="Step ${i + 1}" aria-current="${i === helpIndex ? 'step' : 'false'}"></button>`).join('');
  }

  function applySnapshot(snapshot) {
    state.snapshot = snapshot;
    if (!snapshot) return showLogin();
    if (!(NAV[snapshot.user.role] || []).some(([id]) => id === state.page)) state.page = 'dashboard';
    showApp();
  }

  function metric(label, value, note) {
    const icon = svgIcon(METRIC_ICONS[label] || PATH.dashboard, 16);
    return `<div class="metric"><div class="metric-top"><span class="metric-icon">${icon}</span><div class="metric-label">${esc(label)}</div></div><div class="metric-value">${esc(value)}</div><div class="metric-note">${esc(note)}</div></div>`;
  }

  function renderDashboard() {
    const snapshot = state.snapshot; const list = schedules(); const run = snapshot.active_run; const validation = snapshot.validation;
    const activeTerm = (snapshot.terms || []).find((term) => Number(term.id) === Number(snapshot.active_term_id));
    const termLabel = activeTerm ? `${activeTerm.academic_year} · ${activeTerm.semester}` : 'No active academic term';
    const termElement = $('#activeTermLabel'); if (termElement) termElement.textContent = `Active term: ${termLabel}`;
    const metricGrid = $('#metricGrid'); if (metricGrid) metricGrid.hidden = false;
    const assigned = run ? Number(run.assigned_tasks) : 0; const total = run ? Number(run.total_tasks) : snapshot.offerings.length;
    const today = new Date().getDay(); const todayDay = today >= 1 && today <= 5 ? today : 1; const todayCount = list.filter((row) => Number(row.day_of_week) === todayDay).length;
    const metrics = canSeeGeneration()
      ? [metric('Active offerings', snapshot.offerings.length, 'Course-section assignments'), metric('Published classes', list.length, run ? `Run #${run.id}` : 'No published run'), metric('Sections', snapshot.sections.length, 'Current academic term'), metric('Rooms', snapshot.rooms.length, 'Available resources')]
      : [metric('My classes', list.length, role() === 'student' ? 'Classes in your section' : 'Classes assigned to you'), metric("Today's classes", todayCount, 'Scheduled for today'), metric('Rooms', new Set(list.map((row) => row.room_id)).size, 'Rooms in your schedule'), metric('Next class', list[0]?.time_label || 'None', list[0] ? `${list[0].subject_code} · ${list[0].room_code}` : 'No upcoming class')];
    $('#metricGrid').innerHTML = metrics.join('');
    $('#scheduleHealthBadge').className = `badge ${validation?.valid ? '' : run ? 'badge-warning' : 'badge-neutral'}`;
    $('#scheduleHealthBadge').textContent = run ? (validation?.valid ? 'Validated' : 'Review required') : 'No schedule';
    const checks = Object.entries(validation?.checks || {});
    const healthPanel = $('#dashboardHealth')?.closest('.panel'); const runPanel = $('#runSummary')?.closest('.panel');
    if (healthPanel) healthPanel.hidden = !canSeeGeneration(); if (runPanel) runPanel.hidden = !canSeeGeneration();
    $('#dashboardHealth').innerHTML = checks.length ? checks.map(([item, passed]) => `<div class="health-row"><span>${esc(item.replaceAll('_', ' '))}</span><strong class="${passed ? 'health-ok' : 'health-error'}">${passed ? 'Passed' : 'Failed'}</strong></div>`).join('') : emptyState('No validation yet', 'Generate a schedule to see the hard-constraint report.');
    $('#runSummary').innerHTML = run ? [`<div class="summary-row"><span>Run status</span><strong>${esc(run.status)}</strong></div>`, `<div class="summary-row"><span>Assigned tasks</span><strong>${assigned} / ${total}</strong></div>`, `<div class="summary-row"><span>Search nodes</span><strong>${Number(run.diagnostics?.search_nodes || 0).toLocaleString()}</strong></div>`, `<div class="summary-row"><span>Soft-cost score</span><strong>${esc(run.diagnostics?.soft_cost ?? 'n/a')}</strong></div>`].join('') : emptyState('No generation record', 'Run the scheduler to record diagnostics.');
    const upcoming = list.slice(0, 6);
    $('#upcomingBody').innerHTML = upcoming.length ? upcoming.map((row) => `<tr><td><strong>${esc(row.day_name)}</strong><span class="subline">${esc(row.time_label || row.slot_label)}</span></td><td><strong>${esc(row.subject_code)}</strong><span class="subline">${esc(row.subject_name)}</span></td><td>${esc(row.section_code)}</td><td>${esc(row.room_code)}</td><td>${esc(row.instructor_name)}</td></tr>`).join('') : `<tr><td colspan="5">${emptyState('No published schedule', 'Generate a conflict-free timetable to populate this list.')}</td></tr>`;
    $$('.manage-only').forEach((element) => { element.hidden = !canSeeGeneration(); });
  }

  function scheduleRow(row, includeAction = false) {
    const action = includeAction && canManage() ? `<td class="manage-column"><div class="row-actions"><button class="button button-ghost button-small edit-entry" data-entry-id="${Number(row.id)}" type="button">Edit</button><button class="button button-danger button-small cancel-entry" data-entry-id="${Number(row.id)}" type="button">Cancel</button></div></td>` : '';
    return `<tr><td>${esc(row.day_name)}</td><td><strong>${esc(row.time_label || row.slot_label)}</strong></td><td><strong>${esc(row.subject_code)}</strong><span class="subline">${esc(row.subject_name)}</span></td><td>${esc(row.section_code)}<span class="subline">${esc(row.program_code)}</span></td><td>${esc(row.instructor_name)}</td><td>${esc(row.room_code)}<span class="subline">${Number(row.room_capacity)} seats</span></td>${action}</tr>`;
  }

  function visibleScheduleRows() {
    const query = state.query.toLowerCase();
    return schedules().filter((row) => {
      const selected = state.scheduleView === 'all' || state.scheduleFilter === 'all' || (state.scheduleView === 'section' && String(row.section_id) === state.scheduleFilter) || (state.scheduleView === 'instructor' && String(row.instructor_id) === state.scheduleFilter) || (state.scheduleView === 'room' && String(row.room_id) === state.scheduleFilter);
      const searchable = `${row.subject_code} ${row.subject_name} ${row.section_code} ${row.instructor_name} ${row.room_code} ${row.day_name} ${row.slot_label}`.toLowerCase();
      return selected && (!query || searchable.includes(query));
    });
  }

  function renderSchedules() {
    const activeTerm = (state.snapshot.terms || []).find((term) => Number(term.id) === Number(state.snapshot.active_term_id));
    const termLabel = activeTerm ? `${activeTerm.academic_year} · ${activeTerm.semester}` : 'No active academic term';
    const scheduleTerm = $('#scheduleTermLabel'); if (scheduleTerm) scheduleTerm.textContent = `Active term: ${termLabel}`;
    const printMeta = $('#printMeta'); if (printMeta) printMeta.textContent = `Weekly class schedule · ${termLabel}`;
    renderFilterValues();
    const rows = visibleScheduleRows(); $('#scheduleCountLabel').textContent = `${rows.length} ${rows.length === 1 ? 'class' : 'classes'}`;
    const columnCount = canManage() ? 7 : 6;
    $('#scheduleTableBody').innerHTML = rows.length ? rows.map((row) => scheduleRow(row, true)).join('') : `<tr><td colspan="${columnCount}">${emptyState('No classes match this view', 'Change the filter above, or generate a schedule.')}</td></tr>`;
    const hasRun = Boolean(state.snapshot.active_run);
    const valid = Boolean(state.snapshot.validation?.valid);
    $('#conflictBadge').textContent = hasRun ? (valid ? 'Validated' : 'Conflict found') : 'No run';
    $('#conflictBadge').className = `badge ${hasRun ? (valid ? 'badge-neutral' : 'badge-warning') : 'badge-neutral'}`;
    renderCalendar(rows);
    updatePrintMeta(rows.length);
    $$('.manage-column').forEach((cell) => { cell.hidden = !canManage(); });
  }

  /* Printed timetables are handed out during review, so the sheet carries its
   * own term, filter and print date rather than relying on browser headers. */
  function updatePrintMeta(count) {
    const target = $('#printMeta');
    if (!target) return;
    const terms = state.snapshot?.terms || [];
    const active = terms.find((term) => Number(term.id) === Number(state.snapshot?.active_term_id)) || terms[0];
    const period = active ? `${active.academic_year} · ${active.semester}` : 'No active term';
    const scope = state.scheduleView === 'all' || state.scheduleFilter === 'all'
      ? 'All classes'
      : text($('#scheduleFilterValue')?.selectedOptions?.[0]?.textContent) || 'Filtered';
    const printed = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    target.textContent = `Weekly class schedule · ${period} · ${scope} · ${count} ${count === 1 ? 'class' : 'classes'} · Printed ${printed}`;
  }

  function renderFilterValues() {
    const select = $('#scheduleFilterValue'); const previous = state.scheduleFilter; let values = [];
    if (state.scheduleView === 'section') values = state.snapshot.sections.map((item) => [item.id, `${item.code} - ${item.program_code}`]);
    if (state.scheduleView === 'instructor') values = state.snapshot.instructors.map((item) => [item.id, item.name]);
    if (state.scheduleView === 'room') values = state.snapshot.rooms.map((item) => [item.id, item.code]);
    $('#scheduleFilterValueWrap').hidden = state.scheduleView === 'all';
    select.innerHTML = `<option value="all">All</option>${values.map(([id, label]) => `<option value="${esc(id)}">${esc(label)}</option>`).join('')}`;
    select.value = values.some(([id]) => String(id) === previous) ? previous : 'all'; state.scheduleFilter = select.value;
  }

  function renderCalendar(rows) {
    const columns = days(); const byCell = new Map(); rows.forEach((row) => { const key = `${row.day_of_week}:${row.slot_id}`; if (!byCell.has(key)) byCell.set(key, []); byCell.get(key).push(row); });
    let html = '<div class="calendar-cell calendar-head">Time</div>' + columns.map(([, name]) => `<div class="calendar-cell calendar-head">${esc(name)}</div>`).join('');
    slots().forEach((slot) => { html += `<div class="calendar-cell calendar-time">${esc(slot.label)}</div>`; columns.forEach(([day]) => { const entries = byCell.get(`${day}:${slot.id}`) || []; html += `<div class="calendar-cell">${entries.map((row) => { const subject = subjectById(row.subject_id); const lab = subject?.room_type === 'LAB'; return `<div class="calendar-event ${lab ? 'lab' : ''}" title="${esc(`${row.subject_code} | ${row.time_label} | ${row.section_code} | ${row.room_code}`)}"><strong>${esc(row.subject_code)}</strong><span>${esc(row.time_label)}</span><span>${esc(row.section_code)} · ${esc(row.room_code)}</span><span>${esc(row.instructor_name)}</span></div>`; }).join('')}</div>`; }); });
    $('#calendarGrid').innerHTML = html;
  }

  const DATA_META = {
    rooms: { title: 'Rooms', singular: 'Room', headers: ['Code', 'Name', 'Capacity', 'Type', 'Features'], row: (item) => [item.code, item.name, `${item.capacity} seats`, item.room_type, (item.features || []).join(', ')], fields: roomFields },
    instructors: { title: 'Faculty', singular: 'Faculty member', headers: ['Employee no.', 'Name', 'Email', 'Max hours/day'], row: (item) => [item.employee_no, item.name, item.email || '-', `${item.max_hours_day} hours`], fields: instructorFields },
    subjects: { title: 'Subjects', singular: 'Subject', headers: ['Code', 'Name', 'Hours/week', 'Duration', 'Room type'], row: (item) => [item.code, item.name, `${item.hours_per_week} hours`, `${item.duration_slots} slot(s)`, item.room_type], fields: subjectFields },
    programs: { title: 'Programs', singular: 'Program', headers: ['Code', 'Program name'], row: (item) => [item.code, item.name], fields: programFields },
    sections: { title: 'Sections', singular: 'Section', headers: ['Code', 'Program', 'Year', 'Students'], row: (item) => [item.code, item.program_code, `Year ${item.year_level}`, item.student_count], fields: sectionFields },
    offerings: { title: 'Course offerings', singular: 'Course offering', headers: ['Subject', 'Section', 'Instructor', 'Enrollment', 'Meetings'], row: (item) => [item.subject_code, item.section_code, item.instructor_name, item.enrollment, item.required_meetings], fields: offeringFields },
    users: { title: 'Users', singular: 'User', headers: ['Username', 'Display name', 'Role', 'Assignment'], row: (item) => [item.username, item.display_name, item.role, item.instructor_name || item.section_code || '-'], fields: userFields }
  };

  function renderData() {
    if (state.dataTab === 'users' && !canAdmin()) state.dataTab = 'rooms';
    const meta = DATA_META[state.dataTab]; $('#dataTabTitle').textContent = meta.title; $('#dataTableHead').innerHTML = `<tr>${meta.headers.map((header) => `<th>${esc(header)}</th>`).join('')}<th class="manage-column">Action</th></tr>`;
    $$('.tab-button').forEach((button) => { const active = button.dataset.dataTab === state.dataTab; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)); });
    const query = state.query.toLowerCase();
    const source = (state.snapshot[state.dataTab] || []).filter((item) => !query || Object.values(item).some((value) => String(value ?? '').toLowerCase().includes(query)));
    $('#dataTableBody').innerHTML = source.length ? source.map((item) => `<tr>${meta.row(item).map((cell) => `<td>${esc(cell)}</td>`).join('')}<td class="manage-column"><div class="row-actions"><button class="button button-ghost button-small edit-record" data-entity="${state.dataTab}" data-record-id="${Number(item.id || 0)}" type="button">Edit</button><button class="button button-danger button-small delete-record" data-entity="${state.dataTab}" data-record-id="${Number(item.id || 0)}" type="button">Delete</button></div></td></tr>`).join('') : `<tr><td colspan="${meta.headers.length + 1}">${emptyState(query ? 'No matching records' : `No ${meta.title.toLowerCase()} yet`, query ? 'Try a different search term.' : 'Use “Add record” to create the first one.')}</td></tr>`;
    $$('.manage-column').forEach((cell) => { cell.hidden = !canManage(); });
    renderPendingRegistrations();
  }

  function renderPendingRegistrations() { const panel = $('#registrationReviewPanel'); if (!panel) return; panel.hidden = !canAdmin(); if (!canAdmin()) return; const rows = state.snapshot.pending_registrations || []; $('#pendingRegistrationCount').textContent = `${rows.length} pending`; $('#pendingRegistrationCount').className = `badge ${rows.length ? 'badge-warning' : 'badge-neutral'}`; $('#pendingRegistrationBody').innerHTML = rows.length ? rows.map((row) => `<tr><td><strong>${esc(row.display_name)}</strong></td><td>${esc(row.username)}</td><td>${esc(row.enrollment_ref)}</td><td>${esc(row.program_code)}</td><td>${esc(row.year_level)}</td><td>${esc(row.section_code || 'Unassigned')}</td><td><div class="row-actions"><button class="button button-primary button-small review-registration" data-registration-id="${Number(row.id)}" data-decision="APPROVE" type="button">Approve</button><button class="button button-danger button-small review-registration" data-registration-id="${Number(row.id)}" data-decision="REJECT" type="button">Reject</button></div></td></tr>`).join('') : `<tr><td colspan="7">${emptyState('No pending registrations', 'New student requests will appear here for review.')}</td></tr>`; }

  function renderReports() {
    const rows = schedules(); const roomCounts = new Map(); rows.forEach((row) => roomCounts.set(row.room_code, (roomCounts.get(row.room_code) || 0) + 1)); const max = Math.max(1, ...roomCounts.values());
    const validation = state.snapshot.validation; const metrics = [metric('Published classes', rows.length, 'Current published run'), metric('Faculty used', new Set(rows.map((row) => row.instructor_id)).size, `of ${state.snapshot.instructors.length}`), metric('Rooms used', new Set(rows.map((row) => row.room_id)).size, `of ${state.snapshot.rooms.length}`), metric('Sections covered', new Set(rows.map((row) => row.section_id)).size, `of ${state.snapshot.sections.length}`)];
    $('#reportMetricGrid').innerHTML = metrics.join('');
    $('#constraintReport').innerHTML = Object.entries(validation?.checks || {}).map(([item, passed]) => `<div class="constraint-row"><span class="constraint-status ${passed ? '' : 'health-error'}">${passed ? 'PASS' : 'FAIL'}</span><span>${esc(item.replaceAll('_', ' '))}</span></div>`).join('') || emptyState('No published run', 'Constraint evidence appears after a successful generation.');
    $('#roomReport').innerHTML = state.snapshot.rooms.length
      ? state.snapshot.rooms.map((room) => { const count = roomCounts.get(room.code) || 0; return `<div class="bar-row"><span class="bar-label" title="${esc(room.name)}">${esc(room.code)}</span><div class="bar-track"><div class="bar-fill" data-fill="${Math.round((count / max) * 100)}"></div></div><strong>${count}</strong></div>`; }).join('')
      : emptyState('No rooms configured', 'Add rooms under Academic setup to measure utilization.');
    // Widths are applied through the CSSOM: the content security policy has no
    // 'unsafe-inline', so a style="" attribute in this markup would be dropped.
    $$('#roomReport .bar-fill').forEach((bar) => { bar.style.width = `${bar.dataset.fill}%`; });
  }

  function renderSettings() {
    const terms = state.snapshot.terms; const active = terms.find((term) => Number(term.id) === Number(state.snapshot.active_term_id)) || terms[0]; if (active) { $('#academicYear').value = active.academic_year; $('#semester').value = active.semester; } $('#settingsForm').closest('.panel').hidden = !canAdmin();
  }

  function renderAll() { buildNavigation(); $$('.manage-only').forEach((element) => { element.hidden = !canManage(); }); $$('.admin-only').forEach((element) => { element.hidden = !canAdmin(); }); navigate(state.page); }

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openModal(title, fields, mode, record = {}) {
    modalMode = mode; modalRecord = record;
    modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    $('#modalTitle').textContent = title;
    $('#modalEyebrow').textContent = mode.startsWith('edit') ? 'Update record' : 'New record';
    $('#modalBody').innerHTML = `<div class="form-grid">${fields(record).join('')}</div>`;
    $('#modalBackdrop').hidden = false;
    document.body.classList.add('modal-open');
    // Land on the first field rather than the close button: reviewers fill these
    // dialogs in one pass and should be able to start typing immediately.
    const first = $(FOCUSABLE, $('#modalBody')) || $('#modalCloseButton');
    first.focus();
    if (first instanceof HTMLInputElement && first.type !== 'password') first.select();
    announce(`${title} dialog opened.`);
  }

  /* Tab must not escape an open dialog, otherwise focus walks into the page
   * behind the backdrop where nothing is clickable. */
  function trapModalFocus(event) {
    const stops = $$(FOCUSABLE, $('#modalBackdrop')).filter((element) => element.offsetParent !== null);
    if (!stops.length) return;
    const first = stops[0]; const last = stops[stops.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !$('#modalBackdrop').contains(active))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
  }

  function inputField(id, label, value, type = 'text', required = true, extra = '') { const full = /(?:^|\s)class="[^"]*\bfull\b/.test(extra); return `<div class="field${full ? ' full' : ''}"><label for="modal-${id}">${esc(label)}</label><input id="modal-${id}" name="${esc(id)}" type="${type}" value="${esc(value)}" ${required ? 'required' : ''} ${extra}></div>`; }
  function selectField(id, label, value, options, required = true) { return `<div class="field"><label for="modal-${id}">${esc(label)}</label><select id="modal-${id}" name="${esc(id)}" ${required ? 'required' : ''}>${options.map(([optionValue, optionLabel]) => `<option value="${esc(optionValue)}" ${String(optionValue) === String(value) ? 'selected' : ''}>${esc(optionLabel)}</option>`).join('')}</select></div>`; }
  function roomFields(row) { return [inputField('code','Room code',row.code || ''), inputField('name','Room name',row.name || ''), inputField('capacity','Capacity',row.capacity || '', 'number', true, 'min="1" max="5000"'), selectField('room_type','Room type',row.room_type || 'LECTURE', [['LECTURE','Lecture'],['LAB','Laboratory'],['SPECIAL','Special']]), inputField('features','Features (comma separated)',(row.features || []).join(', '), 'text', false, 'class="full"')]; }
  function instructorFields(row) { return [inputField('employee_no','Employee number',row.employee_no || ''), inputField('name','Full name',row.name || ''), inputField('email','Email',row.email || '', 'email', false), inputField('max_hours_day','Maximum hours per day',row.max_hours_day || 6, 'number', true, 'min="1" max="16"')]; }
  function subjectFields(row) { return [inputField('code','Subject code',row.code || ''), inputField('name','Subject name',row.name || ''), inputField('units','Units',row.units || 3, 'number', true, 'min="1" max="12"'), inputField('hours_per_week','Hours per week',row.hours_per_week || 2, 'number', true, 'min="1" max="40"'), inputField('duration_slots','Duration in slots',row.duration_slots || 1, 'number', true, 'min="1" max="8"'), selectField('room_type','Room type',row.room_type || 'LECTURE', [['LECTURE','Lecture'],['LAB','Laboratory'],['SPECIAL','Special']]), inputField('required_features','Required features (comma separated)',(row.required_features || []).join(', '), 'text', false, 'class="full"')]; }
  function programFields(row) { return [inputField('code','Program code',row.code || ''), inputField('name','Program name',row.name || '', 'text', true, 'class="full"')]; }
  function sectionFields(row) { return [selectField('program_id','Program',row.program_id || state.snapshot.programs[0]?.id || '', state.snapshot.programs.map((item) => [item.id, `${item.code} - ${item.name}`])), selectField('term_id','Term',row.term_id || state.snapshot.active_term_id, state.snapshot.terms.map((item) => [item.id, `${item.academic_year} - ${item.semester}`])), inputField('code','Section code',row.code || ''), inputField('year_level','Year level',row.year_level || 1, 'number', true, 'min="1" max="8"'), inputField('student_count','Student count',row.student_count || 30, 'number', true, 'min="1" max="5000"')]; }
  function offeringFields(row) { return [selectField('term_id','Term',row.term_id || state.snapshot.active_term_id, state.snapshot.terms.map((item) => [item.id, `${item.academic_year} - ${item.semester}`])), selectField('subject_id','Subject',row.subject_id || state.snapshot.subjects[0]?.id || '', state.snapshot.subjects.map((item) => [item.id, `${item.code} - ${item.name}`])), selectField('section_id','Section',row.section_id || state.snapshot.sections[0]?.id || '', state.snapshot.sections.map((item) => [item.id, item.code])), selectField('instructor_id','Instructor',row.instructor_id || state.snapshot.instructors[0]?.id || '', state.snapshot.instructors.map((item) => [item.id, item.name])), inputField('enrollment','Enrollment',row.enrollment || 30, 'number', true, 'min="1" max="5000"'), inputField('required_meetings','Meetings per week',row.required_meetings || 1, 'number', true, 'min="1" max="20"')]; }
  function userFields(row) { return [inputField('username','Username',row.username || ''), inputField('display_name','Display name',row.display_name || ''), inputField('email','Email',row.email || '', 'email', false), selectField('role','Role',row.role || 'student',[['admin','Administrator'],['scheduler','Scheduler'],['instructor','Instructor'],['student','Student']]), selectField('instructor_id','Faculty link',row.instructor_id || '', [['','Not linked'], ...state.snapshot.instructors.map((item) => [item.id,item.name])], false), selectField('section_id','Section link',row.section_id || '', [['','Not linked'], ...state.snapshot.sections.map((item) => [item.id,item.code])], false), inputField('password',row.id ? 'New password (leave blank to keep current)' : 'Temporary password','', 'password', !row.id, 'minlength="10" class="full"')]; }

  function openDataRecord(entity, id = 0) { const record = (state.snapshot[entity] || []).find((item) => Number(item.id) === Number(id)) || {}; const mode = id ? `edit-${entity}` : `create-${entity}`; const label = DATA_META[entity].singular; openModal(id ? `Edit ${label}` : `Add ${label}`, DATA_META[entity].fields, mode, record); }

  function closeModal() { const returnFocus = modalReturnFocus; $('#modalBackdrop').hidden = true; document.body.classList.remove('modal-open'); $('#modalBody').replaceChildren(); modalMode = null; modalRecord = null; modalReturnFocus = null; if (returnFocus?.isConnected) returnFocus.focus(); }

  async function submitModal(event) { event.preventDefault(); if (!modalMode) return; const entity = modalMode.replace(/^(create|edit)-/, ''); const formData = new FormData(event.currentTarget); const data = Object.fromEntries(formData.entries()); if (['rooms', 'subjects'].includes(entity)) data.features = text(data.features).split(',').map((item) => item.trim()).filter(Boolean); if (entity === 'subjects') data.required_features = text(formData.get('required_features')).split(',').map((item) => item.trim()).filter(Boolean); if (modalRecord?.id) data.id = Number(modalRecord.id); try { const result = await request('save_master', { method: 'POST', body: { entity, data } }); applySnapshot(result.snapshot); closeModal(); showToast('Saved', `${DATA_META[entity].singular} saved successfully.`); } catch (error) { showToast('Could not save', error.message, 'error'); } }

  function openScheduleEditor(entryId) { const row = schedules().find((item) => Number(item.id) === Number(entryId)); if (!row) return; const roomOptions = state.snapshot.rooms.map((item) => [item.id, `${item.code} - ${item.name}`]); const dayOptions = days(); const slotOptions = slots().map((item) => [item.id, item.label]); openModal(`Edit ${row.subject_code}`, () => [selectField('room_id','Room',row.room_id,roomOptions), selectField('day_of_week','Day',row.day_of_week,dayOptions), selectField('slot_id','Start time',row.slot_id,slotOptions)], 'edit-schedule', row); }

  async function submitScheduleEditor(event) { event.preventDefault(); const form = new FormData(event.currentTarget); try { const result = await request('save_schedule', { method: 'POST', body: { entry_id: Number(modalRecord.id), room_id: Number(form.get('room_id')), day_of_week: Number(form.get('day_of_week')), slot_id: Number(form.get('slot_id')) } }); applySnapshot(result.snapshot); closeModal(); showToast('Schedule updated', 'The entry passed hard-constraint validation.'); } catch (error) { showToast('Cannot update schedule', error.message, 'error'); } }

  async function cancelScheduleEntry(entryId) { if (!canManage() || !window.confirm('Cancel this class meeting? The published run will be marked incomplete until regenerated.')) return; try { const result = await request('delete_schedule', { method: 'POST', body: { entry_id: Number(entryId) } }); applySnapshot(result.snapshot); showToast('Class cancelled', 'The meeting was removed while the schedule history was preserved.', 'warn'); } catch (error) { showToast('Cannot cancel class', error.message, 'error'); } }

  async function generate() { const buttons = [$('#generateButton'), $('#dashboardGenerateButton')].filter(Boolean); buttons.forEach((button) => { button.disabled = true; button.textContent = 'Generating...'; }); try { const result = await request('generate', { method: 'POST', body: { term_id: state.snapshot.active_term_id } }); applySnapshot(result.snapshot); showToast('Schedule published', `${result.diagnostics.assigned_tasks} classes passed validation and were published.`); } catch (error) { const details = error.details || {}; const issue = details.preflight_issues?.[0] || details.explanations?.[0] || Object.keys(details.failures || {})[0]; const message = issue ? `${error.message} ${issue.replace(/^no_candidate:/, '')}` : error.message; showToast('Generation failed', message, 'error'); } finally { buttons.forEach((button) => { button.disabled = false; button.textContent = 'Generate schedule'; }); } }

  function exportSchedule() { window.location.href = 'api.php?action=export'; }
  function exportReport() {
    if ($('#reportExportFormat').value === 'csv') return exportSchedule();
    navigate('schedules');
    window.setTimeout(() => window.print(), 120);
  }

  async function deleteRecord(entity, id) { if (!canManage() || !window.confirm('Delete this record from the active system? Existing history will be preserved.')) return; try { const result = await request('save_master', { method: 'POST', body: { entity, id: Number(id), delete: true } }); applySnapshot(result.snapshot); showToast('Deleted', 'The record was removed from the active system. Existing history was preserved.'); } catch (error) { showToast('Cannot delete record', error.message, 'error'); } }

  async function login(event) { event.preventDefault(); const username = text($('#loginUsername').value).toLowerCase(); const password = $('#loginPassword').value; const captcha = $('#loginCaptcha').value; $('#loginError').textContent = ''; try { const result = await request('login', { method: 'POST', body: { username, password, captcha } }); updateLoginChallenge(); applySnapshot(result); showToast('Welcome', `Signed in as ${result.user.display_name}.`); if (result.security_alert?.failed_attempts) showToast('Security notice', `${result.security_alert.failed_attempts} failed login attempt${result.security_alert.failed_attempts === 1 ? '' : 's'} were recorded for this account in the last 24 hours. Change your password if this was not you.`, 'warn'); } catch (error) { $('#loginError').textContent = error.message; updateLoginChallenge(error.details || {}); (error.details?.captcha_required ? $('#loginCaptcha') : $('#loginPassword')).focus(); } }
  async function logout() { try { await request('logout', { method: 'POST', body: {} }); } catch (error) { /* session may already be gone */ } state.snapshot = null; showLogin(); }

  async function saveSettings(event) { event.preventDefault(); try { const result = await request('save_settings', { method: 'POST', body: { academic_year: $('#academicYear').value, semester: $('#semester').value } }); applySnapshot(result.snapshot); showToast('Term saved', 'The active academic term was updated.'); } catch (error) { showToast('Cannot save term', error.message, 'error'); } }
  async function changePassword(event) { event.preventDefault(); try { const result = await request('change_password', { method: 'POST', body: { current_password: $('#currentPassword').value, new_password: $('#newPassword').value, confirm_password: $('#confirmPassword').value } }); $('#passwordForm').reset(); showToast('Password changed', result.message); } catch (error) { showToast('Cannot change password', error.message, 'error'); } }

  function closeSidebar() { $('#sidebar').classList.remove('open'); $('#sidebarBackdrop').classList.remove('active'); $('#menuButton').setAttribute('aria-expanded', 'false'); }
  function toggleSidebar() { const open = $('#sidebar').classList.toggle('open'); $('#sidebarBackdrop').classList.toggle('active', open); $('#menuButton').setAttribute('aria-expanded', String(open)); }
  function isTypingIn(target) { return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)); }

  function bindEvents() {
    $('#themeToggle').addEventListener('click', toggleTheme);
    $('#refreshLoginCaptcha').addEventListener('click', refreshLoginCaptcha);
    $('#loginForm').addEventListener('submit', login); $('#registrationForm').addEventListener('submit', registerStudent); $('#showRegistrationButton').addEventListener('click', showRegistration); $('#forgotPasswordButton').addEventListener('click', showForgotPassword); $('#backToLoginButton').addEventListener('click', () => showLogin()); $('#backFromResetButton').addEventListener('click', () => showLogin()); $('#sendRegistrationOtpButton').addEventListener('click', sendRegistrationOtp); $('#sendResetOtpButton').addEventListener('click', sendResetOtp); $('#forgotPasswordForm').addEventListener('submit', resetPassword); $('#logoutButton').addEventListener('click', logout); $('#menuButton').addEventListener('click', toggleSidebar); $('#sidebarBackdrop').addEventListener('click', closeSidebar); $('#modalCloseButton').addEventListener('click', closeModal); $('#modalCancelButton').addEventListener('click', closeModal); $('#modalForm').addEventListener('submit', (event) => modalMode === 'edit-schedule' ? submitScheduleEditor(event) : submitModal(event)); $('#generateButton').addEventListener('click', generate); $('#dashboardGenerateButton').addEventListener('click', generate); $('#exportButton').addEventListener('click', exportSchedule); $('#reportExportButton').addEventListener('click', exportReport); $('#printButton').addEventListener('click', () => window.print()); $('#settingsForm').addEventListener('submit', saveSettings); $('#passwordForm').addEventListener('submit', changePassword);
    $('#globalSearch').addEventListener('input', (event) => { state.query = event.target.value; if (state.page === 'schedules') renderSchedules(); if (state.page === 'data') renderData(); }); $('#scheduleViewFilter').addEventListener('change', (event) => { state.scheduleView = event.target.value; state.scheduleFilter = 'all'; renderSchedules(); }); $('#scheduleFilterValue').addEventListener('change', (event) => { state.scheduleFilter = event.target.value; renderSchedules(); }); $('#addRecordButton').addEventListener('click', () => openDataRecord(state.dataTab));
    $('#helpBackButton').addEventListener('click', () => { if (helpIndex > 0) { helpIndex -= 1; renderHelp(); } }); $('#helpNextButton').addEventListener('click', () => { const slides = HELP_SLIDES[role()] || helpSlides; if (helpIndex < slides.length - 1) { helpIndex += 1; renderHelp(); } else navigate('dashboard'); });
    document.addEventListener('click', (event) => { const navigateButton = event.target.closest('[data-navigate]'); if (navigateButton) navigate(navigateButton.dataset.navigate); const dataTab = event.target.closest('[data-data-tab]'); if (dataTab) { state.dataTab = dataTab.dataset.dataTab; $$('.tab-button').forEach((button) => { const active = button.dataset.dataTab === state.dataTab; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)); }); renderData(); } const review = event.target.closest('.review-registration'); if (review) reviewRegistration(Number(review.dataset.registrationId), review.dataset.decision); const edit = event.target.closest('.edit-record'); if (edit) openDataRecord(edit.dataset.entity, Number(edit.dataset.recordId)); const del = event.target.closest('.delete-record'); if (del) deleteRecord(del.dataset.entity, Number(del.dataset.recordId)); const editEntry = event.target.closest('.edit-entry'); if (editEntry) openScheduleEditor(Number(editEntry.dataset.entryId)); const cancelEntry = event.target.closest('.cancel-entry'); if (cancelEntry) cancelScheduleEntry(Number(cancelEntry.dataset.entryId)); });
    document.addEventListener('keydown', (event) => {
      const modalOpen = !$('#modalBackdrop').hidden;
      if (event.key === 'Escape') { if (modalOpen) closeModal(); closeSidebar(); return; }
      if (modalOpen) { if (event.key === 'Tab') trapModalFocus(event); return; }
      // "/" jumps to the view filter, matching the hint rendered beside the field.
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingIn(event.target)) {
        const search = $('#globalSearch'); const field = search?.closest('.search-field');
        if (search && field && !field.hidden) { event.preventDefault(); search.focus(); search.select(); }
      }
    });
    $('#modalBackdrop').addEventListener('mousedown', (event) => { if (event.target === $('#modalBackdrop')) closeModal(); });
    const parallax = $('#loginParallax');
    if (parallax && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      parallax.addEventListener('pointermove', (event) => {
        const rect = parallax.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 16;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 12;
        parallax.style.setProperty('--parallax-x', `${x}px`);
        parallax.style.setProperty('--parallax-y', `${y}px`);
      });
      parallax.addEventListener('pointerleave', () => { parallax.style.setProperty('--parallax-x', '0px'); parallax.style.setProperty('--parallax-y', '0px'); });
    }
  }

  async function start() { bindEvents(); try { const result = await request('bootstrap'); if (!registrationOpen) applySnapshot(result); } catch (error) { if (error.status !== 401 && !registrationOpen) showLogin(error.message); else if (error.status === 401 && !registrationOpen) showLogin(); } }
  document.addEventListener('DOMContentLoaded', start);
})();
