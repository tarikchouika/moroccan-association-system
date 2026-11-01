import type { LegalDocs } from "./types";

/**
 * Documentos legales en español — traducidos del árabe (fuente de referencia).
 * Registro jurídico, tratamiento de ustedes.
 */
export const esLegalDocs: LegalDocs = {
  terms: {
    title: "Términos de uso de la plataforma",
    subtitle:
      "Estos términos rigen el uso de la plataforma MAMP y todos sus servicios y páginas, incluida la versión pública publicada y la aplicación Android oficial. Al utilizar la plataforma, ustedes reconocen estos términos y los aceptan íntegramente.",
    updated: "1 de noviembre de 2026",
    sections: [
      {
        heading: "Definición del servicio",
        paragraphs: [
          "La plataforma MAMP es una plataforma digital marroquí para la gestión y administración de asociaciones: adhesiones, contabilidad, donaciones, eventos y documentos oficiales, con el «Asistente Asociativo» — un asistente inteligente que responde desde una base de conocimientos oficial verificada.",
          "La plataforma funciona en dos versiones: una versión pública para navegar, consultar, donar e inscribirse en eventos, y una versión administrativa completa (panel de control) destinada a los miembros adheridos de las asociaciones, que funciona en la infraestructura local de la plataforma.",
        ],
      },
      {
        heading: "Cuentas y responsabilidades",
        paragraphs: [
          "La creación de la cuenta se realiza con información correcta y exacta, y el usuario es responsable de la confidencialidad de su contraseña y de toda actividad realizada a través de su cuenta.",
          "Los permisos de cada usuario se determinan según su rol: administrador general de la plataforma, administrador de asociación, coadministrador (socio/voluntario), entidad asociada o ciudadano. Ningún usuario podrá intentar acceder a lo que esté fuera del alcance de sus permisos ni vulnerar la privacidad de las demás asociaciones.",
        ],
      },
      {
        heading: "Uso aceptable",
        paragraphs: ["Está prohibido utilizar la plataforma para cualquier fin ilícito, en particular:"],
        bullets: [
          "Introducir datos falsos o engañosos sobre una asociación, una persona, una donación o una operación financiera.",
          "Suplantar la identidad de cualquier persona o entidad, o utilizar distintivos y permisos sin derecho.",
          "Explotar el «Asistente Asociativo» o cualquier servicio para intentar extraer información o eludir los controles de seguridad.",
          "Hacer un uso abusivo del servicio de manera que perjudique a la infraestructura o a los demás usuarios.",
        ],
      },
      {
        heading: "Donaciones y transacciones financieras",
        paragraphs: [
          "La plataforma MAMP es únicamente un medio digital de verificación y gestión: no es una entidad de cobro ni un intermediario financiero, ni custodia ni transfiere fondos. Toda donación o pago financiero se realiza directamente entre el donante y la asociación correspondiente a través de sus medios anunciados oficialmente.",
          "La responsabilidad sobre la licitud de la recaudación de donaciones (la autorización previa prevista en la normativa vigente), su distribución y su justificación recae exclusivamente en la asociación.",
        ],
      },
      {
        heading: "El Asistente Asociativo y los límites de la información",
        paragraphs: [
          "El Asistente funciona con una base de conocimientos oficial revisada, con un filtrado estricto que impide mostrar cualquier enlace no verificado. No obstante, sus respuestas siguen siendo orientativas y de carácter general, y no constituyen un asesoramiento legal o contable sustitutivo de los especialistas y de los textos oficiales.",
        ],
      },
      {
        heading: "Propiedad intelectual",
        paragraphs: [
          "Todos los elementos de la plataforma (diseño, logotipo, código, base de conocimientos, identidad visual) son propiedad de su titular, TARIK CHOUIKA, y no pueden copiarse ni reutilizarse comercialmente sin autorización previa por escrito.",
          "La aplicación Android oficial está firmada digitalmente con el certificado CN=TARIK CHOUIKA; cualquier copia no firmada con este certificado no se considera una versión oficial.",
        ],
      },
      {
        heading: "Límites de responsabilidad",
        paragraphs: [
          "El servicio se presta «tal cual», sin garantías expresas o implícitas de continuidad o de ausencia de errores. La plataforma no asume responsabilidad por ningún daño directo o indirecto derivado del uso del servicio o de la inexactitud de información introducida por los propios usuarios.",
        ],
      },
      {
        heading: "Ley aplicable y resolución de controversias",
        paragraphs: [
          "Estos términos se rigen por el derecho marroquí, en particular por el Dáhir n.º 1.58.376, modificado por la Ley 75.00, y por la Ley 09.08 relativa a la protección de datos de carácter personal.",
          "En caso de controversia, se ruega contactarnos primero para resolverla de forma amistosa; de no ser posible, el asunto se remitirá a los tribunales competentes del Reino de Marruecos.",
        ],
      },
      {
        heading: "Modificación de los términos",
        paragraphs: [
          "El propietario de la plataforma puede actualizar estos términos cuando sea necesario, y toda modificación sustancial se anunciará a través de la plataforma. La continuación del uso del servicio tras la publicación de la actualización se considerará aceptación de la nueva versión.",
        ],
      },
    ],
  },

  privacy: {
    title: "Política de privacidad y protección de datos",
    subtitle:
      "En la plataforma MAMP nos comprometemos a proteger sus datos personales de conformidad con la Ley n.º 09.08 relativa a la protección de las personas físicas frente al tratamiento de datos de carácter personal, y con las directrices de la Comisión Nacional de Control de la Protección de Datos Personales (CNDP).",
    updated: "1 de noviembre de 2026",
    sections: [
      {
        heading: "Responsable del tratamiento",
        paragraphs: [
          "El responsable del tratamiento de los datos personales en la plataforma MAMP es el titular de la plataforma, TARIK CHOUIKA. Para cualquier pregunta o solicitud relativa a sus datos personales, pueden contactar a través de los canales de comunicación anunciados en la plataforma.",
        ],
      },
      {
        heading: "Datos que recopilamos",
        paragraphs: ["Trabajamos con el mínimo imprescindible de datos:"],
        bullets: [
          "Datos de la cuenta: nombre completo, correo electrónico, contraseña cifrada, teléfono (opcional).",
          "Datos de la adhesión: número de membresía, tipo de adhesión, profesión (opcional), fecha de adhesión.",
          "Datos de la gestión financiera de las asociaciones: operaciones y documentos contables introducidos por los propios tesoreros.",
          "Identificador nacional (número de cédula): totalmente opcional, solo se solicita cuando es necesario y con consentimiento expreso.",
        ],
      },
      {
        heading: "Base legal del tratamiento",
        paragraphs: [
          "La base es su consentimiento expreso y previo al crear la cuenta o al adherirse; el consentimiento queda registrado con su fecha y hora dentro de la plataforma, en cumplimiento de la Ley 09.08.",
          "Los datos de la gestión financiera de las asociaciones también se tratan en ejecución de las obligaciones contables y legales que incumben a las asociaciones.",
        ],
      },
      {
        heading: "Plazo de conservación",
        paragraphs: [
          "Los datos se conservan durante la vigencia de la cuenta o de la adhesión activa, y después se suprimen o se anonimizan una vez finalizada la relación, conforme a los plazos de conservación aplicables y respetando las obligaciones legales de archivo.",
        ],
      },
      {
        heading: "Sus derechos y cómo ejercerlos",
        paragraphs: ["La Ley 09.08 les garantiza los siguientes derechos:"],
        bullets: [
          "Derecho de acceso a sus datos y de verificación de los mismos.",
          "Derecho de rectificación de los datos inexactos o de actualización de los mismos.",
          "Derecho de oposición al tratamiento por motivos legítimos.",
          "Derecho a retirar su consentimiento (con la consecuente terminación de la cuenta).",
        ],
      },
      {
        heading: "Comisión Nacional CNDP",
        paragraphs: [
          "Ustedes tienen derecho a presentar una reclamación ante la Comisión Nacional de Control de la Protección de Datos Personales si consideran que sus derechos de protección de sus datos personales han sido vulnerados. El portal oficial de la Comisión está anunciado en la página «Referencia legal» y en la base de conocimientos del Asistente Asociativo.",
        ],
      },
      {
        heading: "Seguridad de los datos",
        paragraphs: [
          "Adoptamos medidas técnicas y organizativas razonables para proteger los datos: cifrado de las contraseñas con el algoritmo scrypt, sesiones firmadas en una cookie httpOnly, registro de auditoría de las operaciones sensibles y permisos jerárquicos ajustados a cada rol.",
          "No vendemos, alquilamos ni intercambiamos sus datos con terceros con fines comerciales.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Utilizamos una sola cookie técnica de sesión, sin cookies de seguimiento ni publicitarias. Los detalles completos figuran en la política de cookies.",
        ],
      },
      {
        heading: "Modificaciones de la política",
        paragraphs: [
          "Podemos actualizar esta política cuando evolucionen los servicios o por cumplimiento de la ley. Toda modificación sustancial se anunciará a través de la plataforma antes de su entrada en vigor.",
        ],
      },
    ],
  },

  cookies: {
    title: "Política de cookies",
    subtitle:
      "Transparencia total: la plataforma MAMP no utiliza ninguna cookie de seguimiento ni publicitaria — una sola cookie técnica para mantener su sesión abierta con seguridad.",
    updated: "1 de noviembre de 2026",
    sections: [
      {
        heading: "¿Qué son las cookies?",
        paragraphs: [
          "Las cookies son pequeños datos de texto que el sitio almacena en su navegador para recordar información necesaria para el funcionamiento del servicio. En Marruecos, su tratamiento se rige por la Ley 09.08.",
        ],
      },
      {
        heading: "¿Qué utiliza la plataforma?",
        paragraphs: [
          "Una sola cookie denominada mamp_session: una cookie técnica y de seguridad que transporta un identificador de sesión firmado digitalmente que les permite permanecer conectados dentro del panel de control.",
        ],
        bullets: [
          "Tipo: estrictamente necesaria (Strictly Necessary) — no puede desactivarse manteniendo operativo el servicio de inicio de sesión.",
          "Duración: una semana desde el último inicio de sesión, después caduca automáticamente.",
          "Características de seguridad: httpOnly (no legible por los scripts de la página), Secure en producción y SameSite=Lax.",
        ],
      },
      {
        heading: "¿Qué no utiliza la plataforma?",
        bullets: [
          "Ninguna cookie de seguimiento ni de analítica comercial.",
          "Ninguna cookie publicitaria ni etiqueta de píxel de terceros.",
          "Ninguna compartición del comportamiento de navegación con ninguna entidad externa.",
        ],
      },
      {
        heading: "Desactivación de las cookies y sus efectos",
        paragraphs: [
          "Pueden bloquear las cookies desde la configuración de su navegador. En tal caso, todas las páginas públicas, el Asistente Asociativo y el directorio de asociaciones siguen disponibles, pero el inicio de sesión en el panel de control no funcionará porque la sesión no puede mantenerse.",
        ],
      },
      {
        heading: "Contacto",
        paragraphs: [
          "Para cualquier pregunta sobre esta política o sobre el tratamiento de sus datos, consulten la política de privacidad o contáctennos a través de los canales anunciados en la plataforma.",
        ],
      },
    ],
  },
};
