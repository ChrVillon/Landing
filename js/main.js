const databaseURL = 'https://tallerlading-default-rtdb.firebaseio.com/data.json';

let sendData = () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' })
    fetch(databaseURL, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json(); 
        })
        .then(result => {
            alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); 
            location.reload()
        })
        .catch(error => {
            alert('Hemos experimentado un error. ¡Vuelve pronto!'); 
        });
    getData();
}

let getData = async () => {

    try {

        const response = await fetch(databaseURL);

        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto1!'); 
        }

        const data = await response.json();

        if (data != null) {

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

        }

    } catch (error) {
        console.log(error);
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); 
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

