
GLOBAL.a = 0.1,GLOBAL.b=0.005;
GLOBAL.interval = setInterval(()=>{
GLOBAL.a+=GLOBAL.b;
GLOBAL.multiplier = Math.pow(1.13,GLOBAL.a);
},10)