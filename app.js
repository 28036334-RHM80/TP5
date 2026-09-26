document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRaceSimulator();
    initProducerConsumerSimulator();
    initPhilosophersSimulator();
    initReadersWritersSimulator();
    renderExercises();
    loadProgress();
    setupListeners();
});

// --- STATE ---
const state = {
    answers: {},
    studentInfo: {
        name: '',
        lu: ''
    }
};

// --- DATA ---
const exercisesData = [
    {
        id: 'ej1_seccion_critica',
        type: 'radio',
        question: '¿Qué condición de la sección crítica garantiza que solo un proceso acceda al recurso?',
        biblio: 'Silberschatz Cap. 6.2 (o Diapositivas U5)',
        options: [
            { value: 'exclusion_mutua', label: 'La exclusión mutua impide que múltiples procesos entren a la zona' },
            { value: 'progreso_limitado', label: 'El algoritmo de progreso restringe los ciclos de la unidad de control' },
            { value: 'espera_acotada', label: 'La espera limitada evita la inanición asignando prioridades altas' },
            { value: 'region_virtual', label: 'El sistema reserva previamente una región de memoria inalterable' }
        ]
    },
    {
        id: 'ej2_hardware',
        type: 'radio',
        question: '¿Qué mecanismo por hardware provee una instrucción atómica para gestionar locks?',
        biblio: 'Silberschatz Cap. 6.3 (o Diapositivas U5)',
        options: [
            { value: 'deshabilitar_ints', label: 'El planificador desactiva las interrupciones del microprocesador' },
            { value: 'test_and_set', label: 'La instrucción especial test-and-set bloquea el bus del sistema' },
            { value: 'memoria_cache', label: 'La unidad lógica almacena el hilo en la memoria caché primaria' },
            { value: 'context_switch', label: 'El cambio de contexto guarda el estado del bloque de ejecución' }
        ]
    },
    {
        id: 'ej3_semaforos_tipo',
        type: 'select',
        question: '¿Qué tipo de semáforo se inicializa en N para controlar el acceso a múltiples instancias?',
        biblio: 'Silberschatz Cap. 6.6 (o Diapositivas U5)',
        options: [
            { value: '', label: '-- Seleccionar Tipo --' },
            { value: 'binario', label: 'Semáforo Binario (Mutex lógico)' },
            { value: 'contador', label: 'Semáforo Contador (N recursos)' },
            { value: 'monitor', label: 'Monitor de variables discretas' },
            { value: 'evento', label: 'Variable de Condición reactiva' }
        ]
    },
    {
        id: 'ej4_semaforos_ops',
        type: 'select',
        question: '¿Cuáles son las dos operaciones fundamentales e indivisibles sobre un semáforo?',
        biblio: 'Silberschatz Cap. 6.6 (o Diapositivas U5)',
        options: [
            { value: '', label: '-- Seleccionar Operaciones --' },
            { value: 'read_write', label: 'Operaciones atómicas read() y write()' },
            { value: 'lock_unlock', label: 'Funciones del núcleo lock() y unlock()' },
            { value: 'wait_signal', label: 'Primitivas de control wait() y signal()' },
            { value: 'sleep_wakeup', label: 'Llamadas al sistema sleep() y wakeup()' }
        ]
    },
    {
        id: 'ej5_monitores',
        type: 'radio',
        question: '¿Qué ventaja estructural ofrece un Monitor respecto a los semáforos tradicionales?',
        biblio: 'Silberschatz Cap. 6.7 (o Diapositivas U5)',
        options: [
            { value: 'rendimiento', label: 'Elimina el despachador del núcleo garantizando respuestas rápidas' },
            { value: 'encapsulamiento', label: 'Provee encapsulamiento y exclusión mutua interna en sus métodos' },
            { value: 'distribucion', label: 'Divide los recursos en múltiples hilos mediante paralelismo puro' },
            { value: 'memoria', label: 'Utiliza una pila para gestionar las interrupciones del controlador' }
        ]
    },
    {
        id: 'ej6_productor_consumidor',
        type: 'select',
        question: 'El problema del productor-consumidor clásico, usando 3 semáforos, emplea comúnmente una estructura de tipo:',
        biblio: 'Silberschatz Cap. 6.6 (o Diapositivas U5)',
        options: [
            { value: '', label: '-- Seleccionar Estructura --' },
            { value: 'pila_dinamica', label: 'Pila dinámica con crecimiento' },
            { value: 'cola_prioridad', label: 'Cola de mensajes con prioridad' },
            { value: 'buffer_acotado', label: 'Buffer circular de tamaño fijo' },
            { value: 'memoria_virtual', label: 'Segmento de memoria extendida' }
        ]
    },
    {
        id: 'ej7_filosofos',
        type: 'radio',
        question: '¿Qué situación crítica ejemplifica principalmente el problema clásico de los filósofos comensales?',
        biblio: 'Silberschatz Cap. 6.6 (o Diapositivas U5)',
        options: [
            { value: 'fragmentacion', label: 'La saturación de la memoria generada por paginación bajo demanda' },
            { value: 'deadlock', label: 'El riesgo de interbloqueo cuando todos compiten por un recurso' },
            { value: 'reloj_logico', label: 'La dificultad de sincronizar señales en procesadores distribuidos' },
            { value: 'violacion_segmento', label: 'El error de acceso provocado al leer fuera del límite de memoria' }
        ]
    },
    {
        id: 'ej8_python_lock',
        type: 'dnd',
        question: 'En Python (threading), arrastra la clase que provee exclusión mutua simple (equivalente a semáforo binario) a la zona destino.',
        biblio: 'Python threading docs (o Diapositivas U5)',
        options: [
            { value: 'threading_timer', label: '🧩 threading.Timer' },
            { value: 'threading_lock', label: '🧩 threading.Lock' },
            { value: 'threading_barrier', label: '🧩 threading.Barrier' }
        ]
    },
    {
        id: 'ej9_python_condition',
        type: 'dnd',
        question: 'En Python (threading), arrastra la clase que emula las Variables de Condición de un Monitor (con métodos wait/notify).',
        biblio: 'Python threading docs (o Diapositivas U5)',
        options: [
            { value: 'threading_semaphore', label: '🧩 threading.Semaphore' },
            { value: 'threading_event', label: '🧩 threading.Event' },
            { value: 'threading_condition', label: '🧩 threading.Condition' }
        ]
    },
    {
        id: 'ej10_transacciones',
        type: 'radio',
        question: '¿Qué propiedad de las transacciones garantiza que la secuencia de operaciones se ejecuta completa o no se ejecuta en absoluto?',
        biblio: 'Silberschatz Cap. 6.9 (o Diapositivas U5)',
        options: [
            { value: 'atomicidad', label: 'La propiedad de atomicidad que previene ejecuciones fraccionadas' },
            { value: 'aislamiento', label: 'El nivel de aislamiento que separa procesos en áreas diferentes' },
            { value: 'consistencia', label: 'El factor de consistencia que verifica el estado final del archivo' },
            { value: 'durabilidad', label: 'El atributo de durabilidad que asegura permanencia de los datos' }
        ]
    },
    {
        id: 'ej11_peterson',
        type: 'radio',
        question: '¿Qué variable asegura la espera limitada y evita la postergación indefinida en el Algoritmo de Peterson?',
        biblio: 'Silberschatz Cap. 6.3 (o Diapositivas U5)',
        options: [
            { value: 'flag_array', label: 'El arreglo de banderas booleanas que indica únicamente la intención de entrar' },
            { value: 'interrupcion', label: 'La rutina de servicio que desactiva temporalmente el reloj del procesador' },
            { value: 'turn', label: 'La variable de turno que cede voluntariamente la prioridad en caso de conflicto' },
            { value: 'quantum', label: 'El temporizador del despachador que expulsa a los procesos en espera activa' }
        ]
    },
    {
        id: 'ej12_semaforo_cola',
        type: 'select',
        question: 'En la implementación de semáforos con bloqueo de la cátedra (Diapositiva 18), si S.value = -3, ¿qué indica formalmente?',
        biblio: 'Silberschatz Cap. 6.6 (o Diapositivas U5)',
        options: [
            { value: '', label: '-- Seleccionar Significado --' },
            { value: 'tres_bloqueados', label: 'Que existen exactamente 3 procesos suspendidos en la cola de espera' },
            { value: 'tres_disponibles', label: 'Que el sistema dispone aún de 3 instancias libres del recurso protegido' },
            { value: 'error_overflow', label: 'Que el contador de registros sufrió una falla de subdesbordamiento aritmético' },
            { value: 'tres_ejecutando', label: 'Que hay 3 procesos ejecutando simultáneamente dentro de la sección crítica' }
        ]
    }
];

// --- THEME ---
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('tso_theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('tso_theme', next);
    });
}

// --- RENDER ---
function renderExercises() {
    const container = document.getElementById('exercises-container');
    
    exercisesData.forEach((ej, index) => {
        const el = document.createElement('section');
        el.className = 'card exercise';
        el.id = `section-${ej.id}`;
        
        let content = `
            <div class="exercise-header">
                <h3>Ejercicio ${index + 1}</h3>
                <span class="badge-status" id="badge-${ej.id}">Pendiente</span>
            </div>
            <div class="biblio-hint">📖 ${ej.biblio}</div>
            <p class="question-text">${ej.question}</p>
        `;
        
        if (ej.type === 'radio') {
            content += `<div class="options-grid">`;
            ej.options.forEach(opt => {
                content += `
                    <label class="radio-card" id="label-${ej.id}-${opt.value}">
                        <input type="radio" name="${ej.id}" value="${opt.value}">
                        <span class="radio-text">${opt.label}</span>
                    </label>
                `;
            });
            content += `</div>`;
        } 
        else if (ej.type === 'select') {
            content += `
                <div class="select-wrapper">
                    <select id="${ej.id}" name="${ej.id}">
                        ${ej.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                    </select>
                </div>
            `;
        }
        else if (ej.type === 'dnd') {
            content += `
                <div class="dnd-container">
                    <div class="dnd-target" id="target-${ej.id}">
                        <div class="dnd-target-label">Arrastra aquí tu respuesta</div>
                    </div>
                    <div class="dnd-bank" id="bank-${ej.id}">
                        ${ej.options.map(opt => `<div class="dnd-item" data-value="${opt.value}">${opt.label}</div>`).join('')}
                    </div>
                </div>
            `;
        }
        
        el.innerHTML = content;
        container.appendChild(el);
    });
}

// --- LOGIC ---
function setupListeners() {
    // Inputs del alumno
    const nameInput = document.getElementById('student-name');
    const luInput = document.getElementById('student-lu');
    
    nameInput.addEventListener('input', (e) => {
        state.studentInfo.name = e.target.value;
        saveProgress();
    });
    
    luInput.addEventListener('input', (e) => {
        state.studentInfo.lu = e.target.value;
        saveProgress();
    });
    
    // Ejercicios
    exercisesData.forEach(ej => {
        if (ej.type === 'radio') {
            const inputs = document.querySelectorAll(`input[name="${ej.id}"]`);
            inputs.forEach(input => {
                input.addEventListener('change', (e) => {
                    // Update visual classes
                    document.querySelectorAll(`[id^="label-${ej.id}-"]`).forEach(l => l.classList.remove('selected'));
                    input.parentElement.classList.add('selected');
                    
                    state.answers[ej.id] = e.target.value;
                    updateExerciseStatus(ej.id);
                    saveProgress();
                });
            });
        }
        else if (ej.type === 'select') {
            const select = document.getElementById(ej.id);
            select.addEventListener('change', (e) => {
                state.answers[ej.id] = e.target.value;
                updateExerciseStatus(ej.id);
                saveProgress();
            });
        }
        else if (ej.type === 'dnd') {
            const bank = document.getElementById(`bank-${ej.id}`);
            const target = document.getElementById(`target-${ej.id}`);
            
            new Sortable(bank, {
                group: `shared-${ej.id}`,
                animation: 150
            });
            
            new Sortable(target, {
                group: `shared-${ej.id}`,
                animation: 150,
                onAdd: (evt) => {
                    // Si ya había un elemento, lo devolvemos al banco
                    if (target.children.length > 2) {
                        const oldItem = target.children[1];
                        if (oldItem !== evt.item) {
                            bank.appendChild(oldItem);
                        }
                    }
                    state.answers[ej.id] = evt.item.dataset.value;
                    updateExerciseStatus(ej.id);
                    saveProgress();
                },
                onRemove: () => {
                    if (target.children.length === 1) { // Solo queda el label
                        delete state.answers[ej.id];
                        updateExerciseStatus(ej.id);
                        saveProgress();
                    }
                }
            });
        }
    });
    
    // Export button
    document.getElementById('btn-export').addEventListener('click', exportJSON);
}

function updateExerciseStatus(id) {
    const badge = document.getElementById(`badge-${id}`);
    if (state.answers[id] && state.answers[id] !== '') {
        badge.textContent = '✓ Completado';
        badge.classList.add('completed');
    } else {
        badge.textContent = 'Pendiente';
        badge.classList.remove('completed');
    }
    updateGlobalProgress();
}

