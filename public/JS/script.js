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
    let dateObjectToShow = new Date(task.dueDate);
    secondTableDiv.innerText = new Date(task.dueDate).toLocaleDateString();
    secondTableDiv.innerText = `${dateObjectToShow.toLocaleDateString()}, à ${String(dateObjectToShow.getHours()).padStart(2,'0')}:${String (dateObjectToShow.getMinutes()).padStart(2,'0')}`;

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
        const form = document.querySelector('[data-task-form]');

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
        form.reset();

        if(action !== "create"){
            // Récupérer les informations de la task
            let taskId = button.getAttribute('data-id')
            submitButton.setAttribute('taskId', taskId);

            let task = await getTask(taskId);

            // On pré-remplit le formulaire
            nameInput.value = task.name;
            dueDateInput.value = adjustTaskDueDateString(task.dueDate);
            descriptionInput.value = task.description;
        }

        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            let taskData = {
                taskId: event.target.getAttribute('taskId') ?? null,
                taskName: nameInput.value,
                taskDueDate: dueDateInput.value,
                taskDescription: descriptionInput.value
            }

            event.target.setAttribute('taskData', JSON.stringify(taskData));
        })
        submitButton.removeEventListener('click', submitForm);
        submitButton.addEventListener('click', submitForm);

        submitButton.removeAttribute('taskData');
    })
}

function adjustTaskDueDateString(dueDate){
    // On récupère une string utilisable comme valeur pour le champ dueDate
    const dueDateAsObject = new Date(dueDate);

    // On récupère le offset en minutes
    const timeZoneOffsetInMilliseconds = dueDateAsObject.getTimezoneOffset()*60000;

    // On ajuste la date en se basant sur le offset récupérer (changé en milliseconde)
    const adjustedDueDateObject = new Date(dueDateAsObject.getTime() - timeZoneOffsetInMilliseconds);

    // On return une string exploitable pour le datetime-local input
    return adjustedDueDateObject.toISOString().slice(0, 16);
}

async function submitForm(event){
    event.preventDefault();
    event.stopPropagation();
    event.target.removeAttribute('taskId');
    let taskData = JSON.parse(event.target.getAttribute('taskData'));
    let taskId = taskData.taskId;
    delete taskData.taskId;

    if (!taskId) {
        await createTask(taskData);
    } else {
        await updateTask(taskId, taskData);
    }
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