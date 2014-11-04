
Objectyve.Prototype(function(self, definition) {

    definition
    ({
        module: 'QuadGround',

        static:
        {
            reflectionSize : 16384,
            reflectionRes : 256,
            reflectionQuality : 1024
        },

        attr :
        {
            material : null,
            mesh : null,

            reflectCamera : null
        },

        initialize: function()
        {
            this.build() ;
        },

        methods:
        {
            build : function()
            {
                this.reflectCamera = new THREE.CubeCamera(0.1, self.reflectionSize, self.reflectionQuality) ;
                this.material = new THREE.MeshBasicMaterial({
                    envMap: this.reflectCamera.renderTarget
                }) ;

                // this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), this.material) ;
                this.mesh = THREE.SceneUtils.createMultiMaterialObject( 
                    new THREE.PlaneBufferGeometry(self.reflectionSize, self.reflectionSize, self.reflectionRes, self.reflectionRes, 1, 1), [
                        this.material,
                        // new THREE.MeshBasicMaterial({ color : 0x000000, transparent: true, opacity : 0.125 })
                    ]
                ) ;

                this.mesh.rotation.x = -Math.PI/2 ;
                this.mesh.position.y = -50 ;
            }
        }
    }) ;
}) ;
