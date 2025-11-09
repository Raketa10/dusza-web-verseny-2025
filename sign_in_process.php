<?php
    session_start();
    require_once "connection.php";

    try{
        if ($_SERVER["REQUEST_METHOD"] == "POST"){
            $username = $_POST["username"] ?? "";
            $password = $_POST["password"] ?? "";
            $password_repeat = $_POST["password-repeat"] ?? "";

            if (empty($username) || empty($password) || empty($password_repeat)){
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

            if (strlen($password) < 5){
                $_SESSION['sign_in_error'] = "A jelszó túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($password) > 32){
                $_SESSION['sign_in_error'] = "A jelszó túl hosszú.";
                header("Location:index.php");
                exit();
            }

            // Seraching for same username in DB
            $statement = $connection->prepare("SELECT user_id FROM users WHERE username = ?");
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

            // Insert the new user into the database
            $statement = $connection->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
            $statement->bind_param("ss", $username, password_hash($password, PASSWORD_DEFAULT));
            $statement->execute();

            // Set up session for the logged-in user
            $_SESSION["user_id"] = $connection->insert_id; // Get the last inserted user ID
            $_SESSION["username"] = $username;
            $_SESSION["user_registration_date"] = date('Y-m-d H:i:s');
        }
    }
    catch (Error | Exception $e) {
        $_SESSION['sign_in_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }
?>