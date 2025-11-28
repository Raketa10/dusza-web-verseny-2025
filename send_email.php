<?php
    session_start();
    require_once "connection.php";

    try {
        // Handling form submission
        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])){
            $email = $_POST["email"] ?? "";

            if (empty($email)){
                $_SESSION['send_email_error'] = "Minden mezőt kötelező kitölteni.";
                header("Location:index.php");
                exit();
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $_SESSION['send_email_error'] = "Nem jó email formátum.";
                header("Location:index.php");
                exit();
            }


            // Seraching for same email in verified users DB
            $statement = $connection->prepare("SELECT user_id FROM " . $_ENV["TABLE_USERS"] . " WHERE email_address = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['send_email_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("s", $email);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['send_email_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }
            $result = $statement->get_result();

            if ($result->num_rows != 0) {
                $_SESSION['send_email_error'] = "Az email-hez már van fiók rendelve.";
                header("Location:index.php");
                exit();
            }


            // Deleting record with same email from unverified users DB if it exists
            $statement = $connection->prepare("DELETE FROM " . $_ENV["TABLE_UNVERIFIED"] . " WHERE email_address = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['send_email_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("s", $email);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['send_email_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }


            // Generating email verification code
            $code = sprintf("%06d", random_int(0, 999999));

            // Insert the new unverified user into the database
            $statement = $connection->prepare("INSERT INTO " . $_ENV["TABLE_UNVERIFIED"] . " (email_address, email_verification_code) VALUES (?, ?)");
            $statement->bind_param("ss", $email, $code);
            $statement->execute();

            $connection->close();

            // Send verification email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= "From: <noreply@ma-elk.hu>" . "\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

            $subject = "Damareen e-mail hitelesítés";

            $body = <<<HTML
                <h1>Kedves leendő játékosunk!</h1>
                <p>Íme a hitelesítő kód az e-mail címedhez. Nincs más dolgod, mint kimásolni és beilleszteni a hitelesítő kód mezőbe a regisztrációs űrlapon.</p>
                <div style="font-size: 2.5rem; font-weight: bold">$code</div>
                <p>Ha nem te regisztráltál, hagyd figyelmen kívül és a fiók törölve lesz egy napon belül.</p>
            HTML;

            
            mail($email,$subject,$body,$headers);
            
            $_SESSION["form_email"] = $email;
            $_SESSION["form"] = "register";
        }
    } catch (Error | Exception $e) {
        $_SESSION['send_email_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }
    
    header("Location:index.php");
    exit();
?>