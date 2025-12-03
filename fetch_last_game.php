<?php
    session_start();
    require_once "connection.php";

    if(!isset($_SESSION["user_id"])){
        echo json_encode([]);
    }
    else{
        $statement = $connection->prepare("SELECT last_game_json FROM damareen_users WHERE user_id = ?");
        $statement->bind_param("i", $_SESSION["user_id"]);
        $statement->execute();

        $result = $statement->get_result();

        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            echo json_encode($row["last_game_json"]);
        }
    }
?>