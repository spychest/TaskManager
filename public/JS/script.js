console.log('JS connected');
const todayTaskTable = document.querySelector("[data-table='today-task']");
const taskTable = document.querySelector("[data-table='task']");

async function init() {
    //Vider les tableaux
    removeTasksFromTables();

    //Récupérer les task
    let tasks = await getTasks();

    //Remplir les tableaux avec les tâches reçues
    hydrateTables(tasks);
}

function removeTasksFromTables(){
    todayTaskTable.innerHTML = '';
    taskTable.innerHTML = '';
}

function hydrateTables(tasks){
    tasks.forEach((task, index) => {
        if(task.forToday){
            todayTaskTable.append(generateTableRow(task, index))
        } else {
            taskTable.append(generateTableRow(task, index));
        }
    })
}

function generateTableRow(task, index){
    let tableRow = document.createElement('tr');

    let headRow = document.createElement('th');
    headRow.setAttribute('scope', "row");
    headRow.innerText = index+1;

    let firstTableDiv = document.createElement('td');
    firstTableDiv.innerText = task.name;

    let secondTableDiv = document.createElement('td');
    secondTableDiv.innerText = new Date(task.dueDate).toLocaleDateString();

    let thirdTableDiv = document.createElement('td');
    thirdTableDiv.innerText = task.description;

    let fourthTableDiv = document.createElement('td');

    // <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="create">
    let editButton = document.createElement('button');
    editButton.innerText = "Modifier";
    editButton.classList.add('btn', 'btn-primary');
    editButton.setAttribute('data-id', task.id);
    editButton.setAttribute('data-bs-toggle', "modal");
    editButton.setAttribute('data-bs-target', "#exampleModal");
    editButton.setAttribute('data-bs-whatever', "edit");

    let deleteButton = document.createElement('button');
    deleteButton.innerText = "Supprimer";
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.setAttribute('data-id', task.id);
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteTask(task.id);
    })

    fourthTableDiv.append(
        editButton,
        deleteButton
    );

    tableRow.append(
        headRow,
        firstTableDiv,
        secondTableDiv,
        thirdTableDiv,
        fourthTableDiv
    )

    return tableRow;
}

//Modal script (bootstrap documentation)
const exampleModal = document.getElementById('exampleModal')
if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', async event => {
        // Button qui a trigger la modal
        event.stopPropagation();

        const button = event.relatedTarget

        // On récupère l'info contenue dans l'attribut data-bs-whatever (contient create ou edit)
        const action = button.getAttribute('data-bs-whatever')

        // On change le titre de la modal en fonction de l'action
        const modalTitle = exampleModal.querySelector('.modal-title')
        modalTitle.textContent = action === "create" ? "Nouvelle tâche" : "Edition de tâche";

        // On change le button de soumission du formulaire en fonction de l'action
        const submitButton = document.querySelector("[type=\"submit\"]")
        submitButton.textContent = action === "create" ? "Créer" : "Valider";

        let nameInput = exampleModal.querySelector('#taskName')
        let dueDateInput = exampleModal.querySelector('#taskDueDate')
        let descriptionInput = exampleModal.querySelector('#description')

        if(action !== "create"){
            // Récupérer les informations de la task
            let taskId = button.getAttribute('data-id')
            let task = await getTask(taskId);
            console.table(task);
            nameInput.value = task.name;
            dueDateInput.value = new Date(task.dueDate).toISOString().substring(0, 16);
            descriptionInput.value = task.description;
        }
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            let taskData = {
                taskName: nameInput.value,
                taskDueDate: dueDateInput.value,
                taskDescription: descriptionInput.value
            }

            if(action !== "create"){
                let taskId = button.getAttribute('data-id')
                updateTask(taskId, taskData);
            } else {
                createTask(taskData);
            }
        })

    })
}

const baseUrl = '/api/v2/tasks';

async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Request failed');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to get the list of tasks
function getTasks() {
    return fetchData(baseUrl);
}

// Function to create a new task
function createTask(taskData) {
    return fetchData(baseUrl+'/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
}

// Function to get a specific task
function getTask(taskId) {
    return fetchData(`${baseUrl}/${taskId}`);
}

// Function to update a specific task
function updateTask(taskId, taskData) {
    return fetchData(`${baseUrl}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
}

// Function to delete a specific task
function deleteTask(taskId) {
    return fetchData(`${baseUrl}/${taskId}`, {
        method: 'DELETE',
    });
}

init().then((element) => {})