// src/components/MenuManagement.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../context/firebase'; // Import Firestore config

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch menu items from Firestore on component load
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'menuItems'));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Add a new menu item to Firestore
  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!itemName || !price || !category || !image) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const newItem = {
        name: itemName,
        price: parseFloat(price),
        category,
        image,
      };

      const docRef = await addDoc(collection(db, 'menuItems'), newItem);
      setMenuItems((prevItems) => [...prevItems, { id: docRef.id, ...newItem }]);

      // Clear inputs
      setItemName('');
      setPrice('');
      setCategory('');
      setImage('');
    } catch (error) {
      console.error('Error adding menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove a menu item from Firestore
  const handleRemoveItem = async (itemId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'menuItems', itemId));
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error removing menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Menu Management</h1>

      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      <h2>Menu List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <p>
                {item.name} - ${item.price} ({item.category})
              </p>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '50px', height: '50px' }}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuManagement;