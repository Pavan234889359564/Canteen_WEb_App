import React, { useState, useLayoutEffect, useEffect } from 'react';
import Nav from '../components/Navbar';
import ProfileNavBtn from '../components/buttons/ProfileNavBtn';
import { Box, Text, SimpleGrid, VStack, HStack, Button } from '@chakra-ui/react';
import { db } from '../firebase';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import {
  menu as menuAtom,
  totalAmt as totalAmtAtom,
  cart as cartAtom,
  wallet as walletAtom,
} from '../atoms';
import { useRecoilState } from 'recoil';
import MenuCard from '../components/MenuCard';
import { UserAuth } from '../context/AuthContext';

// Define the menu sections and their timings
const MENU_SECTIONS = {
  Tiffin: '8:00 AM - 12:00 PM',
  Lunch: '12:00 PM - 17:00 PM',
  Snacks: '17:00 PM - 19:00 PM',
  Dinner: '19:00 PM - 21:00 PM',
  'Ice Cream': 'All Day',
  Juices: 'All Day',
};

export default function Profile() {
  const [sWidth, setSWidth] = useState(document.body.clientWidth);
  const [menu, setMenu] = useRecoilState(menuAtom);
  const [totalAmt, setTotalAmt] = useRecoilState(totalAmtAtom);
  const [wallet, setWallet] = useRecoilState(walletAtom);
  const [cart, setCart] = useRecoilState(cartAtom);
  const { user } = UserAuth();

  // State to manage the selected category
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(MENU_SECTIONS)[0]);

  // Handle resizing for responsive UI
  useLayoutEffect(() => {
    function updateSize() {
      setSWidth(document.body.clientWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
  }, []);

  // Set document title
  useEffect(() => {
    document.title = 'Your Menu';
  }, []);

  // Fetch menu items from Firestore and set the menu state
  useEffect(() => {
    getDocs(collection(db, 'menu'))
      .then((data) => {
        const getMenu = [];
        data.forEach((doc) =>
          getMenu.push({
            id: doc.id,
            itemName: doc.get('itemName'),
            cost: doc.get('cost'),
            thumbnail: doc.get('thumbnail'),
            category: doc.get('category'), // Ensure this field is fetched
            count: 0,
          })
        );
        setMenu(getMenu);
      })
      .catch((err) => console.log(err));
  }, []);

  // Fetch the user's wallet details
  useEffect(() => {
    async function fetchWallet() {
      const userData = await getDoc(doc(db, 'users', user.uid));
      return userData.get('wallet');
    }

    fetchWallet()
      .then((data) => setWallet(data))
      .catch((err) => {});
  }, [user]);

  // Increment the cart count and update state
  function incrementCart(id) {
    const newMenu = menu.map((obj) => {
      if (obj.id === id) {
        if (obj.count === 0) setCart((cart) => [...cart, obj]);
        setTotalAmt((amt) => amt + obj.cost);
        return { ...obj, count: obj.count + 1 };
      }
      return obj;
    });
    setMenu(newMenu);
  }

  // Decrement the cart count and update state
  function decrementCart(id) {
    const newMenu = menu.map((obj) => {
      if (obj.id === id && obj.count > 0) {
        setCart((cart) => cart.filter((item) => item.id !== obj.id));
        setTotalAmt((amt) => amt - obj.cost);
        return { ...obj, count: obj.count - 1 };
      }
      return obj;
    });
    setMenu(newMenu);
  }

  return (
    <>
      <Nav
        title={`Welcome, ${user.displayName}`}
        navBtn={<ProfileNavBtn />}
        hasCheckout
      />
      <Box borderBottom="2px" borderBottomColor="gray.700">
        <Text fontSize="3xl" m={4}>
          Menu ({menu.length})
        </Text>
      </Box>

      {/* Render the section selector */}
      <HStack spacing={4} justify="center" marginY={6}>
        {Object.keys(MENU_SECTIONS).map((section) => (
          <Button
            key={section}
            onClick={() => setSelectedCategory(section)}
            colorScheme={selectedCategory === section ? 'teal' : 'gray'}
            size="lg"
          >
            {section}
          </Button>
        ))}
      </HStack>

      {/* Dynamically render the selected menu section */}
      <VStack align="start" spacing={4} m={5}>
        <Text fontSize="2xl" fontWeight="bold">
          {selectedCategory} ({MENU_SECTIONS[selectedCategory]})
        </Text>
        <SimpleGrid
          columns={sWidth >= 768 ? (sWidth >= 1024 ? 3 : 2) : 1}
          spacing={6}
          w="100%"
        >
          {menu
            .filter((item) => item.category === selectedCategory) // Filter items by selected category
            .map((item, index) => (
              <MenuCard
                key={index}
                item={item}
                forCart
                incrementCart={incrementCart}
                decrementCart={decrementCart}
              />
            ))}
        </SimpleGrid>
      </VStack>
    </>
  );
}