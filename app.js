// ===============================
// Calculadora de IMC - Centro Médico
// ===============================

const form = document.getElementById("formPaciente");
const txtError = document.getElementById("error");

// Los pacientes se guardan en el navegador (localStorage)
let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

// -------- 1. Cálculo del IMC --------
// IMC = peso (kg) / estatura (m)^2
function calcularIMC(peso, estaturaCm) {
  const estaturaM = estaturaCm / 100;
  return peso / (estaturaM * estaturaM);
}

// Clasificación según la OMS para adultos
function clasificarIMC(imc) {
  if (imc < 18.5) return { nombre: "Bajo peso", clase: "bajo" };
  if (imc < 25)   return { nombre: "Peso normal", clase: "normal" };
  if (imc < 30)   return { nombre: "Sobrepeso", clase: "sobrepeso" };
  if (imc < 35)   return { nombre: "Obesidad grado I", clase: "obesidad" };
  if (imc < 40)   return { nombre: "Obesidad grado II", clase: "obesidad" };
  return { nombre: "Obesidad grado III", clase: "obesidad" };
}

// Rango de peso saludable para la estatura (IMC entre 18.5 y 24.9)
function rangoPesoSaludable(estaturaCm) {
  const m = estaturaCm / 100;
  return {
    min: (18.5 * m * m).toFixed(1),
    max: (24.9 * m * m).toFixed(1)
  };
}

// -------- 2. Calorías diarias aproximadas --------
// Fórmula de Mifflin-St Jeor para la tasa metabólica basal (TMB)
function calcularCalorias(peso, estaturaCm, edad, sexo, actividad, clase) {
  let tmb = 10 * peso + 6.25 * estaturaCm - 5 * edad;
  tmb = sexo === "M" ? tmb + 5 : tmb - 161;

  const factores = { sedentario: 1.2, ligero: 1.375, moderado: 1.55, activo: 1.725 };
  let calorias = tmb * factores[actividad];

  // Ajuste según el objetivo del paciente
  if (clase === "bajo") calorias += 300;        // subir de peso de forma gradual
  if (clase === "sobrepeso") calorias -= 300;   // bajar de peso de forma gradual
  if (clase === "obesidad") calorias -= 500;

  return Math.round(calorias);
}

// -------- 3. Rutina de ejercicios --------
function recomendarEjercicio(clase, edad, actividad) {
  let rutina = [];

  if (clase === "bajo") {
    rutina = [
      "Ejercicios de fuerza 3 días por semana (sentadillas, flexiones, bandas elásticas o máquinas), 3 series de 10 a 12 repeticiones.",
      "Cardio suave solo 2 días por semana, de 20 a 30 minutos (caminar o bicicleta).",
      "Descansar bien entre sesiones para que el cuerpo gane masa muscular."
    ];
  } else if (clase === "normal") {
    rutina = [
      "150 minutos a la semana de actividad moderada (por ejemplo 30 minutos, 5 días): trotar, nadar, bicicleta o bailar.",
      "Ejercicios de fuerza 2 días por semana trabajando piernas, brazos, espalda y abdomen.",
      "Estiramientos de 10 minutos al terminar cada sesión."
    ];
  } else if (clase === "sobrepeso") {
    rutina = [
      "Caminata rápida o bicicleta 40 minutos, 5 días por semana.",
      "Ejercicios de fuerza 2 a 3 días por semana con el peso del cuerpo (sentadillas, zancadas, plancha).",
      "Aumentar el movimiento diario: usar escaleras y hacer pausas activas si trabaja sentado."
    ];
  } else {
    // Obesidad: ejercicios de bajo impacto para cuidar las articulaciones
    rutina = [
      "Ejercicio de bajo impacto: caminar, bicicleta estática o natación/aqua aeróbicos, empezando con 15 a 20 minutos diarios y subiendo poco a poco hasta 45 minutos.",
      "Ejercicios de fuerza suaves 2 días por semana (sentarse y pararse de una silla, bandas elásticas).",
      "Evitar saltos y carreras al inicio para no lastimar rodillas y tobillos.",
      "Realizar valoración médica antes de iniciar la rutina."
    ];
  }

  // Ajustes según el nivel de actividad actual
  if (actividad === "sedentario") {
    rutina.push("Como el paciente es sedentario, empezar con la mitad del tiempo indicado las primeras 2 semanas.");
  }

  // Ajustes para adultos mayores
  if (edad >= 60) {
    rutina.push("Por la edad, incluir ejercicios de equilibrio (pararse en un pie con apoyo, caminar en línea recta) 3 días por semana.");
  }

  return rutina;
}

