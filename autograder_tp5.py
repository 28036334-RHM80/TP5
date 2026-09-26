"""
==============================================================================
UNJu - Universidad Nacional de Jujuy | Facultad de Ingeniería
Cátedra: Teoría de Sistemas Operativos (TSO) - Ciclo Lectivo 2026
Titular: Ing. María Fernanda Vázquez - JTP: Ing. Fabio D. Argañaraz
------------------------------------------------------------------------------
SISTEMA DE AUTOEVALUACIÓN INTEGRAL (DUAL AUTOGRADER) - TP N° 5
Evaluación Teórica (Rúbrica SHA-256) + Evaluación Práctica de Código (Python)
==============================================================================
"""

import sys
import json
import hashlib
import os
import unittest

# Fuerza codificación UTF-8 en consola Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

CATEDRA_SALT = "TSO_UNJu_FI_2026_CatedraVazquez_SecretSalt"

def get_hash(ej_id, item_id, val):
    s = f"{ej_id}:{item_id}:{val}:{CATEDRA_SALT}"
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

def evaluar_teoria(archivo_respuestas):
    """Evalúa el archivo JSON generado en index.html contra rubric_tp5.json."""
    if not os.path.exists(archivo_respuestas):
        return {
            "disponible": False,
            "error": f"No se encontró el archivo '{archivo_respuestas}'.",
            "score": 0,
            "max_score": 100,
            "grade": 0.0,
            "results": []
        }
        
    try:
        with open(archivo_respuestas, 'r', encoding='utf-8') as f:
            respuestas = json.load(f)
    except Exception as e:
        return {
            "disponible": False,
            "error": f"Error al leer '{archivo_respuestas}': {e}",
            "score": 0,
            "max_score": 100,
            "grade": 0.0,
            "results": []
        }
        
    if not os.path.exists('rubric_tp5.json'):
        return {
            "disponible": False,
            "error": "No se encontró 'rubric_tp5.json'.",
            "score": 0,
            "max_score": 100,
            "grade": 0.0,
            "results": []
        }
        
    with open('rubric_tp5.json', 'r', encoding='utf-8') as f:
        rubrica = json.load(f)
        
    max_score = rubrica.get("max_score", 100)
    exercises = rubrica.get("exercises", {})
    
    total_score = 0
    results = []
    
    for ej_id, ej_data in exercises.items():
        weight = ej_data.get("weight", 0)
        expected_hash = ej_data.get("hash")
        student_ans = respuestas.get(ej_id, "")
        student_hash = get_hash(ej_id, 'q1', student_ans)
        
        if student_hash == expected_hash:
            total_score += weight
            results.append({"ej_id": ej_id, "status": "Correcto", "score": weight, "feedback": "¡Excelente!"})
        else:
            results.append({"ej_id": ej_id, "status": "Incorrecto", "score": 0, "feedback": ej_data.get("feedback", "Revisar bibliografía.")})
            
    nota = (total_score / max_score) * 10
    return {
        "disponible": True,
        "score": total_score,
        "max_score": max_score,
        "grade": nota,
        "results": results
    }

