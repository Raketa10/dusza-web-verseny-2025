<?php
    session_start();
    require_once "connection.php";

    // Get the world JSON:
    $inputData = file_get_contents('php://input');
    
    $world = json_decode($inputData, true); // Decode the JSON data into a PHP array (or object)
    // -------------------

    if(isset($_SESSION["user_id"])){
        $statement = $connection->prepare("SELECT * FROM " . $_ENV["TABLE_WORLDS"] . " WHERE world_id = ? AND user_id = ?");
        $statement->bind_param("ii", $world['id'], $_SESSION["user_id"]);
        $statement->execute();

        $result = $statement->get_result();
        
        if ($result->num_rows > 0) {
            $statement = $connection->prepare("UPDATE " . $_ENV["TABLE_WORLDS"] . " SET name = ?, cards_json = ?, casemates_json = ?, collection_json = ? WHERE world_id = ? AND user_id = ?");
            $statement->bind_param("ssssii", $world['name'], json_encode($world['cards']), json_encode($world['casemates']), json_encode($world['collections']), $world['id'],  $_SESSION["user_id"]);
            $statement->execute();
        } else{
            $statement = $connection->prepare("INSERT INTO " . $_ENV["TABLE_WORLDS"] . " (world_id, name, cards_json, casemates_json, collection_json, user_id) VALUES(?, ?, ?, ?, ?, ?)");
            $statement->bind_param("issssi", $world['id'], $world['name'], json_encode($world['cards']), json_encode($world['casemates']), json_encode($world['collections']), $_SESSION["user_id"]);
            $statement->execute();
        }
    }
?>