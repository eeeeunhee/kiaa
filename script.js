document.addEventListener('DOMContentLoaded', () => {
    // --- [1. 공통 요소: 네비게이션 & 헤더] ---
    const hamButton = document.getElementById('ham-button');
    const navbar = document.getElementById('navbar');
    const submenuTriggers = document.querySelectorAll('.has-submenu > a');
    const heroBg = document.getElementById('heroBg');
    const heroContent = document.querySelector('.hero-content');

    if (hamButton && navbar) {
        hamButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navbar.classList.toggle('open');
        });
    }

    submenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();
            const targetSubmenu = trigger.nextElementSibling;
            document.querySelectorAll('.submenu').forEach(sub => {
                if (sub !== targetSubmenu) sub.classList.remove('active');
            });
            if (targetSubmenu) targetSubmenu.classList.toggle('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (navbar && !navbar.contains(e.target) && hamButton && !hamButton.contains(e.target)) {
            navbar.classList.remove('open');
            document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('active'));
        }
    });

    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const scrollThreshold = 500; 
            const scrollRatio = Math.min(scrollY / scrollThreshold, 1);

            heroBg.style.filter = `blur(${scrollRatio * 10}px)`; 
            heroBg.style.transform = `scale(${1.1 + scrollRatio * 0.05})`;

            if (heroContent) {
                if (scrollY > 50) {
                    heroContent.classList.add('visible');
                } else {
                    heroContent.classList.remove('visible');
                }
            }
        });
    } else if (heroContent) {
        heroContent.classList.add('visible');
    }


    // --- [2. 예술인·단체 로직 (artists.html)] ---
    const memberGrid = document.querySelector('.member-grid');
    if (memberGrid) {
        const memberCards = document.querySelectorAll('.member-card');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const searchInput = document.querySelector('.search-box input');
        const memberModal = document.getElementById('memberModal');
        const mCloseBtn = memberModal?.querySelector('.close-modal');

        const filterMembers = () => {
            const activeBtn = document.querySelector('.filter-btn.active');
            const currentFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
            const currentSearch = searchInput ? searchInput.value.toLowerCase().trim() : '';

            memberCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const name = card.querySelector('h3')?.textContent.toLowerCase() || "";
                const field = card.querySelector('.field')?.textContent.toLowerCase() || "";
                const isCategoryMatch = (currentFilter === 'all' || category === currentFilter);
                const isSearchMatch = (name.includes(currentSearch) || field.includes(currentSearch));
                card.style.display = (isCategoryMatch && isSearchMatch) ? 'block' : 'none';
            });
        };

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterMembers();
            });
        });

        if (searchInput) searchInput.addEventListener('input', filterMembers);

        memberCards.forEach(card => {
            card.addEventListener('click', () => {
                const d = card.dataset;
                const name = card.querySelector('h3')?.innerText || "";
                const field = card.querySelector('.field')?.innerText || "";
                const cateText = card.querySelector('.cate')?.innerText || "";
                
                const historyContainer = document.getElementById('modalHistory');
                if (historyContainer) historyContainer.innerHTML = ''; 

                document.getElementById('modalName').innerText = name;
                document.getElementById('modalField').innerText = field;
                document.getElementById('modalCate').innerText = cateText;
                document.getElementById('modalIntro').innerText = (d.intro || "").trim();
                document.getElementById('modalRegion').innerText = d.region || "";
                document.getElementById('modalType').innerText = d.type || "";

                if (d.history) {
                    const lines = d.history.split(/\n|&#10;/);
                    const historyHTML = lines
                        .map(line => line.trim())
                        .filter(line => line !== "") 
                        .map(line => {
                            const yearMatch = line.match(/^(\d{4})(.*)/);
                            if (yearMatch) {
                                return `<div class="history-row"><span class="his-year">${yearMatch[1]}</span><span class="his-content">${yearMatch[2].trim()}</span></div>`;
                            } else {
                                return `<div class="history-row"><span class="his-year"></span><span class="his-content">${line}</span></div>`;
                            }
                        }).join(''); 
                    if (historyContainer) historyContainer.innerHTML = historyHTML;
                } else {
                    if (historyContainer) historyContainer.innerHTML = "<div class='history-row'><span class='his-content'>등록된 이력이 없습니다.</span></div>";
                }

                const cardImg = card.querySelector('.member-img');
                const mainImgPath = cardImg ? cardImg.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') : '';
                document.getElementById('modalImg').style.backgroundImage = `url('${mainImgPath}')`;
                document.getElementById('subImg1').style.backgroundImage = d.img1 ? `url('${d.img1}')` : 'none';
                document.getElementById('subImg2').style.backgroundImage = d.img2 ? `url('${d.img2}')` : 'none';

                const snsLinks = {
                    'linkInsta': d.insta,
                    'linkBlog': d.blog,
                    'linkWeb': d.web,
                    'linkYoutube': d.youtube
                };
                for (const [id, url] of Object.entries(snsLinks)) {
                    const el = document.getElementById(id);
                    if (el) {
                        if (url && url !== '#' && url.trim() !== '') {
                            el.href = url;
                            el.style.display = 'inline-flex';
                        } else {
                            el.style.display = 'none';
                        }
                    }
                }
                
                if (memberModal) memberModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        if (mCloseBtn) mCloseBtn.onclick = () => {
            memberModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }


    // --- [3. 공연·전시 로직 (events.html)] ---
    const eventGrid = document.getElementById('eventGrid');

    if (eventGrid) {
        const eventCards = document.querySelectorAll('.event-card');
        const eFilterBtns = document.querySelectorAll('.filter-btn');
        const eSearchInput = document.getElementById('eventSearch');
        const evModal = document.getElementById('eventModalNew'); 
        const eCloseBtn = evModal ? evModal.querySelector('.close-ev-modal') : null;

        function updateEventList() {
            const activeBtn = document.querySelector('.filter-btn.active');
            const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';
            const searchVal = eSearchInput ? eSearchInput.value.toLowerCase() : "";

            eventCards.forEach(card => {
                const d = card.dataset;
                const status = d.status || "";
                const title = (d.title || "").toLowerCase();
                const host = (d.host || "").toLowerCase();
                const participants = (d.participants || "").toLowerCase();

                const matchesFilter = (activeFilter === 'all' || status === activeFilter);
                const matchesSearch = (title.includes(searchVal) || host.includes(searchVal) || participants.includes(searchVal));

                card.style.display = (matchesFilter && matchesSearch) ? 'block' : 'none';
            });
        }

        const checkAndSet = (id, value) => {
            const target = document.getElementById(id);
            if (!target) return;

            const valSpan = target.querySelector('.value') || target;
            
            if (!value || value.trim() === "" || value === "undefined" || value === "null") {
                target.style.display = 'none'; 
            } else {
                target.style.display = ""; 
                valSpan.innerText = value;
            }
        };

        eFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                eFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateEventList();
            });
        });

        if (eSearchInput) {
            eSearchInput.addEventListener('keyup', updateEventList);
        }

        eventCards.forEach(card => {
            card.addEventListener('click', () => {
                const d = card.dataset;

                // 1. 이미지 설정
                const evNewImg = document.getElementById('evNewImg');
                if (evNewImg) {
                    if (d.img && d.img !== "undefined") {
                        evNewImg.style.backgroundImage = `url('${d.img}')`;
                    } else {
                        evNewImg.style.backgroundImage = "none";
                    }
                }

                // 2. 기본 텍스트 정보 설정
                const evNewTitle = document.getElementById('evNewTitle');
                const evNewDate = document.getElementById('evNewDate');
                const evNewBadge = document.getElementById('evNewBadge');

                if (evNewTitle) evNewTitle.innerText = d.title || "";
                if (evNewDate) evNewDate.innerText = d.date || "";
                if (evNewBadge) {
                    evNewBadge.innerText = (d.status === 'past') ? '종료' : '예정';
                    evNewBadge.className = `badge b-${d.status}`; 
                }

                // 3. 상세 정보 리스트 설정
                checkAndSet('evNewParticipants', d.participants);
                checkAndSet('evNewLocation', d.location);
                checkAndSet('evNewTime', d.time);
                checkAndSet('evNewHost', d.host);
                checkAndSet('evNewManager', d.manager);
                checkAndSet('evNewSupport', d.support);
                
                // ★ [핵심수정] 단순 링크글자로 출력해버리던 기존 checkAndSet 함수 호출을 삭제하고, 
                // 아래에서 동적으로 예쁜 주황색 버튼을 생성하도록 코드를 통합 변경했습니다.
                const ticketUrl = d.ticket;
                const ticketSpan = document.getElementById('evNewTicket');
                const ticketRow = ticketSpan ? ticketSpan.closest('li') : null;

                if (ticketSpan) {
                    if (ticketUrl && ticketUrl.trim() !== "" && ticketUrl !== "undefined" && ticketUrl !== "null") {
                        if (ticketRow) ticketRow.style.display = ""; // 행 보이기
                        ticketSpan.innerHTML = `
                            <a href="${ticketUrl}" target="_blank" style="
                                display: inline-block !important;
                                background-color: #f39c12 !important;
                                color: #fff !important;
                                padding: 4px 12px !important;
                                border-radius: 4px !important;
                                font-size: 0.85rem !important;
                                font-weight: bold !important;
                                text-decoration: none !important;
                                cursor: pointer !important;
                                transition: background 0.2s !important;
                            " onmouseover="this.style.backgroundColor='#d35400'" onmouseout="this.style.backgroundColor='#f39c12'">
                                예매처 바로가기
                            </a>
                        `;
                    } else {
                        // 티켓 링크가 아예 없거나 비어있는 경우 문구 처리
                        if (ticketRow) ticketRow.style.display = ""; 
                        ticketSpan.innerHTML = `<span style="color: #888;">현장 예매 또는 정보 없음</span>`;
                    }
                }

                // 4. 소개글 설정
                const evNewDesc = document.getElementById('evNewDesc');
                const descSec = evNewDesc ? evNewDesc.closest('.ev-new-section') : null;
                if (evNewDesc) {
                    if (!d.desc || d.desc.trim() === "" || d.desc === "undefined") {
                        if (descSec) descSec.style.display = 'none';
                    } else {
                        if (descSec) descSec.style.display = "";
                        evNewDesc.innerText = d.desc;
                    }
                }

                // 5. 갤러리 링크 설정
                const gallerySec = document.getElementById('evNewGallerySec');
                const galleryBtn = document.getElementById('evNewGalleryBtn');
                if (gallerySec && galleryBtn) {
                    if (d.gallery && d.gallery.trim() !== "" && d.gallery !== "undefined") {
                        gallerySec.style.display = "";
                        galleryBtn.href = d.gallery;
                    } else {
                        gallerySec.style.display = 'none';
                    }
                }

                // 6. 모달 표시
                if (evModal) {
                    evModal.style.display = (window.innerWidth <= 992) ? "block" : "flex";
                    document.body.style.overflow = 'hidden'; 
                }
            });
        });

        const closeEvModal = () => {
            if (evModal) {
                evModal.style.display = 'none';
                document.body.style.overflow = 'auto'; 
            }
        };

        if (eCloseBtn) eCloseBtn.onclick = closeEvModal;
        
        window.addEventListener('click', (e) => {
            if (e.target === evModal) closeEvModal();
        });
    }


    // --- [4. 갤러리 로직 (gallery.html)] ---
    if (window.location.hash && window.location.pathname.includes('gallery')) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const offset = targetElement.offsetTop - 100;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }, 200);
            });
        }
    }

    const lbModal = document.getElementById('lightboxModal');
    const lbImg = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (lbModal && lbImg) {
        lbModal.style.zIndex = "1100"; 
        lbModal.style.paddingTop = "120px"; 

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lbModal.style.display = 'block';
                    lbImg.src = img.src;
                    lbCaption.innerText = img.alt || "";
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLightbox = () => {
            lbModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        const closeLbBtn = document.querySelector('.close-lightbox');
        if (closeLbBtn) closeLbBtn.onclick = closeLightbox;

        lbImg.onclick = (e) => {
            e.stopPropagation(); 
            closeLightbox();
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && lbModal.style.display === 'block') {
                closeLightbox();
            }
        });
    }


    // --- [5. 공지사항 로직 (notice.html) + 조회수 추가] ---
    const noticeSearch = document.getElementById('noticeSearch');
    const noticeRows = document.querySelectorAll('.notice-table tbody tr');

    if (noticeRows.length > 0) {
        noticeRows.forEach(row => {
            const noticeId = row.getAttribute('data-id');
            const viewCountSpan = row.querySelector('.view-count');
            
            if (noticeId && viewCountSpan) {
                let currentViews = localStorage.getItem(noticeId);
                if (currentViews) {
                    viewCountSpan.innerText = parseInt(currentViews).toLocaleString();
                } else {
                    localStorage.setItem(noticeId, viewCountSpan.innerText.replace(/,/g, ''));
                }

                const titleLink = row.querySelector('.col-title a');
                if (titleLink) {
                    titleLink.addEventListener('click', () => {
                        let views = parseInt(localStorage.getItem(noticeId) || 0);
                        views += 1;
                        localStorage.setItem(noticeId, views);
                        viewCountSpan.innerText = views.toLocaleString();
                    });
                }
            }
        });
    }

    if (noticeSearch) {
        noticeSearch.addEventListener('keyup', (e) => {
            const val = e.target.value.toLowerCase().trim();
            noticeRows.forEach(row => {
                const titleText = row.querySelector('.col-title').textContent.toLowerCase();
                row.style.display = titleText.includes(val) ? '' : 'none';
            });
        });
    }


    // --- [6. 공통: 모달 외곽 클릭 시 닫기] ---
    window.addEventListener('click', (event) => {
        const mModal = document.getElementById('memberModal');
        const eModal = document.getElementById('eventModalNew'); // 새로 교체된 모달 ID 매핑
        const lModal = document.getElementById('lightboxModal');
        
        if (event.target === mModal) {
            mModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === eModal) {
            eModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === lModal) {
            lModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});