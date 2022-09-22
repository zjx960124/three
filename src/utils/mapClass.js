import * as THREE from 'three';
import * as d3 from 'd3';
require('./OrbitControls');
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
let indexBol = true;
class Map {
  constructor() {
    this.init();
  }

  init() {
    // 第一步新建一个场景
    this.scene = new THREE.Scene();
    this.activeInstersect = [];
    this.setRenderer();
    this.setCamera();
    this.setController();
    this.setRaycaster();
    this.animate();
    this.loadMapData();
    this.addFont();
    // this.addHelper();
  }

  // 加载地图数据
  loadMapData() {
    const loader = new THREE.FileLoader();
    loader.load('/fj.json', (data) => {
      //   console.log(data);
      const jsondata = JSON.parse(data);
      this.generateGeometry(jsondata);
    });
  }

  generateGeometry(jsondata) {
    console.log('初始化地图');
    // 初始化一个地图对象
    this.map = new THREE.Object3D();
    // 墨卡托投影转换
    const projection = d3
      .geoMercator()
      .center([117.962318, 26.232704])
      .translate([0, 0]);

    jsondata.features.forEach((elem) => {
      // 定一个省份3D对象
      const province = new THREE.Object3D();
      // 每个的 坐标 数组
      const coordinates = elem.geometry.coordinates;
      // 循环坐标数组
      coordinates.forEach((multiPolygon) => {
        multiPolygon.forEach((polygon) => {
          const shape = new THREE.Shape();
          const lineMaterial = new THREE.LineBasicMaterial({
            color: '#076FDC',
            linewidth: 1,
            linecap: 'square',
            linejoin: 'bevel',
          });
          const lineGeometry = new THREE.BufferGeometry();
          // const oldGeometry = new THREE.Geometry();
          const pointsArray = new Array();
          for (let i = 0; i < polygon.length; i++) {
            const [x, y] = projection(polygon[i]);
            if (i === 0) {
              shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
            // var vertices = new Float32Array([
            //   x,
            //   -y, //顶点1坐标
            // ]);
            pointsArray.push(new THREE.Vector3(x, -y, 1.03));
          }

          lineGeometry.setFromPoints(pointsArray);

          const extrudeSettings = {
            depth: 1,
            bevelEnabled: false,
          };

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material = new THREE.MeshBasicMaterial({
            color: '#2A2E2F',
            transparent: true,
            opacity: 1,
          });
          const material1 = new THREE.MeshBasicMaterial({
            color: '#3480C4',
            transparent: true,
            opacity: 0.5,
          });

          const line = new THREE.Line(lineGeometry, lineMaterial);
          const mesh = new THREE.Mesh(geometry, [material, material1]);

          const citys = [
            [118.068102, 24.557377],
            [117.571375, 26.23682],
            [118.914378, 26.286586],
            [117.598971, 24.591027],
            [117.019456, 25.077927],
            [119.503092, 26.708726],
          ];

          /*const cityMaterial = new LineMaterial({
            color: 'red',
            linewidth: 0,
            linejoin: 'bevel',
            opacity: 0,
          });
          cityMaterial.resolution.set(
            window.innerWidth + 100,
            window.innerHeight + 100
          );
          citys.forEach((city) => {
            const [x, y] = projection(city); // 墨卡托投影转化
            let cityGeometry = new LineGeometry();
            cityGeometry.setPositions([x, -y, 2, x, -y, 4]);
            let lines = new Line2(cityGeometry, cityMaterial);
            const div = document.createElement('div');
            div.textContent = '标签3';
            const labelObj = new CSS2DObject(div);
            labelObj.position.x = 0;
            labelObj.position.y = 0;
            labelObj.position.z = 0;
            lines.add(labelObj);
            province.add(lines);
          }); */

          citys.forEach((city) => {
            const [x, y] = projection(city); // 墨卡托投影转化
            let div = document.createElement('div');
            div.className = 'titles';
            div.style.left = x + 12 + 'px';
            div.style.top = -y + 12 + 'px';
          });

          // 将省份的属性 加进来
          province.properties = elem.properties;
          province.add(mesh);
          province.add(line);
        });
      });

      this.map.add(province);
    });

    this.scene.add(this.map);
    this.render();
  }

  setController() {
    this.controller = new THREE.OrbitControls(
      this.camera,
      document.getElementById('canvas')
    );
    // this.controller.enablePan = false; // 禁止拖动
    // this.controller.enableRotate = false;
    this.controller.maxAzimuthAngle = 0;
    this.controller.minAzimuthAngle = 0;
    this.controller.maxPolarAngle = 2.5;
    this.controller.minPolarAngle = 2;
    this.controller.update();
  }

  addCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x50ff22 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  addFont() {
    const loader = new FontLoader();
    loader.load('../json/alibaba.json', (font) => {
      const geometry = new THREE.TextGeometry('福建地图', {
        font: font,
        size: 12,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      const material = new THREE.MeshBasicMaterial({ color: 0x49ef4 });
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    });
  }

  addHelper() {
    const helper = new THREE.CameraHelper(this.camera);
    this.scene.add(helper);
  }

  // 新建透视相机
  setCamera() {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(
      7,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, -80, 120);
    this.camera.lookAt(this.scene.position);
  }
  setRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.tooltip = document.getElementById('tooltip');
    const onMouseMove = (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.tooltip.style.left = event.clientX + 12 + 'px';
      this.tooltip.style.top = event.clientY + 12 + 'px';
    };

    window.addEventListener('mousemove', onMouseMove, false);
  }

  // 设置渲染器
  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('canvas'),
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 设置画布的大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 设置环境光
  setLight() {
    let ambientLight = new THREE.AmbientLight(191970, 20); // 环境光
    this.scene.add(ambientLight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // 通过摄像机和鼠标位置更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 算出射线 与当场景相交的对象有那些
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    // 恢复上一次清空的
    if (this.lastPick) {
      this.lastPick.object.material[0].color.set('#2defff');
      this.lastPick.object.material[1].color.set('#3480C4');
    }
    this.lastPick = null;
    this.lastPick = intersects.find(
      (item) => item.object.material && item.object.material.length === 2
    );
    if (this.lastPick) {
      // this.lastPick.object.material[0].color.set(0xff0000);
      // this.lastPick.object.material[1].color.set(0xff0000);
    }
    this.showTip();
    this.render();
  }

  showTip() {
    // 显示省份的信息
    if (this.lastPick) {
      const properties = this.lastPick.object.parent.properties;

      this.tooltip.textContent = properties.name;

      this.tooltip.style.visibility = 'visible';
    } else {
      this.tooltip.style.visibility = 'hidden';
    }
  }
}

export { Map };
