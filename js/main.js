const databaseURL = 'https://tallerlading-default-rtdb.firebaseio.com/data.json';

let sendData = () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' })
    fetch(databaseURL, {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify(data) // Convierte los datos a JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json(); // Procesa la respuesta como JSON
        })
        .then(result => {
            alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); // Maneja la respuesta con un mensaje
            location.reload()
        })
        .catch(error => {
            alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
        });
    getData();
}

let getData = async () => {

    try {

        // Realiza la petición fetch a la URL de la base de datos
        const response = await fetch(databaseURL);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto1!'); // Maneja el error con un mensaje
        }

        // Convierte la respuesta en formato JSON
        const data = await response.json();

        if (data != null) {

            // Cuente el número de suscriptores registrados por fecha a partir del objeto data
            let countSuscribers = new Map();


            

            if (Object.keys(data).length > 0) {
                for (let key in data) {

                    let { consulta, email, nombre, saved } = data[key];

                    let date = saved.split(",")[0]
                    let keyCombination = `${consulta}_${date}`;

                    let count = countSuscribers.get(keyCombination) || 0;
                    countSuscribers.set(keyCombination, count + 1)
                }
            }
            // END

            // Genere y agregue filas de una tabla HTML para mostrar fechas y cantidades de suscriptores almacenadas 
            
            if (countSuscribers.size > 0) {

                subscribers.innerHTML = ''

                let cont = 1;
                for (let [keyCombination, count] of countSuscribers) {
                    let [consulta, date] = keyCombination.split('_');

                    let rowTemplate = `
                    <tr>
                        <th scope="row">${cont}</th> <!-- Usa el 'key' como identificador único -->
                        <td>${date}</td>
                        <td>${consulta}</td>
                        <td>${count}</td>
                    </tr>`;
                    subscribers.innerHTML += rowTemplate
                    cont += 1;
                }
            }
            // END

        }

    } catch (error) {
        // Muestra cualquier error que ocurra durante la petición
        console.log(error);
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    }
}

let ready = () => {
    console.log('DOM está listo')
    getData();

}

let loaded = () => {

    let myform = document.getElementById('form');
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();

        const emailElement = document.getElementById('form_email');
        const nameElement = document.getElementById('form_name');
        const selectElement = document.getElementById('form_select');
        sendData();

    });

}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)

