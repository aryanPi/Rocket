TweenMax.fromTo('.fire',
.03,
{ x: -.5, y: -.4 },
{ x: .5, y: .4, repeat: -1, yoyo: true });

const tl = new TimelineMax({ repeat: -1 });
const tl_sky = new TimelineMax({ repeat: -1 });
const planetsTiming = 4;
const meteorTiming = 2;
const planetPos = { from: '-30vh',
  to: '130vh',
  ease: 'Power0.easeNone' };

tl_sky.fromTo('.sky', 12,
{ transform: 'translateY(-100vh)' },
{ transform: 'translateY(0)', ease: Power0.easeNone });
tl.to('.rocket', 3,
{ transform: 'translateY(-3vh)', ease: Expo.easeOut }, '+=1.5') //INSERT ROCKET
.fromTo('.meteor', meteorTiming,
{ transform: "translate3d(-50px,-50px,0)" },
{ transform: "translate3d(-120vw,80vh,0)",
  ease: Power0.easeNone })
// .fromTo('.planet-1', planetsTiming,
//         {transform: `translateY(${planetPos.from})`},
//         {transform: `translateY(${planetPos.to})`, 
//          ease: planetPos.ease},
//         '-=2')
// .fromTo('.planet-2', planetsTiming,
//         {transform: `translateY(${planetPos.from})`},
//         {transform: `translateY(${planetPos.to})`, 
//          ease: planetPos.ease},
//         '-=2.8')
// .fromTo('.planet-3', planetsTiming,
//         {transform: `translateY(${planetPos.from})`},
//         {transform: `translateY(${planetPos.to})`, 
//          ease: planetPos.ease},
//         '-=2.8')
// .fromTo('.planet-4', planetsTiming,
//         {transform: `translateY(${planetPos.from})`},
//         {transform: `translateY(${planetPos.to})`, 
//          ease: planetPos.ease},
//         '-=2.8')
.fromTo('.meteor', meteorTiming,
{ transform: "translate3d(-50px,-50px,0)" },
{ transform: "translate3d(-120vw,80vh,0)",
  ease: planetPos.ease },
'-=2').
fromTo('.fire', .4,
{ scaleY: .7 },
{ scaleY: 1.5 }) //SCALE THE FLAMES
.add(() => tl_sky.timeScale(30), '-=.4') //SPEED UP THE SKY
.to('.rocket', 2,
{ transform: 'translateY(-130vh)', ease: Power3.easeOut },
'+=5') //HIDE THE Rocket
.fromTo('.text', .8,
{ opacity: 0, transform: 'translateY(100px)' },
{ opacity: 1, transform: 'translateY(0)' }, '-=1.8').
to('.text', .8,
{ opacity: 0, transform: 'translateY(-100px)' }, '+=1').
add(() => TweenMax.to(tl_sky, 1.5,
{ timeScale: 2 }), '+=.5'); //RETURN SKY TO THE ORIGINAL SPEED

tl_sky.timeScale(1);