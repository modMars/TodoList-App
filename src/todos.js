//To-dos must have the following properties: title, description, dueDate, priority. | Some optional properties are the following: notes, checkList

const createToDoItem = (title, dueDate, priority) => {
  const checkList = false;
  return { title, dueDate, priority, checkList };
};

export { createToDoItem };
