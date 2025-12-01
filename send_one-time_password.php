<?php
    session_start();
    require_once "connection.php";

    try {
        // Handling form submission
        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])){
            $email = $_POST["email"] ?? "";

            if (empty($email)){
                $_SESSION['one-time_password_error'] = "Minden mezőt kötelező kitölteni.";
                header("Location:index.php");
                exit();
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $_SESSION['one-time_password_error'] = "Nem jó email formátum.";
                header("Location:index.php");
                exit();
            }


            // Seraching for same email in verified users DB
            $statement = $connection->prepare("SELECT user_id FROM " . $_ENV["TABLE_USERS"] . " WHERE email_address = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['one-time_password_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("s", $email);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['one-time_password_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }
            $result = $statement->get_result();

            if ($result->num_rows == 1) {
                // Generating one-time password
                $code = sprintf("%06d", random_int(0, 999999));

                // Insert one-time password in the user record
                $statement = $connection->prepare("UPDATE " . $_ENV["TABLE_USERS"] . " SET one_time_password = ?, OPT_date = CURRENT_TIMESTAMP() WHERE email_address = ?");
                $statement->bind_param("ss", $code, $email);
                $statement->execute();

                $connection->close();

                // Send one-time password email
                $headers = "MIME-Version: 1.0" . "\r\n";
                $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                $headers .= "From: <noreply@ma-elk.hu>" . "\r\n";
                $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

                $subject = "Damareen egyszer használatos jelszó";

                $body = <<<HTML
                    <h1>Kedves felhasználó!</h1>
                    <p>Íme az egyszer használatos jelszava. Ezzel a jelszóval be tud jelentkezni fiókjába.</p>
                    <div style="font-size: 2.5rem; font-weight: bold">$code</div>
                    <h2>Ezt a kódot soha ne adja meg máshol, mint a hivatalos Damareen weboldalon</h2>
                    <p>Ha nem ön kérte ezt a jelszót, hagyja figyelmen kívül ezt az emailt és az egszer használatos jelszó le fog járni egy nap múlva.</p>
                HTML;

                mail($email,$subject,$body,$headers);
            }
        }
    } catch (Error | Exception $e) {
        $_SESSION['one-time_password_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }
    
    header("Location:index.php");
    exit();
?>