# 🪐 BetaWord

**BetaWord** es un procesador de texto web libre, ético y potenciado por IA. Es el primer componente de la futura suite ofimática **BetaGalaxy**, una plataforma 100% de código abierto pensada para ayudarte a crear, colaborar y expresarte con libertad y privacidad.

## ✨ Características principales

- Editor moderno basado en **Quill.js**.
- Guardado y carga de documentos con backend en **PHP + MySQL**.
- Inserción de imágenes, tablas, videos y enlaces.
- Exportación a **PDF**, **HTML** e **imagen PNG**.
- Análisis de texto mediante **IA (TensorFlow.js + USE)**.
- Licencia de código abierto (MIT).

## 🧠 Integración de IA: `analyzeText()` y `analyzeTextTone()`

### `analyzeText()` (desde `ia.js`)
Analiza el contenido del documento dividiéndolo en oraciones, genera embeddings con Universal Sentence Encoder y calcula la **similitud semántica** entre frases.

#### Ejemplo de salida JSON:
```json
{
  "tone": "positive",
  "confidence": 0.83,
  "semantic_similarities": ["0.89", "0.76", "0.81"]
}
```

### `analyzeTextTone()` (desde `script.js`)
Función integrada directamente en el editor que usa los embeddings generados para analizar el **tono general** del texto (`positivo`, `negativo` o `neutral`). Usa una heurística inicial combinada con similitud semántica y puede evolucionar a un clasificador entrenado.

## 📊 Rendimiento de Análisis de Tono
- **Función**: `classifyTone()`
- **Dataset de prueba**: 100 frases en español (40 positivas, 40 negativas, 20 neutrales).
- **Precisión**: [A rellenar con los resultados, ej. 85%]
- **Velocidad**: [A rellenar con los resultados, ej. 150ms por frase en promedio]

## 📦 Instalación local (modo desarrollador)

### 1. Clonar el repositorio
```bash
git clone https://github.com/user-name-tester/BetaWord-Project.git
cd BetaWord-Project
```

### 2. Instalar dependencias PHP
```bash
composer install
```
> Esto instalará `vlucas/phpdotenv` para el manejo del archivo `.env`.

### 3. Crear el archivo `.env`
```
DB_HOST=localhost
DB_USER=betaword_user
DB_PASS=segura123
DB_NAME=betaword_db
```

### 4. Configurar la base de datos
- Importa el archivo `db_setup.php` en tu servidor local (ej: XAMPP, WAMP, etc.).
- Asegúrate de tener permisos de escritura en la carpeta `/uploads/`:
```bash
chmod 755 uploads/
```

### 5. Ejecutar en el navegador
Abre `index.html` en tu navegador o monta el proyecto en un servidor local (recomendado para probar funciones como guardar/cargar imágenes).

---

## 📅 Roadmap
- [ ] Colaboración en tiempo real (WebSockets).  
- [ ] Soporte para Markdown/LaTeX.  
- [ ] Plugin para ChatGPT/Grok directamente en el editor.  

## 📄 Licencia

Este proyecto está licenciado bajo la licencia **MIT**:

```
MIT License

Copyright (c) 2025 BetaWord Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## 👥 Contribuciones

BetaWord da la bienvenida a contribuciones de cualquier ser humano o IA interesada en crear tecnología ética. Puedes contribuir con:
- Mejoras en UI o accesibilidad.
- Optimización del backend (PHP, seguridad).
- Ampliación del sistema IA.
- Documentación o traducción.

**¡Juntos construimos un futuro libre y colaborativo!**

## 💬 Comunicación entre IAs (JSON v1.0)

Usamos el siguiente formato estructurado para coordinar tareas entre IAs:
```json
{
  "from": "ChatGPT",
  "to": ["User", "Grok", "Deepseek"],
  "type": "task",
  "topic": "IA Integration",
  "priority": "high",
  "message": "Implementar classifyTone() con embeddings.",
  "data": {
    "output_format": {"tone": "string", "confidence": "float"}
  },
  "timestamp": "2025-04-20T18:00:00Z",
  "version": "1.0"
}
```

## 🌌 Proyecto BetaGalaxy

BetaWord es parte de **BetaGalaxy**, una visión de software ético, libre y accesible para todos. Aquí creemos que la tecnología puede ser una amiga, no un producto.

> "Un mundo mejor comienza con una línea de código compartida."

---

© 2025 BetaWord Team – Todos los derechos compartidos.

