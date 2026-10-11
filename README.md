# Calculadora de IMC - Centro Médico

**Integrantes:** Kevin Rodriguez y Camilo Vargas

Software web para un centro médico que calcula el Índice de Masa Corporal (IMC) de los pacientes y recomienda una rutina de ejercicios y una alimentación balanceada según cada caso.

## Funcionalidades

- Registro de datos del paciente (nombre, documento, edad, sexo, peso, estatura y nivel de actividad).
- Cálculo del IMC: `IMC = peso (kg) / estatura (m)²`
- Clasificación según la OMS: bajo peso, peso normal, sobrepeso y obesidad grado I, II y III.
- Rango de peso saludable según la estatura.
- Calorías diarias aproximadas (fórmula de Mifflin-St Jeor).
- Rutina de ejercicios según la clasificación, la edad y el nivel de actividad.
- Recomendaciones de alimentación balanceada.
- Historial de pacientes guardado en el navegador (localStorage).

## Tecnologías

- HTML5
- CSS3
- JavaScript

## Cómo usarlo

Descargar o clonar el repositorio y abrir `index.html` en el navegador.

```bash
git clone https://github.com/kvinnnnn/imc-centro-medico.git
```

## Comandos Git utilizados

```bash
git init                      # crear el repositorio local
git branch -M main            # nombrar la rama principal "main"
git status                    # ver el estado de los archivos
git add index.html            # agregar archivos al área de preparación
git commit -m "mensaje"       # guardar los cambios en el historial
git log --oneline             # ver el historial de commits
git remote add origin <url>   # conectar con el repositorio de GitHub
git push -u origin main       # subir los cambios a GitHub
```

> Las recomendaciones son orientativas y no reemplazan la valoración del médico o nutricionista.
