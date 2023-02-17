mes = 'Febrero 2026'

liquidacion.elegirEmpleado(buscarEmpleado('Casas'))
liquidacion.elegirConvenio('bancario')
liquidacion.ingresarNovedad(new Novedad('horas50', 33))
liquidacion.ingresarNovedad(new Novedad('horas100', 6))
liquidacion.ingresarNovedad(new Novedad('licencias', 2, 'Enfermedad'))
liquidacion.calcularSueldo()

console.log(liquidacion);
