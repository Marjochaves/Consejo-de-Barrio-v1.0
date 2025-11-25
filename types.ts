import React from 'react';

export enum CovenantStep {
  BAPTISM = 'Bautismo y Confirmación',
  TEMPLE_HISTORY = 'Templo e Historia Familiar',
  SACRAMENT = 'Santa Cena (Renovación)',
  ORDINATION = 'Ordenación al Sacerdocio',
  ENDOWMENT = 'Investidura',
  SEALING = 'Sellamiento'
}

export enum MeetingType {
  WARD_COUNCIL = 'Consejo de Barrio',
  MISSIONARY_COORD = 'Coordinación Misional',
  TEMPLE_FH_COORD = 'Coordinación de Templo e HF',
  AUXILIARY = 'Presidencias de Organizaciones'
}

export interface RoleResponsibility {
  role: string;
  tasks: string[];
}

export interface PathStepData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  councilFocus: RoleResponsibility[];
  meetingFocus: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

// --- NEW MANAGEMENT TYPES ---

export type OrgType = 'EQ' | 'RS' | 'YM' | 'YW' | 'PRI' | 'SS';

export interface Person {
  id: string;
  name: string;
  status: 'Amigo/Investigador' | 'Nuevo Converso' | 'Menos Activo' | 'Miembro Activo' | 'Archivado';
  previousStatus?: 'Amigo/Investigador' | 'Nuevo Converso' | 'Menos Activo' | 'Miembro Activo'; // To restore correctly
  currentStep: string; // Matches CovenantStep ID
  phone?: string; // Optional phone number for WhatsApp
  notes?: string;
}

export interface TaskNote {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Task {
  id: string;
  personId: string;
  assignedToOrg: OrgType;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  notes: TaskNote[];
}