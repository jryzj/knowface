/* Practice by JERRY, created on 2018/9/6*/

//1、创建一个客户端
const AipFaceClient = require("baidu-aip-sdk").face;

// 设置APPID/AK/SK
// let APP_ID = "11524495";
// let API_KEY = "8detGa2ANmUYgeZpHcsSjihv";
// let SECRET_KEY = "QF4XuqNGe9ZMTmDB9N14Rb8BCzy3WisE";

// 新建一个对象，建议只保存一个对象调用服务接口
const baiduClient = new AipFaceClient("11524495", "8detGa2ANmUYgeZpHcsSjihv", "QF4XuqNGe9ZMTmDB9N14Rb8BCzy3WisE");

exports.Client =baiduClient;

/*
//检测到10个脸的json结构
{
    "error_code": 0,
    "error_msg": "SUCCESS",
    "log_id": 9420189943500,
    "timestamp": 1536226952,
    "cached": 0,
    "result": {
    "face_num": 10,
        "face_list": [
        {
            "face_token": "8613292e0c0c449f148147b94cc03ffa",
            "location": {
                "left": 2990.251221,
                "top": 1437.301514,
                "width": 142,
                "height": 130,
                "rotation": 4
            },
            "face_probability": 1,
            "angle": {
                "yaw": -1.404231906,
                "pitch": 3.472654581,
                "roll": 4.10166502
            }
        },
        {
            "face_token": "02cd0174101e5befb68e032ee5506621",
            "location": {
                "left": 3957.306641,
                "top": 1435.343384,
                "width": 139,
                "height": 127,
                "rotation": 0
            },
            "face_probability": 1,
            "angle": {
                "yaw": 9.595050812,
                "pitch": 3.885976315,
                "roll": 0.1785209626
            }
        },
        {
            "face_token": "c3b7fc6307a91bb6a61f4aafa971c238",
            "location": {
                "left": 4419.623047,
                "top": 1550.394043,
                "width": 140,
                "height": 126,
                "rotation": 0
            },
            "face_probability": 1,
            "angle": {
                "yaw": 10.26765823,
                "pitch": 0.1504504085,
                "roll": 1.815764785
            }
        },
        {
            "face_token": "b5fac6ccd6b3a517c214431e65392c53",
            "location": {
                "left": 4220.953613,
                "top": 1315.906128,
                "width": 132,
                "height": 127,
                "rotation": -1
            },
            "face_probability": 1,
            "angle": {
                "yaw": 9.539093018,
                "pitch": -1.721653461,
                "roll": -0.07951054722
            }
        },
        {
            "face_token": "cf2a68c42096c229cc258c6f39cd6455",
            "location": {
                "left": 1566.029785,
                "top": 1474.690674,
                "width": 129,
                "height": 128,
                "rotation": 0
            },
            "face_probability": 0.9901455045,
            "angle": {
                "yaw": 11.01877594,
                "pitch": -6.071213245,
                "roll": 1.423250556
            }
        },
        {
            "face_token": "5269fbdd62029b8341e54453137c317a",
            "location": {
                "left": 1894.549194,
                "top": 1313.491211,
                "width": 125,
                "height": 124,
                "rotation": -2
            },
            "face_probability": 0.9700491428,
            "angle": {
                "yaw": 11.9900074,
                "pitch": -5.045687675,
                "roll": -1.220897079
            }
        },
        {
            "face_token": "34bad7f00193eca26da910dec1d29b9f",
            "location": {
                "left": 2072.437988,
                "top": 1437.125244,
                "width": 131,
                "height": 116,
                "rotation": 0
            },
            "face_probability": 1,
            "angle": {
                "yaw": 8.699928284,
                "pitch": -2.351233006,
                "roll": 0.5813785195
            }
        },
        {
            "face_token": "16e74f5d8076aee74c47ee7605335e5d",
            "location": {
                "left": 2532.286865,
                "top": 1538.737915,
                "width": 124,
                "height": 121,
                "rotation": 2
            },
            "face_probability": 0.8757154942,
            "angle": {
                "yaw": 8.449925423,
                "pitch": -4.223428726,
                "roll": 3.803144217
            }
        },
        {
            "face_token": "f6a0cf4981a2ddf3660a743d65e3ede0",
            "location": {
                "left": 2831.527832,
                "top": 1269.972778,
                "width": 131,
                "height": 114,
                "rotation": 0
            },
            "face_probability": 0.8766586185,
            "angle": {
                "yaw": 5.341641426,
                "pitch": 2.371190786,
                "roll": 0.5178669095
            }
        },
        {
            "face_token": "d1bc36e9aa86b2d3bfe4a21efd567d20",
            "location": {
                "left": 575.2229004,
                "top": 1453.759277,
                "width": 127,
                "height": 117,
                "rotation": 3
            },
            "face_probability": 0.9535424709,
            "angle": {
                "yaw": 21.97409058,
                "pitch": 4.225846767,
                "roll": 5.390429974
            }
        }
    ]
}
}*/
