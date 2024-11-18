

import Title from "antd/es/skeleton/Title";
import exampleData from "./output.json";
import exampleData1 from "./example1.json";
// import exampleData2 from "./example1.json";


export const createNodeWithUID = (ind) => {
    console.log(ind)
    // this is important...
    let ans = {...exmaple_json}
    ans.Title = "New node"
    ans.Summary = "Add summary here"
    ans.uid = generateUID(ind)
    return ans
}

function generateUID(ind) {
    let v1 = Date.now().toString(36)  + Math.random().toString(36);
    console.log(Date.now())
    return Date.now()
    return v1 + ind.toString();
}

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

exmaple_json = exampleData
const InitialData = exmaple_json;


let example1 = exampleData1

let example2 = exampleData

export {example1, InitialData, example2}

