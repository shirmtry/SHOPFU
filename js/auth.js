document.addEventListener('DOMContentLoaded', function() {
    // Chuyển tab đăng nhập/đăng ký
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Xóa active khỏi tất cả các tab và form
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Thêm active vào tab và form được chọn
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Xử lý đăng ký
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            // Kiểm tra mật khẩu trùng khớp
            if (password !== confirmPassword) {
                alert('Mật khẩu không trùng khớp!');
                return;
            }
            
            // Lưu thông tin người dùng vào localStorage
            const user = {
                username,
                email,
                password
            };
            
            localStorage.setItem('user_' + username, JSON.stringify(user));
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            
            // Chuyển sang tab đăng nhập
            document.querySelector('.tab-btn[data-tab="login"]').click();
            document.getElementById('login-username').value = username;
        });
    }

    // Xử lý đăng nhập
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            // Kiểm tra thông tin đăng nhập
            const userData = localStorage.getItem('user_' + username);
            
            if (!userData) {
                alert('Tên đăng nhập không tồn tại!');
                return;
            }
            
            const user = JSON.parse(userData);
            
            if (user.password !== password) {
                alert('Mật khẩu không chính xác!');
                return;
            }
            
            // Lưu trạng thái đăng nhập và chuyển hướng
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'shop.html';
        });
    }
});
