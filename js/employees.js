const submenuesNomina = {
    1: nuevoEmpleado,
    2: listarEmpleados,
    3: modificarEmpleado,
    4: eliminarEmpleado,
    0: salirSubMenu,
}

function submenuNomina(){
    let opcion
    let continuaMenu

    do {
        opcion = prompt( nombre + ", por favor, selecciona una de las opciones disponibles:" +
                "\n 1. Nuevo empleado" +
                "\n 2. Listar empleados" +
                "\n 3. Modificar empleado" +
                "\n 4. Eliminar empleado" +
                "\n 0. Volver al menú principal"
        )
        continuaMenu = submenuesNomina[opcion]()
    } while (continuaMenu === undefined)
}

function nuevoEmpleado() {
    let nombre = prompt('Ingresa el nombre:')
    let apellido = prompt('Ingresa el apellido:')
    let sueldo = Number(prompt('Ingresa el salario bruto:\nFormato: IIIIII.DD'))
    let fIngreso = prompt('Ingresa la fecha de ingreso:\nFormato: YYYY-MM-DD')
    let cHijos = Number(prompt('Ingresa la cantidad de hijos que posee:'))

    empleados.push(new Empleado(nombre, apellido, sueldo, fIngreso, cHijos))
    alert('Se registró correctamente a ' + nombre + ' ' + apellido)
}

function listarEmpleados() {
    let listado = 'A continuación se muestra el listado de empleados ordenados por fecha de ingreso... Para ver más registros, visualizar la consola:\n'
    empleados.sort((a,b) => a.fechaIngreso - b.fechaIngreso)
    for (let empleado of empleados) {
        console.log(empleado)
        listado += `${empleado.fechaIngreso.toISOString().slice(0,10)} | ${empleado.apellido}, ${empleado.nombre}\n`
    }
    alert(listado + '(fin del reporte)')
}

function buscarEmpleado(apellido) {
    return empleados.find( el => el.apellido.toUpperCase().includes(apellido.toUpperCase()))
}

function pedirEmpleado() {
    let empleadoEncontrado

    do {
        empleadoEncontrado = buscarEmpleado(prompt('Ingresa el apellido del empleado:'))
    } while (empleadoEncontrado === undefined)

    alert(`Empleado encontrado:
${empleadoEncontrado.nombre} ${empleadoEncontrado.apellido}`)

    return empleadoEncontrado
}

function modificarEmpleado() {
    let modif = pedirEmpleado()
    modif['nombre'] = prompt('Nombre:', modif['nombre'])
    modif['apellido'] = prompt('Apellido:', modif['apellido'])
    modif['sueldo'] = Number(prompt('Sueldo bruto:\nFormato: IIIIII.DD', modif['sueldo']))
    modif['fechaIngreso'] = new Date(prompt('Fecha de ingreso:\nFormato: YYYY-MM-DD:', modif['fechaIngreso'].toISOString().slice(0,10)))
    modif['cantidadHijos'] = Number(prompt('Cantidad de hijos:', modif['cantidadHijos']))

    alert('Se modificó correctamente al empleado!')

    console.log('Empleado modificado:')
    console.log(modif)
}

function eliminarEmpleado() {
    let eliminar = pedirEmpleado()
    empleados = empleados.filter(e => e != eliminar)

    alert('Se eliminó correctamente al empleado!')

    console.log('Empleado eliminado:')
    console.log(eliminar)
}

function salirSubMenu() {return false}
