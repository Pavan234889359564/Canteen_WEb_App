import {
  Box,
  Button,
  Divider,
  Heading,
  Text,
  useToast,
  Input,
  FormControl,
  FormLabel,
  Select,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import QRCode from 'react-qr-code'; // Import the QR code library
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import { cart as cartAtom, totalAmt as totalAmtAtom } from '../atoms'; // your cart atoms

export default function Payment() {
  const cartItems = useRecoilValue(cartAtom);
  const totalAmount = useRecoilValue(totalAmtAtom);
  const navigate = useNavigate();
  const toast = useToast();

  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: '',
  });
  const [paymentDetails, setPaymentDetails] = useState({}); // Fields for different payment options
  const [isProceeding, setIsProceeding] = useState(false);
  const [upiQRVisible, setUpiQRVisible] = useState(false); // State to track QR code visibility
  const [upiDetails, setUpiDetails] = useState({}); // State to store UPI QR data

  const handleInputChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentInputChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

    const generateUPIQRCode = () => {
    const upiPaymentString = `upi://pay?pa=Durga Amrita-upi-id@bank&pn=DURGA AMRITA SELF HE&am=${totalAmount}&cu=INR`;
    setUpiDetails({
      upiString: upiPaymentString,
      upiId: 'Durga Amrita-upi-id@bank',
      upiName: 'DURGA AMRITA SELF HE',
    });
    setUpiQRVisible(true);
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add items before proceeding to payment.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProceeding(true);
  };

  const handlePlaceOrder = async () => {
    if (
      !billingDetails.name ||
      !billingDetails.email ||
      !billingDetails.address ||
      !billingDetails.paymentMethod
    ) {
      toast({
        title: 'Incomplete Billing Details',
        description: 'Please fill in all the required fields to proceed.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate payment-specific fields
    if (billingDetails.paymentMethod === 'Credit/Debit Card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cvv || !paymentDetails.expiryMonth || !paymentDetails.expiryYear) {
        toast({
          title: 'Incomplete Payment Details',
          description: 'Please fill all card details to proceed.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } else if (billingDetails.paymentMethod === 'Net Banking') {
      if (!paymentDetails.bankName || !paymentDetails.accountNumber) {
        toast({
          title: 'Incomplete Payment Details',
          description: 'Please fill all bank details to proceed.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    const orderData = {
      items: cartItems,
      total: totalAmount,
      billingDetails,
      paymentDetails,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log('Order placed with ID:', docRef.id);

      toast({
        title: 'Order Placed!',
        description: `Your order has been placed successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/order-confirmation'); // Redirect to order confirmation page
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to place order. Try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" shadow="md">
      <Heading mb={6} textAlign="center">Checkout</Heading>

      {isProceeding ? (
        <>
          <Heading fontSize="lg" mb={4}>Billing Details</Heading>
          <FormControl id="name" mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter your name"
              name="name"
              value={billingDetails.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="email" mb={4} isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              placeholder="Enter your email"
              name="email"
              type="email"
              value={billingDetails.email}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="address" mb={4} isRequired>
            <FormLabel>Billing Address</FormLabel>
            <Input
              placeholder="Enter your billing address"
              name="address"
              value={billingDetails.address}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="paymentMethod" mb={4} isRequired>
            <FormLabel>Payment Method</FormLabel>
            <Select
              placeholder="Select Payment Method"
              name="paymentMethod"
              value={billingDetails.paymentMethod}
              onChange={handleInputChange}
              onBlur={generateUPIQRCode} // Only show for UPI
            >
              <option value="Credit/Debit Card">Credit/Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </Select>
          </FormControl>

          {/* Payment-Specific Fields */}
          {billingDetails.paymentMethod === 'Credit/Debit Card' && (
            <>
              <FormControl id="cardNumber" mb={4} isRequired>
                <FormLabel>Card Number</FormLabel>
                <Input
                  placeholder="Enter your card number"
                  name="cardNumber"
                  value={paymentDetails.cardNumber || ''}
                  onChange={handlePaymentInputChange}
                />
              </FormControl>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl id="expiryMonth" isRequired>
                  <FormLabel>Expiry Month</FormLabel>
                  <Input
                    placeholder="MM"
                    name="expiryMonth"
                    value={paymentDetails.expiryMonth || ''}
                    onChange={handlePaymentInputChange}
                  />
                </FormControl>
                <FormControl id="expiryYear" isRequired>
                  <FormLabel>Expiry Year</FormLabel>
                  <Input
                    placeholder="YYYY"
                    name="expiryYear"
                    value={paymentDetails.expiryYear || ''}
                    onChange={handlePaymentInputChange}
                  />
                </FormControl>
              </Grid>
              <FormControl id="cvv" mb={4} isRequired>
                <FormLabel>CVV</FormLabel>
                <Input
                  placeholder="CVV"
                  name="cvv"
                  type="password"
                  value={paymentDetails.cvv || ''}
                  onChange={handlePaymentInputChange}
                />
              </FormControl>
            </>
          )}

          {billingDetails.paymentMethod === 'Net Banking' && (
            <>
              <FormControl id="bankName" mb={4} isRequired>
                <FormLabel>Bank Name</FormLabel>
                <Input
                  placeholder="Enter your bank name"
                  name="bankName"
                  value={paymentDetails.bankName || ''}
                  onChange={handlePaymentInputChange}
                />
              </FormControl>
              <FormControl id="accountNumber" mb={4} isRequired>
                <FormLabel>Account Number</FormLabel>
                <Input
                  placeholder="Enter your account number"
                  name="accountNumber"
                  value={paymentDetails.accountNumber || ''}
                  onChange={handlePaymentInputChange}
                />
              </FormControl>
            </>
          )}

          {billingDetails.paymentMethod === 'UPI' && upiQRVisible && (
            <Box textAlign="center" my={4}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <QRCode value={upiDetails.upiString} size={200} />
                </GridItem>
                <GridItem>
                  <Text mb={2}>UPI ID: {upiDetails.upiId}</Text>
                  <Text>Name: {upiDetails.upiName}</Text>
                  <Text>Amount: ₹{totalAmount}</Text>
                </GridItem>
              </Grid>
            </Box>
          )}

          <Button colorScheme="blue" width="100%" mt={4} onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </>
      ) : (
        <>
          <Heading fontSize="lg" mb={4}>Your Order</Heading>
          <Box mb={4}>
            {cartItems.map((item, index) => (
              <Text key={index}>
                {item.itemName} x{item.count} — ₹{item.cost * item.count}
              </Text>
            ))}
            <Divider my={2} />
            <Text>Subtotal: ₹{totalAmount}</Text>
            <Text fontWeight="bold">Total: ₹{totalAmount}</Text>
          </Box>

          <Button colorScheme="blue" width="100%" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </>
      )}
    </Box>
  );
}