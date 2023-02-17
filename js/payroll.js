// Declaración de variables globales
const porcentajeAportes = {
    jubilacion: 0.11,
    obra_social: 0.03,
    pami: 0.03
}

const convenios = {
    comercio: 'Empleados de comercio (CCT N° 130/75)',
    bancario: 'Empleados bancarios (CCT N° 18/75)',
    panadero: 'Panaderos (CCT N° 231/94)',
    sin: 'Sin convenio colectivo'
}

const aporteSindical = {
    comercio: 0.02,
    bancario: 0.05,
    panadero: 0.01,
    sin: 0
}

const diasSueldo = 30
const horasMensuales = 200

const liquidacion = new Liquidacion()

// Submenú:
function submenuSueldo(){
    let opcion
    let continuaMenu = true

    do {
        opcion = prompt( nombre + ", por favor, selecciona una de las opciones disponibles:" +
                "\n 1. Seleccionar empleado" +
                "\n 2. Elegir convenio" +
                "\n 3. Ingresar novedad" +
                "\n 4. Calcular sueldo" +
                "\n 0. Salir"
        )

        switch (opcion){
            case '1':
                listarEmp()
                break
            case '2':
                listarConv()
                break
            case '3':
                ingresarNov()
                break
            case '4':
                liquidacion.calcularSueldo()
                break
            case '0':
                continuaMenu = false
        }
    } while (continuaMenu)
}

function listarEmp(){
    let listado = 'Ingrese el apellido del empleado que desea liquidar:\n'
    empleados.sort((a,b) => a.fechaIngreso - b.fechaIngreso)
    for (let empleado of empleados) {
        listado += `${empleado.fechaIngreso.toISOString().slice(0,10)} | ${empleado.apellido}, ${empleado.nombre}\n`
    }

    const apellido = prompt(listado)
    const empleado = buscarEmpleado(apellido)
    alert(`✅ El empleado seleccionado es:\n${empleado.apellido}, ${empleado.nombre}`)
    liquidacion.elegirEmpleado(empleado)
}

function listarConv() {
    let idx = 1
    let listado = 'Ingrese el convenio del empleado que desea liquidar:\n'
    for (let convenio of Object.values(convenios)) {
        listado += `${idx} | ${convenio}\n`
        idx++
    }

    const num_elegido = Number(prompt(listado))-1
    const elegido = Object.keys(convenios)[num_elegido]

    alert(`✅ El convenio seleccionado es:\n${convenios[elegido]}`)
    liquidacion.elegirConvenio(elegido)
}

function ingresarNov() {

    // Se pregunta por el tipo de novedad
    let idx = 1
    let listado = 'Ingrese el tipo de novedad que desea agregar:\n'
    for (let tipo of Object.values(tipoNovedad)) {
        listado += `${idx} | ${tipo}\n`
        idx++
    }

    const num_elegido = Number(prompt(listado))-1
    const tipo = Object.keys(tipoNovedad)[num_elegido]

    //alert(`${tipoNovedad[tipo]}`)

    // Se consulta por el tipo de licencia si es licencia
    let descrip_licencia
    if (tipo === 'licencias') {
        descrip_licencia = prompt('Ingrese el tipo de licencia:')
    }

    // Se pregunta cantidad de días u horas a declarar
    let mensaje
    if (tipo === 'licencias') {
        mensaje = `${descrip_licencia}\nIngresá la cantidad de días:`
    } else {
        mensaje = `${tipoNovedad[tipo]}\nIngresá la cantidad de horas:`
    }

    let cantidad = Number(prompt(mensaje))

    let novedad = new Novedad(tipo, cantidad, descrip_licencia)

    // Se agrega a la liquidación:
    liquidacion.ingresarNovedad(novedad)
}
