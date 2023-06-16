//This javascript file's purpose is to store projects and their content.

function projectFactory(name) {
  let content = [];
  const pushItem = function (item) {
    content.push(item);
  };

  return {
    name,
    content,
    pushItem,
    get content() {
      return content;
    },
    set content(value) {
      return (content = value);
    },
  };
}

export { projectFactory };
