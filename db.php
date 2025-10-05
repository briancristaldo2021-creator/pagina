<?php
$host = "sql300.infinityfree.com"; 
$user = "if0_40069784";    
$pass = "zktGDR22TUB";    
$db   = "if0_40069784_XXX"; // 👈 Cambiá XXX por el nombre real de la DB que te aparece en el panel

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}
?>
