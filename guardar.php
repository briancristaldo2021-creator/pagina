<?php
header('Content-Type: application/json');

// Archivo de datos
$archivo = 'datos.json';

// Leer mensajes existentes
$mensajes = json_decode(file_get_contents($archivo), true);

// Recibir nuevo mensaje por POST
if(isset($_POST['mensaje']) && $_POST['mensaje'] != "") {
    $nuevo = [
        "mensaje" => $_POST['mensaje'],
        "fecha" => date("H:i:s")
    ];
    $mensajes[] = $nuevo;
    file_put_contents($archivo, json_encode($mensajes));
}

echo json_encode($mensajes);
?>
