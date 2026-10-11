
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método no permitido."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      ok: false,
      error: "Falta configurar la clave de API."
    });
  }

  try {
    const { story, genre, duration, style, language } = req.body || {};

    if (!story || !story.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Escribe la idea de tu cortometraje."
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
Escribe un guion original para un cortometraje en ${language || "español"}.
Género: ${genre || "Drama"}.
Duración aproximada: ${duration || "3 minutos"}.
Estilo visual: ${style || "Cinematográfico"}.
Idea: ${story}

Incluye título, sinopsis, personajes y escenas con acciones,
diálogos y descripciones visuales. Organiza el resultado claramente.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    return res.status(200).json({
      ok: true,
      script: response.output_text || "No se pudo generar el guion."
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: "No se pudo generar el guion. Inténtalo de nuevo."
    });
  }
}