// -------- 4. Alimentación balanceada --------
function recomendarAlimentacion(clase) {
  // Recomendaciones generales para todos los pacientes
  const generales = [
    "Plato balanceado: la mitad de verduras y frutas, un cuarto de proteína (pollo, pescado, huevo, granos) y un cuarto de cereales o tubérculos.",
    "Tomar entre 6 y 8 vasos de agua al día.",
    "Reducir azúcar, sal, gaseosas y alimentos ultraprocesados."
  ];

  let especificas = [];

  if (clase === "bajo") {
    especificas = [
      "Comer 5 a 6 veces al día (3 comidas y 2 o 3 meriendas).",
      "Agregar alimentos con grasas saludables y energía: aguacate, frutos secos, mantequilla de maní, avena.",
      "Incluir proteína en cada comida: huevo, carne, leche, yogur o queso."
    ];
  } else if (clase === "normal") {
    especificas = [
      "Mantener 3 comidas principales y 1 o 2 meriendas saludables (fruta, yogur, frutos secos).",
      "Variar los colores de frutas y verduras durante la semana."
    ];
  } else if (clase === "sobrepeso") {
    especificas = [
      "Disminuir porciones de harinas (arroz, pan, pasta) y preferir integrales.",
      "Cambiar fritos por preparaciones al horno, a la plancha o al vapor.",
      "Meriendas bajas en calorías: fruta entera, gelatina sin azúcar o verduras."
    ];
  } else {
    especificas = [
      "Seguir el plan con control del nutricionista del centro médico.",
      "Aumentar el consumo de fibra (verduras, legumbres, avena) para sentir más llenura.",
      "Evitar comer entre comidas sin control y no saltarse el desayuno.",
      "Eliminar bebidas azucaradas y alcohol."
    ];
  }

  return especificas.concat(generales);
}

// -------- 5. Mostrar resultados --------
function llenarLista(idLista, items) {
  const lista = document.getElementById(idLista);
  lista.innerHTML = "";
  items.forEach(texto => {
    const li = document.createElement("li");
    li.textContent = texto;
    lista.appendChild(li);
  });
}

function mostrarResultado(p) {
  const categoria = clasificarIMC(p.imc);
  const rango = rangoPesoSaludable(p.estatura);
  const calorias = calcularCalorias(p.peso, p.estatura, p.edad, p.sexo, p.actividad, categoria.clase);

  document.getElementById("resNombre").textContent = p.nombre;
  document.getElementById("resImc").textContent = p.imc.toFixed(1);
  document.getElementById("resCategoria").textContent = categoria.nombre;
  document.getElementById("imcBox").className = "imc-box " + categoria.clase;

  document.getElementById("resPesoIdeal").textContent =
    "Peso saludable para su estatura: entre " + rango.min + " kg y " + rango.max + " kg.";
  document.getElementById("resCalorias").textContent =
    "Calorías diarias recomendadas (aproximado): " + calorias + " kcal.";

  llenarLista("listaEjercicio", recomendarEjercicio(categoria.clase, p.edad, p.actividad));
  llenarLista("listaAlimentacion", recomendarAlimentacion(categoria.clase));

  const seccion = document.getElementById("resultado");
  seccion.classList.remove("oculto");
  seccion.scrollIntoView({ behavior: "smooth" });
}

// -------- 6. Historial de pacientes --------
function guardarPacientes() {
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
}

function mostrarTabla() {
  const tabla = document.getElementById("tablaPacientes");
  tabla.innerHTML = "";

  document.getElementById("sinPacientes").style.display = pacientes.length ? "none" : "block";

  pacientes.forEach((p, i) => {
    const fila = document.createElement("tr");
    const datos = [p.fecha, p.nombre, p.documento, p.edad, p.imc.toFixed(1), clasificarIMC(p.imc).nombre];

    datos.forEach(valor => {
      const td = document.createElement("td");
      td.textContent = valor;
      fila.appendChild(td);
    });

    // Botón para ver de nuevo las recomendaciones del paciente
    fila.style.cursor = "pointer";
    fila.title = "Ver recomendaciones";
    fila.addEventListener("click", () => mostrarResultado(p));

    const tdBorrar = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("¿Eliminar a " + p.nombre + " del registro?")) {
        pacientes.splice(i, 1);
        guardarPacientes();
        mostrarTabla();
      }
    });
    tdBorrar.appendChild(btn);
    fila.appendChild(tdBorrar);

    tabla.appendChild(fila);
  });
}

// -------- 7. Evento del formulario --------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  txtError.textContent = "";

  const paciente = {
    nombre: document.getElementById("nombre").value.trim(),
    documento: document.getElementById("documento").value.trim(),
    edad: parseInt(document.getElementById("edad").value),
    sexo: document.getElementById("sexo").value,
    peso: parseFloat(document.getElementById("peso").value),
    estatura: parseFloat(document.getElementById("estatura").value),
    actividad: document.getElementById("actividad").value
  };

  // Validaciones básicas
  if (paciente.edad < 18) {
    txtError.textContent = "Esta calculadora es para adultos. En menores de 18 años el IMC se evalúa con tablas de crecimiento.";
    return;
  }
  if (paciente.peso <= 0 || paciente.estatura <= 0) {
    txtError.textContent = "El peso y la estatura deben ser mayores a cero.";
    return;
  }

  paciente.imc = calcularIMC(paciente.peso, paciente.estatura);
  paciente.fecha = new Date().toLocaleDateString("es-CO");

  pacientes.push(paciente);
  guardarPacientes();
  mostrarTabla();
  mostrarResultado(paciente);
});

form.addEventListener("reset", () => {
  txtError.textContent = "";
  document.getElementById("resultado").classList.add("oculto");
});

// Al cargar la página se muestra el historial guardado
mostrarTabla();
