import 'styles/index.scss';


export default class App {
  init() {
    window.addEventListener('resize', this.onResize.bind(this));

    this.gui = new dat.GUI();
    this.gui.closed = false;
    this.pause = false;
    this.backgroundColor = '#252046';
    this.meshSize = 1;
    this.gutter = { size: this.meshSize + .2 };
    this.objects = [];
    this.awake = { color: '#00ff5a' }
    this.sleep = { color: '#ff0068' };
    this.grid = {
      cols: 15,
      rows: 15,
      data: [],
      sleep: (mesh) => {
        const rgb = this.hexToRgbTreeJs(this.sleep.color);
        TweenMax.to(mesh.material.color, .2, {
          r: rgb.r, g: rgb.g, b: rgb.b, onUpdate: function (material) {
            material.verticesNeedUpdate = true;
          }, onUpdateParams: [mesh.material]
        });

        TweenMax.to(mesh.position, .3, { y: 5, ease: this.easing });
      },
      awake: (mesh) => {
        const rgb = this.hexToRgbTreeJs(this.awake.color);
        TweenMax.to(mesh.material.color, .2, {
          r: rgb.r, g: rgb.g, b: rgb.b, onUpdate: function (material) {
            material.verticesNeedUpdate = true;
          }, onUpdateParams: [mesh.material]
        });

        TweenMax.to(mesh.position, .3, { y: 6, ease: this.easing });
      },
      handleState: function (obj) {
        obj.state ? this.awake(obj.mesh) : this.sleep(obj.mesh);
      },
    };

    this.gridGUI = {
      cols: this.grid.cols,
      rows: this.grid.rows,
    };

    this.groupMesh = new THREE.Object3D();
    this.nextGrid = this.createGrid();
    this.grid.data = this.createGrid();

    const backgroundGUI = this.gui.addFolder('Background');
    backgroundGUI.addColor(this, 'backgroundColor').onChange((color) => {
      document.body.style.backgroundColor = color;
    });

    const awakeColor = this.gui.addFolder('Awake Color');
    awakeColor.addColor(this.awake, 'color').onChange((color) => {
      this.awake.color = color;
    });

    const sleepColor = this.gui.addFolder('Sleep Color');
    sleepColor.addColor(this.sleep, 'color').onChange((color) => {
      this.sleep.color = color;
    });

    const gutter = this.gui.addFolder('Gutter');
    gutter.add(this.gutter, 'size', 1, 5).onChange((size) => {
      this.gutter.size = size;

      this.clearScene();
      this.nextGrid = this.createGrid();
      this.grid.data = this.createGrid();
      this.draw();
    });

    const gridSize = this.gui.addFolder('Grid');
    gridSize.add(this.gridGUI, 'cols', 10, 25)
      .onChange((size) => {
        this.pause = true;
        this.clearScene();

        this.grid.cols = Math.round(size);
        this.nextGrid = this.createGrid();
        this.grid.data = this.createGrid();

        this.draw();
      }).onFinishChange(() => {
        this.pause = false;
      });

    gridSize.add(this.gridGUI, 'rows', 5, 25)
      .onChange((size) => {
        this.pause = true;
        this.clearScene();

        this.grid.rows = Math.round(size);
        this.nextGrid = this.createGrid();
        this.grid.data = this.createGrid();

        this.draw();
      }).onFinishChange(() => {
        this.pause = false;
      });


    this.createScene();
    this.createCamera();
    this.addAmbientLight();
    this.addSpotLight();
    this.addCameraControls();
    this.addFloor();

    const light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 20, 0);
    light.castShadow = true;
    this.scene.add(light);

