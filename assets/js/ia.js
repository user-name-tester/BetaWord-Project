// assets/js/ai.js
tf.setBackend('webgl');

let model = null;

async function loadTextAnalyzer() {
  try {
    console.log('Cargando modelo de análisis de texto...');
    model = await use.load();
    console.log('Modelo USE cargado exitosamente.');
  } catch (error) {
    console.error('Error al cargar el modelo:', error);
    document.getElementById('analysis-result').innerText = 'Error al cargar el modelo. Revisa la consola.';
  }
}

function splitIntoSentences(text) {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
}

async function analyzeText() {
  if (!model) {
    document.getElementById('analysis-result').innerText = 'El modelo de IA no está cargado. Por favor, espera.';
    return;
  }

  const text = document.getElementById('editor').innerText;
  if (!text.trim()) {
    document.getElementById('analysis-result').innerText = 'El editor está vacío. Escribe algo para analizar.';
    return;
  }

  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) {
    document.getElementById('analysis-result').innerText = 'No se encontraron oraciones válidas.';
    return;
  }

  try {
    const embeddings = await model.embed(sentences);
    const embeddingsArray = await embeddings.array();

    let result = 'Análisis de texto:\n';
    if (sentences.length > 1) {
      result += 'Similitud semántica entre oraciones:\n';
      for (let i = 0; i < embeddingsArray.length - 1; i++) {
        const similarity = tf.dot(
          tf.tensor(embeddingsArray[i]),
          tf.tensor(embeddingsArray[i + 1])
        ).dataSync()[0];
        result += `Oración ${i + 1} vs. Oración ${i + 2}: ${similarity.toFixed(2)}\n`;
      }
    } else {
      result += 'Solo se detectó una oración. Embedding generado: ' + embeddingsArray[0].slice(0, 5) + '...';
    }

    document.getElementById('analysis-result').innerText = result;
  } catch (error) {
    console.error('Error al analizar el texto:', error);
    document.getElementById('analysis-result').innerText = 'Error al analizar el texto. Revisa la consola.';
  }
}

loadTextAnalyzer();