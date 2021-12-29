import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';

function App() {
  const [user, setUser] = useState('');
  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((json) => setUser(json));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello {user.given_name || "Unknown User"}!
        </p>
        <p>
          {user.login &&
            <a className="App-link" href="/auth/logout">Logout</a> ||
            <a className="App-link" href="/auth/login">Login</a>
          }
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
