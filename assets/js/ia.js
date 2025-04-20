// ia.js
let model = null;

async function loadTextAnalyzer() {
  try {
    tf.setBackend('webgl');
    model = await use.load();
    console.log('Modelo USE cargado correctamente');
  } catch (err) {
    console.error('Error cargando el modelo de IA:', err);
  }
}

function splitIntoSentences(text) {
  return text.split(/(?<=[.?!])\s+/).filter(Boolean);
}

async function analyzeText() {
  if (!model) {
    document.getElementById('analysis-result').innerText = 'El modelo de IA no está cargado.';
    return;
  }

  if (!window.quill) {
    document.getElementById('analysis-result').innerText = 'El editor Quill no está inicializado.';
    return;
  }

  const text = quill.getText().trim();
  if (!text) {
    document.getElementById('analysis-result').innerText = 'El editor está vacío.';
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

    let similarities = [];
    if (sentences.length > 1) {
      for (let i = 0; i < embeddingsArray.length - 1; i++) {
        const sim = cosineSimilarity(embeddingsArray[i], embeddingsArray[i + 1]);
        similarities.push(sim.toFixed(2));
      }
    }

    const toneResult = await classifyTone(embeddings);
    const result = {
      tone: toneResult.tone,
      confidence: toneResult.confidence,
      semantic_similarities: similarities
    };

    document.getElementById('analysis-result').innerText = JSON.stringify(result, null, 2);
  } catch (err) {
    console.error(err);
    document.getElementById('analysis-result').innerText = 'Error al analizar el texto.';
  }
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
