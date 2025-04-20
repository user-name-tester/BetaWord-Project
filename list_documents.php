<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
include_once "data_config.php";

try {
    $result = $conn->query("SELECT id, title, content FROM documents");
    if ($result === false) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $documents = [];
    while ($row = $result->fetch_assoc()) {
        $documents[] = $row;
    }

    echo json_encode($documents, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>