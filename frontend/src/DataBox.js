import React from 'react';

const DataBox = ({ node }) => {
  return (
    <div className="data-box-content">
      <h2>Data Box</h2>
      {node ? (
        <div>
          <p><strong>ID:</strong> {node.id}</p>
          <p><strong>Group:</strong> {node.group}</p>
          {/* Add more node details if needed */}
        </div>
      ) : (
        <p>No node selected</p>
      )}
    </div>
  );
};

export default DataBox;
