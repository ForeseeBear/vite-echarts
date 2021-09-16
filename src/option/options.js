import * as echarts from '../../lib/export/core';

import particImg from '../assets/l1.03e5.png'
import lightcImg from '../assets/p1bu_25d.0d1d.png'

const bar3dOption = {
    "animation": true,
    "addDataAnimation": true,
    "animationEasing": "linear",
    "animationTime": 10,
    "barwidthtype": "auto",
    "effect": {
        "show": false,
        "time": 2,
        "axisBgColor": "auto",
        "labelColor": "#36383c",
        "fontSize": 12,
        "barGradient": false,
        "showGradient": false
    },
    "title": {
        "show": true,
        "text": "2.5D柱状图",
        "subtext": "",
        "textStyle": {
            "fontSize": 24,
            "fontWeight": "normal",
            "color": "#bcd3eb"
        },
        "padding": [15, 0, 0, 30],
        "x": "left"
    },
    "grid": {
        "x": "60",
        "y": "62",
        "x2": "60",
        "y2": "50",
        "borderColor": "transparent"
    },
    "tooltip": {
        "show": false,
        "unDisplayValue": "",
        "borderRadius": 3,
        "padding": 5,
        trigger: 'axis',
        "triggerOn": "mousemove",
        "borderWidth": 1,
        "backgroundColor": "rgba(0, 0, 0, 0.8)",
        "borderColor": "#000000",
        "textStyle": {
            "color": "#ffffff",
            "fontSize": 12
        },
        "confine": true,
        "axisPointer": {
            "type": "line"
        }
    },
    "dataZoom": {
        "filterMode": "filter",
        "xAxisIndex": [0],
        "dataBackgroundColor": "#eee",
        "handleColor": "rgba(70,130,180,0.8)",
        "show": false,
        "realtime": true,
        "backgroundColor": "#ffffff",
        "fillerColor": "#ffffff",
        "height": 10,
        "start": 0,
        "end": 100,
        "left": "auto",
        "bottom": 10
    },
    "particle": {},
    "light": {},
    "background": {},
    "_paddingx": "right",
    "_paddingy": "customLegendY",
    "resultType": "bar",
    "legend": {
        "show": true,
        "rowNum": 4,
        "itemGap": 10,
        "rowGap": 10,
        "colGap": 10,
        "itemWidth": 12,
        "itemHeight": 12,
        "icon": "roundRect",
        "padding": [5, 5, 5, 5],
        "orient": "horizontal",
        "backgroundColor": "rgba(255, 255, 255, 0)",
        "textStyle": {
            "fontSize": 12,
            "fontWeight": "normal",
            "textNumber": "auto",
            "color": "auto"
        },
        "data": ["Type1", "Type2"],
        "left": "right",
        "top": 35,
        "selectedMode": "multiple"
    },
    "toolbox": {
        "show": true,
        "orient": "horizontal",
        "right": "4%",
        "toolZoomBackground": "#ffffff",
        feature: {
            magicType: {
                type: ['stack', 'tiled']
            },
            dataView: {}
        }
    },
    "calculable": false,
    "GradientColorState": false,
    "range__yAxis": [{
        "min": "auto",
        "max": "auto"
    }, {}],
    "xAxis": [{
        "type": "category",
        "data": ["1月", '2月'],
        // "data": ["1月", "2月", "3月", "4月", "5月"],
        "name": "",
        "nameTextStyle": {
            "color": "#bcd3eb",
            "fontSize": 12
        },
        "nameGap": 15,
        "axisLabel": {
            "show": true,
            "rotate": 0,
            "interval": "auto",
            "textNumber": "auto",
            "textStyle": {
                "color": "#bcd3eb",
                "fontSize": 12
            }
        },
        "axisLine": {
            "lineStyle": {
                "color": "#5e6975",
                "width": 1
            }
        },
        "axisTick": {
            "show": true,
            "lineStyle": {
                "color": "#333333",
                "width": 0
            },
            "length": 0
        },
        "splitLine": {
            "show": false,
            "lineStyle": {
                "color": "#5e6975",
                "width": 0,
                "type": "dashed"
            }
        }
    }],
    "yAxis": [{
        "show": true,
        "name": "",
        "nameTextStyle": {
            "color": "#bcd3eb",
            "fontSize": 12
        },
        "nameGap": 15,
        "axisLabel": {
            "interval": 0,
            "showMaxLabel": true,
            "showMinLabel": true,
            "show": true,
            "textNumber": "auto",
            "textStyle": {
                "color": "#bcd3eb",
                "fontSize": 12
            },
            "rotate": 0
        },
        "axisLine": {
            "interval": 0,
            "lineStyle": {
                "color": "#5e6975",
                "width": 1
            }
        },
        "axisTick": {
            "interval": 0,
            "show": true,
            "lineStyle": {
                "color": "#cccccc",
                "width": 0,
                "type": "dotted"
            },
            "length": 0
        },
        "splitArea": {
            "interval": 0,
            "show": false,
            "areaStyle": {}
        },
        "splitLine": {
            "interval": 0,
            "lineStyle": {
                "color": "#5e6975",
                "width": 1,
                "type": "solid"
            }
        },
        "min": null,
        "max": null,
        "splitNumber": 5
    }],
    "series": [
        {
            "debarwidthtype": "auto",
            "name": "Type1",
            "type": "bar3d",
            // "barType": "cylinder",
            "barType": "cube",
            "barGap": "30%",
            "barCategoryGap": "30",
            "indexAxis": "1",
            "barWidth": 60,
            "barLength": 60,
            "itemStyle": {
                "normal": {
                    "lineStyle": {
                        "width": 3
                    },
                    "colArr": ["transparent", "transparent"],
                    "borderColor": "auto",
                    "borderWidth": 0,
                    "borderType": "solid",
                    "barBorderRadius": 0,
                    // opacity: 0.5
                }
            },
            "label": {
                "show": true,
                "position": "insideTop",
                //top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
                "positionShpt": 0,
                "textStyle": {
                    "color": "purple",
                    "fontSize": 20,
                    "fontWeight": "bold"
                }
            },
            "particleStyle": "style_1",
            "particle": {
                "show": false,
                // "time": 5,
                "time": [1, 40],
                "minTime": 4,
                "maxTime": 6,
                "color": "#ffffff",
                // "imgPath": "/analystui/static/images/l1.03e5.png",
                "imgPath": particImg,//"../assets/l1.03e5.png",
                "imgWidth": 40,
                "imgHeight": 360
            },
            "lightStyle": "style_1",
            "light": {
                "show": true,
                "time": [1, 40],
                "minTime": 4,
                "maxTime": 6,
                "color": "#ffffff",
                "imgPath": lightcImg,
                "imgWidth": 55,
                "imgHeight": 360,
                "animeType": "up",
                "offset": [0, 0]
            },
            "background": {
                "show": false,
                "itemStyle": {
                    // color: 'red',
                    "color": {
                        "x": 0,
                        "y": 0,
                        "x2": 0,
                        "y2": 1,
                        "type": "linear",
                        "global": false,
                        "colorStops": [{
                            "offset": 0,
                            "color": "rgba(255, 1, 0, 0.5)"
                        }, {
                            "offset": 1,
                            "color": "rgba(255, 1, 0, 0.5)"
                        }]
                    },
                    "borderColor": "#ffffff",
                    "borderWidth": 0,
                    "borderType": "solid"
                }
            },
            "data": [-23.2, 23.2],
            // "data": [23.2, 25.6, 76.7, 135.6, 162.2],
            "yAxisIndex": 0,
            "clickable": true,
            "markPointStatus": true,
            "markPoint": {
                "symbol": "none",
                "data": [],
                "itemStyle": {
                    "normal": {
                        "label": {
                            "fontSize": 12
                        }
                    },
                    "emphasis": {
                        "label": {
                            "fontSize": 12
                        }
                    }
                }
            },
            "markLine": {
                "symbol": "none",
                "data": []
            },
            "thresholdLineShow": false,
            "emphasis": {
                "itemStyle": {
                    // "color": "#1473dc",
                    // "color": "red",
                    color: {
                        "x": 0,
                        "y": 0,
                        "x2": 0,
                        "y2": 1,
                        "type": "linear",
                        "global": false,
                        "colorStops": [{
                            "offset": 0,
                            // "color": "#25c640"
                            "color": "#1473dc"
                        }, {
                            "offset": 1,
                            "color": "#84bff5"
                            // "color": "#a2f5ae"
                            // "color": "rgba(255, 255, 255, 0)"
                        }]
                    },
                    borderWidth: 0,
                    borderColor: '#000',
                    borderType: 'solid',
                    borderRadius: 10,
                    shadowBlur: 0,
                    shadowColor: 'red',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    opacity: 1,
                },
                label: {
                    show: false,
                    color: 'red'
                }
            },
        },
        {
            "debarwidthtype": "auto",
            "name": "Type2",
            "type": "bar3d",
            "barType": "cube",
            "barGap": "30%",
            "barCategoryGap": "30",
            "yAxisIndex": "0",
            "indexAxis": "1",
            "barWidth": 30,
            "barLength": 15,
            "itemStyle": {
                "normal": {
                    "label": {
                        "show": true,
                        "position": "top",
                        "positionShpt": 0,
                        "textStyle": {
                            "color": "auto",
                            "fontSize": 12,
                            "fontWeight": "normal"
                        }
                    },
                    "lineStyle": {
                        "width": 3
                    },
                    "colArr": ["transparent", "transparent"],
                    "borderColor": "auto",
                    "borderWidth": 0,
                    "borderType": "solid",
                    "barBorderRadius": 0
                }
            },
            "particleStyle": "style_1",
            "particle": {
                "show": true,
                "time": 5,
                "minTime": 4,
                "maxTime": 6,
                "color": "#ffffff",
                "imgPath": "/analystui/static/images/l1.03e5.png",
                "imgWidth": 40,
                "imgHeight": 360
            },
            "lightStyle": "style_3",
            "light": {
                "show": true,
                "time": 5,
                "minTime": 4,
                "maxTime": 6,
                "color": "#ffffff",
                "imgPath": ["/analystui/static/images/p3bu_25d.f867.png", "/analystui/static/images/p3bd_25d.0098.png"],
                "imgWidth": 55,
                "imgHeight": 360,
                "animeType": "up",
                "offset": [0, 0]
            },
            "background": {
                "show": false,
                "itemStyle": {
                    "color": {
                        "x": 0,
                        "y": 0,
                        "x2": 0,
                        "y2": 1,
                        "type": "linear",
                        "global": false,
                        "colorStops": [{
                            "offset": 0,
                            "color": "rgba(255,255,255,0.4)"
                        }, {
                            "offset": 1,
                            "color": "rgba(255,255,255,0.4)"
                        }]
                    },
                    "borderColor": "#ffffff",
                    "borderWidth": 0,
                    "borderType": "solid"
                }
            },
            "data": [28.7, 70.7, 175.6, 182.2, 48.7],
            "markPointStatus": true,
            "markPoint": {
                "symbol": "none",
                "data": [],
                "itemStyle": {
                    "normal": {
                        "label": {
                            "fontSize": 12
                        }
                    },
                    "emphasis": {
                        "label": {
                            "fontSize": 12
                        }
                    }
                }
            },
            "markLine": {
                "symbol": "none",
                "data": []
            },
            "thresholdLineShow": false,
            "emphasis": {
                "itemStyle": {
                    "color": "red",
                    borderColor: '#000',
                    borderWidth: 1
                },
            },
        }
    ],
    "color": [{
        "x": 0,
        "y": 0,
        "x2": 0,
        "y2": 1,
        "type": "linear",
        "global": false,
        "colorStops": [{
            "offset": 0,
            "color": "#1473dc"
            // "color": "rgba()"
        }, {
            "offset": 1,
            "color": "#84bff5"
        }]
    }, {
        "x": 0,
        "y": 0,
        "x2": 0,
        "y2": 1,
        "type": "linear",
        "global": false,
        "colorStops": [{
            "offset": 0,
            "color": "#25c640"
        }, {
            "offset": 1,
            "color": "#a2f5ae"
        }]
    }, {
        "x": 0,
        "y": 0,
        "x2": 0,
        "y2": 1,
        "type": "linear",
        "global": false,
        "colorStops": [{
            "offset": 0,
            "color": "#b2ad0b"
        }, {
            "offset": 1,
            "color": "#eeeb69"
        }]
    }, {
        "x": 0,
        "y": 0,
        "x2": 0,
        "y2": 1,
        "type": "linear",
        "global": false,
        "colorStops": [{
            "offset": 0,
            "color": "#d33f2b"
        }, {
            "offset": 1,
            "color": "#f79386"
        }]
    }, {
        "x": 0,
        "y": 0,
        "x2": 0,
        "y2": 1,
        "type": "linear",
        "global": false,
        "colorStops": [{
            "offset": 0,
            "color": "#0da3bf"
        }, {
            "offset": 1,
            "color": "#83e3f4"
        }]
    }, {
        "x": 0,
        "y": 0,
        "x2": 0,
        "y2": 1,
        "type": "linear",
        "global": false,
        "colorStops": [{
            "offset": 0,
            "color": "#9133e1"
        }, {
            "offset": 1,
            "color": "#d5a6f8"
        }]
    }, {
        "x": 0,
        "y": 0,
        "x2": 0,
        "y2": 1,
        "type": "linear",
        "global": false,
        "colorStops": [{
            "offset": 0,
            "color": "#2b57d5"
        }, {
            "offset": 1,
            "color": "#9fb5f0"
        }]
    }, {
        "x": 0,
        "y": 0,
        "x2": 0,
        "y2": 1,
        "type": "linear",
        "global": false,
        "colorStops": [{
            "offset": 0,
            "color": "#1bc18e"
        }, {
            "offset": 1,
            "color": "#7fe9c9"
        }]
    }],
    "maxSeriesStyle": "0",
    "barType": "cube",
    "cycleRadius": 15,
    "allowDrill": "off",
    "returnColor": "#36383c",
    "bar_direction": "vertical",
    "themeHighColor": "#2e8ae5",
    "themeTextColor": "#bcd3eb",
    "themeLineColor": "#5e6975",
    // "emphasis": {
    //     "itemStyle": {
    //         "color": "#2e8ae5"
    //     },
    //     label: {
    //         show: true,
    //         color: 'purple'
    //     }
    // },
    "id": "a16310908594532",
    "chartType": "_echarts3",
    "textStyle": {},
    "backgroundColor": "rgba(0, 0, 0, 0)",
    "saveStylTimeStamp": 1631090995000,
    "changeTheme": null,
    "intialSeriesTs": {
        "debarwidthtype": "auto",
        "name": "Type1",
        "type": "bar3d",
        "barType": "cube",
        "barGap": "30%",
        "barCategoryGap": "30",
        "indexAxis": "1",
        "barWidth": 15,
        "barLength": 15,
        "itemStyle": {
            "normal": {
                "label": {
                    "show": false,
                    "position": "top",
                    "positionShpt": 0,
                    "textStyle": {
                        "color": "auto",
                        "fontSize": 12,
                        "fontWeight": "normal"
                    }
                },
                "lineStyle": {
                    "width": 3
                },
                "colArr": ["transparent", "transparent"],
                "borderColor": "auto",
                "borderWidth": 0,
                "borderType": "solid",
                "barBorderRadius": 0
            }
        },
        "particleStyle": "style_1",
        "particle": {
            "show": false,
            "time": 5,
            "minTime": 4,
            "maxTime": 6,
            "color": "#ffffff",
            "imgPath": "/analystui/static/images/l1.03e5.png",
            "imgWidth": 40,
            "imgHeight": 360
        },
        "lightStyle": "style_1",
        "light": {
            "show": false,
            "time": 5,
            "minTime": 4,
            "maxTime": 6,
            "color": "#ffffff",
            "imgPath": ["/analystui/static/images/p1bu_25d.0d1d.png", "/analystui/static/images/p1bd_25d.5042.png"],
            "imgWidth": 55,
            "imgHeight": 360,
            "animeType": "up",
            "offset": [0, 0]
        },
        "background": {
            "show": false,
            "itemStyle": {
                "color": {
                    "x": 0,
                    "y": 0,
                    "x2": 0,
                    "y2": 1,
                    "type": "linear",
                    "global": false,
                    "colorStops": [{
                        "offset": 0,
                        "color": "rgba(255,255,255,0.4)"
                    }, {
                        "offset": 1,
                        "color": "rgba(255,255,255,0.4)"
                    }]
                },
                "borderColor": "#ffffff",
                "borderWidth": 0,
                "borderType": "solid"
            }
        },
        "data": [23.2, 25.6, 76.7, 135.6, 162.2],
        "yAxisIndex": 0,
        "clickable": true,
        "markPointStatus": true,
        "markPoint": {
            "symbol": "none",
            "data": [],
            "itemStyle": {
                "normal": {
                    "label": {
                        "fontSize": 12
                    }
                },
                "emphasis": {
                    "label": {
                        "fontSize": 12
                    }
                }
            }
        },
        "markLine": {
            "symbol": "none",
            "data": []
        },
        "emphasis": {
            "itemStyle": {
                "color": "#1473dc"
            }
        },
    },
    "_barWidth": [true, true],
    "_lineWidth": [false, false],
    "_showArea": [false, false],
    "_buttonActive": true,
    "_buttonNone": false,
    "_chartRefresh": false,
    "_dimension": [],
    "_num": 0,
    "_selectDimention": {
        "": true
    },
    "_selectIndex": [],
    "legendRelationship": {},
    "thresholdList": [{
        "uuid": 1631091009977,
        "id": "1.2389329176537789",
        "type": "yAxis",
        "direction": "yAxis",
        "name": "阈值线",
        "lineValueType": "auto",
        "lineSymbol": "none",
        "symbolIcon": "none",
        "symbolSize": 12,
        "svgSymbol": "",
        "value": "0",
        "itemStyle": {
            "normal": {
                "color": "#ccc"
            }
        },
        "lineValueTypeArr": [{
            "selectId": "min",
            "label": "最小值"
        }, {
            "selectId": "max",
            "label": "最大值"
        }, {
            "selectId": "average",
            "label": "平均值"
        }, {
            "selectId": "auto",
            "label": "自定义"
        }]
    }]
}