function updateGlobalProgress() {
    let completedCount = 0;
    exercisesData.forEach(ej => {
        if (state.answers[ej.id] && state.answers[ej.id] !== '') {
            completedCount++;
        }
    });
    
    const pct = (completedCount / exercisesData.length) * 100;
    document.getElementById('progress-fill').style.width = `${pct}%`;
    document.getElementById('progress-text').textContent = `${Math.round(pct)}% Completado`;
    
    const isReady = completedCount === exercisesData.length && state.studentInfo.name.trim() !== '' && state.studentInfo.lu.trim() !== '';
    const btnExport = document.getElementById('btn-export');
    
    btnExport.disabled = !isReady;
    
    if (isReady && !window.confettiFired) {
        window.confettiFired = true;
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
    if (!isReady) window.confettiFired = false;
}

function saveProgress() {
    localStorage.setItem('tso_tp5_progress', JSON.stringify(state));
    updateGlobalProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('tso_tp5_progress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
            
            // Restore inputs
            document.getElementById('student-name').value = state.studentInfo.name || '';
            document.getElementById('student-lu').value = state.studentInfo.lu || '';
            
            // Restore answers
            exercisesData.forEach(ej => {
                const ans = state.answers[ej.id];
                if (!ans) return;
                
                if (ej.type === 'radio') {
                    const input = document.querySelector(`input[name="${ej.id}"][value="${ans}"]`);
                    if (input) {
                        input.checked = true;
                        input.parentElement.classList.add('selected');
                    }
                }
                else if (ej.type === 'select') {
                    const select = document.getElementById(ej.id);
                    if (select) select.value = ans;
                }
                else if (ej.type === 'dnd') {
                    const target = document.getElementById(`target-${ej.id}`);
                    const item = document.querySelector(`#bank-${ej.id} [data-value="${ans}"]`);
                    if (item && target) {
                        target.appendChild(item);
                    }
                }
                updateExerciseStatus(ej.id);
            });
            updateGlobalProgress();
        } catch (e) {
            console.error('Error loading progress:', e);
        }
    }
}

function exportJSON() {
    const payload = { ...state.answers };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "respuestas_tp5.json");
    dlAnchor.click();
    dlAnchor.remove();
}

