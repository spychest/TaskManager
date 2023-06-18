console.log('JS connected');

const todayTaskTable = document.querySelector("[data-table='today-task']");
const taskTable = document.querySelector("[data-table='task']");
const taskForm = document.querySelector("[data-task-form]")
const protocol = "http";
const host = "localhost";
const baseUrl = protocol+"//"+host;

taskForm.addEventListener('submit', (event => {
    event.preventDefault();

    let formData = new FormData(taskForm);
    let formResponses = [...formData];

    fetch('/api/task/create', {
        method: 'POST',
        body: formData
    })
        .then(res => { return res.json() })
        .then(data => {
            console.log(data);
            taskForm.reset();
            //Inform each connection with the new task
        })
        .catch(err => console.error(err));
}))

async function init() {
    //Remove element from tables
    removeTasksFromTables();

    //Get tasks from API
    let tasks = await getTask();

    //Foreach task, if task.isForToday is true put it in todayTaskTable else put it in taskTable
    hydrateTables(tasks);
}

function removeTasksFromTables(){
    todayTaskTable.innerHTML = '';
    taskTable.innerHTML = '';
}

async function getTask() {
    let tasks = await fetch('/api/task', { method: 'GET'})
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.error);
            }
            return response.json();
        });

    return tasks;
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

    let editButton = document.createElement('button');
    editButton.innerText = "Modifier";
    editButton.classList.add('btn', 'btn-primary');
    editButton.setAttribute('data-id', task.id);
    editButton.addEventListener('click', (event) => {
        console.log(`Edit task with id ${task.id}`)
    })

    let deleteButton = document.createElement('button');
    deleteButton.innerText = "Supprimer";
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.setAttribute('data-id', task.id);
    deleteButton.addEventListener('click', (event) => {
        console.log(`Delete task with id ${task.id}`)
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

init().then((element) => {})