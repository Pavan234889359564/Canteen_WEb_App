import {
  Text,
  Flex,
  Heading,
  Stack,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  ModalBody,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import GoogleAuthBtn from '../components/buttons/GoogleAuth';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

export default function Auth() {
  const { googleSignIn, user, signInWithEmailAndPassword } = UserAuth();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Sign In | ScanToEat';
  });

  useEffect(() => {
    if (user != null) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      logEvent(analytics, 'login', { method: 'Google' });
    } catch (error) {
      onOpen();
    }
  };

  const handleEmailPasswordLogin = async () => {
    try {
      setError('');
      await signInWithEmailAndPassword(email, password);
      logEvent(analytics, 'login', { method: 'Email & Password' });
    } catch (error) {
      setError('Failed to sign in. Please check your credentials or try again.');
      onOpen();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Failed to Sign In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{error || 'An error occurred during login.'}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={4} w={'full'} maxW={'md'} align={'center'}>
            <Heading fontSize={'3xl'}>Sign in to ScanToEat account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Use your{' '}
              <Text as="span" color="blue.600">
                <a
                  href="https://siesgst.edu.in/"
                  target="_blank"
                  rel="noreferrer"
                >
                  SIES
                </a>
              </Text>{' '}
              google account or your email credentials to login!
            </Text>
            <GoogleAuthBtn onClick={handleGoogleSignIn} />
            <Text>or</Text>
            <FormControl id="email">
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              width="full"
              onClick={handleEmailPasswordLogin}
            >
              Login
            </Button>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={
              'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
            }
          />
        </Flex>
      </Stack>
    </>
  );
}