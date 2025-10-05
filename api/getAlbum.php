<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once 'db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if(!isset($data['usuario_id'])){
    echo json_encode(['success'=>false,'message'=>'Usuario no definido']);
    exit;
}
$usuario_id = (int)$data['usuario_id'];

$stmt = $mysqli->prepare("SELECT id, nombre, imagen FROM figuritas WHERE usuario_id=?");
$stmt->bind_param('i',$usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$figuritas = [];
while($row=$result->fetch_assoc()) $figuritas[] = $row;

$stmt->close();
$mysqli->close();
echo json_encode(['success'=>true,'figuritas'=>$figuritas]);
?>
