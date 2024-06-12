// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let sampleData = sampleArray[0];


    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
   

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sampleData).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;


    // Filter the samples for the object with the desired sample number
    let sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    let sampleData = sampleArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let sample_values = sampleData.sample_values;
    let otu_labels = sampleData.otu_labels;
    
    // Build a Bubble Chart
    //Set variable for plot values
      let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30, l: 150 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
    
    // Render the Bubble Chart
    //Call Plotly to plot
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);


    // For the Bar Chart, 


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let topTenOtuIds = otu_ids.slice(0, 10).reverse();
    let topTenSampleValues = sample_values.slice(0, 10).reverse();
    let topTenOtuLabels = otu_labels.slice(0, 10).reverse()

    //map the otu_ids to a list of strings for your yticks
    let yticks = topTenOtuIds.map(otuID => `OTU ${otuID}`);

    let barData = [{
      y: yticks,
      x: topTenSampleValues,
      text: topTenOtuLabels,
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
  // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

  
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
    
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
