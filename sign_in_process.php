<?php
    session_start();
    require_once "connection.php";

    try{
        // Handling form submission
        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])){
            $username = $_POST["username"] ?? "";
            $email = $_POST["email"] ?? "";
            $email_verification_code = $_POST["email-verification-code"] ?? "";
            $password = $_POST["password"] ?? "";
            $password_repeat = $_POST["password-repeat"] ?? "";

            if (empty($username)|| empty($email) || empty($password) || empty($password_repeat) || empty($email_verification_code)){
                $_SESSION['sign_in_error'] = "Minden mezőt kötelező kitölteni.";
                header("Location:index.php");
                exit();
            }
            if ($password !== $password_repeat){
                $_SESSION['sign_in_error'] = "A jelszó nem egyezik.";
                header("Location:index.php");
                exit();
            }

            if (strlen($username) < 4){
                $_SESSION['sign_in_error'] = "A felhasználónév túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($username) > 32){
                $_SESSION['sign_in_error'] = "A felhasználónév túl hosszú.";
                header("Location:index.php");
                exit();
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $_SESSION['sign_in_error'] = "Nem jó email formátum.";
                header("Location:index.php");
                exit();
            }

            if (!preg_match('/^\d{6}$/', $email_verification_code)) {
                $_SESSION['sign_in_error'] = "Nem jó email hitelesítő kód formátum.";
                header("Location:index.php");
                exit();
            }

            if (strlen($password) < 6){
                $_SESSION['sign_in_error'] = "A jelszó túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($password) > 32){
                $_SESSION['sign_in_error'] = "A jelszó túl hosszú.";
                header("Location:index.php");
                exit();
            }


            // Seraching for same username in DB
            $statement = $connection->prepare("SELECT user_id FROM " . $_ENV["TABLE_USERS"] . " WHERE username = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['sign_in_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("s", $username);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['sign_in_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }
            $result = $statement->get_result();

            if ($result->num_rows != 0) {
                $_SESSION['sign_in_error'] = "A felhasználónév már létezik.";
                header("Location:index.php");
                exit();
            }

            // Seraching for email verification code in unverified users DB
            $statement = $connection->prepare("SELECT email_verification_code FROM " . $_ENV["TABLE_UNVERIFIED"] . " WHERE email_adress = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['sign_in_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("s", $email);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['sign_in_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }

            $result = $statement->get_result();

            if ($result->num_rows == 1){
                $sql_output = $result->fetch_assoc();
                if ($email_verification_code === $sql_output["email_verification_code"]){
                    // Insert the new user into the database
                    $statement = $connection->prepare("INSERT INTO " . $_ENV["TABLE_USERS"] . " (username, email, password_hash) VALUES (?, ?, ?)");
                    $statement->bind_param("sss", $username, $email, password_hash($password, PASSWORD_DEFAULT));
                    $statement->execute();

                    // Set up session for the logged-in user
                    $_SESSION["user_id"] = $connection->insert_id; // Get the last inserted user ID
                    $_SESSION["username"] = $username;
                    $_SESSION["user_email"] = $email;
                    $_SESSION["user_registration_date"] = date('Y-m-d H:i:s');
                } else {
                    $_SESSION['sign_in_error'] = "Nem jó email hitelesítő kód.";
                    header("Location:index.php");
                    exit();
                }
            } else {
                $_SESSION['sign_in_error'] = "Nem jó emailcím.";
                header("Location:index.php");
                exit();
            }
        }
    }
    catch (Error | Exception $e) {
        $_SESSION['sign_in_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }
    
    header("Location:index.php");
    exit();
?>