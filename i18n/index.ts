import * as Localization from "expo-localization";
import i18n from "i18next";
import "intl-pluralrules";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        clean_gallery: "Clean Gallery",
        review: "Review",
        delete: "DELETE",
        keep: "KEEP",
        back: "Back",
        cancel: "Cancel",
        delete_action: "Delete",
        success: "Success",
        ok: "OK",
      },
      home: {
        title: "Clean Gallery",
        review_button: "Review ({{count}})",
        no_photos: "No photos to show",
      },
      confirmation: {
        title: "Review Deletions",
        no_photos: "No photos marked for deletion.",
        selected_count: "{{count}} photos selected",
        delete_button: "Confirm Delete",
        deleting_button: "Deleting...",
        alert: {
          title: "Confirm Deletion",
          message:
            "Are you sure you want to delete {{count}} photos? This action cannot be undone.",
        },
        success_message: "Photos deleted successfully",
        keep: "KEEP",
      },
      permissions: {
        required: "Permission Required",
        message: "Please enable photo access in settings to use this app.",
        open_settings: "Open Settings",
      },
      errors: {
        delete_failed: "Delete Failed",
        delete_failed_message: "Could not delete photos.",
      },
      purchase: {
        not_available_title: "Not Available",
        iap_ios_only: "In-app purchases are only available on iOS.",
        restore_ios_only: "Restore purchases is only available on iOS.",
        success_title: "Success!",
        purchase_success_message: "Thank you for upgrading to Premium!",
        restore_success_message: "Your purchases have been restored.",
        no_purchases_title: "No Purchases Found",
        no_purchases_message: "You have no previous purchases to restore.",
        purchase_failed_title: "Purchase Failed",
        restore_failed_title: "Restore Failed",
        restore_failed_message:
          "Could not restore your purchases. Please try again.",
        purchase_cancelled: "Purchase cancelled",
        product_unavailable:
          "Product not available. Please check configuration.",
        default_error: "Please try again later.",
      },
    },
  },
  "zh-TW": {
    translation: {
      common: {
        clean_gallery: "清理相簿",
        review: "檢視",
        delete: "刪除",
        keep: "保留",
        back: "返回",
        cancel: "取消",
        delete_action: "刪除",
        success: "成功",
        ok: "確定",
      },
      home: {
        title: "清理相簿",
        review_button: "檢視 ({{count}})",
        no_photos: "沒有照片",
      },
      confirmation: {
        title: "檢視刪除項目",
        no_photos: "沒有標記要刪除的照片。",
        selected_count: "已選擇 {{count}} 張照片",
        delete_button: "確認刪除",
        deleting_button: "刪除中...",
        alert: {
          title: "確認刪除",
          message: "確定要刪除 {{count}} 張照片嗎？此動作無法復原。",
        },
        success_message: "照片已成功刪除",
        keep: "保留",
      },
      permissions: {
        required: "需要權限",
        message: "請在設定中允許存取相簿以使用此應用程式。",
        open_settings: "開啟設定",
      },
      errors: {
        delete_failed: "刪除失敗",
        delete_failed_message: "無法刪除照片。",
      },
      purchase: {
        not_available_title: "無法使用",
        iap_ios_only: "應用程式內購買僅適用於 iOS。",
        restore_ios_only: "恢復購買僅適用於 iOS。",
        success_title: "成功！",
        purchase_success_message: "感謝您升級至進階版！",
        restore_success_message: "您的購買已恢復。",
        no_purchases_title: "未發現購買",
        no_purchases_message: "您沒有可恢復的購買紀錄。",
        purchase_failed_title: "購買失敗",
        restore_failed_title: "恢復失敗",
        restore_failed_message: "無法恢復您的購買。請再試一次。",
        purchase_cancelled: "購買已取消",
        product_unavailable: "產品無法使用。請檢查設定。",
        default_error: "請稍後再試。",
      },
    },
  },
  "zh-CN": {
    translation: {
      common: {
        clean_gallery: "清理相册",
        review: "查看",
        delete: "删除",
        keep: "保留",
        back: "返回",
        cancel: "取消",
        delete_action: "删除",
        success: "成功",
        ok: "确定",
      },
      home: {
        title: "清理相册",
        review_button: "查看 ({{count}})",
        no_photos: "没有照片",
      },
      confirmation: {
        title: "查看删除项目",
        no_photos: "没有标记要删除的照片。",
        selected_count: "已选择 {{count}} 张照片",
        delete_button: "确认删除",
        deleting_button: "删除中...",
        alert: {
          title: "确认删除",
          message: "确定要删除 {{count}} 张照片吗？此操作无法撤销。",
        },
        success_message: "照片已成功删除",
        keep: "保留",
      },
      permissions: {
        required: "需要权限",
        message: "请在设置中允许访问相册以使用此应用程序。",
        open_settings: "打开设置",
      },
      errors: {
        delete_failed: "删除失败",
        delete_failed_message: "无法删除照片。",
      },
      purchase: {
        not_available_title: "无法使用",
        iap_ios_only: "应用内购买仅适用于 iOS。",
        restore_ios_only: "恢复购买仅适用于 iOS。",
        success_title: "成功！",
        purchase_success_message: "感谢您升级至高级版！",
        restore_success_message: "您的购买已恢复。",
        no_purchases_title: "未发现购买",
        no_purchases_message: "您没有可恢复的购买记录。",
        purchase_failed_title: "购买失败",
        restore_failed_title: "恢复失败",
        restore_failed_message: "无法恢复您的购买。请重试。",
        purchase_cancelled: "购买已取消",
        product_unavailable: "产品无法使用。请检查配置。",
        default_error: "请稍后重试。",
      },
    },
  },
  vi: {
    translation: {
      common: {
        clean_gallery: "Dọn dẹp thư viện",
        review: "Xem lại",
        delete: "XÓA",
        keep: "GIỮ",
        back: "Quay lại",
        cancel: "Hủy",
        delete_action: "Xóa",
        success: "Thành công",
        ok: "OK",
      },
      home: {
        title: "Dọn dẹp thư viện",
        review_button: "Xem lại ({{count}})",
        no_photos: "Không có ảnh nào",
      },
      confirmation: {
        title: "Xem lại mục xóa",
        no_photos: "Không có ảnh nào được đánh dấu để xóa.",
        selected_count: "{{count}} ảnh đã chọn",
        delete_button: "Xác nhận xóa",
        deleting_button: "Đang xóa...",
        alert: {
          title: "Xác nhận xóa",
          message:
            "Bạn có chắc chắn muốn xóa {{count}} ảnh không? Hành động này không thể hoàn tác.",
        },
        success_message: "Ảnh đã được xóa thành công",
        keep: "GIỮ",
      },
      permissions: {
        required: "Yêu cầu quyền",
        message:
          "Vui lòng bật quyền truy cập ảnh trong cài đặt để sử dụng ứng dụng này.",
        open_settings: "Mở cài đặt",
      },
      errors: {
        delete_failed: "Xóa thất bại",
        delete_failed_message: "Không thể xóa ảnh.",
      },
      purchase: {
        not_available_title: "Không khả dụng",
        iap_ios_only: "Mua hàng trong ứng dụng chỉ có sẵn trên iOS.",
        restore_ios_only: "Khôi phục mua hàng chỉ có sẵn trên iOS.",
        success_title: "Thành công!",
        purchase_success_message: "Cảm ơn bạn đã nâng cấp lên Premium!",
        restore_success_message: "Các giao dịch mua của bạn đã được khôi phục.",
        no_purchases_title: "Không tìm thấy giao dịch mua",
        no_purchases_message:
          "Bạn không có giao dịch mua nào trước đó để khôi phục.",
        purchase_failed_title: "Mua hàng thất bại",
        restore_failed_title: "Khôi phục thất bại",
        restore_failed_message:
          "Không thể khôi phục giao dịch mua của bạn. Vui lòng thử lại.",
        purchase_cancelled: "Đã hủy mua hàng",
        product_unavailable:
          "Sản phẩm không có sẵn. Vui lòng kiểm tra cấu hình.",
        default_error: "Vui lòng thử lại sau.",
      },
    },
  },
  th: {
    translation: {
      common: {
        clean_gallery: "ล้างแกลเลอรี",
        review: "ตรวจสอบ",
        delete: "ลบ",
        keep: "เก็บ",
        back: "กลับ",
        cancel: "ยกเลิก",
        delete_action: "ลบ",
        success: "สำเร็จ",
        ok: "ตกลง",
      },
      home: {
        title: "ล้างแกลเลอรี",
        review_button: "ตรวจสอบ ({{count}})",
        no_photos: "ไม่มีรูปภาพ",
      },
      confirmation: {
        title: "ตรวจสอบการลบ",
        no_photos: "ไม่มีรูปภาพที่ทำเครื่องหมายเพื่อลบ",
        selected_count: "เลือก {{count}} รูป",
        delete_button: "ยืนยันการลบ",
        deleting_button: "กำลังลบ...",
        alert: {
          title: "ยืนยันการลบ",
          message:
            "คุณแน่ใจหรือไม่ว่าต้องการลบ {{count}} รูป? การกระทำนี้ไม่สามารถยกเลิกได้",
        },
        success_message: "ลบรูปภาพเรียบร้อยแล้ว",
        keep: "เก็บ",
      },
      permissions: {
        required: "ต้องการสิทธิ์",
        message: "โปรดเปิดการเข้าถึงรูปภาพในการตั้งค่าเพื่อใช้แอปนี้",
        open_settings: "เปิดการตั้งค่า",
      },
      errors: {
        delete_failed: "การลบ้มเหลว",
        delete_failed_message: "ไม่สามารถลบรูปภาพได้",
      },
      purchase: {
        not_available_title: "ไม่สามารถใช้งานได้",
        iap_ios_only: "การซื้อภายในแอพใช้ได้เฉพาะบน iOS เท่านั้น",
        restore_ios_only: "การกู้คืนการซื้อใช้ได้เฉพาะบน iOS เท่านั้น",
        success_title: "สำเร็จ!",
        purchase_success_message: "ขอบคุณที่อัปเกรดเป็นพรีเมียม!",
        restore_success_message: "การซื้อของคุณได้รับการกู้คืนแล้ว",
        no_purchases_title: "ไม่พบการซื้อ",
        no_purchases_message: "คุณไม่มีการซื้อก่อนหน้านี้ให้กู้คืน",
        purchase_failed_title: "การซื้อล้มเหลว",
        restore_failed_title: "การกู้คืนล้มเหลว",
        restore_failed_message:
          "ไม่สามารถกู้คืนการซื้อของคุณได้ โปรดลองอีกครั้ง",
        purchase_cancelled: "ยกเลิกการซื้อแล้ว",
        product_unavailable: "ไม่มีสินค้า โปรดตรวจสอบการกำหนดค่า",
        default_error: "โปรดลองอีกครั้งในภายหลัง",
      },
    },
  },
  id: {
    translation: {
      common: {
        clean_gallery: "Bersihkan Galeri",
        review: "Tinjau",
        delete: "HAPUS",
        keep: "SIMPAN",
        back: "Kembali",
        cancel: "Batal",
        delete_action: "Hapus",
        success: "Berhasil",
        ok: "OK",
      },
      home: {
        title: "Bersihkan Galeri",
        review_button: "Tinjau ({{count}})",
        no_photos: "Tidak ada foto",
      },
      confirmation: {
        title: "Tinjau Penghapusan",
        no_photos: "Tidak ada foto yang ditandai untuk dihapus.",
        selected_count: "{{count}} foto dipilih",
        delete_button: "Konfirmasi Hapus",
        deleting_button: "Menghapus...",
        alert: {
          title: "Konfirmasi Hapus",
          message:
            "Apakah Anda yakin ingin menghapus {{count}} foto? Tindakan ini tidak dapat dibatalkan.",
        },
        success_message: "Foto berhasil dihapus",
        keep: "SIMPAN",
      },
      permissions: {
        required: "Izin Diperlukan",
        message:
          "Harap aktifkan akses foto di pengaturan untuk menggunakan aplikasi ini.",
        open_settings: "Buka Pengaturan",
      },
      errors: {
        delete_failed: "Gagal Menghapus",
        delete_failed_message: "Tidak dapat menghapus foto.",
      },
      purchase: {
        not_available_title: "Tidak Tersedia",
        iap_ios_only: "Pembelian dalam aplikasi hanya tersedia di iOS.",
        restore_ios_only: "Pemulihan pembelian hanya tersedia di iOS.",
        success_title: "Berhasil!",
        purchase_success_message: "Terima kasih telah meningkatkan ke Premium!",
        restore_success_message: "Pembelian Anda telah dipulihkan.",
        no_purchases_title: "Pembelian Tidak Ditemukan",
        no_purchases_message:
          "Anda tidak memiliki pembelian sebelumnya untuk dipulihkan.",
        purchase_failed_title: "Pembelian Gagal",
        restore_failed_title: "Pemulihan Gagal",
        restore_failed_message:
          "Tidak dapat memulihkan pembelian Anda. Silakan coba lagi.",
        purchase_cancelled: "Pembelian dibatalkan",
        product_unavailable:
          "Produk tidak tersedia. Silakan periksa konfigurasi.",
        default_error: "Silakan coba lagi nanti.",
      },
    },
  },
};

const getLocales = () => {
  // Expo Localization returns an array of locales
  const locales = Localization.getLocales();
  return locales && locales.length > 0 ? locales[0].languageTag : "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLocales(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