def evaluar_codigo_python(target_dir="ejercicios_python"):
    """Ejecuta los tests unitarios automatizados de los 5 scripts Python."""
    import contextlib
    import io
    import test_ejercicios_python
    
    # Configuramos el directorio a evaluar
    test_ejercicios_python.TARGET_DIR = target_dir
    test_ejercicios_python.TestTP5ConcurrenciaPython.target_path = os.path.join(
        os.path.abspath(os.path.dirname(__file__)), target_dir
    )
    if test_ejercicios_python.TestTP5ConcurrenciaPython.target_path not in sys.path:
        sys.path.insert(0, test_ejercicios_python.TestTP5ConcurrenciaPython.target_path)

    suite = unittest.TestLoader().loadTestsFromTestCase(test_ejercicios_python.TestTP5ConcurrenciaPython)
    runner = unittest.TextTestRunner(verbosity=0, stream=open(os.devnull, 'w'))
    
    # Silenciamos la salida estándar de los hilos para no contaminar el reporte del autograder
    with contextlib.redirect_stdout(io.StringIO()):
        test_res = runner.run(suite)
    
    mapping = [
        ("test_ejercicio_1_sincronizacion", "ej1_sincronizacion.py", "Sincronización y Trazas A->B y ABCABC"),
        ("test_ejercicio_2_oso_abejas", "ej2_oso_abejas.py", "Productor-Consumidor Oso y Abejas"),
        ("test_ejercicio_3_filosofos", "ej3_filosofos.py", "Cena de los Filósofos (Anti-Deadlock)"),
        ("test_ejercicio_4_monitores_barbero", "ej4_monitores_barbero.py", "Barbero Dormilón con Monitores"),
        ("test_ejercicio_5_lectores_escritores", "ej5_lectores_escritores.py", "Lectores-Escritores de Courtois")
    ]
    
    failures = {test.id().split('.')[-1]: err for test, err in test_res.failures + test_res.errors}
    
    results = []
    pts_per_test = 20
    score = 0
    
    for method_name, file_name, desc in mapping:
        if method_name in failures:
            raw_err = failures[method_name]
            clean_err = raw_err.strip().splitlines()[-1] if raw_err else "Error en test"
            results.append({
                "file": file_name,
                "desc": desc,
                "status": "Fallido",
                "score": 0,
                "max_score": pts_per_test,
                "feedback": f"❌ {clean_err}"
            })
        else:
            score += pts_per_test
            results.append({
                "file": file_name,
                "desc": desc,
                "status": "Aprobado",
                "score": pts_per_test,
                "max_score": pts_per_test,
                "feedback": "✅ Test superado exitosamente sin Deadlocks ni fallos."
            })
            
    grade = (score / 100.0) * 10.0
    return {
        "score": score,
        "max_score": 100,
        "grade": grade,
        "passed": test_res.wasSuccessful(),
        "results": results
    }

