document.addEventListener('DOMContentLoaded', async function() {
    // 1. Lấy thông tin từ session
    const product = JSON.parse(sessionStorage.getItem('selectedProduct'));
    const user = JSON.parse(sessionStorage.getItem('currentUser')) || { 
        username: 'KH' + Math.floor(1000 + Math.random() * 9000) 
    };

    if (!product) {
        alert('Vui lòng chọn gói dịch vụ trước');
        window.location.href = 'shop.html';
        return;
    }

    // 2. Tạo nội dung chuyển khoản VietQR (8 số)
    const paymentCode = 'NAP' + Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
    
    // 3. Cập nhật giao diện
    document.getElementById('product-display').innerHTML = `
        <h2 style="color: #333;">${product.name}</h2>
        <p style="font-size: 18px; color: #1a73e8; font-weight: bold;">
            ${product.price.toLocaleString('vi-VN')} VND
        </p>
    `;
    
    document.getElementById('payment-amount').textContent = product.price.toLocaleString('vi-VN');
    document.getElementById('payment-content').textContent = paymentCode;

    // 4. Tạo QR theo chuẩn VietQR ACB
    const qrData = generateACBVietQR(
        '68686868',           // Số tài khoản ACB
        'CONG TY ABC',        // Tên tài khoản
        product.price,        // Số tiền
        paymentCode,          // Nội dung
        user.username         // Tên người gửi
    );

    try {
        await QRCode.toCanvas(document.getElementById('qrCanvas'), qrData, {
            width: 260,
            margin: 2,
            color: {
                dark: '#1a237e',  // Màu đặc trưng ACB
                light: '#ffffff'
            }
        });
    } catch (err) {
        console.error('Lỗi tạo QR:', err);
        alert('Không thể tạo mã QR, vui lòng tải lại trang');
    }

    // 5. Xử lý xác nhận thanh toán
    document.getElementById('confirm-payment').addEventListener('click', async function() {
        const paymentData = {
            username: user.username,
            product: product.name,
            amount: product.price,
            payment_code: paymentCode,
            bank: 'ACB',
            account: '68686868',
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
                method: 'POST',
                body: JSON.stringify(paymentData),
                headers: { 'Content-Type': 'text/plain' }
            });
            
            const result = await response.json();
            if (result.success) {
                alert('✅ Thanh toán thành công! Kiểm tra email để xác nhận.');
                window.location.href = 'shop.html';
            } else {
                throw new Error(result.message || 'Lỗi hệ thống');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('❌ Lỗi: ' + error.message);
        }
    });
});

// Hàm tạo QR theo chuẩn VietQR của ACB
function generateACBVietQR(account, accountName, amount, content, customerName) {
    return `https://api.acb.com.vn/vietqr?
        accountNumber=${encodeURIComponent(account)}&
        accountName=${encodeURIComponent(accountName)}&
        amount=${amount}&
        content=${encodeURIComponent(content)}&
        customer=${encodeURIComponent(customerName)}&
        bankCode=ACB&
        template=compact`
        .replace(/\s+/g, ''); // Xóa khoảng trắng
}
