import {
    Box,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
  } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import useTheticApi from '../hooks/useTheticApi';
import NFT from './NFT';

const CONTRACT_ABI =  JSON.parse(`[
  {
      "inputs": [],
      "name": "owner",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "tokenURI",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
]`);

  function StatsCard(props) {
    const { title, stat, icon } = props;
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
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
              {stat}
            </StatNumber>
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
  
  export default function NFTS() {
    const [nfts, setNfts] = useState([]);
    const {fetchNFTS} = useTheticApi();

    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER_URL)


    useEffect(() => {
      let fetch = true;
      (async() => {
        let allNFTS = []

        const result = await fetchNFTS();

        if(fetch){
          if(result.length){
            const promises = result.filter(r => r.status==="success").map(async(nft,idx) => {
              let owner = null;
              //let tokenURI = null;
              let contract = new ethers.Contract(nft.contract, CONTRACT_ABI, provider)
              owner = await contract.owner();
              //tokenURI = await contract.tokenURI(nft.id);
              allNFTS.push({
                ...nft,
                owner
              })
            });
            await Promise.all(promises)
          }
          setNfts(allNFTS);
        }
      })()
      return () => {
        fetch = false;
      }
    },[])

    return (
      <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
          
          {nfts.length ?
            nfts.map((n, idx) => (
              <NFT ndata={n} key={idx}/>
            ))
          :<>No NFTS Found, Create Contract And Mint 😉</>}
        </SimpleGrid>
      </Box>
    );
  }