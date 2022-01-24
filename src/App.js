import './App.css';
import { useState, useEffect } from 'react';
import { API, API2 } from './api/API.js'
import CarparkView from './components/CarparkView';
/*
  This app needs to fetch API data from 2 separate resources to populate 2 state
  lists, API (carParkList) and API2 (addressList). Therefore, we must use 2 
  useEffect hooks with different conditionals to ensure that both data lists 
  data are availble before rendering the component. 
*/

function App() {
  const [carparkList, setCarparkList] = useState([]);   // Store carpark availability list
  const [addressList, setAddressList] = useState([]);   // Store carpark addresses
  const [isLoading, setIsLoading] = useState(false);    // check if api is loading to display progress bar

  // Get carpark availbility data from API
  const apiGetAvailability = async () => {
    setIsLoading(true)
    const { status, data } = await API.get('transport/carpark-availability');
    setIsLoading(false)
    if (status === 200) {
      const itemList = [];
      for (const d of data.items[0].carpark_data) {
        const item = {
          id: d.carpark_number,
          total: d.carpark_info[0].total_lots,
          available: d.carpark_info[0].lots_available,
          updated: d.update_datetime.split('T').join(' '),
          address: await getAddress(d.carpark_number)
        }
        itemList.push(item);
      }  
      setCarparkList(itemList);
    }
    console.log('API.get completed!', carparkList);
  }
  
  // Get carpark addresses data from API2
  const apiGetAddress = async () => {
    // Create query string for API2
    const endpoint = `api/action/datastore_search`;
    const limit = `limit=3000`;
    const query = `${endpoint}?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&${limit}`;
    console.log('API query2:', query);
    try {
      setIsLoading(true);
      const { status, data } = await API2.get(query);
      setIsLoading(false);
      if (status === 200) {
        const list = [];
        for (const r of data.result.records) {
          const item = {
            'id': r.car_park_no,
            'address': r.address,
          }
          list.push(item);
        }
        setAddressList(list);
      }
    } catch(error) {
      console.log(error);
    }
  }
  // Find address with carpark ID
  const getAddress = id => {
    const obj = addressList.find(item => item.id === id);
    return obj ? obj.address : 'n/a';
  }

  const handleRefresh = async () => {
    apiGetAvailability();
  }
  
  // Load car park address on mount
  useEffect( () => {
    apiGetAddress();
  }, [])

  // Load/refresh availability data when address list is updated
  // The 2nd [addressList] argument ensures that carparkList will
  // get matching the addresses once it's available
  useEffect( () => {
    apiGetAvailability();
  }, [addressList]) 
  
  return (
    <div className="App container">
      <h1>Assignment 2.12: React and Axios</h1>
      <hr />
      <h2>HDB Carpark Availability</h2>
      <button type="submit" onClick={handleRefresh}>Refresh</button>
      { isLoading ? <div className='pull-right'>Loading data: <progress /></div> : null }
      <p />
      <CarparkView carparkList={carparkList} />
    </div>
  );
}

export default App;
