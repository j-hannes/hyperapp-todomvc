import { h, app } from 'hyperapp';
import devtools from 'hyperapp-redux-devtools';

import './index.css';

const state = {
  todos: [
    { id: 1, description: 'buy some milk', completed: true },
    { id: 2, description: 'empty bins', completed: false },
  ],
  nextId: 3,
  todoInput: '',
};

const actions = {
  toggle: id => state => ({
    todos: state.todos.map(
      todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)
    ),
  }),
  updateNewTodo: todoInput => ({ todoInput }),
  addTodo: () => state => ({
    todos: [
      { id: state.nextId, description: state.todoInput, completed: false },
      ...state.todos,
    ],
    nextId: state.nextId + 1,
    todoInput: '',
  }),
  remove: id => state => ({
    todos: state.todos.filter(todo => todo.id !== id),
  }),
};

const view = (state, actions) => (
  <section class="todoapp">
    <div>
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          value={state.todoInput}
          oninput={e => actions.updateNewTodo(e.target.value)}
          onkeyup={e => (e.which === 13 ? actions.addTodo() : null)}
        />
      </header>
      <section class="main">
        <input class="toggle-all" />
        <ul class="todo-list">
          {state.todos.map(todo => (
            <Todo {...todo} toggle={actions.toggle} remove={actions.remove} />
          ))}
        </ul>
      </section>
      <footer class="footer">
        <TodoCount todos={state.todos} />
        <ul class="filters">
          <li>
            <a href="#/" class="selected">
              All
            </a>
          </li>
          <span> </span>
          <li>
            <a href="#/active" class="">
              Active
            </a>
          </li>
          <span> </span>
          <li>
            <a href="#/completed" class="">
              Completed
            </a>
          </li>
        </ul>
        <button class="clear-completed">Clear completed</button>
      </footer>
    </div>
  </section>
);

const Todo = ({ id, completed, description, toggle, remove }) => (
  <li class={completed ? 'completed' : ''}>
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        checked={completed}
        onclick={e => toggle(id)}
      />
      <label>{description}</label>
      <button class="destroy" onclick={e => remove(id)} />
    </div>
    <input class="edit" value={description} />
  </li>
);

const TodoCount = ({ todos }) => {
  const todoCount = todos.filter(todo => !todo.completed).length;
  return (
    <span class="todo-count">
      <strong>{todoCount}</strong>
      <span> </span>
      <span>{todoCount === 1 ? 'item' : 'items'}</span>
      <span> left</span>
    </span>
  );
};

devtools(app)(state, actions, view, document.body);
