<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once '../db.php';

if($_SERVER['REQUEST_METHOD']==='POST'){
    $usuario = $_POST['usuario'] ?? '';
    $avatar  = $_POST['avatar'] ?? '';
    $texto   = $_POST['texto'] ?? '';
    if($usuario && $texto){
        $stmt=$mysqli->prepare("INSERT INTO chat (usuario,avatar,texto) VALUES (?,?,?)");
        $stmt->bind_param("sss",$usuario,$avatar,$texto);
        $stmt->execute();
        $stmt->close();
    }
}

$res=$mysqli->query("SELECT * FROM chat ORDER BY id ASC");
$chats=[];
while($r=$res->fetch_assoc()) $chats[]=$r;
$mysqli->close();
echo json_encode($chats);
?>
