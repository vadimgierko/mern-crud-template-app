import { useEffect, useState } from "react";

export default function Todos() {
	const [todos, setTodos] = useState([]);
	// for todo input:
	const [inputValue, setInputValue] = useState("");
	// for todo edition input:
	const [idForEdition, setIdForEdition] = useState();
	const [editedValue, setEditedValue] = useState("");

	async function addTodo(todo) {
		const newTodo = {
			todo: todo,
		};

		await fetch("http://localhost:5000/todos/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newTodo),
		})
			.then(() => getTodos())
			.catch((error) => {
				window.alert(error);
				return;
			});

		resetInput();
	}

	async function deleteTodo(id) {
		await fetch(`http://localhost:5000/${id}`, {
			method: "DELETE",
		});

		const updatedTodos = todos.filter((todo) => todo._id !== id);
		setTodos(updatedTodos);
	}

	async function updateTodo(id, todo) {
		const updatedTodo = {
			todo: todo,
		};

		await fetch(`http://localhost:5000/update/${id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedTodo),
		})
			.then(() => {
				getTodos();
			})
			.catch((error) => {
				window.alert(error);
				return;
			});

		resetInput();
	}

	function resetInput() {
		setInputValue("");
	}

	async function getTodos() {
		const response = await fetch(`http://localhost:5000/todos/`);

		if (!response.ok) {
			const message = `An error occurred: ${response.statusText}`;
			window.alert(message);
			return;
		}

		const fetchedTodos = await response.json();
		console.log("fetched todos:", fetchedTodos);
		setTodos(fetchedTodos);
	}

	useEffect(() => {
		if (!todos.length) {
			getTodos();
		}

		return;
	}, [todos.length]);

	useEffect(() => {
		// when todo is chosen for edition
		// set its input value according to its id:
		if (idForEdition) {
			// find todo:
			todos.forEach((todo) => {
				if (todo._id === idForEdition) {
					setEditedValue(todo.todo);
				}
			});
		} else {
			setEditedValue("");
		}
	}, [idForEdition, todos]);

	if (!todos.length)
		return (
			<div className="todos-page" style={{ textAlign: "center" }}>
				<h1>My Todos</h1>
				<input
					value={inputValue}
					placeholder="add todo"
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<button
					type="button"
					onClick={() => {
						if (inputValue.length) {
							addTodo(inputValue);
							resetInput();
						} else {
							alert("You cannot add an empty todo! Type something!");
						}
					}}
				>
					add todo
				</button>
				<p>There are no todos yet... Create one!</p>
			</div>
		);

	return (
		<div className="todos-page" style={{ textAlign: "center" }}>
			<h1>Your Todos</h1>
			<input
				value={inputValue}
				placeholder="add todo"
				onChange={(e) => setInputValue(e.target.value)}
			/>
			<button
				type="button"
				onClick={() => {
					if (inputValue.length) {
						addTodo(inputValue);
						resetInput();
					} else {
						alert("You cannot add an empty todo! Type something!");
					}
				}}
			>
				add todo
			</button>
			<ul className="todo-list" style={{ listStyle: "none", paddingLeft: 0 }}>
				{todos.length &&
					todos.map((todo) => (
						<li key={todo._id} style={{ marginBottom: "1em" }}>
							{idForEdition && idForEdition === todo._id ? (
								<>
									<input
										value={editedValue}
										placeholder="update todo"
										onChange={(e) => setEditedValue(e.target.value)}
									/>
									<button
										type="button"
										onClick={() => {
											if (editedValue.length) {
												updateTodo(todo._id, editedValue);
												setIdForEdition();
											} else {
												alert(
													"You cannot update an empty todo! Type something!"
												);
											}
										}}
									>
										update
									</button>
									<button type="button" onClick={() => setIdForEdition()}>
										cancel
									</button>
								</>
							) : (
								<>
									<span style={{ marginRight: "1em" }}>{todo.todo}</span>
									<button
										type="button"
										onClick={() => setIdForEdition(todo._id)}
									>
										edit
									</button>
								</>
							)}
							<button
								type="button"
								onClick={() => {
									deleteTodo(todo._id);
								}}
							>
								delete
							</button>
						</li>
					))}
			</ul>
		</div>
	);
}
