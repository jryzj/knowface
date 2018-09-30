/* Practice by JERRY, created on 2018/9/13*/
const crypto = require('crypto');


module.exports ={
    matchProgress : {}, // sessionID : [开始的时间戳，完成数量]
    matchSessionLife : 100000, //10分钟，
    //清理已经过期sessionID,以免matchProgress不断的变大
    matchProgressChk : function(time){
        setInterval(function(){
            console.log("matchProgressChk");
            for (let m in module.exports.matchProgress){
                let deadtime = module.exports.matchProgress[m][0] + module.exports.matchSessionLife;
                if (Number(new Date()) > deadtime){
                    delete module.exports.matchProgress.m;
                }
            }
        },time);
    },
    photoQty : 0,
    cryptoKey :"it's kface AI face match",
    cryptoAlro : "aes192",
    // iv : crypto.randomBytes(16)
    iv : "2018092621252702"
}