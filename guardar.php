<?php
header('Content-Type: application/json; charset=utf-8');

// archivo de datos
$archivo = 'datos.json';

// crear archivo si no existe
if(!file_exists($archivo)){
    file_put_contents($archivo, json_encode(['posts'=>[], 'chats'=>[]], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

// leer datos (con manejo simple de errores)
$raw = @file_get_contents($archivo);
$data = json_decode($raw, true);
if(!is_array($data)) $data = ['posts'=>[], 'chats'=>[]];

$method = $_SERVER['REQUEST_METHOD'];

if($method === 'POST'){
    // action via POST
    $action = isset($_POST['action']) ? $_POST['action'] : null;

    if($action === 'post' && isset($_POST['post'])){
        $post = json_decode($_POST['post'], true);
        if(is_array($post)){
            // push al inicio para mantener orden o al final (aquí al final)
            $data['posts'][] = $post;
            file_put_contents($archivo, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
            echo json_encode($data);
            exit;
        }
    }

    if($action === 'chat' && isset($_POST['chat'])){
        $chat = json_decode($_POST['chat'], true);
        if(is_array($chat)){
            $data['chats'][] = $chat;
            // limitar chats si querés (opcional). Aquí no limitamos.
            file_put_contents($archivo, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
            echo json_encode($data);
            exit;
        }
    }

    if($action === 'like' && isset($_POST['id']) && isset($_POST['usuario'])){
        $id = $_POST['id'];
        $usuario = $_POST['usuario'];
        foreach($data['posts'] as &$p){
            if(isset($p['id']) && $p['id'] === $id){
                if(!isset($p['usersLiked'])) $p['usersLiked'] = [];
                if(!in_array($usuario, $p['usersLiked'])){
                    $p['usersLiked'][] = $usuario;
                    $p['likes'] = isset($p['likes']) ? $p['likes'] + 1 : 1;
                }
                break;
            }
        }
        file_put_contents($archivo, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
        echo json_encode($data);
        exit;
    }

    if($action === 'comment' && isset($_POST['id']) && isset($_POST['comment'])){
        $id = $_POST['id'];
        $comment = json_decode($_POST['comment'], true);
        if(is_array($comment)){
            foreach($data['posts'] as &$p){
                if(isset($p['id']) && $p['id'] === $id){
                    if(!isset($p['comentarios'])) $p['comentarios'] = [];
                    $p['comentarios'][] = $comment;
                    break;
                }
            }
            file_put_contents($archivo, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
            echo json_encode($data);
            exit;
        }
    }

    // si no coincidió acción, devolver estado actual
    echo json_encode($data);
    exit;
}

// GET -> devolver todo
echo json_encode($data);
exit;
?>
