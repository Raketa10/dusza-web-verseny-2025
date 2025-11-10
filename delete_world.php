<?php
    session_start();
    require_once "connection.php";

    // Get the world JSON:
    $inputData = file_get_contents('php://input');
    
    $world = json_decode($inputData, true); // Decode the JSON data into a PHP array (or object)
    // -------------------

    if(isset($_SESSION["user_id"])){
        $statement = $connection->prepare("DELETE FROM " . $_ENV["TABLE_WORLDS"] . " WHERE world_id = ? AND user_id = ?;");
        $statement->bind_param("ii", $world['id'],  $_SESSION["user_id"]);
        $statement->execute();
    }
?>