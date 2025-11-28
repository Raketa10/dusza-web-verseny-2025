<?php
    session_start();
    require_once "connection.php";

    try{
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
            $statement = $connection->prepare("SELECT user_id FROM " . $_ENV["TABLE_USERS"] . " WHERE email_adress = ?");
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
            $statement = $connection->prepare("DELETE FROM " . $_ENV["TABLE_UNVERIFIED"] . " WHERE email_adress = ?");
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
            $statement = $connection->prepare("INSERT INTO " . $_ENV["TABLE_UNVERIFIED"] . " (email_adress, email_verification_code) VALUES (?, ?)");
            $statement->bind_param("ss", $email, $code);
            $statement->execute();

            // Send verification email
            $subject = "Damareen email hitelesítés";
            $body = "Kedves " . $username . "!\nAz emailje hitelesítéséhez a kódja: " . $code;
            $headers = "From:noreply@ma-elk.hu";
            mail($email,$subject,$body,$headers);

            echo $email;
        }
    }
    catch (Error | Exception $e) {
        $_SESSION['send_email_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }
    
    header("Location:index.php");
    exit();
?>