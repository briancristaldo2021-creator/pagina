<?php
header('Content-Type: application/json; charset=utf-8');
include 'db.php';
$input = json_decode(file_get_contents('php://input'), true);
$usuario = $input['usuario'] ?? ''; $puntos = intval($input['puntos'] ?? 0);
if (!$usuario) { echo json_encode(['success'=>false,'message'=>'Usuario requerido']); exit; }
$stmt = $mysqli->prepare('UPDATE usuarios SET puntos = ? WHERE usuario = ?');
$stmt->bind_param('is', $puntos, $usuario);
if ($stmt->execute()) echo json_encode(['success'=>true]); else echo json_encode(['success'=>false,'message'=>'Error']);
