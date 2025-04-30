//Elements
let add = document.getElementById("add");
let form = document.getElementById("form");
let input = document.getElementById("input");
let submit = document.getElementById("submit");
let tasks = document.querySelector(".all-tasks");
let edit = document.getElementById("editForm");
let editButton = document.getElementById("editButton");
let editInput = document.getElementById("editInput");
let cancelBtnF = document.querySelector(".cancel");
let cancelBtnE = document.querySelector(".cancel-e");

//show input Field
add.onclick = function () {
  form.style.display = "block";
};

// Empty Array To Store The Tasks
let arrOfTasks = [];

// Check IF There is tasks in Local Storage

if (localStorage.getItem("tasks")) {
  arrOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

// Trigger Get Data From Local Storage function
getDataLS();

//Add Task
submit.onclick = function () {
  if (input.value !== "") {
    addTaskToArray(input.value); //Add Task To Array
    input.value = "";
  }
  form.style.display = "none";
};

//Edit Task
editButton.onclick = function () {
  if (editInput.value !== "" && taskIdToEdit !== null) {
    arrOfTasks.forEach((task) => {
      if (task.id == taskIdToEdit) {
        task.title = editInput.value;
      }
    });
    addDataLS(arrOfTasks);
    addEleToPage(arrOfTasks);

    editInput.value = "";
    edit.style.display = "none";
    taskIdToEdit = null;
  }
};

// Cancel Add Task
cancelBtnF.onclick = function () {
  input.value = "";
  form.style.display = "none";
};
// Cancel Edit Task
cancelBtnE.onclick = function () {
  editInput.value = "";
  edit.style.display = "none";
};

// Click On Icons
tasks.addEventListener("click", function (e) {
  let delButton = e.target.closest(".del");
  if (delButton) {
    //Remove Task From LS
    delTask(e.target.closest(".tasks").getAttribute("data-id"));
    //Remove Task From page
    delButton.closest(".tasks").remove();
  }
  //Add Classes To Elements
  let finishButton = e.target.closest(".is-finished");
  let finishIcon = e.target.closest(".fa-circle-xmark, .fa-check");
  if (finishButton && finishIcon) {
    let taskElement = e.target.closest(".tasks");
    let taskId = taskElement.getAttribute("data-id");

    // Toggle class
    let isNowDone = finishButton.classList.contains("unfinish");

    finishButton.classList.toggle("unfinish", !isNowDone);
    finishButton.classList.toggle("finish", isNowDone);
    finishIcon.classList.toggle("fa-circle-xmark", !isNowDone);
    finishIcon.classList.toggle("fa-check", isNowDone);
    taskElement.classList.toggle("done", isNowDone);
    // Update in arrOfTasks
    arrOfTasks.forEach((task) => {
      if (task.id == taskId) {
        task.completed = isNowDone;
      }
    });

    // Save updated data
    addDataLS(arrOfTasks);
  }
  //Open Edit Feild
  if (e.target.closest(".editt")) {
    let taskElement = e.target.closest(".tasks");
    let taskId = taskElement.getAttribute("data-id");
    let task = arrOfTasks.find((t) => t.id == taskId);

    if (task) {
      taskIdToEdit = taskId;
      editInput.value = task.title;
      edit.style.display = "block";
    }
  }
});

function addTaskToArray(taskText) {
  // Add Date & Time
  let now = new Date();
  let date = now.toLocaleString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Task Data
  const task = {
    id: Date.now(),
    title: taskText,
    date: date,
    completed: false,
  };
  // Push Task To Array Of Tasks
  arrOfTasks.push(task);

  // Add Tasks To Page
  addEleToPage(arrOfTasks);

  //Add tasks to local Storage
  addDataLS(arrOfTasks);
}

function addEleToPage(arrOfTasks) {
  //Empty The Tasks Div
  tasks.innerHTML = "";
  //Loopin on Array Of Task
  arrOfTasks.forEach((task) => {
    let addDiv = `
                <div class="tasks ${task.completed ? " done" : ""}" data-id=${
      task.id
    }>
                    <!--start tasks info-->
                    <div class="task" id="task" >
                        <h2>${task.title}</h2>
                        <div class="history">
                            <i class="fa-solid fa-calendar-days"></i>
                            <span>${task.date}</span>
                        </div>
                    </div>
                    <!--End tasks info-->
                    <!--Start Actions-->
                    <div class="actions">
                        <button class="del circle"><span><i class="fa-solid fa-trash"></span></i></i></button>
                        <button class="is-finished ${
                          task.completed ? "finish" : "unfinish"
                        } circle">
                          <span>
                            <i class="fa-solid ${
                              task.completed ? "fa-check" : "fa-circle-xmark"
                            }"></i>
                          </span>
                        </button>
                        <button class="editt circle"><span><i class="fa-solid fa-pencil"></i></span></button>
                    </div>
                    <!--End Actions-->
                </div>
              `;
    tasks.innerHTML += addDiv;
  });
}

function addDataLS(arrOfTasks) {
  localStorage.setItem("tasks", JSON.stringify(arrOfTasks));
}

function getDataLS() {
  let data = localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addEleToPage(tasks);
  }
}

function delTask(taskId) {
  arrOfTasks = arrOfTasks.filter((task) => task.id != taskId);
  addDataLS(arrOfTasks);
}