def main():
    args = sys.argv[1:]
    is_json_out = '--json' in args
    is_theory_only = '--theory-only' in args
    is_code_only = '--code-only' in args
    is_master = '--master' in args
    
    # Determinar archivo de respuestas
    archivo_respuestas = "respuestas_tp5.json"
    for a in args:
        if not a.startswith("--") and a.endswith(".json"):
            archivo_respuestas = a
            break
            
    target_code_dir = "ejercicios_master_python" if is_master else "ejercicios_python"
    
    teoria_res = None
    codigo_res = None
    
    if not is_code_only:
        teoria_res = evaluar_teoria(archivo_respuestas)
        
    if not is_theory_only:
        codigo_res = evaluar_codigo_python(target_code_dir)
        
    # Cálculo de nota final global
    if teoria_res and teoria_res["disponible"] and codigo_res:
        # Ponderación 50% Teoría + 50% Código
        nota_final = (teoria_res["grade"] * 0.5) + (codigo_res["grade"] * 0.5)
        puntaje_final = int((teoria_res["score"] * 0.5) + (codigo_res["score"] * 0.5))
    elif teoria_res and teoria_res["disponible"]:
        nota_final = teoria_res["grade"]
        puntaje_final = teoria_res["score"]
    elif codigo_res:
        nota_final = codigo_res["grade"]
        puntaje_final = codigo_res["score"]
    else:
        nota_final = 0.0
        puntaje_final = 0

    if is_json_out:
        out = {
            "final_grade": round(nota_final, 2),
            "final_score": puntaje_final,
            "theory": teoria_res,
            "code": codigo_res
        }
        print(json.dumps(out, indent=2))
        return

    # Salida por consola formateada
    print("\n" + "=" * 70)
    print(" 🎓 UNJu FI - TSO 2026: EVALUADOR INTEGRAL TP N° 5 (SINCRONIZACIÓN)")
    print("=" * 70)
    
    if teoria_res:
        print("\n📚 PARTE 1: EVALUACIÓN TEÓRICA CONCEPTUAL (RÚBRICA INTERACTIVA WEB)")
        print("-" * 70)
        if not teoria_res["disponible"]:
            print(f"⚠️  {teoria_res['error']}")
            print("   Descarga 'respuestas_tp5.json' desde index.html para completar esta parte.")
        else:
            for r in teoria_res["results"]:
                mark = "✅" if r["status"] == "Correcto" else "❌"
                print(f"{mark} {r['ej_id']:<26}: {r['status']:<10} ({r['score']:>2} pts) - {r['feedback']}")
            print(f"\nSubtotal Teoría: {teoria_res['score']}/{teoria_res['max_score']} pts | Nota Teoría: {teoria_res['grade']:.1f}/10.0")

    if codigo_res:
        print("\n🐍 PARTE 2: EVALUACIÓN PRÁCTICA DE CÓDIGO (TESTS CONCURRENCIA PYTHON)")
        print(f"   [Evaluando scripts en '{target_code_dir}/']")
        print("-" * 70)
        for r in codigo_res["results"]:
            mark = "✅" if r["status"] == "Aprobado" else "❌"
            print(f"{mark} {r['file']:<32}: {r['status']:<10} ({r['score']:>2}/20 pts)")
            print(f"   └─ {r['feedback']}")
        print(f"\nSubtotal Código: {codigo_res['score']}/{codigo_res['max_score']} pts | Nota Código: {codigo_res['grade']:.1f}/10.0")

    print("\n" + "=" * 70)
    if teoria_res and teoria_res["disponible"] and codigo_res:
        print(f" 🏆 NOTA FINAL GLOBAL DEL TP N° 5: {nota_final:.1f} / 10.0 ({puntaje_final} / 100 pts)")
        print(" (50% Evaluación Conceptual Web + 50% Tests Prácticos Python)")
    elif teoria_res and teoria_res["disponible"]:
        print(f" 📝 NOTA TEORÍA (Sólo JSON): {nota_final:.1f} / 10.0 ({puntaje_final} / 100 pts)")
    elif codigo_res:
        print(f" 🐍 NOTA PRÁCTICA (Sólo Código): {nota_final:.1f} / 10.0 ({puntaje_final} / 100 pts)")
    print("=" * 70 + "\n")

    # GitHub Actions Step Summary
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_file:
        with open(summary_file, "a", encoding="utf-8") as f:
            f.write(f"## 📝 Resultados Autograding TP5: Sincronización de Procesos\n\n")
            f.write(f"### 🏆 Calificación Final: **{nota_final:.1f} / 10.0** ({puntaje_final} / 100 pts)\n\n")
            
            if teoria_res and teoria_res["disponible"]:
                f.write(f"#### 📚 Parte 1: Evaluación Conceptual (Nota: {teoria_res['grade']:.1f}/10.0)\n\n")
                f.write("| Ejercicio | Estado | Puntaje | Feedback |\n")
                f.write("|:---|:---:|:---:|:---|\n")
                for r in teoria_res["results"]:
                    icon = "✅" if r["status"] == "Correcto" else "❌"
                    f.write(f"| `{r['ej_id']}` | {icon} | {r['score']} | {r['feedback']} |\n")
                f.write("\n")
                
            if codigo_res:
                f.write(f"#### 🐍 Parte 2: Evaluación Práctica de Concurrencia Python (Nota: {codigo_res['grade']:.1f}/10.0)\n\n")
                f.write("| Script Python | Problema | Estado | Puntaje | Diagnóstico |\n")
                f.write("|:---|:---|:---:|:---:|:---|\n")
                for r in codigo_res["results"]:
                    icon = "✅" if r["status"] == "Aprobado" else "❌"
                    f.write(f"| `{r['file']}` | {r['desc']} | {icon} | {r['score']}/20 | {r['feedback']} |\n")
                f.write("\n")

    # Si hay discrepancias o tests fallidos, código de salida 1 para Actions
    if nota_final < 10.0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
