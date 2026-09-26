# 🛠️ TP N° 5: Sincronización de Procesos

**Universidad Nacional de Jujuy (UNJu) — Facultad de Ingeniería**  
**Cátedra:** Teoría de Sistemas Operativos (TSO)  
**Ciclo Lectivo:** 2026  
**Responsable de Cátedra:** Ing. María Fernanda Vázquez  
**JTP:** Ing. Fabio D. Argañaraz  

[![GitHub Classroom Autograding](https://github.com/UNJU-Teoria-de-Sistemas-Operativos/TP5/actions/workflows/classroom.yml/badge.svg)](https://github.com/UNJU-Teoria-de-Sistemas-Operativos/TP5/actions/workflows/classroom.yml)

## 🎯 Objetivos del Trabajo Práctico

- Identificar las características y funciones de una variable semáforo y de un monitor.
- Resolver problemas clásicos de exclusión mutua mediante herramientas lógicas (Python `threading`).
- Comprender el uso de sincronización en condiciones de carrera.

## 📚 Mapa Bibliográfico

Para resolver los ejercicios interactivos, deberás basarte en la teoría vista en clase y la siguiente bibliografía oficial:

| Tema | Libro de Referencia | Capítulo |
| :--- | :--- | :--- |
| **Sección Crítica y Hardware** | Silberschatz, *Fundamentos de SO* (7ma Ed.) | Cap. 6.2 y 6.3 |
| **Semáforos y Monitores** | Silberschatz, *Fundamentos de SO* (7ma Ed.) | Cap. 6.6 y 6.7 |
| **Transacciones Atómicas** | Silberschatz, *Fundamentos de SO* (7ma Ed.) | Cap. 6.9 |

> 💡 **Nota:** También puedes guiarte utilizando las **Diapositivas de Cátedra (U5 - Sincronización de Procesos)**.

## 🚀 Guía de Autoevaluación y Laboratorios Prácticos

### 1️⃣ Estructura del Trabajo Práctico
En este TP no solo evaluarás la teoría, sino que aplicarás los conceptos en simuladores web interactivos y en código concurrente real en Python:

- **Simuladores Interactivos en `index.html`:**
  - 🏎️ *Condición de Carrera:* Visualiza la inconsistencia de variables compartidas sin sincronización vs. Locks.
  - 🔬 *Productor - Consumidor (Paso a Paso & Buffer Acotado):* Control de buffer circular acotado con ejecución paso a paso, regulación de velocidad (Lento/Normal/Rápido), seguimiento de punteros in/out, semáforos mutex/empty/full con colas reales de hilos bloqueados, y 4 escenarios didácticos (Ciclo Normal, Buffer Lleno, Buffer Vacío, Competencia Mutex) más Modo Libre Interactivo.
  - 🍝 *La Cena de los Filósofos (Paso a Paso):* Demostración guiada paso a paso con seguimiento dinámico de las 4 condiciones de Coffman (Interbloqueo por espera circular vs. Solución Asimétrica de Dijkstra).
  - 📖 *Lectores - Escritores:* Acceso concurrente de múltiples lectores a la BD compartida vs. exclusión mutua estricta de escritores (Courtois et al.).

- **Prácticas en Python (`ejercicios_python/`):**
  1. `ejercicio_1_sincronizacion.py`: Sincronización sobre variable compartida (Parte 1) y trazas de señalización estricta $A \rightarrow B \rightarrow C$ (Parte 2).
  2. `ejercicio_2_oso_abejas.py`: Productor-consumidor generalizado (N abejas, 1 oso con tarro de capacidad $M$).
  3. `ejercicio_3_filosofos.py`: Prevención de Deadlock mediante ruptura de simetría en la Cena de los Filósofos.
  4. `ejercicio_4_monitores_barbero.py`: Implementación de Monitores con `threading.Condition` (El Barbero Dormilón).
  5. `ejercicio_5_lectores_escritores.py`: Algoritmo canónico de lectores y escritores con semáforos `mutex` y `write`.

- **Modelado Lógico (`modelado_logico.md`):**
  1. *Sincronización de Secuencias Estrictas y Alternadas:* Trazas `ABCABC`, `ABACABAC` y `(A o B) C`.
  2. *El Comedor Escolar:* Coordinación de múltiples recursos heterogéneos con semáforos contadores.
  3. *El Puente Levadizo:* Modelado con Monitores y variables de condición.

### 2️⃣ Realizar el Fork y Clonar
1. Haz click en el botón **Fork** en la parte superior derecha de este repositorio.
2. Clona tu repositorio personal en tu PC:
   ```bash
   git clone https://github.com/TU_USUARIO/TP5.git
   cd TP5
   ```

### 3️⃣ Resolver la Evaluación Conceptual Web (`index.html`)
1. Abre el archivo `index.html` en cualquier navegador web.
2. Experimenta con los simuladores interactivos y completa los **12 ejercicios teóricos**.
3. Tu progreso se guardará automáticamente en el navegador. Cuando la barra alcance el 100%, haz click en **Exportar Respuestas (.json)**.
4. Guarda el archivo descargado como `respuestas_tp5.json` en la raíz de tu repositorio.

### 4️⃣ Resolver y Probar los Scripts de Concurrencia en Python (`ejercicios_python/`)
Cada script dentro de `ejercicios_python/` contiene una plantilla con bloques `TODO` guiados y explicaciones teóricas:

1. Completa los mecanismos de sincronización requeridos (`threading.Lock`, `threading.Semaphore`, `threading.Condition`).
2. **Prueba cada ejercicio de manera individual** para verificar en consola la salida de los hilos:
   ```bash
   python ejercicios_python/ejercicio_1_sincronizacion.py
   python ejercicios_python/ejercicio_2_oso_abejas.py
   python ejercicios_python/ejercicio_3_filosofos.py
   python ejercicios_python/ejercicio_4_monitores_barbero.py
   python ejercicios_python/ejercicio_5_lectores_escritores.py
   ```
3. **Ejecuta la suite oficial de pruebas unitarias:**
   ```bash
   python test_ejercicios_python.py
   ```
   Esta suite valida automáticamente:
   - ✅ Eliminación de condiciones de carrera en variables críticas.
   - ✅ Secuenciación estricta de trazas ($A \rightarrow B \rightarrow C$).
   - ✅ Sincronización Productor-Consumidor (tarro lleno despierta al oso y vaciado reanuda abejas).
   - ✅ Ruptura de simetría y prevención de Deadlocks en la Cena de los Filósofos.
   - ✅ Coordinación y condición de guarda en el monitor del Barbero Dormilón.
   - ✅ Exclusión mutua estricta de lectores y escritores.

### 5️⃣ Probar la Autoevaluación Integral en Local
Puedes comprobar tu puntaje total antes de subir el trabajo ejecutando el evaluador de cátedra:
```bash
# Evaluación integral completa (Teoría + Código Python):
python autograder_tp5.py

# Si aún no terminaste la teoría y solo quieres probar tu código:
python autograder_tp5.py --code-only
```

### 6️⃣ Entrega y Evaluación Automática en GitHub Classroom
Cuando hayas completado ambas partes y las pruebas locales aprueben:

```bash
# 1. Agrega tanto tus respuestas teóricas como tus scripts de código resueltos:
git add respuestas_tp5.json ejercicios_python/

# 2. Realiza el commit:
git commit -m "Entrega TP5 - [Tu Nombre y Apellido]"

# 3. Envía los cambios a tu repositorio remoto:
git push origin main
```

### 📊 Criterio de Calificación
La nota final se pondera automáticamente de manera equitativa:
- **50% Evaluación Conceptual:** Validada a través de `respuestas_tp5.json` (hasta 10 pts).
- **50% Evaluación Práctica:** 5 tests automatizados en `test_ejercicios_python.py` (2 pts por ejercicio, hasta 10 pts).

> 💡 **Nota:** Al hacer el `git push`, ve a la pestaña **Actions** en tu repositorio de GitHub. El workflow de GitHub Classroom correrá los tests en un runner limpio y publicará tu reporte de autograding oficial de forma inmediata. Si ves un `❌ (Cruz roja)`, revisa el resumen para corregir los fallos y vuelve a enviar un commit.

