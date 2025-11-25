import React, { useState } from 'react';
import { PathStepData, Person, Task, OrgType } from '../types';
import { ORGANIZATIONS, COVENANT_PATH_STEPS } from '../constants';
import { Users, CheckCircle2, Circle, Plus, Bell, MessageSquare, ClipboardList, TrendingUp, MessageCircle, Trash2, ThumbsUp, X, RefreshCw, History, AlertTriangle, XCircle, Pencil, Save, ArrowRightLeft } from 'lucide-react';

interface CouncilBoardProps {
  activeStep: PathStepData;
  people: Person[];
  tasks: Task[];
  onAddPerson: (name: string, status: Person['status'], phone?: string) => void;
  onUpdatePerson: (id: string, name: string, phone?: string) => void;
  onMovePerson: (id: string, stepId: string) => void;
  onDeletePerson: (id: string) => void;
  onRestorePerson: (id: string) => void;
  onPermanentlyDeletePerson: (id: string) => void;
  onAddTask: (personId: string, org: OrgType, description: string) => void;
  onUpdateTask: (taskId: string, description: string, assignedToOrg: OrgType) => void;
  onUpdateTaskStatus: (taskId: string, isCompleted: boolean) => void;
  onAddTaskNote: (taskId: string, author: string, text: string) => void;
}

type TabMode = 'coordination' | 'organizations' | 'council';

