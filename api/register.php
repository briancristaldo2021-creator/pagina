<?php
// register.php
header('Content-Type: application/json');
// Permitir requests desde tu dominio (o '*'). Cambialo si querés restringirlo.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once 'db.php';

// Leer JSON recibido
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!isset($data['usuario']) || !isset($data['password'])) {
    echo json_encode(['success'=>false, 'message'=>'Faltan datos']);
    exit;
}

$usuario = trim($data['usuario']);
$password = $data['password'];

if ($usuario === '' || $password === '') {
    echo json_encode(['success'=>false, 'message'=>'Usuario/contraseña vacíos']);
    exit;
}

// Hashear contraseña
$hash = password_hash($password, PASSWORD_DEFAULT);

// Prepared statement para insertar
$stmt = $mysqli->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
if (!$stmt) {
    echo json_encode(['success'=>false, 'message'=>'Error interno']);
    exit;
}
$stmt->bind_param('ss', $usuario, $hash);

if ($stmt->execute()) {
    echo json_encode(['success'=>true]);
} else {
    // Si duplicado o error
    if ($mysqli->errno === 1062) {
        echo json_encode(['success'=>false, 'message'=>'Usuario ya existe']);
    } else {
        echo json_encode(['success'=>false, 'message'=>'Error al registrar']);
    }
}
$stmt->close();
$mysqli->close();
?>
