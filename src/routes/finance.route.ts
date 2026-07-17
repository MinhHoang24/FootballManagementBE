import { Router } from "express";
import FinanceController from "../controllers/finance.controller";
import authMiddleware from "../middlewares/auth.middleware";

const financeRoutes = Router();

/**
 * Public APIs
 */

// Tổng quan quỹ
financeRoutes.get(
    "/summary",
    FinanceController.getSummary
);

// Danh sách đóng quỹ
financeRoutes.get(
    "/contributions",
    FinanceController.getContributions
);

// Danh sách giao dịch
financeRoutes.get(
    "/transactions",
    FinanceController.getTransactions
);

/**
 * Admin APIs
 */

// Khởi tạo tháng mới
financeRoutes.post(
    "/contributions/init",
    authMiddleware,
    FinanceController.initMonth
);

// Đóng quỹ
financeRoutes.patch<{ id: string }>(
    "/contributions/:id/pay",
    authMiddleware,
    FinanceController.payContribution
);

// Hủy đóng
financeRoutes.patch<{ id: string }>(
    "/contributions/:id/unpay",
    authMiddleware,
    FinanceController.unpayContribution
);

// Nghỉ
financeRoutes.patch<{ id: string }>(
    "/contributions/:id/excuse",
    authMiddleware,
    FinanceController.excuseContribution
);

// Thêm khoản chi
financeRoutes.post(
    "/transactions",
    authMiddleware,
    FinanceController.createExpense
);

// Sửa khoản chi
financeRoutes.patch<{ id: string }>(
    "/transactions/:id",
    authMiddleware,
    FinanceController.updateExpense
);

// Xóa khoản chi
financeRoutes.delete<{ id: string }>(
    "/transactions/:id",
    authMiddleware,
    FinanceController.deleteExpense
);

export default financeRoutes;