import React, { useState } from "react";

import NavBar from "./components/NavBar";
import { Button, Container, FormControl, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import AllCollections from "./components/AllCollections";
import NFTS from "./components/NFTS";
import useTheticApi from "./hooks/useTheticApi";
import { useMetaMaskAccount } from "./context/AccountContext";
function App() {
  const { connectedAddr } = useMetaMaskAccount();
  const [creating, setCreating] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const [pendingTransition, setPendingTransaction] = useState(null);

  const {createContract} = useTheticApi();

  const createNewContract = async () => {
      if(name == "" || shortName=="" || connectedAddr == "") return;
      setCreating(true);
      const transactionURL = await createContract({
        name: name,
        short_name:shortName,
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
    <Container  maxW={'10xl'}>
      <NavBar />
      <Grid
        h='200px'
        templateRows='repeat(2, 1fr)'
        templateColumns='repeat(5, 1fr)'
        gap={4}
      >
        
        <GridItem colSpan={5} >
          <AllCollections onOpen={onOpen}/>
        </GridItem>
        <GridItem colSpan={5} >
          <NFTS/>
        </GridItem>
      </Grid>

      {/* Modal for new contract creation */}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
        {pendingTransition !== null ? 
            <ModalHeader>Click to initiate transaction</ModalHeader>
          :
          <>
            <ModalHeader>Create NFT Contract</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Contract Name</FormLabel>
                <Input ref={initialRef} placeholder='Some Cool Name' value={name} onChange={(e)=>{setName(e.target.value)}}/>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Short Name</FormLabel>
                <Input placeholder='Some Short Name' value={shortName} onChange={(e)=>{setShortName(e.target.value)}}/>
              </FormControl>
            </ModalBody>
          </>
        }
          <ModalFooter>
            {pendingTransition !== null ? 
              <Button colorScheme='blue' mr={3} onClick={executeTxn} isLoading={executing}>
                Execute Transaction
              </Button>
              :
              <>
              <Button colorScheme='blue' mr={3} onClick={createNewContract} isLoading={creating}>
                Create
              </Button>
              <Button onClick={onClose}>Cancel</Button>
              </>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default App;
