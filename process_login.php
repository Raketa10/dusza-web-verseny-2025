<?php
    session_start();
    require_once "connection.php";

    try{
        if ($_SERVER["REQUEST_METHOD"] == "POST"){
            $username = $_POST["username"] ?? "";
            $password = $_POST["password"] ?? "";

            if (empty($username) || empty($password)){
                $_SESSION['login_error'] = "Minden mezőt kötelező kitölteni.";
                header("Location:index.php");
                exit();
            }
        

            $statement = $connection->prepare("SELECT user_id, username, password_hash, registration_date FROM users WHERE username = ?");
            $statement->bind_param("s", $username);
            $statement->execute();

            $result = $statement->get_result();

            if ($result->num_rows == 1){
                $user = $result->fetch_assoc();
                if (password_verify($password, $user["password_hash"])){
                    $_SESSION["user_id"] = $user["user_id"];
                    $_SESSION["username"] = $user["username"];
                    $_SESSION["user_registration_date"] = $user["registration_date"];
                }
            } else {
                $_SESSION['login_error'] = "Nem jó felhasználónév vagy jelszó.";
                header("Location:index.php");
                exit();
            }
        }
    } catch (Error | Exception $e) {
        $_SESSION['login_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }

    header("Location:index.php");
    exit();
?>