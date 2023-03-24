import { currentBoard, restartLevel } from "./game.js"

export class UIManager {
  public element: HTMLDivElement
  private buttons: HTMLButtonElement[] = []

  private set activeButton(button: HTMLButtonElement | null) {
    this._activeButton?.classList.remove("active")
    button?.classList.add("active")
    this._activeButton = button
  }

  private get activeButton() {
    return this._activeButton
  }

  private _activeButton!: HTMLButtonElement | null

  constructor(uiButtons: UIButton[] = []) {
    this.element = document.createElement("div")
    this.element.classList.add("buttons-panel")
    uiButtons.forEach((button) => this.addButton(button))
    this.activeButton = this.buttons[0] || null
  }

  private addButton(button: UIButton) {
    const newButton = document.createElement("button")
    newButton.innerText = button.name
    newButton.onclick = button.onClick
    newButton.onmouseenter = () => {
      this.activeButton = newButton
    }
    this.buttons.push(newButton)
    this.element.appendChild(newButton)
  }

  public selectNextButton() {
    const activeButtonIndex = this.activeButton
      ? this.buttons.indexOf(this.activeButton)
      : 0
    const newButtonIndex = (activeButtonIndex + 1) % this.buttons.length
    this.activeButton = this.buttons[newButtonIndex]
  }

  public selectPreviousButton() {
    const activeButtonIndex = this.activeButton
      ? this.buttons.indexOf(this.activeButton)
      : 0
    const newButtonIndex =
      (activeButtonIndex - 1 + this.buttons.length) % this.buttons.length
    this.activeButton = this.buttons[newButtonIndex]
  }

  public clickActiveButton() {
    this.activeButton?.click()
  }
}

type UIButton = {
  name: string
  onClick: () => void
}

/** pause uiManager includes restart, continue, resume buttons*/
export const pauseUIManager = new UIManager([
  {
    name: "RESTART",
    onClick: () => {
      restartLevel()
    },
  },
  {
    name: "CONTINUE",
    onClick: () => {
      if (!currentBoard) return
      currentBoard.isPaused = false
    },
  },
])
pauseUIManager.element.classList.add("pause")

export const gameOverManager = new UIManager([
  {
    name: "RESTART",
    onClick: () => {
      restartLevel()
    },
  },
])
gameOverManager.element.classList.add("over")

document
  .getElementById("popup")
  ?.append(pauseUIManager.element, gameOverManager.element)
