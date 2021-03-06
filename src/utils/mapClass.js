import * as THREE from "three";
import * as d3 from 'd3';
require('./OrbitControls');
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';
class Map {
    constructor() {
        this.init()
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
        // this.addFont();
        this.addHelper();
    }

    // 加载地图数据
    loadMapData() {
        const loader = new THREE.FileLoader()
        loader.load('/china.json', (data) => {
            console.log(data)
            const jsondata = JSON.parse(data);
            this.generateGeometry(jsondata)
        })
    }

    generateGeometry(jsondata) {
        console.log('初始化地图')
        // 初始化一个地图对象
        this.map = new THREE.Object3D()
        // 墨卡托投影转换
        const projection = d3
          .geoMercator()
          .center([104.0, 37.5])
          .translate([0, 0]);

        jsondata.features.forEach((elem) => {
            // 定一个省份3D对象
            const province = new THREE.Object3D();
            // 每个的 坐标 数组
            const coordinates = elem.geometry.coordinates;
            console.log(coordinates);
            // 循环坐标数组
            coordinates.forEach((multiPolygon) => {
                console.log(multiPolygon)
                multiPolygon.forEach((polygon) => {
                    const shape = new THREE.Shape();
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 'white',
                    });
                    const lineGeometry = new THREE.BufferGeometry();
                    // const oldGeometry = new THREE.Geometry();
                    for (let i = 0; i < polygon.length; i++) {
                        console.log(polygon[i]);
                        const [x, y] = projection(polygon[i]);
                        console.log(x, y);
                        if (i === 0) {
                            shape.moveTo(x, -y)
                        }
                        shape.lineTo(x, -y);
                        var vertices = new Float32Array([
                            x, -y //顶点1坐标
                        ]);
                        // oldGeometry.vertices.push(new THREE.Vector3(x, -y, 5));
                        lineGeometry.addAttribute( 'position', new THREE.Vector3( x, -y, 5 ) );
                        // lineGeometry.addAttribute('position', new THREE.BufferAttribute([x, -y, 5], 3))
                    }

                    console.log(lineGeometry);

                    const extrudeSettings = {
                        depth: 10,
                        bevelEnabled: false,
                    };

                    const geometry = new THREE.ExtrudeGeometry(
                      shape,
                      extrudeSettings
                    );
                    const material = new THREE.MeshBasicMaterial({
                        color: '#2defff',
                        transparent: true,
                        opacity: 0.6,
                    });
                    const material1 = new THREE.MeshBasicMaterial({
                        color: '#3480C4',
                        transparent: true,
                        opacity: 0.5,
                    });

                    const mesh = new THREE.Mesh(geometry, [material, material1]);
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    // 将省份的属性 加进来
                    province.properties = elem.properties;
                    province.add(mesh);
                    province.add(line)
                })
            });
            this.map.add(province)
        });
        this.scene.add(this.map)
    }

    setController() {
        this.controller = new THREE.OrbitControls(
          this.camera,
          document.getElementById('canvas')
        )
    }

    addCube() {
        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshBasicMaterial({ color: 0x50ff22 })
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)
    }

    addFont() {
        const loader = new FontLoader()
        loader.load('../json/alibaba.json', (font) => {
            const geometry = new THREE.TextGeometry('我爱掘金', {
                font: font,
                size: 20,
                height: 5,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5,
            })
            const material = new THREE.MeshBasicMaterial({ color: 0x49ef4 });
            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh)
        })
    }

    addHelper() {
        const helper = new THREE.CameraHelper(this.camera)
        this.scene.add(helper)
    }

    // 新建透视相机
    setCamera() {
        // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
        this.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        )
        this.camera.position.set(0, 0, 120)
        this.camera.lookAt(this.scene.position)
    }
    setRaycaster() {
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.tooltip = document.getElementById('tooltip')
        const onMouseMove = (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
            this.tooltip.style.left = event.clientX + 2 + 'px'
            this.tooltip.style.top = event.clientY + 2 + 'px'
        }

        window.addEventListener('mousemove', onMouseMove, false)
    }

    // 设置渲染器
    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        // 设置画布的大小
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // 设置环境光
    setLight() {
        let ambientLight = new THREE.AmbientLight(191970, 20) // 环境光
        this.scene.add(ambientLight)
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        // 通过摄像机和鼠标位置更新射线
        this.raycaster.setFromCamera(this.mouse, this.camera)
        // 算出射线 与当场景相交的对象有那些
        const intersects = this.raycaster.intersectObjects(
          this.scene.children,
          true
        )
        // 恢复上一次清空的
        if (this.lastPick) {
            this.lastPick.object.material[0].color.set('#2defff')
            this.lastPick.object.material[1].color.set('#3480C4')
        }
        this.lastPick = null
        this.lastPick = intersects.find(
          (item) => item.object.material && item.object.material.length === 2
        )
        if (this.lastPick) {
            this.lastPick.object.material[0].color.set(0xff0000)
            this.lastPick.object.material[1].color.set(0xff0000)
        }
        this.showTip()
        this.render()
    }

    showTip() {
        // 显示省份的信息
        if (this.lastPick) {
            const properties = this.lastPick.object.parent.properties

            this.tooltip.textContent = properties.name

            this.tooltip.style.visibility = 'visible'
        } else {
            this.tooltip.style.visibility = 'hidden'
        }
    }
}

export {
    Map
}
