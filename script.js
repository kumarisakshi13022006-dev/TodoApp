
/* 
   1. GET HTML ELEMENTS
 */

const taskInput = document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priorityInput");

const addBtn =
    document.getElementById("addBtn");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const filters =
    document.getElementById("filters");

const clearBtn =
    document.getElementById("clearBtn");

const themeBtn =
    document.getElementById("themeBtn");

const totalCount =
    document.getElementById("totalCount");

const completedCount =
    document.getElementById("completedCount");

const pendingCount =
    document.getElementById("pendingCount");

const progressText =
    document.getElementById("progressText");

const progressLabel =
    document.getElementById("progressLabel");

const progressBar =
    document.getElementById("progressBar");

const taskHint =
    document.getElementById("taskHint");


// application state


/*
    Get saved tasks from LocalStorage.

    If nothing exists, use an empty array.
*/

let tasks =
    JSON.parse(
        localStorage.getItem("focusflowTasks")
    ) || [];


/*
    Current filter.

    Possible values:

    all
    active
    completed
*/

let currentFilter = "all";


//save task

function saveTasks() {

    localStorage.setItem(
        "focusflowTasks",
        JSON.stringify(tasks)
    );

}


//add new task
function addTask() {

    /*
        Get the text entered by the user.
    */

    const title =
        taskInput.value.trim();


    /*
        Don't allow empty tasks.
    */

    if (title === "") {

        taskInput.focus();

        return;
    }


    /*
        Create a new task object.
    */

    const newTask = {

        id: Date.now(),

        title: title,

        priority:
            priorityInput.value,

        completed: false,

        createdAt:
            new Date().toLocaleString()

    };


    /*
        Add task at the beginning
        of the array.
    */

    tasks.unshift(newTask);


    /*
        Save tasks.
    */

    saveTasks();


    /*
        Clear input.
    */

    taskInput.value = "";


    /*
        Reset priority.
    */

    priorityInput.value = "medium";


    /*
        Update UI.
    */

    render();


    /*
        Put cursor back in input.
    */

    taskInput.focus();

}

//toggle task completed

function toggleTask(id) {

    tasks =
        tasks.map(function(task) {

            if (task.id === id) {

                return {
                    ...task,
                    completed:
                        !task.completed
                };

            }

            return task;

        });


    /*
        Save updated tasks.
    */

    saveTasks();


    /*
        Refresh UI.
    */

    render();

}


//delete task

function deleteTask(id) {

    /*
        Keep every task except
        the selected task.
    */

    tasks =
        tasks.filter(function(task) {

            return task.id !== id;

        });


    /*
        Save changes.
    */

    saveTasks();


    /*
        Refresh screen.
    */

    render();

}

//get filtered task

function getVisibleTasks() {

    /*
        Get search text.
    */

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    /*
        Filter the task array.
    */

    return tasks.filter(function(task) {


        /* ---------------------------------------------
           FILTER BY STATUS
        --------------------------------------------- */

        let matchesFilter = true;


        if (currentFilter === "active") {

            matchesFilter =
                !task.completed;

        }


        if (currentFilter === "completed") {

            matchesFilter =
                task.completed;

        }


        /* ---------------------------------------------
           FILTER BY SEARCH
        --------------------------------------------- */

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(searchText);


        /*
            Task is visible only when
            both conditions are true.
        */

        return (
            matchesFilter &&
            matchesSearch
        );

    });

}


/* =====================================================
   8. CREATE TASK ELEMENT
===================================================== */

function createTaskElement(task) {

    /*
        Create <li>
    */

    const li =
        document.createElement("li");


    /*
        Add classes.
    */

    li.className =
        "task-item";


    /*
        Add completed class
        if task is completed.
    */

    if (task.completed) {

        li.classList.add("completed");

    }


    /*
        Create checkbox button.
    */

    const checkbox =
        document.createElement("button");


    checkbox.className =
        "task-checkbox";


    checkbox.setAttribute(
        "aria-label",
        "Complete task"
    );


    /*
        Show checkmark if completed.
    */

    checkbox.textContent =
        task.completed ? "✓" : "";


    /*
        Toggle task when clicked.
    */

    checkbox.addEventListener(
        "click",
        function() {

            toggleTask(task.id);

        }
    );


    /* =================================================
       TASK CONTENT
    ================================================= */

    const content =
        document.createElement("div");


    content.className =
        "task-content";


    /*
        Task title.
    */

    const title =
        document.createElement("div");


    title.className =
        "task-title";


    title.textContent =
        task.title;


    /*
        Meta information.
    */

    const meta =
        document.createElement("div");


    meta.className =
        "task-meta";


    /* =================================================
       PRIORITY BADGE
    ================================================= */

    const priorityBadge =
        document.createElement("span");


    priorityBadge.className =
        "priority-badge";


    /*
        Add priority-specific class.
    */

    priorityBadge.classList.add(
        `priority-${task.priority}`
    );


    /*
        Show priority text.
    */

    priorityBadge.textContent =
        `${task.priority} priority`;


    /* =================================================
       TIME
    ================================================= */

    const time =
        document.createElement("span");


    time.className =
        "task-time";


    time.textContent =
        `Added ${task.createdAt}`;


    /*
        Add elements to meta.
    */

    meta.appendChild(priorityBadge);

    meta.appendChild(time);


    /*
        Add title and meta
        to content.
    */

    content.appendChild(title);

    content.appendChild(meta);


    /* =================================================
       DELETE BUTTON
    ================================================= */

    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "delete-btn";


    deleteButton.textContent =
        "🗑️";


    deleteButton.setAttribute(
        "aria-label",
        "Delete task"
    );


    deleteButton.setAttribute(
        "title",
        "Delete task"
    );


    /*
        Delete task when clicked.
    */

    deleteButton.addEventListener(
        "click",
        function() {

            deleteTask(task.id);

        }
    );


    /* =================================================
       BUILD TASK
    ================================================= */

    li.appendChild(checkbox);

    li.appendChild(content);

    li.appendChild(deleteButton);


    /*
        Return finished task.
    */

    return li;

}


