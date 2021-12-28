import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';

function App() {
  const [users, setUsers] = useState('');
  useEffect(() => {
    fetch('/users/')
      .then((res) => res.text())
      .then((text) => setUsers(text));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello {users}!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
