<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

include_once "data_config.php";

function isValidImage($file) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    $mimeType = mime_content_type($file['tmp_name']);
    return in_array($mimeType, $allowedTypes) && 
           $file['size'] <= $maxSize && 
           getimagesize($file['tmp_name']) !== false;
}

try {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No se subió ninguna imagen o hubo un error al subirla.');
    }

    $file = $_FILES['image'];
    if (!isValidImage($file)) {
        throw new Exception('Solo se permiten imágenes JPEG/PNG/GIF ≤5MB.');
    }

    $uploadDir = 'Uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $filename = uniqid() . '-' . preg_replace("/[^A-Za-z0-9\-.]/", '', basename($file['name']));
    $uploadPath = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Error al mover la imagen al servidor.');
    }

    $url = './' . $uploadPath;
    echo json_encode(['url' => $url]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>