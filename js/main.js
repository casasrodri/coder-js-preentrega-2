// Declaración de variables globales
let nombre
let mes

// Función que saluda al usuario y pide datos personales
function inicio(){
    alert("💸 Bienvenido al programa de cálculo de sueldos")
    nombre = prompt("👋🏽 Por favor, ingresa tu nombre para continuar:", 'Rodri Casas')
    mes = prompt("🗓 Indicá el mes a liquidar (ej: febrero 2023):", 'febrero 2023')

    menu()
}

// Función que presenta al usuario las opciones
function menu(){
    let opcion
    let continuaMenu = true

    do {
        opcion = prompt( nombre + ", por favor, selecciona una de las opciones disponibles:" +
                "\n 1. Nómina de empleados" +
                "\n 2. Sueldos" +
                "\n 0. Salir"
        )

        switch (opcion){
            case '1':
                submenuNomina()
                break
            case '2':
                submenuSueldo()
                break
            case '0':
                alert('Gracias por utilizar el programa. Vuelva prontos! 💪🏽')
                continuaMenu = false
        }
    } while (continuaMenu)
}

inicio()
