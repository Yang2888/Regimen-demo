import React, { useState, createContext } from 'react';
import InitialData from './initData';

// Create a Context for the data
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const [data_global, setdata_global] = useState(InitialData);
  const [node_displayed, set_node_displayed] = useState(InitialData)
  const [refresh_key, set_refresh_key] = useState(true)

  const updateDataGlobal = (inputDict) => {
    setdata_global((prevData) => {
      // Merge inputDict into the existing data_global
      return { ...inputDict };
      // return { ...prevData, ...inputDict };
    });
  };

  const delete_certain_node = (nodeToDelete) => {
    const deleteNodeRecursively = (parentNode, uidToDelete) => {
      if (!parentNode.children) return;
  
      // Filter out the child with the matching uid
      parentNode.children = parentNode.children.filter(child => child.uid !== uidToDelete);
  
      // Recursively check the remaining children
      parentNode.children.forEach(child => deleteNodeRecursively(child, uidToDelete));
    };
  
    // If the node to delete is the root itself
    if (data_global.uid === nodeToDelete.uid) {
      // Handle deleting the root node (data_global) itself
      setdata_global(InitialData); // Update the state to null (or handle this as needed)
    } else {
      // Otherwise, update the tree recursively
      const updatedTree = { ...data_global }; // Create a copy of the current tree state
      deleteNodeRecursively(updatedTree, nodeToDelete.uid);
      setdata_global(updatedTree); // Update the state with the modified tree
    }
  };

  const edit_certain_node = (updatedNode) => {
    const node_uid = updatedNode.uid;
    console.log(data_global)
    console.log(updatedNode)
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
    set_node_displayed(data_global);
    // console.log(data_global)
  };


  return (
    <DataContext.Provider value={{ data_global, updateDataGlobal, node_displayed, set_node_displayed, edit_certain_node, set_refresh_key, refresh_key, delete_certain_node }}>
      {children}
    </DataContext.Provider>
  );
};
