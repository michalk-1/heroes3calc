import React from "react";
import ReactDOM from "react-dom";
import { Search } from "./components/Search/index.js";

const Search2 = () => {
  return (
    <div>
      Hello Search2 Component<br/>
      <button>Submit</button>
    </div>
  );
}

const Index = () => {
	return (
    <div>
      <Search2 />
      <Search />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("index"));
