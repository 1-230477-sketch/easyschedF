<?php
declare(strict_types=1);

// Load optional local settings, such as email delivery, from an untracked .env file.
function load_local_env(): void
{
    static $loaded = false;
    if ($loaded) return;
    $loaded = true;
    $path = __DIR__ . DIRECTORY_SEPARATOR . '.env';
    if (!is_file($path)) return;
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key); $value = trim($value);
        if ($value !== '' && (($value[0] ?? '') === '"' || ($value[0] ?? '') === "'")) $value = trim($value, "\"'");
        if ($key !== '' && getenv($key) === false) putenv($key . '=' . $value);
    }
}

function db(): PDO
{
    load_local_env();
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $configuredPath = getenv('EASYSCHED_DB_PATH') ?: '';
    $databasePath = $configuredPath !== '' ? $configuredPath : (__DIR__ . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'easysched.sqlite');
    $dataDir = dirname($databasePath);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0770, true);
    }

    $pdo = new PDO('sqlite:' . $databasePath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA busy_timeout = 5000');

    $schema = file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . 'schema.sql');
    if ($schema === false) {
        throw new RuntimeException('Database schema is unavailable.');
    }
    $pdo->exec($schema);
    seed_database($pdo);
    normalize_institution_branding($pdo);
    return $pdo;
}

function normalize_institution_branding(PDO $pdo): void
{
    $stmt = $pdo->prepare("UPDATE system_settings SET setting_value = ? WHERE setting_key = 'institution_name' AND setting_value = ?");
    $stmt->execute(['New Sinai School and Colleges Sta. Rosa, Inc.', 'Sinao Colleges']);

    $demoEmails = [
        'respende@sinao.edu' => 'respende@example.invalid',
        'tuazon@sinao.edu' => 'tuazon@example.invalid',
        'guarino@sinao.edu' => 'guarino@example.invalid',
        'payos@sinao.edu' => 'payos@example.invalid',
        'santos@sinao.edu' => 'santos@example.invalid',
        'cruz@sinao.edu' => 'cruz@example.invalid',
        'admin@sinao.edu' => 'admin@example.invalid',
        'scheduler@sinao.edu' => 'scheduler@example.invalid',
        'student@sinao.edu' => 'student@example.invalid',
    ];
    foreach ($demoEmails as $oldEmail => $newEmail) {
        $updateInstructor = $pdo->prepare('UPDATE instructors SET email = ? WHERE email = ?');
        $updateInstructor->execute([$newEmail, $oldEmail]);
        $updateUser = $pdo->prepare('UPDATE users SET email = ? WHERE email = ?');
        $updateUser->execute([$newEmail, $oldEmail]);
    }
}

function db_insert_id(PDO $pdo, string $table): int
{
    return (int) $pdo->lastInsertId();
}

