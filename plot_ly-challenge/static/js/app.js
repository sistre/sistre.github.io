d3.json("samples.json").then((sample_data) => {

  // Create the init fuction
  function init() {
  
    // Construct the initial bar chart

      // Create the variable for the top 10 sample values for the first subject
        var bar_sample_values = sample_data.samples[0].sample_values.slice(0, 10);
      
      // Create the variable for the top 10 otu_ids of the first subject and add "OTU " to each otu_id for the bar chart labels
        var bar_otu_ids = sample_data.samples[0].otu_ids.slice(0, 10);
        bar_otu_ids = bar_otu_ids.map(id => "OTU " + id)
      
      // Create the variable for top 10 otu_labels of first subject to display the microbial species as hover text
        var bar_otu_labels = sample_data.samples[0].otu_labels.slice(0, 10);
      
      // Reverse the data in the variables to sort in descending order
        bar_sample_values = bar_sample_values.reverse();
        bar_otu_ids = bar_otu_ids.reverse();
        bar_otu_labels = bar_otu_labels.reverse();
        
      // Create the trace for the bar chart
        var trace1 = {
          x: bar_sample_values,
          y: bar_otu_ids,
          text: bar_otu_labels,
          type: "bar",
          orientation: "h"
          };

        // Set the trace data for the bar chart
          var bar_data = [trace1];

        // Create the variable to store the bar chart div id
          var bar_div = d3.selectAll("#bar").node();

        // Plot the bar chart in selected div
          Plotly.newPlot(bar_div, bar_data);

    // Construct the initial bubble chart

      // Create the variables for first subject for the bubble chart
        var bubble_sample_values = sample_data.samples[0].sample_values;
        var bubble_otu_ids = sample_data.samples[0].otu_ids;
        var bubble_otu_labels = sample_data.samples[0].otu_labels;
      
      // Create the trace for the bubble chart
        var trace2 = {
          x: bubble_otu_ids,
          y: bubble_sample_values,
          mode: "markers",
          marker: {
            size: bubble_sample_values,
            color: bubble_otu_ids
          },
          text: bubble_otu_labels
        };

      // Set the trace data for the bubble chart
        var bubble_data = [trace2]

      // Create the variable to store the bubble chart div id
        var bubble_div = d3.selectAll("#bubble").node();

      // Plot the bubble chart in selected div
        Plotly.newPlot(bubble_div, bubble_data);

    // Construct the initial gauge chart

      // Create the variable for first subject wash frequency for the gauge chart
        var gauge_wfreq = sample_data.metadata[0].wfreq;

      // Set the trace data for the gauge chart
        var gauge_data = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: gauge_wfreq,
            title: { text: "<span style='font-size:22px;font-weight:bold;color:black'>Belly Button Washing Frequency</span><br><span style='font-size:18px;font-weight:normal;color:black'>Scrubs per Week</span>" },
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
            bar:{color: 'red'},
              steps: [
                {range: [0, 1], color: "#f7f2eb" },
                {range: [1, 2], color: "#f3f0e4" },
                {range: [2, 3], color: "#e8e6c8" },
                {range: [3, 4], color: "#e4e8af" },
                {range: [4, 5], color: "#d4e494" },
                {range: [5, 6], color: "#b6cc8a" },
                {range: [6, 7], color: "#86bf7f" },
                {range: [7, 8], color: "#84bb8a" },
                {range: [8, 9], color: "#7fb485" }
              ]}
          }
        ];
      // Create the variable to store the gauge chart div id
        var gauge_div = d3.selectAll("#gauge").node();

      // Set the dimensions for the gauge chart
        var gauge_dim = {width: 600, height: 500};

      // Plot the gauge chart in selected div
        Plotly.newPlot(gauge_div, gauge_data, gauge_dim);

    // Construct the initial demographic info display

      // Create a variable for first subject's metadata
        var metadata_info = sample_data.metadata[0];

      // Select the sample-metadata div for the demographic info
        var demographic_info = d3.select("#sample-metadata");

      // Create the metadata key:value pairs adding a new paragraph tag and colon + space inbetween the key and value
        Object.entries(metadata_info).forEach(([key, value]) => {
          var row = demographic_info.append("p");
          row.text(key + ": " + value)
        });
  };

  // Create the pulldown menu populating function
  function populate_options() {

    // Create the variable to store the select div id for the pulldown menu
      var select = d3.select("select");

    // Create a variable to store the subjects samples
      var samples = sample_data.samples;

    // Create a forEach loop to append each id option to the pulldown menu
      samples.forEach(sample => {
        var id = sample.id;
        var option = select.append("option");
        option.text(id);
      });
  };

  // Create the function to update all the charts and info with the new subject data
  function update_subject() {

    // Select the div ids that need to be updated
      var dropdown_menu = d3.select("#selDataset");
      var subject_id = dropdown_menu.node().value;
      var bar_chart = d3.selectAll("#bar").node();
      var bubble_chart = d3.selectAll("#bubble").node();
      var gauge_chart = d3.selectAll("#gauge").node();

    // Create variables of empty lists to populate with selected subject data
      var barchart_x = [];
      var barchart_y = [];
      var bubblechart_x = [];
      var bubblechart_y = [];
      var gauge_wfreq = []
      var metadata_info = [];

    // Create a variable for the samples in the dataset
      var samples_data = sample_data.samples;

    // Create a variable for the chosen subject's id in dropdown menu
      var target_dataset = samples_data.filter(subject => subject.id == subject_id);

    // Create variables for the samples for the selected subject in the dropdown menu to be used for updating the bar and bubble charts
      var target_id = target_dataset.map(sample => sample.id);
      var target_otu_ids = target_dataset.map(sample => sample.otu_ids);
      var target_sample_values = target_dataset.map(sample => sample.sample_values);

    // Create a variable for the metadata in the dataset
      var metadata = sample_data.metadata;

    // Create a variable for for the chosen subject's metadata
      var target_metadata = metadata.filter(sample => sample.id == subject_id);

    // Create a variable for the chosen subject's wash frequency to be used for updating the gauge chart
      var target_wfreq = target_metadata.map(sample => sample.wfreq);
      
    // Create a switch statement to change variables based on whether a subject is chosen in dropdown menu or not
      switch(subject_id) {

        // Case for when a subject is chosen from the dropdown menu
          case target_id[0]:

            // Selected subject case for update bar chart
              barchart_x = target_sample_values[0].slice(0,10).reverse();
              barchart_y = target_otu_ids[0].slice(0,10).reverse().map(id => "OTU " + id);

            // Selected subject case for bubble chart
              bubblechart_x = target_otu_ids[0];
              bubblechart_y = target_sample_values[0];

            // Selected subject case for gauge chart 
              gauge_wfreq = target_wfreq[0];

            // Selected subject case for demographic info metadata 
              metadata_info = target_metadata[0];
              break;

        // Default case
          default:

            // Default case for bar chart
              barchart_x = samples_data[0].sample_values.slice(0, 10).reverse();
              barchart_y = samples_data[0].otu_ids.slice(0, 10).reverse().map(id => "OTU " + id);

            // Default case for bubble chart
              bubblechart_x = samples_data[0].otu_ids;
              bubblechart_y = samples_data[0].sample_values;

            // Default case for gauge chart
              gauge_wfreq = metadata[0].wfreq;

            // Default case for demographic info metadata 
              metadata_info = metadata[0]
              break;
      };

    // Restyle the bar, bubble, and gauge charts with the selected subject data
      Plotly.restyle(bar_chart, "x", [barchart_x]);
      Plotly.restyle(bar_chart, "y", [barchart_y]);
      Plotly.restyle(bubble_chart, "x", [bubblechart_x]);
      Plotly.restyle(bubble_chart, "y", [bubblechart_y]);
      Plotly.restyle(gauge_chart, "value", [gauge_wfreq]);

    // Select the sample-metadata div for the demographic info
      var demographic_info = d3.select("#sample-metadata");

    // Clear the data from demographic info
      demographic_info.html("");

    // Refresh the demographic info display with selected subject info
      Object.entries(metadata_info).forEach(([key, value]) => {
          var row = demographic_info.append("p");
          row.text(key + ": " + value)
      });
  };

  // Call the init() function to populate page on first load
    init();

  // Call function to populate the dropdown menu on first load
    populate_options();

  // Update charts and info when a subject is selected from the dropdown menu
    d3.select("#selDataset").on("change", update_subject);

});