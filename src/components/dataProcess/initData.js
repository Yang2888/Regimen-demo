import Title from "antd/es/skeleton/Title";

let exmaple_json = {};

exmaple_json = { a: "adfadf" };
exmaple_json = { Title: "Final Goal", Summary: "The goal is to ..." };
exmaple_json = {
  Title: "Final Goal",
  Summary: "The goal is to ...",
  Note: "",
  Content: "",
  Definition: "",
  Priority: "",
  Milestones: [],
  Current_status: "",
  // difficulty_rating: {},
  Deadline: "",
  // relationship_to_others: {},
  children: [],
  uid: "111",
};

exmaple_json = {
  Title: "Regimen X",
  Summary:
    "This is the root node of the regimen, and metadata information about the regimen will be stored in this node.",
  Content: "To be added",
  Infos: "This will store useful key features. Should be a list. TODO.",
  uid: "1",
  children: [
    {
      Title: "Step 1",
      Summary: "This is step 1 of the regimen",
      Content: "To be added too...",
      uid: "2",

      children: [
        {
          Title: "Substep 1",
          Summary:
            "This is the substep of step1. Actually the structure can be changed to a graph, though the current display is a tree.",
          Content: "What can I say?",
          uid: "3",
        },
        {
          Title: "Substep ...",
          Summary: "This is the substep i of step1. ",
          Content: "What can I say?",
          uid: "4",
        },
        {
          Title: "Substep n",
          Summary: "This is the substep n of step1. ",
          Content: "What can I say?",
          uid: "5",
        },
      ],
    },
    {
      Title: "Step 2",
      Summary: "This is step 1 of the regimen",
      Content: "To be added too...",
      uid: "6",
    },
  ],
};

// const InitialData = {
//     data_global: exmaple_json, // Start with an empty array for the data list
//   };

const InitialData = exmaple_json;

export default InitialData;
