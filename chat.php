<?php
include 'db.php';

$action = $_GET['action'] ?? '';

if ($action == "get") {
    $res = $conn->query("SELECT * FROM chat ORDER BY fecha ASC");
    $mensajes = [];
    while($row = $res->fetch_assoc()) $mensajes[] = $row;
    echo json_encode($mensajes);
}

if ($action == "add") {
    $usuario = $_POST['usuario'];
    $avatar = $_POST['avatar'];
    $texto = $_POST['texto'];
    $conn->query("INSERT INTO chat(usuario,avatar,texto) 
                  VALUES('$usuario','$avatar','$texto')");
    echo "ok";
}
?>