const barOption = {
    color: [
        {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
                "offset": 0,
                "color": "#1473dc"
            }, {
                "offset": 1,
                "color": "#84bff5"
            }]
        }, {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
                "offset": 0,
                "color": "#25c640"
            }, {
                "offset": 1,
                "color": "#a2f5ae"
            }]
        }, {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
                "offset": 0,
                "color": "#b2ad0b"
            }, {
                "offset": 1,
                "color": "#eeeb69"
            }]
        }, {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
                "offset": 0,
                "color": "#d33f2b"
            }, {
                "offset": 1,
                "color": "#f79386"
            }]
        }, {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
                "offset": 0,
                "color": "#0da3bf"
            }, {
                "offset": 1,
                "color": "#83e3f4"
            }]
        }, {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
                "offset": 0,
                "color": "#9133e1"
            }, {
                "offset": 1,
                "color": "#d5a6f8"
            }]
        }, {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
                "offset": 0,
                "color": "#2b57d5"
            }, {
                "offset": 1,
                "color": "#9fb5f0"
            }]
        }, {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{
                "offset": 0,
                "color": "#1bc18e"
            }, {
                "offset": 1,
                "color": "#7fe9c9"
            }]
        }
    ],
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
        type: 'value',
    },
    legend: {
        show: true
    },
    emphasis: {
        itemStyle: {
            color: 'skyblue'
        }
    },
    series: [
        {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            name: 'bar',
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.3)'
                }
            },
            showBackground: false,
            backgroundStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' },
                ]),
                borderWidth: 0,
                borderColor: 'red',
            },
        },
        {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            name: 'bar2',
            showBackground: false,
            backgroundStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' },
                ]),
                borderWidth: 0,
                borderColor: 'red',
            },
        },
        // {
        //     data: [120, 200, 150, 80, 70, 110, 130],
        //     type: 'line',
        // },
    ],
    toolbox: {
        feature: {
            magicType: {
                type: ['stack', 'tiled'],
            },
            dataView: {},
        },
    }
};