const CouncilBoard: React.FC<CouncilBoardProps> = ({ 
  activeStep, 
  people, 
  tasks, 
  onAddPerson,
  onUpdatePerson,
  onMovePerson,
  onDeletePerson,
  onRestorePerson,
  onPermanentlyDeletePerson,
  onAddTask,
  onUpdateTask,
  onUpdateTaskStatus,
  onAddTaskNote
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('coordination');
  const [selectedOrgId, setSelectedOrgId] = useState<OrgType>('RS');
  
  // Form States
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonPhone, setNewPersonPhone] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedPersonForTask, setSelectedPersonForTask] = useState<string>('');
  const [selectedOrgForTask, setSelectedOrgForTask] = useState<OrgType>('EQ');
  const [noteText, setNoteText] = useState('');
  const [activeNoteTaskId, setActiveNoteTaskId] = useState<string | null>(null);

  // States for Editing Person
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editPersonName, setEditPersonName] = useState('');
  const [editPersonPhone, setEditPersonPhone] = useState('');
  const [editPersonStep, setEditPersonStep] = useState('');

  // States for Editing Task
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskDesc, setEditTaskDesc] = useState('');
  const [editTaskOrg, setEditTaskOrg] = useState<OrgType>('EQ');

  // States for "Keep Working" Modal
  const [reassigningPersonId, setReassigningPersonId] = useState<string | null>(null);
  const [reassignDesc, setReassignDesc] = useState('');
  const [reassignOrg, setReassignOrg] = useState<OrgType>('EQ');

  // State for Delete Confirmation Modal (Soft Delete)
  const [personToDelete, setPersonToDelete] = useState<{id: string, name: string} | null>(null);

  // State for Permanent Delete Confirmation Modal (Hard Delete)
  const [personToPermanentlyDelete, setPersonToPermanentlyDelete] = useState<{id: string, name: string} | null>(null);

  // State for Deleted View
  const [showArchived, setShowArchived] = useState(false);

  // Filter people: Show active by default, or archived if toggled in specific view
  const filteredPeople = people.filter(p => p.currentStep === activeStep.id && p.status !== 'Archivado');
  const archivedPeople = people.filter(p => p.status === 'Archivado');
  
  // Filter tasks: Only show tasks for people who are NOT archived
  const archivedPersonIds = archivedPeople.map(p => p.id);
  const activeTasks = tasks.filter(t => !archivedPersonIds.includes(t.personId));

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      onAddPerson(newPersonName, 'Amigo/Investigador', newPersonPhone.trim());
      setNewPersonName('');
      setNewPersonPhone('');
    }
  };

  const startEditingPerson = (p: Person) => {
    setEditingPersonId(p.id);
    setEditPersonName(p.name);
    setEditPersonPhone(p.phone || '');
    setEditPersonStep(p.currentStep);
  };

  const saveEditedPerson = () => {
    if (editingPersonId && editPersonName.trim()) {
      // 1. Update basic info
      onUpdatePerson(editingPersonId, editPersonName, editPersonPhone);
      
      // 2. Check if step changed
      const originalPerson = people.find(p => p.id === editingPersonId);
      if (originalPerson && originalPerson.currentStep !== editPersonStep) {
        onMovePerson(editingPersonId, editPersonStep);
      }
      
      setEditingPersonId(null);
    }
  };

  const cancelEditPerson = () => {
    setEditingPersonId(null);
  };

  const startEditingTask = (t: Task) => {
    setEditingTaskId(t.id);
    setEditTaskDesc(t.description);
    setEditTaskOrg(t.assignedToOrg);
  };

  const saveEditedTask = () => {
    if (editingTaskId && editTaskDesc.trim()) {
      onUpdateTask(editingTaskId, editTaskDesc, editTaskOrg);
      setEditingTaskId(null);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskDesc.trim() && selectedPersonForTask) {
      onAddTask(selectedPersonForTask, selectedOrgForTask, newTaskDesc);
      setNewTaskDesc('');
      setSelectedPersonForTask('');
    }
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reassigningPersonId && reassignDesc.trim()) {
      onAddTask(reassigningPersonId, reassignOrg, reassignDesc);
      setReassigningPersonId(null);
      setReassignDesc('');
      alert("Tarea creada exitosamente. La persona continúa en progreso.");
    }
  };

  const handleAddNote = (taskId: string) => {
    if (noteText.trim()) {
      const orgName = ORGANIZATIONS.find(o => o.id === selectedOrgId)?.name || 'Líder';
      onAddTaskNote(taskId, orgName, noteText);
      setNoteText('');
      setActiveNoteTaskId(null);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setPersonToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (personToDelete) {
      onDeletePerson(personToDelete.id);
      setPersonToDelete(null);
    }
  };

  const confirmPermanentDelete = () => {
    if (personToPermanentlyDelete) {
      onPermanentlyDeletePerson(personToPermanentlyDelete.id);
      setPersonToPermanentlyDelete(null);
    }
  };

  // Helper to count pending tasks per org (only for active people)
  const getNotificationCount = (orgId: OrgType) => {
    return activeTasks.filter(t => t.assignedToOrg === orgId && !t.isCompleted).length;
  };

  // Reusable Edit Form Component for Person
  const PersonEditForm = () => (
    <div className="flex flex-col gap-2 bg-blue-50 p-2 rounded border border-blue-200">
      <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
      <input 
        type="text" 
        value={editPersonName} 
        onChange={(e) => setEditPersonName(e.target.value)}
        className="text-sm border rounded px-2 py-1 w-full"
        placeholder="Nombre"
      />
      
      <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
      <input 
        type="tel" 
        value={editPersonPhone} 
        onChange={(e) => setEditPersonPhone(e.target.value)}
        className="text-sm border rounded px-2 py-1 w-full"
        placeholder="WhatsApp"
      />

      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
         <ArrowRightLeft size={10} /> Mover a Etapa
      </label>
      <select
        value={editPersonStep}
        onChange={(e) => setEditPersonStep(e.target.value)}
        className="text-sm border rounded px-2 py-1 w-full"
      >
        {COVENANT_PATH_STEPS.map(step => (
          <option key={step.id} value={step.id}>{step.title}</option>
        ))}
      </select>

      <div className="flex gap-2 justify-end mt-2">
        <button onClick={saveEditedPerson} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-green-700 shadow-sm font-semibold">
          <Save size={12} /> Guardar Cambios
        </button>
        <button onClick={cancelEditPerson} className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300">
          Cancelar
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden relative">
      
      {/* --- TAB NAVIGATION --- */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button 
          onClick={() => setActiveTab('coordination')}
          className={`flex-1 py-4 px-2 text-sm font-semibold flex flex-col items-center justify-center gap-1 border-b-2 transition-colors ${activeTab === 'coordination' ? 'border-lds-blue text-lds-blue bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users size={18} />
          <span>Coordinación</span>
          <span className="text-[10px] font-normal text-gray-400">Asignar Tareas</span>
        </button>
        <button 
          onClick={() => setActiveTab('organizations')}
          className={`flex-1 py-4 px-2 text-sm font-semibold flex flex-col items-center justify-center gap-1 border-b-2 transition-colors relative ${activeTab === 'organizations' ? 'border-lds-blue text-lds-blue bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <div className="relative">
             <Bell size={18} />
             {activeTasks.filter(t => !t.isCompleted).length > 0 && (
               <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
             )}
          </div>
          <span>Organizaciones</span>
          <span className="text-[10px] font-normal text-gray-400">Ver Notificaciones</span>
        </button>
        <button 
          onClick={() => setActiveTab('council')}
          className={`flex-1 py-4 px-2 text-sm font-semibold flex flex-col items-center justify-center gap-1 border-b-2 transition-colors ${activeTab === 'council' ? 'border-lds-blue text-lds-blue bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <TrendingUp size={18} />
          <span>Consejo de Barrio</span>
          <span className="text-[10px] font-normal text-gray-400">Revisión y Logros</span>
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        
        {/* --- VIEW 1: COORDINATION --- */}
        {activeTab === 'coordination' && (
          <div className="space-y-8">
            {/* Header Context */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <h3 className="font-bold text-lds-blue text-sm uppercase flex items-center gap-2">
                <ClipboardList size={16}/> Reunión de Coordinación: {activeStep.title}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{activeStep.meetingFocus}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Person Column */}
              <div>
                <h4 className="font-bold text-gray-700 mb-3">1. Personas en Progreso</h4>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                  <form onSubmit={handleAddPerson} className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="Nombre de persona/familia..."
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-lds-blue outline-none"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="tel" 
                        placeholder="WhatsApp (con código país)..."
                        value={newPersonPhone}
                        onChange={(e) => setNewPersonPhone(e.target.value)}
                        className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-lds-blue outline-none"
                      />
                      <button type="submit" className="bg-lds-blue text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center">
                        <Plus size={18} />
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="space-y-2">
                  {filteredPeople.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No hay personas registradas en esta etapa.</p>
                  ) : (
                    filteredPeople.map(p => (
                      <div key={p.id} className="bg-white p-3 rounded border-l-4 border-lds-gold shadow-sm group">
                        
                        {/* VIEW MODE or EDIT MODE for Person */}
                        {editingPersonId === p.id ? (
                           <PersonEditForm />
                        ) : (
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800">{p.name}</p>
                                <button 
                                  onClick={() => startEditingPerson(p)}
                                  className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Editar datos y mover etapa"
                                >
                                  <Pencil size={12} />
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {p.phone && (
                                  <a 
                                    href={`https://wa.me/${p.phone.replace(/\D/g, '')}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-green-500 hover:text-green-600 transition-colors flex items-center gap-1"
                                    title={`Enviar WhatsApp a ${p.name}`}
                                  >
                                    <MessageCircle size={14} className="fill-green-100" />
                                    <span className="text-xs text-green-600">{p.phone}</span>
                                  </a>
                                )}
                              </div>
                              <span className="text-[10px] uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-500 mt-1 inline-block">{p.status}</span>
                            </div>
                            <button 
                              onClick={() => setSelectedPersonForTask(p.id)}
                              className={`text-xs px-3 py-1 rounded transition-colors ${selectedPersonForTask === p.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            >
                              {selectedPersonForTask === p.id ? 'Seleccionado' : 'Asignar'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Assign Task Column */}
              <div className="border-l pl-0 md:pl-6 border-gray-200 flex flex-col">
                <h4 className="font-bold text-gray-700 mb-3">2. Asignar Tareas a Organizaciones</h4>
                {selectedPersonForTask ? (
                   <>
                   <div className="bg-white p-4 rounded-lg shadow-lg border border-blue-200">
                      <p className="text-sm text-gray-500 mb-2">Nueva asignación para: <span className="font-bold text-gray-800">{people.find(p => p.id === selectedPersonForTask)?.name}</span></p>
                      <form onSubmit={handleAddTask} className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Organización Responsable</label>
                          <select 
                            value={selectedOrgForTask}
                            onChange={(e) => setSelectedOrgForTask(e.target.value as OrgType)}
                            className="w-full text-sm border border-gray-300 rounded px-3 py-2"
                          >
                            {ORGANIZATIONS.map(org => (
                              <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Descripción de la Tarea</label>
                          <textarea 
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            placeholder="Ej: Visitar para invitar a la capilla..."
                            className="w-full text-sm border border-gray-300 rounded px-3 py-2 h-20 resize-none"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button 
                            type="button" 
                            onClick={() => setSelectedPersonForTask('')}
                            className="text-gray-500 text-xs hover:text-gray-700"
                          >
                            Cerrar
                          </button>
                          <button type="submit" className="bg-lds-gold text-white text-sm px-4 py-2 rounded hover:bg-yellow-600 font-semibold">
                            Crear Asignación
                          </button>
                        </div>
                      </form>
                   </div>
                   
                   {/* EXISTING TASKS EDIT SECTION */}
                   <div className="mt-6">
                      <h5 className="text-sm font-bold text-gray-600 mb-2 border-b pb-1">Tareas Existentes de {people.find(p => p.id === selectedPersonForTask)?.name}</h5>
                      <div className="space-y-2">
                        {activeTasks.filter(t => t.personId === selectedPersonForTask).length === 0 ? (
                           <p className="text-xs text-gray-400 italic">No tiene tareas activas.</p>
                        ) : (
                          activeTasks.filter(t => t.personId === selectedPersonForTask).map(task => (
                             <div key={task.id} className="bg-white border border-gray-200 rounded p-3 text-sm shadow-sm">
                                {editingTaskId === task.id ? (
                                   <div className="space-y-2">
                                      <select 
                                        value={editTaskOrg}
                                        onChange={(e) => setEditTaskOrg(e.target.value as OrgType)}
                                        className="w-full text-xs border border-gray-300 rounded p-1"
                                      >
                                        {ORGANIZATIONS.map(org => (
                                          <option key={org.id} value={org.id}>{org.name}</option>
                                        ))}
                                      </select>
                                      <textarea 
                                        value={editTaskDesc}
                                        onChange={(e) => setEditTaskDesc(e.target.value)}
                                        className="w-full text-xs border border-gray-300 rounded p-1 resize-none h-16"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingTaskId(null)} className="text-xs text-gray-500">Cancelar</button>
                                        <button onClick={saveEditedTask} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Guardar</button>
                                      </div>
                                   </div>
                                ) : (
                                   <div className="flex justify-between items-start">
                                      <div>
                                         <p className="text-gray-800">{task.description}</p>
                                         <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${ORGANIZATIONS.find(o => o.id === task.assignedToOrg)?.color.split(' ')[0]} ${ORGANIZATIONS.find(o => o.id === task.assignedToOrg)?.color.split(' ')[1]}`}>
                                            {ORGANIZATIONS.find(o => o.id === task.assignedToOrg)?.name}
                                         </span>
                                      </div>
                                      <button onClick={() => startEditingTask(task)} className="text-gray-400 hover:text-blue-500">
                                         <Pencil size={12} />
                                      </button>
                                   </div>
                                )}
                             </div>
                          ))
                        )}
                      </div>
                   </div>
                   </>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                    <ClipboardList size={32} className="mb-2 opacity-50"/>
                    <p className="text-xs">Selecciona una persona de la lista para asignar o editar tareas.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: ORGANIZATIONS --- */}
        {activeTab === 'organizations' && (
          <div className="flex flex-col md:flex-row h-full gap-6">
            {/* Sidebar Org Selector */}
            <div className="w-full md:w-1/3 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Seleccionar Organización</h3>
              {ORGANIZATIONS.map(org => {
                const count = getNotificationCount(org.id);
                return (
                  <button
                    key={org.id}
                    onClick={() => setSelectedOrgId(org.id)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between border transition-all ${selectedOrgId === org.id ? `bg-white border-lds-blue ring-1 ring-lds-blue shadow-md` : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <span className="text-sm font-medium text-gray-700">{org.name}</span>
                    {count > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {count} Tareas
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Task List for Org */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
               <div className={`p-4 border-b ${ORGANIZATIONS.find(o => o.id === selectedOrgId)?.color.split(' ')[0]}`}>
                 <h2 className="font-bold text-gray-800 flex items-center gap-2">
                   Tareas Asignadas: {ORGANIZATIONS.find(o => o.id === selectedOrgId)?.name}
                 </h2>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeTasks.filter(t => t.assignedToOrg === selectedOrgId).length === 0 ? (
                     <div className="text-center py-10 text-gray-400">
                        <p>No hay tareas activas asignadas actualmente.</p>
                        <p className="text-xs mt-2">Las tareas de personas eliminadas se encuentran archivadas.</p>
                     </div>
                  ) : (
                    activeTasks.filter(t => t.assignedToOrg === selectedOrgId).map(task => {
                       const person = people.find(p => p.id === task.personId);
                       const personName = person?.name || 'Desconocido';
                       return (
                         <div key={task.id} className={`p-4 rounded-lg border ${task.isCompleted ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-300 shadow-sm'}`}>
                           <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1">
                                  Para: {personName}
                                  {person?.phone && (
                                    <a href={`https://wa.me/${person.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-600">
                                      <MessageCircle size={10} className="fill-green-100" />
                                    </a>
                                  )}
                                </span>
                                <p className={`text-sm mt-1 ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                  {task.description}
                                </p>
                              </div>
                              <button 
                                onClick={() => onUpdateTaskStatus(task.id, !task.isCompleted)}
                                className={`p-1 rounded-full ${task.isCompleted ? 'text-green-600 bg-green-100' : 'text-gray-300 hover:text-green-600 hover:bg-green-50'}`}
                              >
                                {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                              </button>
                           </div>

                           {/* Notes Section */}
                           <div className="mt-4 pt-3 border-t border-gray-100">
                              {task.notes.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {task.notes.map(note => (
                                    <div key={note.id} className="text-xs bg-gray-50 p-2 rounded">
                                      <span className="font-bold text-gray-700">{note.author}:</span> <span className="text-gray-600">{note.text}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {activeNoteTaskId === task.id ? (
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text" 
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                                    placeholder="Agregar reporte..."
                                    autoFocus
                                  />
                                  <button onClick={() => handleAddNote(task.id)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Guardar</button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setActiveNoteTaskId(task.id)}
                                  className="text-xs flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  <MessageSquare size={12} /> Agregar Nota/Reporte
                                </button>
                              )}
                           </div>
                         </div>
                       );
                    })
                  )}
               </div>
            </div>
          </div>
        )}

        {/* --- VIEW 3: COUNCIL REVIEW --- */}
        {activeTab === 'council' && !showArchived && (
          <div className="space-y-6">
            <div className="bg-lds-slate text-white p-6 rounded-xl shadow-md text-center">
              <h2 className="text-2xl font-light">Consejo de Barrio</h2>
              <p className="text-gray-300 text-sm mt-2">Revisión de progreso en la Senda de los Convenios</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Achievements */}
               <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-green-700 flex items-center gap-2 mb-4">
                    <CheckCircle2 size={20} /> Logros Recientes
                  </h3>
                  <div className="space-y-3">
                    {activeTasks.filter(t => t.isCompleted).length === 0 ? (
                      <p className="text-gray-400 text-sm">Aún no hay tareas completadas visibles.</p>
                    ) : (
                      activeTasks.filter(t => t.isCompleted).map(t => {
                        const person = people.find(p => p.id === t.personId);
                        const org = ORGANIZATIONS.find(o => o.id === t.assignedToOrg);
                        return (
                          <div key={t.id} className="flex gap-3 items-start pb-3 border-b border-gray-100 last:border-0">
                            <div className={`mt-1 w-2 h-2 rounded-full ${org?.color.split(' ')[0].replace('bg-', 'bg-') || 'bg-gray-400'}`}></div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{person?.name} <span className="font-normal text-gray-500">- {t.description}</span></p>
                              {t.notes.length > 0 && <p className="text-xs text-gray-500 mt-1 italic">"{t.notes[t.notes.length-1].text}"</p>}
                              <span className="text-[10px] text-gray-400 uppercase">{org?.name}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
               </div>

               {/* Pending Actions Overview */}
               <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-orange-600 flex items-center gap-2 mb-4">
                     <Bell size={20} /> Pendientes por Organización
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ORGANIZATIONS.map(org => {
                       const pending = getNotificationCount(org.id);
                       if(pending === 0) return null;
                       return (
                         <div key={org.id} className={`p-3 rounded border ${org.color}`}>
                           <span className="block text-2xl font-bold">{pending}</span>
                           <span className="text-xs uppercase">{org.name}</span>
                         </div>
                       )
                    })}
                    {activeTasks.filter(t => !t.isCompleted).length === 0 && (
                      <p className="col-span-2 text-gray-400 text-sm">¡Excelente! No hay tareas pendientes visibles.</p>
                    )}
                  </div>
               </div>
            </div>

            {/* --- REVIEW PEOPLE SECTION (Iterate all steps) --- */}
            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700 text-xl flex items-center gap-2">
                  <Users size={24} /> Revisión General de la Senda
                </h3>
                <button 
                  onClick={() => setShowArchived(true)}
                  className="text-xs text-gray-500 flex items-center gap-1 hover:text-red-600 transition-colors px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm group"
                >
                  <Trash2 size={12} className="group-hover:text-red-600" /> 
                  Ver Papelera
                  {archivedPeople.length > 0 && (
                    <span className="bg-red-100 text-red-600 px-1.5 rounded-full text-[10px] font-bold">{archivedPeople.length}</span>
                  )}
                </button>
              </div>
              
              {people.filter(p => p.status !== 'Archivado').length === 0 && (
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-400">
                  No hay personas en seguimiento actualmente.
                </div>
              )}

              {COVENANT_PATH_STEPS.map(step => {
                 const stepPeople = people.filter(p => p.currentStep === step.id && p.status !== 'Archivado');
                 if (stepPeople.length === 0) return null;

                 return (
                    <div key={step.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-lds-blue"></div>
                        <div className="flex items-center gap-2 mb-4 text-lds-blue">
                           <div className="p-1.5 bg-blue-50 rounded-full">
                              {step.icon}
                           </div>
                           <h4 className="font-bold text-lg">{step.title}</h4>
                        </div>

                        <div className="space-y-3 pl-2">
                            {stepPeople.map(p => (
                              <div key={p.id} className="bg-gray-50 border border-gray-100 rounded-lg hover:shadow-md transition-shadow group p-3">
                                {editingPersonId === p.id ? (
                                  <PersonEditForm />
                                ) : (
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div className="mb-2 sm:mb-0">
                                      <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-800 flex items-center gap-2">
                                          {p.name}
                                          {p.phone && (
                                              <a href={`https://wa.me/${p.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <MessageCircle size={14} className="fill-green-100" />
                                              </a>
                                          )}
                                        </p>
                                        <button 
                                          onClick={() => startEditingPerson(p)}
                                          className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="Editar datos y mover etapa"
                                        >
                                          <Pencil size={12} />
                                        </button>
                                      </div>
                                      <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{p.status}</span>
                                    </div>
                                    <div className="flex gap-2">
                                       {/* Seguir Trabajando */}
                                       <button 
                                         onClick={() => {
                                           setReassigningPersonId(p.id);
                                           setReassignDesc(''); 
                                         }}
                                         className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded hover:bg-green-100 border border-green-200"
                                       >
                                         <ThumbsUp size={14} /> Seguir trabajando
                                       </button>
                                       
                                       {/* Borrar */}
                                       <button 
                                          onClick={() => handleDeleteClick(p.id, p.name)}
                                          className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-white text-gray-400 text-xs font-semibold rounded hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-colors"
                                          title="Eliminar y mover a papelera"
                                       >
                                         <Trash2 size={14} />
                                       </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                    </div>
                 )
              })}
            </div>
          </div>
        )}

        {/* --- VIEW 4: DELETED / ARCHIVED PEOPLE --- */}
        {activeTab === 'council' && showArchived && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setShowArchived(false)} className="text-sm text-lds-blue hover:underline">
                ← Volver al Consejo
              </button>
              <h2 className="text-lg font-bold text-gray-700">Papelera / Eliminados</h2>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
               {archivedPeople.length === 0 ? (
                 <p className="text-gray-400 text-sm text-center py-8">No hay personas eliminadas recientemente.</p>
               ) : (
                 <div className="space-y-3">
                   {archivedPeople.map(p => (
                     <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded opacity-75 gap-3">
                        <div>
                           <p className="font-bold text-gray-600 line-through">{p.name}</p>
                           <span className="text-xs text-gray-400 block">{p.currentStep}</span>
                           <span className="text-[10px] text-red-400 italic">Información y tareas ocultas</span>
                        </div>
                        <div className="flex items-center gap-2">
                           {p.previousStatus && (
                             <span className="hidden sm:inline text-[10px] text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
                               Estado anterior: {p.previousStatus}
                             </span>
                           )}
                           <button 
                            onClick={() => onRestorePerson(p.id)}
                            className="flex-1 sm:flex-none text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded flex items-center justify-center gap-1 hover:bg-blue-200"
                          >
                            <RefreshCw size={12} /> Restaurar
                          </button>
                           <button 
                            onClick={() => setPersonToPermanentlyDelete({id: p.id, name: p.name})}
                            className="flex-1 sm:flex-none text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded flex items-center justify-center gap-1 hover:bg-red-200"
                          >
                            <XCircle size={12} /> Eliminar Definitivamente
                          </button>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
        )}

      </div>

      {/* --- MODAL FOR REASSIGNMENT (Keep Working) --- */}
      {reassigningPersonId && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <History className="text-green-600"/> Seguir Trabajando
                </h3>
                <button onClick={() => setReassigningPersonId(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
             </div>
             
             <p className="text-sm text-gray-600 mb-4">
               Define el siguiente paso para: <span className="font-bold text-gray-800">{people.find(p => p.id === reassigningPersonId)?.name}</span>.
             </p>

             <form onSubmit={handleReassignSubmit} className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Organización Responsable</label>
                   <select 
                     value={reassignOrg}
                     onChange={(e) => setReassignOrg(e.target.value as OrgType)}
                     className="w-full border border-gray-300 rounded p-2 text-sm"
                   >
                     {ORGANIZATIONS.map(o => (
                       <option key={o.id} value={o.id}>{o.name}</option>
                     ))}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nueva Tarea / Tarea a Repetir</label>
                   <textarea 
                     value={reassignDesc}
                     onChange={(e) => setReassignDesc(e.target.value)}
                     className="w-full border border-gray-300 rounded p-2 text-sm h-20"
                     placeholder="Ej: Volver a invitar a los misioneros..."
                     autoFocus
                     required
                   />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                   <button 
                     type="button" 
                     onClick={() => setReassigningPersonId(null)}
                     className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit"
                     className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700"
                   >
                     Guardar y Continuar
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* --- MODAL FOR SOFT DELETE CONFIRMATION --- */}
      {personToDelete && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex items-center gap-3 text-red-600 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
             </div>
             
             <p className="text-sm text-gray-600 mb-6">
               ¿Estás seguro de que deseas retirar a <span className="font-bold text-gray-900">{personToDelete.name}</span>?
               <br/><br/>
               Su información y tareas se ocultarán del tablero principal y solo estarán visibles en la opción <b>"Ver Papelera"</b>.
             </p>

             <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setPersonToDelete(null)}
                  className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded font-medium"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-700 shadow-sm"
                >
                  Sí, mover a papelera
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- MODAL FOR PERMANENT DELETE CONFIRMATION --- */}
      {personToPermanentlyDelete && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 border-2 border-red-100">
             <div className="flex items-center gap-3 text-red-700 mb-4">
                <div className="p-2 bg-red-200 rounded-full">
                  <XCircle size={24} />
                </div>
                <h3 className="font-bold text-lg">Eliminación Definitiva</h3>
             </div>
             
             <p className="text-sm text-gray-600 mb-6">
               ¡Atención! Estás a punto de borrar definitivamente a <span className="font-bold text-gray-900">{personToPermanentlyDelete.name}</span>.
               <br/><br/>
               <span className="font-semibold text-red-600">Esta acción no se puede deshacer.</span> Se perderá todo el historial de tareas y notas asociado.
             </p>

             <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setPersonToPermanentlyDelete(null)}
                  className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded font-medium"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmPermanentDelete}
                  className="px-4 py-2 bg-red-700 text-white text-sm font-bold rounded hover:bg-red-800 shadow-sm"
                >
                  Sí, eliminar definitivamente
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CouncilBoard;