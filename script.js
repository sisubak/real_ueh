const clientsData = [
    // Твой список клиентов здесь
]

let current_gallery = []
let current_gallery_index = 0
let flip_index = 0
let phrase_index = 0
let char_index = 0
let is_deleting = false
let placeholder_index = 0
let counters_animated = false

function debounce(fn, wait) {
    let t
    return function() {
        clearTimeout(t)
        t = setTimeout(() => fn.apply(this, arguments), wait)
    }
}

function render_clients() {
    const grid = document.getElementById('clientsGrid')
    if (!grid) return
    
    const frag = document.createDocumentFragment()
    
    clientsData.forEach((client, i) => {
        const card = document.createElement('div')
        card.className = 'client-card'
        card.setAttribute('data-type', client.type)
        
        let art_btn = ''
        if (client.arts && client.arts.length > 0) {
            art_btn = `<button class="card-btn art" onclick="open_art_gallery(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Arts</button>`
        }
        
        let discord_btn = ''
        if (client.discord) {
            discord_btn = `<a href="${client.discord}" class="card-btn outline" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>Discord</a>`
        }
        
        let telegram_btn = ''
        if (client.telegram) {
            telegram_btn = `<a href="${client.telegram}" class="card-btn outline" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>Telegram</a>`
        }
        
        let download_btn = ''
        if (client.download) {
            download_btn = `<a href="${client.download}" class="card-btn" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download</a>`
        } else if (client.buy) {
            download_btn = `<a href="${client.buy}" class="card-btn" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Buy</a>`
        }
        
        card.innerHTML = `
            <div class="card-img">
                <img src="${client.image}" alt="${client.title}" loading="lazy">
                <span class="card-badge">${client.badge}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${client.title}</h3>
                <p class="card-desc">${client.description}</p>
                <div class="card-buttons">
                    <button class="card-btn outline" onclick="open_image_modal('${client.image}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>Preview
                    </button>
                    ${art_btn}
                    ${discord_btn}
                    ${telegram_btn}
                    ${download_btn}
                </div>
            </div>
        `
        frag.appendChild(card)
    })
    
    grid.innerHTML = ''
    grid.appendChild(frag)
}

function flip_word() {
    const words = document.querySelectorAll('.flip-word')
    if (words.length === 0) return
    
    const current = words[flip_index]
    current.classList.remove('active')
    current.style.opacity = '0'
    current.style.transform = 'translateY(-20px)'
    current.style.filter = 'blur(4px)'
    
    flip_index = (flip_index + 1) % words.length
    
    const next = words[flip_index]
    next.style.transform = 'translateY(20px)'
    
    setTimeout(function() {
        next.classList.add('active')
        next.style.opacity = '1'
        next.style.transform = 'translateY(0)'
        next.style.filter = 'blur(0)'
    }, 200)
}

function init_flip_words() {
    const words = document.querySelectorAll('.flip-word')
    words.forEach(function(word, i) {
        word.style.transition = 'all 0.4s ease'
        if (i === 0) {
            word.classList.add('active')
            word.style.opacity = '1'
            word.style.transform = 'translateY(0)'
            word.style.filter = 'blur(0)'
        } else {
            word.style.opacity = '0'
            word.style.transform = 'translateY(20px)'
            word.style.filter = 'blur(4px)'
        }
    })
    setInterval(flip_word, 2500)
}

const typing_phrases = [
    'carefully collected and verified',
    'tested on real machines',
    'updated with new releases',
    'completely free to use',
    'built for the community'
]

function type_text() {
    const element = document.getElementById('typingText')
    if (!element) return
    
    const current_phrase = typing_phrases[phrase_index]
    
    if (is_deleting) {
        char_index--
        element.textContent = current_phrase.substring(0, char_index)
    } else {
        char_index++
        element.textContent = current_phrase.substring(0, char_index)
    }
    
    let speed = is_deleting ? 30 : 70
    
    if (!is_deleting && char_index === current_phrase.length) {
        speed = 2000
        is_deleting = true
    } else if (is_deleting && char_index === 0) {
        is_deleting = false
        phrase_index = (phrase_index + 1) % typing_phrases.length
        speed = 500
    }
    
    setTimeout(type_text, speed)
}

