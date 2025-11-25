import React, { useState, useEffect } from 'react';
import CovenantPath from './components/CovenantPath';
import CouncilBoard from './components/CouncilBoard';
import AIAssistant from './components/AIAssistant';
import { COVENANT_PATH_STEPS } from './constants';
import { PathStepData, Person, Task, OrgType, TaskNote } from './types';
import { LayoutDashboard, MessageSquareText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Just kidding, using simple random string for demo

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState<PathStepData>(COVENANT_PATH_STEPS[0]);
  const [showChat, setShowChat] = useState(false);

  // --- APP STATE (Database simulation) ---
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Familia Ramírez', status: 'Amigo/Investigador', currentStep: 'baptism', phone: '51999999999' },
    { id: '2', name: 'Jorge González', status: 'Menos Activo', currentStep: 'ordination' },
    { id: '3', name: 'Ana Silva', status: 'Nuevo Converso', currentStep: 'endowment', phone: '15551234567' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 't1', 
      personId: '1', 
      assignedToOrg: 'EQ', 
      description: 'Invitar a Noche de Hogar', 
      isCompleted: false, 
      createdAt: new Date().toISOString(),
      notes: [] 
    },
    { 
      id: 't2', 
      personId: '1', 
      assignedToOrg: 'PRI', 
      description: 'Integrar a los hijos en la clase de Valientes', 
      isCompleted: true, 
      createdAt: new Date().toISOString(),
      notes: [{ id: 'n1', author: 'Pres. Primaria', text: 'Los niños asistieron el domingo pasado y se sintieron muy bien.', date: new Date().toISOString() }] 
    }
  ]);

  // --- ACTIONS ---

  const addPerson = (name: string, status: Person['status'], phone?: string) => {
    const newPerson: Person = {
      id: generateId(),
      name,
      status,
      currentStep: activeStep.id,
      phone
    };
    setPeople([...people, newPerson]);
  };

  const updatePerson = (id: string, name: string, phone?: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, name, phone } : p));
  };

  const movePersonToStep = (id: string, stepId: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, currentStep: stepId } : p));
  };

  const deletePerson = (personId: string) => {
    // Soft delete: Change status to 'Archivado' and save previous status
    setPeople(people.map(p => {
      if (p.id === personId) {
        return { 
          ...p, 
          status: 'Archivado',
          previousStatus: p.status as Person['previousStatus'] // Save current status before archiving
        };
      }
      return p;
    }));
  };

  const restorePerson = (personId: string) => {
    // Restore to previous status or default to 'Menos Activo'
    setPeople(people.map(p => {
      if (p.id === personId) {
        return { 
          ...p, 
          status: p.previousStatus || 'Menos Activo', 
          previousStatus: undefined 
        };
      }
      return p;
    }));
  };

  const permanentlyDeletePerson = (personId: string) => {
    // Hard delete: Remove person and their tasks completely
    setPeople(people.filter(p => p.id !== personId));
    setTasks(tasks.filter(t => t.personId !== personId));
  };

  const addTask = (personId: string, org: OrgType, description: string) => {
    const newTask: Task = {
      id: generateId(),
      personId,
      assignedToOrg: org,
      description,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      notes: []
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, description: string, assignedToOrg: OrgType) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, description, assignedToOrg } : t));
  };

  const updateTaskStatus = (taskId: string, isCompleted: boolean) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted } : t));
  };

  const addTaskNote = (taskId: string, author: string, text: string) => {
    const newNote: TaskNote = {
      id: generateId(),
      author,
      text,
      date: new Date().toISOString()
    };
    setTasks(tasks.map(t => t.id === taskId ? { ...t, notes: [...t.notes, newNote] } : t));
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-900 pb-20">
      
      {/* Header */}
      <header className="bg-lds-blue text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-lds-gold" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Consejo de Barrio</h1>
              <p className="text-xs text-blue-200">Gestión de la Senda de los Convenios</p>
            </div>
          </div>
          <button 
            onClick={() => setShowChat(!showChat)}
            className="lg:hidden p-2 text-white hover:bg-blue-800 rounded-full"
          >
            <MessageSquareText />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top: The Journey Map */}
        <section className="mb-8">
          <CovenantPath 
            selectedStep={activeStep} 
            onSelectStep={setActiveStep} 
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto">
          
          {/* Left/Center (2 cols): Functional Board */}
          <div className="lg:col-span-2 min-h-[600px]">
             <CouncilBoard 
                activeStep={activeStep}
                people={people}
                tasks={tasks}
                onAddPerson={addPerson}
                onUpdatePerson={updatePerson}
                onMovePerson={movePersonToStep}
                onDeletePerson={deletePerson}
                onRestorePerson={restorePerson}
                onPermanentlyDeletePerson={permanentlyDeletePerson}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onUpdateTaskStatus={updateTaskStatus}
                onAddTaskNote={addTaskNote}
             />
          </div>

          {/* Right (1 col): AI Tools / Assistant */}
          <div className={`fixed inset-0 lg:static lg:block z-50 lg:z-auto bg-black/50 lg:bg-transparent p-4 lg:p-0 flex items-center justify-center lg:items-start ${showChat ? 'block' : 'hidden'}`}>
             <div className="w-full max-w-md lg:max-w-none h-full lg:h-auto" onClick={(e) => e.stopPropagation()}>
                {/* Mobile Close Button */}
                <button 
                  onClick={() => setShowChat(false)}
                  className="lg:hidden absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full"
                >
                  X
                </button>
                <AIAssistant />
             </div>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="text-center py-6 text-gray-400 text-xs">
        <p>Esta herramienta es un recurso de coordinación y no reemplaza los registros oficiales de LCR.</p>
      </footer>

    </div>
  );
};

export default App;