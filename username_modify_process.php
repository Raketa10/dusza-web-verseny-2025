<?php
    session_start();
    require_once "connection.php";

    try{
        if ($_SERVER["REQUEST_METHOD"] == "POST"){
            $new_username = $_POST["new-username"] ?? "";
            $password = $_POST["password"] ?? "";

            if (!isset($_SESSION["user_id"])){
                $_SESSION['username_modify_error'] = "Nincs bejelentkezve.";
                header("Location:index.php");
                exit();
            }

            if (empty($new_username) || empty($password)){
                $_SESSION['username_modify_error'] = "Minden mezőt kötelező kitölteni.";
                header("Location:index.php");
                exit();
            }
            
            if (strlen($new_username) < 4){
                $_SESSION['username_modify_error'] = "A felhasználónév túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($new_username) > 32){
                $_SESSION['username_modify_error'] = "A felhasználónév túl hosszú.";
                header("Location:index.php");
                exit();
            }

            if (strlen($password) < 6){
                $_SESSION['username_modify_error'] = "A jelszó túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($password) > 32){
                $_SESSION['username_modify_error'] = "A jelszó túl hosszú.";
                header("Location:index.php");
                exit();
            }

            $statement = $connection->prepare("SELECT password_hash FROM users WHERE username = ? AND user_id = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['username_modify_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("si", $_SESSION["username"], $_SESSION["user_id"]);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['username_modify_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }

            $result = $statement->get_result();

            if ($result->num_rows == 1){
                $user = $result->fetch_assoc();
                if (password_verify($password, $user["password_hash"])){
                    $statement = $connection->prepare("UPDATE users SET username = ? WHERE user_id = ?");
                    $statement->bind_param("si", $new_username, $_SESSION["user_id"]);
                    $statement->execute();
                } else {
                    $_SESSION['username_modify_error'] = "Nem jó jelszó.";
                    header("Location:index.php");
                    exit();
                }
            } else {
                $_SESSION['username_modify_error'] = "Nem jó felhasználónév.";
                header("Location:index.php");
                exit();
            }
        }
    } catch (Error | Exception $e) {
        $_SESSION['username_modify_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }

    header("Location:index.php");
    exit();
?>