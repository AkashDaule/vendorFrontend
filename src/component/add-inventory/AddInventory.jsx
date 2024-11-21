import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import Swal
import './AddInventory.css';

function AddInventory({ addNewItem, editingItem }) {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    price: '',
    category: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem); // Populate form fields with data of the item being edited
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;

      if (editingItem) {
        // Use editingItem._id for updating
        response = await axios.patch(
          `http://localhost:3001/inventory/update/${editingItem._id}`,
          formData
        );
      } else {
        response = await axios.post(
          'http://localhost:3001/inventory/add',
          formData
        );
      }

      if (response.data.status) {
        addNewItem(response.data.data); // Add or update the inventory item
        setFormData({ itemName: '', quantity: '', price: '', category: '' });
        // Success message using Swal
        Swal.fire({
          icon: 'success',
          title: response.data.message || 'Item added/updated successfully!',
          showConfirmButton: true,
        });
      } else {
        setError(response.data.message || 'Failed to add/update inventory');
        // Error message using Swal
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message || 'Failed to add/update inventory.',
        });
      }
    } catch (err) {
      console.error('Error adding/updating inventory:', err);
      setError('An error occurred while adding/updating inventory.');
      // Error message using Swal
      Swal.fire({
        icon: 'error',
        title: 'An error occurred',
        text: 'There was an issue adding/updating the inventory item.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-inventory-container container mt-5">
      <h2 className="text-center mb-4">{editingItem ? 'Edit Inventory' : 'Add Inventory'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="inventory-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label htmlFor="itemName" className="form-label">Item Name</label>
            <input
              type="text"
              className="form-control"
              id="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="0"
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              id="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="groceries">Groceries</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-10 mt-3"
          disabled={loading}
        >
          {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
        </button>
      </form>
    </div>
  );
}

export default AddInventory;
