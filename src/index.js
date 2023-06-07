//Basic import workflow:
import { domInterface } from "./DOM.js";
import { projectFactory } from "./Projects.js";
import "./normalize.css";
import "./style.css";
import { createToDoItem } from "./todos.js";

const projectStorage = [];
console.log(projectStorage);

export { projectStorage };
