import React from 'react';
import { PathStepData, CovenantStep, OrgType } from './types';
import { Droplet, Shield, Key, HeartHandshake, BookOpen, TreeDeciduous } from 'lucide-react';

export const ORGANIZATIONS: { id: OrgType; name: string; color: string }[] = [
  { id: 'EQ', name: 'Cuórum de Élderes', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'RS', name: 'Sociedad de Socorro', color: 'bg-pink-100 text-pink-800 border-pink-300' },
  { id: 'YM', name: 'Hombres Jóvenes', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { id: 'YW', name: 'Mujeres Jóvenes', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'PRI', name: 'Primaria', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { id: 'SS', name: 'Escuela Dominical', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
];

export const COVENANT_PATH_STEPS: PathStepData[] = [
  {
    id: 'baptism',
    title: CovenantStep.BAPTISM,
    description: 'La puerta de entrada a la senda de los convenios.',
    icon: <Droplet className="w-6 h-6" />,
    meetingFocus: 'La Reunión de Coordinación Misional lidera el esfuerzo, apoyada por el Consejo de Barrio para la integración.',
    councilFocus: [
      {
        role: 'Líder Misional de Barrio',
        tasks: ['Coordinar con misioneros de tiempo completo', 'Planear servicios bautismales', 'Asegurar la enseñanza de lecciones misionales']
      },
      {
        role: 'Obispado',
        tasks: ['Realizar entrevistas de bautismo (para niños de 8 años)', 'Supervisar la ordenanza']
      },
      {
        role: 'Organizaciones (Primaria/SA/SE)',
        tasks: ['Asignar amigos ministrantes', 'Preparar el ambiente social para la bienvenida']
      }
    ]
  },
  {
    id: 'temple_history',
    title: CovenantStep.TEMPLE_HISTORY,
    description: 'Volver el corazón a los padres y servicio vicario.',
    icon: <TreeDeciduous className="w-6 h-6" />,
    meetingFocus: 'Coordinación de Templo e Historia Familiar y Consejo de Barrio.',
    councilFocus: [
      {
        role: 'Consultores de Templo e HF',
        tasks: ['Ayudar al nuevo miembro a crear cuenta FamilySearch', 'Enseñar a ingresar las 4 generaciones', 'Preparar tarjetas para bautismos vicarios']
      },
      {
        role: 'Obispado',
        tasks: ['Entrevista para recomendación de uso limitado', 'Fomentar la asistencia al templo para bautismos']
      },
      {
        role: 'Pdte. Cuórum y Soc. Socorro',
        tasks: ['Organizar visitas al templo con nuevos miembros', 'Asegurar que tengan transporte y compañía']
      }
    ]
  },
  {
    id: 'sacrament',
    title: CovenantStep.SACRAMENT,
    description: 'Renovación semanal de convenios y retención.',
    icon: <BookOpen className="w-6 h-6" />,
    meetingFocus: 'El Consejo de Barrio revisa la asistencia y el bienestar espiritual.',
    councilFocus: [
      {
        role: 'Obispado',
        tasks: ['Presidir la reunión sacramental', 'Asegurar la dignidad al participar']
      },
      {
        role: 'Cuórum de Élderes y S. Socorro',
        tasks: ['Ministración a miembros menos activos', 'Identificar necesidades temporales y espirituales']
      }
    ]
  },
  {
    id: 'ordination',
    title: CovenantStep.ORDINATION,
    description: 'Conferir el Sacerdocio Aarónico y de Melquisedec.',
    icon: <Shield className="w-6 h-6" />,
    meetingFocus: 'Coordinación de Presidencias de Cuórum y Obispado.',
    councilFocus: [
      {
        role: 'Pdte. Cuórum de Élderes',
        tasks: ['Preparar a los futuros élderes', 'Entrevistar y recomendar (junto al Obispo)']
      },
      {
        role: 'Obispado',
        tasks: ['Supervisar el Sacerdocio Aarónico', 'Entrevistas de dignidad']
      }
    ]
  },
  {
    id: 'endowment',
    title: CovenantStep.ENDOWMENT,
    description: 'Recibir poder de lo alto en la Casa del Señor.',
    icon: <Key className="w-6 h-6" />,
    meetingFocus: 'Reunión de Coordinación de Templo e Historia Familiar.',
    councilFocus: [
      {
        role: 'Líder de Templo e HF',
        tasks: ['Coordinar clases de preparación para el templo', 'Ayudar con tarjetas de ordenanzas familiares']
      },
      {
        role: 'Sociedad de Socorro',
        tasks: ['Inspirar a las hermanas a prepararse', 'Ayudar con la ropa del templo']
      },
      {
        role: 'Obispo',
        tasks: ['Entrevista para recomendación de uso limitado o viva']
      }
    ]
  },
  {
    id: 'sealing',
    title: CovenantStep.SEALING,
    description: 'Unir a las familias por la eternidad.',
    icon: <HeartHandshake className="w-6 h-6" />,
    meetingFocus: 'Esfuerzo conjunto del Consejo de Barrio y Coordinación de Templo.',
    councilFocus: [
      {
        role: 'Consultores de Templo e HF',
        tasks: ['Ayudar a encontrar antepasados para sellamientos', 'Enseñar a usar FamilySearch']
      },
      {
        role: 'Cuórum de Élderes y S. Socorro',
        tasks: ['Fomentar la asistencia regular al templo', 'Organizar viajes al templo']
      }
    ]
  }
];

export const SYSTEM_INSTRUCTION = `
Actúa como un experto consultor en el Manual General de La Iglesia de Jesucristo de los Santos de los Últimos Días.
Tu objetivo es ayudar a un Consejo de Barrio a organizar sus esfuerzos para ayudar a los miembros en la Senda de los Convenios.
Responde siempre en Español.
Basa tus respuestas en políticas oficiales, enfocándote en:
1. Reuniones de Coordinación Misional.
2. Reuniones de Coordinación de Templo e Historia Familiar.
3. El papel de las Organizaciones Auxiliares.
4. La centralidad de la Senda de los Convenios.
5. Cómo usar la herramienta de asignación de tareas del tablero.

Sé conciso, inspirador y práctico. Usa listas con viñetas cuando des pasos a seguir.
Si te preguntan sobre una situación específica, sugiere cómo el consejo podría deliberar, citando principios del manual.
`;