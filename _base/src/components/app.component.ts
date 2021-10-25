import { Component } from "../utils/component"
import { FloorComponent } from "./floor.component"
import { BallComponent } from "./ball.component"
import { BurgerComponent } from "./burger.component"
import { TextComponent } from "./text.component"

export class App extends Component {
  render() {
    const floor = new FloorComponent()
    this.add(floor)

    const ball = new BallComponent()
    this.add(ball)

    const burger = new BurgerComponent()
    this.add(burger)

    const text = new TextComponent()
    this.add(text)
  }
}
