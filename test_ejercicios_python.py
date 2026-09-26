"""
==============================================================================
UNJu - Universidad Nacional de Jujuy | Facultad de Ingeniería
Cátedra: Teoría de Sistemas Operativos (TSO) - Ciclo Lectivo 2026
Titular: Ing. María Fernanda Vázquez - JTP: Ing. Fabio D. Argañaraz
------------------------------------------------------------------------------
SUITE DE PRUEBAS AUTOMATIZADAS: EJERCICIOS PRÁCTICOS DE PYTHON (TP N° 5)
Evaluación Rigurosa de Concurrencia, Semáforos, Monitores y Ausencia de Deadlocks
==============================================================================

Este módulo realiza pruebas dinámicas y funcionales sobre las implementaciones de los
alumnos en 'ejercicios_python/' (o de la cátedra con bandera --master), verificando:
1. Invariantes de sincronización y exclusión mutua.
2. Ausencia de condiciones de carrera (race conditions).
3. Ausencia de interbloqueos (deadlocks) mediante timeouts de seguridad.
4. Correcto uso de primitivas de señalización y variables de condición.
"""

import sys
import os
import unittest
import threading
import time
import importlib

# Configuración obligatoria UTF-8 para consola Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Directorio a evaluar: por defecto 'ejercicios_python', o 'ejercicios_master_python'
TARGET_DIR = "ejercicios_master_python" if "--master" in sys.argv else "ejercicios_python"


