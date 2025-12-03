<?php

/**
 * Basic function to load variables from a .env file into $_ENV and $_SERVER.
 * @param string $path Path to the .env file, defaults to the current directory.
 * @return bool Returns true if the file was successfully loaded, false otherwise.
 */
function loadEnv($path = __DIR__ . '/.env') {
    if (!file_exists($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {

        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            // Remove quotes if they exist (simple handling for single or double quotes)
            $value = trim($value, '"\'');

            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
    return true;
}

?>