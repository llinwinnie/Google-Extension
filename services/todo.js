$(document).ready(() => {
  chrome.storage.local.get(["todos"], (data) => {
    const todos = data.todos || [];
    todos.forEach((task) => appendTodo(task));
  });

  $("#todoInput").on("keypress", (e) => {
    if (e.which === 13) {
      const text = $("#todoInput").val().trim();
      if (!text) return;
      addTodo(text);
      $("#todoInput").val("");
    }
  });
});

function appendTodo(text) {
  const li = $(`
    <li>
      <span class="todo-text">${text}</span>
      <button class="delete-todo">×</button>
    </li>
  `);
  $("#todo-list").append(li);
  li.find(".delete-todo").on("click", function () {
    const todoText = li.find(".todo-text").text();
    removeTodo(todoText);
    li.remove();
  });
}

function addTodo(text) {
  chrome.storage.local.get(["todos"], (data) => {
    const todos = data.todos || [];
    todos.push(text);
    chrome.storage.local.set({ todos: todos }, () => {
      appendTodo(text);
    });
  });
}

function removeTodo(text) {
  chrome.storage.local.get(["todos"], (data) => {
    let todos = data.todos || [];
    todos = todos.filter((t) => t !== text);
    chrome.storage.local.set({ todos: todos });
  });
}
