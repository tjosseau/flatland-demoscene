
Objectyve.Prototype(function(self, definition) {

    var $body,
        random = function(min, max) {
            return parseInt(min + Math.random() * (max-min), 10) ;
        },
        randomFloat = function(min, max) {
            return min + Math.random() * (max-min) ;
        } ;

    definition
    ({
        module: 'App',

        static:
        {
            state : false,
            delta : 0,
            lmts : 0, // Last modif timestamp
            mspf : 1000/60,

            renderer : null,
            fxComposer : null,
            scene : null,
            audio : {
                soundtrack : null,
                ambiance : null
            },

            camera : null,
            light : null,
            lightLimits : {
                min : 8000,
                max : -4000
            },
            lightAuto : true,

            ground : null,
            quads : {
                sky : null,
                hills : null,
                city : null,
                trees : [],
                grass : []
            },

            cursor : {
                x : 0,
                y : 0,
                z : 0,
                relX : 0,
                relY : 0,
                relZ : 0
            },
            slider : null,

            init : function()
            {
                self.build.components()
                    .build.shaders()
                    .build.env()
                    .build.scene()
                    .build.slider() ;

                self.load(function() {
                    self.audio.ambiance.volume = 0.25 ;
                    self.audio.soundtrack.play() ;
                    setTimeout(function() {
                        self.audio.ambiance.play() ;
                        self.start() ;

                        self.present() ;
                    }, 500) ;
                }) ;

                return self ;
            },

            load : function(fn)
            {
                self.audio.soundtrack = new Audio() ;
                self.audio.soundtrack.addEventListener('canplaythrough', function() {
                    self.audio.ambiance = new Audio() ;
                    self.audio.ambiance.addEventListener('canplaythrough', function() {
                        fn() ;
                    }, false) ;
                    self.audio.ambiance.src = 'media/audio/birds_zeldaoot.mp3' ;
                }, false) ;
                self.audio.soundtrack.src = 'media/audio/CRMA_WebGL_prj.mp3' ;
            },

            present : function()
            {
                var h1 = domes.query('h1').el(),
                    h2 = domes.query('h2').el(),
                    small = domes.query('small').el() ;

                TweenLite.to(h1.style, 2, {
                    opacity : 1,
                    delay : 2
                }) ;
                TweenLite.to(h2.style, 4, {
                    opacity : 1,
                    delay : 3
                }) ;
                TweenLite.to(h1.style, 4, {
                    opacity : 0,
                    delay : 6
                }) ;
                TweenLite.to(h2.style, 2, {
                    opacity : 0,
                    delay : 6
                }) ;

                TweenLite.to(small.style, 12, {
                    opacity : 1,
                    delay : 12
                }) ;
            },

            build : {
                components : function()
                {
                    var winBounds = $body.bounds(),
                        width = winBounds.width,
                        height = winBounds.height ;

                    self.renderer = new THREE.WebGLRenderer({
                        antialias : true
                    }) ;
                    self.renderer.setSize(width, height) ;
                    self.renderer.setClearColor(0x080810) ;
                    $body.append(self.renderer.domElement) ;


                    self.scene = new THREE.Scene();

                    self.camera = new THREE.PerspectiveCamera(50, width/height, 1, 10000) ;
                    self.camera.position.x = 0 ;
                    self.camera.position.y = 100 ;
                    self.camera.position.z = 1000 ;

                    self.cursor.relX = self.cursor.x = width/2 ;
                    self.cursor.relY = self.cursor.y = height/2 ;

                    return self ;
                },

                shaders : function()
                {
                    var winBounds = $body.bounds(),
                        width = winBounds.width,
                        height = winBounds.height,

                        renderPass = new THREE.RenderPass(self.scene, self.camera),
                        bokehPass = new THREE.BokehPass(self.scene, self.camera, {
                            focus:      1.0,
                            aperture:   0.01,
                            maxblur:    1.0,

                            width : width,
                            height : height
                        }) ;
                    bokehPass.renderToScreen = true ;

                    self.fxComposer = new THREE.EffectComposer(self.renderer) ;
                    self.fxComposer.addPass(renderPass) ;
                    self.fxComposer.addPass(bokehPass) ;

                    /*var grPass = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
                    grPass.needsSwap = true;
                    grPass.renderToScreen = false;
                    self.fxComposer.addPass( grPass );*/

                    return self ;
                },

                env : function()
                {
                    // self.light = new THREE.SpotLight(0xFFFFFF) ;
                    // self.light.position.set(0, 4000, 1000) ;
                    /*self.light.castShadow = true ;
                    self.light.shadowMapWidth = 1024;
                    self.light.shadowMapHeight = 1024;
                    self.light.shadowCameraNear = 500;
                    self.light.shadowCameraFar = 4000;
                    self.light.shadowCameraFov = 30;*/

                    self.light = new THREE.PointLight(0xFFFFFF, 2.5, 6400) ;
                    self.light.position.set(0, 2720, -200) ;

                    self.scene.add(self.light) ;
                    self.scene.add(new THREE.PointLightHelper(self.light, 8)) ;

                    self.quads.sky = new Quadpic({
                        w : 2560 *5,
                        h : 1600 *5,
                        x : 0,
                        y : 1680,
                        z : -3680,
                        img : 'clouds.gif',
                        bump : 'clouds_bm.gif'
                    }) ;
                    self.scene.add(self.quads.sky.mesh) ;

                    return self ;
                },

                scene : function()
                {
                    self.ground = new QuadGround() ;
                    self.scene.add(self.ground.mesh) ;
                    self.scene.add(self.ground.reflectCamera) ;

                    self.quads.hills = new Quadpic({
                        w : 640 *5,
                        h : 240 *5,
                        x : -2000,
                        y : 400,
                        z : -2560,
                        img : 'hills.gif',
                        bump : 'hills_bm.gif'
                    }) ;
                    self.scene.add(self.quads.hills.mesh) ;

                    self.quads.city = new Quadpic({
                        w : 560 *11,
                        h : 160 *11,
                        x : 0,
                        y : 520,
                        z : -1680,
                        img : 'montrouge.gif',
                        bump : 'montrouge_bm.gif'
                    }) ;
                    self.scene.add(self.quads.city.mesh) ;

                    var i,
                        il ;
                    for (i=0, il=random(5, 20) ; i<il ; i++)
                        self.quads.trees.push(new Quadpic({
                            w : 304 *1,
                            h : 403 *1,
                            x : random(-1024, 1024),
                            y : 120 + random(-16, 0),
                            z : -1280 + random(0, 1280),
                            img : 'tree.gif',
                            bump : 'tree_bm.gif'
                        })) ;
                    for (i=0, il=self.quads.trees.length ; i<il ; i++)
                        self.scene.add(self.quads.trees[i].mesh) ;

                    for (i=0, il=random(5, 10) ; i<il ; i++)
                        self.quads.trees.push(new Quadpic({
                            w : 304 *1,
                            h : 403 *1,
                            x : random(128, 1680),
                            y : 152 + random(-16, 0),
                            z : -1280 + random(0, 1280),
                            img : 'tree3.gif',
                            bump : 'tree3_bm.gif'
                        })) ;
                    for (i=0, il=self.quads.trees.length ; i<il ; i++)
                        self.scene.add(self.quads.trees[i].mesh) ;

                    for (i=0, il=168 ; i<il ; i++)
                        self.quads.grass.push(new Quadpic({
                            w : 32 *4,
                            h : 8 *4,
                            x : random(-1440, 1440),
                            y : -42 + random(-8, 8),
                            z : -1280 + random(0, 1280),
                            img : 'grass.gif',
                            bump : 'grass_bm.gif'
                        })) ;
                    for (i=0, il=self.quads.grass.length ; i<il ; i++)
                        self.scene.add(self.quads.grass[i].mesh) ;

                    for (i=0, il=48 ; i<il ; i++)
                        self.quads.grass.push(new Quadpic({
                            w : 32 *4,
                            h : 16 *4,
                            x : random(-2048, 2048),
                            y : -32 + random(-8, 8),
                            z : -1280 + random(0, 1280),
                            img : 'bush.gif',
                            bump : 'bush_bm.gif'
                        })) ;
                    for (i=0, il=self.quads.grass.length ; i<il ; i++)
                        self.scene.add(self.quads.grass[i].mesh) ;

                    return self ;
                },

                slider : function()
                {
                    var timeout ;

                    self.slider = new Slider({
                        parent : domes.body(),

                        down : function() {
                            clearTimeout(timeout) ;
                            self.lightAuto = false ;
                        },
                        moving : function(p) {
                            self.light.position.z = (
                                self.lightLimits.min + (self.lightLimits.max-self.lightLimits.min)*p
                            ) ;
                        },
                        up : function() {
                            timeout = setTimeout(function() {
                                self.lightAuto = true ;
                            }, 3000) ;
                        }
                    }) ;
                }
            },

            connect : function()
            {
                $body
                    .on('mousemove', function(mme) {
                        // if (mme.which) {
                            self.cursor.x = mme.pageX ;
                            self.cursor.y = mme.pageY ;
                        // }
                    })
                    .on('keypress', function(kpe) {
                        switch (kpe.keyCode) {
                            case 122 : // S
                                self.cursor.z += 20 ;
                                break ;
                            case 115 : // Z
                                self.cursor.z -= 20 ;
                                break ;
                            /* case 111 : // O
                                self.light.position.y += 25 ;
                                break ;
                            case 108 : // L
                                self.light.position.y -= 25 ;
                                break ;
                            case 107 : // K
                                self.light.position.x -= 25 ;
                                break ;
                            case 109 : // M
                                self.light.position.x += 25 ;
                                break ;
                            case 105 : // I
                                self.light.position.z -= 25 ;
                                break ;
                            case 106 : // J
                                self.light.position.z += 25 ;
                                break ;*/
                        }
                    })
                    .on('mousewheel DOMMouseScroll', function(mwe) {
                        mwe = window.event || mwe ;
                        if (Math.max(-1, Math.min(1, (mwe.wheelDelta || -mwe.detail))) > 0) {
                            self.cursor.z += 100 ;
                        }
                        else {
                            self.cursor.z -= 100 ;
                        }
                    }) ;

                window.onresize = self.resize ;

                self.slider.connect() ;

                return self ;
            },

            resize : function()
            {
                var winBounds = $body.bounds(),
                    width = winBounds.width,
                    height = winBounds.height ;

                self.camera.aspect = width / height ;
                self.camera.updateProjectionMatrix() ;

                self.ground.reflectCamera.aspect = width / height ;

                self.renderer.setSize(width, height) ;
                self.fxComposer.setSize(width, height) ;
            },

            start : function()
            {
                self.state = true ;

                self.light.position.z = 6400 ;

                var i,
                    il ;
                self.cursor.z = -5000 ;
                TweenLite.to(self.cursor, 8, { z : -500 }) ;

                for (i=0, il=self.quads.trees.length ; i<il ; i++) {
                    self.quads.trees[i].mesh.material.opacity = 0 ;
                    TweenLite.to(self.quads.trees[i].mesh.material, 1, {
                        opacity : 1,
                        delay : randomFloat(0, 2)
                    }) ;
                }

                for (i=0, il=self.quads.grass.length ; i<il ; i++) {
                    self.quads.grass[i].mesh.material.opacity = 0 ;
                    TweenLite.to(self.quads.grass[i].mesh.material, randomFloat(4, 8), {
                        opacity : 1,
                        delay : 2 + randomFloat(0, 4)
                    }) ;
                }

                self.update(true) ;
            },

            update : function(force)
            {
                var now = new Date().getTime() ;
                if (force === true) self.delta = 1 ;
                else self.delta = (now - self.lmts)/self.mspf ;
                self.lmts = now ;

                if (self.lightAuto) {
                    self.light.position.z -= 5.5 *self.delta ;
                    if (self.light.position.z < self.lightLimits.max)
                        self.light.position.z = self.lightLimits.min ;
                }

                var sliderCoeff = (self.lightLimits.min-self.light.position.z)/(self.lightLimits.min-self.lightLimits.max) ;

                if (self.lightAuto) self.slider.set(sliderCoeff) ;

                if (self.cursor.z < -4000) self.cursor.z = -4000 ;
                else if (self.cursor.z > 2500) self.cursor.z = 2500 ;

                self.audio.ambiance.volume = (((4000 + self.cursor.z)/6500) * 0.5) / (1 + Math.abs(sliderCoeff-0.5)*4) ;

                var winBounds = $body.bounds(),
                    relX = -(self.cursor.x - winBounds.width/2) / (winBounds.width/2),
                    relY = -(self.cursor.y - winBounds.height/2) / (winBounds.height/2),
                    relZ = self.cursor.z ;
                if (force === true) {
                    self.cursor.relX = relX ;
                    self.cursor.relY = relY ;
                    self.cursor.relZ = relZ ;
                }
                else {
                    self.cursor.relX = self.cursor.relX - ((self.cursor.relX-relX)/20) ;
                    self.cursor.relY = self.cursor.relY - ((self.cursor.relY-relY)/20) ;
                    self.cursor.relZ = self.cursor.relZ - ((self.cursor.relZ-relZ)/20) ;
                }

                self.camera.position.x = self.cursor.relX * 320 ;
                self.camera.position.y = (1-self.cursor.relY) * 320 ;
                self.camera.position.z = 1000 - self.cursor.relZ ;
                self.camera.rotation.y = self.cursor.relX /8 ;

                self.ground.reflectCamera.position.copy(self.camera.position) ;
                self.ground.reflectCamera.position.y = -100-self.ground.reflectCamera.position.y ;

                self.render() ;

                if (self.state) requestAnimationFrame(self.update) ;
            },

            render : function()
            {
                self.ground.mesh.visible = false ;
                self.ground.reflectCamera.updateCubeMap(self.renderer, self.scene) ;
                self.ground.mesh.visible = true ;

                if (self.fxComposer) self.fxComposer.render() ;
                else self.renderer.render(self.scene, self.camera) ;
            }
        },

        main: function()
        {
            domes.ready(function() {
                $body = domes.query('body') ;

                self.init()
                    .connect() ;
            }) ;
        }
    }) ;

}) ;