/* =====================================================
   9. RENDER TASKS
===================================================== */

function render() {

    /*
        Get tasks according to
        current filter and search.
    */

    const visibleTasks =
        getVisibleTasks();


    /*
        Clear current list.
    */

    taskList.innerHTML = "";


    /*
        Add every visible task.
    */

    visibleTasks.forEach(function(task) {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(
            taskElement
        );

    });


    /* =================================================
       EMPTY STATE
    ================================================= */

    if (visibleTasks.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    /* =================================================
       STATISTICS
    ================================================= */

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        total - completed;


    /*
        Calculate progress.
    */

    let progress = 0;


    if (total > 0) {

        progress =
            Math.round(
                (completed / total) * 100
            );

    }


    /* =================================================
       UPDATE STATISTICS
    ================================================= */

    totalCount.textContent =
        total;


    completedCount.textContent =
        completed;


    pendingCount.textContent =
        pending;


    progressText.textContent =
        `${progress}%`;


    progressLabel.textContent =
        `${progress}%`;


    progressBar.style.width =
        `${progress}%`;


    /* =================================================
       UPDATE TASK HINT
    ================================================= */

    if (total === 0) {

        taskHint.textContent =
            "Add your first task to get started.";

    }

    else if (pending === 0) {

        taskHint.textContent =
            "🎉 Amazing! All tasks completed.";

    }

    else {

        taskHint.textContent =
            `${pending} task${
                pending === 1 ? "" : "s"
            } remaining`;

    }

}


/* =====================================================
   10. ADD BUTTON EVENT
===================================================== */

addBtn.addEventListener(
    "click",
    addTask
);


/* =====================================================
   11. ENTER KEY EVENT
===================================================== */

taskInput.addEventListener(
    "keydown",
    function(event) {

        /*
            If user presses Enter,
            add the task.
        */

        if (event.key === "Enter") {

            addTask();

        }

    }
);


/* =====================================================
   12. SEARCH EVENT
===================================================== */

searchInput.addEventListener(
    "input",
    function() {

        render();

    }
);


/* =====================================================
   13. FILTER EVENTS
===================================================== */

filters.addEventListener(
    "click",
    function(event) {

        /*
            Find which filter button
            was clicked.
        */

        const button =
            event.target.closest(
                ".filter-btn"
            );


        /*
            If click wasn't on a button,
            stop here.
        */

        if (!button) {

            return;

        }


        /*
            Get filter value.
        */

        currentFilter =
            button.dataset.filter;


        /*
            Remove active class
            from all buttons.
        */

        document
            .querySelectorAll(".filter-btn")
            .forEach(function(btn) {

                btn.classList.remove(
                    "active"
                );

            });


        /*
            Highlight selected filter.
        */

        button.classList.add(
            "active"
        );


        /*
            Update task list.
        */

        render();

    }
);


/* =====================================================
   14. CLEAR COMPLETED TASKS
===================================================== */

clearBtn.addEventListener(
    "click",
    function() {

        /*
            Remove all completed tasks.
        */

        tasks =
            tasks.filter(function(task) {

                return !task.completed;

            });


        /*
            Save changes.
        */

        saveTasks();


        /*
            Refresh UI.
        */

        render();

    }
);


/* =====================================================
   15. DARK / LIGHT MODE
===================================================== */

themeBtn.addEventListener(
    "click",
    function() {

        /*
            Toggle light class.
        */

        document.body.classList.toggle(
            "light"
        );


        /*
            Check current theme.
        */

        const isLight =
            document.body.classList.contains(
                "light"
            );


        /*
            Change button icon.
        */

        themeBtn.textContent =
            isLight ? "🌙" : "☀️";


        /*
            Save theme preference.
        */

        localStorage.setItem(
            "focusflowTheme",
            isLight ? "light" : "dark"
        );

    }
);


/* =====================================================
   16. LOAD SAVED THEME
===================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "focusflowTheme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light"
        );

        themeBtn.textContent =
            "🌙";

    } else {

        document.body.classList.remove(
            "light"
        );

        themeBtn.textContent =
            "☀️";

    }

}


/* =====================================================
   17. INITIALIZE APPLICATION
===================================================== */

loadTheme();

render();