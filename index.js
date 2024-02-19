// -*- coding: utf-8 -*-

// const fs = require('fs');
// const qrcode = require('qrcode-terminal');

// const {Client} = require('whatsapp-web.js');
// const client = new Client();

// const SESSION_FILE_PATH = "./session.js";

// let sessionData;
// if(fs.existsSync(SESSION_FILE_PATH)){
//     sessionData = require(SESSION_FILE_PATH)
// }

// client.initialize();

// client.on('qr', qr =>{
//     qrcode.generate(qr,{small:true});
// });
// client.on('ready', () =>{
//     console.log('El cliente esta listo');
// })

//-----------------------------------------------//

const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");
const SESSION_FILE_PATH = path.join(__dirname, "session.js");

if (!fs.existsSync(SESSION_FILE_PATH)) {
  fs.writeFileSync(SESSION_FILE_PATH, "{}");
}

const country_code = "549";
const number = "3515123347";
const msg = "Hola soy el bot!🤖 estoy activo";

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  authStrategy: new LocalAuth(),
  session: sessionData,
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("El cliente está listo");

  let chatId = country_code + number + "@c.us";

  client.sendMessage(chatId, msg).then((response) => {
    if (response.id.fromMe) {
      console.log("El mensaje fue enviado");
    }
  });
});

client.on("authenticated", (session) => {
  try {
    if (session) {
      sessionData = session;
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
          console.error(
            "Error al escribir en el archivo de sesión:",
            err.message
          );
        }
      });
    } else {
      console.warn(
        "La sesión es indefinida. No se escribirá en el archivo de sesión."
      );
    }
  } catch (err) {
    console.error("Error al escribir en el archivo de sesión:", err.message);
  }
});

client.on("auth_failure", (msg) => {
  console.error("Hubo un fallo en la autenticación", msg);
});

