<?php
header('Content-Type: application/json; charset=utf-8');
include 'db.php';
$input = json_decode(file_get_contents('php://input'), true);
$usuario = $input['usuario'] ?? ''; $mensaje = $input['mensaje'] ?? '';
if (!$usuario || !$mensaje) { echo json_encode(['success'=>false,'message'=>'Faltan datos']); exit; }
$stmt = $mysqli->prepare('SELECT id FROM usuarios WHERE usuario = ? LIMIT 1'); $stmt->bind_param('s',$usuario); $stmt->execute(); $res=$stmt->get_result();
if (!$u = $res->fetch_assoc()) { echo json_encode(['success'=>false,'message'=>'Usuario no existe']); exit; }
$uid = $u['id']; $stmt = $mysqli->prepare('INSERT INTO chat (usuario_id, mensaje) VALUES (?,?)'); $stmt->bind_param('is',$uid,$mensaje); $stmt->execute();
echo json_encode(['success'=>true,'message'=>'Mensaje enviado']);
