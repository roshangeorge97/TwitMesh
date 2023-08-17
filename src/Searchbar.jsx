import React, { useState,useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { create } from 'ipfs-http-client';
import Web3 from 'web3'
import IPFSHashStorageABI from './artifacts/IPFSHashStorage.json';

function Searchbar() {
    const[content,setContent] = useState("");
    const address = useAccount();
    const [tweet,setMED] = useState();
    const [TWT, setTWT] = useState([]);
    const [datas, setDatas] = useState([]);
    const [client, setClient] = useState();
    const [count, setCount] = useState();
    
    
     useEffect(() => {
           
         loadWeb3();
         loadBlockchaindata();
         loadCount();
         
     }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [SupplyChain, setSupplyChain] = useState();
    const [Hash, setHash] = useState("");
    var i;
    // const [MedName, setMedName] = useState();
    // const [MedStage, setMedStage] = useState();
    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
        const client = create({ url:"/ip4/127.0.0.1/tcp/5002/http"});
        setClient(client);
    };



    const loadBlockchaindata = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentaccount(account);
        
        const networkId = await web3.eth.net.getId();
        const networkData = IPFSHashStorageABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(IPFSHashStorageABI.abi, networkData.address);
            setSupplyChain(supplychain);
            console.log("Loaded Blochchain Data")
           
                  
           
                      
            // var i;
            // const medCtr = await supplychain.methods.setIPFSHash.call();
            // const medStage = [];
           
            // console.log(med);
            // setMedStage(medStage);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
        
    }  
   

    const show = async (e) => {
        e.preventDefault();
        var timestamp = new Date();
        console.log(timestamp);
        console.log(content);
        console.log(address.address)
        var data = {
            timestamp: timestamp,
            content: content,
            address: address.address
          };
          var json = JSON.stringify(data);
  
  // log the JSON string to the console
  console.log(json);
  const client = create({ url:"/ip4/127.0.0.1/tcp/5002/http"});
  const { cid } = await client.add(json);
  console.log(cid);
  const hashedstring = cid.toString();
  console.log(hashedstring);
  try {
    const receipt = await SupplyChain.methods.setIPFSHash(hashedstring).send({ from: currentaccount });
    if (receipt) {
      setTimeout(async () => {
        await loadCount(); // wait for the delay before calling loadCount()
        await loadBlockchaindata(); 
      }, 10000); // wait for 5 seconds (adjust as needed)
    }
  } catch (err) {
    alert("An error occurred!!!");
  }
        
      
       
    }

    async function loadCount(){
        let count = await SupplyChain.methods.count().call();
        setCount(count);
        console.log(count)
        const tweets = [];
            const newData = [];
            for (i = 0; i < count; i++) {
                var i;
                tweets[i] = await SupplyChain.methods.getIPFSHash(i).call();
                console.log(tweets[i])
                const chunks = await client.cat(tweets[i]);
                    for await (const chunk of chunks) {
                      newData.push(JSON.parse(Buffer.from(chunk).toString()));
                    }
                    setDatas(newData);
            }
            setTWT(tweets)
    }

    return(
        <div className='justify-center'>
<link rel="stylesheet" href="https://unpkg.com/flowbite@1.4.4/dist/flowbite.min.css" />
<div className='flex'>
    <div><h3>Decetralized Twitter</h3></div>
    <div> <ConnectButton/></div>
</div>
<div className="max-w-2xl mx-auto">

	<form>   
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
        <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <div className="container">
      {datas && datas.map((item, index) => (
        <div key={index} className="box">
          <h2 className="title text-2xl font-bold">{item.content}</h2>
          <p className="author text-sm">{item.address}</p>
          <p className="timestamp text-sm">{item.timestamp}</p>
        </div>
      ))}
    </div>
            
            <input type="search" id="default-search" className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="What's Happening?!" required
             value={content} onChange={(e)=>setContent(e.target.value)}/>
            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={show}>Tweet</button>
            
        </div>
    </form>
    <script src="https://unpkg.com/flowbite@1.4.0/dist/flowbite.js"></script>
</div>
        </div>
    )
}

export default Searchbar;