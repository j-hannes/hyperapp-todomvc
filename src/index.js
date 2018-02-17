import { h, app } from 'hyperapp';
import devtools from 'hyperapp-redux-devtools';
import { Link, location } from '@hyperapp/router';

import './index.css';

const routes = {
  ROOT: '/',
  ACTIVE: '/active',
  COMPLETED: '/completed',
};

const state = {
  todos: [],
  nextId: 1,
  todoInput: '',
  editing: null,
  location: location.state,
};

const actions = {
  location: location.actions,
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
  toggleAll: checked => state => ({
    todos: state.todos.map(todo => ({ ...todo, completed: checked })),
  }),
};

const view = (state, actions) => (
  <section class="todoapp">
    <div>
      <header class="header">
        <h1>todos</h1>
        <NewTodo inputValue={state.todoInput} actions={actions} />
      </header>
      <section class="main">
        <input
          class="toggle-all"
          type="checkbox"
          onclick={e => actions.toggleAll(e.target.checked)}
        />
        <TodoList
          location={state.location}
          todos={state.todos}
          editing={state.editing}
          actions={actions}
        />
      </section>
      <footer class="footer">
        <TodoCount todos={state.todos} />
        <TodoFilter location={state.location} />
        <button class="clear-completed" onclick={actions.clearCompleted}>
          Clear completed
        </button>
      </footer>
    </div>
  </section>
);

const NewTodo = ({ inputValue, actions }) => (
  <input
    class="new-todo"
    placeholder="What needs to be done?"
    value={inputValue}
    oninput={e => actions.updateNewTodo(e.target.value)}
    onkeyup={e => (e.which === 13 ? actions.addTodo() : null)}
  />
);

const TodoList = ({ location, todos, editing, actions }) => (
  <ul class="todo-list">
    {filterTodos(location, todos).map(todo => (
      <Todo {...todo} actions={actions} editing={todo.id === state.editing} />
    ))}
  </ul>
);

const filterTodos = (location, todos) => {
  switch (location.pathname) {
    case '/active':
      return todos.filter(({ completed }) => !completed);
    case '/completed':
      return todos.filter(({ completed }) => completed);
    default:
      return todos;
  }
};

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

const TodoFilter = ({ location }) => (
  <ul class="filters">
    {[
      {
        path: routes.ROOT,
        name: 'All',
      },
      {
        path: routes.ACTIVE,
        name: 'Active',
      },
      {
        path: routes.COMPLETED,
        name: 'Completed',
      },
    ].map(filter => (
      <li>
        <Link
          to={filter.path}
          class={filter.path === location.pathname ? 'selected' : ''}
        >
          {filter.name}
        </Link>
      </li>
    ))}
  </ul>
);

const main = devtools(app)(state, actions, view, document.body);

const unsubscribe = location.subscribe(main.location);