client.on("message", (msg) => {
  const lowerCaseBody = msg.body.toLowerCase();

  if (lowerCaseBody.includes("hola")) {
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

    //------mensajes del bot------//

    client.sendMessage(
      msg.from,
      `¡Hola! 👋 Bienvenido al Consultorio Los Granaderos AV. Soy tu asistente virtual,🤖.
      
      Puedo proporcionarte información sobre nuestra ubicación 📍, servicios disponibles 💼, horarios de atención ⌚, y mucho más. 
      
      ¿En qué puedo ayudarte hoy?
      
      Si quieres que te responda pon -menu , para poder responderte las preguntas mas frecuentes, ¡no dudes en preguntar y estoy para ayudarte! 😊.`,
      { buttons: buttons }
    );
    
  } else if (lowerCaseBody.includes("direccion")) {
    // Enviar un enlace de Google Maps con las coordenadas de la ubicación.
    const googleMapsLink =
      "https://www.google.com/maps?q=-31.372466135972097,-64.22092077776799";
    client.sendMessage(
      msg.from,
      `Aquí está la dirección en Google Maps: ${googleMapsLink}`
    );
  } else if (lowerCaseBody.includes("dirección")) {
    // Enviar un enlace de Google Maps con las coordenadas de la ubicación.
    const googleMapsLink =
      "https://www.google.com/maps?q=-31.372466135972097,-64.22092077776799";
    client.sendMessage(
      msg.from,
      `Aquí está la dirección en Google Maps: ${googleMapsLink}`
    );
  } else if (lowerCaseBody.includes("informacion")) {
    client.sendMessage(
      msg.from,
      "Claro, ¿en qué puedo ayudarte con la información?"
    );
  } else if (lowerCaseBody.includes("información")) {
    client.sendMessage(
      msg.from,
      "Claro, ¿en qué puedo ayudarte con la información?"
    );
  } else if (lowerCaseBody.includes("menu")) {
    client.sendMessage(
      msg.from,
      "Te puedo ayudar con los siguientes temas sobre la atención, Servicios, Menu, Horarios, Direccion, Obras sociales, Post Operatorios, Blanqueamiento, Costos de tratamiento, Profesionales, Neurologo, Ortodoncia, Turno, Instagram."
    );
  } else if (lowerCaseBody.includes("menú")) {
    client.sendMessage(
      msg.from,
      "Te puedo ayudar con los siguientes temas sobre la atención, Servicios, Menu, Horarios, Direccion, Obras sociales, Post Operatorios, Blanqueamiento, Costos de tratamiento, Profesionales, Neurologo, Ortodoncia, Turno, Instagram."
    );
  } else if (lowerCaseBody.includes("horarios")) {
    client.sendMessage(
      msg.from,
      "Los horarios para el Od. Villagra Ariel;`\n` son: lunes y jueves a la mañana y martes a la tarde, la hora de los mismos se pueden agenar apenas responda el Od."
    );
  } else if (lowerCaseBody.includes("servicios")) {
    client.sendMessage(
      msg.from,
      "Ofrecemos una variedad de servicios, incluyendo Consulta, Urgencias Odontologica, Implantes, Protesis, Ortodoncia, Blanqueamiento, Contenciones y placas de Relajacion, entre otras.`\n` ¿Hay algo específico en lo que estás interesado?"
    );
  } else if (lowerCaseBody.includes("obras sociales")) {
    client.sendMessage(
      msg.from,
      "Sí, aceptamos varios seguros médicos. Por favor, proporciona tu información de seguro durante la programación de la cita para verificar la cobertura.`\n` En caso de que no tengamos alianza directa se realiza por obra social el pedido del reintegro abonado en la consulta odontologica."
    );
  } else if (lowerCaseBody.includes("post operatorios")) {
    client.sendMessage(
      msg.from,
      "Si te realizaste una extraccion dental,`\n` lo mas seguro es que el Od. te proporcione los cuidados, de todos modos te dejo los cuidados:`\n` -evitar: +calor(de todas sus formas) +ejercicio +levantar peso +se recomienda siempre estar vertical o dormir semi sentado + mucho hielo en la zona los primeros dias +tomar la medicacion en tiempo y forma +sin buches +sin succion +sin fumar +agacharse."
    );
  } else if (lowerCaseBody.includes("blanqueamiento")) {
    client.sendMessage(
      msg.from,
      "En el caso que estes cursando un blanqueamineto. `\n` Debes saber que no se pueden ingerir por 10 dias alimentos con pigmentos ya sean naturales o sinteticos (todo blanco y transparente esos 10 dias), `\n` la colocacion del blanquemiento ambulatorio en una gotita en la cara visible de la placa de blanqueo en los dientes indicados por el profesional,`\n` en caso de molestias o dolor dejar de usar o colocar menos cantidad en los siguientes dias, mas info colocando -indicaciones."
    );
  } else if (lowerCaseBody.includes("indicaciones")) {
    // Ruta a la imagen que deseas enviar
    const imagePath = path.join(__dirname, "./img/blanindicacion.png");
    // Enviar la imagen
    client.sendImage(
      msg.from,
      imagePath,
      "blanqueamiento.png",
      "Indidcaciones del blanqueamiento."
    );
  } else if (lowerCaseBody.includes("Costos de tratamiento")) {
    client.sendMessage(
      msg.from,
      "Los costos de los tratamientos varían según el tipo de servicio que necesitas. `\n` Te recomendamos agendar una consulta para obtener una evaluación y presupuesto personalizado."
    );
  } else if (lowerCaseBody.includes("Costo de tratamiento")) {
    client.sendMessage(
      msg.from,
      "Los costos de los tratamientos varían según el tipo de servicio que necesitas. `\n` Te recomendamos agendar una consulta para obtener una evaluación y presupuesto personalizado."
    );
  } else if (lowerCaseBody.includes("profesionales")) {
    client.sendMessage(
      msg.from,
      "Contamos con profesionales especializados en diferentes áreas,`\n` incluyendo: Ortodoncista, Implantologo y Neurologo.`\n`(En este momento le estas escribiendo al Od. dedicado a Implantes dentales.)"
    );
  } else if (lowerCaseBody.includes("neurologo")) {
    client.sendMessage(
      msg.from,
      "El Celular del neurologo, para una cita es 351 6159964"
    );
  } else if (lowerCaseBody.includes("neurólogo")) {
    client.sendMessage(
      msg.from,
      "El Celular del neurologo, para una cita es 351 6159964"
    );
  } else if (lowerCaseBody.includes("ortodoncia")) {
    client.sendMessage(
      msg.from,
      "El Celular de la ortodoncista, para una cita es 351 2291682"
    );
  } else if (lowerCaseBody.includes("ortodóncia")) {
    client.sendMessage(
      msg.from,
      "El Celular de la ortodoncista, para una cita es 351 2291682"
    );
  } else if (lowerCaseBody.includes("turno")) {
    client.sendMessage(
      msg.from,
      "En el caso de que quieras un turno, `\n` estaria muy bien que me proporciones un mail y nombre."
    );
  } else if (lowerCaseBody.includes("instagram")) {
    const instagramLink = "https://www.instagram.com/od.arielvillagra/";
    // Enviar el enlace a Instagram
    client
      .sendMessage(msg.from, `¡Síguenos en Instagram! 📸 ${instagramLink}`)
      .then((response) => {
        console.log("Enlace de Instagram enviado con éxito");
      })
      .catch((error) => {
        console.error("Error al enviar el enlace de Instagram:", error);
      });
  }
});
