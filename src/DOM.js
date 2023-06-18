import { projectStorage } from ".";
import { projectFactory } from "./Projects";
import { createToDoItem } from "./todos";

const displayManager = (() => {
  //Refresh screen
  const refreshProjects = () => {
    const projectContainer = document.querySelector(".project-container__list");
    while (projectContainer.lastChild) {
      projectContainer.removeChild(projectContainer.lastChild);
    }
    projectStorage.forEach((e, i) => {
      const newProjectItem = document.createElement("li");
      const h3 = document.createElement("h3");
      newProjectItem.setAttribute("class", "project-container__list-item");
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
    const currentProject = domInterface.getCurrentProject().content;
    const projectName = document.createElement("h2");
    const btn = document.createElement("button");
    const icon = document.createElement("i");
    const wrapper = document.createElement("div");
    wrapper.setAttribute("id", "to-dos__container-wrapper");
    btn.setAttribute("class", "to-dos__container-btn");
    icon.setAttribute("class", "fa-solid fa-square-plus");
    btn.append(icon);
    wrapper.append(projectName, btn);
    projectName.textContent = document.querySelector(
      ".project-container__list"
    ).id;
    todoContainer.append(wrapper);
    currentProject.forEach((project, i) => {
      const listItem = document.createElement("li");
      const title = document.createElement("h3");
      const dueDate = document.createElement("span");
      const priority = document.createElement("p");
      const checkMark = document.createElement("input");
      title.textContent = project.title;
      dueDate.textContent = project.dueDate;
      priority.textContent = project.priority;
      checkMark.setAttribute("type", "checkbox");
      listItem.append(title, dueDate, priority, checkMark);
      listItem.setAttribute("class", "to-dos__list-item");
      listItem.setAttribute("data-index", i);
      todoContainer.append(listItem);
    });
    eventListenerManager.newTodoEventListener();
  };
  return { refreshProjects, refreshTodos };
})();

const eventListenerManager = (() => {
  const newTodoEventListener = () => {
    const newTodoBtn = document.querySelector(".to-dos__container-btn");
    newTodoBtn.addEventListener("click", (e) => {
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
  //Add new Todo functionality
  const todoFormEventListener = () => {
    const todoForm = document.querySelector(".to-dos__form");
    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      domInterface.gatherTodoFormData();
      displayManager.refreshTodos();
    });
  };

  const cancelFormEventListener = () => {
    const cancelBtn = document.querySelectorAll(".to-dos__form-cancel");
    cancelBtn.forEach((e) => {
      e.addEventListener("click", (e) => {
        e.target.form.setAttribute("id", "disabled");
        e.target.form.reset();
      });
    });
  };

  const projectFormEventListener = () => {
    const projectForm = document.querySelector(".project__form");
    projectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      domInterface.gatherProjectFormData();
      displayManager.refreshProjects();
      displayManager.refreshTodos();
    });
  };
  return {
    newTodoEventListener,
    newProjectEventListener,
    todoFormEventListener,
    cancelFormEventListener,
    projectFormEventListener,
  };
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
  //Takes a form, resets it input fields and hides it.
  const resetForm = (form) => {
    form.reset();
    form.setAttribute("id", "disabled");
  };
  //Gathers all the data inputted by the user, creates a to-do item and saves it into the current project's content array, afterwards it resets the form.
  const gatherTodoFormData = () => {
    const form = document.querySelector(".to-dos__form");
    const title = document.getElementById("title");
    const dueDate = document.getElementById("dueDate");
    const priority = document.getElementById("priority");
    const item = createToDoItem(title.value, dueDate.value, priority.value);
    const currentProject = getCurrentProject();
    currentProject.pushItem(item);
    resetForm(form);
  };
  //Gathers the name of the project, creates a project item,
  const gatherProjectFormData = () => {
    const form = document.querySelector(".project__form");
    const name = document.getElementById("projectName");
    const item = projectFactory(name.value);
    const projectList = document.querySelector(".project-container__list");
    projectList.setAttribute("id", item.name);
    projectStorage.push(item);
    resetForm(form);
  };

  return {
    gatherTodoFormData,
    gatherProjectFormData,
    getCurrentProject,
  };
})();

export { displayManager, domInterface, eventListenerManager };
