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
      const trashIcon = document.createElement("i");
      const h4 = document.createElement("h4");
      trashIcon.classList.add("fa-solid", "fa-x");
      newProjectItem.setAttribute("class", "project-container__list-item");
      trashIcon.setAttribute("data-index", i);
      h4.textContent = e.name;
      newProjectItem.append(h4, trashIcon);
      newProjectItem.addEventListener("click", () => {
        if (projectContainer.id != e.name) {
          projectContainer.setAttribute("id", e.name);
          refreshTodos();
        }
      });
      projectContainer.append(newProjectItem);
    });
    eventListenerManager.deleteProjectEventListener();
  };

  const refreshTodos = () => {
    const todoContainer = document.querySelector(".to-dos__list");
    while (todoContainer.lastChild) {
      todoContainer.removeChild(todoContainer.lastChild);
    }
    const currentProject = domInterface.getCurrentProject().content;
    const projectName = document.createElement("h2");
    const btn = document.createElement("button");
    const wrapper = document.createElement("div");
    wrapper.setAttribute("id", "to-dos__container-wrapper");
    btn.setAttribute("class", "to-dos__container-btn");
    btn.textContent = "+";
    wrapper.append(projectName, btn);
    projectName.textContent = `~/ ${
      document.querySelector(".project-container__list").id
    }`;
    todoContainer.append(wrapper);
    currentProject.forEach((project, i) => {
      const listItem = document.createElement("li");
      const title = document.createElement("h4");
      const dueDate = document.createElement("span");
      const priority = document.createElement("p");
      title.textContent = project.title;
      dueDate.textContent = project.dueDate;
      priority.textContent = project.priority;
      listItem.append(title, dueDate, priority);
      listItem.setAttribute("class", "to-dos__list-item");
      listItem.setAttribute("data-index", i);
      todoContainer.append(listItem);
    });
    eventListenerManager.newTodoEventListener();
    eventListenerManager.deleteTodoEventListener();
  };
  return { refreshProjects, refreshTodos };
})();

const eventListenerManager = (() => {
  const focusOnForm = (input) => {
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);
  };

  const newTodoEventListener = () => {
    const newTodoBtn = document.querySelector(".to-dos__container-btn");
    newTodoBtn.addEventListener("click", () => {
      const bodyWrapper = document.querySelector(".wrapper");
      bodyWrapper.classList.toggle("blur-filter");
      const todoForm = document.querySelector(".to-dos__form");
      todoForm.setAttribute("id", "enabled");
      focusOnForm(document.querySelector("#title"));
    });
  };
  //Add new Project functionality
  const newProjectEventListener = () => {
    const newProjectBtn = document.querySelector(".project-container__btn");
    newProjectBtn.addEventListener("click", () => {
      const bodyWrapper = document.querySelector(".wrapper");
      bodyWrapper.classList.toggle("blur-filter");
      const projectForm = document.querySelector(".project__form");
      projectForm.setAttribute("id", "enabled");
      //Auto select input.
      focusOnForm(document.querySelector("#projectName"));
    });
  };
  //Add new Todo functionality
  const todoFormEventListener = () => {
    const todoForm = document.querySelector(".to-dos__form");
    todoForm.addEventListener("submit", (e) => {
      const bodyWrapper = document.querySelector(".wrapper");
      bodyWrapper.classList.remove("blur-filter");
      e.preventDefault();
      domInterface.gatherTodoFormData();
      displayManager.refreshTodos();
    });
  };

  const cancelFormEventListener = () => {
    const cancelBtn = document.querySelectorAll(".to-dos__form-cancel");
    cancelBtn.forEach((e) => {
      e.addEventListener("click", (e) => {
        const bodyWrapper = document.querySelector(".wrapper");
        bodyWrapper.classList.remove("blur-filter");
        e.target.form.setAttribute("id", "disabled");
        e.target.form.reset();
      });
    });
  };

  const projectFormEventListener = () => {
    const projectForm = document.querySelector(".project__form");
    projectForm.addEventListener("submit", (e) => {
      const bodyWrapper = document.querySelector(".wrapper");
      bodyWrapper.classList.remove("blur-filter");
      e.preventDefault();
      domInterface.gatherProjectFormData();
      displayManager.refreshProjects();
      displayManager.refreshTodos();
    });
  };

  const deleteTodoEventListener = () => {
    const toDoItems = document.querySelectorAll(".to-dos__list-item");
    toDoItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const itemIndex = e.currentTarget.dataset.index;
        const currentProject = domInterface.getCurrentProject();
        currentProject.content.splice(itemIndex, 1);
        displayManager.refreshTodos();
      });
    });
  };

  const deleteProjectEventListener = () => {
    const projectCross = document.querySelectorAll(".fa-x");
    projectCross.forEach((cross) => {
      cross.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = e.target.dataset.index;
        projectStorage.splice(index, 1);
        displayManager.refreshProjects();
      });
    });
  };

  return {
    newTodoEventListener,
    newProjectEventListener,
    todoFormEventListener,
    cancelFormEventListener,
    projectFormEventListener,
    deleteTodoEventListener,
    deleteProjectEventListener,
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
  //Gathers the name of the project, creates a project item and pushes it to the project storage array.. afterwards it resets the form.
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
