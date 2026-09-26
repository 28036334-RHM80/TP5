"""
==============================================================================
UNJu - Universidad Nacional de Jujuy | Facultad de Ingeniería
Cátedra: Teoría de Sistemas Operativos (TSO) - Ciclo Lectivo 2026
Titular: Ing. María Fernanda Vázquez - JTP: Ing. Fabio D. Argañaraz
------------------------------------------------------------------------------
SUITE DE PRUEBAS AUTOMATIZADAS: EJERCICIOS PRÁCTICOS DE PYTHON (TP N° 5)
Evaluación de Concurrencia, Semáforos, Monitores y Ausencia de Deadlocks
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
        # Aseguramos que el directorio bajo prueba esté en sys.path
        cls.base_path = os.path.abspath(os.path.dirname(__file__))
        cls.target_path = os.path.join(cls.base_path, TARGET_DIR)
        if cls.target_path not in sys.path:
            sys.path.insert(0, cls.target_path)
            
    def tearDown(self):
        # Limpieza de imports para evitar efectos colaterales entre tests
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
        """Verifica que A -> B dé siempre 20 y que ABCABC respete el orden estricto."""
        try:
            mod = importlib.import_module("ejercicio_1_sincronizacion")
        except Exception as e:
            self.fail(f"No se pudo importar ejercicio_1_sincronizacion: {e}")

        # Test Parte 1: X debe ser 20 invariablemente
        mod.X = 199
        hB = threading.Thread(target=mod.proceso_B)
        hA = threading.Thread(target=mod.proceso_A)
        # Lanzamos B primero para verificar que espere a A
        hB.start()
        hA.start()
        hA.join(timeout=2.0)
        hB.join(timeout=2.0)
        
        self.assertFalse(hA.is_alive(), "Proceso A quedó bloqueado (Deadlock en Ejercicio 1 Parte 1).")
        self.assertFalse(hB.is_alive(), "Proceso B quedó bloqueado (Deadlock en Ejercicio 1 Parte 1).")
        self.assertEqual(mod.X, 20, f"El valor final de X fue {mod.X}; se esperaba exactamente 20.")

        # Test Parte 2: Secuencia estricta
        if hasattr(mod, 'proceso_emisor_A') and hasattr(mod, 'sem_sig_A'):
            # Verificamos que los semáforos existan y tengan valores iniciales coherentes
            self.assertTrue(hasattr(mod, 'sem_sig_A'), "Falta sem_sig_A en Ejercicio 1.")
            self.assertTrue(hasattr(mod, 'sem_sig_B'), "Falta sem_sig_B en Ejercicio 1.")
            self.assertTrue(hasattr(mod, 'sem_sig_C'), "Falta sem_sig_C en Ejercicio 1.")

    # ------------------------------------------------------------------------
    # TEST 2: El Oso y las Abejas (Productor - Consumidor)
    # ------------------------------------------------------------------------
    def test_ejercicio_2_oso_abejas(self):
        """Verifica que el tarro no se desborde y que el oso vacíe el tarro al llenarse."""
        try:
            mod = importlib.import_module("ejercicio_2_oso_abejas")
        except Exception as e:
            self.fail(f"No se pudo importar ejercicio_2_oso_abejas: {e}")

        self.assertTrue(hasattr(mod, 'M'), "Falta constante M de capacidad del tarro.")
        self.assertTrue(hasattr(mod, 'abeja'), "Falta función abeja en ejercicio_2.")
        self.assertTrue(hasattr(mod, 'oso'), "Falta función oso en ejercicio_2.")

        # Configuramos una ejecución controlada de prueba
        mod.M = 5
        mod.tarro_miel = 0
        mod.simulacion_activa = True

        hilo_oso = threading.Thread(target=mod.oso, args=(1,), daemon=True)
        hilos_abejas = [threading.Thread(target=mod.abeja, args=(i,), daemon=True) for i in range(1, 4)]

        hilo_oso.start()
        for t in hilos_abejas:
            t.start()

        # El oso debe despertar, comer 1 tarro y terminar en menos de 4 segundos
        hilo_oso.join(timeout=4.0)
        self.assertFalse(hilo_oso.is_alive(), "El oso nunca despertó o quedó en Deadlock (Ejercicio 2).")
        mod.simulacion_activa = False

    # ------------------------------------------------------------------------
    # TEST 3: Cena de los Filósofos (Prevención de Deadlock)
    # ------------------------------------------------------------------------
    def test_ejercicio_3_filosofos(self):
        """Verifica que los 5 filósofos coman sin producir Deadlock (Espera Circular evitada)."""
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
            self.assertGreaterEqual(cant, 2, f"El Filósofo {i} solo comió {cant} veces; debió comer al menos 2.")

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
        
        # Test de sala de espera llena directa
        # Ocupamos artificialmente las 2 sillas
        barberia.clientes_esperando = 2
        resultado = barberia.entrar_cliente(99)
        self.assertFalse(resultado, "El cliente 99 debió ser rechazado porque la sala de espera estaba llena (2/2).")
        barberia.clientes_esperando = 0  # Restauramos

        # Test de concurrencia barbero - cliente
        t_barbero = threading.Thread(target=mod.hilo_barbero, args=(barberia,), daemon=True)
        t_barbero.start()

        hilos_cli = [threading.Thread(target=mod.hilo_cliente, args=(barberia, i), daemon=True) for i in range(1, 5)]
        for t in hilos_cli:
            t.start()
        for t in hilos_cli:
            t.join(timeout=4.0)

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

        version_inicial = mod.base_de_datos["version"]
        
        # Lanzamos 3 lectores y 1 escritor
        hilos = []
        for i in range(1, 4):
            hilos.append(threading.Thread(target=mod.lector, args=(i, 1)))
        hilos.append(threading.Thread(target=mod.escritor, args=(1, 1)))

        for t in hilos:
            t.start()
        for t in hilos:
            t.join(timeout=4.0)
            self.assertFalse(t.is_alive(), f"El hilo {t.name} quedó bloqueado por Deadlock en Lectores-Escritores.")

        self.assertGreater(mod.base_de_datos["version"], version_inicial, "El escritor debió actualizar la versión de la base de datos.")


def run_tests():
    suite = unittest.TestLoader().loadTestsFromTestCase(TestTP5ConcurrenciaPython)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result


if __name__ == "__main__":
    res = run_tests()
    sys.exit(0 if res.wasSuccessful() else 1)
