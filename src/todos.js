//To-dos must have the following properties: title, description, dueDate, priority. | Some optional properties are the following: notes, checkList

const createToDoItem = (title, description, dueDate, priority) => {
  return { title, description, dueDate, priority };
};

export { createToDoItem };
