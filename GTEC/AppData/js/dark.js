const theme = localStorage.getItem('theme'); // dark, light 시스템 테마 설정을 가져옴.
if(theme) {
    document.body.setAttribute('class', theme);
}

// 시스템설정확인 window.matchMedia() :: CSS의 미디어쿼리가 현재 페이지에 해당하는지 확인.
function toggleTheme() {
    // 저장된 값이 없다면 시스템 설정을 기준으로 한다.
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    // console.log(currentTheme)
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // console.log(newTheme, currentTheme)

    // 최상위 엘리먼트에 설정, 로컬 스토리지에 설정을 저장.
    document.body.setAttribute('class', newTheme);
    localStorage.setItem('theme', newTheme);
}


const chkbox = document.querySelector('.check-dark');
chkbox.addEventListener('click', function() {
    toggleTheme();
});
