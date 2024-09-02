import React,{useState} from 'react';
import ForceDirectedGraph from './ForceDirectedGraph'; // Import the graph component
import DataBox from './DataBox'; // Component for displaying data
import ChatBox from './ChatBox'; // Component for chat messages

// Sample data for demonstration
const data = {
  nodes: [
    { id: 'who', group: 1 },
    { id: '2', group: 2 },
    { id: '3', group: 1 },
    { id: '4', group: 2 },
    { id: '5', group: 1 }
  ],
  links: [
    { source: 'who', target: '2', value: 'yuh mom is gay' },
    { source: '2', target: '5', value: 4 },
    { source: '2', target: '3', value: 5 },
    { source: '3', target: '4', value: 2 },
    { source: '4', target: 'who', value: 8 }
  ]
};

function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="logo.png" alt="Logo" className="logo" /> {/* Ensure the path to your logo is correct */}
      </header>
      <div className="main-content">
        <div className="graph-container">
          <ForceDirectedGraph data={data} onNodeClick={setSelectedNode} />
        </div>
        <div className="info-container">
          <div className="box data-box">
            <DataBox node = {selectedNode} />
          </div>
          <div className="box chat-box">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
