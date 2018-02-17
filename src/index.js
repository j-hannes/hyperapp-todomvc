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
  editing: null,
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
  clearCompleted: () => state => ({
    todos: state.todos.filter(todo => !todo.completed),
  }),
  setEditing: editing => {
    const el = document.getElementById(`todo-${editing}`);
    setTimeout(() => el.focus(), 100);
    return { editing };
  },
  updateTodo: ({ id, description }) => state => ({
    todos: state.todos.map(
      todo => (todo.id === id ? { ...todo, description } : todo)
    ),
  }),
  finishEditing: () => ({ editing: null }),
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
            <Todo
              {...todo}
              actions={actions}
              editing={todo.id === state.editing}
            />
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
        <button class="clear-completed" onclick={actions.clearCompleted}>
          Clear completed
        </button>
      </footer>
    </div>
  </section>
);

const Todo = ({ id, completed, description, editing, actions }) => (
  <li class={`${completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        checked={completed}
        onclick={e => actions.toggle(id)}
      />
      <label ondblclick={e => actions.setEditing(id)}>{description}</label>
      <button class="destroy" onclick={e => actions.remove(id)} />
    </div>
    <input
      id={`todo-${id}`}
      class="edit"
      value={description}
      oninput={e => actions.updateTodo({ id, description: e.target.value })}
      onblur={e => actions.finishEditing()}
    />
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
