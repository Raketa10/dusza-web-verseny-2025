<?php
    session_start();
    require_once "connection.php";

    try{
        // Handling form submission
        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])){
            $username = $_POST["username"] ?? "";
            $password = $_POST["password"] ?? "";

            if (empty($username) || empty($password)){
                $_SESSION['login_error'] = "Minden mezőt kötelező kitölteni.";
                header("Location:index.php");
                exit();
            }
            
            if (strlen($username) < 4){
                $_SESSION['login_error'] = "A felhasználónév túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($username) > 32){
                $_SESSION['login_error'] = "A felhasználónév túl hosszú.";
                header("Location:index.php");
                exit();
            }

            if (strlen($password) < 6){
                $_SESSION['login_error'] = "A jelszó túl rövid.";
                header("Location:index.php");
                exit();
            } elseif (strlen($password) > 32){
                $_SESSION['login_error'] = "A jelszó túl hosszú.";
                header("Location:index.php");
                exit();
            }


            // Querying the user from DB
            $statement = $connection->prepare("SELECT user_id, username, email_address, password_hash, registration_date FROM " . $_ENV["TABLE_USERS"] . " WHERE username = ?");
            if ($statement === false) {
                // Check if prepare() fails
                $_SESSION['login_error'] = "Hiba történt a lekérdezés előkészítése során: " . $connection->error;
                header("Location: index.php");
                exit();
            }
            $statement->bind_param("s", $username);
            $execution_result = $statement->execute();
            if ($execution_result === false) {
                // Check if execution fails
                $_SESSION['login_error'] = "Hiba történt a lekérdezés végrehajtása során: " . $statement->error;
                header("Location: index.php");
                exit();
            }

            $result = $statement->get_result();

            if ($result->num_rows == 1){
                $user = $result->fetch_assoc();
                if (password_verify($password, $user["password_hash"])){
                    $_SESSION["user_id"] = $user["user_id"];
                    $_SESSION["username"] = $user["username"];
                    $_SESSION["user_email"] = $user["email_address"];
                    $_SESSION["user_registration_date"] = $user["registration_date"];
                } else {
                    $_SESSION['login_error'] = "Nem jó felhasználónév vagy jelszó.";
                    header("Location:index.php");
                    exit();
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