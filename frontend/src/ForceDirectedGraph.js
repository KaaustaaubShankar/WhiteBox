import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ForceDirectedGraph = ({ data, onNodeClick }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;
    const margin = 50;
    const textWrapWidth = 100; // Set text wrap width

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Extract nodes and links from the data
    const nodesMap = {};
    const links = data.map(d => {
      const sourceTitle = d.source.title;
      const targetTitle = d.target.title;

      // Determine the group for source and target
      const sourceGroup = d.source.label === "Document" ? 0 : 1;
      const targetGroup = d.target.label === "Document" ? 0 : 1;

      // Add source and target to nodesMap if not already present
      if (!nodesMap[sourceTitle]) {
        nodesMap[sourceTitle] = { id: sourceTitle, group: sourceGroup };
      }
      if (!nodesMap[targetTitle]) {
        nodesMap[targetTitle] = { id: targetTitle, group: targetGroup };
      }

      // Create the link
      return {
        source: sourceTitle,
        target: targetTitle,
        value: d.relationship, // Use relationship as the link label
        distance: sourceGroup === targetGroup ? 1000 : 55 // Very large distance for intra-cluster links
      };
    });

    const nodes = Object.values(nodesMap);

    // Create a temporary text element to measure text size
    const textMeasureNode = svg.append('text')
      .style('opacity', 0)
      .style('font-size', '14px');

    // Function to wrap text
    function wrapText(text, width) {
      const words = text.split(/\s+/).reverse();
      let line = [];
      const lines = [];

      while (words.length > 0) {
        line.push(words.pop());
        textMeasureNode.text(line.join(" "));
        const tspan = textMeasureNode.node().getBBox();
        if (tspan.width > width && line.length > 1) {
          line.pop();
          lines.push(line.join(" "));
          line = [words.pop()];
        }
      }
      lines.push(line.join(" "));

      return lines;
    }

    nodes.forEach(node => {
      const lines = wrapText(node.id, textWrapWidth);
      node.textLines = lines;
      node.radius = Math.max(...lines.map(line => textMeasureNode.text(line).node().getBBox().height)) / 2;
    });

    svg.selectAll("text").remove();

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 10)
      .attr('refY', 5)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#999');

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.distance))
      .force("charge", d3.forceManyBody().strength(-800)) // Increase repulsion to spread out nodes
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    const zoom = d3.zoom()
      .scaleExtent([-10, 200]) // Allow for more zooming in
      .on("zoom", (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom);

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.8)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    const linkLabels = svg.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .text(d => d.value);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => color(d.group))
      .on("click", (event, d) => {
        onNodeClick(d); // Call the parent callback with the selected node
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    const nodeLabels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("pointer-events", "none")
      .selectAll("tspan")
      .data(d => d.textLines)
      .join("tspan")
      .attr("x", d => d.x)
      .attr("y", (d, i) => d.y + i * 1.1 * 14) // Adjust vertical spacing based on font size
      .text(d => d);

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      nodeLabels
        .attr("x", d => d.x)
        .attr("y", d => d.y);

      const bbox = svg.node().getBBox();
      svg.attr("viewBox", `${bbox.x - margin} ${bbox.y - margin} ${bbox.width + 2 * margin} ${bbox.height + 2 * margin}`);
      svg.attr("width", "100%");
      svg.attr("height", "100%");
    }

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    simulation.alpha(1).restart();

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, onNodeClick]);

  return (
    <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
  );
};

export default ForceDirectedGraph;
