import React, { useState, createContext } from 'react';
import InitialData from './initData';

// Create a Context for the data
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const [dataList, setDataList] = useState(InitialData.dataList);

  // Function to update a specific item in the data list
  const updateDataItem = (index, newData) => {
    setDataList((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      return updatedData;
    });
  };

  return (
    <DataContext.Provider value={{ dataList, updateDataItem }}>
      {children}
    </DataContext.Provider>
  );
};
