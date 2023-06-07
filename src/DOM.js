import { projectStorage } from ".";
import { projectFactory } from "./Projects";
import { createToDoItem } from "./todos";

const domInterface = (() => {
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
    console.log(item);
    resetForm(form);
  };

  const gatherProjectFormData = () => {
    const form = document.querySelector(".project__form");
    const name = document.getElementById("projectName");
    const item = projectFactory(name.value);
    projectStorage.push(item);
    console.log(projectStorage);
    resetForm(form);

    //Refresh screen
    const refreshDisplay = () => {
      const todoContainer = document.querySelector(".to-dos");
      while (mainContent.lastChild) {
        mainContent.removeChild(mainContent.lastChild);
      }
      const button = document.createElement("button");
      button.setAttribute("id", newTodo);
      button.textContent = newTodo;
    };
  };
  return { gatherTodoFormData, gatherProjectFormData };
})();

//Add new Todo functionality
const form = document.querySelector(".to-dos__form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  domInterface.gatherTodoFormData();
});

const newTodo = document.querySelector("#newTodo");
newTodo.addEventListener("click", (e) => {
  form.setAttribute("id", "enabled");
});

const cancelTodoBtn = document.querySelectorAll(".to-dos__form-cancel");
cancelTodoBtn.forEach((e) => {
  e.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.form.setAttribute("id", "disabled");
    e.target.form.reset();
  });
});

//Add new Project functionality
const newProjectBtn = document.querySelector(".project-container__btn");
newProjectBtn.addEventListener("click", () => {
  const projectForm = document.querySelector(".project__form");
  console.log(projectForm);
  projectForm.setAttribute("id", "enabled");
});

const projectForm = document.querySelector(".project__form");
projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  domInterface.gatherProjectFormData();
});

export { domInterface };
