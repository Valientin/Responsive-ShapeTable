const shapeTable = (function main() {
    const tables = [];
  
    function Table(element) {
        this.down = false;
        this.scrollLeft = 0;
        this.x = 0;
        this.filterDown = false;

        this.element = element;
        this.body = this.element.getElementsByTagName('tbody')[0];
        this.ths = this.element.getElementsByTagName('th');
        this.bodyRows = this.element.querySelectorAll('tbody > tr');
    
        if (!this.element.style.position) {
            this.element.style.position = 'relative';
        }

        this.clearTable();

        this.filterButton = this.element.querySelector('.filters > button');

        if (this.filterButton) {
            this.addFilters();
        }
    
        this.refreshTdSize();
        this.addListeners();
        this.addScrolls();
    }

    Table.prototype.clearTable = function() {
        this.filterBoxes = this.element.querySelectorAll('tr.filter-boxes > td > input[type="checkbox"]');
        this.filterBoxesTr = this.body.querySelector('tr.filter-boxes');

        if (this.filterBoxesTr) {
            this.filterBoxesTr.classList.add('hidden');
        }

        if (this.filterBoxes) {
            this.filterBoxes.forEach(elem => elem.checked = true);
        }

        this.leftScroll = this.element.querySelector('button.scroll-left');
        this.rightScroll = this.element.querySelector('button.scroll-right');

        if (this.leftScroll && this.rightScroll) {
            this.leftScroll.classList.remove('disabled');
            this.rightScroll.classList.remove('disabled');
        }

        this.hideElements = this.element.querySelectorAll(`td.hidden-by-filters, th.hidden-by-filters`);

        this.hideElements.forEach(elem => {
            elem.classList.remove('hidden-by-filters');
        });
    }

    Table.prototype.addFilters = function() {
        const self = this;

        const length = this.ths.length - this.filterBoxes.length;

        for (let i = 0; i < length; i++) {
            const td = document.createElement('td');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;

            td.appendChild(cb);
            this.filterBoxesTr.appendChild(td);
        }

        this.filterBoxes = this.element.querySelectorAll('tr.filter-boxes > td > input[type="checkbox"]');

        this.filterButton.onclick = function(e) {
            if (self.filterDown) {
                const hideIndexes = [];
                self.hideElements = [];

                self.filterBoxes.forEach((box, index) => {
                    if (!box.checked) {
                        hideIndexes.push(index);
                    }
                });

                for(let index of hideIndexes) {
                    const elements = self.element.querySelectorAll(`td:nth-child(${index + 1}), th:nth-child(${index + 1})`);

                    elements.forEach(elem => {
                        elem.classList.add('hidden-by-filters');
                    });
                    
                    self.hideElements.push(...elements);
                }

                self.filterDown = false;
                self.filterBoxesTr.classList.add('hidden');
                self.body.scrollLeft = 0;
                self.refreshTdSize();
            } else {
                self.hideElements.forEach(elem => {
                    elem.classList.remove('hidden-by-filters');
                });

                self.filterDown = true;
                self.filterBoxesTr.classList.remove('hidden');
                self.body.scrollLeft = 0;
                self.refreshTdSize();
            }
        }
    }

    Table.prototype.addScrolls = function() {
        const self = this;

        if (this.leftScroll && this.rightScroll) {
            if (this.body.scrollLeft === 0) {
                this.leftScroll.classList.add('disabled');
            }

            if (this.body.scrollLeft === (this.body.scrollWidth - this.body.clientWidth)) {
                this.rightScroll.classList.add('disabled');
            }

            this.rightScroll.onclick = function(e) {
                self.body.scrollLeft += 100;
            }

            this.leftScroll.onclick = function(e) {
                self.body.scrollLeft -= 100;
            }

            this.body.onscroll = function disabled(e) {
                if (this.scrollLeft == 0) {
                    self.leftScroll.classList.add('disabled');
                } else {
                    self.leftScroll.classList.remove('disabled');
                }
        
                if (this.scrollLeft == (this.scrollWidth - this.clientWidth)) {
                    self.rightScroll.classList.add('disabled');
                } else {
                    self.rightScroll.classList.remove('disabled');
                }
            }
        }
    }

    Table.prototype.addListeners = function() {
        const self = this;
        this.body.onmousedown = function(e) {
            self.down = true;
            self.scrollLeft = this.scrollLeft;
            self.x = e.clientX;
        }

        this.body.onmouseup = function(e) {
            self.down = false;
        }

        this.body.onmouseleave = function(e) {
            self.down = false;
        }

        this.body.onmousemove = function(e) {
            if (self.down) {
                this.scrollLeft = self.scrollLeft + self.x - e.clientX;

                e.preventDefault();
            }
        }
    }
  
    Table.prototype.refreshTdSize = function () {
        for (let i = 0; i < this.ths.length; i++) {
            this.ths[i].style.height = 'auto';
            let maxHeigth = this.ths[i].offsetHeight;
            
            for (let j = 0; j < this.bodyRows.length; j++) {
                const elem = this.element.querySelector(`tr:nth-child(${j + 1}) td:nth-child(${i + 1})`);
                
                if (elem && elem.offsetHeight && elem.offsetHeight > maxHeigth) {
                    elem.style.height = 'auto';
                    maxHeigth = elem.offsetHeight;
                }
            }
    
            this.ths[i].style.height = maxHeigth + 'px';
    
            for (let j = 0; j < this.bodyRows.length; j++) {
                const elem = this.element.querySelector(`tr:nth-child(${j + 1}) td:nth-child(${i + 1})`);
        
                if (elem && elem.offsetHeight && elem.offsetHeight < maxHeigth) {
                    elem.style.height = maxHeigth + 'px';
                }
            }
        }
    };
  
    function init() {
        const matches = document.querySelector('#app').querySelectorAll('table.shape-table');
        for (var i = 0; i < matches.length; i++) {
            if (matches[i].tagName === 'TABLE') {
                tables[i] = new Table(matches[i]);
            }
        }
    }
  
    function refreshTdSizes() {
        for (var i = 0; i < tables.length; i++) {
            tables[i].refreshTdSize();
        }
    }

    window.onresize = refreshTdSizes;
  
    return {
        init
    };
})();
  
