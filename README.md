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

### 1️⃣ Laboratorios de Código (Python) y Modelado
En este TP no solo evaluarás la teoría, sino que aplicarás los conceptos en código y en simuladores web interactivos:

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

### 3️⃣ Resolver el Laboratorio Interactivo
1. Abre el archivo `index.html` en cualquier navegador web.
2. Completa los **12 ejercicios**.
3. Tu progreso se guardará automáticamente. Cuando la barra alcance el 100%, haz click en **Exportar Respuestas (.json)**.
4. Guarda el archivo descargado como `respuestas_tp5.json` en la misma carpeta del repositorio.

### 4️⃣ Entrega y Evaluación Automática
```bash
git add respuestas_tp5.json
git commit -m "Entrega TP5 - [Tu Nombre]"
git push origin main
```

¡Listo! Ve a la pestaña **Actions** en tu repositorio de GitHub para ver tu nota de manera inmediata. Si ves un `❌ (Cruz roja)`, lee el resumen para saber qué temas repasar.
