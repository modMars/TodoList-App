import { projectStorage } from ".";
import { projectFactory } from "./Projects";
import { createToDoItem } from "./todos";

const eventListenerManager = (() => {
  const newTodoEventListener = () => {
    const newTodo = document.querySelector("#newTodo");
    newTodo.addEventListener("click", (e) => {
      const todoForm = document.querySelector(".to-dos__form");
      todoForm.setAttribute("id", "enabled");
    });
  };
  //Add new Project functionality
  const newProjectEventListener = () => {
    const newProjectBtn = document.querySelector(".project-container__btn");
    newProjectBtn.addEventListener("click", () => {
      const projectForm = document.querySelector(".project__form");
      projectForm.setAttribute("id", "enabled");
    });
  };
  return { newTodoEventListener, newProjectEventListener };
})();

const domInterface = (() => {
  const getCurrentProject = () => {
    let output = "";
    const currentProject = document.querySelector(
      ".project-container__list"
    ).id;
    projectStorage.forEach((project) => {
      if (currentProject === project.name) {
        output = project;
      }
    });
    return output;
  };

  const resetForm = (form) => {
    form.reset();
    form.setAttribute("id", "disabled");
  };

  const gatherTodoFormData = () => {
    const form = document.querySelector(".to-dos__form");
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const dueDate = document.getElementById("dueDate");
    const priority = document.getElementById("priority");
    const item = createToDoItem(
      title.value,
      description.value,
      dueDate.value,
      priority.value
    );
    const currentProject = getCurrentProject();
    currentProject.pushItem(item);
    resetForm(form);
  };

  const gatherProjectFormData = () => {
    const form = document.querySelector(".project__form");
    const name = document.getElementById("projectName");
    const item = projectFactory(name.value);
    projectStorage.push(item);
    resetForm(form);
  };
  //Refresh screen
  const refreshProjects = () => {
    const projectContainer = document.querySelector(".project-container__list");
    while (projectContainer.lastChild) {
      projectContainer.removeChild(projectContainer.lastChild);
    }
    projectStorage.forEach((e, i) => {
      const newProjectItem = document.createElement("li");
      const h3 = document.createElement("h3");
      newProjectItem.setAttribute("data-index", i);
      h3.textContent = e.name;
      newProjectItem.addEventListener("click", () => {
        if (projectContainer.id != e.name) {
          projectContainer.setAttribute("id", e.name);
          refreshTodos();
        }
      });
      newProjectItem.append(h3);
      projectContainer.append(newProjectItem);
      eventListenerManager.newProjectEventListener();
    });
  };
  const refreshTodos = () => {
    const todoContainer = document.querySelector(".to-dos__list");
    while (todoContainer.lastChild) {
      todoContainer.removeChild(todoContainer.lastChild);
    }
    const currentProject = getCurrentProject().content;
    currentProject.forEach((project, i) => {
      const listItem = document.createElement("li");
      const title = document.createElement("h3");
      const description = document.createElement("p");
      const dueDate = document.createElement("span");
      const priority = document.createElement("p");
      const checkMark = document.createElement("input");
      title.textContent = project.title;
      description.textContent = project.description;
      dueDate.textContent = project.dueDate;
      priority.textContent = project.priority;
      checkMark.setAttribute("type", "checkbox");
      listItem.append(title, description, dueDate, priority, checkMark);
      listItem.setAttribute("data-index", i);
      todoContainer.append(listItem);
    });
  };
  return {
    gatherTodoFormData,
    gatherProjectFormData,
    refreshProjects,
    refreshTodos,
  };
})();

//Add new Todo functionality
const form = document.querySelector(".to-dos__form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  domInterface.gatherTodoFormData();
  domInterface.refreshTodos();
});

const cancelTodoBtn = document.querySelectorAll(".to-dos__form-cancel");
cancelTodoBtn.forEach((e) => {
  e.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.form.setAttribute("id", "disabled");
    e.target.form.reset();
  });
});

const projectForm = document.querySelector(".project__form");
projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  domInterface.gatherProjectFormData();
  domInterface.refreshProjects();
});

eventListenerManager.newTodoEventListener();
eventListenerManager.newProjectEventListener();

export { domInterface };
