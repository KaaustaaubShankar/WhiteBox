import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ForceDirectedGraph = ({ data }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;
    const margin = 50;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    // Measure text and adjust node size
    const textMeasureNode = svg.append('text')
      .style('opacity', 0)
      .style('font-size', '14px');
    nodes.forEach(node => {
      textMeasureNode.text(node.id);
      const bbox = textMeasureNode.node().getBBox();
      node.radius = Math.max(bbox.width, bbox.height) / 2 + 10; // Add padding
    });

    // Measure edge text length and adjust link distance
    const textMeasureLink = svg.append('text')
      .style('opacity', 0)
      .style('font-size', '12px');
    links.forEach(link => {
      textMeasureLink.text(link.value);
      const bbox = textMeasureLink.node().getBBox();
      link.distance = Math.max(bbox.width, bbox.height) + 40; // Adjust distance based on text length, add padding
    });

    svg.selectAll("text").remove(); // Remove the temporary text measurement elements

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.distance)) // Set distance based on text length
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    const zoom = d3.zoom()
      .scaleExtent([0.1, 10])
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
      .attr("stroke-width", 2); // Fixed stroke width

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
      .attr("r", d => d.radius) // Set radius based on text length
      .attr("fill", d => color(d.group))
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
      .attr("dy", ".35em")
      .style("font-size", "14px")
      .style("pointer-events", "none")
      .text(d => d.id);

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

      // Update SVG dimensions based on text size
      const bbox = svg.node().getBBox();
      svg.attr("viewBox", `${bbox.x - margin} ${bbox.y - margin} ${bbox.width + 2 * margin} ${bbox.height + 2 * margin}`);
      svg.attr("width", "100%"); // Set width to 100% to fill the container
      svg.attr("height", "100%"); // Set height to 100% to fill the container
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

    // Trigger an initial tick to set the correct dimensions
    simulation.alpha(1).restart();

    return () => {
      simulation.stop();
    };
  }, [data, dimensions]);

  return (
    <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
  );
};

export default ForceDirectedGraph;
