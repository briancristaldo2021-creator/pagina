<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once 'db.php';

$res = $mysqli->query("SELECT usuario,avatar,bio,puntos FROM users ORDER BY puntos DESC");
$users = [];
while($row = $res->fetch_assoc()){
    $users[] = $row;
}
echo json_encode(['success'=>true,'users'=>$users]);
$mysqli->close();
?>
