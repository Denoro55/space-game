import {Vector} from "../helpers"

export default function () {
    const codes = {37: "left", 38: "up", 39: "right", 40: "down", 87: "up", 68: "right", 65: "left", 83: "down"};

    const pressed = {};
    const handler = (e) => {
        if (codes.hasOwnProperty(e.keyCode)) {
            pressed[codes[e.keyCode]] = e.type === 'keydown';
            e.preventDefault();
        }
    };

    const mouseHandler = (e) => {
        if (e.type === 'mousedown') {
            pressed['mouseDown'] = true;
        }
        if (e.type === 'mouseup') {
            pressed['mouseDown'] = false;
        }
        pressed['mouse'] = new Vector(e.clientX - 10, e.clientY - 10);
    };

    addEventListener('keydown', handler);
    addEventListener('keyup', handler);

    document.onmousedown  = mouseHandler;
    document.onmouseup  = mouseHandler;
    document.onmousemove  = mouseHandler;

    return pressed;
}
