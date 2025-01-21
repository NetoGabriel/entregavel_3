// Classe

class ToDo {
    constructor(texto, prioridade) {
      this.Texto = texto;
      this.Prioridade = prioridade;
      this.Feito = false;
    }
  }
  
  // Array
  let arrayTodos = [];
  
  //funções projeto
  
  function CriarToDo(texto, prioridade, array) {
      let objetoTodo = new ToDo(texto, prioridade);
      if (!array.some(todo => todo.Texto === objetoTodo.Texto)) {
          array.push(objetoTodo);
          return objetoTodo;
      }
      return null;
  }
  
  function AtualizarToDo(textoAntigo, textoNovo, array) {
      let index = array.findIndex(todo => todo.Texto === textoAntigo);
      if (index !== -1) {
          array[index].Texto = textoNovo;
          return true;
      }
      return false;
  }
  
  function ConcluirToDo(texto, array) {
      if (!Array.isArray(array)) {
          return false;
      }
      let concluido = false;
      array.forEach(todo => {
          if (todo.Texto === texto) {
              todo.Feito = !todo.Feito;
              concluido = true;
          }
      });
      return concluido;
  }
  
  function ExcluirToDo(texto, array) {
      if (!Array.isArray(array)) {
          return false;
      }
      let Excluir = false;
      array.forEach((todo, index) => {
          if (todo.Texto === texto) {
              array.splice(index, 1);
              Excluir = true;
          }
      });
      return Excluir;
  }
  
  function PesquisarToDo(texto, array) {
      if (!Array.isArray(array)) {
          return null;
      }
      return array.find(todo => todo.Texto === texto) || null;
  }
  
  function OrdenarCrescente(array) {
      if (!Array.isArray(array)) {
          return [];
      }
      return array.sort((a, b) => a.Prioridade - b.Prioridade);
  }
  
  function OrdenarDecrescente(array) {
      if (!Array.isArray(array)) {
          return [];
      }
      return array.sort((a, b) => b.Prioridade - a.Prioridade);
  }
  
  // Seleção de elementos
  const todoForm = document.querySelector("#todo-form");
  const todoInput = document.querySelector("#todo-input");
  const todoInput2 = document.querySelector("#todo-input-2");
  const todoList = document.querySelector("#todo-list");
  const editForm = document.querySelector("#edit-form");
  const editInput = document.querySelector("#edit-input");
  const cancelEditBtn = document.querySelector("#cancel-edit-btn");
  const searchInput = document.querySelector("#search-input");
  const eraseBtn = document.querySelector("#erase-button");
  const filterBtn = document.querySelector("#filter-select");
  
  let oldInputValue;
  
  // Funções
  const saveTodo = (text, rating, done = 0, save = 1) => {
      let objetoTodo = CriarToDo(text, rating, arrayTodos);
  
      if (!objetoTodo) {
          return;
      }
  
      const todo = document.createElement("div");
      todo.classList.add("todo");
  
      const todoTitle = document.createElement("h3");
      todoTitle.innerText = objetoTodo.Texto;
      todo.appendChild(todoTitle);
  
      const todoRating = document.createElement("h3");
      todoRating.innerText = objetoTodo.Prioridade;
      todo.appendChild(todoRating);
  
      const doneBtn = document.createElement("button");
      doneBtn.classList.add("finish-todo");
      doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      todo.appendChild(doneBtn);
  
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-todo");
      editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
      todo.appendChild(editBtn);
  
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("remove-todo");
      deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      todo.appendChild(deleteBtn);
  
      // Utilizando dados da localStorage
      if (done) {
          todo.classList.add("done");
      }
  
      if (save) {
          saveTodoLocalStorage({ text, rating, done: 0 });
      }
  
      todoList.appendChild(todo);
  
      todoInput.value = "";
      todoInput2.value = "";
  };
  
  const toggleForms = () => {
      editForm.classList.toggle("hide");
      todoForm.classList.toggle("hide");
      todoList.classList.toggle("hide");
  };
  
  const updateTodo = (text) => {
      const todos = document.querySelectorAll(".todo");
      let targetTodo;
      todos.forEach((todo) => {
          let todoTitle = todo.querySelector("h3");
          if (todoTitle.innerText === oldInputValue) {
              targetTodo = todoTitle;
          }
      });
  
      let atualizado = AtualizarToDo(targetTodo.innerText, text, arrayTodos);
  
      if (atualizado) {
          targetTodo.innerText = text;
          // Utilizando dados da localStorage
          updateTodoLocalStorage(oldInputValue, text);
      }
  };
  
  const getSearchedTodos = (search) => {
      const todos = document.querySelectorAll(".todo");
  
      const resultadoPesquisa = PesquisarToDo(search, arrayTodos);
  
      if (resultadoPesquisa) {
          todos.forEach((todo) => {
              const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
  
              todo.style.display = "flex";
  
              if (!todoTitle.includes(search.toLowerCase())) {
                  todo.style.display = "none";
              }
          });
      }
  };
  
  const filterTodos = (filterValue) => {
      const todos = document.querySelectorAll(".todo");
  
      todos.forEach((todo) => {
          todo.remove();
      });
  
      switch (filterValue) {
          case "cresc":
              arrayTodos = OrdenarCrescente(arrayTodos);
              break;
          case "decresc":
              arrayTodos = OrdenarDecrescente(arrayTodos);
              break;
          default:
              break;
      }
  
      arrayTodos.forEach((todo) => {
          const { Texto, Prioridade, Feito } = todo;
          saveTodo(Texto, Prioridade, Feito, 0);
      });
  };
  
  // Eventos
  todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const inputValue = todoInput.value;
      const inputValue2 = todoInput2.value;
  
      if (inputValue && inputValue2) {
          saveTodo(inputValue, inputValue2);
      }
  });
  
  document.addEventListener("click", (e) => {
      const targetEl = e.target;
      const parentEl = targetEl.closest("div");
      let todoTitle;
  
      if (parentEl && parentEl.querySelector("h3")) {
          todoTitle = parentEl.querySelector("h3").innerText || "";
      }
  
      if (targetEl.classList.contains("finish-todo")) {
          todoTitle = parentEl.querySelector("h3").innerText;
          let concluido = ConcluirToDo(todoTitle, arrayTodos);
          if (concluido) {
              parentEl.classList.toggle("done");
              updateTodoStatusLocalStorage(todoTitle);
          }
      }
  
      if (targetEl.classList.contains("remove-todo")) {
          todoTitle = parentEl.querySelector("h3").innerText;
          let removido = ExcluirToDo(todoTitle, arrayTodos);
          if (removido) {
              parentEl.remove();
  
              // Utilizando dados da localStorage
              removeTodoLocalStorage(todoTitle);
          }
      }
  
      if (targetEl.classList.contains("edit-todo")) {
          toggleForms();
  
          editInput.value = todoTitle;
          oldInputValue = todoTitle;
      }
  });
  
  cancelEditBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleForms();
  });
  
  editForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const editInputValue = editInput.value;
  
      if (editInputValue) {
          updateTodo(editInputValue);
      }
  
      toggleForms();
  });
  
  searchInput.addEventListener("keyup", (e) => {
      const search = e.target.value;
  
      getSearchedTodos(search);
  });
  
  eraseBtn.addEventListener("click", (e) => {
      e.preventDefault();
  
      searchInput.value = "";
  
      searchInput.dispatchEvent(new Event("keyup"));
  });
  
  filterBtn.addEventListener("change", (e) => {
      const filterValue = e.target.value;
  
      filterTodos(filterValue);
  });
  
  // Local Storage
  const getTodosLocalStorage = () => {
      const todos = JSON.parse(localStorage.getItem("todos")) || [];
  
      return todos;
  };
  
  const loadTodos = () => {
      const todos = getTodosLocalStorage();
  
      todos.forEach((todo) => {
          saveTodo(todo.text, todo.rating, todo.done, 0);
      });
  };
  
  const saveTodoLocalStorage = (todo) => {
      const todos = getTodosLocalStorage();
  
      todos.push(todo);
  
      localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const removeTodoLocalStorage = (todoText) => {
      const todos = getTodosLocalStorage();
  
      const filteredTodos = todos.filter((todo) => todo.text != todoText);
  
      localStorage.setItem("todos", JSON.stringify(filteredTodos));
  };
  
  const updateTodoStatusLocalStorage = (todoText) => {
      const todos = getTodosLocalStorage();
  
      todos.map((todo) =>
          todo.text === todoText ? (todo.done = !todo.done) : null
      );
  
      localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const updateTodoLocalStorage = (todoOldText, todoNewText) => {
      const todos = getTodosLocalStorage();
  
      todos.map((todo) =>
          todo.text === todoOldText ? (todo.text = todoNewText) : null
      );
  
      localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  loadTodos();