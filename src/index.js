import { h, app } from 'hyperapp';
import devtools from 'hyperapp-redux-devtools';

import './index.css';

const state = {
  todos: [
    { id: 1, description: 'buy some milk', completed: true },
    { id: 2, description: 'empty bins', completed: false },
  ],
};

const actions = {
  toggle: id => state => ({
    todos: state.todos.map(
      todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)
    ),
  }),
};

const view = (state, actions) => (
  <section class="todoapp">
    <div>
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" value="" />
      </header>
      <section class="main">
        <input class="toggle-all" />
        <ul class="todo-list">
          {state.todos.map(todo => <Todo {...todo} toggle={actions.toggle} />)}
        </ul>
      </section>
      <footer class="footer">
        <span class="todo-count">
          <strong>2</strong>
          <span> </span>
          <span>items</span>
          <span> left</span>
        </span>
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

const Todo = ({ id, completed, description, toggle }) => (
  <li class={completed ? 'completed' : ''}>
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        checked={completed}
        onclick={e => toggle(id)}
      />
      <label>{description}</label>
      <button class="destroy" />
    </div>
    <input class="edit" value={description} />
  </li>
);

devtools(app)(state, actions, view, document.body);
