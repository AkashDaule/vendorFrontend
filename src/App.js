import React, { useState } from 'react';
import AddInventory from './component/add-inventory/AddInventory';
import ListInventory from './component/list-inventory/ListInventory';

function App() {
  const [inventory, setInventory] = useState([
    { itemName: 'Laptop', quantity: 10, price: 50000, category: 'Electronics', _id: '1' },
    { itemName: 'Chair', quantity: 20, price: 1500, category: 'Furniture', _id: '2' },
    { itemName: 'Rice', quantity: 50, price: 40, category: 'Groceries', _id: '3' },
    { itemName: 'T-shirt', quantity: 30, price: 300, category: 'Clothing', _id: '4' },
  ]);

  const [editingItem, setEditingItem] = useState(null); // State for the item being edited

  // Function to add a new item to inventory or update an existing one
  const addNewItem = (newItem) => {
    if (editingItem) {
      // Update item
      setInventory(inventory.map(item => 
        item._id === newItem._id ? newItem : item
      ));
      setEditingItem(null); // Clear editing item after update
    } else {
      // Add new item
      setInventory([...inventory, newItem]);
    }
  };

  const editItem = (item) => {
    setEditingItem(item); // Set the item to be edited
  };

  return (
    <div className="App">
      <AddInventory addNewItem={addNewItem} editingItem={editingItem} />
      <ListInventory inventory={inventory} editItem={editItem} />
    </div>
  );
}

export default App;
