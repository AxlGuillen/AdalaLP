/**
 * Contenido estructurado de ADALA, expuesto a agentes vía /api/* y /api/mcp.
 *
 * NOTA: `ContactForm.tsx` mantiene su propia lista de trámites y no depende de
 * este módulo (se dejó intacto a propósito). Si se añade o renombra un trámite
 * allí, hay que reflejarlo aquí; `SERVICE_IDS` documenta ese contrato.
 */

export interface Service {
  id: string;
  es: string;
  en: string;
  category: 'migration' | 'certification' | 'corporate';
}

export const SERVICES: Service[] = [
  { id: 'work-visa', es: 'Visa de Trabajo', en: 'Work Visa', category: 'migration' },
  { id: 'tourist-visa', es: 'Visa de Turista', en: 'Tourist Visa', category: 'migration' },
  { id: 'immigration-waiver', es: 'Perdón Migratorio', en: 'Immigration Waiver', category: 'migration' },
  {
    id: 'family-reunification',
    es: 'Reunificación Familiar / Visa para Adulto Mayor',
    en: 'Family Reunification / Senior Visa',
    category: 'migration',
  },
  { id: 'naturalization', es: 'Naturalización', en: 'Naturalization', category: 'migration' },
  { id: 'dual-nationality', es: 'Doble Nacionalidad', en: 'Dual Nationality', category: 'migration' },
  { id: 'marriage-petition', es: 'Petición por Matrimonio', en: 'Marriage Petition', category: 'migration' },
  { id: 'other', es: 'Otro', en: 'Other', category: 'migration' },
];

/** Identificadores aceptados por el formulario de contacto y por la política RLS. */
export const SERVICE_IDS = SERVICES.map((service) => service.id);

export const LINES_OF_SERVICE = [
  {
    id: 'migration',
    es: {
      title: 'Gestión Migratoria y Visados',
      description: 'Acompañamiento legal y documental en trámites migratorios conforme a la norma.',
    },
    en: {
      title: 'Immigration and Visa Services',
      description: 'Legal and documentary support for immigration procedures, in line with the law.',
    },
  },
  {
    id: 'certification',
    es: {
      title: 'Certificación y Acreditación Laboral',
      description:
        'Evaluación y certificación de competencias con validez oficial, incluida titulación por experiencia.',
    },
    en: {
      title: 'Labor Certification and Accreditation',
      description: 'Assessment and certification of skills with official validity, including credit for experience.',
    },
  },
  {
    id: 'corporate',
    es: {
      title: 'Vinculación Empresarial y Turismo Corporativo',
      description: 'Foros y misiones empresariales, traslados, hospedaje y organización de capacitaciones.',
    },
    en: {
      title: 'Business Networking and Corporate Tourism',
      description: 'Business forums and missions, transfers, lodging and training logistics.',
    },
  },
];

export const PROCESS_STEPS = [
  {
    step: 1,
    es: {
      title: 'Diagnóstico y Elegibilidad',
      description: 'Análisis de necesidades, perfil y requisitos legales/laborales del caso o proyecto.',
    },
    en: {
      title: 'Assessment and Eligibility',
      description: 'Analysis of needs, profile and the legal/labor requirements of the case or project.',
    },
  },
  {
    step: 2,
    es: {
      title: 'Documentación y Certificación',
      description: 'Integración de expediente, validación de antecedentes y certificación de competencias.',
    },
    en: {
      title: 'Documentation and Certification',
      description: 'File assembly, background validation and certification of skills.',
    },
  },
  {
    step: 3,
    es: {
      title: 'Trámite y Logística',
      description: 'Gestión de visa o proceso laboral, coordinación de entrevistas y logística de viaje/evento.',
    },
    en: {
      title: 'Filing and Logistics',
      description: 'Visa or labor process management, interview coordination and travel/event logistics.',
    },
  },
];

export const FAQS = [
  {
    es: {
      q: '¿ADALA es reclutadora, consultora o agencia?',
      a: 'Somos una agencia internacional con tres líneas: certificación/acreditación laboral, gestión migratoria legal y turismo corporativo/vinculación empresarial.',
    },
    en: {
      q: 'Is ADALA a recruiter, a consultancy or an agency?',
      a: 'We are an international agency with three lines: labor certification/accreditation, legal immigration services, and corporate tourism/business networking.',
    },
  },
  {
    es: {
      q: '¿Dan garantías de aprobación de visa?',
      a: 'No ofrecemos garantías. Sí brindamos preparación, integración documental y seguimiento profesional para elevar la probabilidad de éxito conforme a la ley.',
    },
    en: {
      q: 'Do you guarantee visa approval?',
      a: 'We do not offer guarantees. We do provide preparation, documentation and professional follow-up to improve the likelihood of success within the law.',
    },
  },
  {
    es: {
      q: '¿Pueden certificar mis competencias laborales?',
      a: 'Sí. Evaluamos y certificamos competencias con validez oficial, incluyendo opciones de titulación por experiencia y nivel medio superior.',
    },
    en: {
      q: 'Can you certify my job skills?',
      a: 'Yes. We assess and certify skills with official validity, including credit for experience and upper-secondary credentials.',
    },
  },
  {
    es: {
      q: '¿Atienden a empresas y a personas?',
      a: 'Ambos. Asesoramos a personas y a organizaciones (certificación de empleadores, reclutamiento ético, organización de foros y misiones empresariales).',
    },
    en: {
      q: 'Do you serve both companies and individuals?',
      a: 'Both. We advise individuals and organizations (employer certification, ethical recruitment, business forums and missions).',
    },
  },
  {
    es: {
      q: '¿También apoyan con logística de viajes y eventos?',
      a: 'Sí. Gestionamos traslados, hospedaje y la organización de conferencias/capacitaciones como parte del turismo corporativo.',
    },
    en: {
      q: 'Do you also handle travel and event logistics?',
      a: 'Yes. We arrange transfers, lodging and the organization of conferences/training as part of corporate tourism.',
    },
  },
];

/** Advertencia que todo agente debe conservar al hablar de ADALA. */
export const DISCLAIMER = {
  es: 'ADALA no garantiza la aprobación de ningún trámite migratorio. Ofrece preparación y acompañamiento profesional conforme a la ley.',
  en: 'ADALA does not guarantee approval of any immigration procedure. It provides preparation and professional support within the law.',
};

export const CONTACT = {
  formUrl: { es: 'https://adala.mx/es/contacto', en: 'https://adala.mx/en/contacto' },
  privacyUrl: { es: 'https://adala.mx/es/privacy', en: 'https://adala.mx/en/privacy' },
  areaServed: ['MX', 'US', 'CA'],
  languages: ['es', 'en'],
  /** Los agentes no deben enviar el formulario ni aceptar el aviso por el usuario. */
  consentNotice:
    'El formulario recoge datos personales y exige aceptar el Aviso de Privacidad. Un agente no debe enviarlo ni aceptar el aviso en nombre de la persona: debe dirigirla a la página de contacto para que ella confirme.',
};
