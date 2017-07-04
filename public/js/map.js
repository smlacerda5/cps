$(document).ready(function(){
    // console.log('d3 getting ready to launch');

      
    //Width and height
    var board = d3.select("div.state-map");
    var w =  parseInt(board.style('width'), 10);
    var h = 400;
    var s = scaleAdjuster(w);
    
    //Define map projection
    var projection = d3.geo.albersUsa()
                            .translate([w/2, h/2])
                            .scale(s);
    //Define path generator
    var path = d3.geo.path()
                        .projection(projection);
    //Create SVG element
    var svg = d3.select("div.board")
                .append("svg")
                .attr('id', 'state-svg')
                .attr("width", w)
                .attr("height", h);

    //Load in GeoJSON data
    d3.json("/js/d3/d3-data/us-states.json", function(json) {
        //Bind data and create one path per GeoJSON feature
        var states = svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", path)
            .style("fill", "#F49293")

        var currState = $('.map-items div:first-child').attr('id');
        highlightState(currState);
        addCircles(d3.selectAll('.states')[0]);
        addHtmlLabel();
        addClickEventToStates(states);
    });
    
    // cycles through states when navigation buttons are clicked
    $('.state-nav-left').on('click', function(){
        var target = $(this);
        var $states = $('.map-items .states');
        var $currState = $($states).not('.hide-me');

        $states.addClass('hide-me');
        var $state = $($currState).prev();
        if ($state.length == 0) {
            $state = $($states).last();
        }
        $($state).removeClass('hide-me');
        highlightState($state.attr('id'));
    });

    $('.state-nav-right').on('click', function(){
        var target = $(this);
        var $states = $('.map-items .states');
        var $currState = $($states).not('.hide-me');

        $states.addClass('hide-me');
        var $state = $($currState).next();
        if ($state.length == 0) {
            $state = $($states).first();
        }
        $($state).removeClass('hide-me');
        highlightState($state.attr('id'));
    });

    // highlights currently selected state on d3 map
    function highlightState(state){
        svg.selectAll('path').transition().style('fill', '#F49293');
        svg.selectAll('path')
            .filter(function(d){
                return d.properties.name.replace(' ', '') === state ? d : null;
            })
            .style('fill', '#E60C0F')
            .transition();
    };

    // Add white circles to center of states where CPS works
    function addCircles(states){
        var stateNames = states.map(function(state){ return state.id });
        var filtered = svg.selectAll('path').filter(function(d){
            return stateNames.indexOf(d.properties.name.replace(' ', '')) > -1;
        });

        filtered.each(function(d, i){
            $(this).attr('class', 'filtered');
            var center = path.centroid(d);
            d3.select('svg')
                .append('circle')
                .attr({
                    r: 4,
                    cx: center[0],
                    cy: center[1]
                })
                .style('fill', 'white')
                .on('click', function(){
                    highlightState(d.properties.name);
                    $('.map-items .states').addClass('hide-me');
                    var $curr = $('div#' + d.properties.name.replace(' ', '')).get(0);
                    $($curr).removeClass('hide-me');
                })
        });
    };

    function addHtmlLabel(){
        var div = d3.select('.board')
                    .append('div')
                    .attr('class', 'label-div');
                    
        div.append('span').attr('class', 'map-circle');

        if ($('html').prop('lang') == 'es')
            div.append('span').attr('class', 'map-label map-label-es').text('Indicada estados donde trabajamos');
        else
            div.append('span').attr('class', 'map-label').text('Indicates states where we work');
    };

    function addClickEventToStates(states){
        var targetStates = d3.selectAll('.filtered');
        targetStates.on('click', function(d){
            // console.log(d.properties.name);
            states.transition().style('fill', '#F49293');
            d3.select(this)
                .transition()
                .style('fill', '#E60C0F');
            
            $('.map-items .states').addClass('hide-me');
            var $curr = $('.map-items div#' + d.properties.name.replace(' ', '')).get(0);
            $($curr).removeClass('hide-me');
        }).transition().duration(1000);
    };

    // adjusting scale based
    function scaleAdjuster(w){
        return w > 550 ? 700 : w > 420 ? 550 : 425;
    };


});