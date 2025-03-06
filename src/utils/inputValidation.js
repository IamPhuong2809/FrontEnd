import { toast } from 'react-hot-toast';

/**
 * @param {Event} e - Event tkhi nhập Input.
 * @param {number} index - Thứ tự phần tử input nhập.
 * @param {number} JointInput - Biến lưu trữ dữ liệu input.
 * @param {Function} - Hàm thay đổi biến lưu trữ.
 * @param {Array} limit - Min-max của Input.
 */

export const handleInputChange = (e, index, JointInput, setJointInput, limit) => {
    const regex = /^[+-]?\d*\.?\d{0,2}$/;
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    // Nếu giá trị không khớp với regex, không cập nhật và đặt lại con trỏ.
    if (!regex.test(value)) {
        requestAnimationFrame(() => {
            e.target.selectionStart = cursorPosition - 1;
            e.target.selectionEnd = cursorPosition - 1;
        });
        return;
    }

    // Chuyển đổi chuỗi sang số
    let numericValue = parseFloat(value);
    const [min, max] = limit;

    // Nếu giá trị số không hợp lệ (vượt ngoài giới hạn), không cập nhật state
    if (!isNaN(numericValue) && (numericValue < min || numericValue > max)) {
        toast.error(`Giá trị phải nằm trong khoảng từ ${min} đến ${max}`,{
            style: { background: '#ebc8c9', color: '#000'}
        });
        return;
    }

    // Nếu hợp lệ, cập nhật state một lần
    const newJointInput = [...JointInput];
    newJointInput[index].input = value;
    setJointInput(newJointInput);
};