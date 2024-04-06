import axios from 'axios';

const BASE_URI = "https://thentic.tech/api";
const API_KEY = process.env.REACT_APP_THETIC_KEY;
const CHAIN = 7;
const useTheticApi = () => {    
    const createContract = async (postData) => {
        try {
            const res = await axios.post(`${BASE_URI}/nfts/contract`,{
                key: API_KEY,
                chain_id: CHAIN,
                ...postData
            })
            if(res.status === 200) {
                if(res.data && res.data.request_id){
                    return res.data.transaction_url
                }
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    const transferNFT = async (postData) => {
        try {
            const res = await axios.post(`${BASE_URI}/nfts/transfer`,{
                key: API_KEY,
                chain_id: CHAIN,
                ...postData
            })
            if(res.status === 200) {
                if(res.data && res.data.request_id){
                    return res.data.transaction_url
                }
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    const mintForContract = async (postData) => {
        try {
            const res = await axios.post(`${BASE_URI}/nfts/mint`,{
                key: API_KEY,
                chain_id: CHAIN,
                ...postData
            })
            if(res.status === 200) {
                if(res.data && res.data.request_id){
                    return res.data.transaction_url
                }
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    const fetchContract = async (chainId=CHAIN) => {
        try {
            const res = await axios.get(`${BASE_URI}/contracts`,{
                params:{
                    key: API_KEY,
                    chain_id: chainId
                }
            })
            if(res.data && res.data.contracts){
                return res.data.contracts;
            }
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    const fetchNFTS = async (chainId=CHAIN) => {
        try {
            const res = await axios.get(`${BASE_URI}/nfts`,{
                params:{
                    key: API_KEY,
                    chain_id: chainId
                }
            })
            if(res.data && res.data.nfts){
                return res.data.nfts;
            }
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    return {
        createContract,
        fetchContract,
        fetchNFTS,
        mintForContract,
        transferNFT
    }
};

export default useTheticApi;