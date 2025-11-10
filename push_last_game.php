<?php
    session_start();
    require_once "connection.php";

    // Get the world JSON:
    $inputData = file_get_contents('php://input');
    // -------------------

    if(isset($_SESSION["user_id"])){
        $statement = $connection->prepare("UPDATE " . $_ENV["TABLE_USERS"] . " SET last_game_json = ? WHERE user_id = ?");
        $statement->bind_param("si", $inputData, $_SESSION["user_id"]);
        $statement->execute();
    }
?>