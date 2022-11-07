
class MazeSearchDropdown extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    this.activeCls = {
      h2_dpSearchOpen: 'active-dp-search-container'
    }

    this.view = {
      mobile: screen.width <= 480 ? true: false
    }

    this.selector = {
      h2_dpContainer: ".dp-search-container",
      h2_searchInput : ".mh2-search-input",
      h2_searchIcon: ".mh2-search-icon"
    }
    
    this.searcyType = 'product'
    this.searchTerm = 'a'

    this.filterWrapper = this.querySelector(".ms-filter")
    this.filterLists = this.querySelectorAll("ul.msf-ul li")
    this.filterLists.forEach(list => list.addEventListener("click", this.filterListFunc.bind(this)))

    this.popularProducts = JSON.parse(this.querySelector('[type="application/popular-products"]').textContent)
    console.log("popular products: ", this.popularProducts)
    this.resultWrapper = this.querySelector(".msd-result")
    this.footer = this.querySelector(".msd-footer a")

    this.seachInput = document.querySelectorAll(this.selector.h2_searchInput)
    this.seachInput && this.seachInput.forEach(input => input.addEventListener('input', this.debounce((event) => {
      this._dropdownSearchInput(event);
    }, 350).bind(this)))

    this.searchIcon = document.querySelector(this.selector.h2_searchIcon)
    this.searchIcon && this.searchIcon.addEventListener("click", this._openDropdown.bind(this))

    window.addEventListener("resize", this.debounce(e => this.resize(e), 300).bind(this))
  }

  resize(e) {
    this.view.mobile = screen.width <= 480 ? true: false
  }

  filterListFunc(e) {
    this.filterLists.forEach(list => list.classList.contains("msf-active") && list.classList.remove("msf-active"))
    this.searcyType = e.target.dataset.type
    e.target.classList.add("msf-active")
    if(this.searcyType === 'popular') this._resultImageView(this.popularProducts)
    else this.getSearchResultsDropdown();
  }

  
  getSearchResultsDropdown() {
    this.hideContentIfEmpty()
    
    // const urlX = `/search.json?q=${this.searchTerm}&type=page&options[prefix]=last`
    // fetch(`/search.json?q=${this.searchTerm}&type=${this.searcyType}&options[prefix]=last`)
    // .then(res => res.text())
    // .then(res => {
      
    //   let text = res.split("</title>")[0].split("<title>")[1]
    //   let result = text.match(/[0-9]/g);
    //   this.footer.innerHTML = "View All Result ("+ result.join("") +")"
    // })
    
    const url = window.Shopify.routes.root + `search/suggest.json?q=${this.searchTerm}&resources[type]=${this.searcyType}&options[prefix]=last`
    const url2 = window.Shopify.routes.root + `search/suggest.json?q=${this.searchTerm}&resources[type]=${this.searcyType}&resources[options][unavailable_products]=hide&resources[options][fields]=title,body,product_type,variants.title`
    if(this.searchTerm != ''){
        fetch(url2)
        .then((response) => {
            if(response.status && response.status == 200) return response.json()
        })
        .then((suggestions) => {
          const result = suggestions.resources.results
          this.searcyType === 'product' && this._resultImageView(result.products) 
          this.searcyType === 'page' && this._resultListView(result.pages) 
          this.searcyType === 'collection' && this._resultListView(result.collections) 
        })
        .catch(err => console.log(err))
    }else {
      console.log("empty")
    }
  }

  _resultImageView(data) {
    let result = ''
    data.forEach(product => {
      result+= `<div class="msd-result-item">
        <div>
          <img src="${product.image ? product.image : product.featured_image}" alt="product-image" width="100%">
        </div>
        <div>
          <p>${product.title}</p>
          <p>${product.price}</p>
        </div>
      </div>`
    })
    this.resultWrapper.style.display = 'grid'
    this.resultWrapper.innerHTML = result
  }

  _resultListView(data) {
    let result = ''
    data.forEach(list => {
      result += `<li class="ms-only-list">
        <a href="${list.url}">
          <span>${list.title}</span>
          <span>${this._arrowIcon()}</span>
        </a>
      </li>`
    })
    this.resultWrapper.style.display = 'block'
    this.resultWrapper.innerHTML = `<div class="msr-wrapper"><ul>${result}</ul></div>`
  }

  _dropdownSearchInput(e) {
    this.searchTerm = e.target.value.trim();
    this.searchTerm === '' ? this.footer.setAttribute("href", "/search") : this.footer.setAttribute("href", '/search?q='+ this.searchTerm + '&options[prefix]=last')
    this._openDropdown()
    this.getSearchResultsDropdown()
  }
  
  _openDropdown(){
    // document.querySelector(this.selector.h2_dpContainer) && document.querySelector(this.selector.h2_dpContainer).classList.add(this.activeCls.h2_dpSearchOpen)
    if(document.querySelector(this.selector.h2_dpContainer)){
      if(this.view.mobile){
        document.querySelector(this.selector.h2_dpContainer).classList.add(this.activeCls.h2_dpSearchOpen)
        if(this.searchTerm == '') this.resultWrapper.innerHTML = ''
      }
      else{
        if(this.searchTerm != ''){
          document.querySelector(this.selector.h2_dpContainer).classList.add(this.activeCls.h2_dpSearchOpen)
        } else {
          document.querySelector(this.selector.h2_dpContainer).classList.remove(this.activeCls.h2_dpSearchOpen)
        }
      }
    }
  }

  _arrowIcon() {
    return `<svg focusable="false" width="17" height="14" class="icon icon--nav-arrow-right  icon--direction-aware " viewBox="0 0 17 14">
        <path d="M0 7h15M9 1l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" style="fill: none; stroke: #000; stroke-width: 1.5px;"></path>
      </svg>`
  }

   hideContentIfEmpty() {
    // this.viewResutlBtn === '' ? this.viewResutlBtn.setAttribute("href", "/search") : this.viewResutlBtn.setAttribute("href", '/search?q='+ this.searchTerm + '&options%5Bprefix%5D=last')
    this.searchTerm === '' ? this.filterWrapper.classList.add("ms-none") : this.filterWrapper.classList.remove("ms-none")
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

customElements.define("maze-search-dropdown", MazeSearchDropdown)

const closeIcon = document.getElementByID("close-mbl-search");
console.log(closeIcon);
