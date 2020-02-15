const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const image = document.querySelector('#bg');

const gameWidth = canvas.width;
const gameHeight = canvas.height;

function Display(level) {
    this.level = level;
}

Display.prototype.draw = function() {
    // ctx.clearRect(0, 0, gameWidth, gameHeight);
    // this.drawBackground();
    // this.drawActors();
    // this.drawEffects();
}

Display.prototype.drawActors = function() {
    this.level.actors.forEach(actor => {
        // ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = actor.color;
        // ctx.translate(actor.pos.x * this.level.cellSize + 20,actor.pos.y* this.level.cellSize + 20);
        // ctx.rotate(actor.rotation * Math.PI / 180); // rotate around the start point of your line
        // ctx.translate(-(actor.pos.x * this.level.cellSize + 20),-(actor.pos.y * this.level.cellSize + 20));
        switch (actor.shape) {
            case 'circle':
                ctx.arc((actor.pos.x + 0.5) * this.level.cellSize, (actor.pos.y + 0.5) * this.level.cellSize, actor.size.x * 0.5 * this.level.cellSize, 0, 2 * Math.PI);
                break;
            case 'square':
                ctx.rect(actor.pos.x * this.level.cellSize, actor.pos.y * this.level.cellSize, actor.size.x * this.level.cellSize, actor.size.x * this.level.cellSize);
                break;
            case 'polygon':
                ctx.moveTo(actor.pos.x * this.level.cellSize + actor.points[0][0], actor.pos.y * this.level.cellSize + actor.points[0][1]);
                actor.points.slice(1).forEach(point => {
                    ctx.lineTo(actor.pos.x * this.level.cellSize + point[0], actor.pos.y * this.level.cellSize + point[1]);
                })
                break;
        }
        ctx.stroke();
        ctx.closePath()
        // ctx.restore();
    })
}

Display.prototype.drawEffects = function() {
    this.level.effects.forEach(effect => {
        ctx.beginPath();
        ctx.lineWidth = effect.options.strokeWidth || 2;
        if (effect.options.style === 'stroke') {
            ctx.strokeStyle = effect.color;
        } else {
            ctx.fillStyle = effect.color;
        }
        switch (effect.shape) {
            case 'square':
                if (effect.options.style === 'stroke') {
                    ctx.rect(effect.pos.x * this.level.cellSize, effect.pos.y * this.level.cellSize, effect.size.x * this.level.cellSize, effect.size.y * this.level.cellSize);
                    ctx.stroke();
                } else {
                    ctx.save();
                    ctx.globalAlpha = effect.alpha;
                    const offsetX = effect.pos.x * this.level.cellSize + ((effect.size.x * this.level.cellSize) / 2);
                    const offsetY = effect.pos.y* this.level.cellSize + ((effect.size.y * this.level.cellSize) / 2);
                    ctx.translate(offsetX, offsetY);
                    ctx.rotate(effect.rotation * Math.PI / 180); // rotate around the start point of your line
                    ctx.translate(-offsetX, -offsetY);
                    ctx.fillRect(effect.pos.x * this.level.cellSize, effect.pos.y * this.level.cellSize, effect.size.x * this.level.cellSize, effect.size.y * this.level.cellSize);
                    ctx.restore();
                }
                break;
            case 'circle':
                ctx.globalAlpha = effect.time / effect.maxTime;
                ctx.arc((effect.pos.x + 0.5) * this.level.cellSize, (effect.pos.y + 0.5) * this.level.cellSize, effect.size.x * 0.5 * this.level.cellSize, 0, 2 * Math.PI);
                ctx.stroke();
                break;
        }
        ctx.globalAlpha = 1;
    })
}

Display.prototype.drawBackground = function() {
    ctx.drawImage(image, 0, 0);

    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    const percentBossHealth = this.level.boss.hp * 100 / this.level.boss.maxHp / 100;
    ctx.fillRect(0, 0, (this.level.screenWidth * this.level.cellSize) * percentBossHealth, 5);

    ctx.beginPath();
    ctx.fillStyle = "#6dd42c";
    const percent = this.level.player.hp * 100 / this.level.player.maxHp / 100;
    ctx.fillRect(0, this.level.screenHeight * this.level.cellSize - 5, (this.level.screenWidth * this.level.cellSize) * percent, this.level.screenHeight * this.level.cellSize);
}

export default Display;
