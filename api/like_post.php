<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once '../db.php';

$id = $_POST['id'] ?? 0;
$id = (int)$id;
if(!$id) { echo json_encode(['status'=>'error']); exit; }

$stmt = $mysqli->prepare("UPDATE posts SET likes = likes + 1 WHERE id=?");
$stmt->bind_param('i',$id);
$stmt->execute();
$stmt->close();
$mysqli->close();
echo json_encode(['status'=>'ok']);
?>
