<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once 'db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw,true);

if(!isset($data['usuario_id']) || !isset($data['nombre']) || !isset($data['imagen'])){
    echo json_encode(['success'=>false,'message'=>'Faltan datos']);
    exit;
}

$usuario_id = (int)$data['usuario_id'];
$nombre = trim($data['nombre']);
$imagen = trim($data['imagen']);

$stmt = $mysqli->prepare("INSERT INTO figuritas (usuario_id,nombre,imagen) VALUES (?,?,?)");
$stmt->bind_param('iss',$usuario_id,$nombre,$imagen);

if($stmt->execute()){
    echo json_encode(['success'=>true,'figurita_id'=>$stmt->insert_id]);
}else{
    echo json_encode(['success'=>false,'message'=>'Error agregando figurita']);
}

$stmt->close();
$mysqli->close();
?>
