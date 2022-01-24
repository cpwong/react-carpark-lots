import React, { useState, useEffect } from 'react';
import { uniqueId } from 'lodash';

export default function CarparkView(props) {
  const { carparkList } = props;
  const [filterStr, setFilterStr] = useState('');
  
  // Handler for address search
  const handleInput = e => {
    const str = e.target.value;
    console.log(str);
    setFilterStr(str);
  }
  // Handler to clear address search field
  const handleClear = e => {
    setFilterStr('');
  }

  // Filter carpark list according to address
  const filteredList = carparkList.filter( item => item.address.includes(filterStr.toUpperCase()));
 
  return(
    <div className='CarparkView'>
      <label>Search Address</label>
      <div className='grouped'>
        <input type='text' placeholder='Type here to start search' value={filterStr} onChange={handleInput}/>
        <button className='button' onClick={handleClear}>Clear</button>
      </div>
      <table className='striped'>
        <thead>
          <tr>
            <th>Carpark Number</th>
            <th>Address</th>
            <th>Total Lots</th>
            <th>Available</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {     
            filteredList.length > 0
            ? filteredList.map(item => 
                <tr key={ uniqueId() }>
                  <td>{item.id}</td>
                  <td>{item.address}</td>
                  <td>{item.total}</td>
                  <td>{item.available}</td>
                  <td>{item.updated}</td>
                </tr>
              )
            : <tr><td colSpan="5">No carparks found!</td></tr>
          }
        </tbody>
      </table>
    </div>
  )
}