// --- SIMULADOR PRODUCTOR CONSUMIDOR (PASO A PASO & BUFFER ACOTADO) ---
function initProducerConsumerSimulator() {
    // DOM Elements
    const scenarioBtns = document.querySelectorAll('.pc-scenario-selector .btn-scenario');
    const btnStep = document.getElementById('btn-pc-step');
    const btnAuto = document.getElementById('btn-pc-auto');
    const btnPrev = document.getElementById('btn-pc-prev');
    const btnReset = document.getElementById('btn-pc-reset');
    const stepIndicator = document.getElementById('pc-step-indicator');
    const speedBtns = document.querySelectorAll('.btn-pc-speed');

    const freeControls = document.getElementById('pc-free-controls');
    const btnFreeProduceStep = document.getElementById('btn-pc-free-produce-step');
    const btnFreeProduceFull = document.getElementById('btn-pc-free-produce-full');
    const btnFreeConsumeStep = document.getElementById('btn-pc-free-consume-step');
    const btnFreeConsumeFull = document.getElementById('btn-pc-free-consume-full');

    const cardProducer = document.getElementById('pc-card-producer');
    const badgeProducerState = document.getElementById('pc-producer-state');
    const valProducerItem = document.getElementById('pc-producer-item');
    const valInDisplay = document.getElementById('pc-in-display');

    const cardConsumer = document.getElementById('pc-card-consumer');
    const badgeConsumerState = document.getElementById('pc-consumer-state');
    const valConsumerItem = document.getElementById('pc-consumer-item');
    const valOutDisplay = document.getElementById('pc-out-display');

    const bufferContainer = document.getElementById('buffer-container');
    const bufferStats = document.getElementById('pc-buffer-stats');

    const semMutexVal = document.getElementById('sem-mutex-val');
    const semMutexQueue = document.getElementById('sem-mutex-queue');
    const semEmptyVal = document.getElementById('sem-empty-val');
    const semEmptyQueue = document.getElementById('sem-empty-queue');
    const semFullVal = document.getElementById('sem-full-val');
    const semFullQueue = document.getElementById('sem-full-queue');

    const stepPill = document.getElementById('pc-step-pill');
    const codeBadge = document.getElementById('pc-code-badge');
    const stepText = document.getElementById('pc-step-text');
    const alertBox = document.getElementById('pc-status-alert');
    const logBox = document.getElementById('pc-log');

    if (!btnStep || !bufferContainer) return;

    let currentScenario = 'basic';
    let currentStep = 0;
    let autoTimer = null;
    let currentSpeed = 1000; // ms per step

    function logPC(msg, type = 'normal') {
        if (!logBox) return;
        const div = document.createElement('div');
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        if (type === 'error') div.style.color = '#ef4444';
        else if (type === 'highlight') div.style.color = '#38bdf8';
        else if (type === 'success') div.style.color = '#10b981';
        else if (type === 'warn') div.style.color = '#f59e0b';
        logBox.appendChild(div);
        logBox.scrollTop = logBox.scrollHeight;
    }

    // --- ESCENARIOS DIDÁCTICOS ---
    const scenarios = {
        // Escenario 1: Ciclo Normal (10 Pasos)
        basic: [
            {
                pill: 'Paso 0',
                code: '// Inicialización de Recursos',
                text: 'Estado inicial: Buffer circular de tamaño N=5 vacío. Semáforos inicializados: <code>mutex = 1</code> (libre), <code>empty = 5</code> (5 espacios libres), <code>full = 0</code> (0 ítems). Punteros <code>in = 0</code>, <code>out = 0</code>.',
                alert: 'Sistema en reposo: Buffer vacío. Hilos Productor y Consumidor esperando.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 0, out: 0, mutex: 1, empty: 5, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: null, slotHighlight: null
                }
            },
            {
                pill: 'Paso 1',
                code: 'item = producir_dato(); // item = 42',
                text: 'El Productor P1 genera un nuevo dato (valor 42) en su espacio de memoria local. El buffer compartido aún no ha sido modificado.',
                alert: 'Productor P1 generó el ítem 42. Se prepara para solicitar acceso al buffer.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 0, out: 0, mutex: 1, empty: 5, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Produciendo (42)' }, pItem: '42',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 2',
                code: 'wait(empty); // empty pasa de 5 a 4',
                text: 'P1 ejecuta <code>wait(empty)</code> para asegurar que haya al menos un slot disponible. Como <code>empty</code> era 5, decrementa a 4 (>= 0). P1 NO se bloquea y avanza de inmediato.',
                alert: 'wait(empty) exitoso. Quedan 4 casilleros libres.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 0, out: 0, mutex: 1, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'wait(empty) OK' }, pItem: '42',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 3',
                code: 'wait(mutex); // mutex pasa de 1 a 0',
                text: 'P1 ejecuta <code>wait(mutex)</code> para adquirir exclusión mutua sobre el buffer compartido. El semáforo binario pasa de 1 a 0. ¡P1 ingresa a la <strong>Sección Crítica</strong>!',
                alert: 'P1 adquirió el Mutex. Buffer bloqueado para otros hilos.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 0, out: 0, mutex: 0, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'sc', txt: 'En Sección Crítica' }, pItem: '42',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 4',
                code: 'buffer[in] = 42; in = (0 + 1) % 5 = 1;',
                text: 'Sección Crítica: P1 deposita el ítem 42 en el casillero <code>buffer[0]</code> y avanza el puntero de inserción <code>in</code> a la posición 1 mediante aritmética modular.',
                alert: 'Ítem 42 depositado en buffer[0]. Puntero in avanza a 1.',
                state: {
                    buffer: [42, null, null, null, null],
                    in: 1, out: 0, mutex: 0, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'sc', txt: 'Escribiendo en buffer[0]' }, pItem: '42',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: { index: 0, type: 'writing' }
                }
            },
            {
                pill: 'Paso 5',
                code: 'signal(mutex); // mutex pasa de 0 a 1',
                text: 'P1 concluye la manipulación de la memoria compartida y ejecuta <code>signal(mutex)</code>. El lock se libera (1) para que cualquier otro proceso pueda acceder al buffer.',
                alert: 'P1 salió de la Sección Crítica. Mutex liberado (1).',
                state: {
                    buffer: [42, null, null, null, null],
                    in: 1, out: 0, mutex: 1, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Sección Crítica cerrada' }, pItem: '—',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 6',
                code: 'signal(full); // full pasa de 0 a 1',
                text: 'P1 ejecuta <code>signal(full)</code>, incrementando el contador de ítems disponibles a 1. Esto notifica al planificador que hay datos listos en el buffer. P1 finaliza su ciclo y vuelve a reposo.',
                alert: 'Nuevo ítem disponible anunciado. Semáforo full = 1.',
                state: {
                    buffer: [42, null, null, null, null],
                    in: 1, out: 0, mutex: 1, empty: 4, full: 1,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo (Ciclo P1 terminado)' }, pItem: '—',
                    cState: { cls: 'idle', txt: 'Listo para consumir' }, cItem: '—',
                    activeThread: null, slotHighlight: null
                }
            },
            {
                pill: 'Paso 7',
                code: 'wait(full); // full pasa de 1 a 0',
                text: 'El Consumidor C1 se activa y ejecuta <code>wait(full)</code> para retirar un ítem. Como <code>full</code> era 1, decrementa a 0 (>= 0). C1 NO se bloquea porque hay 1 ítem disponible.',
                alert: 'Consumidor C1 ejecuta wait(full) exitoso. Quedan 0 ítems disponibles.',
                state: {
                    buffer: [42, null, null, null, null],
                    in: 1, out: 0, mutex: 1, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'idle', txt: 'En reposo' }, pItem: '—',
                    cState: { cls: 'ready', txt: 'wait(full) OK' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 8',
                code: 'wait(mutex); // mutex pasa de 1 a 0',
                text: 'C1 ejecuta <code>wait(mutex)</code> para adquirir acceso exclusivo al buffer compartido. El semáforo <code>mutex</code> pasa a 0. C1 ingresa a su Sección Crítica.',
                alert: 'C1 adquiere Mutex (0). Sección Crítica abierta para lectura.',
                state: {
                    buffer: [42, null, null, null, null],
                    in: 1, out: 0, mutex: 0, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'idle', txt: 'En reposo' }, pItem: '—',
                    cState: { cls: 'sc', txt: 'En Sección Crítica' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 9',
                code: 'item = buffer[out]; out = (0 + 1) % 5 = 1;',
                text: 'Sección Crítica: C1 extrae el valor 42 del casillero <code>buffer[0]</code>, lo retira del buffer dejando el slot vacío, y avanza el puntero de extracción circular <code>out</code> a la posición 1.',
                alert: 'C1 retiró el ítem 42 de buffer[0]. Puntero out avanza a 1.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 1, out: 1, mutex: 0, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'idle', txt: 'En reposo' }, pItem: '—',
                    cState: { cls: 'sc', txt: 'Extrayendo de buffer[0]' }, cItem: '42',
                    activeThread: 'consumer', slotHighlight: { index: 0, type: 'reading' }
                }
            },
            {
                pill: 'Paso 10',
                code: 'signal(mutex); signal(empty); consumir(42);',
                text: 'C1 ejecuta <code>signal(mutex)</code> (mutex=1) y <code>signal(empty)</code> (empty vuelve a 5, indicando que el slot quedó libre). Finalmente procesa el ítem 42. ¡Ciclo sincronizado perfecto sin condiciones de carrera!',
                alert: '¡Ciclo completado con éxito! Buffer vacío, semáforos restaurados.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 1, out: 1, mutex: 1, empty: 5, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'ready', txt: 'Consumió ítem 42' }, cItem: '42',
                    activeThread: null, slotHighlight: null
                }
            }
        ],

        // Escenario 2: Buffer Lleno y Bloqueo del Productor (13 Pasos)
        overflow: [
            {
                pill: 'Paso 0',
                code: '// Buffer casi saturado (4 / 5 ocupados)',
                text: 'Configuración inicial de alta carga: El buffer tiene 4 casilleros ocupados <code>[10, 20, 30, 40, _]</code>. <code>empty = 1</code>, <code>full = 4</code>, <code>mutex = 1</code>. Punteros: <code>in = 4</code>, <code>out = 0</code>.',
                alert: 'Buffer casi saturado (80% ocupado). Queda 1 solo casillero libre.',
                state: {
                    buffer: [10, 20, 30, 40, null],
                    in: 4, out: 0, mutex: 1, empty: 1, full: 4,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: null, slotHighlight: null
                }
            },
            {
                pill: 'Paso 1',
                code: 'item = 50; // P1 produce ítem 50',
                text: 'El Productor P1 genera el dato 50 y se dispone a insertarlo en el último slot libre del buffer.',
                alert: 'P1 generó el ítem 50.',
                state: {
                    buffer: [10, 20, 30, 40, null],
                    in: 4, out: 0, mutex: 1, empty: 1, full: 4,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Produciendo (50)' }, pItem: '50',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 2',
                code: 'wait(empty); wait(mutex); // empty=0, mutex=0',
                text: 'P1 ejecuta <code>wait(empty)</code>. El contador pasa de 1 a 0 (toma el último slot libre). Luego adquiere <code>wait(mutex)</code> (0) para entrar a la Sección Crítica.',
                alert: 'P1 adquiere el último espacio. empty = 0.',
                state: {
                    buffer: [10, 20, 30, 40, null],
                    in: 4, out: 0, mutex: 0, empty: 0, full: 4,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'sc', txt: 'En Sección Crítica' }, pItem: '50',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 3',
                code: 'buffer[4] = 50; in = 0; signal(mutex); signal(full);',
                text: 'P1 inserta 50 en <code>buffer[4]</code>, avanza <code>in</code> a 0 de forma circular, libera el mutex (1) e incrementa <code>full</code> a 5. ¡El buffer está 100% LLENO (5/5)!',
                alert: '¡Buffer 100% LLENO! empty = 0, full = 5.',
                state: {
                    buffer: [10, 20, 30, 40, 50],
                    in: 0, out: 0, mutex: 1, empty: 0, full: 5,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Ciclo terminado' }, pItem: '—',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: null, slotHighlight: { index: 4, type: 'writing' }
                }
            },
            {
                pill: 'Paso 4',
                code: 'item = 99; // Intento de producción con buffer lleno',
                text: 'P1 genera un nuevo dato: <strong>ítem 99</strong>. Como el buffer ya está totalmente colmado, intentará solicitar espacio al semáforo contador <code>empty</code>.',
                alert: 'P1 generó ítem 99 e intentará insertarlo en el buffer saturado.',
                state: {
                    buffer: [10, 20, 30, 40, 50],
                    in: 0, out: 0, mutex: 1, empty: 0, full: 5,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Intentando insertar 99' }, pItem: '99',
                    cState: { cls: 'idle', txt: 'Esperando' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 5',
                code: 'wait(empty); // ¡empty == 0 -> P1 SE BLOQUEA!',
                text: '🛑 <strong>¡BLOQUEO PASIVO DEL HILO!</strong> P1 invoca <code>wait(empty)</code>, pero <code>empty == 0</code> (no hay memoria libre). El núcleo del SO decrementa el semáforo y <strong>suspende el proceso P1</strong>, colocándolo en la <strong>Cola de Bloqueados de Empty</strong>. P1 no consume ciclos de CPU (sin busy-waiting).',
                alert: '🛑 Productor P1 BLOQUEADO en semáforo empty por falta de espacio.',
                state: {
                    buffer: [10, 20, 30, 40, 50],
                    in: 0, out: 0, mutex: 1, empty: 0, full: 5,
                    mutexQ: [], emptyQ: ['Productor P1 (item 99)'], fullQ: [],
                    pState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait empty)' }, pItem: '99',
                    cState: { cls: 'idle', txt: 'Esperando turno' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 6',
                code: '// Dispatcher conmuta contexto a Consumidor C1',
                text: 'Con P1 en estado BLOQUEADO, el planificador del SO realiza un cambio de contexto y despacha al hilo Consumidor C1 para drenar el buffer compartido.',
                alert: 'Planificador de CPU activa a C1 para consumir.',
                state: {
                    buffer: [10, 20, 30, 40, 50],
                    in: 0, out: 0, mutex: 1, empty: 0, full: 5,
                    mutexQ: [], emptyQ: ['Productor P1 (item 99)'], fullQ: [],
                    pState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait empty)' }, pItem: '99',
                    cState: { cls: 'ready', txt: 'Iniciando consumo' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 7',
                code: 'wait(full); wait(mutex); // full=4, mutex=0',
                text: 'C1 ejecuta <code>wait(full)</code> (decrementa de 5 a 4) y adquiere <code>wait(mutex)</code> (0). C1 ingresa a la Sección Crítica.',
                alert: 'C1 ingresa a Sección Crítica. full = 4, mutex = 0.',
                state: {
                    buffer: [10, 20, 30, 40, 50],
                    in: 0, out: 0, mutex: 0, empty: 0, full: 4,
                    mutexQ: [], emptyQ: ['Productor P1 (item 99)'], fullQ: [],
                    pState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait empty)' }, pItem: '99',
                    cState: { cls: 'sc', txt: 'En Sección Crítica' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 8',
                code: 'item = buffer[0]; out = 1; // Retira ítem 10',
                text: 'C1 extrae el ítem 10 del slot <code>buffer[0]</code> y avanza su puntero <code>out</code> a la posición 1. El casillero 0 queda oficialmente liberado.',
                alert: 'Ítem 10 retirado. Casillero 0 liberado.',
                state: {
                    buffer: [null, 20, 30, 40, 50],
                    in: 0, out: 1, mutex: 0, empty: 0, full: 4,
                    mutexQ: [], emptyQ: ['Productor P1 (item 99)'], fullQ: [],
                    pState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait empty)' }, pItem: '99',
                    cState: { cls: 'sc', txt: 'Extrayendo buffer[0]' }, cItem: '10',
                    activeThread: 'consumer', slotHighlight: { index: 0, type: 'reading' }
                }
            },
            {
                pill: 'Paso 9',
                code: 'signal(mutex); // mutex pasa de 0 a 1',
                text: 'C1 concluye su Sección Crítica y ejecuta <code>signal(mutex)</code>. El lock del buffer queda liberado (1).',
                alert: 'Mutex liberado (1) por el consumidor.',
                state: {
                    buffer: [null, 20, 30, 40, 50],
                    in: 0, out: 1, mutex: 1, empty: 0, full: 4,
                    mutexQ: [], emptyQ: ['Productor P1 (item 99)'], fullQ: [],
                    pState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait empty)' }, pItem: '99',
                    cState: { cls: 'ready', txt: 'Salió de SC' }, cItem: '10',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 10',
                code: 'signal(empty); // ¡DESPIERTA A PRODUCTOR P1!',
                text: '🎉 <strong>¡DESPERTAR DEL HILO BLOQUEADO!</strong> C1 ejecuta <code>signal(empty)</code>. El SO revisa la cola de bloqueados del semáforo <code>empty</code> y encuentra a P1 esperando. Extrae a P1 de la cola y cambia su estado a <strong>LISTO (Ready)</strong>. P1 reanuda su ejecución pendiente.',
                alert: '🎉 signal(empty) despertó al Productor P1 de la cola de bloqueados.',
                state: {
                    buffer: [null, 20, 30, 40, 50],
                    in: 0, out: 1, mutex: 1, empty: 0, full: 4,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: '🎉 DESPERTADO (Listo)' }, pItem: '99',
                    cState: { cls: 'ready', txt: 'Consumiendo 10' }, cItem: '10',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 11',
                code: 'wait(mutex); // P1 adquiere lock del buffer',
                text: 'Habiendo superado el <code>wait(empty)</code>, P1 procede inmediatamente a ejecutar <code>wait(mutex)</code> para acceder a la Sección Crítica. Mutex pasa a 0.',
                alert: 'P1 reanudado adquiere Mutex (0).',
                state: {
                    buffer: [null, 20, 30, 40, 50],
                    in: 0, out: 1, mutex: 0, empty: 0, full: 4,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'sc', txt: 'En Sección Crítica' }, pItem: '99',
                    cState: { cls: 'idle', txt: 'En reposo' }, cItem: '10',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 12',
                code: 'buffer[0] = 99; in = 1; // Inserta el ítem pendiente',
                text: 'P1 deposita finalmente el ítem 99 en el slot <code>buffer[0]</code> que C1 acababa de liberar, y avanza el puntero <code>in</code> a 1.',
                alert: 'Ítem 99 depositado con éxito en buffer[0]. in = 1.',
                state: {
                    buffer: [99, 20, 30, 40, 50],
                    in: 1, out: 1, mutex: 0, empty: 0, full: 4,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'sc', txt: 'Escribiendo 99 en buffer[0]' }, pItem: '99',
                    cState: { cls: 'idle', txt: 'En reposo' }, cItem: '10',
                    activeThread: 'producer', slotHighlight: { index: 0, type: 'writing' }
                }
            },
            {
                pill: 'Paso 13',
                code: 'signal(mutex); signal(full); // mutex=1, full=5',
                text: 'P1 libera el mutex (1) e incrementa <code>full</code> a 5. La coordinación por semáforos evitó el desbordamiento de memoria y sincronizó los hilos sin pérdida de datos.',
                alert: 'Sincronización de desbordamiento completada con éxito.',
                state: {
                    buffer: [99, 20, 30, 40, 50],
                    in: 1, out: 1, mutex: 1, empty: 0, full: 5,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'ready', txt: 'Listo' }, cItem: '10',
                    activeThread: null, slotHighlight: null
                }
            }
        ],

        // Escenario 3: Buffer Vacío y Bloqueo del Consumidor (9 Pasos)
        underflow: [
            {
                pill: 'Paso 0',
                code: '// Buffer vacío (0 / 5 ocupados)',
                text: 'Estado inicial: Buffer vacío <code>[ _, _, _, _, _ ]</code>. Semáforos: <code>empty = 5</code>, <code>full = 0</code>, <code>mutex = 1</code>. Punteros <code>in = 0</code>, <code>out = 0</code>.',
                alert: 'Buffer totalmente vacío. full = 0 (sin datos disponibles).',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 0, out: 0, mutex: 1, empty: 5, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'idle', txt: 'En reposo' }, pItem: '—',
                    cState: { cls: 'ready', txt: 'Listo' }, cItem: '—',
                    activeThread: null, slotHighlight: null
                }
            },
            {
                pill: 'Paso 1',
                code: 'wait(full); // ¡full == 0 -> C1 SE BLOQUEA!',
                text: '🛑 <strong>¡BLOQUEO PASIVO DEL CONSUMIDOR!</strong> El Consumidor C1 ejecuta <code>wait(full)</code> para extraer un ítem. Como <code>full == 0</code> (no hay datos), el SO suspende a C1 y lo inserta en la <strong>Cola de Bloqueados de Full</strong>.',
                alert: '🛑 Consumidor C1 BLOQUEADO en semáforo full por ausencia de datos.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 0, out: 0, mutex: 1, empty: 5, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: ['Consumidor C1'],
                    pState: { cls: 'idle', txt: 'En reposo' }, pItem: '—',
                    cState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait full)' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 2',
                code: 'item = 77; // P1 es despachado y produce',
                text: 'Con el consumidor dormido, el despachador de CPU asigna tiempo de cómputo al Productor P1, quien genera el ítem 77.',
                alert: 'Planificador activa a Productor P1. Genera ítem 77.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 0, out: 0, mutex: 1, empty: 5, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: ['Consumidor C1'],
                    pState: { cls: 'ready', txt: 'Produciendo (77)' }, pItem: '77',
                    cState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait full)' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 3',
                code: 'wait(empty); wait(mutex); // empty=4, mutex=0',
                text: 'P1 ejecuta <code>wait(empty)</code> (empty pasa de 5 a 4) y adquiere <code>wait(mutex)</code> (0). P1 ingresa a la Sección Crítica.',
                alert: 'P1 entra a Sección Crítica. empty = 4, mutex = 0.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 0, out: 0, mutex: 0, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: ['Consumidor C1'],
                    pState: { cls: 'sc', txt: 'En Sección Crítica' }, pItem: '77',
                    cState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait full)' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 4',
                code: 'buffer[0] = 77; in = 1; // Escribe en memoria',
                text: 'Sección Crítica: P1 deposita 77 en <code>buffer[0]</code> y avanza el puntero <code>in</code> a 1.',
                alert: 'Ítem 77 escrito en buffer[0]. in = 1.',
                state: {
                    buffer: [77, null, null, null, null],
                    in: 1, out: 0, mutex: 0, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: ['Consumidor C1'],
                    pState: { cls: 'sc', txt: 'Escribiendo 77' }, pItem: '77',
                    cState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait full)' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: { index: 0, type: 'writing' }
                }
            },
            {
                pill: 'Paso 5',
                code: 'signal(mutex); // mutex pasa de 0 a 1',
                text: 'P1 termina la escritura en memoria y libera el cerrojo mediante <code>signal(mutex)</code> (mutex = 1).',
                alert: 'P1 liberó Mutex (1).',
                state: {
                    buffer: [77, null, null, null, null],
                    in: 1, out: 0, mutex: 1, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: ['Consumidor C1'],
                    pState: { cls: 'ready', txt: 'Salió de SC' }, pItem: '—',
                    cState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait full)' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 6',
                code: 'signal(full); // ¡DESPIERTA A CONSUMIDOR C1!',
                text: '🎉 <strong>¡DESPERTAR DEL CONSUMIDOR!</strong> P1 ejecuta <code>signal(full)</code>. El SO detecta que C1 estaba suspendido en la cola de <code>full</code>. Extrae a C1 y cambia su estado a <strong>LISTO (Ready)</strong>.',
                alert: '🎉 signal(full) despertó a C1 de la cola de bloqueados.',
                state: {
                    buffer: [77, null, null, null, null],
                    in: 1, out: 0, mutex: 1, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'ready', txt: '🎉 DESPERTADO (Listo)' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 7',
                code: 'wait(mutex); // C1 adquiere lock del buffer',
                text: 'C1 reanuda su ejecución después de <code>wait(full)</code> y ejecuta <code>wait(mutex)</code> (0) para entrar a la Sección Crítica.',
                alert: 'C1 entra a Sección Crítica. mutex = 0.',
                state: {
                    buffer: [77, null, null, null, null],
                    in: 1, out: 0, mutex: 0, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'idle', txt: 'En reposo' }, pItem: '—',
                    cState: { cls: 'sc', txt: 'En Sección Crítica' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 8',
                code: 'item = buffer[0]; out = 1; // Retira ítem 77',
                text: 'C1 retira el ítem 77 recién depositado por P1, vacía el casillero <code>buffer[0]</code> y avanza <code>out</code> a 1.',
                alert: 'C1 extrajo el ítem 77 del buffer.',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 1, out: 1, mutex: 0, empty: 4, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'idle', txt: 'En reposo' }, pItem: '—',
                    cState: { cls: 'sc', txt: 'Extrayendo 77' }, cItem: '77',
                    activeThread: 'consumer', slotHighlight: { index: 0, type: 'reading' }
                }
            },
            {
                pill: 'Paso 9',
                code: 'signal(mutex); signal(empty); consumir(77);',
                text: 'C1 ejecuta <code>signal(mutex)</code> (1) y <code>signal(empty)</code> (empty vuelve a 5). C1 procesa el ítem 77. ¡Sincronización por buffer vacío exitosa!',
                alert: '¡Consumidor alimentado exitosamente sin busy-waiting!',
                state: {
                    buffer: [null, null, null, null, null],
                    in: 1, out: 1, mutex: 1, empty: 5, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'ready', txt: 'Consumió ítem 77' }, cItem: '77',
                    activeThread: null, slotHighlight: null
                }
            }
        ],

        // Escenario 4: Competencia Mutex (7 Pasos)
        contention: [
            {
                pill: 'Paso 0',
                code: '// Buffer con 1 ítem: Concurrencia Simultánea',
                text: 'Buffer con 1 ítem <code>[88, _, _, _, _]</code>. <code>in = 1</code>, <code>out = 0</code>. <code>empty = 4</code>, <code>full = 1</code>, <code>mutex = 1</code>. Productor y Consumidor están listos para competir por el buffer al mismo tiempo.',
                alert: 'Buffer con 1 elemento. Productor y Consumidor compiten por acceder.',
                state: {
                    buffer: [88, null, null, null, null],
                    in: 1, out: 0, mutex: 1, empty: 4, full: 1,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'ready', txt: 'Listo' }, cItem: '—',
                    activeThread: null, slotHighlight: null
                }
            },
            {
                pill: 'Paso 1',
                code: 'P1: wait(empty); wait(mutex); // mutex=0',
                text: 'El Productor P1 se anticipa: ejecuta <code>wait(empty)</code> (empty=3) y <code>wait(mutex)</code>. Mutex pasa a 0. ¡P1 gana la carrera y entra a la Sección Crítica!',
                alert: 'P1 toma el mutex (0) e ingresa a la Sección Crítica.',
                state: {
                    buffer: [88, null, null, null, null],
                    in: 1, out: 0, mutex: 0, empty: 3, full: 1,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'sc', txt: 'En Sección Crítica' }, pItem: '92',
                    cState: { cls: 'ready', txt: 'Listo' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 2',
                code: 'C1: wait(full); wait(mutex); // ¡C1 BLOQUEADO EN MUTEX!',
                text: '🛑 <strong>¡EXCLUSIÓN MUTUA EN ACCIÓN!</strong> Justo cuando P1 está por escribir, C1 intenta entrar al buffer: ejecuta <code>wait(full)</code> (full=0) y luego <code>wait(mutex)</code>. Al encontrar <code>mutex == 0</code>, ¡C1 queda **BLOQUEADO en la cola de MUTEX**! No puede corromper el buffer.',
                alert: '🛑 Consumidor C1 BLOQUEADO en el semáforo Mutex por exclusión mutua.',
                state: {
                    buffer: [88, null, null, null, null],
                    in: 1, out: 0, mutex: 0, empty: 3, full: 0,
                    mutexQ: ['Consumidor C1'], emptyQ: [], fullQ: [],
                    pState: { cls: 'sc', txt: 'En Sección Crítica' }, pItem: '92',
                    cState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait mutex)' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 3',
                code: 'P1: buffer[1] = 92; in = 2; // Escritura protegida',
                text: 'Como C1 está contenido en la cola de espera de exclusión mutua, P1 escribe con total seguridad el dato 92 en <code>buffer[1]</code> sin riesgo de condición de carrera. Puntero <code>in</code> avanza a 2.',
                alert: 'P1 escribe seguro en buffer[1]. Memoria compartida protegida.',
                state: {
                    buffer: [88, 92, null, null, null],
                    in: 2, out: 0, mutex: 0, empty: 3, full: 0,
                    mutexQ: ['Consumidor C1'], emptyQ: [], fullQ: [],
                    pState: { cls: 'sc', txt: 'Escribiendo en buffer[1]' }, pItem: '92',
                    cState: { cls: 'blocked', txt: '🛑 BLOQUEADO (wait mutex)' }, cItem: '—',
                    activeThread: 'producer', slotHighlight: { index: 1, type: 'writing' }
                }
            },
            {
                pill: 'Paso 4',
                code: 'P1: signal(mutex); // ¡DESPIERTA A C1!',
                text: '🎉 P1 concluye y ejecuta <code>signal(mutex)</code>. El SO transfiere el lock al primer proceso en espera en la cola: despierta a C1 y le concede el acceso a la Sección Crítica.',
                alert: '🎉 signal(mutex) despierta a C1 y le transfiere el acceso al buffer.',
                state: {
                    buffer: [88, 92, null, null, null],
                    in: 2, out: 0, mutex: 0, empty: 3, full: 0,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Salió de SC' }, pItem: '—',
                    cState: { cls: 'sc', txt: '🎉 En Sección Crítica' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 5',
                code: 'P1: signal(full); // full pasa a 1',
                text: 'P1 ejecuta <code>signal(full)</code> anunciando su nuevo ítem (full=1) y vuelve a estado Listo.',
                alert: 'P1 terminó su ciclo. C1 continúa leyendo el buffer.',
                state: {
                    buffer: [88, 92, null, null, null],
                    in: 2, out: 0, mutex: 0, empty: 3, full: 1,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'sc', txt: 'En Sección Crítica' }, cItem: '—',
                    activeThread: 'consumer', slotHighlight: null
                }
            },
            {
                pill: 'Paso 6',
                code: 'C1: item = buffer[0]; out = 1; // Extrae 88',
                text: 'C1 lee <code>buffer[0]</code> (ítem 88) de forma atómica y avanza <code>out</code> a 1.',
                alert: 'C1 leyó el ítem 88 de forma atómica.',
                state: {
                    buffer: [null, 92, null, null, null],
                    in: 2, out: 1, mutex: 0, empty: 3, full: 1,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'sc', txt: 'Extrayendo buffer[0]' }, cItem: '88',
                    activeThread: 'consumer', slotHighlight: { index: 0, type: 'reading' }
                }
            },
            {
                pill: 'Paso 7',
                code: 'C1: signal(mutex); signal(empty); // mutex=1, empty=4',
                text: 'C1 libera el mutex (1), incrementa empty (4) y consume el ítem 88. Ambos hilos operaron concurrentemente sin interferencias gracias a la exclusión mutua.',
                alert: '¡Exclusión mutua validada! Ninguna condición de carrera.',
                state: {
                    buffer: [null, 92, null, null, null],
                    in: 2, out: 1, mutex: 1, empty: 4, full: 1,
                    mutexQ: [], emptyQ: [], fullQ: [],
                    pState: { cls: 'ready', txt: 'Listo' }, pItem: '—',
                    cState: { cls: 'ready', txt: 'Consumió ítem 88' }, cItem: '88',
                    activeThread: null, slotHighlight: null
                }
            }
        ]
    };

    // --- MODO LIBRE INTERACTIVO (STATE) ---
    let freeState = {
        buffer: [null, null, null, null, null],
        in: 0,
        out: 0,
        mutex: 1,
        empty: 5,
        full: 0,
        mutexQ: [],
        emptyQ: [],
        fullQ: [],
        producerPhase: 0, // 0: Idle, 1: Produce, 2: wait(empty), 3: wait(mutex), 4: write, 5: signal(mutex), 6: signal(full)
        producerItem: null,
        producerBlockedOn: null, // 'empty' | 'mutex' | null
        consumerPhase: 0, // 0: Idle, 1: wait(full), 2: wait(mutex), 3: read, 4: signal(mutex), 5: signal(empty), 6: consume
        consumerItem: null,
        consumerBlockedOn: null, // 'full' | 'mutex' | null
        slotHighlight: null
    };

    function resetFreeState() {
        freeState = {
            buffer: [null, null, null, null, null],
            in: 0,
            out: 0,
            mutex: 1,
            empty: 5,
            full: 0,
            mutexQ: [],
            emptyQ: [],
            fullQ: [],
            producerPhase: 0,
            producerItem: null,
            producerBlockedOn: null,
            consumerPhase: 0,
            consumerItem: null,
            consumerBlockedOn: null,
            slotHighlight: null
        };
    }

    // --- RENDERIZADO CENTRAL ---
    function renderStep(stepIndex) {
        if (currentScenario === 'free') {
            renderFreeMode();
            return;
        }

        const steps = scenarios[currentScenario];
        if (!steps || stepIndex < 0 || stepIndex >= steps.length) return;

        const s = steps[stepIndex];
        const st = s.state;

        // Indicador de paso
        stepIndicator.textContent = `Paso ${stepIndex} / ${steps.length - 1}`;
        stepPill.textContent = s.pill;
        codeBadge.textContent = s.code;
        stepText.innerHTML = s.text;
        alertBox.innerHTML = `<strong>Estado:</strong> ${s.alert}`;

        // Render circular buffer
        bufferContainer.innerHTML = '';
        const filledCount = st.buffer.filter(x => x !== null).length;
        bufferStats.textContent = `Ocupación: ${filledCount} / 5 (${filledCount * 20}%)`;

        for (let i = 0; i < 5; i++) {
            const col = document.createElement('div');
            col.className = 'slot-column';

            // Puntero in (top)
            const ptrIn = document.createElement('div');
            ptrIn.className = `slot-pointer pointer-in ${st.in === i ? 'visible' : ''}`;
            ptrIn.textContent = '📥 in';
            col.appendChild(ptrIn);

            // Slot box
            const slot = document.createElement('div');
            slot.className = 'buffer-slot';
            if (st.buffer[i] !== null) {
                slot.classList.add('filled');
                slot.textContent = st.buffer[i];
            } else {
                slot.textContent = '·';
            }

            if (st.slotHighlight && st.slotHighlight.index === i) {
                slot.classList.add(st.slotHighlight.type);
            }
            col.appendChild(slot);

            // Index label
            const idx = document.createElement('div');
            idx.className = 'slot-index';
            idx.textContent = `[${i}]`;
            col.appendChild(idx);

            // Puntero out (bottom)
            const ptrOut = document.createElement('div');
            ptrOut.className = `slot-pointer pointer-out ${st.out === i ? 'visible' : ''}`;
            ptrOut.textContent = '📤 out';
            col.appendChild(ptrOut);

            bufferContainer.appendChild(col);
        }

        // Pointers values
        valInDisplay.textContent = st.in;
        valOutDisplay.textContent = st.out;

        // Semáforos
        semMutexVal.textContent = st.mutex;
        semMutexVal.className = `sem-value-badge ${st.mutex === 1 ? 'green' : 'zero'}`;

        semEmptyVal.textContent = st.empty;
        semEmptyVal.className = `sem-value-badge ${st.empty === 0 ? 'zero' : 'blue'}`;

        semFullVal.textContent = st.full;
        semFullVal.className = `sem-value-badge ${st.full === 0 ? 'zero' : 'purple'}`;

        // Colas de bloqueados
        renderQueue(semMutexQueue, st.mutexQ);
        renderQueue(semEmptyQueue, st.emptyQ);
        renderQueue(semFullQueue, st.fullQ);

        // Hilos
        badgeProducerState.className = `pc-thread-state-badge ${st.pState.cls}`;
        badgeProducerState.textContent = st.pState.txt;
        valProducerItem.textContent = st.pItem;
        cardProducer.className = `pc-thread-card ${st.activeThread === 'producer' ? 'active-thread' : ''}`;

        badgeConsumerState.className = `pc-thread-state-badge ${st.cState.cls}`;
        badgeConsumerState.textContent = st.cState.txt;
        valConsumerItem.textContent = st.cItem;
        cardConsumer.className = `pc-thread-card ${st.activeThread === 'consumer' ? 'active-thread' : ''}`;

        // Botones de navegación
        btnPrev.disabled = stepIndex === 0;
        btnStep.disabled = stepIndex === steps.length - 1;

        if (stepIndex === steps.length - 1) {
            stopAuto();
        }

        logPC(`${s.pill}: ${s.code} -> ${s.alert}`);
    }

    function renderQueue(container, queueArray) {
        container.innerHTML = '';
        if (!queueArray || queueArray.length === 0) {
            container.innerHTML = '<span class="empty-queue-hint">Vacía (ninguno)</span>';
            return;
        }
        queueArray.forEach(proc => {
            const chip = document.createElement('span');
            chip.className = 'queue-chip';
            chip.textContent = proc;
            container.appendChild(chip);
        });
    }

    function renderFreeMode() {
        stepIndicator.textContent = 'Modo Libre';
        stepPill.textContent = 'Interactivo';
        codeBadge.textContent = 'Operaciones Manuales';
        stepText.innerHTML = 'Usa los botones de micro-paso para ejecutar paso a paso cada instrucción de P1 o C1, o ejecuta un ciclo completo animado.';
        alertBox.innerHTML = `<strong>Modo Libre Activo:</strong> empty = ${freeState.empty}, full = ${freeState.full}, mutex = ${freeState.mutex}.`;

        // Render circular buffer
        bufferContainer.innerHTML = '';
        const filledCount = freeState.buffer.filter(x => x !== null).length;
        bufferStats.textContent = `Ocupación: ${filledCount} / 5 (${filledCount * 20}%)`;

        for (let i = 0; i < 5; i++) {
            const col = document.createElement('div');
            col.className = 'slot-column';

            const ptrIn = document.createElement('div');
            ptrIn.className = `slot-pointer pointer-in ${freeState.in === i ? 'visible' : ''}`;
            ptrIn.textContent = '📥 in';
            col.appendChild(ptrIn);

            const slot = document.createElement('div');
            slot.className = 'buffer-slot';
            if (freeState.buffer[i] !== null) {
                slot.classList.add('filled');
                slot.textContent = freeState.buffer[i];
            } else {
                slot.textContent = '·';
            }

            if (freeState.slotHighlight && freeState.slotHighlight.index === i) {
                slot.classList.add(freeState.slotHighlight.type);
            }
            col.appendChild(slot);

            const idx = document.createElement('div');
            idx.className = 'slot-index';
            idx.textContent = `[${i}]`;
            col.appendChild(idx);

            const ptrOut = document.createElement('div');
            ptrOut.className = `slot-pointer pointer-out ${freeState.out === i ? 'visible' : ''}`;
            ptrOut.textContent = '📤 out';
            col.appendChild(ptrOut);

            bufferContainer.appendChild(col);
        }

        valInDisplay.textContent = freeState.in;
        valOutDisplay.textContent = freeState.out;

        semMutexVal.textContent = freeState.mutex;
        semMutexVal.className = `sem-value-badge ${freeState.mutex === 1 ? 'green' : 'zero'}`;

        semEmptyVal.textContent = freeState.empty;
        semEmptyVal.className = `sem-value-badge ${freeState.empty === 0 ? 'zero' : 'blue'}`;

        semFullVal.textContent = freeState.full;
        semFullVal.className = `sem-value-badge ${freeState.full === 0 ? 'zero' : 'purple'}`;

        renderQueue(semMutexQueue, freeState.mutexQ);
        renderQueue(semEmptyQueue, freeState.emptyQ);
        renderQueue(semFullQueue, freeState.fullQ);

        // Producer State
        let pCls = 'ready';
        let pTxt = 'Listo';
        if (freeState.producerBlockedOn) {
            pCls = 'blocked';
            pTxt = `🛑 BLOQUEADO (${freeState.producerBlockedOn})`;
        } else if (freeState.producerPhase === 4) {
            pCls = 'sc';
            pTxt = 'En Sección Crítica';
        } else if (freeState.producerPhase > 0) {
            pCls = 'ready';
            pTxt = `Fase ${freeState.producerPhase}/6`;
        }
        badgeProducerState.className = `pc-thread-state-badge ${pCls}`;
        badgeProducerState.textContent = pTxt;
        valProducerItem.textContent = freeState.producerItem || '—';

        // Consumer State
        let cCls = 'idle';
        let cTxt = 'Esperando';
        if (freeState.consumerBlockedOn) {
            cCls = 'blocked';
            cTxt = `🛑 BLOQUEADO (${freeState.consumerBlockedOn})`;
        } else if (freeState.consumerPhase === 3) {
            cCls = 'sc';
            cTxt = 'En Sección Crítica';
        } else if (freeState.consumerPhase > 0) {
            cCls = 'ready';
            cTxt = `Fase ${freeState.consumerPhase}/6`;
        }
        badgeConsumerState.className = `pc-thread-state-badge ${cCls}`;
        badgeConsumerState.textContent = cTxt;
        valConsumerItem.textContent = freeState.consumerItem || '—';

        btnPrev.disabled = true;
        btnStep.disabled = true;
    }

    // --- ACCIONES DEL MODO LIBRE ---
    function freeProducerStep() {
        if (freeState.producerBlockedOn) {
            logPC(`Productor no puede avanzar: se encuentra bloqueado en semáforo '${freeState.producerBlockedOn}'.`, 'warn');
            return;
        }

        // Fases: 0: Generar -> 1: wait(empty) -> 2: wait(mutex) -> 3: escribir -> 4: signal(mutex) -> 5: signal(full) -> 0
        if (freeState.producerPhase === 0) {
            freeState.producerItem = Math.floor(Math.random() * 89) + 10;
            freeState.producerPhase = 1;
            codeBadge.textContent = `item = ${freeState.producerItem};`;
            stepText.innerHTML = `P1 produjo localmente el dato <strong>${freeState.producerItem}</strong>. Próximo paso: <code>wait(empty)</code>.`;
            logPC(`P1 produjo ítem ${freeState.producerItem}.`);
        } else if (freeState.producerPhase === 1) {
            codeBadge.textContent = 'wait(empty);';
            if (freeState.empty > 0) {
                freeState.empty--;
                freeState.producerPhase = 2;
                stepText.innerHTML = `P1 ejecutó <code>wait(empty)</code>. empty decrementó a ${freeState.empty}. Próximo paso: <code>wait(mutex)</code>.`;
                logPC(`P1 ejecutó wait(empty) -> empty=${freeState.empty}.`);
            } else {
                freeState.producerBlockedOn = 'empty';
                freeState.emptyQ.push(`Productor P1 (${freeState.producerItem})`);
                stepText.innerHTML = `🛑 <code>wait(empty)</code> falló: no hay espacio libre (empty = 0). P1 queda <strong>BLOQUEADO</strong>.`;
                logPC(`🛑 P1 quedó BLOQUEADO en semáforo empty.`, 'error');
            }
        } else if (freeState.producerPhase === 2) {
            codeBadge.textContent = 'wait(mutex);';
            if (freeState.mutex === 1) {
                freeState.mutex = 0;
                freeState.producerPhase = 3;
                stepText.innerHTML = `P1 ejecutó <code>wait(mutex)</code> y adquirió el lock (0). Próximo paso: escribir en el buffer.`;
                logPC(`P1 adquirió Mutex (0). Entra a Sección Crítica.`, 'highlight');
            } else {
                freeState.producerBlockedOn = 'mutex';
                freeState.mutexQ.push('Productor P1');
                stepText.innerHTML = `🛑 <code>wait(mutex)</code> falló: buffer ocupado (mutex = 0). P1 queda <strong>BLOQUEADO en Mutex</strong>.`;
                logPC(`🛑 P1 quedó BLOQUEADO en Mutex.`, 'error');
            }
        } else if (freeState.producerPhase === 3) {
            const target = freeState.in;
            freeState.buffer[target] = freeState.producerItem;
            freeState.in = (freeState.in + 1) % 5;
            freeState.slotHighlight = { index: target, type: 'writing' };
            freeState.producerPhase = 4;
            codeBadge.textContent = `buffer[${target}] = ${freeState.producerItem}; in = ${freeState.in};`;
            stepText.innerHTML = `P1 depositó <strong>${freeState.producerItem}</strong> en <code>buffer[${target}]</code>. Próximo paso: <code>signal(mutex)</code>.`;
            logPC(`P1 escribió ítem ${freeState.producerItem} en buffer[${target}].`, 'success');
        } else if (freeState.producerPhase === 4) {
            freeState.slotHighlight = null;
            codeBadge.textContent = 'signal(mutex);';
            if (freeState.mutexQ.length > 0) {
                const unblocked = freeState.mutexQ.shift();
                if (unblocked.includes('Consumidor')) {
                    freeState.consumerBlockedOn = null;
                    freeState.consumerPhase = 3; // directo a SC
                }
                stepText.innerHTML = `P1 ejecutó <code>signal(mutex)</code>. Despertó a <strong>${unblocked}</strong> de la cola mutex.`;
                logPC(`P1 ejecutó signal(mutex) y despertó a ${unblocked}.`, 'highlight');
            } else {
                freeState.mutex = 1;
                stepText.innerHTML = `P1 ejecutó <code>signal(mutex)</code>. Mutex liberado (1). Próximo paso: <code>signal(full)</code>.`;
                logPC(`P1 liberó Mutex (1).`);
            }
            freeState.producerPhase = 5;
        } else if (freeState.producerPhase === 5) {
            codeBadge.textContent = 'signal(full);';
            if (freeState.fullQ.length > 0) {
                freeState.fullQ.shift();
                freeState.consumerBlockedOn = null;
                freeState.consumerPhase = 2; // pasa a wait(mutex)
                stepText.innerHTML = `P1 ejecutó <code>signal(full)</code>. ¡Despertó al <strong>Consumidor C1</strong> de la cola de bloqueados!`;
                logPC(`P1 ejecutó signal(full) y despertó al Consumidor C1.`, 'success');
            } else {
                freeState.full++;
                stepText.innerHTML = `P1 ejecutó <code>signal(full)</code>. full incrementó a ${freeState.full}. Ciclo de producción completado.`;
                logPC(`P1 ejecutó signal(full) -> full=${freeState.full}.`);
            }
            freeState.producerPhase = 0;
            freeState.producerItem = null;
        }
        renderFreeMode();
    }

    function freeConsumerStep() {
        if (freeState.consumerBlockedOn) {
            logPC(`Consumidor no puede avanzar: se encuentra bloqueado en semáforo '${freeState.consumerBlockedOn}'.`, 'warn');
            return;
        }

        // Fases: 0: wait(full) -> 1: wait(mutex) -> 2: leer -> 3: signal(mutex) -> 4: signal(empty) -> 5: consumir -> 0
        if (freeState.consumerPhase === 0) {
            codeBadge.textContent = 'wait(full);';
            if (freeState.full > 0) {
                freeState.full--;
                freeState.consumerPhase = 1;
                stepText.innerHTML = `C1 ejecutó <code>wait(full)</code>. full decrementó a ${freeState.full}. Próximo paso: <code>wait(mutex)</code>.`;
                logPC(`C1 ejecutó wait(full) -> full=${freeState.full}.`);
            } else {
                freeState.consumerBlockedOn = 'full';
                freeState.fullQ.push('Consumidor C1');
                stepText.innerHTML = `🛑 <code>wait(full)</code> falló: buffer vacío (full = 0). C1 queda <strong>BLOQUEADO</strong>.`;
                logPC(`🛑 C1 quedó BLOQUEADO en semáforo full.`, 'error');
            }
        } else if (freeState.consumerPhase === 1) {
            codeBadge.textContent = 'wait(mutex);';
            if (freeState.mutex === 1) {
                freeState.mutex = 0;
                freeState.consumerPhase = 2;
                stepText.innerHTML = `C1 ejecutó <code>wait(mutex)</code> y tomó el lock (0). Próximo paso: leer del buffer.`;
                logPC(`C1 adquirió Mutex (0). Entra a Sección Crítica.`, 'highlight');
            } else {
                freeState.consumerBlockedOn = 'mutex';
                freeState.mutexQ.push('Consumidor C1');
                stepText.innerHTML = `🛑 <code>wait(mutex)</code> falló: buffer ocupado (mutex = 0). C1 queda <strong>BLOQUEADO en Mutex</strong>.`;
                logPC(`🛑 C1 quedó BLOQUEADO en Mutex.`, 'error');
            }
        } else if (freeState.consumerPhase === 2) {
            const target = freeState.out;
            freeState.consumerItem = freeState.buffer[target];
            freeState.buffer[target] = null;
            freeState.out = (freeState.out + 1) % 5;
            freeState.slotHighlight = { index: target, type: 'reading' };
            freeState.consumerPhase = 3;
            codeBadge.textContent = `item = buffer[${target}]; out = ${freeState.out};`;
            stepText.innerHTML = `C1 retiró el ítem <strong>${freeState.consumerItem}</strong> de <code>buffer[${target}]</code>. Próximo paso: <code>signal(mutex)</code>.`;
            logPC(`C1 leyó ítem ${freeState.consumerItem} de buffer[${target}].`, 'success');
        } else if (freeState.consumerPhase === 3) {
            freeState.slotHighlight = null;
            codeBadge.textContent = 'signal(mutex);';
            if (freeState.mutexQ.length > 0) {
                const unblocked = freeState.mutexQ.shift();
                if (unblocked.includes('Productor')) {
                    freeState.producerBlockedOn = null;
                    freeState.producerPhase = 3; // directo a SC
                }
                stepText.innerHTML = `C1 ejecutó <code>signal(mutex)</code>. Despertó a <strong>${unblocked}</strong> de la cola mutex.`;
                logPC(`C1 ejecutó signal(mutex) y despertó a ${unblocked}.`, 'highlight');
            } else {
                freeState.mutex = 1;
                stepText.innerHTML = `C1 ejecutó <code>signal(mutex)</code>. Mutex liberado (1). Próximo paso: <code>signal(empty)</code>.`;
                logPC(`C1 liberó Mutex (1).`);
            }
            freeState.consumerPhase = 4;
        } else if (freeState.consumerPhase === 4) {
            codeBadge.textContent = 'signal(empty);';
            if (freeState.emptyQ.length > 0) {
                freeState.emptyQ.shift();
                freeState.producerBlockedOn = null;
                freeState.producerPhase = 2; // pasa a wait(mutex)
                stepText.innerHTML = `C1 ejecutó <code>signal(empty)</code>. ¡Despertó al <strong>Productor P1</strong> de la cola de bloqueados!`;
                logPC(`C1 ejecutó signal(empty) y despertó al Productor P1.`, 'success');
            } else {
                freeState.empty++;
                stepText.innerHTML = `C1 ejecutó <code>signal(empty)</code>. empty incrementó a ${freeState.empty}. Próximo paso: consumir el dato.`;
                logPC(`C1 ejecutó signal(empty) -> empty=${freeState.empty}.`);
            }
            freeState.consumerPhase = 5;
        } else if (freeState.consumerPhase === 5) {
            codeBadge.textContent = `consumir(${freeState.consumerItem});`;
            stepText.innerHTML = `C1 procesó exitosamente el dato <strong>${freeState.consumerItem}</strong>. Ciclo completado.`;
            logPC(`C1 procesó dato ${freeState.consumerItem}.`);
            freeState.consumerPhase = 0;
        }
        renderFreeMode();
    }

    async function runFreeFullCycle(type) {
        stopAuto();
        const maxSteps = 6;
        for (let i = 0; i < maxSteps; i++) {
            if (type === 'produce') {
                if (freeState.producerBlockedOn) break;
                freeProducerStep();
                if (freeState.producerPhase === 0) break;
            } else {
                if (freeState.consumerBlockedOn) break;
                freeConsumerStep();
                if (freeState.consumerPhase === 0) break;
            }
            await new Promise(r => setTimeout(r, currentSpeed));
        }
    }

    // --- CONTROLES DE EJECUCIÓN ---
    function advanceStep() {
        const steps = scenarios[currentScenario];
        if (!steps || currentStep >= steps.length - 1) return;
        currentStep++;
        renderStep(currentStep);
    }

    function prevStep() {
        if (currentStep <= 0) return;
        currentStep--;
        renderStep(currentStep);
    }

    function resetBuffer() {
        stopAuto();
        currentStep = 0;
        resetFreeState();
        renderStep(0);
        logPC(`Simulador reiniciado al Paso 0 (${currentScenario}).`, 'highlight');
    }

    function toggleAuto() {
        if (autoTimer) {
            stopAuto();
        } else {
            startAuto();
        }
    }

    function startAuto() {
        if (currentScenario === 'free') return;
        const steps = scenarios[currentScenario];
        if (currentStep >= steps.length - 1) {
            currentStep = 0;
            renderStep(0);
        }
        btnAuto.textContent = '⏸️ Pausar Simulación';
        btnAuto.style.background = '#eab308';
        autoTimer = setInterval(() => {
            if (currentStep < steps.length - 1) {
                advanceStep();
            } else {
                stopAuto();
            }
        }, currentSpeed);
    }

    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
        btnAuto.textContent = '▶️ Reproducción Automática';
        btnAuto.style.background = '#10b981';
    }

    // --- EVENT LISTENERS ---
    btnStep.addEventListener('click', advanceStep);
    btnPrev.addEventListener('click', prevStep);
    btnReset.addEventListener('click', resetBuffer);
    btnAuto.addEventListener('click', toggleAuto);

    // Selector de velocidad
    speedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            speedBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSpeed = parseInt(btn.dataset.speed, 10);
            logPC(`Velocidad de reproducción ajustada a ${currentSpeed}ms por paso.`);
            if (autoTimer) {
                stopAuto();
                startAuto();
            }
        });
    });

    // Selector de escenario
    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScenario = btn.dataset.scenario;
            currentStep = 0;
            stopAuto();

            if (currentScenario === 'free') {
                freeControls.style.display = 'flex';
                btnStep.style.display = 'none';
                btnPrev.style.display = 'none';
                btnAuto.style.display = 'none';
                resetFreeState();
                renderFreeMode();
                logPC('Cambiado a Modo Libre Interactivo. Usa micro-pasos manuales.', 'highlight');
            } else {
                freeControls.style.display = 'none';
                btnStep.style.display = 'inline-block';
                btnPrev.style.display = 'inline-block';
                btnAuto.style.display = 'inline-block';
                renderStep(0);
                logPC(`Cambiado a Escenario: ${btn.textContent.trim()}.`, 'highlight');
            }
        });
    });

    // Modo libre botones
    if (btnFreeProduceStep) btnFreeProduceStep.addEventListener('click', freeProducerStep);
    if (btnFreeConsumeStep) btnFreeConsumeStep.addEventListener('click', freeConsumerStep);
    if (btnFreeProduceFull) btnFreeProduceFull.addEventListener('click', () => runFreeFullCycle('produce'));
    if (btnFreeConsumeFull) btnFreeConsumeFull.addEventListener('click', () => runFreeFullCycle('consume'));

    // Inicializar en paso 0
    renderStep(0);
}