const pieOption = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        show: false,
        data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',
            radius: ['35%', '55%'],
            label: {
                position: 'inner',
                fontSize: 14,
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 50, name: '搜索引擎' },
                { value: 50, name: '直达1' },
                { value: 13, name: '直达2' },
                { value: 50, name: '直达3' },
                // { value: 679, name: '营销广告' }
            ]
        },
        {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',
            radius: ['60%', '80%'],
            label: {
                position: 'inner',
                fontSize: 14,
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 50, name: '搜索引擎' },
                { value: 50, name: '直达' },
                // { value: 679, name: '营销广告' }
            ]
        },
    ]
};

const funnel3d = {
    "animationDuration": 1,
    "animation": true,
    "addDataAnimation": true,
    "animationEasing": "bounceOut",
    "effect": {
        "show": false,
        "time": 2,
        "type": "pie",
        "method": "scale",
        "labelShow": true
    },
    "animationTime": 10,
    "title": {
        "show": false,
        "text": "漏斗图",
        "subtext": "",
        "x": "left",
        "y": "top",
        "textStyle": {
            "fontSize": 24,
            "fontWeight": "normal",
            "color": "#bcd3eb"
        },
        "padding": [15, 0, 0, 30]
    },
    "tooltip": {
        "formatter": "{a} <br/>{b} : {c}",
        "trigger": "item",
        "show": false,
        "borderRadius": 3,
        "padding": 5,
        "triggerOn": "mousemove",
        "borderWidth": 1,
        "backgroundColor": "rgba(0, 0, 0, 0.8)",
        "borderColor": "#000000",
        "textStyle": {
            "color": "#ffffff",
            "fontSize": 12
        },
        "axisPointer": {
            "type": "none"
        }
    },
    "_paddingx": "right",
    "_paddingy": "middle",
    "legend": {
        "data": ["Type1", "Type2", "Type3", "Type4", "Type5"],
        "show": true,
        "showValue": false,
        "rowNum": 4,
        "itemGap": 10,
        "rowGap": 10,
        "colGap": 10,
        "itemWidth": 12,
        "itemHeight": 12,
        "orient": "vertical",
        "backgroundColor": "rgba(255,255,255,0)",
        "textStyle": {
            "fontSize": 12,
            "fontWeight": "normal",
            "textNumber": 10,
            "valueNumber": 10,
            "color": "auto"
        },
        "x": "right",
        "y": "center",
        "selectedMode": true
    },
    "calculable": false,
    "toolbox": {
        "show": true,
        "toolZoomBackground": "#ffffff",
        "feature": {
            "mark": {
                "show": false
            },
            "dataView": {
                "show": false,
                "readOnly": false
            },
            "restore": {
                "show": false
            },
            "saveAsImage": {
                "show": false,
                "title": "保存为图片",
                "excludeComponents": ["toolbox"],
                "lang": ["点击保存"],
                "icon": "image://http://116.63.168.191:8184/analystui/static/theme/common/imgs/saveIcon.png"
            },
            "myToolZoom": {
                "show": false,
                "title": "放大预览",
                "icon": "image://http://116.63.168.191:8184/analystui/static/theme/common/imgs/zoomBtn0.png"
            },
            "transparent": {
                "show": true,
                "title": " ",
                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQjE4MzkxNkI1M0QxMUU3QkFEQURFMDg3MjgyQTU1RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQjE4MzkxN0I1M0QxMUU3QkFEQURFMDg3MjgyQTU1RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJCMTgzOTE0QjUzRDExRTdCQURBREUwODcyODJBNTVGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJCMTgzOTE1QjUzRDExRTdCQURBREUwODcyODJBNTVGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Qa37swAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII="
            }
        }
    },
    "series": [{
        "name": "漏斗图",
        // "type": "funnel",
        "type": "funnel3d",
        // "itemStyle": {
        //     "emphasis": {
        //         "color": "#2e8ae5",
        //         "labelLine": {
        //             "lineStyle": {
        //                 "color": "#2e8ae5"
        //             }
        //         }
        //     }
        // },
        "labelLine": {
            "normal": {
                "show": true,
                "length": 10
            }
        },
        "label": {
            "normal": {
                "position": "right",
                "textStyle": {
                    "color": "auto",
                    "fontSize": 12,
                    "fontWeight": "normal"
                },
                "show": true,
                "formatter": "{b|{b} :} {c|{c}}",
                "borderColor": "#777",
                "showValue": true,
                "showLabel": true,
                "showPer": false,
                "rich": {
                    "b": {
                        "align": "left",
                        "color": "",
                        "fontSize": 12,
                        "fontWeight": "normal",
                        "padding": 2
                    },
                    "c": {
                        "align": "left",
                        "color": "",
                        "fontSize": 12,
                        "fontWeight": "normal"
                    },
                    "d": {
                        "align": "left",
                        "color": "",
                        "fontSize": 12,
                        "padding": 2,
                        "fontWeight": "normal"
                    }
                }
            },
            // "emphasis": {
            //     "position": "right",
            //     "textStyle": {
            //         "color": "auto",
            //         "fontSize": 12,
            //         "fontWeight": "normal"
            //     },
            //     "show": false,
            //     "formatter": "{b|{b} :} {c|{c}}",
            //     "borderColor": "#777",
            //     "showValue": true,
            //     "showLabel": true,
            //     "showPer": false,
            //     "rich": {
            //         "b": {
            //             "align": "left",
            //             "color": "#2e8ae5",
            //             "fontSize": 12,
            //             "fontWeight": "normal",
            //             "padding": 2
            //         },
            //         "c": {
            //             "align": "left",
            //             "color": "#2e8ae5",
            //             "fontSize": 12,
            //             "fontWeight": "normal"
            //         },
            //         "d": {
            //             "align": "left",
            //             "color": "#2e8ae5",
            //             "fontSize": 12,
            //             "padding": 2,
            //             "fontWeight": "normal"
            //         }
            //     },
            //     "color": "#2e8ae5"
            // }
        },
        "data": [
            {
                "value": 95,
                "name": "Type1"
            },
            {
                "value": 70,
                "name": "Type2"
            },
            {
                "value": 50,
                "name": "Type3"
            },
            {
                "value": 35,
                "name": "Type4"
            },
            {
                "value": 25,
                "name": "Type5"
            }
        ],
        emphasis: {
            label: {
                fontSize: 20,
                color: 'red',
                borderColor: 'blue',
                borderWidth: 2
            },
            "labelLine": {
                "lineStyle": {
                    "color": "#2e8ae5",
                    width: 10
                }
            },
            itemStyle: {
                color: 'red'
            }
        },
        isModelView: false,
        "blockType": "cubeStraight", // cone 曲线圆锥 cubeStraight 金字塔 coneStraight 直线圆锥 cube 立方体
        "computeRule": "equalHeight",
        "sort": "ascending", // ascending 生序     descending 降序
        "dataLabelType": "inLine",
        "x": 30,
        "x2": 100,
        "y": 50,
        "y2": 70,
        "startColorStr": "",
        "endColorStr": ""
    }],
    "color": ["#1473dc", "#25c640", "#b2ad0b", "#d33f2b", "#0da3bf", "#9133e1", "#2b57d5", "#1bc18e"],
    "startColor": ["#379CF8", "#AFE37B", "#F9B32A", "#c4a9f8", "#83e5e5", "#f288bc", "#ff8f83", "#9956AC"],
    "legendLabelLimit": 10,
    "themeHighColor": "#2e8ae5",
    "themeTextColor": "#bcd3eb",
    "themeLineColor": "#5e6975",
    "id": "a16315914852153",
    "chartType": "_echarts3",
    "newWidth": 1,
    "newHeight": 274,
    "backgroundColor": "rgba(0, 0, 0, 0)",
    "textStyle": {}
}

const funnel = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
        feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        data: [
            '展现',
            //  '点击',
            // '访问', '咨询', '订单'
        ]
    },

    series: [
        {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            //x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
                show: true,
                // position: 'inside'
            },
            labelLine: {
                length: 10,
                lineStyle: {
                    width: 1,
                    type: 'solid'
                }
            },
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
            },
            emphasis: {
                label: {
                    fontSize: 20,
                    color: 'red',
                    borderColor: 'blue',
                    borderWidth: 1
                },
                "labelLine": {
                    "lineStyle": {
                        "color": "#2e8ae5",
                        width: 10
                    }
                },
                itemStyle: {
                    color: 'red'
                }
            },
            data: [
                { value: 60, name: '访问' },
                { value: 40, name: '咨询' },
                { value: 20, name: '订单' },
                { value: 80, name: '点击' },
                { value: 100, name: '展现' }
            ]
        }
    ]
};


export {
    bar3dOption,
    funnel3d,
    funnel,
    barOption,
    pieOption
}
