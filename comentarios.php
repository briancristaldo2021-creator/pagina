<?php
include 'db.php';

$action = $_GET['action'] ?? '';

if ($action == "get") {
    $post_id = $_GET['post_id'];
    $res = $conn->query("SELECT * FROM comentarios WHERE post_id=$post_id ORDER BY fecha ASC");
    $comentarios = [];
    while($row = $res->fetch_assoc()) $comentarios[] = $row;
    echo json_encode($comentarios);
}

if ($action == "add") {
    $post_id = $_POST['post_id'];
    $usuario = $_POST['usuario'];
    $avatar = $_POST['avatar'];
    $texto = $_POST['texto'];
    $conn->query("INSERT INTO comentarios(post_id,usuario,avatar,texto) 
                  VALUES($post_id,'$usuario','$avatar','$texto')");
    echo "ok";
}
?>
