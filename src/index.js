import { h, app } from 'hyperapp';
import devtools from 'hyperapp-redux-devtools';

import './index.css';

const state = {
  todos: [
    { description: 'buy some milk', completed: true },
    { description: 'empty bins', completed: false },
  ],
};

const actions = {};

const view = state => (
  <section class="todoapp">
    <div>
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" value="" />
      </header>
      <section class="main">
        <input class="toggle-all" />
        <ul class="todo-list">{state.todos.map(todo => <Todo {...todo} />)}</ul>
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

const Todo = ({ id, completed, description }) => (
  <li class={completed ? 'completed' : ''}>
    <div class="view">
      <input class="toggle" type="checkbox" checked={completed} />
      <label>{description}</label>
      <button class="destroy" />
    </div>
    <input class="edit" value={description} />
  </li>
);

devtools(app)(state, actions, view, document.body);
