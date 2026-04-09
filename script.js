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

    // --- [기존 코드를 아래 내용으로 대체] ---
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // 효과가 완료되는 지점 (300px만 내려도 블러/스케일 효과가 끝남)
            const scrollThreshold = 500; 
            const scrollRatio = Math.min(scrollY / scrollThreshold, 1);

            // 시각 효과: 수치를 조절해 더 부드럽고 빠르게 반응하게 함
            heroBg.style.filter = `blur(${scrollRatio * 10}px)`; 
            heroBg.style.transform = `scale(${1.1 + scrollRatio * 0.05})`;

            if (heroContent) {
                // 스크롤을 아주 살짝(50px)만 내려도 메인 글자가 바로 나타남
                if (scrollY > 50) {
                    heroContent.classList.add('visible');
                } else {
                    heroContent.classList.remove('visible');
                }
            }
        });
    } else if (heroContent) {
        // 메인 페이지가 아닌 다른 페이지(heroBg가 없는 경우)는 글자가 바로 보이게 설정
        heroContent.classList.add('visible');
    }



    // --- [2. 예술인·단체 로직 (artists.html) - 정렬 및 간격 최종 수정본] ---
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
            
            // 초기화
            const historyContainer = document.getElementById('modalHistory');
            historyContainer.innerHTML = ''; 

            document.getElementById('modalName').innerText = name;
            document.getElementById('modalField').innerText = field;
            document.getElementById('modalCate').innerText = cateText;
            document.getElementById('modalIntro').innerText = (d.intro || "").trim();
            document.getElementById('modalRegion').innerText = d.region || "";
            document.getElementById('modalType').innerText = d.type || "";

            // 2. 이력 가공 (년도 미기입 시 공란 확보로 정렬 유지)
            if (d.history) {
                const lines = d.history.split(/\n|&#10;/);
                const historyHTML = lines
                    .map(line => line.trim())
                    .filter(line => line !== "") 
                    .map(line => {
                        const yearMatch = line.match(/^(\d{4})(.*)/);
                        if (yearMatch) {
                            // 년도가 있는 경우
                            return `<div class="history-row"><span class="his-year">${yearMatch[1]}</span><span class="his-content">${yearMatch[2].trim()}</span></div>`;
                        } else {
                            // 년도가 없는 줄도 빈 span을 생성하여 정렬 공간 확보
                            return `<div class="history-row"><span class="his-year"></span><span class="his-content">${line}</span></div>`;
                        }
                    }).join(''); 
                historyContainer.innerHTML = historyHTML;
            } else {
                historyContainer.innerHTML = "<div class='history-row'><span class='his-content'>등록된 이력이 없습니다.</span></div>";
            }

            // 3. 이미지 매핑
            const cardImg = card.querySelector('.member-img');
            const mainImgPath = cardImg ? cardImg.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') : '';
            document.getElementById('modalImg').style.backgroundImage = `url('${mainImgPath}')`;
            document.getElementById('subImg1').style.backgroundImage = d.img1 ? `url('${d.img1}')` : 'none';
            document.getElementById('subImg2').style.backgroundImage = d.img2 ? `url('${d.img2}')` : 'none';

            // 4. SNS 버튼 처리
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
            
            memberModal.style.display = 'block';
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
    const eventModal = document.getElementById('eventModal');
    // 클래스명이 변경되었을 수 있으므로 공통 close-modal 사용
    const eCloseBtn = eventModal ? eventModal.querySelector('.close-modal') : null;

    // [1] 검색 및 필터 통합 로직
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

    // 필터 버튼 클릭 이벤트
    eFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            eFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateEventList();
        });
    });

    // 검색 입력 이벤트
    if (eSearchInput) {
        eSearchInput.addEventListener('keyup', updateEventList);
    }

    // [2] 카드 클릭 시 모달 데이터 매핑 (ev- 클래스 반영 버전)
    eventCards.forEach(card => {
        card.addEventListener('click', () => {
            const d = card.dataset;

            // 1. 모달 왼쪽 포스터 설정
            const modalMainImg = document.getElementById('modalMainImg');
            if (modalMainImg) {
                if (d.img && d.img !== "undefined") {
                    modalMainImg.style.backgroundImage = `url('${d.img}')`;
                } else {
                    modalMainImg.style.backgroundImage = "none";
                }
            }

            // 2. 제목, 날짜, 뱃지 설정
            const modalTitle = document.getElementById('modalTitle');
            const modalDate = document.getElementById('modalDate');
            const modalBadge = document.getElementById('modalBadge');

            if (modalTitle) modalTitle.innerText = d.title || "";
            if (modalDate) modalDate.innerText = d.date || "";
            
            if (modalBadge) {
                modalBadge.innerText = (d.status === 'past') ? '종료' : '예정';
                // 상태에 따라 색상을 바꾸고 싶다면 아래 주석 해제
                // modalBadge.style.backgroundColor = (d.status === 'past') ? '#666' : '#f39c12';
            }

            // 3. 빈 항목 숨기기 함수 (강제 초기화 로직 추가)
            const checkAndSet = (id, value) => {
                const target = document.getElementById(id);
                if (!target) return;
    
                const valSpan = target.querySelector('.value');

                // 1단계: 일단 이전 데이터를 깨끗하게 지웁니다 (핵심!)
                if (valSpan) valSpan.innerText = ""; 

                // 2단계: 값이 진짜 있을 때만 보여주고 텍스트 넣기
                if (!value || value.trim() === "" || value === "undefined" || value === "null") {
                    target.style.display = 'none'; 
                } else {
                    target.style.display = 'flex'; 
                    if (valSpan) valSpan.innerText = value;
                }
            };

            // 기본 정보 상세 항목 체크
            checkAndSet('li-participants', d.participants);
            checkAndSet('li-location', d.location);
            checkAndSet('li-time', d.time);
            checkAndSet('li-host', d.host);
            checkAndSet('li-manager', d.manager);
            checkAndSet('li-support', d.support);
            checkAndSet('li-ticket', d.ticket);

            // 4. 소개글 처리 (위치 이동 반영)
            const descSec = document.getElementById('sec-desc');
            const modalDesc = document.getElementById('modalDesc');
            if (modalDesc) {
                if (!d.desc || d.desc.trim() === "" || d.desc === "undefined") {
                    if (descSec) descSec.style.display = 'none';
                } else {
                    if (descSec) descSec.style.display = 'block';
                    modalDesc.innerText = d.desc;
                }
            }

            // 5. 현장 사진 버튼 (갤러리 링크) 처리
            const gallerySec = document.getElementById('sec-gallery-link');
            const galleryBtn = document.getElementById('modalGalleryBtn');
            if (gallerySec && galleryBtn) {
                if (d.gallery && d.gallery.trim() !== "" && d.gallery !== "undefined") {
                    gallerySec.style.display = 'block';
                    galleryBtn.href = d.gallery;
                } else {
                    gallerySec.style.display = 'none';
                }
            }

            // 모달 열기 (네비게이션 바 문제를 해결하기 위해 z-index가 적용된 클래스 사용)
            if (eventModal) {
                eventModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // 스크롤 방지
            }
        });
    });

    // [3] 모달 닫기 로직
    const closeModal = () => {
        if (eventModal) {
            eventModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 스크롤 복구
        }
    };

    if (eCloseBtn) {
        eCloseBtn.onclick = closeModal;
    }
    
    // 모달 바깥 영역 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeModal();
        }
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
                // 1. 초기 조회수 설정 (로컬 스토리지에 저장된 값이 있으면 사용, 없으면 HTML 초기값)
                let currentViews = localStorage.getItem(noticeId);
                if (currentViews) {
                    viewCountSpan.innerText = parseInt(currentViews).toLocaleString();
                } else {
                    // 처음 방문 시 현재 HTML에 써있는 숫자를 저장
                    localStorage.setItem(noticeId, viewCountSpan.innerText.replace(/,/g, ''));
                }

                // 2. 제목 클릭 시 조회수 증가 로직
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
    window.onclick = (event) => {
        const mModal = document.getElementById('memberModal');
        const eModal = document.getElementById('eventModal');
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
    };
});