// --- SIMULADOR CONDICION DE CARRERA ---
function initRaceSimulator() {
    const btnNoLock = document.getElementById('btn-race-nolock');
    const btnLock = document.getElementById('btn-race-lock');
    const counterDisplay = document.getElementById('race-counter');
    const expectedDisplay = document.getElementById('race-expected');
    const procA = document.getElementById('proc-a');
    const procB = document.getElementById('proc-b');
    const logBox = document.getElementById('race-log');

    if (!btnNoLock || !btnLock) return;

    let isRunning = false;

    function log(msg, error=false) {
        const div = document.createElement('div');
        div.textContent = msg;
        if(error) div.style.color = '#ef4444';
        logBox.appendChild(div);
        logBox.scrollTop = logBox.scrollHeight;
    }

    async function runSimulation(useLock) {
        if (isRunning) return;
        isRunning = true;
        btnNoLock.disabled = true;
        btnLock.disabled = true;
        logBox.innerHTML = '';
        
        let counter = 0;
        const totalIncrements = 50;
        let expected = totalIncrements * 2;
        expectedDisplay.textContent = `Esperado: ${expected}`;
        counterDisplay.textContent = '0';
        counterDisplay.style.color = '';

        log(`Iniciando simulación ${useLock ? 'CON' : 'SIN'} Lock...`);

        const processA = async () => {
            for(let i=0; i<totalIncrements; i++) {
                procA.classList.add('active');
                let localCopy = counter; // Lectura
                await new Promise(r => setTimeout(r, Math.random() * 20)); // Preemption
                localCopy = localCopy + 1; // Modificación
                counter = localCopy; // Escritura
                counterDisplay.textContent = counter;
                procA.classList.remove('active');
                if(useLock) await new Promise(r => setTimeout(r, 15));
            }
        };

        const processB = async () => {
            for(let i=0; i<totalIncrements; i++) {
                procB.classList.add('active');
                let localCopy = counter; // Lectura
                await new Promise(r => setTimeout(r, Math.random() * 20)); // Preemption
                localCopy = localCopy + 1; // Modificación
                counter = localCopy; // Escritura
                counterDisplay.textContent = counter;
                procB.classList.remove('active');
                if(useLock) await new Promise(r => setTimeout(r, 15));
            }
        };

        if (useLock) {
            for(let i=0; i<totalIncrements; i++) {
                procA.classList.add('active');
                counter++;
                counterDisplay.textContent = counter;
                await new Promise(r => setTimeout(r, 10));
                procA.classList.remove('active');

                procB.classList.add('active');
                counter++;
                counterDisplay.textContent = counter;
                await new Promise(r => setTimeout(r, 10));
                procB.classList.remove('active');
            }
        } else {
            await Promise.all([processA(), processB()]);
        }

        isRunning = false;
        btnNoLock.disabled = false;
        btnLock.disabled = false;
        procA.classList.remove('active');
        procB.classList.remove('active');

        if(counter !== expected) {
            log(`¡Condición de Carrera detectada! Valor final: ${counter} (Esperado: ${expected})`, true);
            counterDisplay.style.color = '#ef4444';
        } else {
            log(`Ejecución segura. Valor final: ${counter}`);
            counterDisplay.style.color = '#10b981';
        }
    }

    btnNoLock.addEventListener('click', () => runSimulation(false));
    btnLock.addEventListener('click', () => runSimulation(true));
}

