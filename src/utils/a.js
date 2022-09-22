/**
 * Vector3定义顶点位置坐标数据
 * @param position 定义位置
 * @param color 定义颜色
 * @constructor
 */
const VectorLine2 = (
  positions?: Array<number>,
  colorList?: Array<THREE.Color>,
  color?: any,
  linewidth = 3
): Line2 => {
  let geometry = new LineGeometry(); //声明一个几何体对象Geometry

  const vertices = positions || [
    50,
    0,
    0, //顶点1坐标
    0,
    70,
    0, //顶点2坐标
    80,
    70,
    0, //顶点3坐标
  ];

  //顶点坐标添加到geometry对象

  geometry.setPositions(vertices);

  // Color对象表示顶点颜色数据
  //顶点颜色数据添加到geometry对象
  let baseColorList = [
    new THREE.Color(0x00ff00), //顶点1颜色——绿色,
    new THREE.Color(0xff0000), //顶点2颜色——红色
    new THREE.Color(0x0000ff), //顶点3颜色——蓝色
    //顶点颜色数据添加到geometry对象
  ];

  const colors: Array<number> = [];
  if (colorList) {
    baseColorList = colorList;
  }
  baseColorList?.forEach((color) => {
    colors.push(color.r, color.g, color.b);
  });

  geometry.setColors(colors);

  let material = new LineMaterial({
    color: color ? color : undefined, //线条颜色
    vertexColors: !!colorList, //以顶点颜色为准
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    linewidth,
  }); //材质对象

  // 设置下这个,不然线的宽度还是无效
  material.resolution.set(window.innerWidth + 100, window.innerHeight + 100);
  let line = new Line2(geometry, material); //线条模型对象
  return line;
};


let camera,scene,renderer;
let controls;

window.onload = ()=>{
    init();
    animate();
};

function init() {
    camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,10000);
    camera.position.z = 3000;

    scene = new THREE.Scene();

    // 最外层元素
    const container = document.createElement('div');
    container.className = 'container';
    const objectContainer = new THREE.CSS3DObject(container);
    scene.add(objectContainer);

    objectData.forEach((cardItem,cardIndex)=>{
        // 卡片
        const cardContainer = document.createElement('div');
        cardContainer.style.width = 1448+'px';
        cardContainer.style.height = 750+'px';
        const objectCardContainer = new THREE.CSS3DObject(cardContainer);
        objectContainer.add(objectCardContainer);

        //竖直背景
        const card_bg_vertical = document.createElement('div');
        card_bg_vertical.style.width = cardItem.verticalBg.width+'px';
        card_bg_vertical.style.height = cardItem.verticalBg.height+'px';
        card_bg_vertical.style.background = 'url('+cardItem.verticalBg.url+') no-repeat';
        const objectCardBgVertical = new THREE.CSS3DObject(card_bg_vertical);
        objectCardBgVertical.position.y = 80;
        objectCardContainer.add(objectCardBgVertical);

        // 地面
        const card_groud = document.createElement('div');
        card_groud.style.width = cardItem.ground.width+'px';
        card_groud.style.height = cardItem.ground.height+'px';
        card_groud.style.transformOrigin = 'center top';
        card_groud.style.background = 'url('+cardItem.ground.url+') no-repeat';
        const objectCardGround = new THREE.CSS3DObject(card_groud);
        objectCardGround.position.y = 80;
        objectCardGround.rotation.x = cardItem.ground.rotation;
        objectCardContainer.add(objectCardGround);

        // 元素
        cardItem.things.forEach((item,index)=>{
           const thing = document.createElement('div');
           thing.style.width = item.width+'px';
           thing.style.height = item.height+'px';
           thing.style.background = 'url('+ item.url +') no-repeat';
           const objectThing = new THREE.CSS3DObject(thing);
            objectThing.rotation.x = cardItem.thingsRotation;
            objectThing.position.y = -(index+1)*68;
            objectThing.position.x = item.x;
            objectThing.position.z = -item.y-300;
            objectCardGround.add(objectThing);
        });
    });

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.addEventListener('change',render);

    window.addEventListener('resize',onWindowResize,false);

    render();
}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    render();
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
}

function render(){
    renderer.render(scene,camera);
}
