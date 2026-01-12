import './App.css'
import { useState } from 'react';

function App() {
  const [items, setitems] = useState([]);

  async function fetchItems() {
    try {
      const response = await fetch('http://localhost:8000/items');
      const data = await response.json();
      setitems(data.item);
     
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  return (
    <>
      <h1>Financial Transaction Platform</h1>
      <button onClick={fetchItems}>click me</button>

      <div>
        {items.map((item, index) => (
          <li key={index}>
            <ul>{item.name}</ul>
            <ul>{item.price}</ul>
          </li>
        ))}
      </div>
    </>
  );
}

export default App;
