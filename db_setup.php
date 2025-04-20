// db_setup.php
<?php
$conn = new mysqli("localhost", "root", "4h4Nf4qcPUdFV]NY", "betaword");
if ($conn->connect_error) {
  die("Conexión fallida: " . $conn->connect_error);
}
$sql = "CREATE DATABASE IF NOT EXISTS betaword";
$conn->query($sql);
$conn->select_db("betaword");
$sql = "CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )";
$conn->query($sql);
echo "Base de datos configurada.";
$conn->close();
?>