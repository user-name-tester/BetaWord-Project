<?php
include_once "data_config.php";
header('Content-Type: application/json');

if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}

$file = $_FILES['image'];
$uploadDir = 'uploads/';
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