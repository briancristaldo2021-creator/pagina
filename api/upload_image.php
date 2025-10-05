<?php
header('Content-Type: application/json; charset=utf-8');
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
if (empty($_FILES['file'])) { echo json_encode(['success'=>false,'message'=>'No file uploaded']); exit; }
$file = $_FILES['file'];
$allowed = ['image/jpeg','image/png','image/gif','image/webp'];
if (!in_array($file['type'], $allowed)) { echo json_encode(['success'=>false,'message'=>'Tipo no permitido']); exit; }
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$fn = uniqid('img_', true) . '.' . $ext;
$dest = $uploadDir . $fn;
if (move_uploaded_file($file['tmp_name'], $dest)) {
    $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/uploads/' . $fn;
    echo json_encode(['success'=>true,'url'=>$url]);
} else echo json_encode(['success'=>false,'message'=>'Error saving file']);
