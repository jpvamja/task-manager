let task_input = document.querySelector("#task-input");
let add_btn = document.querySelector("#add-task");
let task_list = document.querySelector("#task-list");
let filterBtns = document.querySelectorAll(".task-filters button");

let tasksArray = [];

window.addEventListener("load", function () {
    let storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasksArray = JSON.parse(storedTasks);
        tasksArray.forEach(task => addTaskToDOM(task));
    }
});

add_btn.addEventListener("click", function () {
    const taskText = task_input.value.trim();
    if (taskText === "") {
        alert("It's a blank task....");
        return;
    }

    let taskObj = {
        text: taskText,
        completed: false
    };

    tasksArray.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    addTaskToDOM(taskObj);
    task_input.value = "";
});


function addTaskToDOM(task) {
    let list = document.createElement("li");
    list.classList.add("task-item");
    if (task.completed) list.classList.add("completed");
    list.setAttribute("draggable", "true");

    let span = document.createElement("span");
    span.classList.add("task-text");
    span.innerText = task.text;

    let cmt_btn = document.createElement("button");
    cmt_btn.classList.add("complete-btn");
    cmt_btn.innerText = "✔";

    let dlt_btn = document.createElement("button");
    dlt_btn.classList.add("delete-btn");
    dlt_btn.innerText = "🗑";

    list.appendChild(span);
    list.appendChild(cmt_btn);
    list.appendChild(dlt_btn);
    task_list.appendChild(list);

    cmt_btn.addEventListener("click", function () {
        list.classList.toggle("completed");
        updateTaskInArray(task.text, "toggle");
    });

    dlt_btn.addEventListener("click", function () {
        list.remove();
        updateTaskInArray(task.text, "delete");
    });

    list.addEventListener("dragstart", function (e) {
        draggedTask = list;
        e.dataTransfer.effectAllowed = "move";
    });
}


filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        let filter = btn.dataset.filter;
        let tasks = document.querySelectorAll("#task-list .task-item");
        tasks.forEach(task => {
            switch (filter) {
                case "all":
                    task.style.display = "flex";
                    break;
                case "completed":
                    task.style.display = task.classList.contains("completed") ? "flex" : "none";
                    break;
                case "pending":
                    task.style.display = !task.classList.contains("completed") ? "flex" : "none";
                    break;
            }
        });
    });
});


let draggedTask = null;

task_list.addEventListener("dragover", function (e) {
    e.preventDefault();
});

task_list.addEventListener("drop", function (e) {
    e.preventDefault();
    const target = e.target.closest(".task-item");
    if (target && target !== draggedTask) {
        task_list.insertBefore(draggedTask, target);
        updateArrayOrder();
    }
});


function updateTaskInArray(taskText, action) {
    if (action === "toggle") {
        let index = tasksArray.findIndex(t => t.text === taskText);
        tasksArray[index].completed = !tasksArray[index].completed;
    } else if (action === "delete") {
        tasksArray = tasksArray.filter(t => t.text !== taskText);
    }
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}


function updateArrayOrder() {
    let newOrder = [];
    document.querySelectorAll("#task-list .task-item").forEach(li => {
        let text = li.querySelector(".task-text").innerText;
        let taskObj = tasksArray.find(t => t.text === text);
        if (taskObj) newOrder.push(taskObj);
    });
    tasksArray = newOrder;
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}


const themeBtn = document.querySelector("#theme-btn");


window.addEventListener("load", () => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
        document.body.classList.add("light-mode");
        themeBtn.innerText = "🌞 Light Mode";
    }
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeBtn.innerText = "🌞 Light Mode";
        localStorage.setItem("theme", "light");
    } else {
        themeBtn.innerText = "🌙 Dark Mode";
        localStorage.setItem("theme", "dark");
    }
});
