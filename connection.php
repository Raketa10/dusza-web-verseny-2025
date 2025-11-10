<?php
    require_once "dotenv_parser.php";
    loadEnv();

    $server = $_ENV["DB_HOST"];
    $user = $_ENV["DB_USER"];
    $password = $_ENV["DB_PASS"];
    $database = $_ENV["DB_NAME"];

    $connection = new mysqli($server, $user, $password, $database);

    if ($connection -> connect_error){
        die("Error occured while connecting to the database: ".$connection -> connect_error);
    }
?>