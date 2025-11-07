<?php
    session_start();
    require_once "connection.php";

    if(!isset($_SESSION["user_id"])){
        echo "[]";
    }
    else{
        $statement = $connection->prepare("SELECT * FROM worlds WHERE user_id = ?");
        $statement->bind_param("s", $_SESSION["user_id"]);
        $statement->execute();

        $result = $statement->get_result();

        if ($result->num_rows > 0) {
            $worlds = [];
        while ($row = $result->fetch_assoc()) {
            // Prepare world data
            $world = [
                'id' => $row['world_id'],
                'name' => $row['name'],
                'cards' => json_decode($row['cards_json'], true), // Decode JSON if needed
                'casemates' => json_decode($row['casemates_json'], true) // Decode JSON if needed
            ];

            // Add world to the result array
            $worlds[] = $world;
        }

        // Output the JSON-encoded data
        echo json_encode($worlds);
        }
        else{
            echo "[]";
        }
    }
?>