<?php
    session_start();
    require_once "connection.php";

    // Get the world JSON:
    $inputData = file_get_contents('php://input');
    
    $world = json_decode($inputData, true); // Decode the JSON data into a PHP array (or object)
    // -------------------

    if(isset($_SESSION["user_id"])){
        $statement = $connection->prepare("SELECT * FROM worlds WHERE world_id = ? AND user_id = ?");
        $statement->bind_param("ii", $_SESSION["user_id"], $world->id);
        $statement->execute();

        $result = $statement->get_result();
        
        if ($result->num_rows > 0) {
            $statement = $connection->prepare("UPDATE name = ?, cards_json = ?, casemates_json = ? WHERE world_id = ? AND user_id = ?");
            $statement->bind_param("sssii", $world->name, $world->cards, $world->casemates, $_SESSION["user_id"], $world->id);
            $statement->execute();
        } else{
            $statement = $connection->prepare("INSERT INTO worlds (world_id, name, cards_json, casemates_json, user_id) VALUES(?, ?, ?, ?, ?)");
            $statement->bind_param("isssi", $world->id, $world->name, $world->cards, $world->casemates, $_SESSION["user_id"]);
            $statement->execute();
        }
    }
?>