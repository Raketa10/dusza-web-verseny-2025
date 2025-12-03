<?php
    session_start();
    require_once "connection.php";

    try{
        if ($_SERVER["REQUEST_METHOD"] == "POST"){
            $username = $_POST["username"] ?? "";
            $password = $_POST["password"] ?? "";

            if (!isset($_SESSION["user_id"])){
                $_SESSION['account_delete_error'] = "Nincs bejelentkezve.";
                header("Location:index.php");
                exit();
            }

            if ($username !== $_SESSION["username"]){
                $_SESSION['account_delete_error'] = "Nem ebbe a fiókba van bejelentkezve.";
                header("Location:index.php");
                exit();
            }

            if (empty($username) || empty($password)){
                $_SESSION['account_delete_error'] = "Minden mezőt kötelező kitölteni.";
                header("Location:index.php");
                exit();
            }
            
            if (strlen($username) < 4){
                $_SESSION['account_delete_error'] = "A felhasználónév túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($username) > 32){
                $_SESSION['account_delete_error'] = "A felhasználónév túl hosszú.";
                header("Location:index.php");
                exit();
            }

            if (strlen($password) < 6){
                $_SESSION['account_delete_error'] = "A jelszó túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($password) > 32){
                $_SESSION['account_delete_error'] = "A jelszó túl hosszú.";
                header("Location:index.php");
                exit();
            }

            $statement = $connection->prepare("SELECT password_hash FROM damareen_users WHERE username = ? AND user_id = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['account_delete_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("si", $username, $_SESSION["user_id"]);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['account_delete_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }

            $result = $statement->get_result();

            if ($result->num_rows == 1){
                $user = $result->fetch_assoc();
                if (password_verify($password, $user["password_hash"])){
                    $statement = $connection->prepare("DELETE FROM damareen_users WHERE user_id = ? AND username = ?");
                    $statement->bind_param("is", $_SESSION["user_id"], $username);
                    $statement->execute();
                    session_start();
                    session_unset();
                    session_destroy();
                    // Remove the session cookie if it exists
                    if (ini_get("session.use_cookies")) {
                        $params = session_get_cookie_params();
                        setcookie(session_name(), '', time() - 42000, 
                            $params["path"], 
                            $params["domain"], 
                            $params["secure"], 
                            $params["httponly"]
                        );
                    }
                } else {
                    $_SESSION['account_delete_error'] = "Nem jó jelszó.";
                    header("Location:index.php");
                    exit();
                }
            } else {
                $_SESSION['account_delete_error'] = "Nem jó felhasználónév.";
                header("Location:index.php");
                exit();
            }
        }
    } catch (Error | Exception $e) {
        $_SESSION['account_delete_error'] = 'Váratlan hiba: ' .$e->getMessage();
        header("Location:index.php");
        exit();
    }

    header("Location:index.php");
    exit();
?>