document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập và sản phẩm đã chọn
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct'));
    
    if (!currentUser || !selectedProduct) {
        window.location.href = 'index.html';
        return;
    }
    
    // Hiển thị thông tin đơn hàng
    document.getElementById('product-name').textContent = selectedProduct.name;
    document.getElementById('product-price').textContent = selectedProduct.price + '.000 VND';
    document.getElementById('amount-to-pay').textContent = selectedProduct.price;
    document.getElementById('payment-content').textContent = `NAP${currentUser.username}_${selectedProduct.price}000`;
    
    // Xử lý xác nhận thanh toán
    document.getElementById('confirm-payment').addEventListener('click', function() {
        // Tạo dữ liệu thanh toán
        const paymentData = {
            username: currentUser.username,
            email: currentUser.email,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            amount: selectedProduct.price + '000',
            paymentTime: new Date().toISOString(),
            status: 'pending'
        };
        
        // Gửi dữ liệu đến Google Sheets (sử dụng Google Apps Script)
        saveToGoogleSheet(paymentData);
    });
});

// Hàm gửi dữ liệu đến Google Sheets
function saveToGoogleSheet(paymentData) {
    // Thay thế URL này bằng URL triển khai Google Apps Script của bạn
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzP4gegtvVA7E6BBvB5EOJSvt2Nu1JTt76zyTVEuWtJr4cNlWmiBkKpxeyBOwZsW1wn/exec';
    
    axios.post(scriptUrl, paymentData)
        .then(response => {
            alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
            window.location.href = 'shop.html';
        })
        .catch(error => {
            console.error('Lỗi khi lưu dữ liệu:', error);
            alert('Có lỗi xảy ra khi lưu thông tin thanh toán. Vui lòng thử lại.');
        });
}
