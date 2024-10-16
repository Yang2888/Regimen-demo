import React, { useState, createContext } from 'react';
import InitialData from './initData';

// Create a Context for the data
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const [data_global, setdata_global] = useState(InitialData);
  const [node_displayed, set_node_displayed] = useState(InitialData)

  const updateDataGlobal = (inputDict) => {
    setdata_global((prevData) => {
      // Merge inputDict into the existing data_global
      return { ...inputDict };
      // return { ...prevData, ...inputDict };
    });
  };

  const edit_certain_node = (updatedNode) => {
    const node_uid = updatedNode.uid;

    // Recursive function to find and update the node by uid
    const updateNode = (node) => {
      if (node.uid === node_uid) {
        // Return the updated node when the uid matches
        return { ...node, ...updatedNode };
      }

      // If the node has children, recursively update them
      if (node.children && Array.isArray(node.children)) {
        return {
          ...node,
          children: node.children.map((child) => updateNode(child)), // Recursively update children
        };
      }

      // Return the node as is if there's no match
      return node;
    };

    // Update the global data with the modified node
    setdata_global((prevData) => updateNode(prevData));
    // console.log(data_global)
  };


  return (
    <DataContext.Provider value={{ data_global, updateDataGlobal, node_displayed, set_node_displayed, edit_certain_node }}>
      {children}
    </DataContext.Provider>
  );
};
