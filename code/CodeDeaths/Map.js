$(document).ready(function () {
    init();
})

function init() {
    var dialog;
    var content2;

    const view = new ol.View({
        center: [8982478.27953032, 859423.1579838376],
        zoom: 7,
        minZoom: 6,
        maxZoom: 8
    })
    const map = new ol.Map({
        view: view,
        target: "ol-map",
    })

    const osm = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: "http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        }),
        title: "osm",
        visible: false
    })

    const osm2 = new ol.layer.Tile({
        source: new ol.source.OSM(),
        title: "osm2",
        visible: true

    })

    const layerGroup = new ol.layer.Group({
        layers: [
            osm,
            osm2
        ]
    })

    map.addLayer(layerGroup)


    var wmslayergroup;

    $("body").on("change", ".datalayer", function () {
        dataLayerName = this.value,

            wmslayergroup.getLayers().forEach(element => {
                if (dataLayerName == element.get('title')) {
                    element.setVisible(true)
                } else {
                    element.setVisible(false)
                }
            })
    })



    $("#datalayer_section").on("click", ".btn_legend", function () {
        $(this).next().find(".img_legend").toggle();
    })

    $.getJSON("./data/layer.json", function (data) {
        const layerArray = new Array();

        let checked = true;
        data.layers.datalayers.forEach(element => {
            elementhtml = `
                            <div>
                            <input type="radio" class="datalayer" name="datalayer" value="${element.layerName}" ${checked?'checked':''}>
                            <span>${element.DisplayName}</span>
                            <div>
                            <img class="img_legend" src="${element.LegendUrl}" alt="">
                            </div>                      
                            </div>
                            `;
            $("#datalayer_section").append(elementhtml)


            if (element.type == "wms") {
                const wmsLayer = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: element.wmsurl,
                        params: {
                            'Layers': element.layerName,
                            'TILED': true
                        },
                        serverType: 'geoserver',
                        transition: 0,
                        projection: element.epsg

                    }),
                    title: element.layerName,
                    visible: checked
                })
                layerArray.push(wmslayer);
            } else if (element.type == "geojson") {
                const vectorSource = new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: element.geoJsonUrl
                });

                const vectorStyle = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: element.rgba,
                        width: 2,
                    }),
                })


                const vectorLayer = new ol.layer.Vector({

                    source: vectorSource,
                    title: element.layerName,
                    style: vectorStyle,
                    visible: checked
                });
                layerArray.push(vectorLayer);
            }
            if (checked) checked = false;

        })
        const layerCollection = new ol.Collection(layerArray);
        wmslayergroup = new ol.layer.Group({
            layers: layerCollection
        });

        map.addLayer(wmslayergroup);
    })


    map.on('singleclick', function (evt) {
        coordinate = evt.coordinate
        const viewResolution = /** @type {number} */ (view.getResolution());
        var wmsDataSource;
        let title = '';
        let selectedDistrictName;
        wmslayergroup.getLayers().forEach(element => {

            if (element.getVisible()) {
                wmsDataSource = element.getSource()
                title = element.get('title');
                console.log(title);
            }
        })

        if (wmsDataSource != undefined) {
            let content = "<table>";
            features = wmsDataSource.getFeaturesAtCoordinate(evt.coordinate);
            features.forEach(element => {

                // debugger;
                properties = element.getProperties();
                $.each(properties, function (key, value) {

                    if (key == "ADM2_EN") {
                        selectedDistrictName = value
                    }

                    if (key != "geometry") {
                        content += "<tr><th>" + key + "</th><td>" + value + "</td></tr>";
                        // debugger;
                    }

                })
                content += "</table>";
                // $("#dialog").dialog('option', 'title', title).dialog('open');
                // dialog.html(content)


            });

            url = `http://localhost:5000/api/${title}/`;

            if (selectedDistrictName) {
                url += selectedDistrictName;
            }

            $.get(url, function (data, status) {
                // content2 = "<table>";
                // data.forEach(element => {

                //     $.each(element, function (key, value) {
                //         content2 += "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
                //         chartLabels.push(key);
                //         chartData.push(value);
                //     })

                // });
                // content2 += "</table>";
                // dialog.html(content2)

                switch (title) {
                    case 'PatientsMonth':
                        let chartLabels = [];
                        let chartData = [];
                        data.forEach(element => {
                            $.each(element, function (key, value) {
                                if (key.length === 3) {
                                    chartLabels.push(key);
                                    chartData.push(value);
                                }
                            })
                        });
                        var ctx = document.getElementById('myChart').getContext('2d');
                        var myChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: chartLabels,
                                datasets: [{
                                    label: 'Patients',
                                    data: chartData,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });

                        break;
                    case 'B':
                        break;
                }
                $("#dialog").dialog({
                    title: title,
                    close: function () {
                        //allFields.val('').removeClass('ui-state-error');
                        myChart.destroy();
                        console.log('dialog closed');
                    }
                }).dialog('open');
            });
        }
    });



    $(function () {
        dialog = $("#dialog").dialog({
            modal: true,
            autoOpen: false,
            title: "Covid Deaths Statistics",
            width: 500,
            height: 200
        });
    });
}