var gui = require('nw.gui');
var open = require('open');
win = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: "menubar" });
try {
nativeMenuBar.createMacBuiltin("My App");
win.menu = nativeMenuBar;
} catch (ex) {
console.log(ex.message);
}

win.on('new-win-policy', function(frame, url, policy) {
    if ( url.match("file:///") == null ) {
        policy.ignore();
        open(url);
    }
});
