import React from 'react';
import ForceDirectedGraph from './ForceDirectedGraph'; // Import the graph component
import DataBox from './DataBox'; // Component for displaying data
import ChatBox from './ChatBox'; // Component for chat messages

// Sample data for demonstration
const data = {
  nodes: [
    { id: 'who', group: 1 },
    { id: '2', group: 2 },
    { id: '3', group: 1 },
    { id: '4', group: 2 }
  ],
  links: [
    { source: 'who', target: '2', value: 'yuh mom is gay' },
    { source: '2', target: '3', value: 5 },
    { source: '3', target: '4', value: 2 },
    { source: '4', target: 'who', value: 8 }
  ]
};

function App() {
  return (
    <div className="app-container">
      <div className="graph-container">
        <ForceDirectedGraph data={data} />
      </div>
      <div className="info-container">
        <div className="box data-box">
          <DataBox />
        </div>
        <div className="box chat-box">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

export default App;
