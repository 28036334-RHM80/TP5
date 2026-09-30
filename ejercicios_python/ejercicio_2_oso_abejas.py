"""
UNJu - Facultad de Ingeniería
Teoría de Sistemas Operativos (TSO) - Ciclo Lectivo 2026
Cátedra: Ing. María Fernanda Vázquez - JTP: Ing. Fabio D. Argañaraz

Ejercicio Práctico N° 2: El Problema del Oso y las Abejas
Bibliografía de Referencia:
- Silberschatz: Cap. 6.6 (Problemas clásicos de sincronización)
- Stallings: Cap. 5.4 (Sincronización con semáforos)
"""

import sys
import threading
import time
import random

# Configuración UTF-8 para consola Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

M = 10                  # Capacidad del tarro de miel
NUM_ABEJAS = 5          # Número de abejas obreras
tarro_miel = 0          # Variable compartida
simulacion_activa = True

# TODO PARA EL ESTUDIANTE:
# 1. Define los mecanismos de sincronización necesarios:
# - Un cerrojo (Lock) o semáforo binario para exclusión mutua en el tarro.
# - Un semáforo para despertar al oso cuando el tarro esté lleno.
# - Un semáforo para que las abejas esperen si el tarro está lleno o el oso está comiendo.
mutex = threading.Lock()
sem_oso = threading.Semaphore(0)
sem_tarro_disponible = threading.Semaphore(1)

def abeja(id_abeja):
    global tarro_miel, simulacion_activa
    while simulacion_activa:
        time.sleep(random.uniform(0.05, 0.2))
        
        # TODO: Sincronizar el acceso al tarro de miel:
        # 1. Esperar a que el tarro esté disponible.
        # 2. Entrar en exclusión mutua con el tarro.
        # 3. Depositar una porción de miel (tarro_miel += 1).
        # 4. Si tarro_miel == M, avisar/despertar al oso dormido.
        # 5. Si no está lleno, permitir que otras abejas sigan produciendo.
        # pass

    # 1. Esperar a que el tarro esté disponible para recibir miel
        sem_tarro_disponible.acquire()
        
        # 2. Entrar en exclusión mutua para modificar la variable compartida
        mutex.acquire()
        
        # 3. Depositar una porción de miel
        tarro_miel += 1
        # print(f"Abeja {id_abeja} depositó miel. Nivel: {tarro_miel}/{M}")
        
        # 4. Si el tarro se llenó, se despierta al oso.
        # Si NO se llenó, se libera el semáforo para que pase otra abeja.
        if tarro_miel == M:
            sem_oso.release()
        else:
            sem_tarro_disponible.release()
            
        mutex.release()

def oso(max_tarros=2):
    global tarro_miel, simulacion_activa
    tarros_comidos = 0
    while tarros_comidos < max_tarros and simulacion_activa:
        # =====================================================================
        # # TODO PARA EL ESTUDIANTE:
        # 1. Esperar pasivamente (bloqueado) hasta que una abeja señale que el tarro está lleno:
        # sem_oso.acquire()
        # 2. Comerse toda la miel (tarro_miel = 0).
        # 3. Incrementar tarros_comidos += 1.
        # 4. Avisar a las abejas que el tarro está vacío y disponible (sem_tarro_disponible.release()).
        # =====================================================================
        # pass
        # time.sleep(0.05)
        # break  # Evita bucle infinito si el alumno no implementó el TODO


    # 1. El oso espera pasivamente (dormido) hasta que una abeja le avise
        sem_oso.acquire()
        
        # 2. Entra en exclusión mutua y se come toda la miel
        mutex.acquire()
        tarro_miel = 0
        tarros_comidos += 1
        # print(f"🐻 Oso se comió el tarro #{tarros_comidos}!")
        mutex.release()
        
        # 4. Avisar a las abejas que el tarro vuelve a estar vacío y disponible
        sem_tarro_disponible.release()
        
    simulacion_activa = False

if __name__ == "__main__":
    print("=" * 60)
    print(" Iniciando Simulación: El Oso y las Abejas (UNJu FI)")
    print("=" * 60)
    # TODO: Crear e iniciar los hilos para el oso y las N abejas
    pass

