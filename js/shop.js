document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Hiển thị thông tin người dùng
    document.getElementById('username-display').textContent = currentUser.username;
    
    // Xử lý đăng xuất
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Xử lý chọn sản phẩm
    const selectBtns = document.querySelectorAll('.select-btn');
    
    selectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.getAttribute('data-price');
            
            // Lưu thông tin sản phẩm đã chọn
            sessionStorage.setItem('selectedProduct', JSON.stringify({
                id: productId,
                name: productName,
                price: productPrice
            }));
            
            // Chuyển đến trang thanh toán
            window.location.href = 'banking.html';
        });
    });
});