class TestTP5ConcurrenciaPython(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.base_path = os.path.abspath(os.path.dirname(__file__))
        cls.target_path = os.path.join(cls.base_path, TARGET_DIR)
        if cls.target_path not in sys.path:
            sys.path.insert(0, cls.target_path)
            
    def tearDown(self):
        modules_to_clean = [
            'ejercicio_1_sincronizacion',
            'ejercicio_2_oso_abejas',
            'ejercicio_3_filosofos',
            'ejercicio_4_monitores_barbero',
            'ejercicio_5_lectores_escritores'
        ]
        for mod in modules_to_clean:
            if mod in sys.modules:
                del sys.modules[mod]

    # ------------------------------------------------------------------------
    # TEST 1: Sincronización Básica y Trazas (A -> B y ABCABC)
    # ------------------------------------------------------------------------
    def test_ejercicio_1_sincronizacion(self):
        """Verifica que A -> B dé 20 y que los semáforos de señalización de ABC estén definidos y activos."""
        try:
            mod = importlib.import_module("ejercicio_1_sincronizacion")
        except Exception as e:
            self.fail(f"No se pudo importar ejercicio_1_sincronizacion: {e}")

        # 1. Verificación Parte 1: Semáforo de orden A -> B
        self.assertTrue(
            hasattr(mod, 'sem_orden_AB') and isinstance(mod.sem_orden_AB, threading.Semaphore),
            "Falta definir 'sem_orden_AB = threading.Semaphore(0)' en Ejercicio 1 Parte 1."
        )

        mod.X = 199
        hB = threading.Thread(target=mod.proceso_B)
        hB.start()
        time.sleep(0.05)
        # B debe estar bloqueado en acquire() esperando a A
        self.assertTrue(
            hB.is_alive(),
            "Proceso B no esperó a Proceso A (debe llamar sem_orden_AB.acquire() antes de operar)."
        )

        hA = threading.Thread(target=mod.proceso_A)
        hA.start()
        hA.join(timeout=2.0)
        hB.join(timeout=2.0)
        
        self.assertFalse(hA.is_alive(), "Proceso A quedó bloqueado en Ejercicio 1 Parte 1.")
        self.assertFalse(hB.is_alive(), "Proceso B quedó bloqueado en Ejercicio 1 Parte 1.")
        self.assertEqual(mod.X, 20, f"El valor final de X fue {mod.X}; se esperaba exactamente 20.")

        # 2. Verificación Parte 2: Semáforos de señalización ABC
        for sem_name, val_esp in [('sem_sig_A', 1), ('sem_sig_B', 0), ('sem_sig_C', 0)]:
            self.assertTrue(
                hasattr(mod, sem_name) and isinstance(getattr(mod, sem_name), threading.Semaphore),
                f"Falta definir '{sem_name} = threading.Semaphore({val_esp})' en Ejercicio 1 Parte 2."
            )

        # Prueba de ejecución de la secuencia
        tA = threading.Thread(target=mod.proceso_emisor_A, args=(2,))
        tB = threading.Thread(target=mod.proceso_receptor_B, args=(2,))
        tC = threading.Thread(target=mod.proceso_receptor_C, args=(2,))

        tA.start(); tB.start(); tC.start()
        tA.join(timeout=3.0); tB.join(timeout=3.0); tC.join(timeout=3.0)

        self.assertFalse(tA.is_alive() or tB.is_alive() or tC.is_alive(), 
                         "La secuencia ABCABC quedó bloqueada por falta de señales (release) en Ejercicio 1 Parte 2.")

    # ------------------------------------------------------------------------
    # TEST 2: El Oso y las Abejas (Productor - Consumidor)
    # ------------------------------------------------------------------------
    def test_ejercicio_2_oso_abejas(self):
        """Verifica que el oso espere pasivamente en sem_oso y que las abejas llenen el tarro."""
        try:
            mod = importlib.import_module("ejercicio_2_oso_abejas")
        except Exception as e:
            self.fail(f"No se pudo importar ejercicio_2_oso_abejas: {e}")

        self.assertTrue(hasattr(mod, 'M'), "Falta constante M de capacidad del tarro.")
        self.assertTrue(
            hasattr(mod, 'sem_oso') and isinstance(mod.sem_oso, threading.Semaphore),
            "Falta definir 'sem_oso = threading.Semaphore(0)' en Ejercicio 2."
        )
        self.assertTrue(
            hasattr(mod, 'sem_tarro_disponible') and isinstance(mod.sem_tarro_disponible, threading.Semaphore),
            "Falta definir 'sem_tarro_disponible = threading.Semaphore(1)' en Ejercicio 2."
        )
        self.assertTrue(hasattr(mod, 'mutex'), "Falta cerrojo 'mutex' para exclusión mutua en Ejercicio 2.")

        # 1. El oso debe dormir pasivamente si el tarro está vacío
        mod.tarro_miel = 0
        mod.simulacion_activa = True
        mod.M = 4

        hilo_oso = threading.Thread(target=mod.oso, args=(1,), daemon=True)
        hilo_oso.start()
        time.sleep(0.08)

        self.assertTrue(
            hilo_oso.is_alive(),
            "El oso no esperó pasivamente a que el tarro se llene (debe bloquearse con sem_oso.acquire())."
        )

        # 2. Las abejas deben producir miel y despertar al oso al alcanzar M
        hilos_abejas = [threading.Thread(target=mod.abeja, args=(i,), daemon=True) for i in range(1, 4)]
        for t in hilos_abejas:
            t.start()

        # El oso debe despertar, comer 1 tarro y terminar
        hilo_oso.join(timeout=4.0)
        self.assertFalse(hilo_oso.is_alive(), "El oso nunca despertó o quedó en Deadlock (Ejercicio 2).")
        mod.simulacion_activa = False

    # ------------------------------------------------------------------------
    # TEST 3: Cena de los Filósofos (Prevención de Deadlock)
    # ------------------------------------------------------------------------
    def test_ejercicio_3_filosofos(self):
        """Verifica que los 5 filósofos coman sin producir Deadlock (rompiendo espera circular)."""
        try:
            mod = importlib.import_module("ejercicio_3_filosofos")
        except Exception as e:
            self.fail(f"No se pudo importar ejercicio_3_filosofos: {e}")

        self.assertTrue(hasattr(mod, 'NUM_FILOSOFOS'), "Falta constante NUM_FILOSOFOS.")
        self.assertTrue(hasattr(mod, 'filosofo'), "Falta función filosofo en ejercicio_3.")

        mod.comidas = [0] * mod.NUM_FILOSOFOS
        hilos = [threading.Thread(target=mod.filosofo, args=(i, 2), name=f"Test-Philo-{i}") for i in range(mod.NUM_FILOSOFOS)]

        for t in hilos:
            t.start()

        # Los 5 filósofos deben completar 2 rondas de comida en menos de 5 segundos
        for t in hilos:
            t.join(timeout=5.0)
            self.assertFalse(t.is_alive(), f"Filósofo {t.name} quedó bloqueado por Deadlock o Inanición.")

        for i, cant in enumerate(mod.comidas):
            self.assertGreaterEqual(
                cant, 2, 
                f"El Filósofo {i} no comió (comidas = {cant}); debes implementar la adquisición de tenedores e invocar comer(id)."
            )

    # ------------------------------------------------------------------------
    # TEST 4: Barbero Dormilón con Monitores
    # ------------------------------------------------------------------------
    def test_ejercicio_4_monitores_barbero(self):
        """Verifica encapsulamiento en BarberiaMonitor con rechazo por sala llena y atención segura."""
        try:
            mod = importlib.import_module("ejercicio_4_monitores_barbero")
        except Exception as e:
            self.fail(f"No se pudo importar ejercicio_4_monitores_barbero: {e}")

        self.assertTrue(hasattr(mod, 'BarberiaMonitor'), "Falta clase BarberiaMonitor en ejercicio_4.")
        
        barberia = mod.BarberiaMonitor(num_sillas_espera=2)
        
        # 1. Test de sala de espera llena directa
        barberia.clientes_esperando = 2
        resultado_lleno = barberia.entrar_cliente(99)
        self.assertFalse(resultado_lleno, "El cliente 99 debió ser rechazado porque la sala de espera estaba llena (2/2).")
        barberia.clientes_esperando = 0

        # 2. Test de atención de clientes:
        t_barbero = threading.Thread(target=mod.hilo_barbero, args=(barberia,), daemon=True)
        t_barbero.start()

        # Lanzamos un cliente para verificar que completar_corte retorne True
        resultado_atencion = [None]
        def cliente_test():
            resultado_atencion[0] = barberia.entrar_cliente(1)

        t_cli = threading.Thread(target=cliente_test, daemon=True)
        t_cli.start()
        t_cli.join(timeout=3.5)

        self.assertFalse(t_cli.is_alive(), "El cliente quedó bloqueado indefinidamente en BarberiaMonitor.")
        self.assertTrue(
            resultado_atencion[0] is True,
            "El cliente 1 no fue atendido (entrar_cliente debe retornar True tras completar el corte)."
        )

        barberia.cerrar_barberia()
        t_barbero.join(timeout=2.0)
        self.assertFalse(t_barbero.is_alive(), "El barbero no finalizó su turno al cerrar la barbería.")

    # ------------------------------------------------------------------------
    # TEST 5: Lectores y Escritores (Courtois et al.)
    # ------------------------------------------------------------------------
    def test_ejercicio_5_lectores_escritores(self):
        """Verifica concurrencia entre lectores y exclusión mutua estricta para escritores."""
        try:
            mod = importlib.import_module("ejercicio_5_lectores_escritores")
        except Exception as e:
            self.fail(f"No se pudo importar ejercicio_5_lectores_escritores: {e}")

        self.assertTrue(hasattr(mod, 'lector'), "Falta función lector en ejercicio_5.")
        self.assertTrue(hasattr(mod, 'escritor'), "Falta función escritor en ejercicio_5.")
        self.assertTrue(hasattr(mod, 'readcounter'), "Falta variable readcounter en Ejercicio 5.")
        self.assertTrue(hasattr(mod, 'sem_write'), "Falta semáforo sem_write en Ejercicio 5.")
        self.assertTrue(hasattr(mod, 'mutex'), "Falta semáforo mutex en Ejercicio 5.")

        mod.readcounter = 0

        # 1. Verificación de exclusión mutua activa:
        # Lanzamos un lector en un hilo y comprobamos que mientras lea, readcounter sea >= 1
        # y que sem_write esté adquirido (bloqueando a los escritores)
        t_lec = threading.Thread(target=mod.lector, args=(99, 1), daemon=True)
        t_lec.start()

        # Esperamos a que el lector ingrese a la sección crítica (hasta 1.0s)
        max_muestreos = 20
        lector_entro = False
        exclusion_verificada = False

        while max_muestreos > 0 and t_lec.is_alive():
            if mod.readcounter >= 1:
                lector_entro = True
                # Verificamos si sem_write está bloqueado (un escritor no debe poder entrar)
                puede_escribir = mod.sem_write.acquire(blocking=False)
                if not puede_escribir:
                    exclusion_verificada = True
                else:
                    mod.sem_write.release()
                break
            time.sleep(0.04)
            max_muestreos -= 1

        t_lec.join(timeout=3.0)

        self.assertTrue(
            lector_entro,
            "El lector no incrementó 'readcounter' (debe utilizar 'mutex' y 'readcounter += 1' al ingresar)."
        )
        self.assertTrue(
            exclusion_verificada,
            "El primer lector no bloqueó 'sem_write' (los escritores no fueron bloqueados mientras había lectores activos)."
        )


def run_tests():
    suite = unittest.TestLoader().loadTestsFromTestCase(TestTP5ConcurrenciaPython)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result


if __name__ == "__main__":
    res = run_tests()
    sys.exit(0 if res.wasSuccessful() else 1)
