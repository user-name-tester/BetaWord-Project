<?php
$conn = new mysqli("localhost", "root", "4h4Nf4qcPUdFV]NY", "betaword");
if ($conn->connect_error) {
  die("Conexión fallida: " . $conn->connect_error);
}