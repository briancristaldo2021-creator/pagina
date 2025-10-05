<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once 'db.php';

$raw=file_get_contents('php://input');
$data=json_decode($raw,true);

if(!isset($data['usuario_id'])){ echo json_encode(['success'=>false,'message'=>'Usuario no definido']); exit; }

$usuario_id = (int)$data['usuario_id'];
$nombre = $data['nombre'] ?? '';
$clave = $data['clave'] ?? '';
$avatar = $data['avatar'] ?? '';
$bio = $data['bio'] ?? '';
$publico = isset($data['publico']) ? (int)$data['publico'] : 0;

$set_sql = "nombre=?, avatar=?, publico=?, bio=?";
$params = [$nombre,$avatar,$publico,$bio];
$types = "ssii";

if($clave!==''){
    $claveHash = password_hash($clave, PASSWORD_DEFAULT);
    $set_sql .= ", clave=?";
    $params[] = $claveHash;
    $types .= "s";
}

$stmt = $mysqli->prepare("UPDATE usuarios SET $set_sql WHERE id=?");
$params[] = $usuario_id;
$types .= "i";

$stmt->bind_param($types,...$params);

if($stmt->execute()) echo json_encode(['success'=>true]);
else echo json_encode(['success'=>false,'message'=>'Error actualizando perfil']);

$stmt->close();
$mysqli->close();
?>