// --- SIMULADOR FILÓSOFOS COMENSALES (PASO A PASO & DEADLOCK) ---
function initPhilosophersSimulator() {
    const btnModeDeadlock = document.getElementById('btn-philo-mode-deadlock');
    const btnModeSafe = document.getElementById('btn-philo-mode-safe');
    const btnStep = document.getElementById('btn-philo-step');
    const btnAuto = document.getElementById('btn-philo-auto');
    const btnPrev = document.getElementById('btn-philo-prev');
    const btnReset = document.getElementById('btn-philo-reset');

    const stepIndicator = document.getElementById('philo-step-indicator');
    const stepPill = document.getElementById('step-pill');
    const stepText = document.getElementById('step-text');
    const alertBox = document.getElementById('philo-status-alert');
    const logBox = document.getElementById('philo-log');

    const coffmanBadges = {
        1: document.getElementById('coffman-cond-1'),
        2: document.getElementById('coffman-cond-2'),
        3: document.getElementById('coffman-cond-3'),
        4: document.getElementById('coffman-cond-4')
    };

    if (!btnStep || !btnReset) return;

    let currentScenario = 'deadlock'; // 'deadlock' | 'safe'
    let currentStep = 0;
    let autoTimer = null;

    function logPhilo(msg, isError = false, isHighlight = false) {
        if (!logBox) return;
        const div = document.createElement('div');
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        if (isError) div.style.color = '#ef4444';
        else if (isHighlight) div.style.color = '#38bdf8';
        logBox.appendChild(div);
        logBox.scrollTop = logBox.scrollHeight;
    }

    function setPhilosopherState(index, state, text, icon) {
        const node = document.getElementById(`philo-${index}`);
        if (!node) return;
        node.className = `philo-node philo-pos-${index} ${state}`;
        const iconSpan = node.querySelector('.philo-icon');
        const stateSpan = node.querySelector('.philo-state');
        if (iconSpan) iconSpan.textContent = icon;
        if (stateSpan) stateSpan.textContent = text;
    }

    function setForkState(index, state, text = null) {
        const node = document.getElementById(`fork-${index}`);
        if (!node) return;
        node.className = `fork-node fork-pos-${index} ${state}`;
        node.textContent = text ? text : `🍴 T${index}`;
    }

    function setCoffmanState(activeList, brokenList = []) {
        for (let i = 1; i <= 4; i++) {
            const badge = coffmanBadges[i];
            if (!badge) continue;
            badge.classList.remove('active', 'broken');
            if (activeList.includes(i)) {
                badge.classList.add('active');
            } else if (brokenList.includes(i)) {
                badge.classList.add('broken');
            }
        }
    }

    // Definición de Pasos del Escenario DEADLOCK (12 pasos)
    const deadlockSteps = [
        {
            num: 0,
            title: "Inicio / Reposo",
            desc: "Mesa en reposo. Los 5 filósofos están pensando y los 5 tenedores están sobre la mesa.",
            alert: "Estado del Sistema: Mesa en reposo. Todos los filósofos están pensando.",
            alertClass: "philo-alert",
            coffman: [1, 3],
            apply: () => {
                for (let i = 0; i < 5; i++) {
                    setPhilosopherState(i, 'thinking', 'Pensando', '🤔');
                    setForkState(i, '');
                }
            }
        },
        {
            num: 1,
            title: "Hambre simultánea",
            desc: "Los 5 filósofos sienten hambre al mismo tiempo (estado HUNGRY ⏳) y competirán por los recursos.",
            alert: "Fase 1: Los 5 filósofos sienten hambre simultáneamente.",
            alertClass: "philo-alert",
            coffman: [1, 3],
            apply: () => {
                for (let i = 0; i < 5; i++) {
                    setPhilosopherState(i, 'hungry', 'Hambriento', '⏳');
                    setForkState(i, '');
                }
            }
        },
        {
            num: 2,
            title: "P0 toma T0",
            desc: "Filósofo 0 ejecuta wait(T0) y adquiere su tenedor izquierdo T0.",
            alert: "P0 retiene el tenedor T0. Se activa la condición de Retención y Espera.",
            alertClass: "philo-alert",
            coffman: [1, 2, 3],
            apply: () => {
                setForkState(0, 'taken', '🍴 T0 (P0)');
            }
        },
        {
            num: 3,
            title: "P1 toma T1",
            desc: "Filósofo 1 ejecuta wait(T1) y adquiere su tenedor izquierdo T1.",
            alert: "P1 retiene el tenedor T1.",
            alertClass: "philo-alert",
            coffman: [1, 2, 3],
            apply: () => {
                setForkState(1, 'taken', '🍴 T1 (P1)');
            }
        },
        {
            num: 4,
            title: "P2 toma T2",
            desc: "Filósofo 2 ejecuta wait(T2) y adquiere su tenedor izquierdo T2.",
            alert: "P2 retiene el tenedor T2.",
            alertClass: "philo-alert",
            coffman: [1, 2, 3],
            apply: () => {
                setForkState(2, 'taken', '🍴 T2 (P2)');
            }
        },
        {
            num: 5,
            title: "P3 toma T3",
            desc: "Filósofo 3 ejecuta wait(T3) y adquiere su tenedor izquierdo T3.",
            alert: "P3 retiene el tenedor T3.",
            alertClass: "philo-alert",
            coffman: [1, 2, 3],
            apply: () => {
                setForkState(3, 'taken', '🍴 T3 (P3)');
            }
        },
        {
            num: 6,
            title: "P4 toma T4",
            desc: "Filósofo 4 ejecuta wait(T4). ¡Todos los tenedores sobre la mesa fueron tomados! Cada filósofo retiene 1 tenedor.",
            alert: "¡Mesa sin tenedores libres! Cada filósofo retiene 1 tenedor e intentará tomar el derecho.",
            alertClass: "philo-alert",
            coffman: [1, 2, 3],
            apply: () => {
                setForkState(4, 'taken', '🍴 T4 (P4)');
            }
        },
        {
            num: 7,
            title: "P0 bloqueado por T1",
            desc: "Filósofo 0 intenta wait(T1), pero T1 está ocupado por P1. P0 queda BLOQUEADO ⛔ en espera.",
            alert: "P0 solicita T1... ¡Bloqueado! T1 pertenece a P1.",
            alertClass: "philo-alert deadlock",
            coffman: [1, 2, 3],
            apply: () => {
                setPhilosopherState(0, 'deadlocked', 'Bloqueado', '⛔');
            }
        },
        {
            num: 8,
            title: "P1 bloqueado por T2",
            desc: "Filósofo 1 intenta wait(T2), pero T2 está ocupado por P2. P1 queda BLOQUEADO ⛔ en espera.",
            alert: "P1 solicita T2... ¡Bloqueado! T2 pertenece a P2.",
            alertClass: "philo-alert deadlock",
            coffman: [1, 2, 3],
            apply: () => {
                setPhilosopherState(1, 'deadlocked', 'Bloqueado', '⛔');
            }
        },
        {
            num: 9,
            title: "P2 bloqueado por T3",
            desc: "Filósofo 2 intenta wait(T3), pero T3 está ocupado por P3. P2 queda BLOQUEADO ⛔ en espera.",
            alert: "P2 solicita T3... ¡Bloqueado! T3 pertenece a P3.",
            alertClass: "philo-alert deadlock",
            coffman: [1, 2, 3],
            apply: () => {
                setPhilosopherState(2, 'deadlocked', 'Bloqueado', '⛔');
            }
        },
        {
            num: 10,
            title: "P3 bloqueado por T4",
            desc: "Filósofo 3 intenta wait(T4), pero T4 está ocupado por P4. P3 queda BLOQUEADO ⛔ en espera.",
            alert: "P3 solicita T4... ¡Bloqueado! T4 pertenece a P4.",
            alertClass: "philo-alert deadlock",
            coffman: [1, 2, 3],
            apply: () => {
                setPhilosopherState(3, 'deadlocked', 'Bloqueado', '⛔');
            }
        },
        {
            num: 11,
            title: "P4 bloqueado por T0 (Ciclo cerrado)",
            desc: "Filósofo 4 intenta wait(T0), pero T0 está ocupado por P0. ¡Se cierra la cadena circular de espera!",
            alert: "P4 solicita T0... ¡Bloqueado por P0! Se activa la condición de Espera Circular.",
            alertClass: "philo-alert deadlock",
            coffman: [1, 2, 3, 4],
            apply: () => {
                setPhilosopherState(4, 'deadlocked', 'Bloqueado', '⛔');
            }
        },
        {
            num: 12,
            title: "🚨 ¡DEADLOCK TOTAL!",
            desc: "🚨 INTERBLOQUEO FORMAL: Se cumplen simultáneamente las 4 condiciones de Coffman. P0 espera a P1, P1 a P2, P2 a P3, P3 a P4 y P4 a P0. Nadie puede comer ni liberar recursos.",
            alert: "🚨 ¡DEADLOCK / INTERBLOQUEO DETECTADO! Sistema bloqueado de forma indefinida.",
            alertClass: "philo-alert deadlock",
            coffman: [1, 2, 3, 4],
            apply: () => {
                for (let i = 0; i < 5; i++) {
                    setPhilosopherState(i, 'deadlocked', 'Deadlock', '⛔');
                    setForkState(i, 'taken', `🍴 T${i} (P${i})`);
                }
            }
        }
    ];

    // Definición de Pasos del Escenario SEGURO / ASIMÉTRICO (9 pasos)
    const safeSteps = [
        {
            num: 0,
            title: "Inicio Asimétrico",
            desc: "Estrategia Asimétrica de Dijkstra: El Filósofo 4 (último) romperá la simetría tomando primero el tenedor DERECHO T0 y luego el IZQUIERDO T4.",
            alert: "Estrategia Asimétrica preparada. Se romperá la condición de Espera Circular de Coffman.",
            alertClass: "philo-alert",
            coffman: [1, 3],
            brokenCoffman: [4],
            apply: () => {
                for (let i = 0; i < 5; i++) {
                    setPhilosopherState(i, 'thinking', 'Pensando', '🤔');
                    setForkState(i, '');
                }
            }
        },
        {
            num: 1,
            title: "Hambre de los comensales",
            desc: "Los 5 filósofos sienten hambre simultáneamente (estado HUNGRY ⏳).",
            alert: "Fase 1: Los filósofos solicitan recursos según el protocolo asimétrico.",
            alertClass: "philo-alert",
            coffman: [1, 3],
            brokenCoffman: [4],
            apply: () => {
                for (let i = 0; i < 5; i++) {
                    setPhilosopherState(i, 'hungry', 'Hambriento', '⏳');
                    setForkState(i, '');
                }
            }
        },
        {
            num: 2,
            title: "P0 y P2 toman tenedores izquierdos",
            desc: "P0 toma T0 y P2 toma T2. P4 (asimétrico) intenta tomar su derecho T0, pero al estar ocupado por P0, espera SIN retener T4.",
            alert: "P0 toma T0, P2 toma T2. P4 espera sin retener recursos. ¡No hay retención circular!",
            alertClass: "philo-alert safe",
            coffman: [1, 2, 3],
            brokenCoffman: [4],
            apply: () => {
                setForkState(0, 'taken', '🍴 T0 (P0)');
                setForkState(2, 'taken', '🍴 T2 (P2)');
                setPhilosopherState(1, 'hungry', 'Esperando', '⏳');
                setPhilosopherState(3, 'hungry', 'Esperando', '⏳');
                setPhilosopherState(4, 'hungry', 'Esperando', '⏳');
            }
        },
        {
            num: 3,
            title: "P0 y P2 comen en paralelo",
            desc: "P0 toma T1 y P2 toma T3. ¡Ambos disponen de sus dos tenedores adyacentes! P0 y P2 pasan a comer (EATING 🍝) concurrentemente.",
            alert: "🍝 Turno 1: Filósofos 0 y 2 comiendo en paralelo de forma segura.",
            alertClass: "philo-alert safe",
            coffman: [1, 3],
            brokenCoffman: [4],
            apply: () => {
                setForkState(0, 'eating', '🍴 T0 (P0)');
                setForkState(1, 'eating', '🍴 T1 (P0)');
                setForkState(2, 'eating', '🍴 T2 (P2)');
                setForkState(3, 'eating', '🍴 T3 (P2)');
                setPhilosopherState(0, 'eating', 'Comiendo', '🍝');
                setPhilosopherState(2, 'eating', 'Comiendo', '🍝');
            }
        },
        {
            num: 4,
            title: "P0 y P2 liberan recursos",
            desc: "P0 y P2 terminan de comer. Ejecutan signal() sobre sus tenedores T0, T1, T2 y T3 y vuelven a pensar 🤔.",
            alert: "P0 y P2 terminaron de comer y liberaron los tenedores T0, T1, T2 y T3.",
            alertClass: "philo-alert safe",
            coffman: [1, 3],
            brokenCoffman: [4],
            apply: () => {
                setForkState(0, '');
                setForkState(1, '');
                setForkState(2, '');
                setForkState(3, '');
                setPhilosopherState(0, 'thinking', 'Pensando', '🤔');
                setPhilosopherState(2, 'thinking', 'Pensando', '🤔');
            }
        },
        {
            num: 5,
            title: "P1 y P4 comen en paralelo",
            desc: "P1 toma T1 y T2. P4 (asimétrico) toma su derecho T0 y luego su izquierdo T4. ¡P1 y P4 comen simultáneamente!",
            alert: "🍝 Turno 2: Filósofo 1 y Filósofo 4 (asimétrico) comiendo simultáneamente.",
            alertClass: "philo-alert safe",
            coffman: [1, 3],
            brokenCoffman: [4],
            apply: () => {
                setForkState(1, 'eating', '🍴 T1 (P1)');
                setForkState(2, 'eating', '🍴 T2 (P1)');
                setForkState(0, 'eating', '🍴 T0 (P4)');
                setForkState(4, 'eating', '🍴 T4 (P4)');
                setPhilosopherState(1, 'eating', 'Comiendo', '🍝');
                setPhilosopherState(4, 'eating', 'Comiendo', '🍝');
                setPhilosopherState(3, 'hungry', 'Esperando', '⏳');
            }
        },
        {
            num: 6,
            title: "P1 y P4 liberan recursos",
            desc: "P1 y P4 terminan de comer y liberan los cuatro tenedores (T0, T1, T2, T4). Vuelven a pensar 🤔.",
            alert: "P1 y P4 terminaron de comer y liberaron sus tenedores.",
            alertClass: "philo-alert safe",
            coffman: [1, 3],
            brokenCoffman: [4],
            apply: () => {
                setForkState(0, '');
                setForkState(1, '');
                setForkState(2, '');
                setForkState(4, '');
                setPhilosopherState(1, 'thinking', 'Pensando', '🤔');
                setPhilosopherState(4, 'thinking', 'Pensando', '🤔');
            }
        },
        {
            num: 7,
            title: "P3 toma T3 y T4 y come",
            desc: "Filósofo 3 (que esperaba pacientemente) toma los tenedores T3 y T4 ahora disponibles y come 🍝.",
            alert: "🍝 Turno 3: Filósofo 3 come sin sufrir inanición.",
            alertClass: "philo-alert safe",
            coffman: [1, 3],
            brokenCoffman: [4],
            apply: () => {
                setForkState(3, 'eating', '🍴 T3 (P3)');
                setForkState(4, 'eating', '🍴 T4 (P3)');
                setPhilosopherState(3, 'eating', 'Comiendo', '🍝');
            }
        },
        {
            num: 8,
            title: "P3 libera tenedores",
            desc: "Filósofo 3 termina de comer y libera T3 y T4. Todos los filósofos regresan a pensar 🤔.",
            alert: "Filósofo 3 libera sus tenedores. Los 5 comensales han sido atendidos.",
            alertClass: "philo-alert safe",
            coffman: [1, 3],
            brokenCoffman: [4],
            apply: () => {
                setForkState(3, '');
                setForkState(4, '');
                setPhilosopherState(3, 'thinking', 'Pensando', '🤔');
            }
        },
        {
            num: 9,
            title: "🎉 ¡Demostración Exitosa!",
            desc: "🎉 ÉXITO TOTAL: Los 5 filósofos comieron sin interbloqueos ni inanición. La asimetría rompió la Espera Circular de Coffman.",
            alert: "✅ Demostración completada con éxito: Concurrencia justa y segura garantizada.",
            alertClass: "philo-alert safe",
            coffman: [],
            brokenCoffman: [4],
            apply: () => {
                for (let i = 0; i < 5; i++) {
                    setPhilosopherState(i, 'thinking', 'Pensando', '🤔');
                    setForkState(i, '');
                }
            }
        }
    ];

    function getSteps() {
        return currentScenario === 'deadlock' ? deadlockSteps : safeSteps;
    }

    function renderStep(index, logEvent = true) {
        const steps = getSteps();
        if (index < 0) index = 0;
        if (index >= steps.length) index = steps.length - 1;
        currentStep = index;

        // Limpiar mesa a reposo antes de aplicar el estado acumulado
        for (let i = 0; i < 5; i++) {
            setPhilosopherState(i, 'thinking', 'Pensando', '🤔');
            setForkState(i, '');
        }

        // Aplicar todos los pasos desde 0 hasta el paso actual para consistencia exacta
        for (let step = 0; step <= currentStep; step++) {
            steps[step].apply();
        }

        const stepObj = steps[currentStep];

        // UI Updates
        stepIndicator.textContent = `Paso ${currentStep} / ${steps.length - 1}`;
        stepPill.textContent = `Paso ${currentStep}`;
        stepText.innerHTML = stepObj.desc;
        alertBox.className = stepObj.alertClass;
        alertBox.textContent = stepObj.alert;

        // Coffman Badges
        setCoffmanState(stepObj.coffman || [], stepObj.brokenCoffman || []);

        // Buttons state
        btnPrev.disabled = currentStep === 0;
        btnStep.disabled = currentStep === steps.length - 1;

        if (logEvent) {
            logPhilo(`[${currentScenario.toUpperCase()}] ${stepObj.title}: ${stepObj.alert}`, stepObj.alertClass.includes('deadlock'), stepObj.alertClass.includes('safe'));
        }

        if (currentStep === steps.length - 1 && autoTimer) {
            stopAuto();
        }
    }

    function nextStep() {
        const steps = getSteps();
        if (currentStep < steps.length - 1) {
            renderStep(currentStep + 1);
        } else {
            stopAuto();
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            renderStep(currentStep - 1);
        }
    }

    function toggleAuto() {
        if (autoTimer) {
            stopAuto();
        } else {
            startAuto();
        }
    }

    function startAuto() {
        const steps = getSteps();
        if (currentStep >= steps.length - 1) {
            renderStep(0);
        }
        btnAuto.textContent = '⏸️ Pausar';
        btnAuto.style.background = '#f59e0b';
        autoTimer = setInterval(() => {
            const currentSteps = getSteps();
            if (currentStep < currentSteps.length - 1) {
                nextStep();
            } else {
                stopAuto();
            }
        }, 1200);
    }

    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
        btnAuto.textContent = '▶️ Reproducción Automática';
        btnAuto.style.background = '#10b981';
    }

    function switchScenario(scenario) {
        stopAuto();
        currentScenario = scenario;
        if (scenario === 'deadlock') {
            btnModeDeadlock.classList.add('active');
            btnModeSafe.classList.remove('active');
        } else {
            btnModeSafe.classList.add('active');
            btnModeDeadlock.classList.remove('active');
        }
        if (logBox) logBox.innerHTML = '';
        logPhilo(`Cambiado a escenario: ${scenario === 'deadlock' ? 'Interbloqueo Simétrico' : 'Solución Asimétrica Segura'}`);
        renderStep(0);
    }

    function resetTable() {
        stopAuto();
        if (logBox) logBox.innerHTML = '';
        logPhilo('Mesa reiniciada. Los 5 tenedores están sobre la mesa.');
        renderStep(0);
    }

    // Click en filósofo para inspección interactiva
    for (let i = 0; i < 5; i++) {
        const node = document.getElementById(`philo-${i}`);
        if (node) {
            node.style.cursor = 'pointer';
            node.addEventListener('click', () => {
                const left = i;
                const right = (i + 1) % 5;
                logPhilo(`🔍 Filósofo ${i}: Necesita tenedor izquierdo T${left} y tenedor derecho T${right}.`);
            });
        }
    }

    btnModeDeadlock.addEventListener('click', () => switchScenario('deadlock'));
    btnModeSafe.addEventListener('click', () => switchScenario('safe'));
    btnStep.addEventListener('click', nextStep);
    btnPrev.addEventListener('click', prevStep);
    btnAuto.addEventListener('click', toggleAuto);
    btnReset.addEventListener('click', resetTable);

    // Inicializar en paso 0
    renderStep(0, false);
}

