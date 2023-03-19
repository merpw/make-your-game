import { currentBoard, restartLevel } from "./game.js"

/** class includes functionality to create the html div element
 * which will be used to display the UI.
 * Every UI element will be a child of this div.
 * At the moment only buttons are supported.
 * The UI is created as class instance and property buttonPanel can be added to the DOM.
 * Buttons placed from the top to the bottom in one column (need css supply).
 * Buttons can be added to the UI by calling the addButtons method.
 */
export class UIManager {
  private buttonsPanel: HTMLDivElement
  private buttons: HTMLButtonElement[] = []
  private activeButtonIndex = 0

  constructor(uiButtons: UIButton[] = []) {
    this.buttonsPanel = document.createElement("div")
    // arrange buttons in one column using css
    this.buttonsPanel.classList.add("buttons-panel")
    // this.buttonsPanel.classList.add("pause")
    this.addButtons(uiButtons)
  }

  private addButton(button: UIButton) {
    const newButton = document.createElement("button")
    newButton.innerText = button.name
    newButton.onclick = button.onClick
    this.buttons.push(newButton)
    this.buttonsPanel.appendChild(newButton)
  }

  public addButtons(buttons: UIButton[]) {
    if (buttons.length === 0) return
    buttons.forEach((button) => this.addButton(button))
    this.buttons[0].classList.add("active")
  }

  /** returns the div element which can be added to the DOM */
  public getButtonsPanel() {
    return this.buttonsPanel
  }

  /** call it when down arrow "keyUp" happens */
  public selectNextButton() {
    if (this.buttons.length === 0) {
      console.log("no buttons added")
      return
    }
    this.buttons[this.activeButtonIndex].classList.remove("active")
    this.activeButtonIndex = (this.activeButtonIndex + 1) % this.buttons.length
    this.buttons[this.activeButtonIndex].classList.add("active")
  }

  /** call it when up arrow "keyUp" happens */
  public selectPreviousButton() {
    if (this.buttons.length === 0) {
      console.log("no buttons added")
      return
    }
    this.buttons[this.activeButtonIndex].classList.remove("active")
    this.activeButtonIndex =
      (this.activeButtonIndex + this.buttons.length - 1) % this.buttons.length
    this.buttons[this.activeButtonIndex].classList.add("active")
  }

  /** call it when Enter "keyUp" happens */
  public clickActiveButton() {
    if (this.buttons.length === 0) {
      console.log("no buttons added")
      return
    }
    this.buttons[this.activeButtonIndex].click()
  }
}

export type UIButton = {
  name: string
  onClick: () => void
}

/** pause uiManager includes restart, continue, resume buttons*/
export const pauseUIManager = new UIManager([
  {
    name: "Restart",
    onClick: () => {
      console.log("restart")
      restartLevel()
    },
  },
  {
    name: "Continue",
    onClick: () => {
      console.log("continue")
      if (!currentBoard) return
      currentBoard.isPaused = false
    },
  },
])
