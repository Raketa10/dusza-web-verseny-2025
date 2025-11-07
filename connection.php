<?php
    $server = "localhost";
    $user = "phpmyadmin";
    $password = "3EmPDciR";
    $database = "damareen";

    $connection = new mysqli($server, $user, $password, $database);

    if ($connection -> connect_error){
        die("Error occured while connecting to the database: ".$connection -> connect_error);
    }
?>