// --- SIMULADOR LECTORES - ESCRITORES ---
function initReadersWritersSimulator() {
    const btnAddReader = document.getElementById('btn-add-reader');
    const btnRemoveReader = document.getElementById('btn-remove-reader');
    const btnAddWriter = document.getElementById('btn-add-writer');
    const btnRemoveWriter = document.getElementById('btn-remove-writer');
    const btnReset = document.getElementById('btn-rw-reset');

    const dbDisplay = document.getElementById('rw-db-display');
    const stateBadge = document.getElementById('rw-db-state-badge');
    const activeReadersList = document.getElementById('rw-active-readers-list');
    const activeReadersCount = document.getElementById('rw-active-readers-count');
    const activeWriterDisplay = document.getElementById('rw-active-writer-display');

    const waitReadersList = document.getElementById('rw-wait-readers-list');
    const waitReadersCount = document.getElementById('rw-wait-readers-count');
    const waitWritersList = document.getElementById('rw-wait-writers-list');
    const waitWritersCount = document.getElementById('rw-wait-writers-count');

    const semMutex = document.getElementById('rw-sem-mutex');
    const semWrite = document.getElementById('rw-sem-write');
    const counterReaders = document.getElementById('rw-counter-readers');

    const alertBox = document.getElementById('rw-alert');
    const logBox = document.getElementById('rw-log');

    if (!btnAddReader || !btnAddWriter) return;

    let activeReaders = [];
    let waitingReaders = [];
    let activeWriter = null;
    let waitingWriters = [];

    let readerSeq = 1;
    let writerSeq = 1;

    function logRW(msg, isHighlight = false, isError = false) {
        if (!logBox) return;
        const div = document.createElement('div');
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        if (isError) div.style.color = '#ef4444';
        else if (isHighlight) div.style.color = '#38bdf8';
        logBox.appendChild(div);
        logBox.scrollTop = logBox.scrollHeight;
    }

    function updateUI() {
        // Active readers count and chips
        activeReadersCount.textContent = activeReaders.length;
        activeReadersList.innerHTML = '';
        if (activeReaders.length === 0) {
            activeReadersList.innerHTML = '<span class="rw-empty-hint">Ningún lector en este momento</span>';
        } else {
            activeReaders.forEach(id => {
                const chip = document.createElement('span');
                chip.className = 'rw-chip reader';
                chip.textContent = `📖 Lector ${id}`;
                activeReadersList.appendChild(chip);
            });
        }

        // Active writer display
        activeWriterDisplay.innerHTML = '';
        if (activeWriter === null) {
            activeWriterDisplay.innerHTML = '<span class="rw-empty-hint">Ningún escritor activo</span>';
        } else {
            const chip = document.createElement('span');
            chip.className = 'rw-chip writer';
            chip.textContent = `✍️ Escritor ${activeWriter}`;
            activeWriterDisplay.appendChild(chip);
        }

        // Waiting queues
        waitReadersCount.textContent = waitingReaders.length;
        waitReadersList.innerHTML = '';
        if (waitingReaders.length === 0) {
            waitReadersList.innerHTML = '<span class="rw-empty-hint">Cola vacía</span>';
        } else {
            waitingReaders.forEach(id => {
                const chip = document.createElement('span');
                chip.className = 'rw-chip waiting';
                chip.textContent = `⏳ Lector ${id}`;
                waitReadersList.appendChild(chip);
            });
        }

        waitWritersCount.textContent = waitingWriters.length;
        waitWritersList.innerHTML = '';
        if (waitingWriters.length === 0) {
            waitWritersList.innerHTML = '<span class="rw-empty-hint">Cola vacía</span>';
        } else {
            waitingWriters.forEach(id => {
                const chip = document.createElement('span');
                chip.className = 'rw-chip waiting';
                chip.textContent = `⏳ Escritor ${id}`;
                waitWritersList.appendChild(chip);
            });
        }

        // Semaphores & Counters
        counterReaders.textContent = `readcounter: ${activeReaders.length}`;
        semMutex.textContent = 'mutex: 1 (Libre)';

        if (activeWriter !== null) {
            semWrite.textContent = 'write: 0 (Ocupado por Escritor)';
            semWrite.style.background = 'rgba(239, 68, 68, 0.2)';
            semWrite.style.borderColor = '#ef4444';
            dbDisplay.className = 'rw-db-box writing';
            stateBadge.className = 'rw-badge writing';
            stateBadge.textContent = `ESTADO: ESCRITURA EXCLUSIVA (Escritor ${activeWriter})`;
        } else if (activeReaders.length > 0) {
            semWrite.textContent = 'write: 0 (Bloqueado por 1er Lector)';
            semWrite.style.background = 'rgba(59, 130, 246, 0.2)';
            semWrite.style.borderColor = '#3b82f6';
            dbDisplay.className = 'rw-db-box reading';
            stateBadge.className = 'rw-badge reading';
            stateBadge.textContent = `ESTADO: LECTURA CONCURRENTE (${activeReaders.length} lectores)`;
        } else {
            semWrite.textContent = 'write: 1 (Libre)';
            semWrite.style.background = '';
            semWrite.style.borderColor = '';
            dbDisplay.className = 'rw-db-box';
            stateBadge.className = 'rw-badge idle';
            stateBadge.textContent = 'ESTADO: LIBRE (0 accesos)';
        }

        btnRemoveReader.disabled = activeReaders.length === 0;
        btnRemoveWriter.disabled = activeWriter === null;
    }

    function addReader() {
        const id = readerSeq++;
        logRW(`Solicitud de Lector ${id}: desea leer la base de datos.`);

        if (activeWriter !== null) {
            waitingReaders.push(id);
            alertBox.className = 'philo-alert deadlock';
            alertBox.textContent = `⛔ Lector ${id} bloqueado: La base de datos está bloqueada por Escritor ${activeWriter}. Se encola en espera.`;
            logRW(`Lector ${id} queda BLOQUEADO esperando en la cola (exclusión mutua de escritor).`, false, true);
        } else {
            // Entra a leer
            if (activeReaders.length === 0) {
                logRW(`Lector ${id} es el PRIMER lector (readcounter=0): ejecuta wait(write) y bloquea a futuros escritores.`, true);
            }
            activeReaders.push(id);
            alertBox.className = 'philo-alert safe';
            alertBox.textContent = `📖 Lector ${id} accediendo. Lectura concurrente activa (${activeReaders.length} simultáneos sin interferencia).`;
            logRW(`Lector ${id} accede exitosamente a la base de datos.`);
        }
        updateUI();
    }

    function removeReader() {
        if (activeReaders.length === 0) return;

        const id = activeReaders.pop();
        logRW(`Lector ${id} termina de consultar los datos y sale.`);

        if (activeReaders.length === 0) {
            logRW(`Último lector salió (readcounter=0): ejecuta signal(write), liberando el semáforo 'write'.`, true);
            
            // Si hay escritores en espera, el primero obtiene la BD
            if (waitingWriters.length > 0) {
                activeWriter = waitingWriters.shift();
                alertBox.className = 'philo-alert';
                alertBox.textContent = `✍️ Base de datos desocupada. Escritor ${activeWriter} despierta y toma el control exclusivo.`;
                logRW(`Escritor ${activeWriter} toma el control exclusivo de la base de datos.`);
            } else {
                alertBox.className = 'philo-alert';
                alertBox.textContent = 'Base de datos en reposo. Libre para cualquier proceso.';
            }
        } else {
            alertBox.className = 'philo-alert safe';
            alertBox.textContent = `Lector ${id} salió. Aún quedan ${activeReaders.length} lectores activos.`;
        }
        updateUI();
    }

    function addWriter() {
        const id = writerSeq++;
        logRW(`Solicitud de Escritor ${id}: requiere acceso EXCLUSIVO para modificar datos.`);

        if (activeWriter !== null || activeReaders.length > 0) {
            waitingWriters.push(id);
            alertBox.className = 'philo-alert deadlock';
            alertBox.textContent = `⛔ Escritor ${id} bloqueado: La BD está ocupada por ${activeWriter !== null ? 'un escritor' : activeReaders.length + ' lectores'}.`;
            logRW(`Escritor ${id} queda BLOQUEADO en la cola esperando que la BD quede completamente vacía.`, false, true);
        } else {
            activeWriter = id;
            alertBox.className = 'philo-alert deadlock';
            alertBox.textContent = `✍️ Escritor ${id} ejecutó wait(write). Base de datos en EXCLUSIÓN MUTUA TOTAL.`;
            logRW(`Escritor ${id} adquiere el semáforo 'write' y comienza a escribir.`);
        }
        updateUI();
    }

    function removeWriter() {
        if (activeWriter === null) return;

        const id = activeWriter;
        activeWriter = null;
        logRW(`Escritor ${id} finalizó sus modificaciones y ejecutó signal(write).`, true);

        // Despertar procesos en espera (prioridad a lectores en espera si los hay, o siguiente escritor)
        if (waitingReaders.length > 0) {
            logRW(`Despertando a ${waitingReaders.length} lectores en espera tras salida del escritor.`);
            activeReaders = [...waitingReaders];
            waitingReaders = [];
            alertBox.className = 'philo-alert safe';
            alertBox.textContent = `📖 Escritor liberó la BD. Los ${activeReaders.length} lectores en espera ingresan concurrentemente.`;
        } else if (waitingWriters.length > 0) {
            activeWriter = waitingWriters.shift();
            alertBox.className = 'philo-alert deadlock';
            alertBox.textContent = `✍️ Siguiente Escritor ${activeWriter} en cola toma la base de datos en exclusión mutua.`;
            logRW(`Escritor ${activeWriter} toma el control exclusivo de la base de datos.`);
        } else {
            alertBox.className = 'philo-alert';
            alertBox.textContent = 'Base de datos en reposo. Libre para cualquier proceso.';
        }
        updateUI();
    }

    function resetRW() {
        activeReaders = [];
        waitingReaders = [];
        activeWriter = null;
        waitingWriters = [];
        readerSeq = 1;
        writerSeq = 1;
        if (logBox) logBox.innerHTML = '';
        logRW('Sistema reiniciado. Base de datos reseteada a estado inicial.');
        alertBox.className = 'philo-alert';
        alertBox.textContent = 'Sistema inicializado. Base de datos disponible para lectura o escritura.';
        updateUI();
    }

    btnAddReader.addEventListener('click', addReader);
    btnRemoveReader.addEventListener('click', removeReader);
    btnAddWriter.addEventListener('click', addWriter);
    btnRemoveWriter.addEventListener('click', removeWriter);
    btnReset.addEventListener('click', resetRW);

    updateUI();
}


