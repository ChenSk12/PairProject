var dom = document.getElementById("container");
var myChart = echarts.init(dom);
show("CVPR");


function show(conferecne)
{
    var text=document.getElementById("exampleModalLabel");
    text.innerText="热词分析("+conferecne+")";
    // text.setAttribute("text","热词分析("+conferecne+")");
    myChart.clear();
    var app = {};
    var option;
    var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    var updateFrequency = 4000;
    var dimension = 0;

    var countryColors = {"Australia":"#00008b","Canada":"#f00","China":"#ffde00","Cuba":"#002a8f","Finland":"#003580","France":"#ed2939","Germany":"#000","Iceland":"#003897","India":"#f93","Japan":"#bc002d","North Korea":"#024fa2","South Korea":"#000","New Zealand":"#00247d","Norway":"#ef2b2d","Poland":"#dc143c","Russia":"#d52b1e","Turkey":"#e30a17","United Kingdom":"#00247d","United States":"#b22234"};

    $.when(
        /*    $.getJSON('https://cdn.jsdelivr.net/npm/emoji-flags@1.3.0/data.json'),
            $.getJSON(ROOT_PATH + '/data/asset/data/life-expectancy-table.json')*/
        $.getJSON('/topKeyWords?conference='+conferecne),
        $.getJSON('/topKeyWordsData?conference='+conferecne)
        /*    $.getJSON('/data/data.json'),
            $.getJSON('/data/life_expert_table.json')*/
    ).done(function (res0, res1) {
        var flags = null;
        flags = res0[0];
        console.log(flags.toString());
        var data = null;
        data = res1[0];
        console.log(data.toString());
        var years = [];
        for (var i = 0; i < data.length; ++i) {
            //获取年份
            if (years.length === 0 || years[years.length - 1] !== data[i][4]) {
                years.push(data[i][4]);
            }
        }
        console.log(years.toString());

        //获取标号
        function getFlag(countryName) {
            if (!countryName) {
                return '';
            }
            return (flags.find(function (item) {
                return item.name === countryName;
            }) || {}).emoji;
        }
        var startIndex = 0;
        var startYear = years[startIndex];

        var option = {
            grid: {
                top: 10,
                bottom: 30,
                left: 150,
                right: 80
            },
            xAxis: {
                max: 'dataMax',
                label: {
                    formatter: function (n) {
                        return Math.round(n);
                    }
                }
            },
            dataset: {
                source: data.slice(1).filter(function (d) {
                    return d[4] === startYear;
                })
            },
            yAxis: {
                type: 'category',
                inverse: true,
                max: 10,
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 14
                    },
                    formatter: function (value) {
                        return value + '{flag|' + getFlag(value) + '}';
                    },
                    rich: {
                        flag: {
                            fontSize: 25,
                            padding: 5
                        }
                    }
                },
                animationDuration: 300,
                animationDurationUpdate: 300
            },
            series: [{
                realtimeSort: true,
                seriesLayoutBy: 'column',
                type: 'bar',
                itemStyle: {
                    color: function (param) {
                        return countryColors[param.value[3]] || '#5470c6';
                    }
                },
                encode: {
                    x: dimension,
                    y: 3
                },
                label: {
                    show: true,
                    precision: 1,
                    position: 'right',
                    valueAnimation: true,
                    fontFamily: 'monospace'
                }
            }],
            // Disable init animation.
            animationDuration: 0,
            animationDurationUpdate: updateFrequency,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear',
            graphic: {
                elements: [{
                    type: 'text',
                    right: 160,
                    bottom: 60,
                    style: {
                        text: startYear,
                        font: 'bolder 80px monospace',
                        fill: 'rgba(100, 100, 100, 0.25)'
                    },
                    z: 100
                }]
            }
        };

        // console.log(option);
        myChart.setOption(option,true);

        for (var i = startIndex; i < years.length - 1; ++i) {
            (function (i) {
                setTimeout(function () {
                    updateYear(years[i + 1]);
                }, (i - startIndex) * updateFrequency);
            })(i);
        }

        function updateYear(year) {
            var source = data.slice(1).filter(function (d) {
                return d[4] === year;
            });
            option.series[0].data = source;
            option.graphic.elements[0].style.text = year;
            myChart.setOption(option,true);
        }
    })

    if (option && typeof option === 'object') {
        myChart.setOption(option,true);
    }
}

function goWordAnalyse()
{
    window.location.href='/getKeyWordCloud';
}


function goLeft()
{
    window.location.href='/left';
}


function search()
{
    val=document.getElementById("input-32").value;
    console.log(val);
    localStorage.setItem('searchInfo', val);
    window.location.href='left';
}