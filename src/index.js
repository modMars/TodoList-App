//Basic import workflow:
import { displayManager, domInterface, eventListenerManager } from "./DOM.js";
import { projectFactory } from "./Projects.js";
import "./normalize.css";
import "./style.css";
import { createToDoItem } from "./todos.js";

let Inbox = projectFactory("Inbox");
const projectStorage = [Inbox];

eventListenerManager.todoFormEventListener();
eventListenerManager.cancelFormEventListener();
eventListenerManager.projectFormEventListener();
eventListenerManager.newTodoEventListener();
eventListenerManager.newProjectEventListener();
displayManager.refreshProjects();
displayManager.refreshTodos();

export { projectStorage };