const search_placeholders = [
    'Search for DDNet clients...',
    'Find Teeworlds mods...',
    'Looking for something?',
    'Type client name...',
    'Discover new clients...'
]

function change_placeholder() {
    const input = document.getElementById('searchInput')
    if (!input) return
    if (document.activeElement === input) return
    
    placeholder_index = (placeholder_index + 1) % search_placeholders.length
    input.placeholder = search_placeholders[placeholder_index]
}

function init_placeholder() {
    const input = document.getElementById('searchInput')
    if (input) {
        input.placeholder = search_placeholders[0]
        setInterval(change_placeholder, 3500)
    }
}

function init_terminal() {
    const terminal = document.querySelector('.about-block.terminal')
    if (!terminal) return
    
    const lines = terminal.querySelectorAll('.terminal-line')
    let animated = false
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !animated) {
                animated = true
                lines.forEach(function(line, i) {
                    line.style.opacity = '0'
                    line.style.transform = 'translateX(-10px)'
                    line.style.transition = 'all 0.4s ease'
                    
                    setTimeout(function() {
                        line.style.opacity = '1'
                        line.style.transform = 'translateX(0)'
                    }, 300 + i * 250)
                })
                observer.unobserve(entry.target)
            }
        })
    }, { threshold: 0.5 })
    
    observer.observe(terminal)
}

function animate_counter(element, target) {
    let current = 0
    const duration = 2000
    const start_time = performance.now()
    
    function update(current_time) {
        const elapsed = current_time - start_time
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        
        current = Math.floor(ease * target)
        element.textContent = current
        
        if (progress < 1) {
            requestAnimationFrame(update)
        } else {
            element.textContent = target
        }
    }
    
    requestAnimationFrame(update)
}

function init_counters() {
    const section = document.getElementById('stats')
    if (!section) return
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !counters_animated) {
                counters_animated = true
                
                document.querySelectorAll('.stat-value').forEach(function(el) {
                    const target = parseInt(el.getAttribute('data-count'))
                    animate_counter(el, target)
                })
                
                observer.unobserve(entry.target)
            }
        })
    }, { threshold: 0.3 })
    
    observer.observe(section)
}

function init_scroll() {
    const header = document.getElementById('header')
    const scroll_btn = document.getElementById('scrollTop')
    
    window.addEventListener('scroll', function() {
        const y = window.scrollY
        
        if (y > 50) {
            header.classList.add('scrolled')
        } else {
            header.classList.remove('scrolled')
        }
        
        if (y > 500) {
            scroll_btn.classList.add('visible')
        } else {
            scroll_btn.classList.remove('visible')
        }
    }, { passive: true })
    
    scroll_btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
}

function init_navigation() {
    const toggle = document.getElementById('menuToggle')
    const menu = document.getElementById('navMenu')
    
    toggle.addEventListener('click', function() {
        toggle.classList.toggle('active')
        menu.classList.toggle('active')
    })
    
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault()
            const target_id = this.getAttribute('href')
            const target = document.querySelector(target_id)
            
            if (target) {
                const offset = 80
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                })
                menu.classList.remove('active')
                toggle.classList.remove('active')
            }
        })
    })
}

function init_search() {
    const input = document.getElementById('searchInput')
    if (!input) return
    
    input.addEventListener('input', debounce(function(e) {
        const term = e.target.value.toLowerCase()
        
        document.querySelectorAll('.client-card').forEach(function(card) {
            const title = card.querySelector('.card-title').textContent.toLowerCase()
            const desc = card.querySelector('.card-desc').textContent.toLowerCase()
            
            if (title.includes(term) || desc.includes(term)) {
                card.classList.remove('hidden')
            } else {
                card.classList.add('hidden')
            }
        })
    }, 200))
}

function init_filters() {
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) {
                b.classList.remove('active')
            })
            this.classList.add('active')
            
            const filter = this.getAttribute('data-filter')
            
            document.querySelectorAll('.client-card').forEach(function(card) {
                const types = card.getAttribute('data-type') || ''
                
                if (filter === 'all' || types.includes(filter)) {
                    card.classList.remove('hidden')
                } else {
                    card.classList.add('hidden')
                }
            })
        })
    })
}

