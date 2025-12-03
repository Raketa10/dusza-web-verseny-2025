<?php
    session_start();
    require_once "connection.php";

    try{
        if ($_SERVER["REQUEST_METHOD"] == "POST"){
            $password = $_POST["password"] ?? "";
            $new_password = $_POST["new-password"] ?? "";
            $new_password_repeat = $_POST["new-password-repeat"] ?? "";

            if (!isset($_SESSION["user_id"])){
                $_SESSION['password_modify_error'] = "Nincs bejelentkezve.";
                header("Location:index.php");
                exit();
            }

            if (empty($password) || empty($new_password) || empty($new_password_repeat)){
                $_SESSION['password_modify_error'] = "Minden mezőt kötelező kitölteni.";
                header("Location:index.php");
                exit();
            }
            if ($new_password !== $new_password_repeat){
                $_SESSION['password_modify_error'] = "Az új jelszó nem egyezik.";
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

            if (strlen($new_password) < 6){
                $_SESSION['sign_in_error'] = "Az új jelszó túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($new_password) > 32){
                $_SESSION['sign_in_error'] = "Az új jelszó túl hosszú.";
                header("Location:index.php");
                exit();
            }

            $statement = $connection->prepare("SELECT password_hash FROM damareen_users WHERE username = ? AND user_id = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['password_modify_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("si", $_SESSION["username"], $_SESSION["user_id"]);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['password_modify_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }

            $result = $statement->get_result();

            if ($result->num_rows == 1){
                $user = $result->fetch_assoc();
                if (password_verify($password, $user["password_hash"])){
                    $statement = $connection->prepare("UPDATE users SET password_hash = ? WHERE user_id = ?");
                    $statement->bind_param("si",password_hash($new_password, PASSWORD_DEFAULT), $_SESSION["user_id"]);
                    $statement->execute();
                } else {
                    $_SESSION['password_modify_error'] = "Nem jó jelszó.";
                    header("Location:index.php");
                    exit();
                }
            } else {
                $_SESSION['password_modify_error'] = "Nem jó felhasználónév.";
                header("Location:index.php");
                exit();
            }
        }
    }
    catch (Error | Exception $e) {
        $_SESSION['password_modify_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }

    header("Location:index.php");
    exit();
?>