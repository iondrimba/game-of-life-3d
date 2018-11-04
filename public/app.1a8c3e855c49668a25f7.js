!function(e){var t={};function r(i){if(t[i])return t[i].exports;var a=t[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(i,a,function(t){return e[t]}.bind(null,a));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1)}([function(e,t,r){"use strict";r.d(t,"a",function(){return a});r(3);function i(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return function(e,t,r){t&&i(e.prototype,t),r&&i(e,r)}(e,[{key:"init",value:function(){var e=this;window.addEventListener("resize",this.onResize.bind(this)),this.gui=new dat.GUI,this.gui.closed=!1,this.pause=!1,this.backgroundColor="#252046",this.meshSize=1,this.gutter={size:this.meshSize+.2},this.objects=[],this.awake={color:"#00ff5a"},this.sleep={color:"#ff0068"},this.grid={cols:15,rows:15,data:[],sleep:function(t){var r=e.hexToRgbTreeJs(e.sleep.color);TweenMax.to(t.material.color,.2,{r:r.r,g:r.g,b:r.b,onUpdate:function(e){e.verticesNeedUpdate=!0},onUpdateParams:[t.material]}),TweenMax.to(t.position,.3,{y:5,ease:e.easing})},awake:function(t){var r=e.hexToRgbTreeJs(e.awake.color);TweenMax.to(t.material.color,.2,{r:r.r,g:r.g,b:r.b,onUpdate:function(e){e.verticesNeedUpdate=!0},onUpdateParams:[t.material]}),TweenMax.to(t.position,.3,{y:6,ease:e.easing})},handleState:function(e){e.state?this.awake(e.mesh):this.sleep(e.mesh)}},this.gridGUI={cols:this.grid.cols,rows:this.grid.rows},this.groupMesh=new THREE.Object3D,this.nextGrid=this.createGrid(),this.grid.data=this.createGrid(),this.gui.addFolder("Background").addColor(this,"backgroundColor").onChange(function(e){document.body.style.backgroundColor=e}),this.gui.addFolder("Awake Color").addColor(this.awake,"color").onChange(function(t){e.awake.color=t}),this.gui.addFolder("Sleep Color").addColor(this.sleep,"color").onChange(function(t){e.sleep.color=t}),this.gui.addFolder("Gutter").add(this.gutter,"size",1,5).onChange(function(t){e.gutter.size=t,e.clearScene(),e.nextGrid=e.createGrid(),e.grid.data=e.createGrid(),e.draw()});var t=this.gui.addFolder("Grid");t.add(this.gridGUI,"cols",10,25).onChange(function(t){e.pause=!0,e.clearScene(),e.grid.cols=Math.round(t),e.nextGrid=e.createGrid(),e.grid.data=e.createGrid(),e.draw()}).onFinishChange(function(){e.pause=!1}),t.add(this.gridGUI,"rows",5,25).onChange(function(t){e.pause=!0,e.clearScene(),e.grid.rows=Math.round(t),e.nextGrid=e.createGrid(),e.grid.data=e.createGrid(),e.draw()}).onFinishChange(function(){e.pause=!1}),this.createScene(),this.createCamera(),this.addAmbientLight(),this.addSpotLight(),this.addCameraControls(),this.addFloor();var r=new THREE.PointLight(16777215,1,1e3);r.position.set(0,20,0),r.castShadow=!0,this.scene.add(r);var i=new THREE.PointLight(65280,1,100);i.position.set(0,20,0),i.castShadow=!0,this.scene.add(i);var a=new THREE.PointLight(16711935,1,1e3);a.position.set(-50,50,-20),this.scene.add(a),this.draw(),this.animate(),setInterval(function(){e.pause||e.updateGrid()},100),setInterval(function(){e.clearScene(),e.nextGrid=e.createGrid(),e.grid.data=e.createGrid(),e.draw()},5e3)}},{key:"clearScene",value:function(){for(var e=0;e<this.grid.cols;e++)for(var t=0;t<this.grid.rows;t++)this.groupMesh.remove(this.grid.data[e][t].mesh)}},{key:"createGrid",value:function(){for(var e=[],t=0;t<this.grid.cols;t++){e[t]=[];for(var r=0;r<this.grid.rows;r++)e[t][r]={}}return e}},{key:"draw",value:function(){for(var e=0,t=0,r=new THREE.SphereGeometry(this.meshSize,32,32),i=0;i<this.grid.cols;i++)for(var a=0;a<this.grid.rows;a++){var n=this.getMesh(r);e=i+i*this.gutter.size,t=a+a*this.gutter.size,n.position.set(e,5,t),this.grid.data[i][a].state=Math.round(Math.random()),this.grid.data[i][a].mesh=n,this.groupMesh.add(n)}this.groupMesh.position.set(-e/2,0,-t/2),this.scene.add(this.groupMesh)}},{key:"updateGrid",value:function(){for(var e=0;e<this.grid.cols;e++)for(var t=0;t<this.grid.rows;t++){var r=this.getNeighborsAlive(this.grid.data,e,t),i=this.grid.data[e][t],a=this.nextGrid[e][t];0===i.state&&3===r?a.state=1:1===i.state&&(r<2||r>3)?a.state=0:a.state=i.state,a.mesh=i.mesh}for(var n=0;n<this.grid.cols;n++)for(var o=0;o<this.grid.rows;o++)this.grid.data[n][o].state=this.nextGrid[n][o].state,this.grid.handleState(this.grid.data[n][o])}},{key:"getNeighborsAlive",value:function(e,t,r){for(var i=0,a=-1;a<2;a++)for(var n=-1;n<2;n++){var o=(t+a+this.grid.cols)%this.grid.cols,s=(r+n+this.grid.rows)%this.grid.rows;i+=e[o][s].state}return i-=e[t][r].state}},{key:"getMesh",value:function(e){var t={color:this.sleep.color,metalness:.58,emissive:"#000000",roughness:.18},r=new THREE.MeshPhysicalMaterial(t),i=new THREE.Mesh(e,r);return i.castShadow=!0,i.receiveShadow=!0,i.position.y=5,i}},{key:"onResize",value:function(){var e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}},{key:"createScene",value:function(){this.scene=new THREE.Scene,this.renderer=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=THREE.PCFSoftShadowMap,document.body.appendChild(this.renderer.domElement)}},{key:"createCamera",value:function(){var e=window.innerWidth,t=window.innerHeight;this.camera=new THREE.PerspectiveCamera(20,e/t,1,1e3),this.camera.position.set(80,80,80),this.scene.add(this.camera)}},{key:"addCameraControls",value:function(){this.controls=new THREE.OrbitControls(this.camera,this.renderer.domElement)}},{key:"addSpotLight",value:function(){var e=new THREE.SpotLight(16777215,1,1e3);e.position.set(0,50,0),e.castShadow=!1,this.scene.add(e)}},{key:"addAmbientLight",value:function(){var e=new THREE.AmbientLight(16777215);this.scene.add(e)}},{key:"addFloor",value:function(){var e=new THREE.PlaneGeometry(200,200),t=new THREE.ShadowMaterial({opacity:.05}),r=new THREE.Mesh(e,t);e.rotateX(-Math.PI/2),r.position.y=0,r.receiveShadow=!0,this.scene.add(r)}},{key:"animate",value:function(){this.controls.update(),this.renderer.render(this.scene,this.camera),requestAnimationFrame(this.animate.bind(this))}},{key:"hexToRgbTreeJs",value:function(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16)/255,g:parseInt(t[2],16)/255,b:parseInt(t[3],16)/255}:null}}]),e}()},function(e,t,r){"use strict";r.r(t),function(e){var t=r(0),i=new t.a;i.init()}.call(this,r(2)(e))},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t,r){}]);