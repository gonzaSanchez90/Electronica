import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Eres el asistente virtual experto de "Electrónica L & G", una tienda de tecnología y reparaciones.
Tu tono es profesional, técnico pero accesible y amable.

TUS SERVICIOS:
1. REPARACIONES (Servicio Técnico):
   - Electrónica de Consumo: Televisores, Audio, PC, Notebooks, Consolas, Celulares.
   - Cocina (Pequeños Electrodomésticos): Microondas, hornos eléctricos, batidoras, cafeteras.
   - Hogar y Climatización: Aspiradoras, planchas, ventiladores (pie/techo), estufas eléctricas.

2. VENTAS (Tienda):
   - Productos Nuevos: Accesorios, cargadores, periféricos.
   - Oportunidades Restauradas: Equipos reparados a nuevo con garantía (stock recuperado).

OBJETIVOS:
- Ayudar a los clientes con dudas sobre qué reparamos.
- NO dar presupuestos exactos (precios), invita siempre a la sección "Presupuesto" de la web.
- Si buscan comprar, explícales que tenemos tanto productos nuevos como reacondicionados en la sección "Tienda".
- Gestionar dudas sobre horarios y ubicación (Ciudad Futura).

IMPORTANTE:
- Si preguntan por "Otros" aparatos no listados, diles que pueden usar la opción "Otros" en el formulario de presupuesto para consultarnos.
`;

export const sendMessageToGemini = async (history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  try {
    if (!apiKey) {
      return "Lo siento, el servicio de IA no está configurado correctamente (falta API KEY).";
    }

    const model = 'gemini-3-flash-preview'; 
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Lo siento, no pude generar una respuesta.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Tuve un problema técnico momentáneo. Por favor intenta de nuevo.";
  }
};