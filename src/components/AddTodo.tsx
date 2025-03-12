import React, { useState } from "react";

type Props = {
  saveTodo: (e: React.FormEvent, formData: ITodo) => void;
};

const AddTodo: React.FC<Props> = ({ saveTodo }) => {
  const [formData, setFormData] = useState<ITodo | {}>({
    name: "",
    description: "",
    status: false,
  });

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  // Check if form has valid data
  const isFormEmpty = (): boolean => {
    return (
      !formData.hasOwnProperty("name") ||
      (formData as ITodo).name === "" ||
      !formData.hasOwnProperty("description") ||
      (formData as ITodo).description === ""
    );
  };

  // Reset form after submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    saveTodo(e, formData as ITodo);
    setFormData({
      name: "",
      description: "",
      status: false,
    });
    // Reset the form inputs
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <div>
        <div>
          <label htmlFor="name">Task Name</label>
          <input
            onChange={handleForm}
            type="text"
            id="name"
            placeholder="Enter task name"
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            onChange={handleForm}
            type="text"
            id="description"
            placeholder="Enter task description"
          />
        </div>
      </div>
      <button disabled={isFormEmpty()}>Add Task</button>
    </form>
  );
};

export default AddTodo;
