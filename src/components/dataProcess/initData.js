import Title from "antd/es/skeleton/Title";

// let exmaple_json = {};

// exmaple_json = { a: "adfadf" };
// exmaple_json = { Title: "Final Goal", Summary: "The goal is to ..." };
// exmaple_json = {
//   Title: "Final Goal",
//   Summary: "The goal is to ...",
//   Note: "",
//   Content: "",
//   Definition: "",
//   Priority: "",
//   Milestones: [],
//   Current_status: "",
//   // difficulty_rating: {},
//   Deadline: "",
//   // relationship_to_others: {},
//   children: [],
//   uid: "111",
// };

// exmaple_json = {
//   Title: "Regimen X",
//   Summary:
//     "This is the root node of the regimen, and metadata information about the regimen will be stored in this node.",
//   Content: "To be added",
//   Infos: "This will store useful key features. Should be a list. TODO.",
//   uid: "1",
//   children: [
//     {
//       Title: "Step 1",
//       Summary: "This is step 1 of the regimen",
//       Content: "To be added too...",
//       uid: "2",

//       children: [
//         {
//           Title: "Substep 1",
//           Summary:
//             "This is the substep of step1. Actually the structure can be changed to a graph, though the current display is a tree.",
//           Content: "What can I say?",
//           uid: "3",
//         },
//         {
//           Title: "Substep ...",
//           Summary: "This is the substep i of step1. ",
//           Content: "What can I say?",
//           uid: "4",
//         },
//         {
//           Title: "Substep n",
//           Summary: "This is the substep n of step1. ",
//           Content: "What can I say?",
//           uid: "5",
//         },
//       ],
//     },
//     {
//       Title: "Step 2",
//       Summary: "This is step 1 of the regimen",
//       Content: "To be added too...",
//       uid: "6",
//     },
//   ],
// };

// // const InitialData = {
// //     data_global: exmaple_json, // Start with an empty array for the data list
// //   };

let exmaple_json = {
  Title: "Regimen X",
  Summary:
    "This is the root node of the regimen, containing metadata information.",
  Content: "This regimen outlines the treatment phases for cancer management.",
  Infos: "Includes various phases of treatment and their corresponding cycles.",
  uid: "1",
  children: [
    {
      Title: "Pre-Induction",
      Summary: "This phase prepares the patient for the induction phase.",
      Description: "This is the pre-induction phase of Regimen X.",
      Content: "Initial treatment to stabilize the patient's condition.",
      Infos: "Focuses on readiness for more aggressive treatment.",
      uid: "p1",
      cycles: [
        {
          cycle_number: 1,
          cycle_length: "21 days",
          drugs: [
            { name: "Drug A", dosage: "50mg", frequency: "Once daily" },
            { name: "Drug B", dosage: "100mg", frequency: "Twice daily" },
          ],
        },
      ],
      children: [
        {
          Title: "Induction",
          Summary: "This phase aims to reduce tumor burden significantly.",
          Description: "This is the induction phase of Regimen X.",
          Content: "Aggressive treatment to target and reduce cancer cells.",
          Infos: "Critical phase for achieving initial treatment success.",
          uid: "p2",
          cycles: [
            {
              cycle_number: 1,
              cycle_length: "21 days",
              drugs: [
                { name: "Drug C", dosage: "75mg", frequency: "Every 6 hours" },
              ],
            },
          ],
          children: [
            {
              Title: "Intensification",
              Summary:
                "This phase intensifies treatment to eliminate residual disease.",
              Description: "This is the intensification phase of Regimen X.",
              Content:
                "Further aggressive treatment to maximize effectiveness.",
              Infos:
                "Helps to ensure that any remaining cancer cells are targeted.",
              uid: "p3",
              cycles: [
                {
                  cycle_number: 1,
                  cycle_length: "14 days",
                  drugs: [
                    { name: "Drug D", dosage: "25mg", frequency: "Once daily" },
                  ],
                },
              ],
            },
            {
              Title: "Consolidation",
              Summary:
                "This phase aims to maintain remission and prevent relapse.",
              Description: "This is the consolidation phase of Regimen X.",
              Content: "Reinforces the effectiveness of previous treatments.",
              Infos: "Key to sustaining treatment gains and long-term success.",
              uid: "p4",
              cycles: [
                {
                  cycle_number: 1,
                  cycle_length: "14 days",
                  drugs: [
                    { name: "Drug E", dosage: "10mg", frequency: "Once daily" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const InitialData = exmaple_json;

export default InitialData;
