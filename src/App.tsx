import React, { useEffect, useState } from "react";
import TodoItem from "./components/TodoItem";
import AddTodo from "./components/AddTodo";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./API";

// Premium design global styles
const globalStyles = `
  body {
    background-color: #121212;
    color: #e0e0e0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .App {
    width: 100%;
    max-width: 650px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 40px;
    color: #ffffff;
    text-align: center;
    letter-spacing: -0.5px;
  }

  /* Form styles */
  .Form {
    margin-bottom: 40px;
    background-color: #1e1e1e;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid #2a2a2a;
  }

  .Form div {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  .Form div div {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 8px;
  }

  .Form label {
    font-size: 0.85rem;
    color: #b0b0b0;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .Form input {
    padding: 12px 16px;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    background-color: #252525;
    color: white;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .Form input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  .Form button {
    padding: 12px 24px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    font-size: 0.95rem;
    letter-spacing: 0.3px;
  }

  .Form button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .Form button:active:not(:disabled) {
    transform: translateY(0);
  }

  .Form button:disabled {
    background: #2a2a2a;
    color: #666;
    cursor: not-allowed;
  }

  /* Card styles */
  .Card {
    background-color: #1e1e1e;
    margin-bottom: 16px;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    border: 1px solid #2a2a2a;
    transition: all 0.2s ease;
  }

  .Card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .Card--text {
    flex: 1;
  }

  .Card--text h1 {
    font-size: 1.2rem;
    margin: 0;
    margin-bottom: 8px;
    color: #6366f1;
    text-align: left;
  }

  .Card--text span {
    color: #b0b0b0;
    font-size: 0.9rem;
    display: block;
  }

  .line-through {
    text-decoration: line-through;
    color: #666 !important;
    opacity: 0.7;
  }

  .Card--button {
    display: flex;
    gap: 12px;
  }

  .Card--button button {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .Card--button__done {
    background-color: #10b981;
    color: white;
  }

  .Card--button__done:hover {
    background-color: #059669;
  }

  .Card--button__delete {
    background-color: #1e1e1e;
    color: #f43f5e;
    border: 1px solid #f43f5e !important;
  }

  .Card--button__delete:hover {
    background-color: rgba(244, 63, 94, 0.1);
  }

  .hide-button {
    display: none;
  }

  /* Empty state */
  .Empty-state {
    text-align: center;
    padding: 40px 0;
    color: #666;
  }

  .Empty-state p {
    font-size: 1rem;
    margin-bottom: 0;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .Form div {
      flex-direction: column;
    }
  }
`;

const App: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Inject global styles
    const styleElement = document.createElement("style");
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    // Add Inter font
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(linkElement);

    // Fetch todos
    fetchTodos();

    // Cleanup function
    return () => {
      document.head.removeChild(styleElement);
      document.head.removeChild(linkElement);
    };
  }, []);

  const fetchTodos = (): void => {
    setLoading(true);
    getTodos()
      .then(({ data: { todos } }: ITodo[] | any) => {
        setTodos(todos);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSaveTodo = (e: React.FormEvent, formData: ITodo): void => {
    e.preventDefault();
    addTodo(formData)
      .then(({ status, data }) => {
        if (status !== 201) {
          throw new Error("Error! Todo not saved");
        }
        setTodos(data.todos);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateTodo = (todo: ITodo): void => {
    updateTodo(todo)
      .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error("Error! Todo not updated");
        }
        setTodos(data.todos);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTodo = (_id: string): void => {
    deleteTodo(_id)
      .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error("Error! Todo not deleted");
        }
        setTodos(data.todos);
      })
      .catch((err) => console.log(err));
  };

  return (
    <main className="App">
      <h1>My Tasks</h1>
      <AddTodo saveTodo={handleSaveTodo} />

      {loading ? (
        <div className="Empty-state">
          <p>Loading tasks...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="Empty-state">
          <p>No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        todos.map((todo: ITodo) => (
          <TodoItem
            key={todo._id}
            updateTodo={handleUpdateTodo}
            deleteTodo={handleDeleteTodo}
            todo={todo}
          />
        ))
      )}
    </main>
  );
};

export default App;
