<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once '../db.php';

$usuario = $_POST['usuario'] ?? '';
$avatar  = $_POST['avatar'] ?? '';
$texto   = $_POST['texto'] ?? '';
$figurita= $_POST['figurita'] ?? '';
$imagen  = $_POST['imagen'] ?? '';

if(!$usuario) { echo json_encode(['status'=>'error','msg'=>'Usuario requerido']); exit; }

$stmt = $mysqli->prepare("INSERT INTO posts (usuario,avatar,texto,figurita,imagen) VALUES (?,?,?,?,?)");
$stmt->bind_param("sssss",$usuario,$avatar,$texto,$figurita,$imagen);
if($stmt->execute()) echo json_encode(['status'=>'ok']);
else echo json_encode(['status'=>'error','msg'=>'Error guardando post']);
$stmt->close();
$mysqli->close();
?>
