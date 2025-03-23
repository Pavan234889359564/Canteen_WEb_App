import React, { useState, useLayoutEffect, useEffect } from 'react';
import Nav from '../components/Navbar';
import ProfileNavBtn from '../components/buttons/ProfileNavBtn';
import { Box, Text, SimpleGrid, VStack } from '@chakra-ui/react';
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
};

export default function Profile() {
  const [sWidth, setSWidth] = useState(document.body.clientWidth);
  const [menu, setMenu] = useRecoilState(menuAtom);
  const [totalAmt, setTotalAmt] = useRecoilState(totalAmtAtom);
  const [wallet, setWallet] = useRecoilState(walletAtom);
  const [cart, setCart] = useRecoilState(cartAtom);
  const { user } = UserAuth();

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
            category: doc.get('category'), // ensure this field is fetched
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

      {/* Dynamically render each menu section */}
      {Object.entries(MENU_SECTIONS).map(([category, timing]) => (
        <VStack key={category} align="start" spacing={4} m={5}>
          <Text fontSize="2xl" fontWeight="bold">
            {category} ({timing})
          </Text>
          <SimpleGrid
            columns={sWidth >= 768 ? (sWidth >= 1024 ? 3 : 2) : 1}
            spacing={6}
            w="100%"
          >
            {menu
              .filter((item) => item.category === category) // Filter items by category
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
      ))}
    </>
  );
}