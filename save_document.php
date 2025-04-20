<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
include_once "data_config.php";

try {
    $content = $_POST['content'] ?? '';
    $title = $_POST['title'] ?? 'Documento ' . date('Y-m-d H:i:s');

    if (empty($content)) {
        throw new Exception("El contenido no puede estar vacío.");
    }

    $content = mysqli_real_escape_string($conn, $content);
    $title = mysqli_real_escape_string($conn, $title);

    $sql = "INSERT INTO documents (title, content) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param("ss", $title, $content);
    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
    }

    echo json_encode(['message' => 'Documento guardado exitosamente.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>