    const light1 = new THREE.PointLight(0x00ff00, 1, 100);
    light1.position.set(0, 20, 0);
    light1.castShadow = true;
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0xff00ff, 1, 1000);
    light2.position.set(-50, 50, -20);
    this.scene.add(light2);

    this.draw();

    this.animate();

    setInterval(() => {
      if (!this.pause) {
        this.updateGrid();
      }
    }, 1000 / 10);

    setInterval(() => {
      this.clearScene();
      this.nextGrid = this.createGrid();
      this.grid.data = this.createGrid();
      this.draw();
    }, 5000);
  }

  clearScene() {
    for (let i = 0; i < this.grid.cols; i++) {
      for (let j = 0; j < this.grid.rows; j++) {
        this.groupMesh.remove(this.grid.data[i][j].mesh);
      }
    }
  }

  createGrid() {
    let grid = [];
    for (let col = 0; col < this.grid.cols; col++) {
      grid[col] = [];

      for (let row = 0; row < this.grid.rows; row++) {
        grid[col][row] = {};
      }
    }

    return grid;
  }

  draw() {
    let posX = 0;
    let posY = 0;

    const geometry = new THREE.SphereGeometry(this.meshSize, 32, 32);

    for (let col = 0; col < this.grid.cols; col++) {
      for (let row = 0; row < this.grid.rows; row++) {
        const mesh = this.getMesh(geometry);

        posX = col + (col * this.gutter.size);
        posY = row + (row * this.gutter.size);

        mesh.position.set(posX, 5, posY);

        this.grid.data[col][row].state = Math.round(Math.random());
        this.grid.data[col][row].mesh = mesh;

        this.groupMesh.add(mesh);
      }
    }

    this.groupMesh.position.set(-(posX / 2), 0, -(posY / 2));

    this.scene.add(this.groupMesh);
  }

  updateGrid() {
    for (let col = 0; col < this.grid.cols; col++) {
      for (let row = 0; row < this.grid.rows; row++) {
        const neighborsAlive = this.getNeighborsAlive(this.grid.data, col, row);
        const cell = this.grid.data[col][row];
        const nextCell = this.nextGrid[col][row];

        if (cell.state === 0 && neighborsAlive === 3) {
          nextCell.state = 1;
        } else if (cell.state === 1 && (neighborsAlive < 2 || neighborsAlive > 3)) {
          nextCell.state = 0;
        } else {
          nextCell.state = cell.state;
        }

        nextCell.mesh = cell.mesh;
      }
    }

    for (let col = 0; col < this.grid.cols; col++) {
      for (let row = 0; row < this.grid.rows; row++) {
        this.grid.data[col][row].state = this.nextGrid[col][row].state;

        this.grid.handleState(this.grid.data[col][row]);
      }
    }
  }

  getNeighborsAlive(grid, col, row) {
    let count = 0;
    const start = -1;
    const end = 2;

    for (let i = start; i < end; i++) {
      for (let j = start; j < end; j++) {
        const colX = (col + i + this.grid.cols) % this.grid.cols;
        const rowY = (row + j + this.grid.rows) % this.grid.rows;

        count += grid[colX][rowY].state;
      }
    }

    count -= grid[col][row].state;

    return count;
  }

  getMesh(geometry) {
    const meshParams = {
      color: this.sleep.color,
      metalness: .58,
      emissive: '#000000',
      roughness: .18,
    };

    const material = new THREE.MeshPhysicalMaterial(meshParams);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = 5;

    return mesh;
  }

  onResize() {
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    this.camera.aspect = ww / wh;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(ww, wh);
  }

  createScene() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(this.renderer.domElement);
  }

  createCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(20, width / height, 1, 1000);
    this.camera.position.set(80, 80, 80);

    this.scene.add(this.camera);
  }

  addCameraControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  addSpotLight() {
    const spotLight = new THREE.SpotLight(0xffffff, 1, 1000);

    spotLight.position.set(0, 50, 0);
    spotLight.castShadow = false;

    this.scene.add(spotLight);
  }

  addAmbientLight() {
    const light = new THREE.AmbientLight(0xffffff);

    this.scene.add(light);
  }

  addFloor() {
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: .05 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    planeGeometry.rotateX(- Math.PI / 2);

    plane.position.y = 0;
    plane.receiveShadow = true;

    this.scene.add(plane);
  }

  animate() {
    this.controls.update();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }

  hexToRgbTreeJs(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null;
  }
}
