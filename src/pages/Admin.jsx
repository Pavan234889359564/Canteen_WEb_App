import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Input,
  Select,
  VStack,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

export default function Admin() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState({
    upcoming: [],
    ongoing: [],
    completed: [],
  });
  const [form, setForm] = useState({
    itemName: '',
    cost: '',
    thumbnail: '',
    category: 'Tiffin',
  });

  const MENU_SECTIONS = ['Tiffin', 'Lunch', 'Snacks', 'Dinner', 'Ice Cream', 'Juices'];

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      const menuData = await getDocs(collection(db, 'menu'));
      setMenu(
        menuData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };
    fetchMenu();
  }, []);

  // Fetch orders (upcoming, ongoing, completed)
  useEffect(() => {
    const fetchOrders = async () => {
      const ordersData = await getDocs(collection(db, 'orders'));
      const orders = ordersData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const categorizedOrders = {
        upcoming: orders.filter((order) => order.status === 'Upcoming'),
        ongoing: orders.filter((order) => order.status === 'Ongoing'),
        completed: orders.filter((order) => order.status === 'Completed'),
      };
      setOrders(categorizedOrders);
    };
    fetchOrders();
  }, []);

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add item to menu
  const addItem = async (e) => {
    e.preventDefault();
    if (!form.itemName || !form.cost || !form.thumbnail || !form.category) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      await addDoc(collection(db, 'menu'), {
        itemName: form.itemName,
        cost: Number(form.cost),
        thumbnail: form.thumbnail,
        category: form.category,
        count: 0, // Default count
      });
      alert('Item added successfully!');
      setForm({
        itemName: '',
        cost: '',
        thumbnail: '',
        category: 'Tiffin',
      });
      // Refresh menu items
      const newMenu = await getDocs(collection(db, 'menu'));
      setMenu(
        newMenu.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  // Remove item from menu
  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'menu', id));
      alert('Item removed successfully!');
      // Refresh menu items
      const newMenu = await getDocs(collection(db, 'menu'));
      setMenu(
        newMenu.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  // Handle order actions (Accept, Reject)
  const handleOrderAction = async (id, action) => {
    const newStatus = action === 'accept' ? 'Ongoing' : 'Rejected';
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
      alert(`Order ${action === 'accept' ? 'accepted' : 'rejected'} successfully!`);
      // Refresh orders
      const newOrders = await getDocs(collection(db, 'orders'));
      const updatedOrders = newOrders.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const categorizedOrders = {
        upcoming: updatedOrders.filter((order) => order.status === 'Upcoming'),
        ongoing: updatedOrders.filter((order) => order.status === 'Ongoing'),
        completed: updatedOrders.filter((order) => order.status === 'Completed'),
      };
      setOrders(categorizedOrders);
    } catch (err) {
      console.error('Error processing order:', err);
    }
  };

  return (
    <Box p={5}>
      <Text fontSize="3xl" mb={6}>
        Admin Dashboard
      </Text>

      {/* Form to Add New Menu Item */}
      <VStack spacing={4} mb={8}>
        <Text fontSize="2xl">Add New Menu Item</Text>
        <Input
          placeholder="Item Name"
          name="itemName"
          value={form.itemName}
          onChange={handleFormChange}
        />
        <Input
          placeholder="Price"
          type="number"
          name="cost"
          value={form.cost}
          onChange={handleFormChange}
        />
        <Input
          placeholder="Image URL"
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleFormChange}
        />
        <Select
          name="category"
          value={form.category}
          onChange={handleFormChange}
        >
          {MENU_SECTIONS.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </Select>
        <Button colorScheme="teal" onClick={addItem}>
          Add Item
        </Button>
      </VStack>

      {/* Menu Items List */}
      <Box mb={8}>
        <Text fontSize="2xl" mb={4}>
          Menu Items
        </Text>
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {menu.map((item) => (
            <Box key={item.id} p={4} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">{item.itemName}</Text>
              <Text>{item.category}</Text>
              <Text>Price: ${item.cost}</Text>
              <Button size="sm" mt={2} colorScheme="red" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Orders Dashboard */}
      <Box>
        <Text fontSize="2xl" mb={4}>
          Order Management
        </Text>
        {['upcoming', 'ongoing', 'completed'].map((status) => (
          <Box key={status} mb={6}>
            <Text fontSize="xl">{status[0].toUpperCase() + status.slice(1)} Orders</Text>
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {orders[status].map((order) => (
                <Box key={order.id} p={4} borderWidth="1px" borderRadius="lg">
                  <Text>Order ID: {order.id}</Text>
                  <Text>Status: {order.status}</Text>
                  {status === 'upcoming' && (
                    <HStack mt={2}>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleOrderAction(order.id, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleOrderAction(order.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </HStack>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Box>
    </Box>
  );
}