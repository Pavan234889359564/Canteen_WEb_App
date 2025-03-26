import { Box, Heading, Text } from '@chakra-ui/react';

export default function OrderConfirmation() {
  return (
    <Box maxW="600px" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" shadow="md">
      <Heading mb={6} textAlign="center">Order Confirmation</Heading>
      <Text fontSize="lg">
        Thank you for your order! Your order has been successfully placed. You will receive a confirmation email shortly.
      </Text>
    </Box>
  );
}