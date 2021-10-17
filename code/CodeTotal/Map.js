
$(document).ready(function(){
    init();
})
function init()
{
    var dialog;
    var selectedDistrictName;
    var content2;
    const view = new ol.View({
        center:[8982478.27953032, 859423.1579838376],
        zoom:7,
        minZoom:6,
        maxZoom:8
    })
    const map = new ol.Map({
        view: view,
        target:"ol-map",
 
    })


    const osm = new ol.layer.Tile({
        source: new ol.source.OSM({
            url:"http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        }),
        title: "osm",
        visible:false
        })

    const osm2 = new ol.layer.Tile({
        source: new ol.source.OSM(),
        title: "osm2",
        visible:true

        })

            const layerGroup = new ol.layer.Group({
                    layers: [
                        osm,
                        osm2
                    ]
            })
            
            map.addLayer(layerGroup)


    var wmslayergroup;

    $("body").on("change", ".datalayer", function(){
        layerName = $(this).attr("layerName");
        checked = this.checked
        wmslayergroup.getLayers().forEach(element=>{  
            if (layerName == element.get("title"))
            {
                if(checked)
                {
                    element.setVisible(true)
                }
                else{
                    element.setVisible(false)
                }
            }
        })

       
        console.log(this)
    })

                $("#datalayer_section").on("click", ".btn_legend", function(){
                    $(this).next().find(".img_legend").toggle();
                })

                $.getJSON("./data/layer.json", function(data){
                    const layerArray = new Array();
                    

                    data.layers.datalayers.forEach(element=>{
                            elementhtml =`
                            <div>
                            <input type="checkbox" class="datalayer" checked layerName="` + element.layerName + `">
                            <span>` + element.DisplayName + `</span>
                            <div>
                            <img class="img_legend" src="` + element.LegendUrl + `" alt="">
                            </div>                      
                            </div>
                            `;
                   $("#datalayer_section").append(elementhtml)


                        

                   if(element.type == "wms"){
                    const wmsLayer = new ol.layer.Tile ({
                        source: new ol.source.TileWMS({
                            url: element.wmsurl,
                            params: {'Layers': element.layerName, 'TILED': true},
                            serverType: 'geoserver',
                            transition: 0,
                            projection: element.epsg
    
                        }),
                        title:element.layerName
                    })
                    layerArray.push(wmslayer);
                   }

                   else if(element.type == "geojson"){
                    const vectorSource = new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: element.geoJsonUrl
                    });
    
                    const vectorStyle= new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: element.rgba,
                            width: 2,
                        }),
                    })
    
    
                    const vectorLayer = new ol.layer.Vector({
    
                        source: vectorSource,
                        title: element.layerName,
                        style: vectorStyle,
    
    
                    });
                    layerArray.push(vectorLayer);
                   }



                    
               
                })
                    const layerCollection = new ol.Collection(layerArray);
                    wmslayergroup = new ol.layer.Group(
                        {
                            layers:layerCollection
                        }
                    )

                    map.addLayer(wmslayergroup)
                
                })



                


                  map.on('singleclick', function (evt) {
                    coordinate= evt.coordinate
                    const viewResolution = /** @type {number} */ (view.getResolution());
                    var wmsDataSource;
            
                    wmslayergroup.getLayers().forEach(element=>{  
                        
                            if (element.get("title") == "PatientsTotal")
                            {
                                wmsDataSource = element.getSource()

                                
                            }                          
                    })

                    if(wmsDataSource != undefined)
                    {
                        var content = "<table>";
                        features = wmsDataSource.getFeaturesAtCoordinate(evt.coordinate);
                        features.forEach(element => {
                            
                            
                            properties = element.getProperties();
                            $.each(properties, function(key, value){
                                

                                if (key == "ADM2_EN")
                                {
                                    selectedDistrictName = value  
                                }
                                debugger;
                                
                                if (key != "geometry")
                                {
                                    content += "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
                                }

                            
                            })
                            content += "</table>";

                            $( "#dialog" ).dialog('open');
                            dialog.html(content)

                            debugger;
                            
                            if(selectedDistrictName != undefined){
                                
                                url = "http://localhost:5000/api/covidtotal/" + selectedDistrictName

                                $.get(url, function(data,status){
                                    content2 += "<table>";
                                    data.forEach(element=>{

                                        $.each(element, function(key, value){
                                            content2 += "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
                                        })

                                    });

                                    content += "</table>";
                                    dialog.html(content + content2)
                                  
                                    
                                }); 

                            }

                           

                        });


                       
                    }


                  });


                     
                    $( function() {
                        dialog = $( "#dialog" ).dialog({
                            
                            
                            modal: true,
                            autoOpen: false,
                            title:"Covid Patients Statistics - Total",
                            width: 500,
                            height: 200
                            
                            
                            
    
                        });
                        });

                  



                 

                    $( function() {
                        $( "#tabs" ).tabs();
                      } );

                }



