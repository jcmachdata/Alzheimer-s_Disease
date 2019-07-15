function displayReport(modelStats) {

  d3.select("#status").text("")
  // d3.select('#fitext').text("")
  // d3.select("classtestxt").text("")

  data = modelStats['data']
  layout = modelStats['layout']
  Plotly.newPlot("roc_curve", data, layout)

  if (modelStats['cv']){
    cvdata = modelStats['cvaccdata']
    Plotly.newPlot("cv-boxplot", cvdata)
    d3.select('#cv-boxplot').attr("class",'unhidden')
  }

  const classReport = modelStats['class_report']

  console.log(classReport);

  var f = d3.format(".3f");

  let classHeader = d3.select('#class_report')
  .append('table').property('id', 'class-table').append('thead')

  classHeader.append('td').text('')
  classHeader.append('td').text('Precision')
  classHeader.append('td').text('Recall')
  classHeader.append('td').text('F1')
  classHeader.append('td').text('Support')

  for (const [key, value] of Object.entries(classReport)){
    console.log(`${key}: ${value}`);
    let row = d3.select('#class-table').append('tr')

    if (key == 'accuracy'){
      row.append('td').text(key)
      row.append('td').text(f(value))
    }
    else {
      row.append('td').text(key)
      row.append('td').text(f(value.precision))
      row.append('td').text(f(value.recall))
      row.append('td').text(f(value["f1-score"]))
      row.append('td').text(f(value.support))
    }
  }
console.log(`modelstats features are ${modelStats['features'][0]}`)
console.log(modelStats['features']);
  if (!("-1" in  modelStats['features'])){
    let header = d3.select('#features')
    // .text('Feature Importance').property('id', 'fitext')
    .append('table').property('id', 'features-table')
    .append('thead')
    header.append('td').text('Feature')
    header.append('td').text('Importance')

    features = modelStats['features']
    var sorted = [];
    for(var key in features) {
      sorted[sorted.length] = key;
    }

    sorted.sort();
    sorted.reverse();
    // console.log(`features are: ${sorted}`)

    for (var i = 0; i < sorted.length; i++) {
        //Do something
        key = sorted[i]
        value = features[key]
        console.log(`key ${key}: ${value}`);
        let row = d3.select('#features-table').append('tr')
        row.append('td').text(value)
        row.append('td').text(f(key))
    }


    // d3.select('#tree-image-caption').text("Sample random tree")
    d3.select('#tree-image').attr("class",'unhidden')
  }

}


function clear_screen(){
  d3.select('#features-table').remove()
  d3.select('#class-table').remove()
  d3.select('#tree-image').attr("class",'hidden')
  d3.select('#cv-boxplot').attr("class", 'hidden')
}

async function selectionChanged () {
  clear_screen()

  const dict  = {}
  // clear LogisticRegression
  d3.select('#status').text("Collecting data...")
  d3.select('#roc_curve').text("")
  // d3.select('#class_report').text("")

  // create dictionary of user selection
  dict['model'] = d3.select('#model').property('value')
  dict['prediction'] = d3.select('#prediction').property('value')
  dict['oversampling'] = d3.select('#oversampling').property('value')
  dict['scaling'] = d3.select('#scaling').property('value')
  if (d3.select('#demographic').property('checked')){
    dict['demographic'] = d3.select('#demographic').property('value')
  }
  if (d3.select('#apoe4').property('checked')){
    dict['apoe4'] = d3.select('#apoe4').property('value')
  }
  if (d3.select('#cogtest').property('checked')){
    dict['cogtest'] = d3.select('#cogtest').property('value')
  }
  if (d3.select('#mri').property('checked')){
    dict['mri'] = d3.select('#mri').property('value')
  }
  if (d3.select('#mripct').property('checked')){
    dict['mripct'] = d3.select('#mripct').property('value')
  }
  if (d3.select('#pet').property('checked')){
    dict['pet'] = d3.select('#pet').property('value')
  }
  if (d3.select('#csf').property('checked')){
    dict['csf'] = d3.select('#csf').property('value')
  }
  if (d3.select("#cv").property('checked')){
    dict['cross_validate'] = 1
  }
  else {
    dict['cross_validate'] = 0
  }

  temp = JSON.stringify(dict);
  const modelStats = await d3.json(`/getdata/${temp}`)
  // if successful display model stats
  if (modelStats['success'] == 1) {
    displayReport(modelStats)
  }
  else if (modelStats['success'] == -1)
    d3.select('#status').text("The data set could not be generated")
  else if (modelStats['success'] == -2)
    d3.select('#status').text("Model could not be trained")
  else if (modelStats['success'] == 0)
    d3.select('#status').text("Model could not be evaluated")
}

(function init() {
  console.log("initializing page....");
  clear_screen()
}) ()
