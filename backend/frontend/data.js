function getTimeDiff(latest) {
  const timeDiff = new Date(latest) - new Date()

  var seconds = ((timeDiff % 60000) / 1000).toFixed(0)
  return seconds
}

$.ajax({
  type: 'GET',
  url: `./temps.json`,
  dataType: 'json',
  statusCode: {
    400: function () {
      return
    },
  },
  success: function (data) {
    dataset = []
    $('.uptimeData').text(data['current_uptime'])
    $('.lastUpdate').text(
      `Last updated: ${getTimeDiff(data['lastonline'])}s ago`,
    )

    for (let index = 0; index < data['sheme'].length; index++) {
      const element = Number(data['sheme'][index])
      dataset.push({ x: index, y: element })
    }
    var chart = new CanvasJS.Chart('chartContainer', {
      title: {
        text: 'Rin Server - Tempature',
        fontColor: 'white',
      },

      axisX: {
        labelFontColor: 'white',
        tickLength: 15,
        tickColor: '#19a990',
        gridThickness: 3,
        gridColor: '#ffb62fcd',
      },
      axisY: {
        labelFontColor: 'white',
        tickLength: 15,
        tickColor: '#19a990',
        gridThickness: 3,
        gridColor: '#ffb62fcd',
      },
      backgroundColor: '#1f272d',
      data: [
        {
          color: '#19a990',
          type: 'area',

          dataPoints: dataset,
        },
      ],
    })

    chart.render()
  },
})