function seed_database(PDO $pdo): void
{
    $hasUser = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn() > 0;
    if ($hasUser) {
        return;
    }

    $pdo->beginTransaction();
    try {
        $term = $pdo->prepare('INSERT INTO academic_terms (academic_year, semester, is_active) VALUES (?, ?, 1)');
        $term->execute(['2026-2027', 'First Semester']);
        $termId = db_insert_id($pdo, 'academic_terms');

        $program = $pdo->prepare('INSERT INTO programs (code, name) VALUES (?, ?)');
        $program->execute(['BSIT', 'Bachelor of Science in Information Technology']);
        $bsit = db_insert_id($pdo, 'programs');
        $program->execute(['BSED', 'Bachelor of Secondary Education']);
        $bsed = db_insert_id($pdo, 'programs');

        $instructor = $pdo->prepare('INSERT INTO instructors (employee_no, name, email, max_hours_day) VALUES (?, ?, ?, ?)');
        $instructors = [
            ['EMP-001', 'Prof. Respende', 'respende@example.invalid', 6],
            ['EMP-002', 'Prof. Tuazon', 'tuazon@example.invalid', 6],
            ['EMP-003', 'Prof. Guarino', 'guarino@example.invalid', 6],
            ['EMP-004', 'Prof. Payos', 'payos@example.invalid', 6],
            ['EMP-005', 'Prof. Santos', 'santos@example.invalid', 6],
            ['EMP-006', 'Prof. Cruz', 'cruz@example.invalid', 6],
        ];
        $instructorIds = [];
        foreach ($instructors as $row) {
            $instructor->execute($row);
            $instructorIds[] = db_insert_id($pdo, 'instructors');
        }

        $room = $pdo->prepare('INSERT INTO rooms (code, name, capacity, room_type, features_json) VALUES (?, ?, ?, ?, ?)');
        $rooms = [
            ['COMLAB-1', 'Computer Laboratory 1', 50, 'LAB', ['Computers', 'Projector', 'Air Conditioning']],
            ['COMLAB-2', 'Computer Laboratory 2', 50, 'LAB', ['Computers', 'Projector', 'Air Conditioning']],
            ['COMLAB-3', 'Computer Laboratory 3', 40, 'LAB', ['Computers', 'Projector']],
            ['LH-A', 'Lecture Hall A', 80, 'LECTURE', ['Projector', 'Air Conditioning', 'Microphone']],
            ['LH-B', 'Lecture Hall B', 60, 'LECTURE', ['Projector', 'Air Conditioning']],
            ['ROOM-201', 'Room 201', 35, 'LECTURE', ['Projector']],
            ['ROOM-202', 'Room 202', 35, 'LECTURE', ['Projector']],
        ];
        foreach ($rooms as [$code, $name, $capacity, $type, $features]) {
            $room->execute([$code, $name, $capacity, $type, json_encode($features, JSON_THROW_ON_ERROR)]);
        }

        $slot = $pdo->prepare('INSERT INTO time_slots (code, label, start_time, end_time, slot_order) VALUES (?, ?, ?, ?, ?)');
        $slots = [
            ['S1', '7:00 AM - 9:00 AM', '07:00', '09:00', 1],
            ['S2', '9:00 AM - 11:00 AM', '09:00', '11:00', 2],
            ['S3', '11:00 AM - 1:00 PM', '11:00', '13:00', 3],
            ['S4', '1:00 PM - 3:00 PM', '13:00', '15:00', 4],
            ['S5', '3:00 PM - 5:00 PM', '15:00', '17:00', 5],
        ];
        foreach ($slots as $row) {
            $slot->execute($row);
        }

        $subject = $pdo->prepare('INSERT INTO subjects (code, name, units, hours_per_week, duration_slots, room_type, required_features_json) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $subjects = [
            ['IT-101', 'Information Assurance and Security I', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-102', 'Data Structures', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-103', 'Web Development', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-104', 'Algorithm Design', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-105', 'Object-Oriented Programming', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-106', 'Database Management', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-107', 'Computer Networks', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-108', 'Software Engineering', 3, 2, 1, 'LECTURE', ['Projector']],
            ['IT-109', 'Operating Systems', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-110', 'Mobile Development', 3, 2, 1, 'LAB', ['Computers']],
            ['IT-111', 'Discrete Mathematics', 3, 2, 1, 'LECTURE', ['Projector']],
            ['IT-112', 'Human-Computer Interaction', 3, 2, 1, 'LECTURE', ['Projector']],
        ];
        $subjectIds = [];
        foreach ($subjects as [$code, $name, $units, $hours, $duration, $type, $features]) {
            $subject->execute([$code, $name, $units, $hours, $duration, $type, json_encode($features, JSON_THROW_ON_ERROR)]);
            $subjectIds[] = db_insert_id($pdo, 'subjects');
        }

        $section = $pdo->prepare('INSERT INTO sections (program_id, term_id, code, year_level, student_count) VALUES (?, ?, ?, ?, ?)');
        $sectionRows = [
            [$bsit, $termId, 'BSIT-1A', 1, 45],
            [$bsit, $termId, 'BSIT-1B', 1, 38],
            [$bsit, $termId, 'BSIT-2A', 2, 42],
            [$bsit, $termId, 'BSIT-2B', 2, 35],
            [$bsit, $termId, 'BSIT-3A', 3, 48],
            [$bsed, $termId, 'BSED-1A', 1, 32],
        ];
        $sectionIds = [];
        foreach ($sectionRows as $row) {
            $section->execute($row);
            $sectionIds[] = db_insert_id($pdo, 'sections');
        }

        $offering = $pdo->prepare('INSERT INTO course_offerings (term_id, subject_id, section_id, instructor_id, enrollment, required_meetings) VALUES (?, ?, ?, ?, ?, ?)');
        $offeringRows = [
            [$termId, $subjectIds[0], $sectionIds[0], $instructorIds[0], 45, 1],
            [$termId, $subjectIds[1], $sectionIds[1], $instructorIds[1], 38, 1],
            [$termId, $subjectIds[2], $sectionIds[2], $instructorIds[2], 42, 1],
            [$termId, $subjectIds[3], $sectionIds[3], $instructorIds[3], 35, 1],
            [$termId, $subjectIds[4], $sectionIds[4], $instructorIds[0], 48, 1],
            [$termId, $subjectIds[5], $sectionIds[5], $instructorIds[1], 32, 1],
            [$termId, $subjectIds[6], $sectionIds[0], $instructorIds[4], 45, 1],
            [$termId, $subjectIds[7], $sectionIds[1], $instructorIds[5], 38, 1],
            [$termId, $subjectIds[8], $sectionIds[2], $instructorIds[2], 42, 1],
            [$termId, $subjectIds[9], $sectionIds[3], $instructorIds[3], 35, 1],
            [$termId, $subjectIds[10], $sectionIds[4], $instructorIds[4], 48, 1],
            [$termId, $subjectIds[11], $sectionIds[5], $instructorIds[5], 32, 1],
        ];
        foreach ($offeringRows as $row) {
            $offering->execute($row);
        }

        $user = $pdo->prepare('INSERT INTO users (username, password_hash, display_name, email, role, instructor_id, section_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $user->execute(['admin', password_hash('Admin123!', PASSWORD_DEFAULT), 'System Administrator', 'admin@example.invalid', 'admin', null, null]);
        $user->execute(['scheduler', password_hash('Scheduler123!', PASSWORD_DEFAULT), 'Scheduling Coordinator', 'scheduler@example.invalid', 'scheduler', null, null]);
        $user->execute(['instructor', password_hash('Instructor123!', PASSWORD_DEFAULT), 'Prof. Respende', 'respende@example.invalid', 'instructor', $instructorIds[0], null]);
        $user->execute(['student', password_hash('Student123!', PASSWORD_DEFAULT), 'BSIT Student', 'student@example.invalid', 'student', null, $sectionIds[0]]);

        $settings = $pdo->prepare('INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?)');
        $settings->execute(['institution_name', 'New Sinai School and Colleges Sta. Rosa, Inc.']);
        $settings->execute(['system_name', 'EasySched']);
        $settings->execute(['active_term_id', (string) $termId]);
        $settings->execute(['generation_node_limit', '100000']);

        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
}

function json_array(?string $value): array
{
    if ($value === null || $value === '') {
        return [];
    }
    $decoded = json_decode($value, true);
    return is_array($decoded) ? array_values($decoded) : [];
}

function encode_json(mixed $value): string
{
    return json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);
}
