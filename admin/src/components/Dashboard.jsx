// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../context/firebase'; // Import your Firestore configuration

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const ordersFromFirebase = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersFromFirebase);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle Accept Order (updates the status in Firestore)
  const handleAccept = async (orderId) => {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { status: 'in-progress' });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'in-progress' } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Function to handle Reject Order (deletes the order from Firestore)
  const handleReject = async (orderId) => {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await deleteDoc(orderDocRef);

      // Update local state
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Upcoming Orders */}
      <section>
        <h2>Upcoming Orders</h2>
        {orders
          .filter((order) => order.status === 'upcoming')
          .map((order) => (
            <div key={order.id}>
              <p>{order.name}</p>
              <button onClick={() => handleAccept(order.id)}>Accept</button>
              <button onClick={() => handleReject(order.id)}>Reject</button>
            </div>
          ))}
      </section>

      {/* In-Progress Orders */}
      <section>
        <h2>Orders Currently In Progress</h2>
        {orders
          .filter((order) => order.status === 'in-progress')
          .map((order) => (
            <div key={order.id}>
              <p>{order.name}</p>
              <button onClick={() => handleReject(order.id)}>Reject</button>
            </div>
          ))}
      </section>

      {/* Completed Orders */}
      <section>
        <h2>Completed Orders</h2>
        {orders
          .filter((order) => order.status === 'completed')
          .map((order) => (
            <div key={order.id}>
              <p>{order.name}</p>
            </div>
          ))}
      </section>
    </div>
  );
};

export default Dashboard;