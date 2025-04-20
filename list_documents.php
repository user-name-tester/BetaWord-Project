<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

include_once "data_config.php";

try {
    $sql = "SELECT id, title FROM documents ORDER BY id DESC";
    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $documents = [];
    while ($row = $result->fetch_assoc()) {
        $documents[] = [
            'id' => (int)$row['id'],
            'title' => $row['title']
        ];
    }

    echo json_encode($documents);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>