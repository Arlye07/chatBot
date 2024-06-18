const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");
require("dotenv").config(); // Para cargar las variables de entorno desde .env

const SESSION_FILE_PATH = path.join(__dirname, "session.json");

// Crear el archivo de sesión si no existe
if (!fs.existsSync(SESSION_FILE_PATH)) {
  fs.writeFileSync(SESSION_FILE_PATH, "{}");
}

const client = new Client({
  authStrategy: new LocalAuth(),
  clientId: process.env.CLIENT_ID || "client-one", // Usar un ID único para cada cliente
  session: JSON.parse(fs.readFileSync(SESSION_FILE_PATH, "utf-8")),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("El cliente está listo");
  sendMessageToClient();
});

client.on("authenticated", (session) => {
  console.log("Sesión autenticada");
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
});

client.on("auth_failure", (msg) => {
  console.error("Hubo un fallo en la autenticación:", msg);
});

client.on("message", handleMessage);

client.initialize().catch((error) => {
  console.error("Error durante la inicialización:", error);
});

function sendMessageToClient() {
  const initialMessage =
    "¡Hola! 👋 Bienvenido al Consultorio Los Granaderos AV. Soy tu asistente virtual, 🤖. " +
    "Puedo proporcionarte información sobre nuestra ubicación 📍, servicios disponibles 💼, horarios de atención ⌚, y mucho más. " +
    "¿En qué puedo ayudarte hoy? Si quieres ver el menú, escribe '-menu'.";
  
  const options = [
    "Información General",
    "Dirección",
    "Horarios",
    "Servicios",
    "menu",
  ];

  const buttons = options.map((option) => ({
    content_type: "text",
    title: option,
    payload: option.toLowerCase(),
  }));

  client.sendMessage(client.info.remoteJid, initialMessage, { buttons: buttons });
}

function handleMessage(msg) {
  const lowerCaseBody = msg.body.toLowerCase().trim();

  const responses = {
    'direccion': () => {
      sendLocation(msg.from, "https://www.google.com/maps?q=-31.372466135972097,-64.22092077776799");
    },
    'ubicacion': () => {
      sendLocation(msg.from, "https://www.google.com/maps?q=-31.372466135972097,-64.22092077776799");
    },
    'informacion': () => {
      client.sendMessage(msg.from, "Claro, ¿en qué puedo ayudarte con la información?");
    },
    'menu': () => {
      client.sendMessage(msg.from, "Te puedo ayudar con los siguientes temas: Información General, Dirección, Horarios, Servicios, Menu, y más.");
    },
    'horarios': () => {
      client.sendMessage(msg.from, "Los horarios para el Od. Villagra Ariel son: lunes y jueves a la mañana y martes a la tarde, o todos los dias de 14:30 a 17:00hs. la hora de los mismos se pueden agendar apenas responda el Od.");
    },
    'servicios': () => {
      client.sendMessage(msg.from, "Ofrecemos una variedad de servicios, incluyendo Consulta, Urgencias Odontologica, Implantes, Protesis, Ortodoncia, Blanqueamiento, Contenciones y placas de Relajacion, entre otras. ¿Hay algo específico en lo que estás interesado?");
    },
    'obras sociales': () => {
      client.sendMessage(msg.from, "Sí, aceptamos varios seguros médicos. Por favor, proporciona tu información de seguro durante la programación de la cita para verificar la cobertura. En caso de que no tengamos alianza directa se realiza por obra social el pedido del reintegro abonado en la consulta odontologica.");
    },
    'post operatorios': () => {
      client.sendMessage(msg.from, "Si te realizaste una extraccion dental, lo mas seguro es que el Od. te proporcione los cuidados, de todos modos te dejo los cuidados: -evitar: +calor(de todas sus formas) +ejercicio +levantar peso +se recomienda siempre estar vertical o dormir semi sentado + mucho hielo en la zona los primeros dias +tomar la medicacion en tiempo y forma +sin buches +sin succion +sin fumar +agacharse.");
    },
    'blanqueamiento': () => {
      client.sendMessage(msg.from, "En el caso que estes cursando un blanqueamineto. Debes saber que no se pueden ingerir por 10 dias alimentos con pigmentos ya sean naturales o sinteticos (todo blanco y transparente esos 10 dias), la colocacion del blanquemiento ambulatorio en una gotita en la cara visible de la placa de blanqueo en los dientes indicados por el profesional, en caso de molestias o dolor dejar de usar o colocar menos cantidad en los siguientes dias, mas info colocando -indicaciones.");
    },
    'indicaciones': () => {
      const imagePath = path.join(__dirname, "./img/blanindicacion.png");
      client.sendImage(msg.from, imagePath, "blanqueamiento.png", "Indicaciones del blanqueamiento.");
    },
    'costos de tratamiento': () => {
      client.sendMessage(msg.from, "Los costos de los tratamientos varían según el tipo de servicio que necesitas. Te recomendamos agendar una consulta para obtener una evaluación y presupuesto personalizado.");
    },
    'profesionales': () => {
      client.sendMessage(msg.from, "Contamos con profesionales especializados en diferentes áreas, incluyendo: Ortodoncista, Implantologo y Neurologo. (En este momento le estas escribiendo al Od. dedicado a Implantes dentales.)");
    },
    'neurologo': () => {
      client.sendMessage(msg.from, "El Celular del neurologo, para una cita es 351 6159964");
    },
    'ortodoncia': () => {
      client.sendMessage(msg.from, "El Celular de la ortodoncista, para una cita es 351 2291682");
    },
    'turno': () => {
      client.sendMessage(msg.from, "¡Saca un turno vos mismo! https://calendar.app.google/cVeVen6nsVVb7fBM6");
    },
    'instagram': () => {
      client.sendMessage(msg.from, "¡Síguenos en Instagram! https://www.instagram.com/od.arielvillagra/");
    },
  };

  for (const keyword in responses) {
    if (lowerCaseBody.includes(keyword)) {
      responses[keyword]();
      break;
    }
  }
}

function sendLocation(chatId, locationUrl) {
  client.sendMessage(chatId, `Aquí está la ubicación en Google Maps: 📍 ${locationUrl}`)
    .then(() => {
      console.log("Enlace de ubicación enviado con éxito");
    })
    .catch((error) => {
      console.error("Error al enviar el enlace de ubicación:", error);
    });
}