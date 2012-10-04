/**
 * Utils.
 */
var Utils = {
	notUndefined: function( t ) {
        return (typeof t !== 'undefined' ? true : false);
    },
    compose: function( fs ) {
        return function( a ) {
        
            var length = fs.length,
                x;
            
            if ( length == 0 ) return a;
            
            x = fs[ length - 1 ]( a );
            
            while( length-- ) {
                x = fs[ length ]( x );
            }
            
            return x;
        
        }
    
    },
    filter: function( fn, xs ) {
        var ys = [],
            length = xs.length,
            t,
            i = 0;
    
        for ( ; i < length; i+=1 ) {
            t = xs[ i ];
            if ( fn( t ) ) {
                ys.push( t );
            }
        }
    
        return ys;
    }
};

/**
 * Application.
 */
var App = {};

(function( App, Utils ) {
//* Scope

var _notUndefined = Utils.notUndefined,
	_compose = Utils.compose,
    _enterFrame = window.requestAnimationFrame,
    _rand = Math.random,
    _filter = Utils.filter, 
    _ceil = Math.ceil, 
    _updateAndDrawParticle,
    // _particles :: [Particle]
    _particles = [], 
    _canvas,
    _context,
    _mx = 0,
    _my = 0;


function Particle( x: number, y: number, vx: number, vy: number ) {
	this.x = x || 0;
	this.y = y || 0;
	this.vx = vx || 5;
	this.vy = vy || 5;
	this.fade = _rand() * 4;
	this.life = 255;
}

function createParticles( n:number ) {
	var i = 0,
		vx, vy,
		length = _particles.length;

	for (; i < n; i+=1 ) {
		vx = (-1* _ceil( _rand() * 4) + _rand() * 2 ) + 0.5;
		vy = (-1* _ceil( _rand() * 4) + _rand() * 2 ) + 0.5;
		_particles[ length + i ] = new Particle( _mx, _my, vx, vy );
	}
}

function updateParticle( p:IParticle ) {
	if ( p === null ) return null;
	if ( (p.life -= p.fade) < 0 ) return null;

	p.x += (p.vx *= 0.98);
	p.y += (p.vy *= 0.98);

	return p;
}

function drawParticle( p:IParticle ) {
	if ( p === null ) return null;

	_context.globalAlpha = p.life / 255;
	_context.fill(0,0,0,255);
	_context.fillRect(p.x,p.y,10,10);

	return p;
}

// fn_composed = fn2 . fn1
// fncomposed( a ) = fn2( fn1( a ) ) ;
_updateAndDrawParticle = _compose( [ drawParticle, updateParticle ] );

function setCanvas( canvas ) {
    if ( !_notUndefined( canvas ) ) return;
    _canvas = canvas;
    _context = canvas.getContext( '2d' );

    enterFrame();
}

function draw( xs ) {
    _particles = _filter( _updateAndDrawParticle, xs );
}

function enterFrame() {
    if ( _notUndefined( _context ) ) {
    	_context.clearRect( 0, 0, _canvas.width, _canvas.height );
        draw( _particles );
    }
    _enterFrame( enterFrame );
}

function mouseMove( e ) {
	_mx = e.pageX;
	_my = e.pageY;
	createParticles( _rand() * 5 );
}

App['ParticleSystem'] = {
	'setCanvas': setCanvas,
	'mouseMove': mouseMove
};

//* End scope.
}( App, Utils ));