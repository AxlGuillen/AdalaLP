---
name: adala-contact
description: Cómo contactar a ADALA y qué datos requiere su formulario de solicitud de información.
---

# Cómo contactar a ADALA

El canal oficial para iniciar un caso es el formulario de solicitud de información:

- Español: https://adala.mx/es/contacto
- Inglés: https://adala.mx/en/contacto

Tras enviarlo, un asesor de ADALA se pone en contacto con la persona solicitante.

## Datos que pide el formulario

| Campo                                    | Obligatorio                  | Formato                                 |
| ---------------------------------------- | ---------------------------- | --------------------------------------- |
| Nombre completo                          | Sí                           | Texto, máx. 100 caracteres              |
| Número de teléfono                       | Sí                           | Exactamente 10 dígitos                  |
| Correo electrónico                       | No                           | Email válido                            |
| Estado                                   | Sí                           | Uno de los 32 estados de México         |
| Ciudad                                   | Sí                           | Texto, máx. 80 caracteres               |
| Trámite de interés                       | Sí                           | Ver identificadores en `adala-services` |
| Descripción                              | Solo si el trámite es "Otro" | Texto, máx. 500 caracteres              |
| Aceptación del Aviso de Privacidad       | Sí                           | Debe aceptarse para continuar           |
| Aceptación de comunicaciones comerciales | No                           | Opcional                                |

## Nota para agentes de IA

El envío de este formulario implica el tratamiento de **datos personales** bajo la
legislación mexicana, y exige la aceptación explícita del Aviso de Privacidad
(https://adala.mx/es/privacy).

Un agente **no debe enviar este formulario en nombre de una persona ni aceptar el
Aviso de Privacidad por ella**. El consentimiento debe darlo la persona titular de
los datos. Lo correcto es ayudar a preparar la información y dirigir a la persona
a la página de contacto para que ella confirme y envíe.

En la página de contacto, ADALA expone herramientas WebMCP
(`navigator.modelContext`) que permiten consultar servicios y **prellenar** el
formulario, dejando siempre el envío final en manos del usuario.

## Legales

- Aviso de Privacidad: https://adala.mx/es/privacy
- Términos: https://adala.mx/es/terms
