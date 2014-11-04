
Objectyve.Prototype(function(self, definition) {

    definition
    ({
        module: 'Quadpic',

        attr :
        {
            mesh : null
        },

        initialize: function(args)
        {
            this.build(args) ;
        },

        methods:
        {
            build : function(args)
            {
                var color,
                    emissive,
                    specular,
                    shininess,
                    bumpScale ;

                switch (args.img) {
                    case null :
                        break ;

                    case 'clouds.gif' :
                        color = new THREE.Color("rgb(192, 168, 144)") ;
                        emissive = new THREE.Color("rgb(64, 80, 96)") ;
                        specular = new THREE.Color("rgb(0, 2, 4)") ;
                        shininess = 8 ;
                        bumpScale = 16 ;
                        break ;

                    case 'grass.gif' :
                        color = new THREE.Color("rgb(192, 168, 0)") ;
                        emissive = new THREE.Color("rgb(128, 96, 128)") ;
                        specular = new THREE.Color("rgb(64, 48, 0)") ;
                        shininess = 16 ;
                        bumpScale = 16 ;
                        break ;

                    case 'bush.gif' :
                        color = new THREE.Color("rgb(192, 168, 0)") ;
                        emissive = new THREE.Color("rgb(96, 80, 96)") ;
                        specular = new THREE.Color("rgb(48, 24, 0)") ;
                        shininess = 8 ;
                        bumpScale = 8 ;
                        break ;

                    case 'montrouge.gif' :
                        color = new THREE.Color("rgb(216, 160, 64)") ;
                        emissive = new THREE.Color("rgb(128, 128, 128)") ;
                        specular = new THREE.Color("rgb(8, 12, 16)") ;
                        shininess = 8 ;
                        bumpScale = 32 ;
                        break ;

                    case 'hills.gif' :
                        color = new THREE.Color("rgb(216, 160, 64)") ;
                        emissive = new THREE.Color("rgb(64, 64, 80)") ;
                        specular = new THREE.Color("rgb(8, 12, 16)") ;
                        shininess = 8 ;
                        bumpScale = 16 ;
                        break ;

                    case 'tree.gif' :
                        color = new THREE.Color("rgb(255, 160, 64)") ;
                        emissive = new THREE.Color("rgb(128, 144, 144)") ;
                        specular = new THREE.Color("rgb(0, 0, 0)") ;
                        shininess = 8 ;
                        bumpScale = 2 ;
                        break ;

                    case 'tree3.gif' :
                        color = new THREE.Color("rgb(255, 168, 0)") ;
                        emissive = new THREE.Color("rgb(48, 56, 64)") ;
                        specular = new THREE.Color("rgb(32, 16, 0)") ;
                        shininess = 12 ;
                        bumpScale = 6 ;
                        break ;

                    default :
                        color = new THREE.Color("rgb(255, 160, 64)") ;
                        emissive = new THREE.Color("rgb(128, 128, 128)") ;
                        specular = new THREE.Color("rgb(0, 0, 0)") ;
                        shininess = 1 ;
                        bumpScale = 1 ;
                        break ;
                }

                var material = args.img ?
                    new THREE.MeshPhongMaterial({
                        transparent : true,
                        map : THREE.ImageUtils.loadTexture('media/'+args.img),
                        bumpMap : args.bump ? THREE.ImageUtils.loadTexture('media/'+args.bump) : null,
                        color : color,
                        emissive : emissive,
                        specular : specular,
                        shininess : shininess,
                        bumpScale : bumpScale
                    }) : new THREE.MeshNormalMaterial() ;

                material.map.magFilter = THREE.NearestFilter ;
                material.map.minFilter = THREE.LinearMipMapLinearFilter ;

                this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(args.w, args.h), material) ;

                this.mesh.position.x = args.x || 0 ;
                this.mesh.position.y = args.y || 0 ;
                this.mesh.position.z = args.z || 0 ;
            }
        }
    }) ;
}) ;
