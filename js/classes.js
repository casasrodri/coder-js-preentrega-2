class Empleado {
    constructor(nombre, apellido, sueldo, fechaIngreso, cantidadHijos) {
        this.nombre = nombre
        this.apellido = apellido
        this.sueldo = sueldo
        this.fechaIngreso = new Date(fechaIngreso)
        this.cantidadHijos = cantidadHijos
    }

    antiguedad() {
        const milisegEnAnios = 1000 * 60 * 60 * 24 * 365
        const hoy = new Date()
        return (hoy - this.fechaIngreso) / milisegEnAnios
    }
}

const tipoNovedad = {
    horas50: 'Hs. Extras 150%',
    horas100: 'Hs. Extras 200%',
    licencias: 'Licencias'
}

class Novedad {
    constructor(tipo, cantidad, descripcion) {
        this.tipo = tipo
        this.cantidad = cantidad

        if (tipo === 'licencias') {
            this.descripcion = descripcion
        } else {
            this.descripcion = tipoNovedad[tipo]
        }
    }
}


class Liquidacion {
    constructor(){
        this.novedades = []
        this.lineasRecibo = []
    }

    elegirEmpleado(empleado) {
        this.empleado = empleado
    }

    elegirConvenio(convenio){
        this.convenio = convenio
        this.aporte = aporteSindical[convenio]
    }

    ingresarNovedad(novedad) {
        this.novedades.push(novedad)
    }

    calcularSueldo() {

        // Sueldo diario
        let sueldoDiario = this.empleado.sueldo / diasSueldo

        // Cálculo de días trabajados
        let filtrado =  this.novedades.filter(novedad => novedad.tipo === 'licencias')
        let diasAusente = filtrado.reduce(
                (acumulador, licencia) => acumulador + licencia.cantidad,
                0
            )
        let diasTrabajados = diasSueldo - diasAusente

        // Se determina el sueldo básico
        let basico = sueldoDiario * diasTrabajados
        this.lineasRecibo.push(new LineaRecibo(
            'Sueldo básico',
            String(diasTrabajados) + ' días', round(basico, 2))
        )

        // Se analiza si se paga antigüedad:
            /*
                SUPUESTO: Si la antigüedad es mayor a 5 años, se paga el
                1% por cada año completo de servicio, sobre el básico
                por los días trabajados.
                Sólo aplica a trabajadores con convenios.
            */
        if (this.convenio !== 'sin' & this.empleado.antiguedad() > 5) {
            let aniosServicio = round(this.empleado.antiguedad(), 0)
            let importe = basico * (aniosServicio / 100)

            this.lineasRecibo.push(new LineaRecibo(
                'Antigüedad', String(aniosServicio) + '%',
                round(importe, 2))
            )
        }

        // Se le liquidan la novedades
        let valorHora = this.empleado.sueldo / horasMensuales

        this.novedades.forEach( nov => {
            let importe

            if (nov.tipo === 'licencias') {
                importe = sueldoDiario * nov.cantidad

                this.lineasRecibo.push(new LineaRecibo(
                    nov.descripcion, String(nov.cantidad) + ' días', round(importe, 2))
                )
            }

            importe = undefined

            if (nov.tipo === 'horas50') {
                importe = valorHora * 1.5 * nov.cantidad
            }

            if (nov.tipo === 'horas100') {
                importe = valorHora * 2 * nov.cantidad
            }

            if (importe !== undefined) {
                this.lineasRecibo.push(new LineaRecibo(
                    nov.descripcion, String(nov.cantidad) + ' hs.',
                    round(importe, 2))
                )
            }
        })

        // Se determina el sueldo bruto
        let sueldoBruto = this.lineasRecibo.reduce(
            (acumulador, linea) => acumulador + linea.importe,
            0
        )

        this.lineasRecibo.push(new LineaRecibo(
            ' > SUELDO BRUTO', '$', round(sueldoBruto, 2))
        )

        // Se determinan los aportes sindicales, de corresponder:

        if (this.aporte > 0) {
            this.lineasRecibo.push(new LineaRecibo(
                'Aporte Sindical',
                String(this.aporte * 100) + '%',
                round(-sueldoBruto * this.aporte, 2))
            )
        }

        // Se determinan los aportes de ley:
        this.lineasRecibo.push(new LineaRecibo(
            'Jubilación',
            String(porcentajeAportes['jubilacion'] * 100) + '%',
            round(-sueldoBruto * porcentajeAportes['jubilacion'], 2))
        )

        this.lineasRecibo.push(new LineaRecibo(
            'Obra Social',
            String(porcentajeAportes['obra_social'] * 100) + '%',
            round(-sueldoBruto * porcentajeAportes['obra_social'], 2))
        )

        this.lineasRecibo.push(new LineaRecibo(
            'PAMI',
            String(porcentajeAportes['pami'] * 100) + '%',
            round(-sueldoBruto * porcentajeAportes['pami'], 2))
        )

        // Sueldo Neto
        let sueldoNeto = 0
        this.lineasRecibo.forEach( linea => {
            if (linea.descripcion !== ' > SUELDO BRUTO') {
                sueldoNeto += linea.importe
            }
        })

        this.lineasRecibo.push(new LineaRecibo(
            ' > SUELDO NETO', '$', round(sueldoNeto, 2))
        )

        // Se llama a la función que muestra el recibo:
        this.mostrarRecibo()
    }

    mostrarRecibo() {

        this.recibo = `RECIBO DE HABERES\n` +
                `-----------------------\n` +
                `Empleado: ${this.empleado.nombre} ${this.empleado.apellido}\n` +
                `Fecha ingreso: ${this.empleado.fechaIngreso.toLocaleDateString('es-AR')}\n` +
                `Periodo liquidado: ${mes}\n` +
                `Convenio Colectivo: ${convenios[this.convenio]}\n\n`

        for (let li of this.lineasRecibo) {
            this.recibo +=  `${li.descripcion} (${li.cantidad}): ${ currencyFormat(li.importe) }\n`
        }

        alert(this.recibo)
        return true
    }
}

class LineaRecibo {
    constructor(descripcion, cantidad, importe) {
        this.descripcion = descripcion
        this.cantidad = cantidad
        this.importe = importe
    }
}

function round(num, digitos) {
    let multiplo = 10 ** digitos
    return Math.floor(num * multiplo) / multiplo
}

function currencyFormat (num) { // Fuente: https://stackoverflow.com/a/32086781
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
