import logo from "./logo.svg";
import "./App.css";

import Todos from "./components/pages/Todos";
import Footer from "./components/organisms/Footer";

export default function App() {
	return (
		<div className="container">
			<main>
				<Todos />
			</main>
			<Footer />
		</div>
	);
}
