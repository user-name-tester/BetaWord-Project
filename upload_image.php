<?php
include_once "data_config.php";
header('Content-Type: application/json');

if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png'];
$maxSize = 5 * 1024 * 1024; // 5MB

// Verificar tipo y tamaño
if (!in_array($file['type'], $allowedTypes) || $file['size'] > $maxSize) {
    echo json_encode(['error' => 'Solo imágenes JPEG/PNG ≤5MB']);
    exit;
}

// Verificar que es una imagen válida
if (!getimagesize($file['tmp_name'])) {
    echo json_encode(['error' => 'El archivo no es una imagen válida']);
    exit;
}

$uploadDir = 'Uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$filename = uniqid() . '-' . basename($file['name']);
$uploadPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    $url = './' . $uploadPath;
    echo json_encode(['url' => $url]);
} else {
    echo json_encode(['error' => 'Failed to upload image']);
}
?>