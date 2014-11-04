
Objectyve.Prototype(function(self, definition) {

    definition
    ({
        module: 'Slider',

        attr :
        {
            html : {
                parent : null,
                el : null,

                dot : null
            },

            p : 0
        },

        initialize: function(args)
        {
            args = args || {} ;

            if (args.parent) this.build(args.parent) ;
            this.update() ;

            if (args.down) this.down = args.down ;
            if (args.moving) this.moving = args.moving ;
            if (args.up) this.up = args.up ;
        },

        methods:
        {
            build : function(parent)
            {
                this.html.parent = parent ;

                this.html.el = domes.create('div') ;
                this.html.el
                    .addClass('slider')

                this.html.dot = domes.create('div') ;
                this.html.dot
                    .addClass('slider-dot')
                    .appendTo(this.html.el) ;

                this.html.el.appendTo(this.html.parent) ;
            },

            connect : function()
            {
                var _this = this,
                    body = domes.query('body'),
                    elBounds,
                    dotWidth = this.html.dot.bounds().width,
                    max,
                    x ;

                this.html.dot
                    .on('mousedown', function(mde) {
                        var mousemove = function(mme) {
                                if (!mme.which) disconnect() ;

                                elBounds = _this.html.el.bounds() ;
                                dotBounds = _this.html.dot.bounds() ;
                                max = ~~(elBounds.width - dotWidth*1.33) ;

                                x = ~~(mme.pageX - elBounds.left - dotWidth/2) ;
                                if (x < 0) x = 0 ;
                                else if (x > max) x = max ;

                                _this.html.dot.style('left', x+'px') ;
                                _this.moving(x/max) ;

                                _this.p = (x/max)*100 ;
                                _this.update() ;
                            },
                            mouseup = function(mue) {
                                disconnect() ;
                                _this.up() ;
                            },
                            disconnect = function() {
                                body.off('mousemove', mousemove)
                                    .off('mouseup', mouseup) ;
                            } ;

                        body.on('mousemove', mousemove)
                            .on('mouseup', mouseup) ;

                        _this.down() ;
                    }) ;
            },

            set : function(p)
            {
                var elBounds = this.html.el.bounds(),
                    dotWidth = this.html.dot.bounds().width,
                    max = ~~(elBounds.width - dotWidth*1.33) ;
                this.html.dot.style('left', ~~(p*max)+'px') ;

                this.p = p*100 ;
                this.update() ;
            },

            update : function()
            {
                var o ;
                if (this.p < 5) o = this.p/5 ;
                else if (this.p > 95) o = (100 - this.p)/5 ;
                else o = 1 ;

                this.html.dot.style('opacity', o) ;
            },

            down : function() {},

            moving : function() {},

            up : function() {}
        }
    }) ;
}) ;
