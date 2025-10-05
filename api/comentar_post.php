<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once '../db.php';

$post_id = $_POST['post_id'] ?? 0;
$usuario = $_POST['usuario'] ?? '';
$avatar  = $_POST['avatar'] ?? '';
$texto   = $_POST['texto'] ?? '';

$post_id = (int)$post_id;
if(!$post_id || !$usuario || !$texto){ echo json_encode(['status'=>'error']); exit; }

$stmt = $mysqli->prepare("INSERT INTO comentarios (post_id,usuario,avatar,texto) VALUES (?,?,?,?)");
$stmt->bind_param("isss",$post_id,$usuario,$avatar,$texto);
$stmt->execute();
$stmt->close();
$mysqli->close();
echo json_encode(['status'=>'ok']);
?>