function open_image_modal(src) {
    const modal = document.getElementById('imageModal')
    const img = document.getElementById('modalImage')
    
    img.src = src
    modal.classList.add('active')
    document.body.style.overflow = 'hidden'
}

function close_image_modal() {
    const modal = document.getElementById('imageModal')
    modal.classList.remove('active')
    document.body.style.overflow = ''
}

window.open_image_modal = open_image_modal

function open_art_gallery(index) {
    const client = clientsData[index]
    if (!client.arts || client.arts.length === 0) return
    
    current_gallery = client.arts
    current_gallery_index = 0
    
    const gallery = document.getElementById('artGallery')
    const img = document.getElementById('galleryImage')
    const dots = document.getElementById('galleryDots')
    
    img.src = current_gallery[0]
    
    dots.innerHTML = ''
    current_gallery.forEach(function(_, i) {
        const dot = document.createElement('div')
        dot.className = 'gallery-dot'
        if (i === 0) dot.classList.add('active')
        dot.addEventListener('click', function() {
            go_to_image(i)
        })
        dots.appendChild(dot)
    })
    
    update_gallery_counter()
    gallery.classList.add('active')
    document.body.style.overflow = 'hidden'
}

function go_to_image(i) {
    current_gallery_index = i
    
    const img = document.getElementById('galleryImage')
    img.src = current_gallery[i]
    
    document.querySelectorAll('.gallery-dot').forEach(function(dot, index) {
        if (index === i) {
            dot.classList.add('active')
        } else {
            dot.classList.remove('active')
        }
    })
    
    update_gallery_counter()
}

function update_gallery_counter() {
    const counter = document.getElementById('galleryCount')
    if (counter) {
        counter.textContent = (current_gallery_index + 1) + ' / ' + current_gallery.length
    }
}

function close_gallery() {
    const gallery = document.getElementById('artGallery')
    gallery.classList.remove('active')
    document.body.style.overflow = ''
}

window.open_art_gallery = open_art_gallery

function init_modals() {
    const modal_close = document.getElementById('modalClose')
    const image_modal = document.getElementById('imageModal')
    const gallery_close = document.getElementById('galleryClose')
    const gallery_prev = document.getElementById('galleryPrev')
    const gallery_next = document.getElementById('galleryNext')
    const art_gallery = document.getElementById('artGallery')
    
    if (modal_close) {
        modal_close.addEventListener('click', close_image_modal)
    }
    
    if (image_modal) {
        image_modal.addEventListener('click', function(e) {
            if (e.target === image_modal) {
                close_image_modal()
            }
        })
    }
    
    if (gallery_close) {
        gallery_close.addEventListener('click', close_gallery)
    }
    
    if (gallery_prev) {
        gallery_prev.addEventListener('click', function() {
            const new_index = (current_gallery_index - 1 + current_gallery.length) % current_gallery.length
            go_to_image(new_index)
        })
    }
    
    if (gallery_next) {
        gallery_next.addEventListener('click', function() {
            const new_index = (current_gallery_index + 1) % current_gallery.length
            go_to_image(new_index)
        })
    }
    
    if (art_gallery) {
        art_gallery.addEventListener('click', function(e) {
            if (e.target === art_gallery) {
                close_gallery()
            }
        })
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            close_image_modal()
            close_gallery()
        }
        
        const gallery = document.getElementById('artGallery')
        if (gallery && gallery.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                const new_index = (current_gallery_index + 1) % current_gallery.length
                go_to_image(new_index)
            }
            if (e.key === 'ArrowLeft') {
                const new_index = (current_gallery_index - 1 + current_gallery.length) % current_gallery.length
                go_to_image(new_index)
            }
        }
    })
}

function init_card_hover() {
    if (window.innerWidth < 768) return
    
    document.querySelectorAll('.feature-card, .client-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)'
        })
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)'
        })
    })
}

function init() {
    render_clients()
    init_flip_words()
    init_placeholder()
    init_terminal()
    init_counters()
    init_scroll()
    init_navigation()
    init_search()
    init_filters()
    init_modals()
    init_card_hover()
    
    setTimeout(type_text, 1000)
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}
