import { createToDoItem } from "./todos";

const domInterface = (() => {
  const gatherFormData = () => {
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
    resetForm();
  };

  const resetForm = () => {
    const form = document.querySelector(".to-dos__form");
    form.reset();
    form.setAttribute("id", "disabled");
  };

  return { gatherFormData };
})();

//Add form event listener
const form = document.querySelector(".to-dos__form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  domInterface.gatherFormData();
});

const newTodo = document.querySelector("#newTodo");
newTodo.addEventListener("click", (e) => {
  form.setAttribute("id", "enabled");
});

export { domInterface };
