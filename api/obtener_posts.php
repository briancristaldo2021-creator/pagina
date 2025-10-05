<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require_once '../db.php';

$filter = $_GET['filter'] ?? '';
$sql = "SELECT * FROM posts WHERE usuario LIKE ? OR texto LIKE ? ORDER BY id DESC";
$likeFilter = "%$filter%";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ss", $likeFilter, $likeFilter);
$stmt->execute();
$result = $stmt->get_result();

$posts = [];
while($row = $result->fetch_assoc()){
    $stmtC = $mysqli->prepare("SELECT usuario,avatar,texto FROM comentarios WHERE post_id=? ORDER BY id ASC");
    $stmtC->bind_param('i',$row['id']);
    $stmtC->execute();
    $resC = $stmtC->get_result();
    $comentarios=[];
    while($c = $resC->fetch_assoc()) $comentarios[]=$c;
    $row['comentarios']=$comentarios;
    $posts[]=$row;
}

echo json_encode($posts);
$stmt->close();
$mysqli->close();
?>
