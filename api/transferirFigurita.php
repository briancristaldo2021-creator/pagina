<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once 'db.php';

$raw=file_get_contents('php://input');
$data=json_decode($raw,true);

if(!isset($data['de_id']) || !isset($data['a_usuario']) || !isset($data['figurita_id'])){
    echo json_encode(['success'=>false,'message'=>'Faltan datos']);
    exit;
}

$de_id = (int)$data['de_id'];
$figurita_id = (int)$data['figurita_id'];
$a_usuario = trim($data['a_usuario']);

// Buscar ID receptor
$stmt = $mysqli->prepare("SELECT id FROM usuarios WHERE usuario=?");
$stmt->bind_param('s',$a_usuario);
$stmt->execute();
$result=$stmt->get_result();
if($result->num_rows===0){ echo json_encode(['success'=>false,'message'=>'Usuario receptor no existe']); exit; }
$to_id = $result->fetch_assoc()['id'];

// Actualizar dueño de figurita
$stmt2 = $mysqli->prepare("UPDATE figuritas SET usuario_id=? WHERE id=? AND usuario_id=?");
$stmt2->bind_param('iii',$to_id,$figurita_id,$de_id);
if($stmt2->execute() && $stmt2->affected_rows>0) echo json_encode(['success'=>true]);
else echo json_encode(['success'=>false,'message'=>'Error transfiriendo figurita']);

$stmt->close();
$stmt2->close();
$mysqli->close();
?>
