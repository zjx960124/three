import { resolve } from 'path';
import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';
require('./OrbitControls');

class Boxs {
  constructor(el) {
    this.el = el;
    this.init();
  }

  init() {
    // 第一步新建一个场景
    this.scene = new THREE.Scene();
    // 设置模型
    this.setModel();
    // 设置光源
    this.setLight();
    // 设置相机
    this.serCamera();
    // 设置渲染器
    this.setRenderer();
    // 添加手柄
    this.setControl();
  }

  setModel() {
    let geometry = new THREE.BoxGeometry(100, 100, 100); // 立方体对象
    let material = new THREE.MeshLambertMaterial({
      color: 0x0000ff,
    }); //材质对象Material
    this.mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    this.scene.add(this.mesh);
  }

  setLight() {
    let point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    this.scene.add(point); //点光源添加到场景中
    //环境光
    let ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);
  }

  serCamera() {
    let width = window.innerWidth; //窗口宽度
    let height = window.innerHeight; //窗口高度
    let k = width / height; //窗口宽高比
    let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(200, 300, 200); //设置相机位置
    camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
    this.camera = camera;
    this.width = width;
    this.height = height;
  }

  setControl() {
    let controls = new THREE.OrbitControls(
      this.camera,
      document.getElementById(this.el)
    ); //创建控件对象
    controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera);
    }); //监听鼠标、键盘事件
    this.controls = controls;
  }

  setRenderer() {
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.width, this.height); //设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    console.log('插入');
    document.getElementById(this.el).appendChild(renderer.domElement); //body元素中插入canvas对象
    //执行渲染操作   指定场景、相机作为参数
    renderer.render(this.scene, this.camera);
    this.renderer = renderer;
    // this.timer = setInterval(() => {
    //   render.call(this);
    // }, 200);
  }
}

function render() {
  this.renderer.render(this.scene, this.camera);
  this.mesh.rotateY(0.2);
}

export { Boxs };
