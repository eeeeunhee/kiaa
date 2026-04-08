/**
 * 공지사항 데이터 및 모달 제어 스크립트
 */

// [1] 공지사항 데이터 관리 (내용 수정 시 이 부분만 변경하세요)
const noticeData = [
    {
        id: "notice_1",
        isImportant: true,
        title: "국제예술협회 공식 홈페이지 개설 안내",
        date: "2026.04.01",
        content: `안녕하세요. 국제예술협회입니다.
        
협회의 소식을 더욱 빠르게 전달하기 위해 공식 홈페이지를 개설하였습니다.
앞으로 이곳을 통해 다양한 공연 소식과 예술인 지원 사업을 안내해 드릴 예정입니다.

많은 관심과 성원 부탁드립니다. 감사합니다.`
    },
    {
        id: "notice_2",
        isImportant: false,
        title: "2026 4월 워크샵 신청 안내",
        date: "2026.04.07",
        // 구글폼 링크가 있으면 버튼이 생기고, 없으면 생기지 않습니다.
        link: "https://forms.gle/UUd7qBr6Ukkmd9Lc7", 
        content: `4월 워크샵 신청이 시작되었습니다.

■ 일정
- 2026년 4월 25일

■ 모집기간
- 2026년 4월 1일 ~ 4월 20일
※ 상황에 따라 조기 마감 또는 폐강될 수 있습니다.

■ 대상
- 초등부 (4~6학년)
- 중등 / 고등 / 대학부
※ 초등부와 중·고·대학부 발레 수업은 분리 진행됩니다.

■ 수업 시간
- 10:00 ~ 11:30 현대무용 (90분)
- 12:00 ~ 15:00 발레 (180분)
- 15:30 ~ 17:30 빠드되 (120분)

■ 수강료
- A. 발레 : 180,000원
- B. 현대무용 : 100,000원
- G. 전체 수강 : 250,000원

■ 장소
- 화성시티발레단 (동탄공원로 1길 27, 2층)

■ 신청방법
1. 아래 [신청하러 가기] 버튼 클릭 후 구글폼 작성
2. 신청 확인 후 개별 안내 문자 발송
3. 안내받은 계좌로 수강료 입금
4. 입금 확인 후 최종 접수 완료`
    }
];

// [2] 페이지 로드 시 리스트 렌더링 함수
function renderNotices() {
    const listBody = document.getElementById('noticeListBody');
    if (!listBody) return;

    listBody.innerHTML = noticeData.map((item, index) => {
        // 중요 공지는 '공지' 배지, 일반은 역순 번호 표시
        const numContent = item.isImportant 
            ? `<span class="badge b-important">공지</span>` 
            : (noticeData.length - index);

        return `
            <tr class="${item.isImportant ? 'notice-important' : ''}" data-id="${item.id}" style="cursor:pointer">
                <td class="col-num">${numContent}</td>
                <td class="col-title"><a href="javascript:void(0)">${item.title}</a></td>
                <td class="col-date">${item.date}</td>
            </tr>
        `;
    }).join('');
}

// [3] 이벤트 바인딩 및 모달 제어
document.addEventListener('DOMContentLoaded', () => {
    renderNotices();

    const noticeModal = document.getElementById('noticeModal');
    const nSearch = document.getElementById('noticeSearch');
    
    // 이벤트 위임 방식을 사용하여 동적으로 생성된 행에도 클릭 이벤트 적용
    const listBody = document.getElementById('noticeListBody');
    if (listBody) {
        listBody.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;

            const id = row.getAttribute('data-id');
            const data = noticeData.find(d => d.id === id);

            if (data) {
                openNoticeModal(data);
            }
        });
    }

    // 모달 열기 함수
    function openNoticeModal(data) {
        document.getElementById('nModalTitle').innerText = data.title;
        document.getElementById('nModalDate').innerText = data.date;
        document.getElementById('nModalContent').innerText = data.content;
        
        // 기존 구글폼 버튼이 있다면 제거
        const existingBtn = document.querySelector('.nt-modal-btn');
        if (existingBtn) existingBtn.remove();

        // 데이터에 링크가 있을 경우에만 신청 버튼 생성
        if (data.link) {
            const btn = document.createElement('a');
            btn.href = data.link;
            btn.target = "_blank";
            btn.className = "nt-modal-btn";
            btn.innerHTML = `신청하러 가기 <i class="fa-solid fa-arrow-right"></i>`;
            document.getElementById('nModalContent').after(btn);
        }

        noticeModal.style.display = 'flex'; // 중앙 정렬을 위해 flex 사용
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }

    // 검색 기능 로직
    if (nSearch) {
        nSearch.addEventListener('keyup', (e) => {
            const val = e.target.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#noticeListBody tr');
            rows.forEach(row => {
                const title = row.querySelector('.col-title').textContent.toLowerCase();
                row.style.display = title.includes(val) ? '' : 'none';
            });
        });
    }

    // 모달 닫기 로직
    const closeModal = () => {
        noticeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    const nClose = document.querySelector('.nt-close');
    if (nClose) nClose.onclick = closeModal;

    window.addEventListener('click', (e) => {
        if (e.target === noticeModal) closeModal();
    });
});