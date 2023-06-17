console.log('JS connected');

const todayTaskTable = document.querySelector("[data-table='today-task']");
const taskTable = document.querySelector("[data-table='task']");
const taskForm = document.querySelector("[data-task-form]")

taskForm.addEventListener('submit', (event => {
    event.preventDefault();

    let formData = new FormData(taskForm);
    let formResponses = [...formData];
    console.table(formResponses);
    fetch('http://127.0.0.1:91/api/task/create', {
        method: 'POST',
        body: formData
    })
        .then(res => { return res.json() })
        .then(data => console.log(data))
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

async function manageForm() {

}

function removeTasksFromTables(){
    todayTaskTable.innerHTML = '';
    taskTable.innerHTML = '';
}

async function getTask() {
    let tasks = await fetch('http://127.0.0.1:91/api/task', { method: 'GET'})
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

    tableRow.innerHTML = `
            <th scope="row">${index+1}</th>
            <td>${task.name}</td>
            <td>${new Date(task.dueDate).toLocaleDateString("fr")}</td>
            <td>${task.description}</td>
            <td>
                <button class="btn btn-primary" data-action="edit" data-id="${task.id}">Modifier</button>
                <button class="btn btn-danger" data-action="delete" data-id="${task.id}">Supprimer</button>
            </td>
    `

    return tableRow;
}

init().then((element) => {})