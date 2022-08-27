import {
    Box,
    Button,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    useColorModeValue
  } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaFileContract } from 'react-icons/fa';
import useTheticApi from '../hooks/useTheticApi';
import { useMetaMaskAccount } from '../context/AccountContext';

  function StatsCard(props) {
    const { connectedAddr, connected } = useMetaMaskAccount();
    const {mintForContract} = useTheticApi();
    const { title, stat, icon, contractInfo } = props;

    const [minting, setMinting] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [pendingTransition, setPendingTransaction] = useState(null);

    const mintNow = async (contractAddr) => {
        if(connectedAddr == "") return;
        setMinting(true)
        const transactionURL = await mintForContract({
            to: connectedAddr,
            contract:contractAddr,
            nft_id: Math.floor(Math.random() * 90 + 10),
            nft_data: "https://ipfs.io/ipfs/QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDzJrqDR23Y8YSkebLU",
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
      <Stat
        px={{ base: 2, md: 4 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'lg'}>
        <Flex justifyContent={'space-between'}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontWeight={'medium'} isTruncated>
              {title}
            </StatLabel>
            <StatNumber fontSize={'small'} fontWeight={'medium'}>
              {stat}
            </StatNumber>
            {(pendingTransition !== null)?
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
            :
                (connected) &&
                <Button
                    size="sm"
                    colorScheme="blue"
                    mt={4}
                    mb={4}
                    onClick={() => {mintNow(contractInfo.contract)}}
                    isLoading={minting}
                >
                    Create/Mint NFT
                </Button>
                
            }
           
          </Box>
          <Box
            my={'auto'}
            color={useColorModeValue('gray.800', 'gray.200')}
            alignContent={'center'}>
            {icon}
          </Box>
        </Flex>
      </Stat>
    );
  }
  
  export default function AllCollections({onOpen}) {
    const { connectedAddr, connected } = useMetaMaskAccount();
    const [contracts, setContracts] = useState([]);
    const {fetchContract} = useTheticApi();
    const fetchNewContracts = async () => {
        if(connectedAddr==="") return;
        const allContracts = await fetchContract();
        setContracts(allContracts);
    }


    useEffect(() => {
        if(connectedAddr==="") return;
        let fetch = true;
        (async() => {
          const allContracts = await fetchContract();
          if(fetch){
            setContracts(allContracts);
          }
        })()
        return () => {
          fetch = false;
        }
      },[connectedAddr])


    return (
      <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        {connected && 
            <>
                <Button
                size="sm"
                colorScheme="blue"
                mt={4}
                mr={4}
                mb={4}
                onClick={onOpen}
                >
                Create new contract
                </Button>
                <Button
                size="sm"
                colorScheme="blue"
                mt={4}
                mb={4}
                onClick={fetchNewContracts}
                >
                Fetch Contracts
                </Button>
            </>
        }
           
            <Text fontSize='xl' mb={3}>
                All Contracts [Note: After creating new contract,It may take few minutes to show up in the listing ⏱️]
            </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
          {(contracts.length) ?
            contracts.map((contract, idx) =>{
                if(contract.status === "success"){
                   return (
                    <StatsCard 
                        contractInfo={contract}
                        key={contract.contract}
                        title={`${contract.name} - ${contract.short_name}`}
                        stat={contract.contract}
                        icon={<FaFileContract size={'3em'} />}
                    />
                   )
                }
            })
            :
            <>No contracts found, Create new contract</>
          }
        </SimpleGrid>
        
      </Box>
    );
  }