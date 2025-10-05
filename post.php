<?php
include 'db.php';

$action = $_GET['action'] ?? '';

if ($action == "get") {
    $res = $conn->query("SELECT * FROM posts ORDER BY fecha DESC");
    $posts = [];
    while($row = $res->fetch_assoc()) $posts[] = $row;
    echo json_encode($posts);
}

if ($action == "add") {
    $usuario = $_POST['usuario'];
    $avatar = $_POST['avatar'];
    $texto = $_POST['texto'];
    $figurita = $_POST['figurita'];
    $imagen = $_POST['imagen'];
    $conn->query("INSERT INTO posts(usuario,avatar,texto,figurita,imagen) 
                  VALUES('$usuario','$avatar','$texto','$figurita','$imagen')");
    echo "ok";
}
?>
