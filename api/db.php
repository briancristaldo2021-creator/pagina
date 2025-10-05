<?php
$host = "sql300.infinityfree.com";
$usuario = "if0_40069784";
$clave = "zktGDR22TUB";
$bd = "if0_40069784_XXX";

$mysqli = new mysqli($host, $usuario, $clave, $bd);
if ($mysqli->connect_error) {
    die(json_encode(['success'=>false,'message'=>'Error de conexión: '.$mysqli->connect_error]));
}
$mysqli->set_charset("utf8mb4");
?>
