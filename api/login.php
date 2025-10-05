<?php
// login.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once 'db.php';

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

$stmt = $mysqli->prepare("SELECT id, usuario, password FROM usuarios WHERE usuario = ? LIMIT 1");
if (!$stmt) {
    echo json_encode(['success'=>false, 'message'=>'Error interno']);
    exit;
}
$stmt->bind_param('s', $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // verificar hash
    if (password_verify($password, $row['password'])) {
        // devolvemos datos mínimos
        $user = ['id' => (int)$row['id'], 'usuario' => $row['usuario']];
        echo json_encode(['success'=>true, 'usuario'=>$user]);
    } else {
        echo json_encode(['success'=>false, 'message'=>'Contraseña incorrecta']);
    }
} else {
    echo json_encode(['success'=>false, 'message'=>'Usuario no existe']);
}

$stmt->close();
$mysqli->close();
?>
