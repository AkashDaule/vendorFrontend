import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListInventory.css';
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';

function ListInventory({ editItem }) {
  const [inventory, setInventory] = useState([]); // State to hold fetched inventory data
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search input

  // Fetch data from the backend
  useEffect(() => {
    axios
      .get('http://localhost:3001/inventory')
      .then((response) => {
        if (response.data.status) {
          setInventory(response.data.data); // Update state with fetched data
        } else {
          console.error('Error fetching inventory:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching inventory:', error);
      });
  }, []); // Empty dependency array ensures it runs once when the component mounts

  // Handle delete with confirmation
  const handleDelete = (itemId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed to delete if confirmed
        axios.delete(`http://localhost:3001/inventory/delete/${itemId}`)
          .then((response) => {
            if (response.data.status) {
              setInventory(inventory.filter(item => item._id !== itemId)); // Remove deleted item from local state
              Swal.fire('Deleted!', response.data.message, 'success');
            } else {
              Swal.fire('Error!', 'There was an issue deleting the item.', 'error');
            }
          })
          .catch((error) => {
            console.error('Error deleting inventory:', error);
            Swal.fire('Error!', 'There was an issue deleting the item.', 'error');
          });
      }
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item => 
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="list-inventory-container container mt-5">
      <h2 className="text-center mb-4">Inventory List</h2>

      {/* Search Input Field and Button */}
      <div className="d-flex justify-content-end mb-3">
        <div className="d-flex">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by item name or category"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button 
            className="btn btn-primary ms-2"
            onClick={() => { /* optional logic for search button click */ }}
          >
            Search
          </button>
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>
                  {/* Action Icons */}
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => editItem(item)} // Trigger edit functionality
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item._id)} // Trigger delete confirmation
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No items found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListInventory;
