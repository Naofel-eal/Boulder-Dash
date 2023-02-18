import { Map } from "./map.js"
import { Player } from "./player.js"

export class World
{
    #player;
    #map;

    constructor(map, player)
    {
        this.#map = map;
        this.#player = player;
        this.refresh();
    }

    refresh()
    {
        localStorage.setItem("diamonds", this.#player.diamonds);
        localStorage.setItem("movements", this.#player.movements)
        document.querySelector("#diamonds").innerHTML = `Diamants : ${localStorage.getItem("diamonds")} / ${this.#map.totalDiamonds}`;
        document.querySelector("#movements").innerHTML = `Mouvements : ${this.#player.movements}`;
        document.querySelector("h2").innerHTML = `Niveau ${localStorage.getItem("actualLevel")}`
        this.#map.displayMap();
    }
}