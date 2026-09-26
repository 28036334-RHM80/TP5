# 🧩 Problemas de Modelado Lógico: Sincronización y Concurrencia
## Cátedra de Teoría de Sistemas Operativos — UNJu FI 2026

Resuelve los siguientes problemas utilizando pseudocódigo con **Semáforos** (`wait()` y `signal()`) o **Monitores** (variables de condición). Para cada problema:
- Identifica claramente las variables compartidas.
- Especifica el tipo de cada semáforo (binario o contador) y su **valor de inicialización**.
- Escribe el pseudocódigo estructurado de cada hebra o proceso concurrente.

---

## 📌 Mapeo Teórico-Práctico: Del Pseudocódigo a Python (`threading`)

Antes de comenzar a programar en `ejercicios_python/`, utiliza esta guía rápida de equivalencias:

| Concepto Teórico | Notación Lógica / Pseudocódigo | Implementación en Python (`import threading`) |
| :--- | :--- | :--- |
| **Semáforo Binario (Mutex)** | `S = Semáforo(1)` | `S = threading.Semaphore(1)` o `lock = threading.Lock()` |
| **Semáforo de Evento (Señal)** | `S = Semáforo(0)` | `S = threading.Semaphore(0)` |
| **Semáforo Contador (Recursos)** | `S = Semáforo(N)` | `S = threading.Semaphore(N)` |
| **Operación $P$ / Esperar** | `wait(S)` | `S.acquire()` |
| **Operación $V$ / Señalizar** | `signal(S)` | `S.release()` |
| **Crear Monitor / Lock de Estado** | `Monitor M { ... }` | `class MiMonitor: def __init__(self): self.lock = threading.Lock()` |
| **Variable de Condición** | `cond = Condicion()` | `cond = threading.Condition(self.lock)` |
| **Esperar en Condición** | `cond.wait()` | `with self.lock: while not condicion: cond.wait()` |
| **Despertar a un proceso** | `cond.signal()` | `with self.lock: cond.notify()` |
| **Despertar a todos (Broadcast)** | `cond.broadcast()` | `with self.lock: cond.notify_all()` |
| **Crear y lanzar hilo** | `iniciar_hebra(f, args)` | `t = threading.Thread(target=f, args=(...)); t.start()` |
| **Esperar finalización de hilo** | `esperar_hebra(t)` | `t.join()` |

---

## Problema 1: Sincronización de Secuencias Estrictas y Alternadas

Encontrar la secuencia lógica y los valores iniciales de los semáforos que permitan forzar de manera determinista las siguientes trazas de ejecución en un sistema multiproceso:

1. **Secuencia con Prioridad Fija (`ABCABC`):**
   - Un emisor ($A$) y dos receptores ($B$ y $C$) que retiran la misma información en momentos distintos ($B$ tiene prioridad sobre $C$). Secuencia esperada: $A \rightarrow B \rightarrow C \rightarrow A \rightarrow B \rightarrow C...$
2. **Secuencia Alternada (`ABACABAC`):**
   - Un emisor ($A$) y dos receptores ($B$ y $C$) que retiran información en forma alternada (comienza $B$). Secuencia esperada: $A \rightarrow B \rightarrow A \rightarrow C \rightarrow A \rightarrow B \rightarrow A \rightarrow C...$
3. **Secuencia con No-Determinismo Regulado (`(A o B) C (A o B) C`):**
   - Dos emisores ($A$ y $B$) y un receptor ($C$). Los emisores compiten al azar, pero el receptor siempre debe intercalarse entre cada emisión: $(A \lor B) \rightarrow C \rightarrow (A \lor B) \rightarrow C...$

**Tu tarea:**
1. En cada caso, define la cantidad de semáforos necesarios y su inicialización.
2. Escribe el pseudocódigo de cada proceso involucrado con sus llamadas a `wait()` y `signal()`.

---

## Problema 2: El Comedor Escolar (Recursos Heterogéneos)

En un colegio hay un comedor con capacidad para 18 personas. El estudiante, cuando desea comer, entra en el comedor y coge una bandeja con comida de cualquiera de los dos mostradores disponibles; a continuación, selecciona agua o coca cola. Si escoge coca cola, dispone de 3 abridores para abrir la botella; si escoge agua no necesita abridor. Después de la comida puede seleccionar un postre de 2 mostradores disponibles para ello, siempre y cuando desee postre. Cuando termina el postre, o si ha optado por no tomarlo, sale del comedor.

**Tu tarea:**
1. Identifica los semáforos necesarios y su valor de inicialización.
2. Escribe el pseudocódigo del proceso `Estudiante()`.

---

## Problema 3: El Puente Levadizo (Monitores y Prioridad)

Tenemos un puente levadizo sobre un río con las siguientes condiciones de utilización:
- Los barcos tienen siempre prioridad de paso, pero para levantar el puente han de esperar a que no haya ningún coche sobre él.
- Los coches pueden utilizar el puente si no hay ningún barco pasando (en cuyo caso el puente estará levantado) o esperando.

**Tu tarea:**
1. Diseña la solución utilizando **Monitores** (variables de condición).
2. Escribe el pseudocódigo para los métodos `entrar_coche()`, `salir_coche()`, `entrar_barco()`, `salir_barco()`.
