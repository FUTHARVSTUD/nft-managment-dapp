import React,{useState} from 'react';
import {
    Button,
    Center,
    Flex,
    FormControl,
    Heading,
    Image,
    Input,
    Link,
    Stack,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
import { useMetaMaskAccount } from '../context/AccountContext';
import useTheticApi from '../hooks/useTheticApi';
  
  export default function NFT({ndata}) {
    const { connectedAddr, connected } = useMetaMaskAccount();
    const {transferNFT} = useTheticApi();
    const [transferring, setTransferring] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [pendingTransition, setPendingTransaction] = useState(null);

    const initialRef = React.useRef(null)
    const [transferAddress, setTransferAddress] = useState('');

    const transferNow = async (contractAddr, nftId) => {
        if(connectedAddr === "" || transferAddress==="") return;
        setTransferring(true)
        const transactionURL = await transferNFT({
            to: transferAddress,
            contract:contractAddr,
            nft_id: nftId,
            from: connectedAddr,
            redirect_url: process.env.REACT_APP_DAPP_URL
          });
          if(transactionURL !== null) {
            setPendingTransaction(transactionURL);
          }
    }

    const executeTxn = () =>{
        if(!pendingTransition) return;
        setExecuting(true);
        window.open(pendingTransition,'_blank')
      }

    return (
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: '100%', md: '540px' }}
          height={{ sm: '476px', md: '20rem' }}
          direction={{ base: 'column', md: 'row' }}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          padding={4}>
          <Flex flex={1} bg="blue.200">
            <Image
              objectFit="cover"
              boxSize="100%"
              src={
                ndata.data
              }
            />
          </Flex>
          <Stack
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={1}
            pt={2}>
            <Heading fontSize={'2xl'} fontFamily={'body'}>
              Contract Name: {ndata.name}
            </Heading>
            <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
              #{ndata.id}
            </Text>
            <Text
              textAlign={'center'}
              color={useColorModeValue('gray.700', 'gray.400')}
              px={3}>
              Cute Puppy
            </Text>
            <Text fontSize="xs">Owner</Text>
            <Text fontSize="xs">{`${ndata.owner.slice(0, 4)}...${ndata.owner.slice(38)}`}</Text>
            <Stack
              width={'100%'}
              mt={'2rem'}
              direction={'row'}
              padding={2}
              justifyContent={'space-between'}
              alignItems={'center'}>
                {((connected) && (connectedAddr.toLowerCase() === ndata.owner.toLowerCase())) ?

                 (pendingTransition == null)?
                    <FormControl>
                        <Input ref={initialRef} placeholder='To Address' size='xs' value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)}/>
                        <Button
                            mt={3}
                            flex={1}
                            fontSize={'xs'}
                            bg={'blue.400'}
                            color={'white'}
                            boxShadow={
                            '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                            }
                            _hover={{
                            bg: 'blue.500',
                            }}
                            _focus={{
                            bg: 'blue.500',
                            }} onClick={()=>{transferNow(ndata.contract, ndata.id)}} isLoading={transferring}>
                            Transfer
                        </Button>
                    </FormControl>
                    :
                            <Button
                            size="sm"
                            colorScheme="red"
                            mt={4}
                            mb={4}
                            onClick={executeTxn}
                            isLoading={executing}
                        >
                            Execute Transaction to mint
                        </Button>
                    : <></>
                }
            </Stack>
          </Stack>
        </Stack>
      </Center>
    );
  }