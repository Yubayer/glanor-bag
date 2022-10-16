
class MazeHeader extends HTMLElement{
    constructor() {
      super()
    }

  connectedCallback(){
    this.activeChild = false

    this.mazeHeader = this.querySelector(".maze-header")
    this._top = this.mazeHeader.offsetHeight
    
    this.parentItem = this.querySelectorAll(".parent-item-x")
    this.parentItem.forEach(item => {
        item.addEventListener("mouseenter", this.parentItemFuncEnter.bind(this, '.child-wrapper'))
        item.addEventListener("mouseleave", this.parentItemFuncLeave.bind(this))
    })

    this.childWrapper = this.querySelectorAll(".child-wrapper")
    this.childWrapper.forEach(wrapper => {
        wrapper.addEventListener("mouseenter", this.childWrapperFuncEnter.bind(this))
        wrapper.addEventListener("mouseleave", this.childWrapperFuncLeave.bind(this))
    })

    this.querySelector(".menu-list-x").addEventListener("mouseleave", this.hideCildWrapper.bind(this))
    // this.moreBtn = this.querySelector(".header-x-more")
    // this.moreBtn.addEventListener("mouseenter", this.parentItemFuncEnter.bind(this, 'ul'))
  }

  parentItemFuncEnter(selector, e) {
      if(this.querySelector(".active-child-wrapper-x")){
          this.querySelector(".active-child-wrapper-x").classList.remove("active-child-wrapper-x")
      }  

      if(e.target.querySelector(selector)) {
          e.target.querySelector(selector).classList.add("active-child-wrapper-x")
          // e.target.querySelector(selector).style.top = `${this._top}px`
      }
  }

  hideCildWrapper(e) {
      const prevActive = this.querySelector(".active-child-wrapper-x")
      if(prevActive){
          setTimeout(() => prevActive.classList.remove("active-child-wrapper-x"), 500)
      } 
  }

  parentItemFuncLeave(e) {

  }

  childWrapperFuncEnter(e) {
    console.log(e.currentTarget)
      e.currentTarget.classList.add("active-child-wrapper-x")
      // e.currentTarget.style.top = `${this._top}px`
  }

  childWrapperFuncLeave(e) {
      e.currentTarget.classList.remove("active-child-wrapper-x")
  }
}

customElements.define("maze-header", MazeHeader)