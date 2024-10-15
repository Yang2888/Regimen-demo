import React, { useState, createContext } from 'react';
import InitialData from './initData';

// Create a Context for the data
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const [data_global, setdata_global] = useState(InitialData.data_global);

  const updateDataGlobal = (inputDict) => {
    setdata_global((prevData) => {
      // Merge inputDict into the existing data_global
      return { ...inputDict };
      // return { ...prevData, ...inputDict };
    });
  };

  return (
    <DataContext.Provider value={{ data_global, updateDataGlobal }}>
      {children}
    </DataContext.Provider>
  );
};
