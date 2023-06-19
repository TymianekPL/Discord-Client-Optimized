import Discord from './Discord/index';
const user = new Discord("Njc5MjY4MDkxNjY1OTczMjU4.GYX5YZ.sT2r5qt5rmn4NoMmbmet9WlJDC07M1YJIE7lt8");

user.subscribe("READY", ev => {
     console.log((ev as any).user);
});